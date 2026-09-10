import { ImageResponse } from "next/og";

// A shared link used to render with no preview card at all. The artwork leans on
// the one part of the product that needs no language — the abstract shapes.
export const alt = "Cognitive Skills Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0b0c14";
const FG = "#eef0f7";
const BRAND = "#8475ff";
const ACCENT = "#2dd4bf";

/** Cairo covers Arabic; if the fetch fails we simply render the Latin line. */
async function loadArabicFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(3000) },
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+\.(?:ttf|woff2?))\)/)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) =>
      r.arrayBuffer(),
    );
  } catch {
    return null;
  }
}


/**
 * Satori shapes Arabic glyphs correctly but has no bidirectional layout: it
 * lays every word out left-to-right, so a right-to-left sentence comes out with
 * its words in reverse order. Reversing them here cancels that out.
 *
 * Only safe for pure-Arabic strings with no punctuation or Latin runs, which is
 * why the two lines below are written without commas.
 */
function rtl(text: string): string {
  return text.trim().split(/\s+/).reverse().join(" ");
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 132,
        height: 132,
        borderRadius: 22,
        background: "#1d2036",
      }}
    >
      {children}
    </div>
  );
}

export default async function Image() {
  const arabic = await loadArabicFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: `linear-gradient(135deg, ${BG} 0%, #141733 60%, #0f1b2a 100%)`,
          padding: 64,
          color: FG,
          fontFamily: arabic ? "Cairo" : "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* No glyph: ImageResponse ships no font, so anything outside basic
              Latin triggers a font download that can fail. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #6455f5 0%, #2dd4bf 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, fontWeight: 700 }}>
              Cognitive Skills Platform
            </div>
            {arabic && (
              <div style={{ fontSize: 30, color: "#a2a7c4" }}>
                {rtl("منصّة تنمية القدرات المعرفية")}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Tile>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: FG,
                display: "flex",
              }}
            />
          </Tile>
          <Tile>
            <div
              style={{
                width: 62,
                height: 62,
                border: `9px solid ${FG}`,
                borderRadius: 8,
                display: "flex",
              }}
            />
          </Tile>
          <Tile>
            {/* SVG, not the CSS-border triangle trick: Satori doesn't render
                zero-size bordered boxes and drew a plain square instead. */}
            <svg width="70" height="62" viewBox="0 0 70 62">
              <polygon points="35,2 68,60 2,60" fill={FG} />
            </svg>
          </Tile>
          <svg width="46" height="44" viewBox="0 0 46 44" style={{ margin: "0 8px" }}>
            <polygon points="4,10 30,10 30,2 44,22 30,42 30,34 4,34" fill="#6f7699" />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 132,
              height: 132,
              borderRadius: 22,
              background: "#1d2036",
              border: `4px dashed ${BRAND}`,
              color: BRAND,
              fontSize: 68,
              fontWeight: 700,
            }}
          >
            ?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 34, color: ACCENT }}>
            Evidence-based cognitive training — not a game
          </div>
          {arabic && (
            <div style={{ fontSize: 30, color: "#a2a7c4" }}>
              {rtl("تقييم تكيّفي وتدريب بالتكرار المتباعد وتحدٍّ يومي بلا لغة")}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: arabic
        ? [{ name: "Cairo", data: arabic, style: "normal", weight: 700 }]
        : [],
    },
  );
}
