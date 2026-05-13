import mongoose from "mongoose";
import { connectMongo, isMongoConfigured } from "@/lib/db/connect";
import { SubmissionModel, type SubmissionDoc } from "@/lib/db/models";
import { setSubmissionStatus } from "@/app/admin/actions";

function payloadPreview(payload: unknown): string {
  try {
    return JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}

function titleForRow(doc: SubmissionDoc): string {
  const p = doc.payload as Record<string, unknown> | null | undefined;
  if (doc.kind === "startup" && p && typeof p.companyName === "string") {
    return p.companyName;
  }
  if (doc.kind === "news" && p && typeof p.headline === "string") {
    return p.headline;
  }
  return doc.kind === "startup" ? "Startup pitch" : "News tip";
}

export default async function AdminSubmissionsPage() {
  if (!isMongoConfigured()) {
    return (
      <p className="text-sm text-[var(--muted-foreground)]">
        Connect MongoDB to review public form submissions.
      </p>
    );
  }
  await connectMongo();
  const rows = await SubmissionModel.find().sort({ createdAt: -1 }).limit(200).lean();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Submissions</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Tips from the public submit flow appear here as pending until you mark them reviewed.
          </p>
        </div>
      </div>

      <ul className="mt-8 space-y-6">
        {rows.length === 0 && (
          <li className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-8 text-sm text-[var(--muted-foreground)]">
            No submissions yet.
          </li>
        )}
        {rows.map((row) => {
          const id = (row._id as mongoose.Types.ObjectId).toString();
          const doc = row as unknown as SubmissionDoc;
          const created = row.createdAt
            ? new Date(row.createdAt as string | Date).toLocaleString()
            : "";
          return (
            <li
              key={id}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-[var(--foreground)]">{titleForRow(doc)}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {doc.kind} · {doc.contactEmail}
                    {created ? ` · ${created}` : ""}
                  </p>
                  {doc.attachmentHint ? (
                    <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">{doc.attachmentHint}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      doc.status === "pending"
                        ? "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950/50 dark:text-amber-100"
                        : doc.status === "reviewed"
                          ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                          : "rounded-full bg-[var(--muted)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted-foreground)]"
                    }
                  >
                    {doc.status}
                  </span>
                  {doc.status !== "reviewed" && (
                    <form action={setSubmissionStatus}>
                      <input type="hidden" name="id" value={id} />
                      <input type="hidden" name="status" value="reviewed" />
                      <button
                        type="submit"
                        className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)]/50"
                      >
                        Mark reviewed
                      </button>
                    </form>
                  )}
                  {doc.status !== "dismissed" && (
                    <form action={setSubmissionStatus}>
                      <input type="hidden" name="id" value={id} />
                      <input type="hidden" name="status" value="dismissed" />
                      <button
                        type="submit"
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        Dismiss
                      </button>
                    </form>
                  )}
                  {doc.status !== "pending" && (
                    <form action={setSubmissionStatus}>
                      <input type="hidden" name="id" value={id} />
                      <input type="hidden" name="status" value="pending" />
                      <button
                        type="submit"
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:underline"
                      >
                        Re-open
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words bg-[var(--background)] px-4 py-3 font-mono text-[11px] leading-relaxed text-[var(--muted-foreground)]">
                {payloadPreview(doc.payload)}
              </pre>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
