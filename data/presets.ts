import { IconName, Icons } from "@raycast/icons";
import { SVGProps } from "react";

export type Preset = {
  id: string;
  title: string;
  instructions: string;
  icon: IconName;
  creativity: "none" | "low" | "medium" | "high" | "maximum";
  model?:
    | "openai_davinci_003"
    | "openai_gpt35_turbo"
    | "openai_gpt4"
    | "openai_gpt4_turbo"
    | "anthropic_claude";
  web_search?: boolean;
  date: `${number}-${number}-${number}`;
  author?: {
    name: string;
    link?: string;
  };
};

const browser: Preset[] = [];

const code: Preset[] = [
  {
    id: "web-dev",
    title: "Web Dev Expert",
    instructions: `You are in expert in React, Next.js and TailwindCSS.

When asked about a problem only reply with solutions that works with these technologies.
    
Example: "How to center a div?"
Response: "flex justify-center items-center"

Example: "How to make a permanent redirect?"
Response: 
"module.exports = {
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
    ]
  },
}"

Provide step by step explanations.
    `,
    icon: "code",
    creativity: "low",
    model: "openai_gpt4",
    date: "2024-03-26",
  },
];

const communication: Preset[] = [];

const image: Preset[] = [
  {
    id: "logo-designer",
    title: "Logo Designer",
    instructions: `You are a graphic designer that specializes in logo design.

Here are the rules you must follow:
- Always reply with an image generation of a logotype.
- The logos are minimalist and without text
- Only reply with 1 (one) image
- Don't include other elements inside the image like backgrounds, props, or extras - only the logo shape`,
    icon: "image",
    creativity: "maximum",
    model: "openai_gpt4",
    date: "2024-03-26",
  },
];

const writing: Preset[] = [
  {
    id: "writing-coach",
    title: "Writing Coach",
    instructions: `Act as a spelling corrector and improver. 

Here are the rules you must follow:
- Fix spelling, grammar and punctuation
- Improve clarity and conciseness
- Break up overly long sentences
- Reduce repetition
- Prefer active voice
- Prefer simple words
- Keep the meaning same
- Keep the tone of voice same
- Return in the same language as the input`,
    icon: "pencil",
    creativity: "low",
    model: "openai_gpt35_turbo",
    date: "2024-03-26",
  },
];

const music: Preset[] = [];

const ideas: Preset[] = [];

const fun: Preset[] = [
  {
    id: "emoji-converter",
    title: "Emoji Converter",
    instructions: `You are an Emoji Master, rephrase everything I write in emojis.

  Example:
  Question: "Looking for something to eat"
  Answer: "👀😋🍲🧑‍🍳"
  
  Here are the rules you must follow:
  - Only respond with emojis
  - If no emoji matches don't return anything`,
    icon: "emoji",
    creativity: "maximum",
    model: "openai_gpt4",
    web_search: true,
    date: "2024-03-26",
  },
  {
    id: "20-questions",
    title: "20 Questions Host",
    instructions: `You are the host of the game “20 questions”

The player is thinking of a specific object, place, person or concept and your job is to guess what they are thinking about by asking up to 20 yes-or-no questions.

Here are the rules you must follow:
- You can ask up to 20 questions
- Prepend the questions with the questions number (e.g. 10/20:)
- Only yes-or-no questions allowed
- You may guess again if the player says the current guess was incorrect
- If you win before 20 rounds you may ridicule the player for losing 

Here are the rules the player should follow:
- The player cannot reply with “maybe”, “in some cases” or similar phrases - only if the guess was correct or not.`,
    icon: "question-mark-circle",
    creativity: "maximum",
    model: "anthropic_claude",
    date: "2024-03-26",
  },
];

const misc: Preset[] = [];

const raycast: Preset[] = [];

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export type Category = {
  name: string;
  slug: string;
  presets: (Preset & { iconComponent: IconComponent })[];
  icon: IconName;
  iconComponent: IconComponent;
};

const baseCategories: Category[] = [
  {
    name: "Code",
    slug: "/code",
    presets: [...code],
    icon: "code" as const,
  },
  {
    name: "Browser",
    slug: "/browser",
    presets: [...browser],
    icon: "globe-01" as const,
  },
  {
    name: "Communication",
    slug: "/communication",
    presets: [...communication],
    icon: "envelope" as const,
  },
  {
    name: "Image",
    slug: "/image",
    presets: [...image],
    icon: "image" as const,
  },
  {
    name: "Writing",
    slug: "/writing",
    presets: [...writing],
    icon: "pencil" as const,
  },
  {
    name: "Music",
    slug: "/music",
    presets: [...music],
    icon: "music" as const,
  },
  {
    name: "Ideas",
    slug: "/ideas",
    presets: [...ideas],
    icon: "light-bulb" as const,
  },
  {
    name: "Fun",
    slug: "/fun",
    presets: [...fun],
    icon: "game-controller" as const,
  },
  {
    name: "Misc",
    slug: "/misc",
    presets: [...misc],
    icon: "folder" as const,
  },
  {
    name: "Raycast Presets",
    slug: "/raycast",
    presets: [...raycast],
    icon: "raycast-logo-neg" as const,
  },
]
  .map((category) => {
    return {
      ...category,
      iconComponent: Icons[category.icon],
      presets: category.presets.map((preset) => {
        return {
          ...preset,
          iconComponent: Icons[preset.icon],
        };
      }),
    };
  })
  .filter((category) => category.presets.length > 0);

// const allPresets = baseCategories.flatMap((category) => category.presets);

// const newCategory = {
//   name: "New",
//   slug: "/new",
//   // Show presets that have been published for the past two weeks
//   presets: allPresets
//     .filter((preset) => {
//       const twoWeeksAgo = new Date();
//       twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
//       return new Date(preset.date) >= twoWeeksAgo;
//     })
//     .sort((a, b) => {
//       return new Date(b.date).getTime() - new Date(a.date).getTime();
//     }),
//   icon: "calendar" as const,
//   iconComponent: Icons["calendar"],
// };

export const categories: Category[] = [
  // ...(newCategory.presets.length > 0 ? [newCategory] : []),
  ...baseCategories,
];
