"use client";

import { SKILL_LIST } from "@/data/skills";
import { useEffect } from "react";
import { useI18n } from "@/i18n/context";
import { track } from "@/lib/analytics";
import { HonestyNote } from "@/components/honesty-note";
import { Badge, ButtonLink, Card } from "@/components/ui";

export default function Home() {
  const { t, locale } = useI18n();
  const h = t.home;

  useEffect(() => track("home_view", locale), [locale]);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      {/* Hero */}
      <section className="py-16 text-center md:py-24">
        <Badge tone="brand" className="animate-rise">
          {h.heroBadge}
        </Badge>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          {h.heroTitle1}
          <br />
          <span className="bg-gradient-to-l from-brand to-accent bg-clip-text text-transparent">
            {h.heroTitle2}
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted">
          {h.heroSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/journey" size="lg">
            {h.ctaStart}
          </ButtonLink>
          <ButtonLink href="/practice" variant="outline" size="lg">
            {h.ctaPractice}
          </ButtonLink>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10">
        <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
          {h.howTitle}
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {h.steps.map((s, i) => (
            <Card key={i} className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-2xl">
                  {s.icon}
                </span>
                <span className="text-sm font-bold text-brand-ink">
                  {h.stepLabel(String(i + 1))}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
              <p className="leading-relaxed text-fg-muted">{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Dimensions */}
      <section className="py-10">
        <h2 className="mb-2 text-center text-2xl font-bold md:text-3xl">
          {h.dimsTitle}
        </h2>
        <p className="mb-8 text-center text-fg-muted">{h.dimsSubtitle}</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_LIST.map((s) => {
            const meta = t.skills[s.key];
            return (
              <Card key={s.key} className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <h3 className="text-lg font-bold">{meta.name}</h3>
                    <p className="text-xs text-fg-faint">{meta.tagline}</p>
                  </div>
                </div>
                <p className="leading-relaxed text-fg-muted">{meta.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Principles */}
      <section className="py-10">
        <Card className="p-8">
          <h2 className="mb-6 text-center text-2xl font-bold">
            {h.principlesTitle}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {h.principles.map((p) => (
              <div key={p.t} className="flex gap-3">
                <span className="mt-1 text-accent">◆</span>
                <div>
                  <h3 className="font-bold">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-fg-muted">{p.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* The limits of the claim, next to the claim itself. */}
          <HonestyNote variant="full" className="mt-6" />
        </Card>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">{h.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-fg-muted">{h.ctaSubtitle}</p>
        <div className="mt-6">
          <ButtonLink href="/journey" size="lg">
            {h.ctaNow}
          </ButtonLink>
        </div>
      </section>

    </div>
  );
}
