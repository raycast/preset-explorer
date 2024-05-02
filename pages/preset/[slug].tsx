import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Preset, allPresets } from "../../data/presets";
import { PresetDetail } from "../../components/PresetDetail";
import { AiModel, getAvailableAiModels } from "../../lib/api";

export const getStaticPaths: GetStaticPaths = () => {
  const paths = allPresets.map((preset) => ({
    params: { slug: preset.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  preset: Preset;
  relatedPresets: Preset[];
  models: AiModel[];
}> = async (context) => {
  const { params } = context;
  if (!params) {
    return { notFound: true };
  }

  const preset = allPresets.find((preset) => preset.id === params.slug);

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
      relatedPresets,
      models,
    },
  };
};

type PresetPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function PresetPage({
  preset,
  relatedPresets,
  models,
}: PresetPageProps) {
  return (
    <PresetDetail
      preset={preset}
      relatedPresets={relatedPresets}
      models={models}
    />
  );
}
