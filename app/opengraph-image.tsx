import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.fullName} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/nhs-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fcfdfa",
          color: "#0b0b0c",
          padding: "72px",
          fontFamily: "monospace",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={282} height={120} alt="" />

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
          <span style={{ display: "flex" }}>
            a&nbsp;
            <span style={{ background: "#c8f751", padding: "0 12px" }}>follow-up</span>
            <span style={{ color: "#4a6b00" }}>.</span>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#55574f",
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
