import { auth } from "@/lib/auth";
import { seedDatabase } from "@/lib/db/seed";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.handler(req);
    if (!session.ok) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const data = await session.json();
    await seedDatabase(data.user.id);
    
    return new NextResponse("Database seeded successfully", { status: 200 });
  } catch (error) {
    console.error("[SEED_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
