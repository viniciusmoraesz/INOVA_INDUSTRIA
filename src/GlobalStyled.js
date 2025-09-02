import { createGlobalStyle } from "styled-components";

const GlobalStyled = createGlobalStyle`
  :root {
    /* Tamanhos de fonte base */
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-base: 1rem;    /* 16px */
    --font-size-lg: 1.125rem;  /* 18px */
    --font-size-xl: 1.25rem;   /* 20px */
    --font-size-2xl: 1.5rem;   /* 24px */
    --font-size-3xl: 1.875rem; /* 30px */
    
    /* Espaçamentos base */
    --spacing-1: 0.25rem;  /* 4px */
    --spacing-2: 0.5rem;   /* 8px */
    --spacing-3: 0.75rem;  /* 12px */
    --spacing-4: 1rem;     /* 16px */
    --spacing-5: 1.5rem;   /* 24px */
    --spacing-6: 2rem;     /* 32px */
    --spacing-8: 3rem;     /* 48px */
    
    /* Outras variáveis */
    --border-radius: 0.5rem;
    --border-radius-lg: 1rem;
    --box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --box-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  *, *::before, *::after {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html {
    /* 1rem = 16px (padrão do navegador) */
    font-size: 100%;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    
    /* Ajuste para zoom */
    @media (max-width: 1200px) { font-size: 93.75%; } /* 15px */
    @media (max-width: 992px)  { font-size: 87.5%; }  /* 14px */
    @media (max-width: 768px)  { font-size: 81.25%; } /* 13px */
    @media (max-width: 480px)  { font-size: 75%; }    /* 12px */
  }

  body {
    font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
    color: #333;
    background-color: #f8fafc;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Melhorias de tipografia */
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.2;
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: 1rem;
  }

  /* Links */
  a {
    color: #3182ce;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #2c5282;
      text-decoration: underline;
    }
  }

  /* Imagens responsivas */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Formulários */
  button, input, optgroup, select, textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button, input {
    overflow: visible;
  }

  button, select {
    text-transform: none;
  }

  /* Ajustes para telas pequenas */
  @media (max-width: 768px) {
    body {
      padding: 0;
    }
    
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }
`

export default GlobalStyled;