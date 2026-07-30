<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

/**
 * Barre d'outils fixe du template WYSIWYG. Chaque item du manifeste qui ouvre
 * un panneau déclare un `slot` dans `useWysiwygToolbar` ; c'est ici qu'on y
 * branche le composant correspondant.
 */
defineProps<{
  editor: Editor
  items: EditorToolbarItem[][]
  onUpload?: EditorUploadHandler
}>()
</script>

<template>
  <UEditorToolbar
    :editor="editor"
    :items="items"
    class="flex-wrap gap-y-1 p-1.5 border-b border-default bg-default sticky top-0 z-10"
  >
    <template #fontSize>
      <WysiwygFontSizeMenu
        :editor="editor"
        :items="fontSizes"
      />
    </template>

    <template #foreColor>
      <WysiwygColorMenu
        :editor="editor"
        mode="text"
        label="Couleur du texte"
        icon="i-tabler-text-color"
      />
    </template>

    <template #backColor>
      <WysiwygColorMenu
        :editor="editor"
        mode="background"
        label="Couleur de fond"
        icon="i-tabler-highlight"
      />
    </template>

    <template #link>
      <WysiwygLinkPopover :editor="editor" />
    </template>

    <template #image>
      <WysiwygMediaPopover
        :editor="editor"
        kind="image"
        :on-upload="onUpload"
      />
    </template>

    <template #video>
      <WysiwygMediaPopover
        :editor="editor"
        kind="video"
        :on-upload="onUpload"
      />
    </template>

    <template #audio>
      <WysiwygMediaPopover
        :editor="editor"
        kind="audio"
        :on-upload="onUpload"
      />
    </template>

    <template #table>
      <WysiwygTableMenu :editor="editor" />
    </template>

    <template #dateTime>
      <WysiwygDateTimeMenu :editor="editor" />
    </template>
  </UEditorToolbar>
</template>
