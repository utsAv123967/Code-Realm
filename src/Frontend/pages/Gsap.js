import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function GsapPage() {
  const tl = gsap.timeline();

 
  tl.from("#main", {
    opacity: 0,
    y: "100vh",
    delay: 0.2,
    duration: 0.7,
    ease: "power2.out",
    backgroundColor: "rgb(0, 0, 0)",
  });

  // === 2. Pic1 entrance + bounce ===
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

  // === 3. Cursor follow effect ===
  const cursor = document.querySelector("#cursor");
  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.5,
      ease: "back.out(1.7)",
    });
  });

  // === 4. Text split animation ===
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

  // === 5. Scroll-based card animation ===
  const cards = document.querySelectorAll(".card");
  const totalCards = cards.length;

  const t2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".cards-wrapper",
      start: "top 80%",
      end:"50vh",
      pin: true,
      scrub: 1,
      markers: true,
      snap: 1 / (totalCards * 2 - 2),
    },
  });

  // Card[0] exits
  t2.to(cards[0], {
    x: "-100vw",
    opacity: 0,
    scale: 0.1,
    skewY: -30,
    duration: 1,
    ease: "power2.inOut",
    zIndex: 1,
  });

  // Card[1 to n] enter + exit (except last card's exit)
  for (let i = 1; i < totalCards; i++) {
    const enterTime = 2 * (i - 1) + 1;
    const exitTime = enterTime + 1;

    // Entry
    t2.fromTo(
      cards[i],
      {
        x: "100vw",
        opacity: 0,
        scale: 0.1,
        skewY: 30,
        zIndex: 2,
      },
      {
        x: "0vw",
        opacity: 1,
        scale: 1,
        skewY: 0,
        duration: 1,
        ease: "power2.out",
      },
      enterTime
    );

    // Exit except last
    if (i < totalCards - 1) {
      t2.to(
        cards[i],
        {
          x: "-100vw",
          opacity: 0,
          scale: 0.8,
          skewY: -30,
          duration: 1,
          ease: "power2.inOut",
        },
        exitTime
      );
    }
  }
}
