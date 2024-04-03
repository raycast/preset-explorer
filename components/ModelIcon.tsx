import {
  AnthropicIcon,
  MetaIcon,
  MistralIcon,
  OpenAiIcon,
  PerplexityIcon,
} from "./Icons";

import { Preset } from "../data/presets";

export default function ModelIcon({ model }: { model: Preset["model"] }) {
  let component = null;
  if (model?.includes("openai")) {
    component = <OpenAiIcon />;
  }

  if (model?.includes("anthropic")) {
    component = <AnthropicIcon />;
  }

  if (model?.includes("meta")) {
    component = <MetaIcon />;
  }

  if (model?.includes("perplexity")) {
    component = <PerplexityIcon />;
  }

  if (model?.includes("mistral")) {
    component = <MistralIcon />;
  }

  return component;
}
