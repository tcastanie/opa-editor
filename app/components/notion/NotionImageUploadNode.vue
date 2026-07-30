<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const { editor, getPos } = defineProps<NodeViewProps>()

/**
 * Le gestionnaire d'envoi est fourni par la page via `provide`, parce qu'une
 * NodeView TipTap est montée hors de l'arbre de composants de l'éditeur et ne
 * peut donc pas recevoir de props.
 */
const uploadHandler = inject<Ref<EditorUploadHandler | undefined>>('editorUploadHandler', ref(undefined))

const { upload, pending, error, isConfigured } = useEditorUpload(uploadHandler)

async function onFileChange(file: File | File[] | null | undefined) {
  const selected = Array.isArray(file) ? file[0] : file
  if (!selected) {
    return
  }

  const result = await upload(selected)
  if (!result) {
    return
  }

  const pos = getPos()
  if (typeof pos !== 'number') {
    return
  }

  editor
    .chain()
    .focus()
    .deleteRange({ from: pos, to: pos + 1 })
    .setImage({ src: result.src, alt: result.alt ?? selected.name })
    .run()
}
</script>

<template>
  <NodeViewWrapper>
    <UFileUpload
      accept="image/*"
      label="Envoyer une image"
      :description="error ?? (isConfigured ? 'SVG, PNG, JPG ou GIF' : 'Aucun stockage branché')"
      :preview="false"
      :multiple="false"
      class="min-h-48"
      :ui="{ description: error ? 'text-error' : '' }"
      @update:model-value="onFileChange"
    >
      <template #leading>
        <UAvatar
          :icon="error ? 'i-tabler-alert-circle' : pending ? 'i-tabler-loader-2' : 'i-tabler-photo'"
          size="xl"
          :ui="{ icon: [pending && 'animate-spin', error && 'text-error'] }"
        />
      </template>
    </UFileUpload>
  </NodeViewWrapper>
</template>
