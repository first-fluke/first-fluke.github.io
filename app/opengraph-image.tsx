import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FIRST FLUKE — Make Your First Win";

async function loadMascotDataUrl(): Promise<string> {
  const buf = await readFile(
    join(process.cwd(), "public", "firstfluke-mascot.png"),
  );
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export default async function OpengraphImage() {
  const mascotSrc = await loadMascotDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f4c3a 0%, #1a6048 55%, #7ab94c 100%)",
          color: "#fafaf7",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              letterSpacing: 4,
              opacity: 0.85,
            }}
          >
            FIRST FLUKE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                fontSize: 88,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              Make Your First Win
            </div>
            <div style={{ fontSize: 32, opacity: 0.9, lineHeight: 1.3 }}>
              AI와 기술로 더 나은 일상을 만드는 팀
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 22,
              opacity: 0.85,
            }}
          >
            <div style={{ display: "flex" }}>모두의 창업 2026 선정</div>
            <div style={{ display: "flex" }}>firstfluke.com</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 440,
            height: 440,
          }}
        >
          {/** biome-ignore lint/performance/noImgElement: ImageResponse only supports img */}
          <img
            src={mascotSrc}
            alt=""
            width={420}
            height={420}
            style={{
              objectFit: "cover",
              borderRadius: 210,
              background: "#fafaf7",
              boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );
}
