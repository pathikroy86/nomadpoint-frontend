"use client";

import Link from "next/link";
import { Button, Card, Chip, ProgressCircle, Slider } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "./lib/auth-client";
import { fetchCountries } from "./lib/countries";
import { features } from "./lib/features";
import { fetchProfile, recommendCountries } from "./lib/recommender";

export default function Home() {
  const [visaWeight, setVisaWeight] = useState(72);
  const [internetWeight, setInternetWeight] = useState(88);
  const [countries, setCountries] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [loadStatus, setLoadStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    async function loadCountries() {
      try {
        const [countryResult, profileResult] = await Promise.allSettled([
          fetchCountries(),
          fetchProfile(),
        ]);

        if (countryResult.status === "rejected") {
          throw countryResult.reason;
        }

        const nextCountries = countryResult.value;
        setCountries(nextCountries);
        setSelectedCountryId(nextCountries[0]?.id || "");
        setProfile(profileResult.status === "fulfilled" ? profileResult.value : null);
        setLoadStatus({ type: "ready", message: "" });
      } catch (error) {
        setLoadStatus({
          type: "error",
          message: error.message,
        });
      }
    }

    loadCountries();
  }, []);

  const rankedCountries = useMemo(() => {
    return recommendCountries(countries, profile, {
      visa: visaWeight,
      internet: internetWeight,
    });
  }, [countries, internetWeight, profile, visaWeight]);

  const selectedCountry =
    rankedCountries.find((country) => country.id === selectedCountryId) ||
    rankedCountries[0] ||
    null;
  const topCountry = rankedCountries[0] || null;
  const previewCountries = rankedCountries.slice(0, 6);
  const verifiedCountries = rankedCountries.filter((country) => country.verifiedOn).length;
  const visaRoutes = rankedCountries.filter((country) => country.hasVisaRoute).length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] font-sans text-[#eef7ff]">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_10%,rgba(54,215,255,.2),transparent_27%),radial-gradient(circle_at_14%_82%,rgba(163,255,111,.14),transparent_25%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-12 sm:px-6 md:pb-20 lg:grid-cols-[1fr_.92fr] lg:pb-28 lg:pt-16">
          <div>
            <div className="inline-flex rounded-full border border-[#233b57] bg-[#0e1e32]/80 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">
              Remote work country finder
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">
              Choose your next country with evidence, not guesswork.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9c2d9] sm:text-lg sm:leading-8">
              NomadPoint combines country data, internet adoption, remote-work
              visa availability, capitals, time zones, currencies, and verified
              source dates into one decision cockpit.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex justify-center rounded-2xl bg-[#36d7ff] px-6 py-4 text-center font-black text-[#06111f] shadow-[0_18px_45px_rgba(54,215,255,.25)] hover:-translate-y-1 hover:bg-[#a3ff6f]">
                Start planning
              </Link>
              <Link href="/login" className="inline-flex justify-center rounded-2xl border border-[#233b57] bg-[#0e1e32] px-6 py-4 text-center font-bold text-white hover:-translate-y-1 hover:border-[#36d7ff]">
                Open decision cockpit
              </Link>
            </div>
            <div className="mt-9 grid max-w-2xl grid-cols-1 gap-3 xs:grid-cols-3 sm:grid-cols-3">
              <Stat value={rankedCountries.length || "..."} label="countries loaded" />
              <Stat value={visaRoutes || "..."} label="visa routes" />
              <Stat value={verifiedCountries || "..."} label="verified records" />
            </div>
          </div>

          <DecisionPanel
            internetWeight={internetWeight}
            loadStatus={loadStatus}
            rankedCountries={rankedCountries}
            selectedCountry={selectedCountry}
            setInternetWeight={setInternetWeight}
            setSelectedCountryId={setSelectedCountryId}
            setVisaWeight={setVisaWeight}
            topCountry={topCountry}
            visaWeight={visaWeight}
          />
        </div>
      </section>

      <section id="countries" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Country data</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Shortlist-ready countries</h2>
          </div>
          <div className="max-w-xl">
            <p className="leading-7 text-[#8fa8c2]">
              Showing the top six weighted matches from your profile and country
              records. Open the full directory to browse everything.
            </p>
            <Link href="/countries" className="mt-4 inline-flex justify-center rounded-2xl bg-[#36d7ff] px-5 py-3 text-sm font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f]">
              Show all countries
            </Link>
          </div>
        </div>

        {loadStatus.type === "error" ? (
          <StatusCard message={loadStatus.message} />
        ) : null}

        <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
          {previewCountries.map((country) => (
            <Link
              key={country.id}
              href={`/countries/${country.id}`}
              className="group flex h-full min-h-[392px] w-full min-w-0 items-stretch justify-start overflow-hidden rounded-[22px] border border-[#233b57] bg-[linear-gradient(145deg,rgba(20,39,64,.9),rgba(11,26,44,.9))] p-0 text-left text-white shadow-[0_24px_70px_rgba(0,0,0,.24)] hover:-translate-y-2 hover:border-[#36d7ff]/70 sm:min-h-[372px]"
            >
              <span className="flex h-full w-full min-w-0 flex-col">
                <span className={`block h-20 shrink-0 ${country.accent} opacity-85 transition sm:h-24`} />
                <span className="flex min-w-0 flex-1 flex-col p-5">
                  <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <span className="min-w-0">
                      <span className="block min-w-0 break-words text-xl font-black leading-tight sm:text-2xl">
                        {country.flagEmoji ? `${country.flagEmoji} ` : ""}{country.name}
                      </span>
                      <span className="mt-1 block min-w-0 truncate text-sm font-semibold text-[#8fa8c2]">{country.region || country.subregion || country.officialName}</span>
                    </span>
                    <Chip color="primary" variant="flat" className="shrink-0 bg-[#36d7ff]/10 text-sm font-black text-[#36d7ff]">{country.match}%</Chip>
                  </span>
                  <span className="mt-5 grid min-w-0 flex-1 grid-cols-1 gap-3 min-[460px]:grid-cols-2 sm:grid-cols-2">
                    <Metric label="Capital" value={country.capital} />
                    <Metric label="Internet use" value={formatPercent(country.internetPercent)} />
                    <Metric label="Visa route" value={country.hasVisaRoute ? "Available" : country.visaStatus || "Review needed"} />
                    <Metric label="Currency" value={country.currency || "Not listed"} />
                  </span>
                  <span className="mt-5 block rounded-2xl border border-[#233b57] bg-[#07111f]/70 p-3 text-sm leading-6 text-[#a9c2d9]">
                    {country.recommender?.summary}
                  </span>
                  <span className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#36d7ff] px-4 py-3 text-sm font-black text-[#06111f] group-hover:bg-[#a3ff6f]">
                    View details
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:py-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">Core platform</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Built around relocation decisions.</h2>
          <p className="mt-4 leading-7 text-[#8fa8c2]">
            Country records now come from MongoDB, while authentication and profile
            preferences now power weighted destination recommendations.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Link key={feature.id} href="/features" className="block h-full">
            <Card className="h-full rounded-2xl border border-[#233b57] bg-[#0e1e32] p-5 text-white hover:-translate-y-1 hover:border-[#36d7ff]/70">
              <Card.Header className="p-0">
                <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">FEATURE {feature.number}</Chip>
              </Card.Header>
              <Card.Content className="p-0 pt-3">
                <Card.Title className="text-lg font-black text-white">{feature.title}</Card.Title>
                <Card.Description className="mt-2 text-sm leading-6 text-[#8fa8c2]">{feature.summary}</Card.Description>
              </Card.Content>
            </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-7xl px-4 py-14 pb-24 sm:px-6 lg:py-16">
        <div className="grid gap-6 rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-4 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-6 lg:grid-cols-[1fr_.85fr]">
          <div className="rounded-3xl bg-[#07111f] p-5">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Country pulse</p>
            <h2 className="mt-3 text-3xl font-black">Database records users can act on.</h2>
            <div className="mt-6 grid gap-3">
              {rankedCountries.slice(0, 3).map((country) => (
                <div key={country.id} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-[#233b57] bg-[#0e1e32] p-4">
                  <div>
                    <strong>{country.name} visa record</strong>
                    <p className="mt-1 text-sm text-[#8fa8c2]">
                      {country.visaProgram || "Remote-work route review"}{country.verifiedOn ? ` verified on ${country.verifiedOn}` : ""}
                    </p>
                  </div>
                  <Chip color="success" variant="flat" className="self-start bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">
                    {country.hasVisaRoute ? "Available" : "Check"}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-[linear-gradient(135deg,rgba(54,215,255,.14),rgba(163,255,111,.08))] p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">Account preview</p>
              <h3 className="mt-3 text-3xl font-black">Create a profile and personalize these country rankings.</h3>
            <p className="mt-4 leading-7 text-[#a9c2d9]">
                User preferences are stored separately from authentication, then
                applied against the country records already in MongoDB.
              </p>
            </div>
            <BuildProfileButton />
          </div>
        </div>
      </section>
    </main>
  );
}

function BuildProfileButton() {
  const { data: session, isPending } = authClient.useSession();
  const isLoggedIn = Boolean(session?.user);

  return (
    <Link
      href={isLoggedIn ? "/profile" : "/register"}
      className="mt-8 inline-flex justify-center rounded-2xl bg-[#a3ff6f] px-6 py-4 text-center font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#36d7ff]"
    >
      {isPending ? "Checking profile..." : isLoggedIn ? "Edit my profile" : "Build my profile"}
    </Link>
  );
}

function DecisionPanel({ internetWeight, loadStatus, rankedCountries, selectedCountry, setInternetWeight, setSelectedCountryId, setVisaWeight, topCountry, visaWeight }) {
  if (loadStatus.type === "loading") {
    return (
      <Card className="grid min-h-[520px] place-items-center rounded-[28px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-6 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,.32)]">
        <div>
          <div className="mx-auto size-16 rounded-full border-4 border-[#36d7ff]/30 border-t-[#36d7ff]" />
          <h2 className="mt-5 text-2xl font-black">Loading country data</h2>
          <p className="mt-2 text-sm text-[#8fa8c2]">Reading your saved country records.</p>
        </div>
      </Card>
    );
  }

  if (!topCountry || !selectedCountry) {
    return <StatusCard message={loadStatus.message || "No country records were found in MongoDB."} />;
  }

  return (
    <Card className="relative min-h-[520px] rounded-[28px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,.32)] sm:p-5 lg:min-h-[560px]">
      <div className="absolute inset-4 rounded-[24px] border border-[#284663] bg-[radial-gradient(circle_at_center,rgba(54,215,255,.18),transparent_46%)]" />
      <div className="relative grid gap-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#07111f]/75 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#8fa8c2]">Top match</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              {topCountry.flagEmoji ? `${topCountry.flagEmoji} ` : ""}{topCountry.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-[#8fa8c2]">{topCountry.capital} / {topCountry.region || "Region pending"}</p>
          </div>
          <ProgressCircle value={topCountry.match} className="grid size-24 shrink-0 place-items-center text-[#36d7ff]">
            <ProgressCircle.Track className="size-24 -rotate-90">
              <ProgressCircle.TrackCircle className="stroke-[#263d54]" cx="48" cy="48" r="38" strokeWidth="8" fill="none" />
              <ProgressCircle.FillCircle className="stroke-[#36d7ff]" cx="48" cy="48" r="38" strokeWidth="8" fill="none" />
            </ProgressCircle.Track>
            <span className="absolute grid size-16 place-items-center rounded-full bg-[#0d2034] text-2xl font-black text-white">{topCountry.match}%</span>
          </ProgressCircle>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {rankedCountries.slice(0, 3).map((country) => (
            <Button
              key={country.id}
              type="button"
              onPress={() => setSelectedCountryId(country.id)}
              className={`h-auto justify-start rounded-2xl border p-4 text-left text-white hover:-translate-y-1 ${selectedCountry.id === country.id ? "border-[#36d7ff] bg-[#36d7ff]/10" : "border-[#233b57] bg-[#0e1e32]/90"}`}
            >
              <span>
                <strong>{country.name}</strong>
                <span className="mt-2 block text-sm text-[#8fa8c2]">{formatPercent(country.internetPercent)} internet</span>
                <Chip color="success" variant="flat" className="mt-3 bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">{country.match}% fit</Chip>
              </span>
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#233b57] bg-[#0e1e32]/90 p-5">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-black">Tune your decision</p>
            <Chip color="success" variant="flat" className="bg-[#a3ff6f]/10 text-xs font-bold text-[#a3ff6f]">Live data</Chip>
          </div>
          <TuneSlider label="Visa readiness importance" value={visaWeight} onChange={setVisaWeight} />
          <TuneSlider label="Internet access importance" value={internetWeight} onChange={setInternetWeight} />
        </div>

        <div className="rounded-2xl border border-[#36d7ff]/30 bg-[#07111f]/80 p-4">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#36d7ff]">Selected country</p>
          <p className="mt-2 text-sm leading-6 text-[#c2d7e9]">
            {selectedCountry.name} lists {selectedCountry.capital} as its capital,
            {selectedCountry.currency ? ` uses ${selectedCountry.currency},` : ""}
            {selectedCountry.timeZones.length ? ` includes ${selectedCountry.timeZones.length} time zone${selectedCountry.timeZones.length === 1 ? "" : "s"},` : ""}
            and has {selectedCountry.hasVisaRoute ? "a dedicated remote-work visa route" : "a visa route that needs review"}.
          </p>
          <div className="mt-4 grid gap-2">
            {(selectedCountry.recommender?.reasons || []).map((reason) => (
              <div key={reason} className="rounded-xl border border-[#233b57] bg-[#0e1e32] px-3 py-2 text-xs font-bold leading-5 text-[#a9c2d9]">
                {reason}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TuneSlider({ label, value, onChange }) {
  return (
    <Slider value={value} minValue={40} maxValue={100} onChange={onChange} className="mb-5 block last:mb-0">
      <div className="mb-2 flex justify-between text-xs text-[#8fa8c2]">
        <span>{label}</span>
        <Slider.Output>{value}%</Slider.Output>
      </div>
      <Slider.Track className="relative h-2 rounded-full bg-[#071523]">
        <Slider.Fill className="absolute h-2 rounded-full bg-[linear-gradient(90deg,#36d7ff,#a3ff6f)]" />
        <Slider.Thumb className="top-1/2 size-5 rounded-full border-2 border-[#07111f] bg-[#36d7ff] shadow-[0_0_0_6px_rgba(54,215,255,.12)]" />
      </Slider.Track>
    </Slider>
  );
}

function StatusCard({ message }) {
  return (
    <Card className="rounded-[28px] border border-[#ff7896]/40 bg-[#ff7896]/10 p-6 text-[#ffb3c4]">
      <strong className="block text-lg">Country data unavailable</strong>
      <span className="mt-2 block text-sm leading-6">{message}</span>
    </Card>
  );
}

function Stat({ value, label }) {
  return (
    <Card className="rounded-2xl border border-[#233b57] bg-[#0e1e32]/70 p-4 text-white hover:-translate-y-1 hover:border-[#36d7ff]/60">
      <strong className="block text-2xl font-black">{value}</strong>
      <span className="text-xs font-semibold text-[#8fa8c2]">{label}</span>
    </Card>
  );
}

function Metric({ label, value }) {
  return (
    <Card className="min-h-[82px] min-w-0 rounded-xl bg-[#07111f]/60 p-3 text-white shadow-none">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <strong className="mt-1 block min-w-0 overflow-hidden text-ellipsis break-words text-sm leading-5">{value}</strong>
    </Card>
  );
}

function formatPercent(value) {
  return value ? `${value}%` : "Not listed";
}
