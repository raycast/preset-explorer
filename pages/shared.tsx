import React from "react";
import Link from "next/link";
import SelectionArea, { SelectionEvent } from "@viselect/react";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/DropdownMenu";
import { Toast, ToastTitle } from "../components/Toast";
import { ScrollArea } from "../components/ScrollArea";
import { Button } from "../components/Button";
import { ButtonGroup } from "../components/ButtonGroup";
import { isTouchDevice } from "../utils/isTouchDevice";
import { extractPresets } from "../utils/extractPresets";
import styles from "../styles/Home.module.css";
import buttonStyles from "../components/Button.module.css";
import { Preset } from "../data/presets";
import CreativityIcon from "../components/CreativityIcon";
import {
  ChevronDownIcon,
  CopyClipboardIcon,
  DownloadIcon,
  PlusCircleIcon,
  StarsIcon,
  Icons,
} from "@raycast/icons";
import { addToRaycast, copyData, downloadData } from "../utils/actions";
import WebSearchIcon from "../components/WebSearchIcon";

export default function Home() {
  const router = useRouter();

  const [copied, setCopied] = React.useState(false);

  const [actionsOpen, setActionsOpen] = React.useState(false);
  const sharedPresetsInURL = React.useMemo(
    () => parseURLPreset(router.query.presets),
    [router.query]
  );
  const [selectedPresets, setSelectedPresets] = React.useState([
    ...sharedPresetsInURL,
  ]);
  const isTouch = React.useMemo(
    () => (typeof window !== "undefined" ? isTouchDevice() : false),
    []
  );

  React.useEffect(() => {
    // everytime the sharedPresetsInURL changes, we want to update the selectedPresets
    // so that we start with the shared presets selected
    setSelectedPresets([...sharedPresetsInURL]);
  }, [sharedPresetsInURL]);

  const categories = [
    {
      name: `${sharedPresetsInURL.length} ${
        sharedPresetsInURL.length > 1 ? "presets" : "preset"
      } shared with you`,
      isTemplate: true,
      isShared: true,
      presets: sharedPresetsInURL,
      slug: "/shared",
      icon: StarsIcon,
    },
  ];

  const onStart = ({ event, selection }: SelectionEvent) => {
    if (!event?.ctrlKey && !event?.metaKey) {
      selection.clearSelection();
      setSelectedPresets([]);
    }
  };

  const onMove = ({
    store: {
      changed: { added, removed },
    },
  }: SelectionEvent) => {
    const addedPresets = extractPresets(added, categories);
    const removedPresets = extractPresets(removed, categories);

    setSelectedPresets((prevPresets) => {
      const presets = [...prevPresets];

      addedPresets.forEach((preset) => {
        if (!preset) {
          return;
        }
        if (presets.find((p) => p.id === preset.id)) {
          return;
        }
        presets.push(preset);
      });

      removedPresets.forEach((preset) => {
        return presets.filter((s) => s?.id !== preset?.id);
      });

      return presets;
    });
  };

  const handleDownload = React.useCallback(() => {
    downloadData(selectedPresets);
  }, [selectedPresets]);

  const handleCopyData = React.useCallback(() => {
    copyData(selectedPresets);
    setCopied(true);
  }, [selectedPresets]);

  const handleAddToRaycast = React.useCallback(
    () => addToRaycast(router, selectedPresets),
    [router, selectedPresets]
  );

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const { key, keyCode, metaKey, altKey } = event;

      if (key === "k" && metaKey) {
        if (selectedPresets.length === 0) return;
        setActionsOpen((prevOpen) => {
          return !prevOpen;
        });
      }

      if (key === "d" && metaKey) {
        if (selectedPresets.length === 0) return;
        event.preventDefault();
        handleDownload();
      }

      if (key === "Enter" && metaKey) {
        if (selectedPresets.length === 0) return;
        event.preventDefault();
        handleAddToRaycast();
      }

      // key === "c" doesn't work when using alt key, so we use keCode instead (67)
      if (keyCode === 67 && metaKey && altKey) {
        if (selectedPresets.length === 0) return;
        event.preventDefault();
        handleCopyData();
        setActionsOpen(false);
      }

      if (key === "a" && metaKey) {
        event.preventDefault();
        setSelectedPresets([...sharedPresetsInURL]);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [
    sharedPresetsInURL,
    setActionsOpen,
    selectedPresets,
    handleCopyData,
    handleDownload,
    handleAddToRaycast,
  ]);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [copied]);

  if (sharedPresetsInURL.length === 0) {
    return;
  }

  console.log(categories);

  return (
    <div>
      <header className={styles.nav}>
        <Link
          href="/"
          aria-label="Home"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          <span
            className={buttonStyles.button}
            style={{ fontWeight: 500, fontSize: 13 }}
            data-variant="gray"
          >
            ← See all Presets
          </span>
        </Link>
        <div className={styles.navControls}>
          <ButtonGroup>
            <Button
              variant="red"
              disabled={selectedPresets.length === 0}
              onClick={() => handleAddToRaycast()}
            >
              <PlusCircleIcon /> Add to Raycast
            </Button>

            <DropdownMenu open={actionsOpen} onOpenChange={setActionsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="red"
                  disabled={selectedPresets.length === 0}
                  aria-label="Export options"
                >
                  <ChevronDownIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  disabled={selectedPresets.length === 0}
                  onSelect={() => handleDownload()}
                >
                  <DownloadIcon /> Download JSON
                  <span className={styles.hotkeys}>
                    <kbd>⌘</kbd>
                    <kbd>D</kbd>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={selectedPresets.length === 0}
                  onSelect={() => handleCopyData()}
                >
                  <CopyClipboardIcon /> Copy JSON{" "}
                  <span className={styles.hotkeys}>
                    <kbd>⌘</kbd>
                    <kbd>⌥</kbd>
                    <kbd>C</kbd>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>
      </header>

      <Toast open={copied} onOpenChange={setCopied}>
        <ToastTitle className={styles.toastTitle}>
          <CopyClipboardIcon /> Copied to clipboard
        </ToastTitle>
      </Toast>

      <div>
        <div className={styles.container}>
          {isTouch !== null && (
            <SelectionArea
              className="container"
              onStart={onStart}
              onMove={onMove}
              selectables=".selectable"
              features={{
                // Disable support for touch devices
                touch: isTouch ? false : true,
                range: true,
                singleTap: {
                  allow: true,
                  intersect: "native",
                },
              }}
            >
              {categories.map((presetGroup) => {
                return (
                  <div
                    key={presetGroup.name}
                    data-section-slug={presetGroup.slug}
                    style={{ outline: "none" }}
                  >
                    <h2 className={styles.subtitle}>
                      <presetGroup.icon /> {presetGroup.name}
                    </h2>
                    <div className={styles.presets}>
                      {presetGroup.presets.map((preset, index) => {
                        const Icon =
                          preset.icon in Icons ? Icons[preset.icon] : StarsIcon;

                        return (
                          <div
                            className={`${styles.item} selectable`}
                            key={preset.id}
                            data-selected={selectedPresets.some(
                              (selectedPreset) =>
                                selectedPreset?.id === preset.id
                            )}
                            data-key={`${presetGroup.slug}-${index}`}
                          >
                            <div className={styles.presetTemplate}>
                              <ScrollArea>
                                <pre
                                  className={styles.template}
                                  dangerouslySetInnerHTML={{
                                    __html: preset.instructions.replace(
                                      /\{[^}]+\}/g,
                                      `<span class="${styles.placeholder}">$&</span>`
                                    ),
                                  }}
                                ></pre>
                              </ScrollArea>
                            </div>
                            <div className={styles.preset}>
                              <span className={styles.name}>
                                <Icon />
                                {preset.title}
                              </span>
                              <WebSearchIcon webSearch={preset.web_search} />
                              <CreativityIcon creativity={preset.creativity} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </SelectionArea>
          )}
        </div>
      </div>
    </div>
  );
}

function parseURLPreset(presetQueryString?: string | string[]): Preset[] {
  if (!presetQueryString) {
    return [];
  }
  let presets;
  if (Array.isArray(presetQueryString)) {
    presets = presetQueryString;
  } else {
    presets = [presetQueryString];
  }
  return presets.map((preset) => ({
    ...JSON.parse(preset),
    id: nanoid(),
    isShared: true,
  }));
}
