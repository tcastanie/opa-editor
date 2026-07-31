# OPA Editor

Templates for **Nuxt 4 + Nuxt UI 4**, builts on **TipTap 3**, to be copy-pasted in future projects (maybe).

  - Notion-like editor (based on [`nuxt-ui-templates/editor`](https://github.com/nuxt-ui-templates/editor))
  - WYSIWYG editor

Both editors produce **HTML**.

![OPA Editor logo](/public/logo.webp)

## Copying a template into another project

Each template is self-contained: its own component folder, its own
composables, plus a shared core both depend on. Pick a template below, copy
its files and the shared core, wire up storage via `onUpload` (see the
commented block at the top of `pages/notion.vue` / `pages/wysiwyg.vue`), and
you're done — nothing else in this repo (`AppHeader.vue`, `pages/index.vue`,
branding) needs to come along.

### Shared core (needed by both templates)

```
app/composables/useEditorUpload.ts
app/components/EditorEmojiPopover.vue
app/components/EditorSourceCodeModal.vue
app/utils/date-time.ts
app/utils/editor-media.ts
app/utils/editor-youtube.ts
app/utils/i18n/editor-strings.ts
app/utils/tiptap/media.ts
app/utils/tiptap/youtube.ts
```

Plus, from `app.config.ts`, the `ui.editor.slots.base` array (table and task
list styling) and, from `app/assets/css/main.css`, the "Médias (les deux
templates)" block. The `icons` block in `app.config.ts` is cosmetic only
(replaces Nuxt UI's default Lucide icons with Tabler ones) — skip it if you'd
rather keep the host project's existing icon set.

Dependencies: `@nuxt/ui`, `@tiptap/core`, `@tiptap/vue-3`, `@tiptap/pm`,
`@tiptap/extension-youtube`, `vue-frimousse`, `@iconify-json/tabler`.

### Notion-like template

```
app/components/notion/
app/composables/useNotionDragHandle.ts
app/composables/useNotionSuggestions.ts
app/composables/useNotionToolbar.ts
app/utils/i18n/notion-strings.ts
```

Dependencies (on top of the shared core): `@tiptap/extension-list`,
`@tiptap/extension-table`, `tiptap-extension-code-block-shiki`, `shiki`,
`scule`.

### WYSIWYG template

```
app/components/wysiwyg/
app/composables/useWysiwygHandlers.ts
app/composables/useWysiwygToolbar.ts
app/utils/wysiwyg-manifest.ts
app/utils/tiptap/custom-image.ts
app/utils/tiptap/pre-keymap.ts
app/utils/tiptap/preserved-attributes.ts
app/utils/i18n/wysiwyg-strings.ts
```

Plus, from `app/assets/css/main.css`, the "Template WYSIWYG" block (column
resize handle).

Dependencies (on top of the shared core): `@tiptap/extension-image`,
`@tiptap/extension-subscript`, `@tiptap/extension-superscript`,
`@tiptap/extension-table`, `@tiptap/extension-text-align`,
`@tiptap/extension-text-style`, `@tiptap/extensions`, `@vueuse/core`.

### Changing the language

All user-facing text (labels, tooltips, placeholders, error messages) lives in
three files under `app/utils/i18n/`: `editor-strings.ts` (shared),
`notion-strings.ts` and `wysiwyg-strings.ts` (one per template). Translating a
template is limited to editing its string file(s) — no need to hunt through
components or composables. Date/time formatting (`app/utils/date-time.ts`,
`useWysiwygHandlers.ts`) still hardcodes the `fr-FR` locale separately.
