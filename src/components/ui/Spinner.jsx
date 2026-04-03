import { FadeLoader } from "react-spinners";
import { motion } from "framer-motion";

export default function Spinner({
  size = "md",
  fullScreen = false,
  text = "",
}) {
  const sizeMap = {
    sm: 16,
    md: 28,
    lg: 40,
    xl: 56,
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <motion.div
        initial={{ opacity: 0.8, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <FadeLoader
          size={sizeMap[size]}
          color="var(--color-primary)"
          speedMultiplier={0.9}
        />
      </motion.div>

      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-zinc-500 dark:text-zinc-400"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
