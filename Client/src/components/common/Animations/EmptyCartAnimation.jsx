import { motion } from "framer-motion";
import { ShoppingCartIcon } from "lucide-react";

const EmptyCartAnimation = () => {
  return (
    <div className="relative w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 sm:mb-8">
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <ShoppingCartIcon className="w-28 h-28 sm:w-32 sm:h-32 text-customColorTertiarypop" />
      </motion.div>

      {/* Yellow Dot */}
      <motion.div
        className="absolute top-0 left-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Custom Primary Color Dot */}
      <motion.div
        className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 bg-customP2Primary rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />

      {/* Red Dot */}
      <motion.div
        className="absolute top-1/4 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
        }}
      />
    </div>
  );
};

export default EmptyCartAnimation;
