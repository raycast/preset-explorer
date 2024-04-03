import Link from "next/link";
import { makeUrl } from "../utils/actions";
import { Preset } from "../data/presets";
import styles from "./Preset.module.css";
import { CircleProgress25Icon, Globe01Icon } from "@raycast/icons";
import CreativityIcon from "./CreativityIcon";
import ModelIcon from "./ModelIcon";

export const aiModel = {
  openai_davinci_003: ["Davinci", "Davinci-3"],
  openai_gpt35_turbo: ["GPT-3.5", "Open AI GPT-3.5 Turbo"],
  openai_gpt4: ["GPT-4", "Open AI GPT-4"],
  openai_gpt4_turbo: ["GPT-4 Turbo", "Open AI GPT-4 Turbo"],
  anthropic_claude_opus: ["Claude", "Antrophic Claude Opus"],
  anthropic_claude_haiku: ["Claude", "Antrophic Claude Haiku"],
  anthropic_claude_sonnet: ["Claude", "Antrophic Claude Sonnet"],
  perplexity_sonar_small: ["Sonar", "Perplexity Sonar Small"],
  perplexity_sonar_medium: ["Sonar", "Perplexity Sonar Medium"],
  mistral_8x7b: ["Mistral", "Mistral 8x7b"],
  mistral_small: ["Mistral", "Mistral Small"],
  mistral_medium: ["Mistral", "Mistral Medium"],
  mistral_large: ["Mistral", "Mistral Large"],
  meta_code_llama_70b: ["Code Llama 70b", "Meta Code Llama 70b"],
  meta_llama_2_70b: ["Llama 70b", "Meta Llama 70b"],
};

export const creativity = {
  none: ["None", "No Creativity"],
  low: ["Low", "Low Creativity"],
  medium: ["Medium", "Medium Creativity"],
  high: ["High", "High Creativity"],
  maximum: ["Maximum", "Max Creativity"],
};

export type PresetWithIconComponent = Preset & {
  iconComponent: React.FC;
};

type PresetProps = {
  preset: PresetWithIconComponent;
};

export function PresetComponent({ preset }: PresetProps) {
  return (
    <Link href={makeUrl(preset)} className={styles.item} key={preset.id}>
      <div className={styles.icon}>
        <preset.iconComponent />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.name}>
            {preset.title}
            {preset.author ? (
              <span className={styles.presetAuthor}>
                by{" "}
                {preset.author.link ? (
                  <a
                    href={preset.author.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {preset.author.name}
                  </a>
                ) : (
                  preset.author.name
                )}
              </span>
            ) : null}
          </p>
          <p className={styles.presetDescription}>{preset.description}</p>
        </div>
        <div className={styles.meta}>
          {preset.model ? (
            <span className={styles.metaItem} title={aiModel[preset.model][1]}>
              <ModelIcon model={preset.model} />
              {aiModel[preset.model][0]}
            </span>
          ) : null}
          {preset.creativity ? (
            <>
              <span className={styles.metaDivider} />
              <span className={styles.metaItem}>
                <CreativityIcon creativity={preset.creativity} />
                {creativity[preset.creativity][1]}
              </span>
            </>
          ) : null}
          {preset.web_search ? (
            <>
              <span className={styles.metaDivider} />
              <span className={styles.metaItem}>
                <Globe01Icon />
                Web Search
              </span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
