import Plyr from "plyr";

declare global {
  interface Window {
    Plyr: typeof Plyr;
  }
}

export {};