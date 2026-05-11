import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "FIRST FLUKE — Make Your First Win";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #0f4c3a 0%, #1a6048 50%, #7ab94c 100%)",
          color: "#fafaf7",
          fontFamily: "system-ui, sans-serif",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Make Your First Win
          </div>
          <div
            style={{
              fontSize: 36,
              opacity: 0.9,
              lineHeight: 1.3,
            }}
          >
            AI와 기술로 더 나은 일상을 만드는 팀
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            opacity: 0.85,
          }}
        >
          <div style={{ display: "flex" }}>모두의 창업 2026 선정</div>
          <div style={{ display: "flex" }}>firstfluke.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
