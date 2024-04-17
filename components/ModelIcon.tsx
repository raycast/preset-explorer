import { Preset } from "../data/presets";
import {
  BrandAnthropicIcon,
  BrandMetaIcon,
  BrandMistralIcon,
  BrandOpenaiIcon,
  BrandPerplexityIcon,
} from "@raycast/icons";

export default function ModelIcon({ model }: { model: Preset["model"] }) {
  let component = null;
  if (model?.includes("openai")) {
    component = <BrandOpenaiIcon />;
  }

  if (model?.includes("anthropic")) {
    component = <BrandAnthropicIcon />;
  }

  if (model?.includes("meta")) {
    component = <BrandMetaIcon />;
  }

  if (model?.includes("perplexity")) {
    component = <BrandPerplexityIcon />;
  }

  if (model?.includes("mistral")) {
    component = <BrandMistralIcon />;
  }

  return component;
}
