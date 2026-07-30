<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

/**
 * `customYoutube` du manifeste. Contrairement aux trois autres médias, il n'y a
 * pas de fichier à envoyer : le popover ne demande qu'une URL, d'où l'absence
 * de `on-upload` ici.
 */
const { editor } = defineProps<{
  editor: Editor
}>()

const open = ref(false)
const url = ref('')
const error = ref<string | null>(null)

const active = computed(() => editor.isActive(editorYoutubePreset.node))
const valid = computed(() => !!editorYoutubeUrl(url.value))

watch(url, () => {
  error.value = null
})

watch(open, (value) => {
  if (!value) {
    url.value = ''
    error.value = null
  }
})

function setVideo() {
  const src = editorYoutubeUrl(url.value)

  if (!src) {
    error.value = editorYoutubePreset.invalidMessage
    return
  }

  editor.chain().focus().setYoutubeVideo({ src }).run()
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :modal="false"
    :ui="{ content: 'p-0.5 w-96' }"
  >
    <UTooltip :text="editorYoutubePreset.insertLabel">
      <UButton
        :icon="editorYoutubePreset.icon"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="!editor.isEditable"
        :aria-label="editorYoutubePreset.insertLabel"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        name="youtube-url"
        type="url"
        variant="none"
        class="w-full"
        :placeholder="editorYoutubePreset.placeholder"
        @keydown.enter.prevent="setVideo"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-tabler-corner-down-left"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!valid"
            :title="editorYoutubePreset.insertLabel"
            @click="setVideo"
          />
        </div>
      </UInput>

      <p
        v-if="error"
        class="px-2.5 pb-1.5 text-xs text-error"
      >
        {{ error }}
      </p>
    </template>
  </UPopover>
</template>
