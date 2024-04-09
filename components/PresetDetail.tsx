import React from "react";
import copy from "copy-to-clipboard";

import {
  CheckIcon,
  CopyClipboardIcon,
  Globe01Icon,
  Icons,
  XMarkCircleIcon,
} from "@raycast/icons";

import { PresetComponent, aiModel } from "./Preset";
import { creativity as creativityString } from "./Preset";
import CreativityIcon from "./CreativityIcon";
import ModelIcon from "./ModelIcon";

import { Preset } from "../data/presets";
import styles from "./PresetDetail.module.css";
import Head from "next/head";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { proModels } from "../pages/[[...slug]]";

type PresetPageProps = {
  preset: Preset;
  relatedPresets: Preset[];
};

export function PresetDetail({ preset, relatedPresets }: PresetPageProps) {
  const [showCopied, setShowCopied] = React.useState(false);

  React.useEffect(() => {
    if (showCopied) {
      setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }
  }, [showCopied]);

  if (!preset) {
    return null;
  }

  const {
    title,
    description,
    instructions,
    creativity,
    icon = "stars",
    model,
    web_search,
  } = preset;

  const IconComponent = Icons[icon] ? Icons[icon] : null;

  const handleCopyInstructions = () => {
    copy(instructions);
    setShowCopied(true);
  };

  const pageTitle = `${title} - Raycast AI Preset`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content={`https://presets.ray.so/api/og?title=${encodeURIComponent(
            title
          )}&description=${encodeURIComponent(description || "")}&icon=${icon}`}
          key="og-image"
        />
        <meta name="twitter:label1" content="Model" />
        <meta name="twitter:data1" content={aiModel[model][1]} />
        <meta name="twitter:label2" content="Creativity" />
        <meta name="twitter:data2" content={creativityString[creativity][0]} />
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
                {aiModel[model][1]}
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
        {relatedPresets && (
          <>
            <div className={styles.separator}></div>
            <div>
              <p className={styles.subtitle}>Explore more presets</p>
              <div className={styles.grid}>
                {relatedPresets.map((p) => (
                  <PresetComponent key={p.id} preset={p} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
