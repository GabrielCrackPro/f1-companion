import {
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";

// Animation configurations
export const ANIMATION_CONFIG = {
  fast: { duration: 200 },
  normal: { duration: 300 },
  slow: { duration: 500 },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  bounce: {
    damping: 8,
    stiffness: 300,
    mass: 0.8,
  },
};

// Easing functions
export const EASING = {
  ease: Easing.bezier(0.25, 0.1, 0.25, 1),
  easeIn: Easing.bezier(0.42, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
  bounce: Easing.bounce,
  elastic: Easing.elastic(1),
};

// Common animation functions
export const animations = {
  // Fade animations
  fadeIn: (delay = 0) => withDelay(delay, withTiming(1, ANIMATION_CONFIG.normal)),
  fadeOut: () => withTiming(0, ANIMATION_CONFIG.fast),
  
  // Scale animations
  scaleIn: (delay = 0) => withDelay(delay, withSpring(1, ANIMATION_CONFIG.spring)),
  scaleOut: () => withSpring(0, ANIMATION_CONFIG.spring),
  scalePress: () => withSpring(0.95, ANIMATION_CONFIG.bounce),
  scaleRelease: () => withSpring(1, ANIMATION_CONFIG.bounce),
  
  // Rotation animations
  rotate: (degrees: number) => withTiming(degrees, ANIMATION_CONFIG.normal),
  spin: () => withRepeat(withTiming(360, { duration: 1000 }), -1, false),
  
  // Slide animations
  slideIn: (direction: 'up' | 'down' | 'left' | 'right', delay = 0) => {
    const config = { ...ANIMATION_CONFIG.normal, easing: EASING.easeOut };
    return withDelay(delay, withTiming(0, config));
  },
  
  // Bounce animations
  bounce: () => withSequence(
    withSpring(1.1, ANIMATION_CONFIG.bounce),
    withSpring(1, ANIMATION_CONFIG.bounce)
  ),
  
  // Pulse animations
  pulse: () => withRepeat(
    withSequence(
      withTiming(1.1, ANIMATION_CONFIG.fast),
      withTiming(1, ANIMATION_CONFIG.fast)
    ),
    -1,
    true
  ),
  
  // Shake animations
  shake: () => withSequence(
    withTiming(-10, ANIMATION_CONFIG.fast),
    withTiming(10, ANIMATION_CONFIG.fast),
    withTiming(-10, ANIMATION_CONFIG.fast),
    withTiming(10, ANIMATION_CONFIG.fast),
    withTiming(0, ANIMATION_CONFIG.fast)
  ),
};

// Stagger animation for lists
export const createStaggerAnimation = (
  baseDelay: number,
  staggerDelay: number = 50
) => {
  return (index: number) => baseDelay + (index * staggerDelay);
};

// Parallax animation
export const createParallaxAnimation = (scrollY: any, speed: number = 0.5) => {
  return {
    transform: [
      {
        translateY: scrollY.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0, 0, speed],
        }),
      },
    ],
  };
};

// Theme transition animation
export const createThemeTransition = (isDark: boolean) => {
  return withTiming(isDark ? 1 : 0, {
    duration: 300,
    easing: EASING.easeInOut,
  });
};

// Loading animation sequence
export const createLoadingAnimation = () => {
  return withRepeat(
    withSequence(
      withTiming(1.2, ANIMATION_CONFIG.normal),
      withTiming(1, ANIMATION_CONFIG.normal)
    ),
    -1,
    true
  );
};

// Success animation
export const createSuccessAnimation = () => {
  return withSequence(
    withSpring(1.2, ANIMATION_CONFIG.bounce),
    withSpring(1, ANIMATION_CONFIG.bounce),
    withTiming(1.1, ANIMATION_CONFIG.fast),
    withTiming(1, ANIMATION_CONFIG.fast)
  );
};

// Error animation
export const createErrorAnimation = () => {
  return withSequence(
    withTiming(-5, ANIMATION_CONFIG.fast),
    withTiming(5, ANIMATION_CONFIG.fast),
    withTiming(-5, ANIMATION_CONFIG.fast),
    withTiming(5, ANIMATION_CONFIG.fast),
    withTiming(0, ANIMATION_CONFIG.fast)
  );
}; 