import { type PropsWithChildren } from "react";
import { Check } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
        className={cn("address-component__popover__body", popOverClassName)}
      >
        <div className="address-component__popover__header">
          <p className="address-component__popover__header__title">{title}</p>
          <p className="address-component__popover__header__description">{description}</p>
        </div>
        {options.map((item) => {
          return (
            <PopoverClose asChild key={String(item)}>
              <Button
                variant={item === value ? "secondary" : "ghost"}
                className={cn(
                  "address-component__popover__body__button",
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
