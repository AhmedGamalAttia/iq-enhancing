"use client";

import { useI18n } from "@/i18n/context";
import { ButtonLink, Card } from "@/components/ui";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:px-6">
      <Card className="p-8 text-center">
        <div className="mb-3 text-4xl">🧭</div>
        <h1 className="mb-2 text-xl font-bold">{t.errors.notFoundTitle}</h1>
        <p className="mb-6 leading-relaxed text-fg-muted">
          {t.errors.notFoundBody}
        </p>
        <ButtonLink href="/">{t.errors.home}</ButtonLink>
      </Card>
    </div>
  );
}
