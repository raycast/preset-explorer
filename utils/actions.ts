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

function makePresetImportData(presets: Preset[]): string {
  return `[${presets
    .map((selectedPreset) => {
      const { title, instructions, creativity, icon, model } = selectedPreset;

      return JSON.stringify({
        title,
        instructions,
        creativity,
        icon,
        model: prepareModel(model),
      });
    })
    .join(",")}]`;
}

function makeQueryString(presets: Preset[]): string {
  const queryString = presets
    .map((selectedPreset) => {
      const { title, instructions, creativity, icon, model } = selectedPreset;

      return `presets=${encodeURIComponent(
        JSON.stringify({
          title,
          instructions,
          creativity,
          icon,
          model: prepareModel(model),
        })
      )}`;
    })
    .join("&");
  return queryString;
}

export function downloadData(presets: Preset[]) {
  const encodedPresetsData = encodeURIComponent(makePresetImportData(presets));
  const jsonString = `data:text/json;chatset=utf-8,${encodedPresetsData}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "presets.json";
  link.click();
}

export function copyData(presets: Preset[]) {
  copy(makePresetImportData(presets));
}

export function makeUrl(presets: Preset[]) {
  return `${window.location.origin}/shared?${makeQueryString(presets)}`;
}

export function copyUrl(presets: Preset[]) {
  copy(makeUrl(presets));
}

export function addToRaycast(router: NextRouter, presets: Preset[]) {
  router.replace(
    `${raycastProtocol}://presets/import?${makeQueryString(presets)}`
  );
}
