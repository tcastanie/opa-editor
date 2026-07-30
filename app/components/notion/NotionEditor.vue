<script setup lang="ts">
import type { EditorCustomHandlers, EditorEmojiMenuItem, EditorMentionMenuItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/core'
import { Emoji, gitHubEmojis } from '@tiptap/extension-emoji'
import { TaskList, TaskItem } from '@tiptap/extension-list'
import { TableKit } from '@tiptap/extension-table'
import { CellSelection } from '@tiptap/pm/tables'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { ImageUpload } from './ImageUploadExtension'

/**
 * Ce composant, ses frères du dossier `notion/` et les
 * composables `useNotion*` suffisent à le porter dans un autre projet.
 */
const { onUpload, mentions = [], placeholder = 'Écrivez, ou tapez « / » pour les commandes…' } = defineProps<{
  /** Point d'extension pour l'envoi de fichiers. Voir `useEditorUpload`. */
  onUpload?: EditorUploadHandler
  mentions?: EditorMentionMenuItem[]
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' })

provide('editorUploadHandler', computed(() => onUpload))

const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined,
  },
  table: {
    canExecute: (editor: Editor) => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    execute: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
    isActive: (editor: Editor) => editor.isActive('table'),
    isDisabled: undefined,
  },
} satisfies EditorCustomHandlers

const emojiItems: EditorEmojiMenuItem[] = gitHubEmojis.filter(emoji => !emoji.name.startsWith('regional_indicator_'))

const { items: suggestionItems } = useNotionSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useNotionDragHandle(customHandlers)
const { toolbarItems, bubbleToolbarItems, getImageToolbarItems, getTableToolbarItems } = useNotionToolbar(customHandlers)

const extensions = [
  CodeBlockShiki.configure({
    defaultTheme: 'catppuccin-frappe',
    themes: {
      light: 'catppuccin-latte',
      dark: 'catppuccin-mocha',
    },
  }),
  Emoji.configure({ emojis: gitHubEmojis, enableEmoticons: true }),
  ImageUpload,
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
      />
    </div>

    <UEditorToolbar
      :editor="editor"
      :items="bubbleToolbarItems"
      layout="bubble"
      :should-show="({ editor: current, view, state }: any) => {
        if (current.isActive('imageUpload') || current.isActive('image') || state.selection instanceof CellSelection) {
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
      :items="getImageToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor: current, view }: any) => current.isActive('image') && view.hasFocus()"
    />

    <UEditorToolbar
      :editor="editor"
      :items="getTableToolbarItems(editor)"
      layout="bubble"
      :should-show="({ editor: current, view }: any) => current.state.selection instanceof CellSelection && view.hasFocus()"
    />

    <UEditorEmojiMenu
      :editor="editor"
      :items="emojiItems"
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
        icon="i-lucide-plus"
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
          icon="i-lucide-grip-vertical"
          aria-label="Options du bloc"
          :active="open"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
