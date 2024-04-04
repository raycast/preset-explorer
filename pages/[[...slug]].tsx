import React from "react";
import NextLink from "next/link";
import { ScrollArea } from "../components/ScrollArea";

import { categories, Category } from "../data/presets";

import styles from "../styles/Home.module.css";
import { useSectionInView } from "../utils/useSectionInViewObserver";
import { StarsIcon } from "@raycast/icons";

import { PresetComponent } from "../components/Preset";
import clsx from "clsx";

export function getStaticPaths() {
  const paths = categories.map((category) => ({
    params: { slug: [category.slug.replace("/", "")] },
  }));

  return {
    paths: [
      ...paths,
      {
        params: { slug: [] },
      },
    ],
    fallback: false,
  };
}

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home({ onTouchReady }: { onTouchReady: () => void }) {
  const [showAdvancedModels, setShowAdvancedModels] = React.useState(true);

  const filteredCategories = React.useMemo(() => {
    if (showAdvancedModels) {
      return categories;
    } else {
      return categories
        .map((category) => ({
          ...category,
          presets: category.presets.filter((preset) =>
            [
              "openai_gpt35_turbo",
              "anthropic_claude_haiku",
              "mistral_8x7b",
              "mistral_small",
              "meta_code_llama_70b",
              "meta_llama_2_70b",
            ].includes(preset.model || "")
          ),
        }))
        .filter((category) => category.presets.length > 0);
    }
  }, [showAdvancedModels]);

  React.useEffect(() => {
    onTouchReady();
  }, [onTouchReady]);

  return (
    <div className={styles.main}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <ScrollArea>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarNav}>
                <p className={styles.sidebarTitle}>Categories</p>

                {categories.map((category) => (
                  <NavItem
                    key={category.slug}
                    category={category}
                    disabled={
                      !filteredCategories.some(
                        (filteredCategory) =>
                          filteredCategory.slug === category.slug
                      )
                    }
                  />
                ))}
              </div>
              <span className={styles.sidebarNavDivider}></span>
              <div className={styles.sidebarNav}>
                <label className={styles.label}>
                  Show Advanced AI Models
                  <input
                    type="checkbox"
                    min={0}
                    checked={showAdvancedModels}
                    onChange={(e) => setShowAdvancedModels(e.target.checked)}
                  />
                </label>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className={styles.container}>
        {filteredCategories.map((category) => {
          return (
            <div
              key={category.name}
              data-section-slug={category.slug}
              style={{
                outline: "none",
              }}
              tabIndex={-1}
            >
              <h2 className={styles.subtitle}>
                <category.iconComponent /> {category.name}
              </h2>
              <div className={styles.presets}>
                {category.presets.map((preset) => (
                  <PresetComponent key={preset.id} preset={preset} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavItem({
  category,
  disabled,
}: {
  category: Category;
  disabled: boolean;
}) {
  const activeSection = useSectionInView();

  return (
    <NextLink
      href={category.slug}
      shallow
      className={clsx(styles.sidebarNavItem, disabled && styles.disabled)}
      data-active={activeSection === category.slug}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      {category.icon ? <category.iconComponent /> : <StarsIcon />}

      {category.name}
      <span className={styles.badge}>{category.presets.length}</span>
    </NextLink>
  );
}
