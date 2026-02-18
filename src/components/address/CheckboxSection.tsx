import { memo } from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import "./Address.css";

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
    <Collapsible className="my-4" defaultOpen={true}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="address-component__collapsible__trigger group">
          {title}
          <ChevronDownIcon className="group-data-[state=open]:rotate-180 transition-transform" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="address-component__collapsible__content">
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
        className="address-component__checkbox group"
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
