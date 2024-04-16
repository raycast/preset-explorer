import Link from "next/link";
import {
  addToRaycast,
  copyData,
  downloadData,
  makeUrl,
} from "../utils/actions";
import { Model, Preset, allPresets } from "../data/presets";
import styles from "./Preset.module.css";
import {
  CopyClipboardIcon,
  DownloadIcon,
  Globe01Icon,
  Icons,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

export type AiModelType = {
  [key in Model]: [string, string];
};

export const aiModel: AiModelType = {
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
  "mixtral-8x7b": ["Mistral", "Mistral 8x7b"],
  "codellama-70b-instruct": ["Code Llama 70b", "Meta Code Llama 70b"],
  "llama2-70b": ["Llama 70b", "Meta Llama 70b"],
};

export const creativity = {
  none: ["None", "No Creativity"],
  low: ["Low", "Low Creativity"],
  medium: ["Medium", "Medium Creativity"],
  high: ["High", "High Creativity"],
  maximum: ["Maximum", "Max Creativity"],
};

export function PresetComponent({ preset }: { preset: Preset }) {
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
    if (!preset.id) {
      const encodedUrl = encodeURIComponent(urlToCopy);
      const response = await fetch(
        `https://ray.so/api/shorten-url?url=${encodedUrl}&ref=presets`
      ).then((res) => res.json());

      if (response.link) {
        urlToCopy = response.link;
      }
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

  const IconComponent = Icons[preset.icon] ? Icons[preset.icon] : null;

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <Link href={`/preset/${preset.id}`} className={styles.item}>
            <div className={styles.icon}>
              {IconComponent ? <IconComponent /> : null}
            </div>
            <div className={styles.content}>
              <div className={styles.header}>
                <p className={styles.name}>
                  {preset.name}
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
                  <Tooltip delayDuration={700}>
                    <TooltipTrigger>
                      <span className={styles.metaItem}>
                        <ModelIcon model={preset.model} />
                        {aiModel[preset.model][0]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>{aiModel[preset.model][1]}</TooltipContent>
                  </Tooltip>
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
                    <Tooltip delayDuration={700}>
                      <TooltipTrigger>
                        <span className={styles.metaItem}>
                          <Globe01Icon />
                          Web Search
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        Searches the web if context is missing
                      </TooltipContent>
                    </Tooltip>
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
