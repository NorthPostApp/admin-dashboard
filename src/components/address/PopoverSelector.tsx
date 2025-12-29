import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import { type PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";

type PopoverSelectorProps<T> = {
  options: readonly T[];
  value: T;
  title: string;
  description: string;
  onSelect: (model: T) => void;
  popOverClassName?: string;
} & PropsWithChildren;

export function PopoverSelector<T>({
  options,
  value,
  title,
  description,
  onSelect,
  popOverClassName,
  ...props
}: PopoverSelectorProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>{props.children}</PopoverTrigger>
      <PopoverContent
        className={cn("p-2 flex flex-col items-baseline", popOverClassName)}
      >
        <div className="px-2 border-b w-full pb-2">
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs opacity-60 pt-1">{description}</p>
        </div>
        {options.map((item) => {
          return (
            <PopoverClose asChild key={String(item)}>
              <Button
                variant={item === value ? "secondary" : "ghost"}
                className={cn(
                  "w-full flex justify-between gap-4",
                  item === value ? "opacity-100" : "opacity-50"
                )}
                onClick={() => onSelect(item)}
              >
                <span>{String(item)}</span>
                <span>{item === value && <Check />}</span>
              </Button>
            </PopoverClose>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
