import { useRef, useState, useMemo, type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { DEFAULT_MODEL, DEFAULT_THINKING_LEVEL } from "@/consts/app-config";
import {
  AddressItem,
  GenerateAddressesRequest,
  type AddressItemSchema,
  type GenerateAddressesResponseSchema,
} from "@/schemas/address";
import { useSystemPromptQuery } from "@/hooks/queries/useSystemPromptQuery";
import { useAppContext } from "@/hooks/useAppContext";
import { useGenerateAddressesMutation } from "@/hooks/mutations/useGenerateAddressesMutation";
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

type AddressFromJsonDialogProps = {
  handleJsonSave: (formData: AddressItemSchema) => void;
  title: string;
  description: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  enableRegenerate?: boolean;
  initialData?: AddressItemSchema;
} & PropsWithChildren;

const styles = {
  content: clsx("sm:max-w-[600px]"),
  textarea: clsx("h-110"),
  warning: clsx("text-destructive text-sm"),
};

export default function AddressFromJsonDialog({
  handleJsonSave,
  title,
  description,
  open,
  initialData,
  setOpen,
  enableRegenerate,
  children,
}: AddressFromJsonDialogProps) {
  const { t } = useTranslation("address:newAddress");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const stringData = useMemo(() => {
    const data = JSON.stringify(initialData, null, 2);
    return data;
  }, [initialData]);

  // props for the regeneration
  const { language } = useAppContext();

  const dialogOpenState = open !== undefined ? open : dialogOpen;
  const setDialogOpenState = setOpen !== undefined ? setOpen : setDialogOpen;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Regenerate the current address content
  const [regenerating, setRegenerating] = useState<boolean>(false);
  const replaceWithRegeneratedContent = (data: GenerateAddressesResponseSchema) => {
    if (data.length > 0 && textAreaRef.current) {
      const validFields = AddressItem.parse(data[0]);
      textAreaRef.current.value = JSON.stringify(validFields, null, 2);
    }
  };
  const { data: systemPrompt } = useSystemPromptQuery(language);
  const { mutate: regenerateMutate, isPending: generatePending } =
    useGenerateAddressesMutation(setRegenerating, replaceWithRegeneratedContent);

  const regenerateAddress = () => {
    if (!initialData || !enableRegenerate) return;
    const prompt = `${initialData?.name}, ${initialData?.briefIntro}`;
    const requestBody = GenerateAddressesRequest.parse({
      language,
      systemPrompt: systemPrompt?.data,
      prompt,
      model: DEFAULT_MODEL,
      thinkingLevel: DEFAULT_THINKING_LEVEL,
    });
    regenerateMutate(requestBody);
  };

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
          defaultValue={stringData}
          className={styles.textarea}
          disabled={regenerating}
          id="json-content"
        />
        {errorMessage.length > 0 && (
          <p className={styles.warning} data-testid="address-content__dialog__warning">
            {errorMessage}
          </p>
        )}
        <DialogFooter>
          {enableRegenerate && (
            <Button
              onClick={regenerateAddress}
              variant="ghost"
              disabled={generatePending}
            >
              {generatePending ? t("json.regenerating") : t("json.regenerate")}
            </Button>
          )}
          {/* Spacer */}
          <span className="flex-1"></span>
          <DialogClose asChild>
            <Button variant="outline">{t("json.cancel")}</Button>
          </DialogClose>
          <Button onClick={parseContent}>{t("json.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
