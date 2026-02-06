import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TabOption = {
  id: string;
  title: string;
  action: () => void;
};

type TabsButtonProps = {
  activeTab: string;
  tabOptions: TabOption[];
};

export default function TabsTrigger({ tabOptions, activeTab }: TabsButtonProps) {
  const [bgPlacement, setBgPlacement] = useState({
    left: 0,
    width: 0,
  });
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = tabOptions.findIndex((option) => option.id === activeTab);
  useEffect(() => {
    const activeButton = buttonRefs.current[activeIndex];
    if (activeButton) {
      setBgPlacement({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
    }
  }, [activeIndex]);
  return (
    <div className="relative flex bg-accent w-fit px-2 rounded-full py-0.5 shadow-sm mx-auto">
      <div
        className={
          "absolute bg-primary w-22 top-1 h-[calc(100%-0.5rem)] rounded-full transition-normal duration-150 ease-in-out"
        }
        style={{ left: bgPlacement.left, width: bgPlacement.width }}
      ></div>
      {tabOptions.map(({ title, action }, index) => {
        return (
          <button
            key={`tabs-${title}`}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            className={cn(
              "w-22 z-10 text-sm py-1 transition-none",
              activeIndex === index ? "text-background" : "text-muted-foreground",
            )}
            onClick={action}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
}
