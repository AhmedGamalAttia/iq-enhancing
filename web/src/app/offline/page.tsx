import type { Metadata } from "next";

// Served by the service worker when a navigation fails. It must not depend on
// the i18n provider or any data, so it is static and bilingual.
export const metadata: Metadata = {
  title: "بدون اتصال · Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center md:px-6">
      <div className="mb-4 text-5xl">📡</div>
      <h1 className="mb-3 text-xl font-bold">أنت غير متصل بالإنترنت</h1>
      <p className="mb-6 leading-relaxed text-fg-muted">
        الصفحة دي محتاجة اتصال. تقدّمك المحفوظ على الجهاز لسه موجود، وهيتزامن
        أول ما الاتصال يرجع.
      </p>
      <p dir="ltr" className="leading-relaxed text-fg-muted">
        You are offline. Progress saved on this device is safe and will sync
        once you reconnect.
      </p>
    </div>
  );
}
