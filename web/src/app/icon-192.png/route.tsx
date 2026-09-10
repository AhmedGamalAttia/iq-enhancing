import { ImageResponse } from "next/og";

// Real PNG icons without adding a rasterizer dependency: rendered once at build
// time and served from a stable URL the manifest can point at. An SVG-only icon
// set is why the install prompt never treated this as a real app.
export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(<Mark />, { width: 192, height: 192 });
}

/**
 * Built from plain boxes, no glyph. `ImageResponse` has no font of its own, so
 * any character outside the basic Latin set (the ⌘ this used to draw) triggers a
 * font download that fails at build time and leaves a blank tile.
 *
 * The motif is the product itself: a 2×2 of the shapes the abstract items are
 * made of, with the fourth cell missing — the puzzle every player solves.
 */
export function Mark() {
  const cell = "35%";
  const gap = "6%";
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6455f5 0%, #2dd4bf 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "76%",
          height: "76%",
          gap,
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        {/* filled circle */}
        <div
          style={{
            display: "flex",
            width: cell,
            height: cell,
            borderRadius: "50%",
            background: "#ffffff",
          }}
        />
        {/* outlined square */}
        <div
          style={{
            display: "flex",
            width: cell,
            height: cell,
            border: "9px solid #ffffff",
            borderRadius: "12%",
          }}
        />
        {/* filled triangle */}
        <div
          style={{
            display: "flex",
            width: 0,
            height: 0,
            borderLeft: "32px solid transparent",
            borderRight: "32px solid transparent",
            borderBottom: "58px solid #ffffff",
          }}
        />
        {/* the missing cell */}
        <div
          style={{
            display: "flex",
            width: cell,
            height: cell,
            border: "8px dashed rgba(255,255,255,0.75)",
            borderRadius: "12%",
          }}
        />
      </div>
    </div>
  );
}
