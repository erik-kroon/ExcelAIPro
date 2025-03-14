interface ImportMetaEnv {
  readonly VERCEL_URL: string;
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
