// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      componentDetection: true,
    },
  },

  compatibilityDate: '2026-07-30',

  vite: {
    optimizeDeps: {
      include: [
        '@tiptap/core',
        '@tiptap/extensions',
        '@tiptap/extension-emoji',
        '@tiptap/extension-image',
        '@tiptap/extension-list',
        '@tiptap/extension-subscript',
        '@tiptap/extension-superscript',
        '@tiptap/extension-table',
        '@tiptap/extension-text-align',
        '@tiptap/extension-text-style',
        '@tiptap/pm/model',
        '@tiptap/pm/tables',
        '@tiptap/vue-3',
        '@vueuse/core',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
        'tiptap-extension-code-block-shiki',
      ],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  icon: {
    clientBundle: {
      scan: {
        globInclude: [
          '**/*.{vue,jsx,ts,tsx,md,mdc,mdx,yml,yaml}',
        ],
      },
    },
  },
})
