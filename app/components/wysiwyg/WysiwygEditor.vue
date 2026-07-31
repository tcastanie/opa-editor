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
import { CustomAudio, CustomVideo } from '~/utils/tiptap/media'
import { PreKeymap } from '~/utils/tiptap/pre-keymap'
import { PreservedAttributes } from '~/utils/tiptap/preserved-attributes'
import { CustomYoutube } from '~/utils/tiptap/youtube'

/**
 * Éditeur WYSIWYG « barre d'outils classique »
 * Auto-contenu : ce composant, ses frères du dossier `wysiwyg/`, les composables
 * `useWysiwyg*`, `app/utils/tiptap/` et les pièces partagées avec l'éditeur
 * notion (`EditorSourceCodeModal`, `EditorEmojiPopover`,
 * `app/utils/date-time.ts`) suffisent à le porter dans un autre projet.
 */
const { toolbarKeys = wysiwygToolbarAll, placeholder = 'Rédigez votre contenu…' } = defineProps<{
  /** Boutons affichés, parmi les clés du manifeste. */
  toolbarKeys?: WysiwygButtonKey[]
  /** Point d'extension pour l'envoi de fichiers. Voir `useEditorUpload`. */
  onUpload?: EditorUploadHandler
  placeholder?: string
}>()

const model = defineModel<string>({ default: '' })

const editorRef = useTemplateRef('editorRef')

const fullscreen = ref(false)
const sourceCodeOpen = ref(false)

const characters = ref(0)
const words = ref(0)

const handlers = useWysiwygHandlers({
  fullscreen,
  onOpenSourceCode: () => {
    sourceCodeOpen.value = true
  },
  onToggleFullscreen: () => {
    fullscreen.value = !fullscreen.value
  },
})

const { toolbarItems } = useWysiwygToolbar(() => toolbarKeys)

const extensions = [
  TextStyleKit.configure({ lineHeight: false, fontFamily: false }),
  TextAlign.configure({ types: ['heading', 'paragraph', 'blockquote', 'image'] }),
  Subscript,
  Superscript,
  CustomImage.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: 'inline-block!',
    },
  }),
  CustomVideo,
  CustomAudio,
  CustomYoutube,
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

      <EditorSourceCodeModal
        v-model:open="sourceCodeOpen"
        :editor="editor"
      />

      <UEditorToolbar
        :editor="editor"
        :items="[[
          { icon: 'i-tabler-row-insert-top', tooltip: { text: 'Ligne au-dessus' }, onClick: () => editor.chain().focus().addRowBefore().run() },
          { icon: 'i-tabler-row-insert-bottom', tooltip: { text: 'Ligne en dessous' }, onClick: () => editor.chain().focus().addRowAfter().run() },
          { icon: 'i-tabler-column-insert-left', tooltip: { text: 'Colonne avant' }, onClick: () => editor.chain().focus().addColumnBefore().run() },
          { icon: 'i-tabler-column-insert-right', tooltip: { text: 'Colonne après' }, onClick: () => editor.chain().focus().addColumnAfter().run() },
        ], [
          { icon: 'i-tabler-arrows-join', tooltip: { text: 'Fusionner' }, onClick: () => editor.chain().focus().mergeCells().run() },
          { icon: 'i-tabler-arrows-split', tooltip: { text: 'Scinder' }, onClick: () => editor.chain().focus().splitCell().run() },
        ], [
          { icon: 'i-tabler-row-remove', color: 'warning', tooltip: { text: 'Supprimer la ligne' }, onClick: () => editor.chain().focus().deleteRow().run() },
          { icon: 'i-tabler-column-remove', color: 'warning', tooltip: { text: 'Supprimer la colonne' }, onClick: () => editor.chain().focus().deleteColumn().run() },
          { icon: 'i-tabler-trash', color: 'error', tooltip: { text: 'Supprimer le tableau' }, onClick: () => editor.chain().focus().deleteTable().run() },
        ]]"
        layout="bubble"
        :should-show="({ editor: current, view }: any) => current.state.selection instanceof CellSelection && view.hasFocus()"
      />

      <UEditorToolbar
        :editor="editor"
        :items="[[
          { icon: 'i-tabler-align-left', tooltip: { text: 'Aligner à gauche' }, onClick: () => editor.chain().focus().setTextAlign('left').run() },
          { icon: 'i-tabler-align-center', tooltip: { text: 'Centrer' }, onClick: () => editor.chain().focus().setTextAlign('center').run() },
          { icon: 'i-tabler-align-right', tooltip: { text: 'Aligner à droite' }, onClick: () => editor.chain().focus().setTextAlign('right').run() },
        ], [
          { icon: 'i-tabler-trash', tooltip: { text: 'Supprimer' }, onClick: () => editor.chain().focus().deleteSelection().run() },
        ]]"
        layout="bubble"
        :should-show="({ editor: current, view }: any) => current.isActive('image') && view.hasFocus()"
      />

      <!-- Vidéo, audio et YouTube sont des blocs : l'alignement du texte n'a pas
           prise sur eux, la barre se limite donc à la suppression. -->
      <UEditorToolbar
        :editor="editor"
        :items="[[
          { icon: 'i-tabler-trash', tooltip: { text: 'Supprimer' }, onClick: () => editor.chain().focus().deleteSelection().run() },
        ]]"
        layout="bubble"
        :should-show="({ editor: current, view }: any) => (current.isActive('video') || current.isActive('audio') || current.isActive(editorYoutubePreset.node)) && view.hasFocus()"
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
