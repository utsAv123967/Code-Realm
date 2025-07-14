import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// GsapPage.js - Updated version
export function GsapPage() {
  const tl = gsap.timeline();

  // Page entrance animation
  tl.from("#main", {
    opacity: 0,
    y: "100vh",
    delay: 0.2,
    duration: 0.7,
    ease: "power2.out",
    backgroundColor: "rgb(0, 0, 0)",
  });

  // Pic1 entrance + bounce
  tl.from("#pic1", {
    y: "-20vh",
    opacity: 0,
    scale: 0.2,
    duration: 0.8,
    ease: "bounce.out",
  })
    .to("#pic1", { y: -30, duration: 0.2 })
    .to("#pic1", { y: 0, duration: 0.2, ease: "power1.out" })
    .to("#pic1", { y: -10, duration: 0.15 })
    .to("#pic1", { y: 0, duration: 0.15, ease: "power1.out" });

  // Text split animation
  const chars = "CODE-REALM"
    .split("")
    .map((_, i) => document.getElementById(`char-${i}`));

  tl.set("#split", { opacity: 1 });

  chars.forEach((char) => {
    gsap.set(char, {
      opacity: 0,
      x: gsap.utils.random(-200, 200),
      y: gsap.utils.random(-200, 200),
      rotation: gsap.utils.random(-90, 90),
      scale: 2,
    });
  });

  tl.to(chars, {
    opacity: 1,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    ease: "back.out(1.7)",
    stagger: 0.1,
    duration: 0.5,
    delay: 0.5,
  });
}

// Horizontal scroll animation for cards - Corrected Version
// Horizontal scroll animation for cards - Final Corrected Version
export function GsapForCards(parentRef: HTMLDivElement | undefined) {
  if (!parentRef) return;
  
  const cards = Array.from(parentRef.querySelectorAll(".card"));
  const totalCards = cards.length;
  if (totalCards < 2) return;

  // Get viewport and card dimensions
  const viewportWidth = window.innerWidth;
  const cardWidth = 0.8 * viewportWidth;

  // Position all cards at the center initially
  cards.forEach((card, index) => {
    const centerOffset = (viewportWidth - cardWidth) / 2;
    
    gsap.set(card, {
      position: "absolute",
      left: centerOffset,
      width: cardWidth,
      x: 0,
      opacity: index === 0 ? 1 : 0, // Only first card visible
      skewY: 0, // Reset skew
    });
  });

  // Set container to viewport width
  gsap.set(parentRef, {
    width: "100vw",
    height: "80vh",
    overflow: "hidden",
  });

  // Calculate proper timeline duration - each card transition takes 1 unit of time
  const timelineLength = totalCards - 1;
  const scrollDistance = viewportWidth * timelineLength;

  // Create main timeline
  const mainTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#supported_languages_section",
      start: "top top",
      end: `+=${scrollDistance}`,
      pin: true,
      scrub: 2,
      markers: true,
      snap: {
        snapTo: (progress) => {
          const snapPoints = [];
          for (let i = 0; i < totalCards; i++) {
            snapPoints.push(i / (totalCards - 1));
          }
          return gsap.utils.snap(snapPoints, progress);
        },
        duration: { min: 0.2, max: 0.6 },
        ease: "power2.out",
        delay: 0.1,
      },
    },
  });

  const posi = viewportWidth;
  
  // Create card transitions - each card gets exactly 1 unit of timeline time
  for (let i = 0; i < totalCards - 1; i++) {
    const currentCard = cards[i];
    const nextCard = cards[i + 1];
    const startTime = i;
    
    // Current card exits
    mainTL.to(currentCard, {
      x: -posi,
      opacity: 0,
      skewY: -30,
      zIndex: -1, // Ensure it goes behind the next card
      duration: 0.8,
      ease: "power2.inOut",
    }, startTime);
    
    // Next card enters
    mainTL.fromTo(nextCard, {
      x: posi,
      opacity: 0, // Bring it to the front
      skewY: 30,
    }, {
      x: 0,
      opacity: 1,
      skewY: 0,
      
      zIndex: 1000,
      duration: 0.8,
      ease: "power2.out",
    }, startTime + 0.2); // Small overlap for smoother transition
  }

  return () => {
    ScrollTrigger.getAll().forEach(instance => instance.kill());
  };
}

// Alternative version with cleaner timing

