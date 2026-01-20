import type { TailwindColor } from "@/utils/types/tailwind";

type Theme = {
  colors: {
    primary: TailwindColor;
    blur: {
      top: TailwindColor;
      bottom: TailwindColor;
    };
  };
};

const theme: Theme = {
  colors: {
    primary: "vibrant-orange",
    blur: {
      top: "terracotta",
      bottom: "mustard",
    }
  },
};

export default theme;
