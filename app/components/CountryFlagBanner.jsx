export default function CountryFlagBanner({ country, className = "h-32 sm:h-40 lg:h-44" }) {
    const flagUrl = country.flagImageUrl || country.flagSvgUrl || country.flagVisualUrl;

    return (
        <div className={`relative grid w-full shrink-0 place-items-center overflow-hidden ${country.accent} ${className}`}>
            {flagUrl ? (
                <div
                    className="h-full w-full bg-cover bg-center bg-no-repeat transition duration-500 hover:scale-105 group-hover:scale-105"
                    style={{ backgroundImage: `url("${flagUrl}")` }}
                    aria-label={`${country.name} flag`}
                    role="img"
                />
            ) : (
                <span className="text-6xl sm:text-7xl">{country.flagEmoji}</span>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,.08),rgba(7,17,31,.22))]" />
        </div>
    );
}
