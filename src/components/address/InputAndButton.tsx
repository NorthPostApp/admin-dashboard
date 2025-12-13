import { Plus } from "lucide-react";
import { useRef, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type InputAndButtonProps = {
  onButtonClick: (value?: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputAndButton({ onButtonClick, ...props }: InputAndButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-2">
      <Input ref={inputRef} {...props} />
      <Button
        className="rounded-full"
        variant="secondary"
        onClick={(e) => {
          e.preventDefault();
          onButtonClick(inputRef.current?.value);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}
