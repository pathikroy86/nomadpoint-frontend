const defaultWeights = {
    visa: 24,
    internet: 24,
    region: 18,
    schedule: 16,
    lifestyle: 18,
};

const defaultProfile = {
    passportCountry: "",
    monthlyBudget: "",
    workSchedule: "",
    preferredRegions: "",
    priorities: [],
};

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const compact = (value) => String(value || "").trim();

export async function fetchProfile() {
    const response = await fetch("/api/profiles");

    if (response.status === 401) {
        return null;
    }

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(payload?.message || "Profile could not be loaded.");
    }

    return payload?.profile || null;
}

export function recommendCountries(countries, profile, weightOverrides = {}) {
    const weights = { ...defaultWeights, ...weightOverrides };
    const profileInput = { ...defaultProfile, ...(profile || {}) };

    return countries
        .map((country) => scoreCountry(country, profileInput, weights))
        .sort((a, b) => b.match - a.match);
}

export function scoreCountry(country, profile, weights = defaultWeights) {
    const factors = {
        visa: scoreVisa(country),
        internet: scoreInternet(country),
        region: scoreRegion(country, profile),
        schedule: scoreSchedule(country, profile),
        lifestyle: scoreLifestyle(country, profile),
    };
    const activeFactors = Object.fromEntries(
        Object.entries(factors).filter(([key]) => Number(weights[key] || 0) > 0)
    );
    const totalWeight = Math.max(1, Object.values(weights).reduce((sum, value) => sum + value, 0));
    const weightedTotal = Object.entries(factors).reduce((sum, [key, factor]) => {
        return sum + factor.score * (weights[key] || 0);
    }, 0);
    const match = Math.round(weightedTotal / totalWeight);

    return {
        ...country,
        match: clamp(match, 42, 98),
        recommender: {
            factors,
            reasons: buildReasons(activeFactors),
            summary: buildSummary(country, activeFactors),
        },
    };
}

function scoreVisa(country) {
    if (country.hasVisaRoute) {
        return {
            score: 96,
            label: "Visa ready",
            reason: country.visaProgram || "Dedicated remote-work route is available.",
        };
    }

    return {
        score: 54,
        label: "Visa review",
        reason: country.visaStatus || "No dedicated remote-work route is listed yet.",
    };
}

function scoreInternet(country) {
    const internetPercent = Number(country.internetPercent || 0);

    if (!internetPercent) {
        return {
            score: 48,
            label: "Internet pending",
            reason: "Internet adoption data is not listed.",
        };
    }

    return {
        score: clamp(internetPercent),
        label: `${internetPercent}% internet`,
        reason:
            internetPercent >= 80
                ? "Strong internet adoption supports remote work."
                : "Internet adoption may need closer review.",
    };
}

function scoreRegion(country, profile) {
    const preferredRegions = compact(profile.preferredRegions).toLowerCase();

    if (!preferredRegions) {
        return {
            score: 74,
            label: "Region flexible",
            reason: "No preferred region is saved yet.",
        };
    }

    const haystack = [country.name, country.region, country.subregion]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    const preferences = preferredRegions
        .split(/[,/;|]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    const matched = preferences.find((item) => haystack.includes(item));

    return {
        score: matched ? 96 : 58,
        label: matched ? "Region match" : "Outside preferred region",
        reason: matched
            ? `${country.name} matches your ${matched} preference.`
            : "This destination sits outside your saved region preferences.",
    };
}

function scoreSchedule(country, profile) {
    const preferredOffset = parseUtcOffset(profile.workSchedule);

    if (preferredOffset === null || !country.timeZones?.length) {
        return {
            score: 72,
            label: "Schedule neutral",
            reason: "Add a UTC work schedule to measure overlap more precisely.",
        };
    }

    const offsets = country.timeZones
        .map((timeZone) => getTimeZoneOffset(timeZone))
        .filter((offset) => offset !== null);

    if (!offsets.length) {
        return {
            score: 68,
            label: "Time zone review",
            reason: "Time-zone data exists but could not be compared automatically.",
        };
    }

    const closestDiff = Math.min(...offsets.map((offset) => Math.abs(offset - preferredOffset)));
    const score = closestDiff <= 2 ? 96 : closestDiff <= 4 ? 84 : closestDiff <= 6 ? 66 : 48;

    return {
        score,
        label: closestDiff <= 2 ? "Work hours align" : "Work hours differ",
        reason:
            closestDiff <= 2
                ? "Its time zone is close to your saved work schedule."
                : `Closest listed time zone is about ${Math.round(closestDiff)} hours from your schedule.`,
    };
}

function scoreLifestyle(country, profile) {
    const priorities = Array.isArray(profile.priorities) ? profile.priorities : [];

    if (!priorities.length) {
        return {
            score: 72,
            label: "Lifestyle flexible",
            reason: "Select priorities in your profile for stronger lifestyle matching.",
        };
    }

    const scores = priorities.map((priority) => scorePriority(priority, country, profile));
    const score = Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length);
    const bestReason = scores.sort((a, b) => b.score - a.score)[0]?.reason;

    return {
        score,
        label: "Lifestyle fit",
        reason: bestReason || "Lifestyle priorities were included in the match.",
    };
}

function scorePriority(priority, country, profile) {
    const value = compact(priority).toLowerCase();

    if (value.includes("internet")) {
        const internetPercent = Number(country.internetPercent || 0);
        return {
            score: internetPercent >= 80 ? 96 : internetPercent >= 65 ? 78 : 54,
            reason: `${country.name} has ${internetPercent || "unlisted"}% internet adoption.`,
        };
    }

    if (value.includes("visa")) {
        return {
            score: country.hasVisaRoute ? 96 : 52,
            reason: country.hasVisaRoute
                ? "A dedicated remote-work visa route supports visa clarity."
                : "Visa clarity needs more review for this destination.",
        };
    }

    if (value.includes("community")) {
        return {
            score: country.remoteCities?.length ? 88 : 58,
            reason: country.remoteCities?.length
                ? "Listed remote-work cities suggest stronger nomad community potential."
                : "Remote-work city data is not listed yet.",
        };
    }

    if (value.includes("warm")) {
        const warmRegions = ["Africa", "Asia", "Americas", "Oceania"];
        return {
            score: warmRegions.includes(country.region) ? 82 : 66,
            reason: warmRegions.includes(country.region)
                ? "The region is a stronger starting point for warm-climate searches."
                : "Climate data is not detailed yet, so this stays a softer match.",
        };
    }

    if (value.includes("cost") || value.includes("budget")) {
        const budget = parseBudget(profile.monthlyBudget);
        const costScore = estimateBudgetFit(country, budget);
        return {
            score: costScore,
            reason: budget
                ? `Budget fit is estimated from the current region-level data available.`
                : "Add a monthly budget to improve cost matching.",
        };
    }

    if (value.includes("safety")) {
        return {
            score: country.verifiedOn ? 74 : 62,
            reason: "Safety-specific data is not available yet, so verified records receive a small boost.",
        };
    }

    return {
        score: 70,
        reason: "This priority will become more precise as more country fields are added.",
    };
}

function buildReasons(factors) {
    return Object.values(factors)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((factor) => factor.reason);
}

function buildSummary(country, factors) {
    const strengths = Object.values(factors)
        .filter((factor) => factor.score >= 82)
        .map((factor) => factor.label);

    if (!strengths.length) {
        return `${country.name} is worth reviewing, but the profile match needs more saved preferences.`;
    }

    return `${country.name} stands out for ${strengths.slice(0, 2).join(" and ").toLowerCase()}.`;
}

function parseUtcOffset(value) {
    const match = compact(value).match(/\b(?:utc|gmt)\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i);

    if (!match) {
        return null;
    }

    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2] || 0);
    const minutes = Number(match[3] || 0);

    return sign * (hours + minutes / 60);
}

function getTimeZoneOffset(timeZone) {
    try {
        const parts = new Intl.DateTimeFormat("en", {
            timeZone,
            timeZoneName: "shortOffset",
        }).formatToParts(new Date());
        const offset = parts.find((part) => part.type === "timeZoneName")?.value || "";
        const match = offset.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/i);

        if (!match) {
            return 0;
        }

        const sign = match[1] === "-" ? -1 : 1;
        return sign * (Number(match[2] || 0) + Number(match[3] || 0) / 60);
    } catch {
        return null;
    }
}

function parseBudget(value) {
    const amounts = compact(value)
        .match(/\d[\d,]*/g)
        ?.map((amount) => Number(amount.replace(/,/g, "")))
        .filter(Number.isFinite);

    if (!amounts?.length) {
        return null;
    }

    return Math.max(...amounts);
}

function estimateBudgetFit(country, budget) {
    if (!budget) {
        return 68;
    }

    const regionBaselines = {
        Africa: 1200,
        Americas: 1900,
        Asia: 1400,
        Europe: 2400,
        Oceania: 2800,
    };
    const baseline = regionBaselines[country.region] || 1900;
    const ratio = budget / baseline;

    return ratio >= 1.15 ? 92 : ratio >= 0.9 ? 80 : ratio >= 0.7 ? 64 : 48;
}
