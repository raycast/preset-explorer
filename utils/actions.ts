import copy from "copy-to-clipboard";
import { NextRouter } from "next/router";
import { Preset } from "../data/presets";

const raycastProtocolForEnvironments = {
  development: "raycastinternal",
  production: "raycast",
  test: "raycastinternal",
};
const raycastProtocol = raycastProtocolForEnvironments[process.env.NODE_ENV];

function prepareModel(model?: string) {
  if (model && /^".*"$/.test(model)) {
    return model.slice(1, model.length - 1);
  }
  return model || "openai_gpt35_turbo";
}

function makePresetImportData(preset: Preset): string {
  const { title, instructions, creativity, icon, model, web_search } = preset;
  return `[${JSON.stringify({
    title,
    instructions,
    creativity,
    icon,
    model: prepareModel(model),
    web_search,
  })}]`;
}

function makeQueryString(preset: Preset): string {
  const {
    title,
    instructions,
    description,
    creativity,
    icon,
    model,
    web_search,
    id,
  } = preset;

  return `preset=${encodeURIComponent(
    JSON.stringify({
      title,
      description,
      instructions,
      creativity,
      icon,
      model: prepareModel(model),
      web_search,
      id,
    })
  )}`;
}

export function downloadData(preset: Preset) {
  const encodedPresetData = encodeURIComponent(makePresetImportData(preset));
  const jsonString = `data:text/json;chatset=utf-8,${encodedPresetData}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `${preset.id}.json`;
  link.click();
}

export function copyData(preset: Preset) {
  copy(makePresetImportData(preset));
}

export function makeUrl(preset: Preset) {
  const host =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://presets.ray.so";
  if (preset.id) {
    return `${host}/preset/${preset.id}`;
  }
  return `${host}/shared?${makeQueryString(preset)}`;
}

export function copyUrl(preset: Preset) {
  copy(makeUrl(preset));
}

export function addToRaycast(router: NextRouter, preset: Preset) {
  router.replace(
    `${raycastProtocol}://presets/import?${makeQueryString(preset)}`
  );
}
