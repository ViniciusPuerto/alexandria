import { createGlobalStyle } from 'styled-components'

export const theme = {
  colors: {
    primary: '#4C7DF0',
    primaryDark: '#355FCC',
    bg: '#0e0f12',
    surface: '#151820',
    text: '#E7E9EE',
    textMuted: '#B9C0CC',
    accent: '#F0B429'
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '18px'
  },
  shadow: {
    sm: '0 2px 8px rgba(0,0,0,0.2)',
    md: '0 8px 24px rgba(0,0,0,0.3)'
  }
} as const

export const GlobalStyle = createGlobalStyle`
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
  }
  a { color: inherit; text-decoration: none; }
  input, button { font-family: inherit; }
`

