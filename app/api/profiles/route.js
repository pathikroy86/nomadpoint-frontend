import { auth, db, ensureDbConnected } from "../../lib/auth";

const allowedRoles = new Set(["nomad", "expert"]);
const editableFields = [
    "role",
    "passportCountry",
    "monthlyBudget",
    "workSchedule",
    "preferredRegions",
    "priorities",
    "profilePicture",
];
const maxProfilePictureLength = 900_000;
const profilePicturePattern = /^data:image\/(png|jpe?g|webp);base64,/i;

function isProfilePictureUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && ["ibb.co", "i.ibb.co"].includes(url.hostname);
    } catch {
        return false;
    }
}

async function getSession(request) {
    return auth.api.getSession({
        headers: request.headers,
    });
}

function normalizeProfile(profile, sessionUser) {
    const fallbackName = sessionUser?.name || "";
    const fallbackEmail = sessionUser?.email || "";

    return {
        name: profile?.name || fallbackName,
        email: profile?.email || fallbackEmail,
        role: allowedRoles.has(profile?.role) ? profile.role : "nomad",
        passportCountry: profile?.passportCountry || "",
        monthlyBudget: profile?.monthlyBudget || "",
        workSchedule: profile?.workSchedule || "",
        preferredRegions: profile?.preferredRegions || "",
        priorities: Array.isArray(profile?.priorities) ? profile.priorities : [],
        profilePicture: profile?.profilePicture || "",
    };
}

function normalizeProfilePicture(value) {
    const profilePicture = String(value || "").trim();

    if (!profilePicture) {
        return "";
    }

    if (
        profilePicture.length > maxProfilePictureLength ||
        (!profilePicturePattern.test(profilePicture) &&
            !isProfilePictureUrl(profilePicture))
    ) {
        throw new Error("Profile picture must be a valid hosted PNG, JPG, or WebP image.");
    }

    return profilePicture;
}

export async function GET(request) {
    await ensureDbConnected();

    const session = await getSession(request);

    if (!session?.user?.email) {
        return Response.json({ message: "You need to login first." }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const profile = await db.collection("profiles").findOne({ email });

    return Response.json({
        profile: normalizeProfile(profile, session.user),
    });
}

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

export async function PATCH(request) {
    await ensureDbConnected();

    const session = await getSession(request);

    if (!session?.user?.email) {
        return Response.json({ message: "You need to login first." }, { status: 401 });
    }

    const body = await request.json();
    const email = session.user.email.toLowerCase();
    const profile = {
        name: session.user.name || "",
        email,
        updatedAt: new Date(),
    };
    let validationError = "";

    editableFields.forEach((field) => {
        if (body[field] === undefined) {
            return;
        }

        if (field === "role") {
            profile.role = allowedRoles.has(body.role) ? body.role : "nomad";
            return;
        }

        if (field === "priorities") {
            profile.priorities = Array.isArray(body.priorities)
                ? body.priorities.map(String)
                : [];
            return;
        }

        if (field === "profilePicture") {
            try {
                profile.profilePicture = normalizeProfilePicture(body.profilePicture);
            } catch (error) {
                validationError = error.message;
            }
            return;
        }

        profile[field] = String(body[field] || "").trim();
    });

    if (validationError) {
        return Response.json({ message: validationError }, { status: 400 });
    }

    await db.collection("profiles").updateOne(
        { email },
        {
            $set: profile,
            $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
    );

    const savedProfile = await db.collection("profiles").findOne({ email });

    return Response.json({
        profile: normalizeProfile(savedProfile, session.user),
    });
}
