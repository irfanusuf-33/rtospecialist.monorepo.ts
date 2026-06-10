"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type MotionProps = {
  children: ReactNode;
  className?: string;
};

export function MotionSection ({ children, className }: MotionProps) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStagger ({ children, className }: MotionProps) {
  return (
    <motion.div
      className={className}
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem ({ children, className }: MotionProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function MotionArticle ({ children, className }: MotionProps) {
  return (
    <motion.article className={className} variants={itemVariants}>
      {children}
    </motion.article>
  );
}

export function MotionEcosystemCard ({
  children,
  className,
  index,
}: MotionProps & { index: number }) {
  return (
    <motion.article
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          x: index === 1 ? 0 : index % 2 === 0 ? -60 : 60,
          y: index === 1 ? 44 : 18,
          rotate: index === 1 ? 0 : index % 2 === 0 ? -3 : 3,
          scale: 0.9,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 150,
            damping: 18,
            mass: 0.9,
          },
        },
      }}
    >
      {children}
    </motion.article>
  );
}

export function MotionStructuredCard ({
  children,
  className,
  index,
}: MotionProps & { index: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          x: index % 2 === 0 ? 54 : -54,
          y: 20,
          scale: 0.94,
          filter: "blur(6px)",
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 135,
            damping: 20,
            mass: 0.95,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionExploreServiceCard ({
  children,
  className,
  index,
}: MotionProps & { index: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: 34,
          scale: 0.88,
          rotateX: index % 2 === 0 ? 8 : -8,
          filter: "blur(8px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.52,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      style={{ transformPerspective: 1000 }}
    >
      {children}
    </motion.div>
  );
}
