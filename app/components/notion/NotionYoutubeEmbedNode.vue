<script setup lang="ts">
import type { NodeViewProps } from '@tiptap/vue-3'
import { NodeViewWrapper } from '@tiptap/vue-3'

const { editor, getPos } = defineProps<NodeViewProps>()

const url = ref('')
const error = ref<string | null>(null)

const valid = computed(() => !!editorYoutubeUrl(url.value))

watch(url, () => {
  error.value = null
})

/** Le bloc s'efface au profit de la vidéo, comme les zones de dépôt. */
function setVideo() {
  const src = editorYoutubeUrl(url.value)
  const pos = getPos()

  if (!src) {
    error.value = editorYoutubePreset.invalidMessage
    return
  }

  if (typeof pos !== 'number') {
    return
  }

  editor
    .chain()
    .focus()
    .deleteRange({ from: pos, to: pos + 1 })
    .insertContentAt(pos, {
      type: editorYoutubePreset.node,
      attrs: { src },
    })
    .run()
}
</script>

<template>
  <NodeViewWrapper>
    <div class="flex flex-col items-center justify-center gap-3 min-h-48 p-6 rounded-lg border border-dashed border-accented bg-elevated/50">
      <UAvatar
        :icon="error ? 'i-tabler-alert-circle' : editorYoutubePreset.icon"
        size="xl"
        :ui="{ icon: error ? 'text-error' : '' }"
      />

      <p class="text-sm text-muted pointer-events-none">
        {{ editorYoutubePreset.embedLabel }}
      </p>

      <UInput
        v-model="url"
        name="youtube-url"
        type="url"
        class="w-full max-w-md"
        :placeholder="editorYoutubePreset.placeholder"
        @keydown.enter.prevent="setVideo"
      >
        <template #trailing>
          <UButton
            icon="i-tabler-corner-down-left"
            color="neutral"
            variant="ghost"
            size="xs"
            :disabled="!valid"
            :title="editorYoutubePreset.insertLabel"
            :aria-label="editorYoutubePreset.insertLabel"
            @click="setVideo"
          />
        </template>
      </UInput>

      <p
        v-if="error"
        class="text-xs text-error"
      >
        {{ error }}
      </p>
    </div>
  </NodeViewWrapper>
</template>
