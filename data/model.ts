export type Model =
  | "openai-gpt-3.5-turbo-instruct"
  | "openai-gpt-3.5-turbo"
  | "openai-gpt-4"
  | "openai-gpt-4-turbo"
  | "anthropic-claude-haiku"
  | "anthropic-claude-opus"
  | "anthropic-claude-sonnet"
  | "perplexity-sonar-medium-online"
  | "perplexity-sonar-small-online"
  | "perplexity-codellama-70b-instruct"
  | "groq-llama2-70b-4096"
  | "groq-llama3-70b-8192"
  | "groq-mixtral-8x7b-32768";

export const advancedModels: Model[] = [
  "openai-gpt-4",
  "openai-gpt-4-turbo",
  "anthropic-claude-sonnet",
  "anthropic-claude-opus",
  "perplexity-sonar-medium-online",
];

export const modelNames: { [key in Model]: [string, string] } = {
  "openai-gpt-3.5-turbo": ["GPT-3.5", "Open AI GPT-3.5 Turbo"],
  "openai-gpt-3.5-turbo-instruct": [
    "GPT-3.5",
    "Open AI GPT-3.5 Turbo Instruct",
  ],
  "openai-gpt-4": ["GPT-4", "Open AI GPT-4"],
  "openai-gpt-4-turbo": ["GPT-4 Turbo", "Open AI GPT-4 Turbo"],
  "anthropic-claude-opus": ["Claude", "Antrophic Claude Opus"],
  "anthropic-claude-haiku": ["Claude", "Antrophic Claude Haiku"],
  "anthropic-claude-sonnet": ["Claude", "Antrophic Claude Sonnet"],
  "perplexity-sonar-small-online": ["Sonar", "Perplexity Sonar Small"],
  "perplexity-sonar-medium-online": ["Sonar", "Perplexity Sonar Medium"],
  "groq-mixtral-8x7b-32768": ["Mistral", "Mistral 8x7b"],
  "perplexity-codellama-70b-instruct": [
    "Code Llama 70b",
    "Meta Code Llama 70b",
  ],
  "groq-llama2-70b-4096": ["Llama 2 70b", "Meta Llama 2 70b"],
  "groq-llama3-70b-8192": ["Llama 3 70b", "Meta Llama 3 70b"],
};
