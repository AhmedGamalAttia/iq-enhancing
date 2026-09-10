"use client";

// Last resort: the root layout itself failed, so there is no provider, no theme
// and no header to lean on. Everything here is self-contained and bilingual.
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0c14",
          color: "#eef0f7",
          fontFamily: "system-ui, sans-serif",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h1 style={{ fontSize: 20, margin: "0.5rem 0" }}>حصل خطأ غير متوقّع</h1>
          <p style={{ color: "#a2a7c4", lineHeight: 1.7, margin: "0 0 1.5rem" }}>
            معلش، حاجة وقعت عندنا. جرّب تاني.
            <br />
            <span dir="ltr">Something went wrong. Please try again.</span>
          </p>
          <button
            onClick={reset}
            style={{
              background: "#5344e6",
              color: "#fff",
              border: 0,
              borderRadius: 12,
              padding: "0.75rem 1.5rem",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            حاول تاني / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
