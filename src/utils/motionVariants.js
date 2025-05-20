export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
}

export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
}

export const navbarVariants = {
  initial: { y: -20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      mass: 0.8
    }
  }
}

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
}

export const cardHover = {
  whileHover: {
    y: -5,
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 10 }
  },
  whileTap: { scale: 0.98 }
}

export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const listItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: index => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  })
}

export const heroContentVariants = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1
    }
  }
}

export const itemFade = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}
