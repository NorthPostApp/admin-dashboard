import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  HeartOff,
  HeartMinus,
  Heart,
  HeartPlus,
  HeartPulse,
  BrushCleaning,
  CircleStop,
} from "lucide-react";
import {
  GPT_MODELS,
  REASONING_EFFORTS,
  DEFAULT_MODEL,
  DEFAULT_EFFORT,
  type GPTModel,
  type ReasonEffort,
} from "@/consts/app-config";
import type { GenerateAddressesRequestSchema } from "@/schemas/address";
import { useNewAddressContext } from "@/hooks/useNewAddressContext";
import { useGenerateAddressesMutation } from "@/hooks/mutations/useGenerateAddressesMutation";
import { PopoverSelector } from "@/components/address/PopoverSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";
import "./Address.css";

const getEffortIcon = (effort: ReasonEffort | "none") => {
  switch (effort) {
    case "low":
      return <HeartMinus data-testid="effort-low" />;
    case "medium":
      return <Heart data-testid="effort-medium" />;
    case "high":
      return <HeartPlus data-testid="effort-high" />;
    case "xhigh":
      return <HeartPulse data-testid="effort-xhigh" />;
    default:
      return <HeartOff data-testid="effort-none" />;
  }
};

export default function UserPromptInput() {
  const { generating, systemPrompt, userPrompt, updateUserPrompt } =
    useNewAddressContext();
  const { mutate, cancelRequest } = useGenerateAddressesMutation();
  const { t } = useTranslation("address:newAddress");
  const textareaRef = useRef<HTMLTextAreaElement>(null); // use textarea ref to reduce the rerendering

  const [gptModel, setGptModel] = useState<GPTModel>(DEFAULT_MODEL);
  const [reasonEffort, setReasonEffort] = useState<ReasonEffort>(DEFAULT_EFFORT);
  const handleChangeModel = (model: GPTModel) => setGptModel(model);
  const handleChangeEffort = (effort: ReasonEffort) => setReasonEffort(effort);

  const onBlur = () => {
    if (textareaRef.current) {
      updateUserPrompt(textareaRef.current.value);
    }
  };

  const clearInput = () => {
    if (textareaRef.current) {
      textareaRef.current.value = "";
      updateUserPrompt("");
    }
  };

  const effortEnabled = () => {
    return gptModel.startsWith("gpt-5"); // only gpt-5 models accept reasoning effort parameters
  };

  const submitRequest = (currentPrompt?: string) => {
    if (!systemPrompt) return;
    const requestBody: GenerateAddressesRequestSchema = {
      language: systemPrompt.language,
      systemPrompt: systemPrompt.prompt,
      prompt: currentPrompt ? currentPrompt.trim() : userPrompt.trim(),
      model: gptModel,
      reasoningEffort: reasonEffort,
    };
    if (requestBody.prompt.length === 0) return;
    mutate(requestBody);
  };

  // load saved prompt from app's address context
  useEffect(() => {
    if (textareaRef.current && userPrompt.length !== 0) {
      textareaRef.current.value = userPrompt;
    }
  }, [userPrompt]);

  const keyboardControl = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      textareaRef.current?.blur();
      return;
    }
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: Insert new line
        const textarea = textareaRef.current;
        if (textarea) {
          const { selectionStart, selectionEnd, value } = textarea;
          const newValue =
            value.substring(0, selectionStart) + "\n" + value.substring(selectionEnd);
          textarea.value = newValue;
          textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
          e.preventDefault();
        }
      } else {
        // Enter: Submit
        textareaRef.current?.blur();
        submitRequest(textareaRef.current?.value);
        e.preventDefault();
      }
    }
  };

  return (
    <>
      <FieldLabel htmlFor="prompt">{t("prompt.userPrompt")}</FieldLabel>
      <div className="address-component__prompt">
        <Textarea
          id="prompt"
          onBlur={onBlur}
          ref={textareaRef}
          disabled={generating}
          className="address-component__prompt__textarea"
          onKeyDown={keyboardControl}
        />
        <div className="address-component__prompt__actions">
          <div className="address-component__prompt__action__sub">
            <PopoverSelector
              options={GPT_MODELS}
              value={gptModel}
              title={t("prompt.models.label")}
              description={t("prompt.models.description")}
              onSelect={handleChangeModel}
              popOverClassName="w-40"
            >
              <Button
                size="sm"
                variant="ghost"
                className="address-component__prompt__trigger w-24 font-normal"
                disabled={generating}
              >
                {gptModel}
              </Button>
            </PopoverSelector>
            <PopoverSelector
              options={REASONING_EFFORTS}
              value={reasonEffort}
              title={t("prompt.effort.label")}
              description={t("prompt.effort.description")}
              onSelect={handleChangeEffort}
              popOverClassName="w-46"
            >
              <Button
                size="icon-sm"
                variant="ghost"
                data-testid="address-userprompt-effort"
                className="address-component__prompt__trigger"
                disabled={!effortEnabled() || generating}
              >
                {effortEnabled() ? getEffortIcon(reasonEffort) : getEffortIcon("none")}
              </Button>
            </PopoverSelector>
          </div>
          <div className="address-component__prompt__action__sub">
            <Button
              size="icon-sm"
              variant="ghost"
              className="address-component__prompt__trigger"
              data-testid="address-userprompt-clear"
              type="button"
              onClick={clearInput}
              disabled={generating}
            >
              <BrushCleaning />
            </Button>
            <Button
              size="icon-sm"
              data-testid="address-userprompt-submit"
              type="button" // we don't use submit which will cause the form submission event
              variant={generating ? "outline" : "default"}
              onClick={() => {
                if (!generating) submitRequest();
                else cancelRequest();
              }}
            >
              {generating ? (
                <CircleStop data-testid="address-userprompt-stop" />
              ) : (
                <Sparkles />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
