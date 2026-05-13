export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex w-full flex-col items-center justify-center px-4 py-14 sm:min-h-[calc(100dvh-10rem)] sm:py-20">
      {/* Soft spotlight behind the card */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[min(380px,55vh)] max-w-3xl bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--color-primary)_14%,transparent)_0%,transparent_68%)] opacity-90 dark:bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklch,var(--color-primary)_22%,transparent)_0%,transparent_70%)]"
        aria-hidden
      />
      <div className="relative z-[1] w-full max-w-[400px]">{children}</div>
    </div>
  );
}
