import { db, ensureDbConnected } from "../../lib/auth";

const allowedRoles = new Set(["nomad", "expert"]);

export async function POST(request) {
    await ensureDbConnected();

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const role = allowedRoles.has(body.role) ? body.role : "nomad";

    if (!email || !name) {
        return Response.json(
            { message: "Name and email are required." },
            { status: 400 }
        );
    }

    const profile = {
        name,
        email,
        role,
        updatedAt: new Date(),
    };

    const optionalFields = [
        "passportCountry",
        "monthlyBudget",
        "workSchedule",
        "preferredRegions",
    ];

    optionalFields.forEach((field) => {
        if (body[field] !== undefined) {
            profile[field] = String(body[field] || "").trim();
        }
    });

    if (body.priorities !== undefined) {
        profile.priorities = Array.isArray(body.priorities)
            ? body.priorities.map(String)
            : [];
    }

    await db.collection("profiles").updateOne(
        { email },
        {
            $set: profile,
            $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
    );

    return Response.json({ profile });
}
