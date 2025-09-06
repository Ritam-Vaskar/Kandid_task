import { db } from "./index";
import { campaigns, leads } from "./schema";
import { faker } from "@faker-js/faker";

export async function seedDatabase(userId: string) {
  // Create some sample campaigns
  const campaignIds = await Promise.all(
    Array.from({ length: 5 }).map(async () => {
      const [campaign] = await db.insert(campaigns).values({
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        status: faker.helpers.arrayElement(["draft", "active", "paused", "completed"]),
        userId,
      }).returning({ id: campaigns.id });
      return campaign.id;
    })
  );

  // Create some sample leads for each campaign
  await Promise.all(
    campaignIds.flatMap((campaignId) =>
      Array.from({ length: faker.number.int({ min: 5, max: 15 }) }).map(() =>
        db.insert(leads).values({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          company: faker.company.name(),
          status: faker.helpers.arrayElement(["pending", "contacted", "responded", "converted"]),
          campaignId,
          lastContactDate: faker.date.recent(),
          notes: faker.lorem.paragraph(),
          linkedinUrl: `https://linkedin.com/in/${faker.internet.username()}`,
        })
      )
    )
  );
}
