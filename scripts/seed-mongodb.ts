import { config } from "dotenv";

config({ path: ".env.local" });
config();

import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "../src/lib/db/connect";
import { InsightModel, NewsModel, StartupModel } from "../src/lib/db/models";
import { insights, newsItems, startups } from "../src/lib/mock-data";

async function main() {
  if (!isMongoConfigured()) {
    console.error("Set MONGODB_URI in .env.local first.");
    process.exit(1);
  }

  const force = process.env.FORCE_SEED === "1";
  await connectMongo();

  if (!force && (await StartupModel.countDocuments()) > 0) {
    console.log("Database already has startups. Set FORCE_SEED=1 to wipe and re-import mock fixtures.");
    await mongoose.disconnect();
    process.exit(0);
  }

  if (force) {
    await Promise.all([
      NewsModel.deleteMany({}),
      InsightModel.deleteMany({}),
      StartupModel.deleteMany({}),
    ]);
  }

  const idMap = new Map<string, mongoose.Types.ObjectId>();

  for (const s of startups) {
    const { id: oldId, ...rest } = s;
    const doc = await StartupModel.create(rest);
    idMap.set(oldId, doc._id as mongoose.Types.ObjectId);
  }

  for (const n of newsItems) {
    const ref = idMap.get(n.startupId);
    if (!ref) {
      console.warn("Skip news (unknown startupId):", n.startupId);
      continue;
    }
    await NewsModel.create({
      slug: n.slug,
      title: n.title,
      summary: n.summary,
      category: n.category,
      publishedAt: new Date(n.publishedAt),
      startupId: ref,
      trending: n.trending,
      body: n.body,
      coverImage: n.coverImage,
      imageAlt: n.imageAlt,
      translations: n.translations,
    });
  }

  for (const i of insights) {
    await InsightModel.create({
      slug: i.slug,
      title: i.title,
      dek: i.dek,
      readTime: i.readTime,
      author: i.author,
      publishedAt: new Date(i.publishedAt),
      feeling: i.feeling,
      mood: i.mood,
      moodKind: i.moodKind,
      pullQuote: i.pullQuote,
    });
  }

  console.log(
    `Seeded ${await StartupModel.countDocuments()} startups, ${await NewsModel.countDocuments()} news, ${await InsightModel.countDocuments()} insights.`,
  );
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
