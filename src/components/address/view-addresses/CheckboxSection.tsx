import { memo } from "react";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

type CheckboxSectionProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  toggleOption: (option: string) => void;
};

const styles = {
  body: clsx("my-4"),
  trigger: clsx("w-full flex justify-between text-sm mb-2 group"),
  triggerIcon: clsx("group-data-[state=open]:rotate-180 transition-transform"),
  content: clsx("flex flex-wrap gap-x-3 gap-y-2 px-2.5"),
  checkbox: clsx(
    "w-fit flex items-center gap-1.5 text-sm px-2 py-1 rounded-md border hover:cursor-pointer group",
  ),
  checkboxInput: clsx("group-hover:cursor-pointer"),
};

export default function CheckboxSection({
  title,
  options,
  selectedOptions,
  toggleOption,
}: CheckboxSectionProps) {
  return (
    <Collapsible className={styles.body} defaultOpen={true}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className={styles.trigger}>
          {title}
          <ChevronDownIcon className={styles.triggerIcon} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.content}>
        {options.map((tag) => (
          <MemoCheckbox
            key={`${title}-${tag}`}
            title={title}
            tag={tag}
            checked={selectedOptions.includes(tag)}
            toggleTag={toggleOption}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

// memoed checkbox subcomponent
type MemoCheckboxProps = {
  title: string;
  tag: string;
  checked: boolean;
  toggleTag: (tag: string) => void;
};

const MemoCheckbox = memo(
  ({ tag, checked, toggleTag }: MemoCheckboxProps) => {
    return (
      <div
        className={styles.checkbox}
        onClick={(e) => {
          e.stopPropagation();
          toggleTag(tag);
        }}
      >
        <Checkbox checked={checked} className={styles.checkboxInput} />
        <p>{tag}</p>
      </div>
    );
  },
  (prev, curr) =>
    prev.title === curr.title && prev.tag === curr.tag && prev.checked === curr.checked,
);
