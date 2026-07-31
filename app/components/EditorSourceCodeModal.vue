<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { editorSourceCodeModalText } from '~/utils/i18n/editor-strings'

/**
 * Édition du HTML brut, partagée par les deux éditeurs (`code` du manifeste
 * côté WYSIWYG). Ce que vous voyez ici est le HTML *après* passage dans le
 * schéma TipTap — tout ce qu'aucune extension ne déclare a déjà été écarté,
 * y compris à la réapplication.
 */
const { editor } = defineProps<{
  editor: Editor
}>()

const open = defineModel<boolean>('open', { default: false })

const html = ref('')

watch(open, (isOpen) => {
  if (isOpen) {
    html.value = formatHtml(editor.getHTML())
  }
})

/** Mise en forme minimale : un nœud de bloc par ligne, sans dépendance. */
function formatHtml(source: string) {
  return source.replace(/></g, '>\n<')
}

function apply() {
  editor.commands.setContent(html.value, { contentType: 'html' })
  editor.commands.focus()
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="editorSourceCodeModalText.title"
    :description="editorSourceCodeModalText.description"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <UTextarea
        v-model="html"
        :rows="20"
        autoresize
        :maxrows="24"
        class="w-full font-mono"
        :ui="{ base: 'text-xs leading-relaxed' }"
        spellcheck="false"
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          :label="editorSourceCodeModalText.cancel"
          color="neutral"
          variant="ghost"
          @click="open = false"
        />
        <UButton
          :label="editorSourceCodeModalText.apply"
          icon="i-tabler-check"
          @click="apply"
        />
      </div>
    </template>
  </UModal>
</template>
