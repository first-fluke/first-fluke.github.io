/**
 * GitHub App 인증 모듈
 *
 * 역할:
 *   1. GH_APP_PRIVATE_KEY(PKCS#8 PEM) + GH_APP_ID 로 JWT 서명 (jose 사용)
 *   2. JWT → installation access token 교환
 *   3. TOKEN_CACHE KV에 token 캐시 (TTL 3000s = 50분)
 *   4. installation token 으로 GitHub Issue 생성
 *
 * 주의: 이 모듈에서 직접 WebCrypto RSA 서명 코드를 작성하지 않는다.
 * 비즈니스 로직(재시도, dead-letter)은 호출자(T-12)가 담당한다.
 */

import { importPKCS8, SignJWT } from "jose";
import type { Env } from "./env";

// ─── 상수 ────────────────────────────────────────────────────────────────────

const GH_API_BASE = "https://api.github.com";
const USER_AGENT = "firstfluke-contact-worker";
const ACCEPT_HEADER = "application/vnd.github+json";

/** KV 캐시 TTL(초): GitHub installation token 수명 3600s에서 10분 여유 */
const TOKEN_CACHE_TTL_SECONDS = 3000;

// ─── 내부 유틸 ────────────────────────────────────────────────────────────────

/**
 * GitHub App JWT를 생성한다.
 * - iat: now-60s (시계 오차 보정)
 * - exp: now+540s (최대 10분, GitHub 허용 상한)
 *
 * PKCS#1 PEM을 넣으면 importPKCS8가 예외를 던지므로
 * 명확한 변환 힌트 메시지와 함께 재던진다.
 */
async function makeJwt(appId: string, privateKeyPem: string): Promise<string> {
  let privateKey: Awaited<ReturnType<typeof importPKCS8>>;

  try {
    privateKey = await importPKCS8(privateKeyPem, "RS256");
  } catch (cause) {
    throw new Error(
      "GH_APP_PRIVATE_KEY must be PKCS#8 PEM. Convert with: " +
        "openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in app.pem -out app.pkcs8.pem",
      { cause },
    );
  }

  const nowSec = Math.floor(Date.now() / 1000);

  return new SignJWT({ iss: appId })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt(nowSec - 60)
    .setExpirationTime(nowSec + 540)
    .sign(privateKey);
}

/**
 * GitHub API에서 installation access token을 새로 발급받는다.
 * JWT 생성 및 교환까지 포함.
 */
async function fetchInstallationToken(
  env: Env,
  installationId: string,
): Promise<string> {
  const jwt = await makeJwt(env.GH_APP_ID, env.GH_APP_PRIVATE_KEY);

  const res = await fetch(
    `${GH_API_BASE}/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: ACCEPT_HEADER,
        "User-Agent": USER_AGENT,
      },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `installation token 발급 실패 [${res.status}]: ${body}`,
    );
  }

  const json = (await res.json()) as { token: string; expires_at: string };
  return json.token;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * KV 캐시를 우선 확인하고, 유효한 token이 있으면 재사용한다.
 * 캐시 미스 또는 만료 시 새 token을 발급하고 캐시에 저장한다.
 */
export async function getInstallationToken(
  env: Env,
  installationId: string,
): Promise<string> {
  const cacheKey = `installation:${installationId}`;

  // 캐시 히트 시 즉시 반환 (KV TTL이 만료되면 null 반환)
  const cached = await env.TOKEN_CACHE.get(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // 캐시 미스: 새 token 발급
  const token = await fetchInstallationToken(env, installationId);

  // KV에 저장 (토큰 값은 로그에 남기지 않음)
  await env.TOKEN_CACHE.put(cacheKey, token, {
    expirationTtl: TOKEN_CACHE_TTL_SECONDS,
  });

  return token;
}

/**
 * GitHub Issue를 생성한다.
 * 401 응답 시 KV 캐시를 무효화하여 다음 호출에서 fresh token을 사용하도록 한다.
 * 4xx/5xx는 ok: false로 반환하며, 재시도/dead-letter 처리는 호출자(T-12)가 담당한다.
 */
export async function createIssue(
  env: Env,
  args: {
    installationId: string;
    repo: string;
    title: string;
    body: string;
    labels?: string[];
  },
): Promise<{ ok: true; url: string } | { ok: false; status: number; error: string }> {
  const installationToken = await getInstallationToken(env, args.installationId);

  const res = await fetch(`${GH_API_BASE}/repos/${args.repo}/issues`, {
    method: "POST",
    headers: {
      Authorization: `token ${installationToken}`,
      Accept: ACCEPT_HEADER,
      "User-Agent": USER_AGENT,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: args.title,
      body: args.body,
      labels: args.labels,
    }),
  });

  if (!res.ok) {
    // 401: token이 유효하지 않으므로 캐시 무효화
    if (res.status === 401) {
      const cacheKey = `installation:${args.installationId}`;
      await env.TOKEN_CACHE.delete(cacheKey);
    }

    const errorText = await res.text().catch(() => res.statusText);
    return { ok: false, status: res.status, error: errorText };
  }

  const issue = (await res.json()) as { html_url: string };
  return { ok: true, url: issue.html_url };
}
