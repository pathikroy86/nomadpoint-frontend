import Link from "next/link";

const footerLinks = {
  platform: [
    ["Countries", "/countries"],
    ["Features", "/#features"],
    ["Live data", "/#proof"],
  ],
  account: [
    ["Login", "/login"],
    ["Register", "/register"],
    ["Profile", "/profile"],
  ],
  contact: [
    ["hello@nomadpoint.app", "mailto:hello@nomadpoint.app"],
    ["Support desk", "mailto:support@nomadpoint.app"],
    ["+1 (415) 555-0198", "tel:+14155550198"],
  ],
};

const socialLinks = [
  ["LinkedIn", "https://www.linkedin.com", "linkedin"],
  ["GitHub", "https://github.com", "github"],
  ["X", "https://x.com", "x"],
  ["Facebook", "https://www.facebook.com", "facebook"],
];

export default function Footer() {
  return (
    <footer className="border-t border-[#233b57] bg-[#06101c] px-4 py-10 text-[#eef7ff] sm:px-6 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_.9fr_.9fr_1fr]">
        <div>
          <Brand />
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#8fa8c2]">
            One planning point for remote workers comparing countries, visas,
            internet, time zones, and source-backed relocation data.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socialLinks.map(([label, href, icon]) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="grid size-11 place-items-center rounded-2xl border border-[#233b57] bg-[#0e1e32] text-[#8fa8c2] hover:-translate-y-1 hover:border-[#36d7ff] hover:text-[#36d7ff]"
              >
                <SocialIcon icon={icon} />
              </a>
            ))}
          </div>
        </div>

        <FooterGroup title="Platform" links={footerLinks.platform} />
        <FooterGroup title="Account" links={footerLinks.account} />
        <FooterGroup title="Contact" links={footerLinks.contact} />
      </div>

      <div className="mx-auto mt-8 flex max-w-7xl flex-col gap-3 border-t border-[#233b57] pt-6 text-sm text-[#59748e] sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright 2026 NomadPoint. Data-backed preview.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/#" className="hover:text-[#36d7ff]">Privacy</Link>
          <Link href="/#" className="hover:text-[#36d7ff]">Terms</Link>
          <a href="mailto:legal@nomadpoint.app" className="hover:text-[#36d7ff]">Legal contact</a>
        </div>
      </div>
    </footer>
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

function FooterGroup({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-[.18em] text-[#36d7ff]">{title}</h3>
      <div className="mt-4 grid gap-3">
        {links.map(([label, href]) => (
          href.startsWith("/") ? (
            <Link key={label} href={href} className="text-sm font-semibold text-[#8fa8c2] hover:translate-x-1 hover:text-white">
              {label}
            </Link>
          ) : (
            <a key={label} href={href} className="text-sm font-semibold text-[#8fa8c2] hover:translate-x-1 hover:text-white">
              {label}
            </a>
          )
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ icon }) {
  const paths = {
    linkedin: "M6.94 8.9H3.78V19h3.16V8.9ZM5.36 7.52a1.83 1.83 0 1 0 0-3.66 1.83 1.83 0 0 0 0 3.66ZM20 19h-3.15v-5.24c0-1.45-.58-2.26-1.78-2.26-.92 0-1.48.5-1.73 1.1-.09.22-.12.53-.12.83V19h-3.15s.04-9.23 0-10.1h3.15v1.59c.19-.7 1.2-1.7 2.82-1.7 2 0 3.96 1.3 3.96 4.1V19Z",
    github: "M12 2.8a9.2 9.2 0 0 0-2.91 17.93c.46.08.63-.2.63-.44v-1.62c-2.56.56-3.1-1.1-3.1-1.1-.42-1.07-1.03-1.36-1.03-1.36-.84-.57.06-.56.06-.56.93.07 1.42.96 1.42.96.83 1.41 2.17 1 2.7.77.08-.6.32-1 .58-1.23-2.04-.23-4.18-1.02-4.18-4.54 0-1 .36-1.82.95-2.47-.1-.23-.41-1.17.09-2.43 0 0 .78-.25 2.53.94A8.77 8.77 0 0 1 12 7.34c.78 0 1.55.1 2.28.31 1.75-1.19 2.53-.94 2.53-.94.5 1.26.19 2.2.09 2.43.59.65.95 1.47.95 2.47 0 3.53-2.15 4.3-4.2 4.53.34.3.63.86.63 1.74v2.41c0 .25.17.53.64.44A9.2 9.2 0 0 0 12 2.8Z",
    x: "M14.2 10.63 20.67 3h-1.53l-5.62 6.62L9.03 3H3.86l6.78 9.99L3.86 21h1.53l5.93-6.99L16.06 21h5.17l-7.03-10.37Zm-2.1 2.48-.69-.99-5.46-7.91H8.3l4.42 6.4.68.99 5.73 8.29h-2.35l-4.68-6.78Z",
    facebook: "M14 8.5V6.75c0-.48.38-.75.83-.75H17V3h-3.02C11.3 3 10 4.6 10 6.45V8.5H8v3h2V21h4v-9.5h2.68l.42-3H14Z",
  };

  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path fill="currentColor" d={paths[icon]} />
    </svg>
  );
}
