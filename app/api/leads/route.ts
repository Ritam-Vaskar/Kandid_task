import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { leads, campaigns } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
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

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get("campaignId");

    if (campaignId) {
      const campaign = await db.query.campaigns.findFirst({
        where: and(
          eq(campaigns.id, campaignId),
          eq(campaigns.userId, session.user.id)
        ),
      });

      if (!campaign) {
        return new NextResponse("Campaign not found", { status: 404 });
      }

      const result = await db.query.leads.findMany({
        where: eq(leads.campaignId, campaignId),
        with: {
          campaign: {
            columns: {
              id: true,
              name: true,
              status: true,
            }
          }
        },
        orderBy: (leads, { desc }) => [desc(leads.createdAt)],
      });

      return NextResponse.json(result);
    }

    // Get all leads from user's campaigns
    const userCampaigns = await db.query.campaigns.findMany({
      where: eq(campaigns.userId, session.user.id),
      columns: { id: true },
    });

    const campaignIds = userCampaigns.map(c => c.id);
    
    const result = await db.query.leads.findMany({
      where: eq(leads.campaignId, campaignIds[0]), // Temporarily using first campaign ID
      with: {
        campaign: {
          columns: {
            id: true,
            name: true,
            status: true,
          }
        }
      },
      orderBy: (leads, { desc }) => [desc(leads.createdAt)],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[LEADS_GET]", error);
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
    const { name, email, company, campaignId } = body;

    if (!name || !campaignId) {
      return new NextResponse("Name and campaign ID are required", { status: 400 });
    }

    // Verify campaign belongs to user
    const campaign = await db.query.campaigns.findFirst({
      where: and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      ),
    });

    if (!campaign) {
      return new NextResponse("Campaign not found", { status: 404 });
    }

    const lead = await db.insert(leads).values({
      name,
      email,
      company,
      campaignId,
    }).returning();

    // Update campaign lead count
    await db.update(campaigns)
      .set({
        totalLeads: campaign.totalLeads + 1,
      })
      .where(eq(campaigns.id, campaignId));

    return NextResponse.json(lead[0]);
  } catch (error) {
    console.error("[LEADS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
