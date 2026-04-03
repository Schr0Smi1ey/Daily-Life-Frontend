import { motion } from "framer-motion";
import Spinner from "./Spinner";

const VARIANT_STYLES = {
  accent:
    "border border-transparent bg-[var(--color-primary)] text-black shadow-[0_12px_30px_rgba(var(--color-primary-rgb),0.28)] hover:opacity-95",
  ghost:
    "border border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:border-white/20 dark:hover:bg-white/[0.06] dark:hover:text-white",
  danger:
    "border border-red-500/25 bg-red-500/[0.06] text-red-600 hover:border-red-500/40 hover:bg-red-500 hover:text-white dark:text-red-300",
  success:
    "border border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-600 hover:border-emerald-500/40 hover:bg-emerald-500 hover:text-white dark:text-emerald-300",
};

const SIZE_STYLES = {
  sm: "h-9 px-3.5 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

const ICON_SIZE_STYLES = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

function ButtonContent({ icon, iconPosition, isLoading, size, children }) {
  return (
    <span className="relative z-10 inline-flex items-center justify-center gap-2">
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : null}

      {!isLoading && icon && iconPosition === "left" ? (
        <span
          className={`${ICON_SIZE_STYLES[size]} inline-flex items-center justify-center`}
        >
          {icon}
        </span>
      ) : null}

      <span>{isLoading ? "Loading..." : children}</span>

      {!isLoading && icon && iconPosition === "right" ? (
        <span
          className={`${ICON_SIZE_STYLES[size]} inline-flex items-center justify-center`}
        >
          {icon}
        </span>
      ) : null}
    </span>
  );
}

export default function Button({
  children,
  onClick,
  variant = "accent",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  isLoading = false,
  loading,
  icon = null,
  iconPosition = "left",
  fullWidth = false,
}) {
  const resolvedLoading = loading ?? isLoading;
  const isDisabled = disabled || resolvedLoading;

  const baseStyles =
    "group relative inline-flex items-center justify-center overflow-hidden rounded-2xl font-semibold tracking-tight transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-45";
  const widthStyles = fullWidth ? "w-full" : "";
  const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.accent;
  const sizeStyles = SIZE_STYLES[size] || SIZE_STYLES.md;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { y: -1, scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.985 } : {}}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className}`}
    >
      <span className="absolute inset-0 rounded-2xl bg-white/0 transition-all duration-300 group-hover:bg-white/[0.06]" />
      <span className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <ButtonContent
        icon={icon}
        iconPosition={iconPosition}
        isLoading={resolvedLoading}
        size={size}
      >
        {children}
      </ButtonContent>
    </motion.button>
  );
}
