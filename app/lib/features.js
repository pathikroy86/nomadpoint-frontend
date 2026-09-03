export const features = [
    {
        id: "destination-recommender",
        number: "01",
        title: "Destination recommender",
        category: "Matching engine",
        summary: "Weighted matching explains why each country fits your passport, work hours, and lifestyle.",
        description:
            "NomadPoint compares each country against saved profile preferences and live country records. The current implementation scores visa readiness, internet strength, preferred regions, work schedule overlap, budget fit, and lifestyle priorities.",
        progress: "Implemented",
        highlights: [
            "Profile-aware country match percentage",
            "Top reasons shown on landing, countries, and country detail pages",
            "Reusable recommender logic in the frontend library",
        ],
    },
    {
        id: "map-explorer",
        number: "02",
        title: "Map explorer",
        category: "Discovery",
        summary: "Filter countries by region, internet adoption, visa route, time zones, and remote-work city options.",
        description:
            "The current country directory supports search, region filters, pagination, and country cards. A visual map layer can be added on top of this data model in the next phase.",
        progress: "In progress",
        highlights: [
            "Dedicated countries page",
            "Search and region filter",
            "Six-country pagination for cleaner browsing",
        ],
    },
    {
        id: "country-intelligence",
        number: "03",
        title: "Country intelligence",
        category: "Data profile",
        summary: "Review capital cities, population, currencies, languages, official visa source links, and verification dates.",
        description:
            "Country records are fetched from MongoDB through the backend and normalized in the frontend. Users can click any country to open a detailed page with visa and remote-work fit information.",
        progress: "Implemented",
        highlights: [
            "MongoDB-backed country records",
            "GET API for all countries and individual country details",
            "Dynamic country detail route",
        ],
    },
    {
        id: "comparison-workspace",
        number: "04",
        title: "Comparison workspace",
        category: "Decision support",
        summary: "Adjust priorities and see advantages, disadvantages, and trade-offs side by side.",
        description:
            "The recommendation engine now creates the scoring foundation for future side-by-side comparisons. The next step is letting users save multiple countries and compare their factor scores.",
        progress: "Planned",
        highlights: [
            "Reusable score factors already available",
            "Country detail pages expose recommendation reasons",
            "Ready for saved shortlist integration",
        ],
    },
    {
        id: "living-cost-planner",
        number: "05",
        title: "Living cost planner",
        category: "Budget planning",
        summary: "Estimate housing, food, transport, coworking, insurance, and leisure expenses after choosing a country.",
        description:
            "Profile editing already captures monthly budget. Current recommender uses region-level budget fit as a light estimate until deeper cost data is added.",
        progress: "Foundation ready",
        highlights: [
            "Monthly budget saved in profile",
            "Budget fit included in lifestyle scoring",
            "Ready for detailed cost categories",
        ],
    },
    {
        id: "visa-tax-notes",
        number: "06",
        title: "Visa and tax notes",
        category: "Planning clarity",
        summary: "Show assumptions, official source context, and planning limitations clearly.",
        description:
            "Country detail pages already display visa status, program name, initial stay duration, verification date, and official source links where available.",
        progress: "Partially implemented",
        highlights: [
            "Visa route status shown in cards and details",
            "Official source link supported",
            "Verification date shown where available",
        ],
    },
];

export function getFeature(id) {
    return features.find((feature) => feature.id === id) || null;
}
