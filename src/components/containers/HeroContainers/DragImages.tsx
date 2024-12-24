"use client";
import { useRef } from "react";
 
import { DragCard } from "@/components/ui/cards-drag";
 
export function DemoCardsDrag() {
  const containerRef = useRef(null);
 
//   const DemoContainer = cn(
//     "relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950",
//   );
 
  return (
    <div className="w-full h-full mt-60 lg:hidden">
      <div ref={containerRef}>
        {CARDS_DEMO.map((card, index) => (
          <DragCard
            key={index}
            containerRef={containerRef}
            src={card.src}
            alt={card.alt}
            rotate={card.rotate}
            top={card.top}
            left={card.left}
            className={card.className}
          />
        ))}
      </div>
    </div>
  );
}
 
/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                        CONSTANTS                           */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/
 
const CARDS_DEMO = [
  {
    src: "/papermax.svg",
    alt: "Example image",
    rotate: "6deg",
    top: "50%",
    left: "0%",
    className: "w-[100px]",
  },
  {
    src: "/mug-optimized.svg",
    alt: "Example image",
    rotate: "12deg",
    top: "70%",
    left: "60%",
    className: "w-[200px]",
  },
  {
    src: "/keychain-optimized.svg",
    alt: "Example image",
    rotate: "-6deg",
    top: "70%",
    left: "40%",
    className: "w-40",
  },
  {
    src: "/box-optimized.svg",
    alt: "Example image",
    rotate: "8deg",
    top: "50%",
    left: "80%",
    className: "w-[100px]",
  },
  {
    src: "/box2-optimized.svg",
    alt: "Example image",
    rotate: "18deg",
    top: "80%",
    left: "10%",
    className: "w-[120px]",
  },
  {
    src: "/compressed-shirt.svg",
    alt: "Example image",
    rotate: "-3deg",
    top: "50%",
    left: "27%",
    className: "w-[200px]",
  },
] as const;