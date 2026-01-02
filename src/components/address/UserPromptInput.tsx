import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  HeartOff,
  HeartMinus,
  Heart,
  HeartPlus,
  HeartPulse,
  BrushCleaning,
} from "lucide-react";
import {
  GPT_MODELS,
  REASONING_EFFORTS,
  DEFAULT_MODEL,
  DEFAULT_EFFORT,
  type GPTModel,
  type ReasonEffort,
} from "@/consts/app-config";
import type { GenerateAddressesRequestSchema } from "@/schemas/address-schema";
import { useAddressContext } from "@/hooks/useAddressContext";
import { useGenerateAddressesMutation } from "@/hooks/mutations/useGenerateAddressesMutation";
import { PopoverSelector } from "@/components/address/PopoverSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import "./Address.css";

const getEffortIcon = (effort: ReasonEffort) => {
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
  const {
    systemPrompt,
    userPrompt,
    updateUserPrompt,
    saveGeneratedAddresses,
    setGeneratingState,
  } = useAddressContext();
  const { mutate, isPending } = useGenerateAddressesMutation(saveGeneratedAddresses);
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

  const submitRequest = () => {
    if (!systemPrompt || userPrompt.length === 0) return;
    const requestBody: GenerateAddressesRequestSchema = {
      language: systemPrompt.language,
      systemPrompt: systemPrompt.prompt,
      prompt: userPrompt,
      model: gptModel,
      reasoningEffort: reasonEffort,
    };
    mutate(requestBody);
  };

  // load saved prompt from app's address context
  useEffect(() => {
    if (textareaRef.current && userPrompt.length !== 0) {
      textareaRef.current.value = userPrompt;
    }
  }, [userPrompt]);

  // change generating state when running queries
  useEffect(() => {
    setGeneratingState(isPending);
  }, [isPending, setGeneratingState]);

  return (
    <>
      <FieldLabel htmlFor="prompt">{t("prompt.userPrompt")}</FieldLabel>
      <div className="address-component__prompt">
        <Textarea
          id="prompt"
          onBlur={onBlur}
          ref={textareaRef}
          disabled={isPending}
          className="address-component__prompt__textarea"
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
                disabled={!effortEnabled()}
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
            >
              <BrushCleaning />
            </Button>
            <Button
              size="icon-sm"
              data-testid="address-userprompt-submit"
              type="button" // we don't use submit which will cause the form submission event
              onClick={submitRequest}
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <Sparkles />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
