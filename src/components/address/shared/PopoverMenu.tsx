import type { PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
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

const styles = {
  body: clsx("p-2 flex flex-col items-baseline w-22"),
};

export function PopoverMenu({ id, controls, ...props }: PopoverMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent className={styles.body}>
        {controls.map((controlItem) => (
          <PopoverClose key={id + controlItem.name} asChild>
            {controlItem.actionComponent}
          </PopoverClose>
        ))}
      </PopoverContent>
    </Popover>
  );
}
