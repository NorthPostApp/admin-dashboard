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
import { useTranslation } from "react-i18next";

type CreateFromJsonDialogProps = {
  handleJsonImport: (formData: ZodNewAddressRequest) => void;
};

export default function CreateFromJsonDialog({
  handleJsonImport,
}: CreateFromJsonDialogProps) {
  const { language } = useAppContext();
  const { t } = useTranslation("address:newAddress");
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
          {t("json.trigger")}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="address-content__dialog__content"
        container={document.querySelector("main") ?? undefined}
      >
        <DialogHeader>
          <DialogTitle>{t("json.title")}</DialogTitle>
          <DialogDescription>{t("json.description")}</DialogDescription>
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
            <Button variant="outline">{t("json.cancel")}</Button>
          </DialogClose>
          <Button onClick={parseContent}>{t("json.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
