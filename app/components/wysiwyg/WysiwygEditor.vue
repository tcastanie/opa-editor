<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { CharacterCount } from '@tiptap/extensions'
import { CellSelection } from '@tiptap/pm/tables'
import { useEventListener } from '@vueuse/core'
import { CustomImage } from '~/utils/tiptap/custom-image'
import { Direction } from '~/utils/tiptap/direction'
import { Media } from '~/utils/tiptap/media'
import { PageBreak } from '~/utils/tiptap/page-break'
import { PreKeymap } from '~/utils/tiptap/pre-keymap'
import { PreservedAttributes } from '~/utils/tiptap/preserved-attributes'

/**
 * Éditeur WYSIWYG « barre d'outils classique »
 * Auto-contenu : ce composant, ses frères du dossier `wysiwyg/`, les composables
 * `useWysiwyg*` et `app/utils/tiptap/` suffisent à le porter dans un autre projet.
 */
const props = withDefaults(defineProps<{
  /** Boutons affichés, parmi les clés du manifeste. */
  toolbarKeys?: WysiwygButtonKey[]
  /** Point d'extension pour l'envoi de fichiers. Voir `useEditorUpload`. */
  onUpload?: EditorUploadHandler
  placeholder?: string
}>(), {
  toolbarKeys: () => wysiwygToolbarAll,
  placeholder: 'Rédigez votre contenu…',
})

const model = defineModel<string>({ default: '' })

const editorRef = useTemplateRef('editorRef')

const fullscreen = ref(false)
const visualAid = ref(false)
const sourceCodeOpen = ref(false)

const characters = ref(0)
const words = ref(0)

const handlers = useWysiwygHandlers({
  fullscreen,
  visualAid,
  onOpenSourceCode: () => {
    sourceCodeOpen.value = true
  },
  onToggleFullscreen: () => {
    fullscreen.value = !fullscreen.value
  },
  onToggleVisualAid: () => {
    visualAid.value = !visualAid.value
  },
})

const { toolbarItems } = useWysiwygToolbar(() => props.toolbarKeys)

const extensions = [
  TextStyleKit.configure({ lineHeight: false }),
  TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote', 'image'] }),
  Direction,
  Subscript,
  Superscript,
  CustomImage.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: 'inline-block!',
    },
  }),
  Media,
  PageBreak,
  TableKit.configure({ table: { resizable: true } }),
  PreKeymap,
  CharacterCount,
  PreservedAttributes,
]

function syncCounts({ editor }: { editor: Pick<Editor, 'storage'> }) {
  characters.value = editor.storage.characterCount?.characters() ?? 0
  words.value = editor.storage.characterCount?.words() ?? 0
}

watch(() => editorRef.value?.editor, (editor) => {
  if (editor) {
    syncCounts({ editor })
  }
}, { immediate: true })

// `defineShortcuts` ignore les frappes venant d'une zone éditable : on écoute
// directement, sinon Échap ne sort jamais du plein écran pendant la saisie.
useEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && fullscreen.value) {
    event.preventDefault()
    fullscreen.value = false
  }
})

defineExpose({
  editor: computed(() => editorRef.value?.editor),
})
</script>

<template>
  <div
    :class="[
      'flex flex-col rounded-lg ring-2 ring-default bg-default overflow-hidden',
      fullscreen && 'fixed inset-0 z-50 ring-0',
      visualAid && 'editor-visual-aid',
    ]"
  >
    <UEditor
      ref="editorRef"
      v-slot="{ editor }"
      v-model="model"
      content-type="html"
      :extensions="extensions"
      :handlers="handlers"
      :image="false"
      :mention="false"
      :placeholder="placeholder"
      :starter-kit="{ link: { defaultProtocol: 'https', openOnClick: false } }"
      :on-transaction="syncCounts"
      class="flex flex-col min-h-0 flex-1"
      :ui="{
        base: 'px-6 py-5 focus:outline-none',
        content: 'flex-1 overflow-y-auto',
      }"
    >
      <WysiwygToolbar
        :editor="editor"
        :items="toolbarItems"
        :on-upload="onUpload"
      />

      <WysiwygSourceCodeModal
        v-model:open="sourceCodeOpen"
        :editor="editor"
      />

      <UEditorToolbar
        :editor="editor"
        :items="[[
          { icon: 'i-lucide-between-vertical-start', tooltip: { text: 'Ligne au-dessus' }, onClick: () => editor.chain().focus().addRowBefore().run() },
          { icon: 'i-lucide-between-vertical-end', tooltip: { text: 'Ligne en dessous' }, onClick: () => editor.chain().focus().addRowAfter().run() },
          { icon: 'i-lucide-between-horizontal-start', tooltip: { text: 'Colonne avant' }, onClick: () => editor.chain().focus().addColumnBefore().run() },
          { icon: 'i-lucide-between-horizontal-end', tooltip: { text: 'Colonne après' }, onClick: () => editor.chain().focus().addColumnAfter().run() },
        ], [
          { icon: 'i-lucide-table-cells-merge', tooltip: { text: 'Fusionner' }, onClick: () => editor.chain().focus().mergeCells().run() },
          { icon: 'i-lucide-table-cells-split', tooltip: { text: 'Scinder' }, onClick: () => editor.chain().focus().splitCell().run() },
        ], [
          { icon: 'i-lucide-rows-3', color: 'warning', tooltip: { text: 'Supprimer la ligne' }, onClick: () => editor.chain().focus().deleteRow().run() },
          { icon: 'i-lucide-columns-3', color: 'warning', tooltip: { text: 'Supprimer la colonne' }, onClick: () => editor.chain().focus().deleteColumn().run() },
          { icon: 'i-lucide-trash-2', color: 'error', tooltip: { text: 'Supprimer le tableau' }, onClick: () => editor.chain().focus().deleteTable().run() },
        ]]"
        layout="bubble"
        :should-show="({ editor: current, view }: any) => current.state.selection instanceof CellSelection && view.hasFocus()"
      />

      <UEditorToolbar
        :editor="editor"
        :items="[[
          { icon: 'i-lucide-align-left', tooltip: { text: 'Aligner à gauche' }, onClick: () => editor.chain().focus().setTextAlign('left').run() },
          { icon: 'i-lucide-align-center', tooltip: { text: 'Centrer' }, onClick: () => editor.chain().focus().setTextAlign('center').run() },
          { icon: 'i-lucide-align-right', tooltip: { text: 'Aligner à droite' }, onClick: () => editor.chain().focus().setTextAlign('right').run() },
        ], [
          { icon: 'i-lucide-trash-2', tooltip: { text: 'Supprimer' }, onClick: () => editor.chain().focus().deleteSelection().run() },
        ]]"
        layout="bubble"
        :should-show="({ editor: current, view }: any) => (current.isActive('image') || current.isActive('media')) && view.hasFocus()"
      />
    </UEditor>

    <footer class="flex items-center justify-between gap-4 px-4 py-2 border-t border-default text-xs text-muted">
      <USkeleton
        v-if="!editorRef"
        class="w-full h-36"
      />
      <template v-else>
        <span>{{ words }} mot{{ words > 1 ? 's' : '' }} · {{ characters }} caractère{{ characters > 1 ? 's' : '' }}</span>

        <span
          v-if="fullscreen"
          class="flex items-center gap-1"
        >
          <UKbd
            value="escape"
            size="sm"
          />
          pour quitter le plein écran
        </span>
      </template>
    </footer>
  </div>
</template>
