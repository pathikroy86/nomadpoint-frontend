"use client";

import Link from "next/link";
import { Button, Card, Chip, ProgressCircle, Slider } from "@heroui/react";
import { useMemo, useState } from "react";

const cities = [
  {
    name: "Lisbon",
    country: "Portugal",
    cost: 2180,
    wifi: 132,
    visa: "Digital nomad path",
    climate: "Mild Atlantic",
    community: 91,
    safety: 86,
    accent: "bg-[#36d7ff]",
  },
  {
    name: "Da Nang",
    country: "Vietnam",
    cost: 1240,
    wifi: 98,
    visa: "Long-stay review",
    climate: "Warm coastal",
    community: 84,
    safety: 80,
    accent: "bg-[#a3ff6f]",
  },
  {
    name: "Tbilisi",
    country: "Georgia",
    cost: 1520,
    wifi: 74,
    visa: "Flexible entry",
    climate: "Four seasons",
    community: 78,
    safety: 82,
    accent: "bg-[#ff7896]",
  },
];

const features = [
  ["01", "Destination recommender", "Weighted matching explains why each city fits your budget, work hours, and lifestyle."],
  ["02", "Map explorer", "Filter cities by region, Wi-Fi, climate, safety, visa fit, and community type."],
  ["03", "City intelligence", "Costs, internet, coworking, weather, safety, source links, and last-reviewed dates."],
  ["04", "Comparison workspace", "Adjust priorities and see advantages, disadvantages, and trade-offs side by side."],
  ["05", "Living cost planner", "Estimate housing, food, transport, coworking, insurance, and leisure expenses."],
  ["06", "Visa and tax notes", "Show assumptions, official source context, and planning limitations clearly."],
];

const updates = [
  ["Lisbon rent index", "Updated 18 minutes ago", "+3%"],
  ["Da Nang Wi-Fi score", "New source verified", "+12 Mbps"],
  ["Portugal visa checklist", "Expert reviewed", "Fresh"],
];

export default function Home() {
  const [budgetWeight, setBudgetWeight] = useState(72);
  const [internetWeight, setInternetWeight] = useState(88);
  const [selectedCity, setSelectedCity] = useState(cities[0]);

  const rankedCities = useMemo(() => {
    return cities
      .map((city) => {
        const budgetScore = Math.max(42, 100 - city.cost / 38);
        const internetScore = Math.min(100, city.wifi / 1.4);
        const match = Math.round(
          budgetScore * (budgetWeight / 220) +
          internetScore * (internetWeight / 260) +
          city.community * 0.18 +
          city.safety * 0.14
        );

        return { ...city, match: Math.min(96, Math.max(68, match)) };
      })
      .sort((a, b) => b.match - a.match);
  }, [budgetWeight, internetWeight]);

  const topCity = rankedCities[0];

  return (
    <main className="min-h-screen overflow-hidden bg-[#07111f] font-sans text-[#eef7ff]">
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_10%,rgba(54,215,255,.2),transparent_27%),radial-gradient(circle_at_14%_82%,rgba(163,255,111,.14),transparent_25%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:py-7">
          <Brand />
          <div className="hidden items-center gap-7 text-sm font-semibold text-[#8fa8c2] md:flex">
            <a href="#cities" className="hover:text-white">Cities</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#proof" className="hover:text-white">Live data</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="rounded-xl border border-[#233b57] px-3 py-2 text-sm font-bold text-[#d8eaff] hover:-translate-y-0.5 hover:border-[#36d7ff] sm:px-4">
              Login
            </Link>
            <Link href="/register" className="rounded-xl bg-[#36d7ff] px-3 py-2 text-sm font-black text-[#06111f] hover:-translate-y-0.5 hover:bg-[#a3ff6f] sm:px-4">
              Register
            </Link>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-8 sm:px-6 md:pb-20 lg:grid-cols-[1fr_.92fr] lg:pb-28 lg:pt-14">
          <div>
            <div className="inline-flex rounded-full border border-[#233b57] bg-[#0e1e32]/80 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">
              Remote work location finder
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">
              Choose your next city with evidence, not guesswork.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#a9c2d9] sm:text-lg sm:leading-8">
              NomadPoint combines budget, internet quality, visa readiness, weather,
              safety, time zones, and community signals into one decision cockpit
              for digital nomads and remote teams.
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
              <Stat value="186" label="tracked cities" />
              <Stat value="24k" label="monthly signals" />
              <Stat value="3 min" label="first shortlist" />
            </div>
          </div>

          <DecisionPanel
            budgetWeight={budgetWeight}
            internetWeight={internetWeight}
            rankedCities={rankedCities}
            selectedCity={selectedCity}
            setBudgetWeight={setBudgetWeight}
            setInternetWeight={setInternetWeight}
            setSelectedCity={setSelectedCity}
            topCity={topCity}
          />
        </div>
      </section>

      <section id="cities" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Interactive fake data</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Shortlist-ready city cards</h2>
          </div>
          <p className="max-w-xl leading-7 text-[#8fa8c2]">
            Change the sliders above and the matches update instantly, giving the page a preview of the future recommender.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rankedCities.map((city) => (
            <Button
              key={city.name}
              type="button"
              onPress={() => setSelectedCity(city)}
              className="group h-auto justify-start overflow-hidden rounded-[22px] border border-[#233b57] bg-[linear-gradient(145deg,rgba(20,39,64,.9),rgba(11,26,44,.9))] p-0 text-left text-white shadow-[0_24px_70px_rgba(0,0,0,.24)] hover:-translate-y-2 hover:border-[#36d7ff]/70"
            >
              <span className="block w-full">
                <span className={`block h-24 ${city.accent} opacity-85 transition group-hover:h-28`} />
                <span className="block p-5">
                  <span className="flex items-start justify-between gap-4">
                    <span>
                      <span className="block text-2xl font-black">{city.name}</span>
                      <span className="block text-sm font-semibold text-[#8fa8c2]">{city.country}</span>
                    </span>
                    <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-sm font-black text-[#36d7ff]">{city.match}%</Chip>
                  </span>
                  <span className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Metric label="Monthly cost" value={`$${city.cost.toLocaleString()}`} />
                    <Metric label="Internet" value={`${city.wifi} Mbps`} />
                    <Metric label="Visa" value={city.visa} />
                    <Metric label="Climate" value={city.climate} />
                  </span>
                </span>
              </span>
            </Button>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:py-16">
        <div>
          <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">Core platform</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Built around relocation decisions.</h2>
          <p className="mt-4 leading-7 text-[#8fa8c2]">
            The landing page introduces the product promise now, while the auth pages set up the later role-based experience for nomads and city experts.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(([number, title, body]) => (
            <Card key={title} className="rounded-2xl border border-[#233b57] bg-[#0e1e32] p-5 text-white hover:-translate-y-1 hover:border-[#36d7ff]/70">
              <Card.Header className="p-0">
                <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">FEATURE {number}</Chip>
              </Card.Header>
              <Card.Content className="p-0 pt-3">
                <Card.Title className="text-lg font-black text-white">{title}</Card.Title>
                <Card.Description className="mt-2 text-sm leading-6 text-[#8fa8c2]">{body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-7xl px-4 py-14 pb-24 sm:px-6 lg:py-16">
        <div className="grid gap-6 rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-4 shadow-[0_24px_70px_rgba(0,0,0,.24)] sm:p-6 lg:grid-cols-[1fr_.85fr]">
          <div className="rounded-3xl bg-[#07111f] p-5">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">City pulse</p>
            <h2 className="mt-3 text-3xl font-black">Updates users can act on.</h2>
            <div className="mt-6 grid gap-3">
              {updates.map(([title, subtitle, badge]) => (
                <div key={title} className="grid grid-cols-[1fr_auto] gap-4 rounded-2xl border border-[#233b57] bg-[#0e1e32] p-4">
                  <div>
                    <strong>{title}</strong>
                    <p className="mt-1 text-sm text-[#8fa8c2]">{subtitle}</p>
                  </div>
                  <Chip color="success" variant="flat" className="self-start bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">{badge}</Chip>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-[linear-gradient(135deg,rgba(54,215,255,.14),rgba(163,255,111,.08))] p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">Account preview</p>
              <h3 className="mt-3 text-3xl font-black">Create a profile and get a shortlist immediately.</h3>
              <p className="mt-4 leading-7 text-[#a9c2d9]">
                Fake onboarding data includes passport country, work schedule, monthly budget,
                preferred regions, lifestyle priorities, and alert preferences.
              </p>
            </div>
            <Link href="/register" className="mt-8 inline-flex justify-center rounded-2xl bg-[#a3ff6f] px-6 py-4 text-center font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#36d7ff]">
              Build my profile
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#36d7ff] text-[#06111f] shadow-[0_12px_35px_rgba(54,215,255,.25)]">
        N
      </span>
      <span>NomadPoint</span>
    </Link>
  );
}

function DecisionPanel({ budgetWeight, internetWeight, rankedCities, selectedCity, setBudgetWeight, setInternetWeight, setSelectedCity, topCity }) {
  return (
    <Card className="relative min-h-[520px] rounded-[28px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,.32)] sm:p-5 lg:min-h-[560px]">
      <div className="absolute inset-4 rounded-[24px] border border-[#284663] bg-[radial-gradient(circle_at_center,rgba(54,215,255,.18),transparent_46%)]" />
      <div className="relative grid gap-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#07111f]/75 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-[#8fa8c2]">Top match</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">{topCity.name}, {topCity.country}</h2>
          </div>
          <ProgressCircle value={topCity.match} className="grid size-24 shrink-0 place-items-center text-[#36d7ff]">
            <ProgressCircle.Track className="size-24 -rotate-90">
              <ProgressCircle.TrackCircle className="stroke-[#263d54]" cx="48" cy="48" r="38" strokeWidth="8" fill="none" />
              <ProgressCircle.FillCircle className="stroke-[#36d7ff]" cx="48" cy="48" r="38" strokeWidth="8" fill="none" />
            </ProgressCircle.Track>
            <span className="absolute grid size-16 place-items-center rounded-full bg-[#0d2034] text-2xl font-black text-white">{topCity.match}%</span>
          </ProgressCircle>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {rankedCities.map((city) => (
            <Button
              key={city.name}
              type="button"
              onPress={() => setSelectedCity(city)}
              className={`h-auto justify-start rounded-2xl border p-4 text-left text-white hover:-translate-y-1 ${selectedCity.name === city.name ? "border-[#36d7ff] bg-[#36d7ff]/10" : "border-[#233b57] bg-[#0e1e32]/90"}`}
            >
              <span>
                <strong>{city.name}</strong>
                <span className="mt-2 block text-sm text-[#8fa8c2]">${city.cost.toLocaleString()}/mo</span>
                <Chip color="success" variant="flat" className="mt-3 bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">{city.match}% fit</Chip>
              </span>
            </Button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#233b57] bg-[#0e1e32]/90 p-5">
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-black">Tune your decision</p>
            <Chip color="success" variant="flat" className="bg-[#a3ff6f]/10 text-xs font-bold text-[#a3ff6f]">Live preview</Chip>
          </div>
          <TuneSlider label="Budget importance" value={budgetWeight} onChange={setBudgetWeight} />
          <TuneSlider label="Internet importance" value={internetWeight} onChange={setInternetWeight} />
        </div>

        <div className="rounded-2xl border border-[#36d7ff]/30 bg-[#07111f]/80 p-4">
          <p className="text-xs font-black uppercase tracking-[.16em] text-[#36d7ff]">Selected city</p>
          <p className="mt-2 text-sm leading-6 text-[#c2d7e9]">
            {selectedCity.name} gives you {selectedCity.wifi} Mbps internet, a {selectedCity.visa.toLowerCase()}, and a {selectedCity.climate.toLowerCase()} climate profile.
          </p>
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
    <Card className="rounded-xl bg-[#07111f]/60 p-3 text-white shadow-none">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <strong className="mt-1 block text-sm">{value}</strong>
    </Card>
  );
}
