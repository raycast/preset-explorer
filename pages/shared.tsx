import { useRouter } from "next/router";
import React from "react";
import copy from "copy-to-clipboard";

import {
  CheckIcon,
  CopyClipboardIcon,
  Globe01Icon,
  Icons,
  XMarkCircleIcon,
} from "@raycast/icons";

import {
  PresetComponent,
  PresetWithIconComponent,
  aiModel,
} from "../components/Preset";
import { creativity as creativityString } from "../components/Preset";
import CreativityIcon from "../components/CreativityIcon";
import ModelIcon from "../components/ModelIcon";

import { allPresets, Preset } from "../data/presets";
import styles from "../styles/Shared.module.css";
import Head from "next/head";
import { proModels } from "./[[...slug]]";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip";

export default function PresetPage() {
  const [showCopied, setShowCopied] = React.useState(false);
  const [relatedPresets, setRelatedPresets] = React.useState<
    PresetWithIconComponent[]
  >([]);

  const router = useRouter();
  const preset: Preset = React.useMemo(
    () => parseURLPreset(router.query.preset as string),
    [router.query]
  );

  React.useEffect(() => {
    if (showCopied) {
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  }, [showCopied]);

  React.useEffect(() => {
    if (preset) {
      setRelatedPresets(
        allPresets
          .filter((p) => p.id !== preset.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2)
      );
    }
  }, [preset]);

  if (!preset) {
    return null;
  }

  const {
    title,
    description,
    instructions,
    creativity,
    icon,
    model,
    web_search,
  } = preset;

  const IconComponent = Icons[icon] ? Icons[icon] : null;

  const handleCopyInstructions = () => {
    copy(instructions);
    setShowCopied(true);
  };

  return (
    <>
      <Head>
        <title>{title} - Raycast Preset</title>
        <meta name="description" content={description} />
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          {IconComponent && (
            <div className={styles.icon}>
              <IconComponent />
            </div>
          )}
          <div className={styles.content}>
            <h1 className={styles.title}>{title}</h1>
            <h2 className={styles.description}>{description}</h2>
          </div>
        </header>
        <div className={styles.body}>
          <div className={styles.instructions}>
            <div className={styles.instructionsInner}>
              <div className={styles.instructionsHeader}>
                <h3 className={styles.compactTitle}>Instructions</h3>
                <button
                  className={styles.copyButton}
                  onClick={handleCopyInstructions}
                  data-copied={showCopied}
                >
                  <CheckIcon data-icon="check" />
                  <CopyClipboardIcon data-icon="copy" />
                </button>
              </div>
              <pre className={styles.pre}>{instructions}</pre>
            </div>
          </div>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <h3 className={styles.compactTitle}>Model</h3>
              <div className={styles.metaContent}>
                <ModelIcon model={model} />
                {model ? aiModel[model][1] : "Unknown"}
                {!proModels.includes(model) && (
                  <Tooltip>
                    <TooltipTrigger>
                      <span className={styles.badge}>
                        <span>Advanced AI</span>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Requires Advanced AI add-on to Raycast Pro
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <div className={styles.metaItem}>
              <h3 className={styles.compactTitle}>Creativity</h3>
              <div className={styles.metaContent}>
                <CreativityIcon creativity={creativity} />
                {creativityString[creativity][0]}
              </div>
            </div>
            <div className={styles.metaItem}>
              <h3 className={styles.compactTitle}>Automatic Web Search</h3>
              <div className={styles.metaContent}>
                {web_search ? <Globe01Icon /> : <XMarkCircleIcon />}
                {web_search ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div>
          <p className={styles.subtitle}>Explore more presets</p>
          <div className={styles.grid}>
            {relatedPresets.map((p) => (
              <PresetComponent key={p.id} preset={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function parseURLPreset(presetQueryString?: string) {
  if (!presetQueryString) {
    return null;
  }
  return JSON.parse(presetQueryString);
}
