import * as motion from "motion/react-client";

export default function FormLoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.25,
      }}
      className="fixed left-0 top-0 h-full w-full bg-primary/10"
    />
  );
}
