import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from '@mui/material';

type ColorModeContextType = { mode: PaletteMode; toggle: () => void };
const ColorModeContext = createContext<ColorModeContextType | null>(null);

export const useColorMode = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within ThemeProvider');
  return ctx;
};

const COLORS = {
  primary: '#0D47A1',
  secondary: '#00695C',
};

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === 'dark' || stored === 'light'
      ? (stored as PaletteMode)
      : 'light';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', mode);
    document.body.className = mode;
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === 'light' ? 'dark' : 'light')),
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: COLORS.primary },
          secondary: { main: COLORS.secondary },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#0F172A',
            paper:
              mode === 'light'
                ? 'rgba(255,255,255,0.85)'
                : 'rgba(15,23,42,0.85)',
          },
          text: {
            primary: mode === 'light' ? '#1E293B' : '#F1F5F9',
          },
        },
        typography: {
          fontFamily: `'Inter','Poppins',sans-serif`,
          h1: { fontWeight: 800, fontSize: '3rem' },
          h2: { fontWeight: 700, fontSize: '2.25rem' },
          h3: { fontWeight: 700, fontSize: '1.75rem' },
        },
        shape: { borderRadius: 16 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 12,
                transition: 'transform .25s ease, box-shadow .25s ease',
                '&:hover': { transform: 'translateY(-2px)' },
              },
              contained: {
                backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.18)',
                backgroundImage:
                  'linear-gradient(135deg,rgba(255,255,255,0.20),rgba(255,255,255,0.08))',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundImage:
                mode === 'light'
                  ? `radial-gradient(circle, rgba(13,71,161,0.15) 0%, transparent 70%), linear-gradient(135deg, #F8FAFC, #FFF)`
                  : `radial-gradient(circle, rgba(13,71,161,0.10) 0%, transparent 70%), linear-gradient(135deg, #0F172A, #1E293B)`,
              transition: 'all .3s ease-in-out',
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  );
}
