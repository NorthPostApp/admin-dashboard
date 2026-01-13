import { useEffect, useState } from "react";
import { Button } from "./button";
import { Copy, Check } from "lucide-react";

type CopyButtonProps = {
  content: string;
};

export default function CopyButton({ content }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button
      size={"icon-sm"}
      type="button"
      variant="ghost"
      disabled={copied}
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(content);
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
