export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-4xl font-black tracking-widest text-zinc-900 dark:text-white leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>
        )}
        <div
          className="h-1 w-10 rounded-full mt-3"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
      </div>
      {children && (
        <div className="flex items-center gap-3">{children}</div>
      )}
    </div>
  )
}