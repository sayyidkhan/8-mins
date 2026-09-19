import { config } from 'dotenv';

// Imported only by server entrypoints. Existing deployment environment wins.
export function loadServerEnv() {
  config({ quiet: true });
}
