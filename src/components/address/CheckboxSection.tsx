import { memo } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Checkbox } from "../ui/checkbox";

type CheckboxSectionProps = {
  title: string;
  options: string[];
  selectedOptions: string[];
  toggleOption: (option: string) => void;
};

export default function CheckboxSection({
  title,
  options,
  selectedOptions,
  toggleOption,
}: CheckboxSectionProps) {
  return (
    <Collapsible className="my-4">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-between text-base mb-2">
          {title}
          <ChevronDownIcon />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-wrap gap-x-3 gap-y-2 px-2.5">
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
        className="group w-fit flex items-center gap-1.5 text-sm px-2 py-1 rounded-md border hover:cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          toggleTag(tag);
        }}
      >
        <Checkbox checked={checked} className="group-hover:cursor-pointer" />
        <p>{tag}</p>
      </div>
    );
  },
  (prev, curr) =>
    prev.title === curr.title && prev.tag === curr.tag && prev.checked === curr.checked,
);
