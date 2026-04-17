import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { Button } from "../ui/button";

type SearchInputProps = {
  onChange: (text: string) => void;
  onSubmit?: () => void;
  value: string;
  placeholder: string;
};

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder,
}: SearchInputProps) {
  return (
    <InputGroup className="address-component__search">
      <InputGroupInput
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      />
      <InputGroupAddon align={"inline-end"}>
        <Button variant={"plain"} size="icon" onClick={onSubmit}>
          <Search />
        </Button>
      </InputGroupAddon>
    </InputGroup>
  );
}
