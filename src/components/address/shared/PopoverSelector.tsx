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
  onSelect: (option: T) => void;
  popOverClassName?: string;
} & PropsWithChildren;

const styles = {
  body: "p-2 flex flex-col items-baseline",
  header: "px-2 border-b w-full pb-2",
  headerTitle: "text-sm font-bold",
  headerDescription: "text-xs opacity-60 pt-1",
  button: "w-full flex justify-between gap-4",
};

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
      <PopoverContent className={cn(styles.body, popOverClassName)}>
        <div className={styles.header}>
          <p className={styles.headerTitle}>{title}</p>
          <p className={styles.headerDescription}>{description}</p>
        </div>
        {options.map((item) => {
          return (
            <PopoverClose asChild key={String(item)}>
              <Button
                variant={item === value ? "secondary" : "ghost"}
                className={cn(
                  styles.button,
                  item === value ? "opacity-100" : "opacity-50",
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
