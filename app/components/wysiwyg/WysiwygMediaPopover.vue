<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { editorUploadText } from '~/utils/i18n/editor-strings'
import { wysiwygMediaPopoverText } from '~/utils/i18n/wysiwyg-strings'

/**
 * `customImage`, `customVideo` et `customAudio` du manifeste : un seul popover,
 * paramétré par le préréglage du média. Aucun stockage n'est câblé ici, le
 * fichier part dans `onUpload`, le point d'extension à brancher sur votre
 * backend.
 */
const { editor, kind, onUpload } = defineProps<{
  editor: Editor
  kind: EditorMediaKind
  onUpload?: EditorUploadHandler
}>()

const preset = computed(() => editorMediaPresets[kind])

const open = ref(false)
/** `alt` pour une image, `title` pour les médias temporels. */
const description = ref('')

const { upload, pending, error, isConfigured } = useEditorUpload(() => onUpload)

const active = computed(() => editor.isActive(preset.value.node))

async function onFileChange(file: File | File[] | null | undefined) {
  const selected = Array.isArray(file) ? file[0] : file
  if (!selected) {
    return
  }

  const result = await upload(selected)
  if (!result) {
    return
  }

  editor.chain().focus().insertContent({
    type: preset.value.node,
    attrs: editorMediaAttributes(kind, result, { label: description.value, fallback: selected.name }),
  }).run()

  description.value = ''
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :modal="false"
    :ui="{ content: 'p-3 w-80' }"
  >
    <UTooltip :text="preset.insertLabel">
      <UButton
        :icon="preset.icon"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :loading="pending"
        :disabled="!editor.isEditable"
        :aria-label="preset.insertLabel"
      />
    </UTooltip>

    <template #content>
      <div class="flex flex-col gap-3">
        <UFormField
          :label="preset.fieldLabel"
          :hint="wysiwygMediaPopoverText.optionalHint"
          size="sm"
        >
          <UInput
            v-model="description"
            :placeholder="preset.fieldPlaceholder"
            class="w-full"
          />
        </UFormField>

        <UFileUpload
          :accept="preset.accept"
          :label="preset.dropLabel"
          :description="error ?? preset.formats"
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
          :title="editorUploadText.noStorageTitle"
          :description="editorUploadText.noStorageDescription"
          :ui="{ title: 'text-xs font-medium', description: 'text-xs' }"
        />
      </div>
    </template>
  </UPopover>
</template>
