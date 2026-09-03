"use client";

import Link from "next/link";
import { Button, Card, Chip, Input } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { fetchCountries } from "../lib/countries";

const pageSize = 6;

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState({ type: "loading", message: "" });

  useEffect(() => {
    async function loadCountries() {
      try {
        const nextCountries = await fetchCountries();
        setCountries(nextCountries);
        setStatus({ type: "ready", message: "" });
      } catch (error) {
        setStatus({
          type: "error",
          message: error.message,
        });
      }
    }

    loadCountries();
  }, []);

  const regions = useMemo(() => {
    return ["all", ...new Set(countries.map((country) => country.region).filter(Boolean))];
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const search = query.trim().toLowerCase();

    return countries.filter((country) => {
      const matchesRegion = region === "all" || country.region === region;
      const haystack = [
        country.name,
        country.officialName,
        country.capital,
        country.region,
        country.subregion,
        country.currency,
        ...(country.languages || []),
        ...(country.remoteCities || []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesRegion && (!search || haystack.includes(search));
    });
  }, [countries, query, region]);

  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCountries = filteredCountries.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  function handleSearch(value) {
    setQuery(value);
    setCurrentPage(1);
  }

  function handleRegionChange(value) {
    setRegion(value);
    setCurrentPage(1);
  }

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-16">
        <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Country directory</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Explore every country record.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#a9c2d9] sm:text-lg">
              Browse the countries stored in NomadPoint with visa readiness,
              internet adoption, capitals, currencies, languages, and remote-work cities.
            </p>
          </div>

          <Card className="rounded-[24px] border border-[#233b57] bg-[#0e1e32] p-4 text-white sm:p-5">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <label className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
                Search
                <Input
                  value={query}
                  onChange={(event) => handleSearch(event.target.value)}
                  placeholder="Search country, capital, region, language"
                  className="rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-4 text-white placeholder:text-[#59748e]"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    onPress={() => handleRegionChange(item)}
                    className={`rounded-full border px-4 py-2 text-sm font-black ${region === item ? "border-[#a3ff6f] bg-[#a3ff6f] text-[#06111f]" : "border-[#233b57] bg-[#07111f] text-[#8fa8c2] hover:border-[#36d7ff] hover:text-white"}`}
                  >
                    {item === "all" ? "All" : item}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Stat value={countries.length || "..."} label="total countries" />
          <Stat value={`${paginatedCountries.length}/${filteredCountries.length}`} label="shown now" />
          <Stat value={countries.filter((country) => country.hasVisaRoute).length || "0"} label="visa routes" />
        </div>

        {status.type === "loading" ? (
          <StatusCard title="Loading countries" message="Reading country records from the backend." />
        ) : null}

        {status.type === "error" ? (
          <StatusCard title="Country data unavailable" message={status.message} tone="error" />
        ) : null}

        {status.type === "ready" && !filteredCountries.length ? (
          <StatusCard title="No countries found" message="Try another search or region filter." />
        ) : null}

        <div className="mt-8 grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedCountries.map((country, index) => (
            <CountryCard key={country.id} country={country} index={index} />
          ))}
        </div>

        {status.type === "ready" && filteredCountries.length > pageSize ? (
          <PaginationControls
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        ) : null}
      </section>
    </main>
  );
}

function CountryCard({ country, index }) {
  const accents = ["bg-[#36d7ff]", "bg-[#a3ff6f]", "bg-[#ff7896]"];
  const remoteCities = country.remoteCities?.slice(0, 3) || [];
  const languages = country.languages?.slice(0, 2) || [];

  return (
    <Link href={`/countries/${country.id}`} className="block h-full min-w-0">
      <Card className="flex h-full min-h-[390px] min-w-0 overflow-hidden rounded-[22px] border border-[#233b57] bg-[linear-gradient(145deg,rgba(20,39,64,.9),rgba(11,26,44,.9))] text-white shadow-[0_24px_70px_rgba(0,0,0,.24)] hover:-translate-y-2 hover:border-[#36d7ff]/70">
      <div className={`h-20 shrink-0 ${accents[index % accents.length]} opacity-85`} />
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <h2 className="break-words text-xl font-black leading-tight sm:text-2xl">
              {country.flagEmoji ? `${country.flagEmoji} ` : ""}{country.name}
            </h2>
            <p className="mt-1 truncate text-sm font-semibold text-[#8fa8c2]">{country.region || country.subregion || country.officialName}</p>
          </div>
          <Chip color={country.hasVisaRoute ? "success" : "warning"} variant="flat" className="shrink-0 bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">
            {country.hasVisaRoute ? "Visa" : "Review"}
          </Chip>
        </div>

        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 min-[460px]:grid-cols-2">
          <Metric label="Capital" value={country.capital} />
          <Metric label="Internet use" value={formatPercent(country.internetPercent)} />
          <Metric label="Currency" value={country.currency || "Not listed"} />
          <Metric label="Population" value={formatPopulation(country.population)} />
        </div>

        <div className="mt-5 grid gap-3">
          <TagGroup label="Remote cities" items={remoteCities} fallback="No city list yet" />
          <TagGroup label="Languages" items={languages} fallback="Not listed" />
        </div>

        <div className="mt-auto pt-5">
          <p className="line-clamp-2 text-sm leading-6 text-[#a9c2d9]">
            {country.visaProgram || country.visaStatus || "Visa information needs review."}
          </p>
          {country.verifiedOn ? (
            <p className="mt-2 text-xs font-bold text-[#59748e]">Verified {country.verifiedOn}</p>
          ) : null}
        </div>
      </div>
      </Card>
    </Link>
  );
}

function Metric({ label, value }) {
  return (
    <div className="min-h-[78px] min-w-0 rounded-xl bg-[#07111f]/60 p-3">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <strong className="mt-1 block min-w-0 overflow-hidden text-ellipsis break-words text-sm leading-5">{value}</strong>
    </div>
  );
}

function TagGroup({ label, items, fallback }) {
  return (
    <div className="min-w-0">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <div className="mt-2 flex min-w-0 flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <Chip key={item} variant="flat" className="max-w-full bg-[#07111f] text-xs font-bold text-[#c2d7e9]">
              <span className="truncate">{item}</span>
            </Chip>
          ))
        ) : (
          <span className="text-sm font-semibold text-[#59748e]">{fallback}</span>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <Card className="min-w-[150px] rounded-2xl border border-[#233b57] bg-[#0e1e32]/70 p-4 text-white">
      <strong className="block text-2xl font-black">{value}</strong>
      <span className="text-xs font-semibold text-[#8fa8c2]">{label}</span>
    </Card>
  );
}

function StatusCard({ title, message, tone = "info" }) {
  const className =
    tone === "error"
      ? "border-[#ff7896]/40 bg-[#ff7896]/10 text-[#ffb3c4]"
      : "border-[#233b57] bg-[#0e1e32] text-white";

  return (
    <Card className={`mt-8 rounded-[24px] p-5 ${className}`}>
      <strong className="block text-lg">{title}</strong>
      <span className="mt-2 block text-sm leading-6">{message}</span>
    </Card>
  );
}

function PaginationControls({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-[24px] border border-[#233b57] bg-[#0e1e32] p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-bold text-[#8fa8c2]">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          isDisabled={currentPage === 1}
          onPress={() => onPageChange(Math.max(1, currentPage - 1))}
          className="rounded-xl border border-[#233b57] bg-[#07111f] px-4 py-2 text-sm font-black text-[#d8eaff] hover:border-[#36d7ff]"
        >
          Previous
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            onPress={() => onPageChange(page)}
            className={`rounded-xl border px-4 py-2 text-sm font-black ${currentPage === page ? "border-[#a3ff6f] bg-[#a3ff6f] text-[#06111f]" : "border-[#233b57] bg-[#07111f] text-[#8fa8c2] hover:border-[#36d7ff] hover:text-white"}`}
          >
            {page}
          </Button>
        ))}
        <Button
          type="button"
          isDisabled={currentPage === totalPages}
          onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="rounded-xl border border-[#233b57] bg-[#07111f] px-4 py-2 text-sm font-black text-[#d8eaff] hover:border-[#36d7ff]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function formatPercent(value) {
  return value ? `${value}%` : "Not listed";
}

function formatPopulation(value) {
  if (!value) {
    return "Not listed";
  }

  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
