import {
  CircleIcon,
  CircleProgress25Icon,
  CircleProgress50Icon,
  CircleProgress75Icon,
  CircleProgress100Icon,
} from "@raycast/icons";

import { Preset } from "../data/presets";

export default function CreativityIcon({
  creativity,
}: {
  creativity: Preset["creativity"];
}) {
  let component = null;
  if (creativity === "none") {
    component = <CircleIcon />;
  }

  if (creativity === "low") {
    component = <CircleProgress25Icon />;
  }

  if (creativity === "medium") {
    component = <CircleProgress50Icon />;
  }

  if (creativity === "high") {
    component = <CircleProgress75Icon />;
  }

  if (creativity === "maximum") {
    component = <CircleProgress100Icon />;
  }

  return component;
}
