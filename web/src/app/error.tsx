"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/context";
import { Button, ButtonLink, Card } from "@/components/ui";

// Without this file any thrown error fell through to Next's own English crash
// page — no header, no Arabic, no way back.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <Card className="p-8 text-center">
        <div className="mb-3 text-4xl">⚠️</div>
        <h1 className="mb-2 text-xl font-bold">{t.errors.title}</h1>
        <p className="mb-6 leading-relaxed text-fg-muted">{t.errors.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>{t.errors.retry}</Button>
          <ButtonLink href="/" variant="outline">
            {t.errors.home}
          </ButtonLink>
        </div>
        {error.digest && (
          <p dir="ltr" className="mt-4 text-[10px] text-fg-faint">
            {error.digest}
          </p>
        )}
      </Card>
    </div>
  );
}
