/**
 * Cloudflare Turnstile siteverify 모듈
 *
 * NOTE: "grace skip" 경로(skipped: true)는 개발/스테이징 전용입니다.
 * 프로덕션 환경에서는 반드시 TURNSTILE_SECRET_KEY를 설정해야 합니다.
 * 시크릿 없이 배포하면 bot 방어가 완전히 비활성화됩니다.
 */

import type { Env } from "./env";

// 모듈 레벨에서 경고 중복 출력 방지 플래그
let _secretMissingWarned = false;

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileResult {
  ok: boolean;
  codes?: string[]; // 실패 시 Cloudflare가 반환하는 error-codes
  skipped?: boolean; // env.TURNSTILE_SECRET_KEY 부재 시 true (grace skip 모드)
}

/**
 * Cloudflare Turnstile 토큰을 검증합니다.
 *
 * @param env    - Worker 바인딩 (TURNSTILE_SECRET_KEY 포함)
 * @param token  - 클라이언트가 전송한 cf-turnstile-response 값
 * @param ip     - 선택적 방문자 IP (CF-Connecting-IP 헤더 권장)
 */
export async function verifyTurnstile(
  env: Env,
  token: string | undefined,
  ip: string | null,
): Promise<TurnstileResult> {
  // 1. 시크릿 키 없음 → grace skip (개발/스테이징 전용)
  if (!env.TURNSTILE_SECRET_KEY) {
    if (!_secretMissingWarned) {
      console.warn("[turnstile] siteverify key not configured — skipping verification");
      _secretMissingWarned = true;
    }
    return { ok: true, skipped: true };
  }

  // 2. 토큰 없음 (시크릿은 있는 경우)
  if (!token) {
    return { ok: false, codes: ["missing-input-response"] };
  }

  // 3. siteverify 호출
  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
  });

  // 방문자 IP가 있으면 remoteip 추가 (Cloudflare 권장)
  if (ip) {
    body.set("remoteip", ip);
  }

  try {
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    return {
      ok: data.success,
      codes: data["error-codes"],
    };
  } catch (err) {
    // 네트워크 오류 등 예외 처리 — 시크릿은 절대 로깅하지 않음
    console.error("[turnstile] siteverify failed:", err);
    return { ok: false, codes: ["internal-error"] };
  }
}
