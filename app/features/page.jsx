"use client";

import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import { useMemo, useState } from "react";
import { features } from "../lib/features";

export default function FeaturesPage() {
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const selectedFeature = useMemo(() => {
    return features.find((feature) => feature.id === selectedFeatureId) || null;
  }, [selectedFeatureId]);

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-16">
        <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Feature directory</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Explore what NomadPoint can do.
            </h1>
          </div>

          <Card className="rounded-[24px] border border-[#233b57] bg-[#0e1e32] p-5 text-white sm:p-6">
            <p className="text-base leading-7 text-[#a9c2d9]">
              These features turn country records, account data, and profile preferences
              into a guided relocation decision flow. Select any feature to view its
              current build status and detail.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Stat value={features.length} label="features" />
              <Stat value={features.filter((feature) => feature.progress === "Implemented").length} label="implemented" />
              <Stat value="1" label="new recommender" />
            </div>
          </Card>
        </div>

        <div className="mt-9 grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              type="button"
              onClick={() => setSelectedFeatureId(feature.id)}
              className="group h-full min-w-0 rounded-[24px] text-left"
            >
              <Card className="flex h-full min-h-[310px] min-w-0 overflow-hidden rounded-[24px] border border-[#233b57] bg-[linear-gradient(145deg,rgba(20,39,64,.95),rgba(11,26,44,.92))] text-white shadow-[0_24px_70px_rgba(0,0,0,.24)] group-hover:-translate-y-2 group-hover:border-[#36d7ff]/70">
                <div className={`h-3 ${getAccent(feature.number)}`} />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">
                      FEATURE {feature.number}
                    </Chip>
                    <Chip color={getProgressColor(feature.progress)} variant="flat" className="bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">
                      {feature.progress}
                    </Chip>
                  </div>

                  <h2 className="mt-5 break-words text-2xl font-black leading-tight">
                    {feature.title}
                  </h2>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#59748e]">
                    {feature.category}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-6 text-[#a9c2d9]">
                    {feature.summary}
                  </p>
                  <span className="mt-6 inline-flex w-full justify-center rounded-2xl bg-[#36d7ff] px-4 py-3 text-sm font-black text-[#06111f] group-hover:bg-[#a3ff6f]">
                    View feature data
                  </span>
                </div>
              </Card>
            </button>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">Need matching results?</p>
              <h2 className="mt-2 text-2xl font-black">Build your profile to personalize the recommender.</h2>
            </div>
            <Button
              as={Link}
              href="/profile"
              className="rounded-2xl bg-[#a3ff6f] px-5 py-4 font-black text-[#06111f] hover:bg-[#36d7ff]"
            >
              Edit profile
            </Button>
          </div>
        </div>
      </section>

      {selectedFeature ? (
        <FeatureModal feature={selectedFeature} onClose={() => setSelectedFeatureId(null)} />
      ) : null}
    </main>
  );
}

function FeatureModal({ feature, onClose }) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-[#02070d]/80 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true">
      <Card className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[#36d7ff]/40 bg-[#0e1e32] p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,.45)] sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">
              FEATURE {feature.number}
            </Chip>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{feature.title}</h2>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#59748e]">{feature.category}</p>
          </div>
          <Button
            type="button"
            onPress={onClose}
            className="h-11 rounded-full border border-[#233b57] bg-[#07111f] px-5 text-sm font-black text-[#d8eaff] hover:border-[#36d7ff]"
          >
            Close
          </Button>
        </div>

        <p className="mt-6 text-base leading-7 text-[#c2d7e9]">{feature.description}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-[.8fr_1.2fr]">
          <div className="rounded-2xl border border-[#233b57] bg-[#07111f] p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-[#8fa8c2]">Build status</span>
            <strong className="mt-2 block text-2xl font-black text-[#a3ff6f]">{feature.progress}</strong>
          </div>
          <div className="rounded-2xl border border-[#233b57] bg-[#07111f] p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-[#8fa8c2]">User value</span>
            <strong className="mt-2 block text-base leading-7 text-[#eef7ff]">{feature.summary}</strong>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-black">Feature data</h3>
          <div className="mt-3 grid gap-3">
            {feature.highlights.map((highlight, index) => (
              <div key={highlight} className="grid gap-2 rounded-2xl border border-[#233b57] bg-[#07111f] p-4 sm:grid-cols-[auto_1fr] sm:items-start">
                <span className="grid size-9 place-items-center rounded-xl bg-[#36d7ff] text-sm font-black text-[#06111f]">
                  {index + 1}
                </span>
                <p className="text-sm font-semibold leading-6 text-[#c2d7e9]">{highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="min-w-[120px] rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-3">
      <strong className="block text-2xl font-black">{value}</strong>
      <span className="text-xs font-bold text-[#8fa8c2]">{label}</span>
    </div>
  );
}

function getAccent(number) {
  const accents = ["bg-[#36d7ff]", "bg-[#a3ff6f]", "bg-[#ff7896]"];
  return accents[(Number(number) - 1) % accents.length];
}

function getProgressColor(progress) {
  return progress === "Implemented" ? "success" : progress === "Planned" ? "warning" : "primary";
}
