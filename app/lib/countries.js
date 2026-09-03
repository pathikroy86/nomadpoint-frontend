const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

const compact = (value) => String(value || "").trim();

const numberOrFallback = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

export async function fetchCountries() {
    const response = await fetch(`${backendUrl}/api/countries`);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(payload?.message || "Country data could not be loaded.");
    }

    return (payload?.countries || []).map(normalizeCountry);
}

export async function fetchCountry(id) {
    const response = await fetch(`${backendUrl}/api/countries/${id}`);
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(payload?.message || "Country could not be loaded.");
    }

    return normalizeCountry(payload);
}

export function normalizeCountry(country, index) {
    const remoteCities = Array.isArray(country.majorRemoteWorkCities)
        ? country.majorRemoteWorkCities.filter(Boolean).map(String)
        : [];
    const visa = country.remoteWorkVisa || {};
    const internetUse = country.internetUse || {};
    const population = country.population || {};
    const id = compact(country.id) || compact(country._id?.$oid) || compact(country._id);

    return {
        id,
        name: compact(country.name),
        officialName: compact(country.officialName),
        flagEmoji: compact(country.flagEmoji),
        region: compact(country.region),
        subregion: compact(country.subregion),
        capital: compact(country.capital?.name) || "Capital review pending",
        currency: compact(country.currency?.code || country.currency?.name),
        languages: Array.isArray(country.primaryLanguages)
            ? country.primaryLanguages.filter(Boolean).map(String)
            : [],
        timeZones: Array.isArray(country.ianaTimeZones)
            ? country.ianaTimeZones.filter(Boolean).map(String)
            : [],
        remoteCities,
        internetPercent: numberOrFallback(internetUse.percentOfPopulation),
        internetYear: internetUse.year || null,
        population: numberOrFallback(population.value),
        populationYear: population.year || null,
        hasVisaRoute: Boolean(visa.hasDedicatedRoute),
        visaProgram: compact(visa.programName || visa.routeType || visa.status),
        visaStatus: compact(visa.status),
        maxStayMonths: visa.maxInitialStayMonths || null,
        verifiedOn: compact(country.recordVerifiedOn || visa.verifiedOn),
        sourceUrl: compact(visa.officialInfoUrl || internetUse.sourceUrl),
        accent: ["bg-[#36d7ff]", "bg-[#a3ff6f]", "bg-[#ff7896]"][index % 3],
    };
}
