import { useEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold: number = 0.1) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Optionally unobserve after first intersection
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px'
      }
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};

export const useStaggeredScrollAnimation = (delay: number = 100) => {
  const [animationIndex, setAnimationIndex] = useState(0);
  const { elementRef, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimationIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  return { elementRef, isVisible, animationIndex };
};
