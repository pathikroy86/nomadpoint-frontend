"use client";

import Link from "next/link";
import { Button, Card, Chip, Input } from "@heroui/react";
import { useMemo, useState } from "react";

const priorities = ["Affordable", "Fast internet", "Community", "Mild weather"];

export default function RegisterPage() {
  const [role, setRole] = useState("nomad");
  const [selectedPriorities, setSelectedPriorities] = useState(["Affordable", "Fast internet", "Community"]);

  const progress = useMemo(() => 45 + selectedPriorities.length * 12 + (role === "expert" ? 7 : 0), [role, selectedPriorities.length]);

  function togglePriority(priority) {
    setSelectedPriorities((current) =>
      current.includes(priority)
        ? current.filter((item) => item !== priority)
        : [...current, priority]
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-8 lg:py-8">
        <Card className="rounded-[30px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-6 lg:p-10">
          <Brand />
          <div className="mt-10 lg:mt-14">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#a3ff6f]">New account</p>
            <h1 className="mt-4 text-4xl font-black leading-[.98] tracking-tight sm:text-5xl">
              Build a decision profile in one pass.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#a9c2d9] sm:text-lg sm:leading-8">
              Registration captures the first recommendation signals: nationality,
              budget, work schedule, preferred regions, and lifestyle priorities.
            </p>
          </div>
          <div className="mt-8 rounded-3xl border border-white/10 bg-[#07111f]/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-black">Profile preview</span>
              <Chip color="primary" variant="flat" className="bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">{Math.min(progress, 96)}% ready</Chip>
            </div>
            <div className="h-2 rounded-full bg-[#071523]">
              <div className="h-2 rounded-full bg-[linear-gradient(90deg,#36d7ff,#a3ff6f)]" style={{ width: `${Math.min(progress, 96)}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PreviewItem label="Role" value={role === "nomad" ? "Nomad" : "City Expert"} />
              <PreviewItem label="Budget" value="$2,400 / month" />
              <PreviewItem label="Passport" value="Bangladesh" />
              <PreviewItem label="Priorities" value={`${selectedPriorities.length} selected`} />
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

          <form className="mt-8 grid gap-5 md:grid-cols-2">
            <Field label="Full name" value="Pathik Rahman" />
            <Field label="Email" value="pathik@nomadpoint.app" type="email" />
            <Field label="Password" value="nomadpoint-demo" type="password" />
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
            <Field label="Passport country" value="Bangladesh" />
            <Field label="Monthly budget" value="$2,400" />
            <Field label="Work schedule" value="Europe overlap" />
            <Field label="Preferred regions" value="Europe, Southeast Asia" />
            <div className="md:col-span-2">
              <p className="mb-3 text-sm font-bold text-[#c2d7e9]">Top priorities</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {priorities.map((item) => (
                  <Button
                    key={item}
                    type="button"
                    onPress={() => togglePriority(item)}
                    className={`h-auto justify-start rounded-2xl border px-4 py-3 text-left text-sm font-bold hover:-translate-y-1 ${selectedPriorities.includes(item) ? "border-[#36d7ff] bg-[#36d7ff]/12 text-white" : "border-[#233b57] bg-[#07111f] text-[#8fa8c2]"}`}
                  >
                    {item}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="button" className="rounded-2xl bg-[#36d7ff] px-5 py-4 font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f] md:col-span-2">
              Create my first shortlist
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

function Field({ label, value, type = "text" }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
      {label}
      <Input className="rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-4 text-white placeholder:text-[#59748e] focus:border-[#36d7ff]" defaultValue={value} type={type} />
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
