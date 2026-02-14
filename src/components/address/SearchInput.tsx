import { useRef } from "react";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";

type SearchInputProps = {
  onChange: (text: string) => void;
  placeholder: string;
  delay?: number;
};

type Timeout = ReturnType<typeof setTimeout>;

export default function SearchInput({
  onChange,
  placeholder,
  delay = 400,
}: SearchInputProps) {
  const timeoutRef = useRef<Timeout | null>(null);
  const debounceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onChange(e.target.value), delay);
  };
  return (
    <InputGroup className="address-component__search">
      <InputGroupInput placeholder={placeholder} onChange={debounceChange} />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
