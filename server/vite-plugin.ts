import type { Plugin } from 'vite';
import { loadServerEnv } from './env.ts';
import { createRecognitionMiddleware } from './recognition.ts';

export function drawingRecognitionPlugin(): Plugin {
  return {
    name: 'server-drawing-recognition',
    configureServer(server) {
      loadServerEnv();
      server.middlewares.use(createRecognitionMiddleware());
    },
    configurePreviewServer(server) {
      loadServerEnv();
      server.middlewares.use(createRecognitionMiddleware());
    },
  };
}
