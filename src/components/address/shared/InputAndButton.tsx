import { useRef, type InputHTMLAttributes } from "react";
import { Plus } from "lucide-react";
import clsx from "clsx";
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

const styles = {
  body: clsx("flex gap-2"),
  button: clsx("rounded-full"),
};

export default function InputAndButton({
  buttonSize = "default",
  onButtonClick,
  ...props
}: InputAndButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.body}>
      <Input ref={inputRef} {...props} />
      <Button
        className={styles.button}
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
