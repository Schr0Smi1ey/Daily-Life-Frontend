export default function PageHeader({
  title,
  subtitle,
  children,
  align = "start",
}) {
  const isCentered = align === "center";

  return (
    <div
      className={`mb-8 flex flex-col gap-5 md:gap-6 ${
        isCentered
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={isCentered ? "max-w-2xl" : "min-w-0"}>
        <div className="mb-3 flex items-center gap-3">
          <span
            className="h-px w-12 rounded-full opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          />
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500 dark:text-zinc-400">
            Overview
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 dark:text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p
            className={`mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-[15px] ${
              isCentered ? "mx-auto max-w-2xl" : "max-w-2xl"
            }`}
          >
            {subtitle}
          </p>
        )}

        <div className="mt-5">
          <div className="h-1.5 w-16 rounded-full bg-zinc-200 dark:bg-white/10">
            <div
              className="h-1.5 w-10 rounded-full"
              style={{ backgroundColor: "var(--color-primary)" }}
            />
          </div>
        </div>
      </div>

      {children ? (
        <div
          className={`flex flex-wrap items-center gap-3 ${
            isCentered ? "justify-center" : "md:justify-end"
          }`}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
