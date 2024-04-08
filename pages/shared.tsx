import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";

import { allPresets, Preset } from "../data/presets";
import { PresetDetail } from "../components/PresetDetail";

export function parseURLPreset(presetQueryString?: string) {
  if (!presetQueryString) {
    return null;
  }
  return JSON.parse(presetQueryString);
}

export const getServerSideProps: GetServerSideProps<{
  preset: Preset;
  relatedPresets: Preset[];
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

  return {
    props: {
      preset,
      relatedPresets: relatedPresets,
    },
  };
};

export default function PresetPage({
  preset,
  relatedPresets,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <PresetDetail preset={preset} relatedPresets={relatedPresets} />;
}
