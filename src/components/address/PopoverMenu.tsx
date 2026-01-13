import type { PropsWithChildren, ReactNode } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "@/components/ui/popover";

export type PopoverControls = {
  name: string;
  actionComponent: ReactNode;
};

type PopoverMenuProps = {
  id: string;
  controls: PopoverControls[];
} & PropsWithChildren;

export function PopoverMenu({ id, controls, ...props }: PopoverMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className="address-component__popover__body w-22">
        {controls.map((controlItem) => (
          <PopoverClose key={id + controlItem.name} asChild>
            {controlItem.actionComponent}
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
}
