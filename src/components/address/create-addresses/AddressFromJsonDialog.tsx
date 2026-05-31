import { useRef, useState, type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { AddressItem, type AddressItemSchema } from "@/schemas/address";
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
import clsx from "clsx";

type AddressFromJsonDialogProps = {
  handleJsonSave: (formData: AddressItemSchema) => void;
  title: string;
  description: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  initialData?: string;
} & PropsWithChildren;

const styles = {
  content: clsx("sm:max-w-[600px]"),
  textarea: clsx("h-70"),
  warning: clsx("text-destructive text-sm"),
};

export default function AddressFromJsonDialog({
  handleJsonSave,
  title,
  description,
  open,
  initialData,
  setOpen,
  children,
}: AddressFromJsonDialogProps) {
  const { t } = useTranslation("address:newAddress");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const dialogOpenState = open !== undefined ? open : dialogOpen;
  const setDialogOpenState = setOpen !== undefined ? setOpen : setDialogOpen;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // parse JSON content, throws error when parsing / model inference failed
  const parseContent = () => {
    try {
      setErrorMessage("");
      const jsonContent = textAreaRef.current?.value;
      if (jsonContent) {
        const output = JSON.parse(jsonContent);
        const result = AddressItem.safeParse(output);
        if (result.success) {
          handleJsonSave(result.data);
          setDialogOpenState(false);
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
    <Dialog open={dialogOpenState} onOpenChange={setDialogOpenState}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent
        className={styles.content}
        container={document.querySelector("main") ?? undefined}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea
          ref={textAreaRef}
          defaultValue={initialData}
          className={styles.textarea}
          id="json-content"
        />
        {errorMessage.length > 0 && (
          <p className={styles.warning} data-testid="address-content__dialog__warning">
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
