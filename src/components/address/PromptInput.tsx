import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DEFAULT_EFFORT,
  DEFAULT_MODEL,
  GPT_MODELS,
  REASONING_EFFORTS,
  type GPTModel,
  type ReasonEffort,
} from "@/consts/app-config";
import {
  Sparkles,
  HeartOff,
  HeartMinus,
  Heart,
  HeartPlus,
  HeartPulse,
  BrushCleaning,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PopoverSelector } from "@/components/address/PopoverSelector";
import "./Address.css";

const getEffortIcon = (effort: ReasonEffort) => {
  switch (effort) {
    case "none":
      return <HeartOff />;
    case "low":
      return <HeartMinus />;
    case "medium":
      return <Heart />;
    case "high":
      return <HeartPlus />;
    case "xhigh":
      return <HeartPulse />;
    default:
      return <HeartOff />;
  }
};

export default function PromptInput() {
  const { t } = useTranslation("address:newAddress");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [gptModel, setGptModel] = useState<GPTModel>(DEFAULT_MODEL);
  const [reasonEffort, setReasonEffort] = useState<ReasonEffort>(DEFAULT_EFFORT);
  const handleChangeModel = (model: GPTModel) => setGptModel(model);
  const handleChangeEffort = (effort: ReasonEffort) => setReasonEffort(effort);
  const clearInput = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (textareaRef.current) {
      textareaRef.current!.value = "";
    }
  };
  const effortEnabled = () => {
    return gptModel.startsWith("gpt-5"); // only gpt-5 models accept reasoning effort parameters
  };

  return (
    <div className="address-component__prompt">
      <Textarea
        id="prompt"
        ref={textareaRef}
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
              className="address-component__prompt__trigger w-26"
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
            onClick={clearInput}
          >
            <BrushCleaning />
          </Button>
          <Button size="icon-sm" role="submit">
            <Sparkles />
          </Button>
        </div>
      </div>
    </div>
  );
}
