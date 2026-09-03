"use client";

import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCountry } from "../../lib/countries";
import { fetchProfile, scoreCountry } from "../../lib/recommender";

export default function CountryDetailsPage() {
    const { id } = useParams();
    const [country, setCountry] = useState(null);
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState({ type: "loading", message: "" });

    useEffect(() => {
        async function loadCountry() {
            try {
                const [countryResult, profileResult] = await Promise.allSettled([
                    fetchCountry(id),
                    fetchProfile(),
                ]);

                if (countryResult.status === "rejected") {
                    throw countryResult.reason;
                }

                const nextCountry = countryResult.value;
                setCountry(nextCountry);
                setProfile(profileResult.status === "fulfilled" ? profileResult.value : null);
                setStatus({ type: "ready", message: "" });
            } catch (error) {
                setStatus({
                    type: "error",
                    message: error.message,
                });
            }
        }

        if (id) {
            loadCountry();
        }
    }, [id]);

    const recommendedCountry = country ? scoreCountry(country, profile || {}) : null;

    if (status.type === "loading") {
        return (
            <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-[#eef7ff]">
                <StatusCard title="Loading country" message="Reading the selected country record." />
            </main>
        );
    }

    if (status.type === "error" || !country) {
        return (
            <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-[#eef7ff]">
                <StatusCard title="Country not found" message={status.message || "This country record could not be loaded."} tone="error" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
            <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:pb-24 lg:pt-16">
                <Link href="/countries" className="inline-flex rounded-full border border-[#233b57] bg-[#0e1e32] px-4 py-2 text-sm font-bold text-[#d8eaff] hover:border-[#36d7ff]">
                    Back to countries
                </Link>

                <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
                    <Card className="overflow-hidden rounded-[30px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] text-white shadow-[0_24px_70px_rgba(0,0,0,.28)]">
                        <div className={`${country.accent} h-28 opacity-90`} />
                        <div className="p-5 sm:p-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">
                                        {country.region || "Region pending"}
                                    </p>
                                    <h1 className="mt-4 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                        {country.flagEmoji ? `${country.flagEmoji} ` : ""}{country.name}
                                    </h1>
                                    <p className="mt-3 text-lg font-semibold text-[#8fa8c2]">
                                        {country.officialName || country.subregion || "Official name not listed"}
                                    </p>
                                </div>
                                <Chip color={country.hasVisaRoute ? "success" : "warning"} variant="flat" className="w-fit shrink-0 bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">
                                    {recommendedCountry.match}% profile match
                                </Chip>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-2">
                                <Metric label="Capital" value={country.capital} />
                                <Metric label="Internet use" value={formatPercent(country.internetPercent)} />
                                <Metric label="Currency" value={country.currency || "Not listed"} />
                                <Metric label="Population" value={formatPopulation(country.population)} />
                            </div>
                        </div>
                    </Card>

                    <div className="grid gap-5">
                        <InfoPanel title="Visa Details">
                            <DetailRow label="Program" value={country.visaProgram || "Not listed"} />
                            <DetailRow label="Status" value={country.visaStatus || "Review needed"} />
                            <DetailRow label="Initial stay" value={country.maxStayMonths ? `${country.maxStayMonths} months` : "Not listed"} />
                            <DetailRow label="Verified on" value={country.verifiedOn || "Not listed"} />
                            {country.sourceUrl ? (
                                <Button
                                    as={Link}
                                    href={country.sourceUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 rounded-2xl bg-[#36d7ff] px-5 py-3 text-sm font-black text-[#06111f] hover:bg-[#a3ff6f]"
                                >
                                    Open official source
                                </Button>
                            ) : null}
                        </InfoPanel>

                        <InfoPanel title="Remote Work Fit">
                            <TagGroup label="Remote-work cities" items={country.remoteCities} fallback="No city list yet" />
                            <TagGroup label="Languages" items={country.languages} fallback="Not listed" />
                            <TagGroup label="Time zones" items={country.timeZones} fallback="Not listed" />
                        </InfoPanel>

                        <InfoPanel title="Recommendation Reasons">
                            <DetailRow label="Match summary" value={recommendedCountry.recommender.summary} />
                            {(recommendedCountry.recommender.reasons || []).map((reason, index) => (
                                <DetailRow key={reason} label={`Reason ${index + 1}`} value={reason} />
                            ))}
                        </InfoPanel>
                    </div>
                </div>
            </section>
        </main>
    );
}

function InfoPanel({ children, title }) {
    return (
        <Card className="rounded-[24px] border border-[#233b57] bg-[#0e1e32] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.18)] sm:p-6">
            <h2 className="text-xl font-black tracking-tight">{title}</h2>
            <div className="mt-5 grid gap-4">{children}</div>
        </Card>
    );
}

function Metric({ label, value }) {
    return (
        <Card className="min-h-[86px] min-w-0 rounded-2xl bg-[#07111f]/70 p-4 text-white shadow-none">
            <span className="block text-[11px] font-bold uppercase tracking-wide text-[#8fa8c2]">{label}</span>
            <strong className="mt-2 block min-w-0 break-words text-base leading-6">{value}</strong>
        </Card>
    );
}

function DetailRow({ label, value }) {
    return (
        <div className="grid gap-1 rounded-2xl border border-[#233b57] bg-[#07111f] p-4">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#8fa8c2]">{label}</span>
            <strong className="min-w-0 break-words text-sm leading-6 text-[#eef7ff]">{value}</strong>
        </div>
    );
}

function TagGroup({ label, items, fallback }) {
    return (
        <div>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-[#8fa8c2]">{label}</span>
            <div className="mt-2 flex flex-wrap gap-2">
                {items?.length ? (
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

function StatusCard({ title, message, tone = "info" }) {
    const className =
        tone === "error"
            ? "border-[#ff7896]/40 bg-[#ff7896]/10 text-[#ffb3c4]"
            : "border-[#233b57] bg-[#0e1e32] text-white";

    return (
        <Card className={`w-full max-w-md rounded-[24px] p-5 text-center ${className}`}>
            <strong className="block text-lg">{title}</strong>
            <span className="mt-2 block text-sm leading-6">{message}</span>
        </Card>
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
