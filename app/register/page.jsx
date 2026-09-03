"use client";

import Link from "next/link";
import { Button, Card, Chip, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState("nomad");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      setStatus({ type: "error", message: error.message || "Registration failed. Please check the form and try again." });
      setIsSubmitting(false);
      return;
    }

    const profileResponse = await fetch("/api/profiles", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        role,
      }),
    });

    if (!profileResponse.ok) {
      const profileError = await profileResponse.json().catch(() => null);
      setStatus({ type: "error", message: profileError?.message || "Account created, but the profile could not be saved." });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: "success", message: "Account created. Opening your profile editor..." });
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-8 lg:py-8">
        <Card className="rounded-[30px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-6 lg:p-10">
          <Brand />
          <div className="mt-10 lg:mt-14">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">New account</p>
            <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-tight sm:text-5xl">
              Start with the essentials.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#a9c2d9] sm:text-lg sm:leading-8">
              Create your account with only the fields needed for authentication.
              Once you are logged in, you can edit preferences, relocation details,
              and other profile information from your workspace.
            </p>
          </div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#07111f]/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-black">Account preview</span>
              <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">Essentials only</Chip>
            </div>
            <div className="h-2 rounded-full bg-[#071523]">
              <div className="h-2 w-3/5 rounded-full bg-[linear-gradient(90deg,#36d7ff,#a3ff6f)]" />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PreviewItem label="Role" value={role === "nomad" ? "Nomad" : "City Expert"} />
              <PreviewItem label="Preferences" value="Complete after login" />
              <PreviewItem label="Saved cities" value="Add from cockpit" />
              <PreviewItem label="Alerts" value="Set up later" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[30px] border border-[#233b57] bg-[#0e1e32] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Create profile</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">Register</h2>
            </div>
            <Link href="/login" className="rounded-xl border border-[#233b57] px-4 py-2 text-sm font-bold text-[#d8eaff] hover:-translate-y-0.5 hover:border-[#36d7ff]">
              Login instead
            </Link>
          </div>

          <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleRegister}>
            <Field label="Full name" name="name" placeholder="Your full name" />
            <Field label="Email" name="email" placeholder="you@example.com" type="email" />
            <Field label="Password" name="password" placeholder="Create a password" type="password" />
            <div className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
              Role
              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-[#233b57] bg-[#07111f] p-1">
                {[
                  ["nomad", "Nomad"],
                  ["expert", "City Expert"],
                ].map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    onPress={() => setRole(value)}
                    className={`rounded-xl px-3 py-3 text-sm font-black ${role === value ? "bg-[#36d7ff] text-[#06111f]" : "bg-transparent text-[#8fa8c2] hover:bg-[#0e1e32]"}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            {status.message ? (
              <p className={`rounded-2xl border px-4 py-3 text-sm font-bold md:col-span-2 ${status.type === "error" ? "border-[#ff7896]/40 bg-[#ff7896]/10 text-[#ff9db2]" : "border-[#a3ff6f]/40 bg-[#a3ff6f]/10 text-[#a3ff6f]"}`}>
                {status.message}
              </p>
            ) : null}
            <Button type="submit" isDisabled={isSubmitting} className="rounded-2xl bg-[#36d7ff] px-5 py-4 font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f] md:col-span-2">
              {isSubmitting ? "Creating account..." : "Create my first shortlist"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#36d7ff] text-[#06111f]">N</span>
      <span>NomadPoint</span>
    </Link>
  );
}

function Field({ label, name, placeholder, type = "text" }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
      {label}
      <Input name={name} className="rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-4 text-white placeholder:text-[#59748e] focus:border-[#36d7ff]" placeholder={placeholder} type={type} required />
    </label>
  );
}

function PreviewItem({ label, value }) {
  return (
    <Card className="rounded-2xl border border-[#233b57] bg-[#0e1e32] px-4 py-3 text-white shadow-none">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <strong className="mt-1 block text-sm">{value}</strong>
    </Card>
  );
}
