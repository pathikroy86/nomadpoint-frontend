"use client";

import Link from "next/link";
import { Button, Card, Checkbox, Chip, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

const recentAlerts = [
  "Country records are ready for review",
  "Profile preferences personalize ranking",
  "Visa and internet signals update the cockpit",
];

export default function LoginPage() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    if (error) {
      setStatus({ type: "error", message: error.message || "Login failed. Check your email and password." });
      setIsSubmitting(false);
      return;
    }

    setStatus({ type: "success", message: "Login successful. Opening your profile..." });
    router.push("/profile");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <div className="grid min-h-screen lg:grid-cols-[1fr_.85fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-10 lg:block">
          <Brand />
          <div className="mt-20 max-w-xl">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Decision cockpit</p>
            <h1 className="mt-4 text-6xl font-black leading-[.96] tracking-tight">
              Pick up where your relocation plan left off.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#a9c2d9]">
              Login to return to your nomad workspace with country signals,
              comparison weights, profile preferences, and saved planning context.
            </p>
          </div>
          <div className="absolute bottom-10 left-10 right-10 rounded-[26px] border border-white/10 bg-[#07111f]/70 p-5 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-black">Pathik Rahman</span>
              <Chip color="success" variant="flat" className="bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">Nomad role</Chip>
            </div>
            <div className="grid gap-3">
              {recentAlerts.map((alert) => (
                <div key={alert} className="rounded-2xl border border-[#233b57] bg-[#0e1e32] p-4 text-sm text-[#c2d7e9] hover:translate-x-1 hover:border-[#36d7ff]/60">
                  {alert}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Brand />
            </div>
            <Card className="rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Welcome back</p>
              <h2 className="mt-3 text-4xl font-black tracking-tight">Login</h2>
              <p className="mt-3 leading-7 text-[#8fa8c2]">Use your registered NomadPoint account to continue planning.</p>

              <form className="mt-8 grid gap-5" onSubmit={handleLogin}>
                <Field label="Email" name="email" placeholder="you@example.com" type="email" />
                <Field label="Password" name="password" placeholder="Your password" type="password" />
                <div className="flex flex-col gap-3 text-sm xs:flex-row xs:items-center xs:justify-between">
                  <Checkbox isSelected={rememberMe} onChange={setRememberMe} className="text-[#8fa8c2]">
                    Keep me signed in
                  </Checkbox>
                  <Link href="/register" className="font-bold text-[#36d7ff]">Create account</Link>
                </div>
                {status.message ? (
                  <p className={`rounded-2xl border px-4 py-3 text-sm font-bold ${status.type === "error" ? "border-[#ff7896]/40 bg-[#ff7896]/10 text-[#ff9db2]" : "border-[#a3ff6f]/40 bg-[#a3ff6f]/10 text-[#a3ff6f]"}`}>
                    {status.message}
                  </p>
                ) : null}
                <Button type="submit" isDisabled={isSubmitting} className="rounded-2xl bg-[#36d7ff] px-5 py-4 font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f]">
                  {isSubmitting ? "Checking account..." : "Open cockpit"}
                </Button>
                <Button type="button" variant="bordered" className="rounded-2xl border-[#233b57] bg-[#07111f] px-5 py-4 font-black text-white hover:-translate-y-1 hover:border-[#36d7ff]">
                  Continue with Google
                </Button>
              </form>
            </Card>
          </div>
        </section>
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
