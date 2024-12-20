import { fileURLToPath, URL } from 'node:url'
import Inspect from 'vite-plugin-inspect'
import type { PluginOption } from 'vite'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'

const pathResolve = (dir: string): string => fileURLToPath(new URL(dir, import.meta.url))

export default defineConfig(() => {
  return {
    server: {
      host: true,
      port: 3003
    },
    plugins: [Inspect() as PluginOption, vueJsx() as PluginOption],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'legacy'
        }
      }
    }
  }
})
