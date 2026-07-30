<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/**
 * `customImage` du manifeste. Aucun stockage n'est câblé ici : le fichier part
 * dans `onUpload`, le point d'extension à brancher sur votre backend.
 */
const props = defineProps<{
  editor: Editor
  onUpload?: EditorUploadHandler
}>()

const open = ref(false)
const alt = ref('')

const { upload, pending, error, isConfigured } = useEditorUpload(() => props.onUpload)

const active = computed(() => props.editor.isActive('image'))

async function onFileChange(file: File | File[] | null | undefined) {
  const selected = Array.isArray(file) ? file[0] : file
  if (!selected) {
    return
  }

  const result = await upload(selected)
  if (!result) {
    return
  }

  props.editor.chain().focus().setImage({
    src: result.src,
    alt: alt.value || result.alt || selected.name,
    title: result.title,
  }).run()

  alt.value = ''
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :modal="false"
    :ui="{ content: 'p-3 w-80' }"
  >
    <UTooltip text="Insérer une image">
      <UButton
        icon="i-tabler-photo"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :loading="pending"
        :disabled="!editor.isEditable"
        aria-label="Insérer une image"
      />
    </UTooltip>

    <template #content>
      <div class="flex flex-col gap-3">
        <UFormField
          label="Texte alternatif"
          hint="Optionnel"
          size="sm"
        >
          <UInput
            v-model="alt"
            placeholder="Description de l'image"
            class="w-full"
          />
        </UFormField>

        <UFileUpload
          accept="image/*"
          label="Déposez une image ou cliquez"
          :description="error ?? 'SVG, PNG, JPG ou GIF'"
          :preview="false"
          :multiple="false"
          size="sm"
          class="min-h-32"
          :ui="{ description: error ? 'text-error' : '' }"
          @update:model-value="onFileChange"
        />

        <UAlert
          v-if="!isConfigured"
          icon="i-tabler-plug"
          color="neutral"
          variant="subtle"
          title="Aucun stockage branché"
          description="Le fichier reçoit une URL locale temporaire. Passez `on-upload` à l'éditeur pour utiliser votre backend."
          :ui="{ title: 'text-xs font-medium', description: 'text-xs' }"
        />
      </div>
    </template>
  </UPopover>
</template>
