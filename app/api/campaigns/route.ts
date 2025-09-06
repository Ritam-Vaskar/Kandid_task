import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { campaigns } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { type Session } from "@/lib/auth";

async function getSession(req: Request): Promise<Session | null> {
  try {
    const response = await auth.handler(req);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const result = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, session.user.id),
      with: {
        leads: true,
      },
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CAMPAIGNS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, status } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const campaign = await db.insert(campaigns).values({
      name,
      description,
      status: status || "draft",
      userId: session.user.id,
    }).returning();

    return NextResponse.json(campaign[0]);
  } catch (error) {
    console.error("[CAMPAIGNS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
