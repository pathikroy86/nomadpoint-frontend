"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

const navLinks = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Countries",
        href: "/countries",
    },
    {
        label: "Features",
        href: "/features",
    },
    {
        label: "Live data",
        href: "/#proof",
    },
];

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const user = session?.user;
    const displayName = user?.name || user?.email || "User";

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await authClient.signOut();
        setIsMenuOpen(false);
        router.push("/");
        router.refresh();
        setIsLoggingOut(false);
    };

    const isActiveRoute = (href) => {
        if (href === "/") return pathname === "/";
        if (href.startsWith("/#")) return false;
        return pathname?.startsWith(href);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-[#233b57]/80 bg-[#07111f]/90 text-[#eef7ff] backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
                <Brand />

                <div className="hidden items-center gap-4 lg:flex">
                    <ul className="flex items-center gap-1 rounded-full border border-[#233b57] bg-[#0e1e32] px-2 py-2">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${isActiveRoute(link.href)
                                        ? "bg-[#36d7ff] text-[#06111f] shadow-sm"
                                        : "text-[#8fa8c2] hover:bg-[#07111f] hover:text-white"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <AuthActions
                        displayName={displayName}
                        isLoading={isPending}
                        isLoggingOut={isLoggingOut}
                        onLogout={handleLogout}
                        user={user}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((current) => !current)}
                    className="grid size-11 place-items-center rounded-xl border border-[#233b57] text-[#d8eaff] transition hover:border-[#36d7ff] lg:hidden"
                    aria-label="Toggle navigation menu"
                >
                    {isMenuOpen ? "X" : "M"}
                </button>
            </div>

            {isMenuOpen ? (
                <div className="border-t border-[#233b57] bg-[#07111f] lg:hidden">
                    <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
                        <ul className="space-y-2">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActiveRoute(link.href)
                                            ? "bg-[#36d7ff] text-[#06111f]"
                                            : "text-[#8fa8c2] hover:bg-[#0e1e32] hover:text-white"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="grid gap-3 border-t border-[#233b57] pt-5">
                            <AuthActions
                                displayName={displayName}
                                isLoading={isPending}
                                isLoggingOut={isLoggingOut}
                                mobile
                                onLogout={handleLogout}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </nav>
    );
};

const Brand = () => {
    return (
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#36d7ff] text-[#06111f] shadow-[0_12px_35px_rgba(54,215,255,.25)]">
                N
            </span>
            <span>NomadPoint</span>
        </Link>
    );
};

const AuthActions = ({ displayName, isLoading, isLoggingOut, mobile = false, onLogout, user }) => {
    if (isLoading) {
        return (
            <div className={mobile ? "grid gap-3" : "flex items-center gap-2"}>
                <span className="h-11 rounded-xl border border-[#233b57] bg-[#0e1e32] lg:w-32" />
                <span className="h-11 rounded-xl bg-[#132941] lg:w-24" />
            </div>
        );
    }

    if (user) {
        return (
            <div className={mobile ? "grid gap-3" : "flex items-center gap-3"}>
                <Link
                    href="/profile"
                    className="min-w-0 rounded-full border border-[#233b57] bg-[#0e1e32] px-4 py-2 text-sm font-bold text-[#d8eaff] hover:border-[#36d7ff]"
                >
                    <span className="block truncate">Hi, {displayName}</span>
                </Link>

                <Button
                    type="button"
                    isDisabled={isLoggingOut}
                    onPress={onLogout}
                    className="h-11 rounded-full bg-[#ff7896] px-5 font-black text-[#06111f] hover:bg-[#a3ff6f]"
                >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
            </div>
        );
    }

    return (
        <div className={mobile ? "grid gap-3" : "flex items-center gap-3"}>
            <Link
                href="/login"
                className="rounded-full border border-[#233b57] bg-[#0e1e32] px-5 py-3 text-center text-sm font-bold text-[#d8eaff] hover:border-[#36d7ff]"
            >
                Login
            </Link>
            <Link
                href="/register"
                className="rounded-full bg-[#36d7ff] px-5 py-3 text-center text-sm font-black text-[#06111f] hover:bg-[#a3ff6f]"
            >
                Get Started
            </Link>
        </div>
    );
};

export default Navbar;
