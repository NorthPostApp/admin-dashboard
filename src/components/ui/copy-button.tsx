import { useEffect, useState } from "react";
import { Button } from "./button";
import { Copy, Check } from "lucide-react";

type CopyButtonProps = {
  copyAction: () => string;
};

export default function CopyButton({ copyAction }: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button
      data-testid="address-card-copy-button"
      size={"icon-sm"}
      type="button"
      variant="ghost"
      disabled={copied}
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(copyAction());
      }}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}
