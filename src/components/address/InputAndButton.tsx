import { Plus } from "lucide-react";
import { useRef, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ButtonSize =
  | "default"
  | "sm"
  | "lg"
  | "icon"
  | "icon-sm"
  | "icon-lg"
  | null
  | undefined;

type InputAndButtonProps = {
  buttonSize?: ButtonSize;
  onButtonClick: (value?: string) => void;
} & InputHTMLAttributes<HTMLInputElement>;

export default function InputAndButton({
  buttonSize = "default",
  onButtonClick,
  ...props
}: InputAndButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex gap-2">
      <Input ref={inputRef} {...props} />
      <Button
        className="rounded-full"
        variant="secondary"
        size={buttonSize}
        data-testid="input-and-button__button"
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
