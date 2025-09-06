import { auth } from "@/lib/auth";

// Create a generic handler for all HTTP methods
async function handler(request: Request) {
  return auth.handler(request);
}

// Export handler for all HTTP methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;

export async function generateStaticParams() {
  return [
    { email: "sign-up" },
  ];
}
