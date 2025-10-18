import { useState, useMemo } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ColorModeContext } from "../context/ColorModeContext";
import { PaletteMode } from "@mui/material/styles";

export default function ThemeProviderComponent({ children }) {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );
  
  //for silencing errors during project build
  const modeCast = mode as PaletteMode;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: modeCast
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}