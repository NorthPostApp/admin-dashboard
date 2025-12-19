import { useRef, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { NewAddressRequest, type ZodNewAddressRequest } from "@/schemas/address-schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type CreateFromJsonDialogProps = {
  handleJsonImport: (formData: ZodNewAddressRequest) => void;
};

export default function CreateFromJsonDialog({
  handleJsonImport,
}: CreateFromJsonDialogProps) {
  const { language } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // parse JSON content, throws error when parsing / model inference failed
  const parseContent = () => {
    try {
      setErrorMessage("");
      const jsonContent = textAreaRef.current?.value;
      if (jsonContent) {
        const output = JSON.parse(jsonContent);
        output["language"] = language;
        const result = NewAddressRequest.safeParse(output);
        if (result.success) {
          handleJsonImport(result.data);
          setDialogOpen(false);
        } else {
          throw result.error;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(String(error));
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="address-content__dialog__trigger">
          Create from JSON
        </Button>
      </DialogTrigger>
      <DialogContent
        className="address-content__dialog__content"
        container={document.querySelector("main") ?? undefined}
      >
        <DialogHeader>
          <DialogTitle>Parse address from JSON</DialogTitle>
          <DialogDescription>
            Paste a JSON object containing address data. The form fields will be
            automatically populated with the parsed values.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          ref={textAreaRef}
          className="address-content__dialog__textarea"
          id="json-content"
        />
        {errorMessage.length > 0 && (
          <p
            className="address-content__dialog__warning"
            data-testid="address-content__dialog__warning"
          >
            {errorMessage}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={parseContent}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
