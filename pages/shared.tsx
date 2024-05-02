import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

import { allPresets, Preset } from "../data/presets";
import { PresetDetail } from "../components/PresetDetail";
import { AiModel, getAvailableAiModels } from "../lib/api";

export function parseURLPreset(presetQueryString?: string) {
  if (!presetQueryString) {
    return null;
  }
  return JSON.parse(presetQueryString);
}

export const getServerSideProps: GetServerSideProps<{
  preset: Preset;
  relatedPresets: Preset[];
  models: AiModel[];
}> = async (context) => {
  const { query } = context;
  const preset = parseURLPreset(query.preset as string);

  if (!preset) {
    return { notFound: true };
  }

  const relatedPresets = allPresets
    .filter((p) => p.id !== preset.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  const models = await getAvailableAiModels();

  return {
    props: {
      preset,
      relatedPresets: relatedPresets,
      models,
    },
  };
};

export default function PresetPage({
  preset,
  relatedPresets,
  models,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <PresetDetail
      preset={preset}
      relatedPresets={relatedPresets}
      models={models}
    />
  );
}
