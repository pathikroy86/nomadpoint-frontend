"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Card, Chip, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { authClient } from "../lib/auth-client";

const emptyProfile = {
  name: "",
  email: "",
  role: "nomad",
  passportCountry: "",
  monthlyBudget: "",
  workSchedule: "",
  preferredRegions: "",
  priorities: [],
  profilePicture: "",
};

const priorityOptions = [
  "Low cost",
  "Fast internet",
  "Visa clarity",
  "Warm climate",
  "Safety",
  "Community",
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState(emptyProfile);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = useMemo(() => {
    const name = profile.name || session?.user?.name || "NP";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile.name, session?.user?.name]);

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      return;
    }

    async function loadProfile() {
      setIsLoading(true);
      const response = await fetch("/api/profiles");
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setStatus({
          type: "error",
          message: payload?.message || "Profile could not be loaded.",
        });
        setIsLoading(false);
        return;
      }

      setProfile({
        ...emptyProfile,
        ...payload.profile,
        name: payload.profile?.name || session.user.name || "",
        email: payload.profile?.email || session.user.email || "",
      });
      setIsLoading(false);
    }

    loadProfile();
  }, [isPending, session?.user]);

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function togglePriority(priority) {
    setProfile((current) => {
      const priorities = current.priorities.includes(priority)
        ? current.priorities.filter((item) => item !== priority)
        : [...current.priorities, priority];

      return {
        ...current,
        priorities,
      };
    });
  }

  function handlePictureChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 1_000_000) {
      setStatus({
        type: "error",
        message: "Use an image under 1 MB for this demo profile.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateProfile("profilePicture", String(reader.result || ""));
      setStatus({ type: "idle", message: "" });
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    setStatus({ type: "idle", message: "" });

    const response = await fetch("/api/profiles", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        role: profile.role,
        passportCountry: profile.passportCountry,
        monthlyBudget: profile.monthlyBudget,
        workSchedule: profile.workSchedule,
        preferredRegions: profile.preferredRegions,
        priorities: profile.priorities,
        profilePicture: profile.profilePicture,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus({
        type: "error",
        message: payload?.message || "Profile could not be saved.",
      });
      setIsSaving(false);
      return;
    }

    setProfile({ ...emptyProfile, ...payload.profile });
    setStatus({ type: "success", message: "Profile saved. Your preferences are ready for the cockpit." });
    setIsSaving(false);
    router.refresh();
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  if (isPending || isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-[#eef7ff]">
        <Card className="w-full max-w-md rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-6 text-center text-white">
          <div className="mx-auto size-16 rounded-full border-4 border-[#36d7ff]/30 border-t-[#36d7ff]" />
          <h1 className="mt-5 text-2xl font-black">Loading your profile</h1>
          <p className="mt-2 text-sm text-[#8fa8c2]">Checking your NomadPoint session.</p>
        </Card>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#07111f] px-4 text-[#eef7ff]">
        <Card className="w-full max-w-lg rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-6 text-center text-white sm:p-8">
          <Brand />
          <h1 className="mt-8 text-3xl font-black tracking-tight">Login to edit your profile.</h1>
          <p className="mt-3 leading-7 text-[#8fa8c2]">
            Your preferences and profile picture are saved only after you sign in.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="rounded-2xl bg-[#36d7ff] px-6 py-4 font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f]">
              Login
            </Link>
            <Link href="/register" className="rounded-2xl border border-[#233b57] px-6 py-4 font-bold text-[#d8eaff] hover:-translate-y-1 hover:border-[#36d7ff]">
              Create account
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] font-sans text-[#eef7ff]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Brand />
        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-xl border border-[#233b57] px-3 py-2 text-sm font-bold text-[#d8eaff] hover:-translate-y-0.5 hover:border-[#36d7ff] sm:px-4">
            Home
          </Link>
          <Button
            type="button"
            isDisabled={isLoggingOut}
            onPress={handleLogout}
            className="rounded-xl bg-[#ff7896] px-3 py-2 text-sm font-black text-[#06111f] hover:-translate-y-0.5 hover:bg-[#a3ff6f] sm:px-4"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 pt-4 sm:px-6 lg:grid-cols-[.78fr_1.22fr] lg:pb-24 lg:pt-10">
        <aside className="space-y-5">
          <Card className="overflow-hidden rounded-[28px] border border-[#233b57] bg-[linear-gradient(135deg,#0b1c31,#112943_55%,#173641)] text-white shadow-[0_24px_70px_rgba(0,0,0,.28)]">
            <div className="h-28 bg-[linear-gradient(90deg,#36d7ff,#a3ff6f,#ff7896)]" />
            <div className="p-5 sm:p-6">
              <div className="-mt-16 flex items-end gap-4">
                <div className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-[30px] border-4 border-[#0b1c31] bg-[#07111f] text-3xl font-black text-[#36d7ff] shadow-[0_18px_45px_rgba(0,0,0,.32)]">
                  {profile.profilePicture ? (
                    <Image
                      src={profile.profilePicture}
                      alt=""
                      width={112}
                      height={112}
                      unoptimized
                      className="size-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="pb-2">
                  <Chip color="success" variant="flat" className="bg-[#a3ff6f]/10 text-xs font-black text-[#a3ff6f]">
                    Logged in
                  </Chip>
                </div>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight">{profile.name}</h1>
              <p className="mt-1 break-all text-sm font-semibold text-[#8fa8c2]">{profile.email}</p>

              <label className="mt-6 inline-flex cursor-pointer rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-3 text-sm font-black text-[#d8eaff] hover:-translate-y-1 hover:border-[#36d7ff]">
                Upload profile picture
                <input type="file" accept="image/*" className="sr-only" onChange={handlePictureChange} />
              </label>
            </div>
          </Card>

          <Card className="rounded-[24px] border border-[#233b57] bg-[#0e1e32] p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Profile pulse</p>
            <div className="mt-5 grid gap-3">
              <ProfileMetric label="Role" value={profile.role === "expert" ? "City Expert" : "Nomad"} />
              <ProfileMetric label="Regions" value={profile.preferredRegions || "Not set"} />
              <ProfileMetric label="Priorities" value={profile.priorities.length ? `${profile.priorities.length} selected` : "Not set"} />
            </div>
          </Card>
        </aside>

        <Card className="rounded-[28px] border border-[#233b57] bg-[#0e1e32] p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[.18em] text-[#36d7ff]">Edit profile</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Preferences and travel fit</h2>
            </div>
            <Chip color="primary" variant="flat" className="w-fit bg-[#36d7ff]/10 text-xs font-black text-[#36d7ff]">
              Saved profile
            </Chip>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSave}>
            <div className="grid gap-5 md:grid-cols-2">
              <ReadOnlyField label="Full name" value={profile.name} />
              <ReadOnlyField label="Email" value={profile.email} />
            </div>

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
                    onPress={() => updateProfile("role", value)}
                    className={`rounded-xl px-3 py-3 text-sm font-black ${profile.role === value ? "bg-[#36d7ff] text-[#06111f]" : "bg-transparent text-[#8fa8c2] hover:bg-[#0e1e32]"}`}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Passport country" value={profile.passportCountry} onChange={(value) => updateProfile("passportCountry", value)} placeholder="Bangladesh" />
              <Field label="Monthly budget" value={profile.monthlyBudget} onChange={(value) => updateProfile("monthlyBudget", value)} placeholder="$1,800 - $2,400" />
              <Field label="Work schedule" value={profile.workSchedule} onChange={(value) => updateProfile("workSchedule", value)} placeholder="UTC+6 mornings" />
              <Field label="Preferred regions" value={profile.preferredRegions} onChange={(value) => updateProfile("preferredRegions", value)} placeholder="Europe, Southeast Asia" />
            </div>

            <div className="grid gap-3">
              <span className="text-sm font-bold text-[#c2d7e9]">Decision priorities</span>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((priority) => {
                  const selected = profile.priorities.includes(priority);

                  return (
                    <Button
                      key={priority}
                      type="button"
                      onPress={() => togglePriority(priority)}
                      className={`rounded-full border px-4 py-2 text-sm font-black ${selected ? "border-[#a3ff6f] bg-[#a3ff6f] text-[#06111f]" : "border-[#233b57] bg-[#07111f] text-[#8fa8c2] hover:border-[#36d7ff] hover:text-white"}`}
                    >
                      {priority}
                    </Button>
                  );
                })}
              </div>
            </div>

            {status.message ? (
              <p className={`rounded-2xl border px-4 py-3 text-sm font-bold ${status.type === "error" ? "border-[#ff7896]/40 bg-[#ff7896]/10 text-[#ff9db2]" : "border-[#a3ff6f]/40 bg-[#a3ff6f]/10 text-[#a3ff6f]"}`}>
                {status.message}
              </p>
            ) : null}

            <Button type="submit" isDisabled={isSaving} className="rounded-2xl bg-[#36d7ff] px-5 py-4 font-black text-[#06111f] hover:-translate-y-1 hover:bg-[#a3ff6f]">
              {isSaving ? "Saving profile..." : "Save profile"}
            </Button>
          </form>
        </Card>
      </section>
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

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
      {label}
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-4 text-white placeholder:text-[#59748e] focus:border-[#36d7ff]"
      />
    </label>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#c2d7e9]">
      {label}
      <Input
        value={value}
        isReadOnly
        readOnly
        className="rounded-2xl border border-[#233b57] bg-[#07111f] px-4 py-4 text-[#8fa8c2]"
      />
    </label>
  );
}

function ProfileMetric({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#233b57] bg-[#07111f] p-4">
      <span className="block text-[11px] font-bold text-[#8fa8c2]">{label}</span>
      <strong className="mt-1 block text-sm">{value}</strong>
    </div>
  );
}
