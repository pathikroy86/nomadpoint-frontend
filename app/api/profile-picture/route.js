import { auth } from "../../lib/auth";

export const runtime = "nodejs";

const maxPictureSize = 5_000_000;

async function getSession(request) {
    return auth.api.getSession({
        headers: request.headers,
    });
}

export async function POST(request) {
    const session = await getSession(request);

    if (!session?.user?.email) {
        return Response.json({ message: "You need to login first." }, { status: 401 });
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
        return Response.json(
            { message: "Image upload is not configured." },
            { status: 500 }
        );
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || typeof image.arrayBuffer !== "function") {
        return Response.json({ message: "Please choose an image file." }, { status: 400 });
    }

    if (!image.type?.startsWith("image/")) {
        return Response.json({ message: "Please choose a valid image file." }, { status: 400 });
    }

    if (image.size > maxPictureSize) {
        return Response.json(
            { message: "Use an image under 5 MB for your profile picture." },
            { status: 400 }
        );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("image", image);

    const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: uploadFormData,
    });
    const payload = await uploadResponse.json().catch(() => null);

    if (!uploadResponse.ok || !payload?.success) {
        return Response.json(
            { message: payload?.error?.message || "Profile picture could not be uploaded." },
            { status: 502 }
        );
    }

    return Response.json({
        url: payload.data?.display_url || payload.data?.url || "",
        deleteUrl: payload.data?.delete_url || "",
    });
}
