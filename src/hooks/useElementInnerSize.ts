import { useEffect, useState } from "react";

type InnerSizeType = {
  width: number;
  height: number;
};

export function useElementInnerSize(elementRef: React.RefObject<HTMLElement | null>) {
  const [innerSizes, setInnerSizes] = useState<InnerSizeType[]>([]);
  useEffect(() => {
    if (!elementRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      const sizes: InnerSizeType[] = [];
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const contextSize: InnerSizeType = { width, height };
        sizes.push(contextSize);
      }
      setInnerSizes(sizes);
    });
    resizeObserver.observe(elementRef.current);
    return () => {
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return innerSizes;
}
