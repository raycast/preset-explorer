import * as Tooltip from "@radix-ui/react-tooltip";

import { Preset } from "../data/presets";

import { Globe01Icon } from "@raycast/icons";

import styles from "./WebSearchIcon.module.css";

export default function WebSearchIcon({
  webSearch,
}: {
  webSearch: Preset["web_search"];
}) {
  if (!webSearch) return null;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger asChild>
          <button className={styles.button}>
            <Globe01Icon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.tooltip} sideOffset={5}>
            Searches the web when context is missing
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
