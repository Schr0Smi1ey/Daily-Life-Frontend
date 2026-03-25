export default function Button({
  children, onClick, variant = 'accent',
  size = 'md', type = 'button', disabled = false, className = ''
}) {
  const base = 'font-semibold rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    accent:  'bg-[var(--color-primary)] hover:opacity-90 text-black',
    ghost:   'bg-transparent border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white dark:text-zinc-400 dark:hover:text-white',
    danger:  'bg-transparent border border-red-500/40 hover:bg-red-500 text-red-400 hover:text-white',
    success: 'bg-transparent border border-green-500/40 hover:bg-green-500 text-green-400 hover:text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}