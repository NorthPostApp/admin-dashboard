import type { PropsWithChildren } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type SubheaderProps = {
  title: string;
} & PropsWithChildren;

export default function Subheader({ title, children }: SubheaderProps) {
  const isMobile = useIsMobile();
  // still in progress. no need to do testing or consolidation now
  return (
    <div className="flex flex-col w-full border-b justify-center py-2">
      <div className="grid grid-cols-3 px-5">
        <h2 className="col-span-1 text-start content-center">{!isMobile && title}</h2>
        <div className="col-span-1 content-center justify-self-center">{children}</div>
      </div>
    </div>
  );
}
