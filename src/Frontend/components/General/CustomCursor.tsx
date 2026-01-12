import { onCleanup, onMount } from "solid-js";

const cursorStyles = {
  position: "fixed",
  left: "0px",
  top: "0px",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  border: "1px solid rgba(255, 255, 255, 0.25)",
  background: "rgba(255, 255, 255, 0.12)",
  boxShadow: "0 0 18px rgba(99, 102, 241, 0.25)",
  pointerEvents: "none",
  transform: "translate(-50%, -50%)",
  backdropFilter: "blur(6px)",
  zIndex: "9999",
  opacity: "0",
  transition: "opacity 0.2s ease",
} as const;

const CustomCursor = () => {
  onMount(() => {
    if (typeof window === "undefined") return;
    const pointerFine = window.matchMedia("(pointer: fine)");
    if (!pointerFine.matches) return;

    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    Object.assign(cursor.style, cursorStyles);
    document.body.appendChild(cursor);

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    let rafId = 0;
    let targetX = -999;
    let targetY = -999;
    let pointerActive = false;

    const render = () => {
      cursor.style.left = `${targetX}px`;
      cursor.style.top = `${targetY}px`;
      cursor.style.opacity = pointerActive ? "1" : "0";
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const handlePointerMove = (event: PointerEvent) => {
      pointerActive = true;
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const handlePointerLeave = () => {
      pointerActive = false;
    };

    const handlePointerDown = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(0.85)";
    };

    const handlePointerUp = () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    const mediaListener = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        pointerActive = false;
        cursor.style.opacity = "0";
        document.body.style.cursor = previousCursor;
      } else {
        document.body.style.cursor = "none";
      }
    };

    pointerFine.addEventListener("change", mediaListener);

    onCleanup(() => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      pointerFine.removeEventListener("change", mediaListener);
      document.body.style.cursor = previousCursor;
      cursor.remove();
    });
  });

  return null;
};

export default CustomCursor;
