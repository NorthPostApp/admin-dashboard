import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/hooks/useAppContext";
import { useNewAddressContext } from "@/hooks/useNewAddressContext";
import { useSystemPromptQuery } from "@/hooks/queries/useSystemPromptQuery";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import clsx from "clsx";

const styles = {
  editButton: clsx("text-xs h-full px-2 opacity-50 hover:opacity-90 focus:ring-0 mx-1"),
  label: clsx("w-full flex justify-between"),
  textarea: clsx("resize-none transition-all duration-150"),
};

// a wrapper component for the prompt edit button
function EditButton({ label, callbackFn }: { label: string; callbackFn: () => void }) {
  return (
    <Button
      variant="outline"
      type="button"
      size="sm"
      className={styles.editButton}
      onClick={callbackFn}
    >
      {label}
    </Button>
  );
}

export default function SystemPromptInput() {
  const { language } = useAppContext();
  const { systemPrompt, updateSystemPrompt } = useNewAddressContext();
  const { isFetching, refetch } = useSystemPromptQuery(language);
  const { t } = useTranslation("address:newAddress");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState<boolean>(false);

  const enableEditing = () => setEditing(true);
  const saveEditing = () => {
    setEditing(false);
    if (textareaRef && textareaRef.current) {
      updateSystemPrompt(language, textareaRef.current.value);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    if (textareaRef && textareaRef.current) {
      textareaRef.current.value = systemPrompt?.prompt || "";
    }
  };

  const getEditButtons = () => {
    if (!editing) {
      return <EditButton label={t("prompt.controls.edit")} callbackFn={enableEditing} />;
    } else {
      return (
        <div>
          <EditButton label={t("prompt.controls.cancel")} callbackFn={cancelEditing} />
          <EditButton label={t("prompt.controls.save")} callbackFn={saveEditing} />
        </div>
      );
    }
  };

  useEffect(() => {
    // only do auto refetch when system language changed
    if (!systemPrompt || systemPrompt.language !== language) {
      updateSystemPrompt(language, t("prompt.state.loadingSystemPrompt"));
      refetch().then((result) => {
        let fetchedPrompt = "";
        if (result.data?.data) {
          updateSystemPrompt(language, result.data.data);
          fetchedPrompt = result.data.data;
        } else if (result.error) {
          // the tanstack query doesn't "throw" error by default
          // so we use result.error instead of catch
          updateSystemPrompt(language, t("failed.fetch"));
          fetchedPrompt = t("failed.fetch");
        }
        if (textareaRef && textareaRef.current) {
          textareaRef.current.value = fetchedPrompt;
        }
      });
    }
    if (textareaRef && textareaRef.current) {
      textareaRef.current.value = systemPrompt?.prompt || "";
    }
  }, [language, systemPrompt, refetch, updateSystemPrompt, t]);

  return (
    <>
      <FieldLabel htmlFor="system-prompt" className={styles.label}>
        <span>{t("prompt.systemPrompt")}</span>
        {getEditButtons()}
      </FieldLabel>
      <Textarea
        id="system-prompt"
        ref={textareaRef}
        disabled={!editing}
        className={cn(
          styles.textarea,
          isFetching || (systemPrompt && systemPrompt.prompt.length === 0)
            ? "h-4"
            : "h-90",
        )}
      />
    </>
  );
}
