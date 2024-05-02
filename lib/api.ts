import { Model } from "../data/presets";

export type AiModel = {
  id: string;
  name: string;
  description: string;
  availability: "public" | "beta" | "internal" | "deprecated";
  features: string[];
  suggestions: string[];
  capabilities: Record<string, string>;
  in_better_ai_subscription: boolean;
  model: Model;
  provider: string;
  provider_name: string;
  provider_brand: string;
  speed: number;
  intelligence: number;
  requires_better_ai: boolean;
  context: number;
};

export async function getAvailableAiModels() {
  const res = await fetch("https://raycast.com/api/v1/ai/models");
  const models = await res.json();
  return models.models as AiModel[];
}
