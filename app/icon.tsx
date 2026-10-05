import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the wordmark's initial on ink, with the accent dot. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          color: "#EDEDEA",
          borderRadius: 14,
          fontSize: 44,
          fontWeight: 700,
          fontFamily: "monospace",
          letterSpacing: "-0.04em",
        }}
      >
        {site.name.slice(0, 1)}
        <span style={{ color: "#c8f751" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
