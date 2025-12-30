import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/hooks/useAppContext";
import { useAddressContext } from "@/hooks/useAddressContext";
import { useSystemPromptQuery } from "@/hooks/queries/useSystemPromptQuery";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import "./Address.css";

// a wrapper component for the prompt edit button
function EditButton({ label, callbackFn }: { label: string; callbackFn: () => void }) {
  return (
    <Button
      variant="outline"
      type="button"
      size="sm"
      className="address-component__edit__button"
      onClick={callbackFn}
    >
      {label}
    </Button>
  );
}

export default function SystemPromptInput() {
  const { language } = useAppContext();
  const { systemPrompt, updateSystemPrompt } = useAddressContext();
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
      refetch()
        .then((result) => {
          if (result.data?.data) {
            updateSystemPrompt(language, result.data.data);
          }
        })
        .catch((err) => {
          console.error(err);
          updateSystemPrompt(language, "fetching failed, please provide your prompt");
        });
    }
    if (textareaRef && textareaRef.current) {
      textareaRef.current!.value = systemPrompt?.prompt || "";
    }
  }, [language, systemPrompt, refetch, updateSystemPrompt]);

  return (
    <>
      <FieldLabel htmlFor="system-prompt" className="w-full flex justify-between">
        <span>{t("prompt.systemPrompt")}</span>
        {getEditButtons()}
      </FieldLabel>
      <Textarea
        id="system-prompt"
        ref={textareaRef}
        disabled={!editing}
        className={cn(
          "resize-none transition-all duration-150",
          isFetching ? "h-4" : "h-80"
        )}
      />
    </>
  );
}
