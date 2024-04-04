import Link from "next/link";
import {
  addToRaycast,
  copyData,
  downloadData,
  makeUrl,
} from "../utils/actions";
import { Preset } from "../data/presets";
import styles from "./Preset.module.css";
import {
  CircleProgress25Icon,
  CopyClipboardIcon,
  DownloadIcon,
  Globe01Icon,
  LinkIcon,
  PlusCircleIcon,
} from "@raycast/icons";
import CreativityIcon from "./CreativityIcon";
import ModelIcon from "./ModelIcon";
import * as ContextMenu from "@radix-ui/react-context-menu";
import copy from "copy-to-clipboard";
import { useRouter } from "next/router";
import React from "react";
import { Toast, ToastTitle } from "./Toast";

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
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const router = useRouter();

  const handleCopyInstruction = React.useCallback(
    () => copy(preset.instructions),
    [preset.instructions]
  );

  const handleAddToRaycast = React.useCallback(
    () => addToRaycast(router, preset),
    [router, preset]
  );

  const handleDownload = React.useCallback(() => {
    downloadData(preset);
  }, [preset]);

  const handleCopyData = React.useCallback(() => {
    copyData(preset);
    setToastMessage("Copied to clipboard");
    setShowToast(true);
  }, [preset]);

  const handleCopyUrl = React.useCallback(async () => {
    setToastMessage("Copying URL to clipboard...");
    setShowToast(true);

    const url = makeUrl(preset);
    let urlToCopy = url;
    const encodedUrl = encodeURIComponent(urlToCopy);
    const response = await fetch(
      `https://ray.so/api/shorten-url?url=${encodedUrl}&ref=presets`
    ).then((res) => res.json());

    if (response.link) {
      urlToCopy = response.link;
    }

    copy(urlToCopy);
    setShowToast(true);
    setToastMessage("Copied URL to clipboard!");
  }, [preset]);

  React.useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  }, [showToast]);

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Link href={makeUrl(preset)} className={styles.item}>
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
                  <span
                    className={styles.metaItem}
                    title={aiModel[preset.model][1]}
                  >
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
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className={styles.contextMenuContent}>
            <ContextMenu.Item
              className={styles.contextMenuItem}
              onSelect={handleAddToRaycast}
            >
              <PlusCircleIcon /> Add to Raycast
            </ContextMenu.Item>
            <ContextMenu.Item
              className={styles.contextMenuItem}
              onSelect={handleDownload}
            >
              <DownloadIcon /> Download JSON
            </ContextMenu.Item>
            <ContextMenu.Item
              className={styles.contextMenuItem}
              onSelect={handleCopyData}
            >
              <CopyClipboardIcon /> Copy JSON
            </ContextMenu.Item>
            <ContextMenu.Item
              className={styles.contextMenuItem}
              onSelect={handleCopyInstruction}
            >
              <CopyClipboardIcon /> Copy Instructions
            </ContextMenu.Item>
            <ContextMenu.Item
              className={styles.contextMenuItem}
              onSelect={handleCopyUrl}
            >
              <LinkIcon /> Copy URL to Share
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
      <Toast open={showToast} onOpenChange={setShowToast}>
        <ToastTitle>
          <CopyClipboardIcon /> {toastMessage}
        </ToastTitle>
      </Toast>
    </>
  );
}