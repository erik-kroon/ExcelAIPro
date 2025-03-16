declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    XLSX: any; // Or define more specific types if possible (see below)
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const XLSX: any; // Add this line
}

declare module "fast-formula-parser";

export {};
