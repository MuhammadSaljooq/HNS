import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.fullName} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B0B0C",
          color: "#EDEDEA",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34 }}>
          <span style={{ letterSpacing: "-0.03em" }}>HN</span>
          <span style={{ color: "#c8f751", letterSpacing: "-0.03em" }}>S</span>
          <span
            style={{
              marginLeft: 24,
              fontSize: 18,
              letterSpacing: "0.2em",
              color: "rgba(237,237,234,0.55)",
            }}
          >
            [ {site.tagline.toUpperCase()} ]
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 96,
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
          }}
        >
          <span>Never miss</span>
          <span>
            a follow-up<span style={{ color: "#c8f751" }}>.</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(237,237,234,0.7)",
            maxWidth: 900,
          }}
        >
          AI reminder agent + built-in CRM. Set it once; it never forgets.
        </div>
      </div>
    ),
    { ...size },
  );
}
