import React from "react";
import NextLink from "next/link";
import { ScrollArea } from "../components/ScrollArea";

import { categories, Category, Model } from "../data/presets";

import styles from "../styles/Home.module.css";
import { useSectionInView } from "../utils/useSectionInViewObserver";
import { Info01Icon, StarsIcon } from "@raycast/icons";

import { PresetComponent } from "../components/Preset";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/Tooltip";
import Head from "next/head";

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

export const proModels: Model[] = [
  "openai-gpt-3.5-turbo",
  "anthropic-claude-haiku",
  "groq-mixtral-8x7b-32768",
  "perplexity-codellama-70b-instruct",
];

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
            proModels.includes(preset.model)
          ),
        }))
        .filter((category) => category.presets.length > 0);
    }
  }, [showAdvancedModels]);

  React.useEffect(() => {
    onTouchReady();
  }, [onTouchReady]);

  const pageTitle = "Preset Explorer by Raycast";
  const pageDescription = "Easily browse, share, and add presets to Raycast.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content="https://presets.ray.so/og-image.png"
        />
      </Head>
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
                  <div className={styles.filter}>
                    <span className={styles.label}>
                      <label htmlFor="advancedModels">
                        Show Advanced AI Models
                      </label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info01Icon />
                        </TooltipTrigger>
                        <TooltipContent>
                          Requires Advanced AI add-on to Raycast Pro
                        </TooltipContent>
                      </Tooltip>
                    </span>

                    <input
                      id="advancedModels"
                      type="checkbox"
                      min={0}
                      checked={showAdvancedModels}
                      onChange={(e) => setShowAdvancedModels(e.target.checked)}
                    />
                  </div>
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
    </>
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
