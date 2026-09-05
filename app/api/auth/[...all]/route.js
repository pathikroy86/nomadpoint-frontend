import { auth, ensureDbConnected } from "../../../lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";

const handler = toNextJsHandler(auth);

async function withDbConnection(requestHandler, request) {
    await ensureDbConnected();
    return requestHandler(request);
}

export const GET = (request) => withDbConnection(handler.GET, request);
export const POST = (request) => withDbConnection(handler.POST, request);
