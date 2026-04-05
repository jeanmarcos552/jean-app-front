export const theme = {
  colors: {
    primary: "#111111",
    secundary: "#bf1e86",
    warning: "#f59e0b",
    info: "#1356b4",
    success: "rgb(77, 207, 166)",
    danger: "#da5050",
    gray: "#a1a1a1",
    black: "rgba(0, 0, 0, 0.7)",
    white: "#d6d6d6",
  },
  background: {
    primary: "#bf1e8725",
    secundary: "#7272723b",
    warning: "#fbe4b433",
    info: "#C3DEFF36",
    success: "rgba(5, 150, 104, 0.24)",
    danger: "#8f050521",
    gray: "rgba(228, 228, 228, 0.12)",
    black: "#161616",
    white: "#dddddd",
  },
  border: {
    primary: "#d273b147",
    secundary: "#9c9c9c3b",
    warning: "rgba(250, 208, 153, 0.16)",
    info: "rgba(9, 43, 88, 0.14)",
    success: "rgba(5, 150, 104, 0.16)",
    danger: "rgba(255, 194, 194, 0.24)",
    gray: "rgba(218, 218, 218, 0.2)",
    black: "#303030",
    white: "#ffffff",
  },
  shadows: {
    primary: "#ef4444ff",
    secundary: "#0001F7ff",
    warning: "#F4AD49",
    info: "#0f6df0",
    success: "#519765FF",
    danger: "#D85A5AFF",
    gray: "#BDC3CFFF",
    black: "#fff",
    white: "#303030",
  },
  fonts: {
    body: "Montserrat-Medium",
    subtitulo: "Montserrat-Medium",
    titulo: "Montserrat-SemiBold",
  },
};

export type ThemeColorKey = keyof typeof theme.colors;
export type ThemeBackgroundKey = keyof typeof theme.background;
export type ThemeBorderKey = keyof typeof theme.border;
