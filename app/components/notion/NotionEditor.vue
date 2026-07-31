<script setup lang="ts">
import type { EditorCustomHandlers, EditorMentionMenuItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { CustomAudio, CustomVideo } from '~/utils/tiptap/media'
import { CustomYoutube } from '~/utils/tiptap/youtube'
import { mediaUploadExtensions } from './MediaUploadExtension'
import { YoutubeEmbed } from './YoutubeEmbedExtension'

/**
 * Ce composant, ses frères du dossier `notion/`, les composables `useNotion*`
 * et les pièces partagées avec l'éditeur WYSIWYG (`EditorSourceCodeModal`,
 * `EditorEmojiPopover`, `app/utils/date-time.ts`) suffisent à le porter dans un
 * autre projet.
 */
const { onUpload, mentions = [], placeholder = 'Écrivez, ou tapez « / » pour les commandes…' } = defineProps<{
  /** Point d'extension pour l'envoi de fichiers. Voir `useEditorUpload`. */
  onUpload?: EditorUploadHandler
  mentions?: EditorMentionMenuItem[]
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' })

provide('editorUploadHandler', computed(() => onUpload))

const sourceCodeOpen = ref(false)
const emojiPopover = useTemplateRef('emojiPopover')

/**
 * Insère le bloc d'attente d'un média ; il se remplace tout seul une fois le
 * fichier envoyé — ou, pour YouTube, l'URL saisie.
 */
function mediaUploadHandler(node: string) {
  return {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: node }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: node }),
    isActive: (editor: Editor) => editor.isActive(node),
    isDisabled: undefined,
  }
}

const customHandlers = {
  imageUpload: mediaUploadHandler(editorMediaPresets.image.uploadNode),
  videoUpload: mediaUploadHandler(editorMediaPresets.video.uploadNode),
  audioUpload: mediaUploadHandler(editorMediaPresets.audio.uploadNode),
  youtubeEmbed: mediaUploadHandler(editorYoutubePreset.embedNode),
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
    isDisabled: undefined,
  },
  // Le format vient de l'item du menu ; la date, elle, est celle de l'insertion.
  dateTime: {
    canExecute: (editor: Editor) => editor.can().insertContent(' '),
    execute: (editor: Editor, cmd?: { format?: DateTimeFormat['format'] }) => {
      return editor.chain().focus().insertContent(cmd?.format?.(new Date()) ?? '')
    },
    isActive: () => false,
    isDisabled: undefined,
  },
  // Le panneau vit dans la barre d'outils : on l'ouvre au curseur, là où
  // l'émoji sera inséré. La chaîne renvoyée laisse le document intact.
  emoji: {
    canExecute: (editor: Editor) => editor.can().insertContent(' '),
    execute: (editor: Editor) => {
      emojiPopover.value?.openAtCaret()
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: undefined,
  },
  // Ouvre la modale ; la chaîne renvoyée laisse le document intact.
  sourceCode: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      sourceCodeOpen.value = true
      return editor.chain()
    },
    isActive: () => false,
    isDisabled: undefined,
  },
} satisfies EditorCustomHandlers

const { items: suggestionItems } = useNotionSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useNotionDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getMediaToolbarItems, getTableToolbarItems } = useNotionToolbar(customHandlers)

/** Vrai sur un média inséré comme sur son bloc d'attente. */
function isMediaActive(editor: Editor) {
  return editorMediaKinds.some(kind => editor.isActive(editorMediaPresets[kind].node)
    || editor.isActive(editorMediaPresets[kind].uploadNode))
  || editor.isActive(editorYoutubePreset.node)
  || editor.isActive(editorYoutubePreset.embedNode)
}

const extensions = [
  CodeBlockShiki.configure({
    defaultTheme: 'catppuccin-frappe',
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  }),
  // L'image vient de Nuxt UI ; vidéo et audio n'ont pas d'équivalent officiel.
  CustomVideo,
  CustomAudio,
  CustomYoutube,
  ...mediaUploadExtensions,
  YoutubeEmbed,
  TableKit,
  TaskList,
  TaskItem,
]
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="model"
    content-type="html"
    :extensions="extensions"
    :handlers="customHandlers"
    :placeholder="placeholder"
    autofocus
    :ui="{
      base: 'p-4 sm:p-14',
      content: 'max-w-4xl mx-auto',
    }"
  >
    <div class="sticky top-0 z-10 flex justify-end px-4 sm:px-14 py-2 bg-default/75 backdrop-blur border-b border-default">
      <UEditorToolbar
        :editor="editor"
        :items="toolbarItems"
        size="lg"
      >
        <template #emoji>
          <EditorEmojiPopover
            ref="emojiPopover"
            :editor="editor"
            size="lg"
          />
        </template>
      </UEditorToolbar>
    </div>

    <EditorSourceCodeModal
      v-model:open="sourceCodeOpen"
      :editor="editor"
    />

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor: current, view, state }: any) => {
        if (isMediaActive(current) || state.selection instanceof CellSelection) {
          return false
        }
        return view.hasFocus() && !state.selection.empty
      }"
    >
      <template #link>
        <NotionLinkPopover :editor="editor" />
      </template>
    </UEditorToolbar>

    <UEditorToolbar
      :editor="editor"
      :items="getMediaToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor: current, view }: any) => (editorMediaKinds.some(kind => current.isActive(editorMediaPresets[kind].node)) || current.isActive(editorYoutubePreset.node)) && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="getTableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor: current, view }: any) => current.state.selection instanceof CellSelection && view.hasFocus()"
    />

    <UEditorMentionMenu
      v-if="mentions.length"
      :editor="editor"
      :items="mentions"
    />

    <UEditorSuggestionMenu
      :editor="editor"
      :items="suggestionItems"
    />

    <UEditorDragHandle
      v-slot="{ ui, onClick }"
      :editor="editor"
      @node-change="onNodeChange"
    >
      <UButton
        icon="i-tabler-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Insérer un bloc"
        :class="ui.handle()"
        @click="(e: MouseEvent) => {
          e.stopPropagation()
          const node = onClick()
          handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
        }"
      />

      <UDropdownMenu
        v-slot="{ open }"
        :modal="false"
        :items="getDragHandleItems(editor)"
        :content="{ side: 'left' }"
        :ui="{ content: 'w-56', label: 'text-xs' }"
        @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
      >
        <UButton
          color="neutral"
          variant="ghost"
          active-variant="soft"
          size="sm"
          icon="i-tabler-grip-vertical"
          aria-label="Options du bloc"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
