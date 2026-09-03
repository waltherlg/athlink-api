import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@athlink/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
    },
  },
});
