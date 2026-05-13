import mongoose, { Schema, type InferSchemaType } from "mongoose";

const founderSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, default: "" },
    linkedIn: { type: String },
  },
  { _id: false },
);

const fundingRoundSchema = new Schema(
  {
    round: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: String, required: true },
    investors: { type: [String], default: [] },
  },
  { _id: false },
);

const startupSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    sector: { type: String, required: true },
    stage: {
      type: String,
      enum: ["Pre-seed", "Seed", "Series A", "Series B", "Grant"],
      required: true,
    },
    description: { type: String, default: "" },
    mission: { type: String, default: "" },
    vision: { type: String, default: "" },
    brandLogoUrl: { type: String },
    logoLetter: { type: String, default: "?" },
    engagementScore: { type: Number, default: 50 },
    founder: { type: founderSchema, required: true },
    funding: { type: [fundingRoundSchema], default: [] },
  },
  { timestamps: true },
);

startupSchema.index({ engagementScore: -1 });
startupSchema.index({ country: 1, sector: 1 });

export type StartupDoc = InferSchemaType<typeof startupSchema> & { _id: mongoose.Types.ObjectId };

const newsSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    summary: { type: String, required: true },
    category: {
      type: String,
      enum: ["Funding", "Launch", "Tech", "Events"],
      required: true,
    },
    publishedAt: { type: Date, required: true },
    startupId: { type: Schema.Types.ObjectId, ref: "Startup", required: true },
    trending: { type: Boolean, default: false },
    body: { type: [String], default: [] },
    coverImage: { type: String, required: true },
    imageAlt: { type: String },
    translations: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

newsSchema.index({ publishedAt: -1 });
newsSchema.index({ startupId: 1 });

export type NewsDoc = InferSchemaType<typeof newsSchema> & { _id: mongoose.Types.ObjectId };

const insightSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    dek: { type: String, required: true },
    readTime: { type: String, required: true },
    author: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    feeling: { type: String, required: true },
    mood: { type: String, required: true },
    moodKind: {
      type: String,
      enum: ["tension", "hope", "clarity", "care"],
      required: true,
    },
    pullQuote: { type: String, required: true },
  },
  { timestamps: true },
);

insightSchema.index({ publishedAt: -1 });

export type InsightDoc = InferSchemaType<typeof insightSchema> & { _id: mongoose.Types.ObjectId };

/** Public form pitches (reviewed in admin before publishing). */
const submissionSchema = new Schema(
  {
    kind: { type: String, enum: ["startup", "news"], required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "dismissed"],
      default: "pending",
    },
    contactEmail: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    /** e.g. file count when uploads are not stored server-side */
    attachmentHint: { type: String },
  },
  { timestamps: true },
);

submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ kind: 1, createdAt: -1 });

export type SubmissionDoc = InferSchemaType<typeof submissionSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const StartupModel =
  mongoose.models.Startup ?? mongoose.model("Startup", startupSchema);
export const NewsModel = mongoose.models.NewsArticle ?? mongoose.model("NewsArticle", newsSchema);
export const InsightModel = mongoose.models.InsightPost ?? mongoose.model("InsightPost", insightSchema);
export const SubmissionModel =
  mongoose.models.Submission ?? mongoose.model("Submission", submissionSchema);
