const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001").replace(/\/$/, "");

const compact = (value) => String(value || "").trim();

const numberOrFallback = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

const flagFromCountryCode = (code) => {
    const countryCode = compact(code).toUpperCase();

    if (!/^[A-Z]{2}$/.test(countryCode)) {
        return "";
    }

    return [...countryCode]
        .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
        .join("");
};

const getCountryFlag = (country) => {
    return (
        compact(country.flagEmoji) ||
        compact(country.flag) ||
        flagFromCountryCode(
            country.iso2 ||
            country.alpha2Code ||
            country.countryCode ||
            country.cca2 ||
            country.codes?.iso2 ||
            country.codes?.cca2
        ) ||
        "🌐"
    );
};

const getCountryFlagImageUrl = (country) => {
    return (
        compact(country.flagImageUrl) ||
        compact(country.flagSvgUrl) ||
        compact(country.flags?.png) ||
        compact(country.flags?.svg) ||
        compact(country.flag?.png) ||
        compact(country.flag?.svg)
    );
};

const getMongoId = (country) => {
    if (typeof country._id === "string") {
        return compact(country._id);
    }

    return compact(country._id?.$oid);
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
    const mongoId = getMongoId(country);
    const slug = compact(country.id);
    const id = mongoId || slug || compact(country.name).toLowerCase().replace(/\s+/g, "-");
    const accentIndex = Number.isInteger(index) ? index : 0;

    return {
        id,
        slug,
        name: compact(country.name),
        officialName: compact(country.officialName),
        flagEmoji: getCountryFlag(country),
        flagImageUrl: compact(country.flagImageUrl),
        flagSvgUrl: compact(country.flagSvgUrl),
        flagVisualUrl: getCountryFlagImageUrl(country),
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
        accent: ["bg-[#36d7ff]", "bg-[#a3ff6f]", "bg-[#ff7896]"][accentIndex % 3],
    };
}
