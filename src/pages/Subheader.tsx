import type { ReactElement } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import "./Pages.css";

type SubheaderProps = {
  title: string;
  centralComponent?: ReactElement;
  sideComponent?: ReactElement;
};

export default function Subheader({
  title,
  centralComponent,
  sideComponent,
}: SubheaderProps) {
  const isMobile = useIsMobile();
  // still in progress. no need to do testing or consolidation now
  return (
    <div className="subheader">
      <div className="grid grid-cols-3 px-5">
        <h2 className="col-span-1 text-start content-center">{!isMobile && title}</h2>
        <div className="col-span-1 content-center text-center w-full">
          {centralComponent}
        </div>
        <div className="col-span-1 content-center text-end justify-self-end">
          {sideComponent}
        </div>
      </div>
    </div>
  );
}
