import {
  CSSVariablesResolver,
  DEFAULT_THEME,
  DefaultMantineColor,
  MantineColorsTuple,
  MantineSize,
  MantineThemeOverride,
  createTheme,
  mergeMantineTheme,
  rem,
} from "@mantine/core";
import { Roboto, Space_Mono } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  fallback: ["system-ui, sans-serif"],
});

const spaceMonoFont = Space_Mono({
  weight: "400",
  subsets: ["latin"],
  fallback: ["system-ui, sans-serif"],
});

type ExtendedCustomColors = DefaultMantineColor;
export type ExtendedCustomFontSized = MantineSize;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    fontSizes: Record<ExtendedCustomFontSized, MantineColorsTuple>;
  }
}

// Default ==> https://mantine.dev/theming/default-theme/
const themeOverride = createTheme({
  // General
  white: "#fff",
  black: "#000",
  breakpoints: {
    base: "0rem", // 0px
    xs: "36em", // 576px
    sm: "48em", // 768px
    md: "62em", // 992px
    lg: "75em", // 1200px
    xl: "88em", // 1408px
  },

  // Fonts
  headings: {
    fontFamily: roboto.style.fontFamily,
    fontWeight: "700",
  },
  fontFamily: roboto.style.fontFamily,
  fontFamilyMonospace: spaceMonoFont.style.fontFamily,
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(18),
    xl: rem(20),

    // Headings sizes
    h1: rem(36),
    h2: rem(32),
    h3: rem(24),
    h4: rem(20),
    h5: rem(18),
    h6: rem(16),
  },

  // Colors
  primaryColor: "blue",
  primaryShade: {
    light: 6,
    dark: 8,
  },
  colors: {},
  other: {},

  // Components
  components: {},
} as MantineThemeOverride);

const CONTAINER_SIZES: Record<string, string> = {
  xs: rem(320),
  sm: rem(640),
  md: rem(960),
  lg: rem(1280),
  xl: rem(1440),
};

export const resolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {},
  dark: {},
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
