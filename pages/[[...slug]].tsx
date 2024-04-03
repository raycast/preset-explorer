import React from "react";
import NextLink from "next/link";
import { ScrollArea } from "../components/ScrollArea";

import { categories, Category } from "../data/presets";

import styles from "../styles/Home.module.css";
import { useSectionInView } from "../utils/useSectionInViewObserver";
import { StarsIcon } from "@raycast/icons";

import { PresetComponent } from "../components/Preset";

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
                  <NavItem key={category.slug} category={category} />
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className={styles.container}>
        {categories.map((category) => {
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

function NavItem({ category }: { category: Category }) {
  const activeSection = useSectionInView();

  return (
    <NextLink
      href={category.slug}
      shallow
      className={styles.sidebarNavItem}
      data-active={activeSection === category.slug}
    >
      {category.icon ? <category.iconComponent /> : <StarsIcon />}

      {category.name}
      <span className={styles.badge}>{category.presets.length}</span>
    </NextLink>
  );
}
