// src/components/ThemeContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode,
        ...(mode === "light"
          ? {
              primary: { main: "#0066cc" },     // Azul padrão da clínica
              secondary: { main: "#28a745" },   // Verde
              background: {
                default: "#f4f6f8",
                paper: "#fff",
              },
            }
          : {
              primary: { main: "#90caf9" },
              secondary: { main: "#66bb6a" },
              background: {
                default: "#121212",
                paper: "#1e1e1e",
              },
            }),
      },
      typography: {
        //fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
        h5: {
          fontWeight: 600,
        },
        button: {
          textTransform: "none", // Remove caixa alta dos botões
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 10,
            },
          },
        },
      },
    });
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggleColorMode, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
