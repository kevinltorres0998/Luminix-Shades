import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";
const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime", "application/pdf"];

export async function POST(request: Request) {
  const body = await request.json() as HandleUploadBody;
  try {
    const response = await handleUpload({
      body, request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const submissionId = String(clientPayload || "");
        if (!/^[0-9a-f-]{36}$/i.test(submissionId) || !pathname.startsWith(`project-inquiries/${submissionId}/`)) throw new Error("Invalid upload path");
        return { allowedContentTypes: allowed, maximumSizeInBytes: 25 * 1024 * 1024, addRandomSuffix: true };
      },
      onUploadCompleted: async () => undefined,
    });
    return Response.json(response);
  } catch (error) {
    console.error("project_file_upload_failed", { error: error instanceof Error ? error.name : "unknown" });
    return Response.json({ error: "File upload could not be completed." }, { status: 400 });
  }
}
