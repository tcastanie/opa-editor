<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { MediaKind } from '~/utils/tiptap/media'

/**
 * `customMedia` du manifeste. Contrairement à l'image il n'y a pas de fichier à
 * envoyer pour une intégration (YouTube, Vimeo…), donc ce panneau prend une URL.
 */
const props = defineProps<{
  editor: Editor
}>()

const KINDS = [
  { label: 'Vidéo', value: 'video' as MediaKind, icon: 'i-lucide-film' },
  { label: 'Audio', value: 'audio' as MediaKind, icon: 'i-lucide-music' },
  { label: 'Intégration', value: 'iframe' as MediaKind, icon: 'i-lucide-code-xml' },
]

const open = ref(false)
const kind = ref<MediaKind>('video')
const src = ref('')
const title = ref('')

const active = computed(() => props.editor.isActive('media'))
const canInsert = computed(() => /^(https?:)?\/\//.test(src.value.trim()))

function insert() {
  if (!canInsert.value) {
    return
  }

  props.editor.chain().focus().setMedia({
    src: src.value.trim(),
    kind: kind.value,
    title: title.value.trim() || null,
  }).run()

  src.value = ''
  title.value = ''
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :modal="false"
    :ui="{ content: 'p-3 w-80' }"
  >
    <UTooltip text="Insérer un média">
      <UButton
        icon="i-lucide-film"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="!editor.isEditable"
        aria-label="Insérer un média"
      />
    </UTooltip>

    <template #content>
      <div class="flex flex-col gap-3">
        <UTabs
          v-model="kind"
          :items="KINDS"
          size="xs"
          :content="false"
        />

        <UFormField
          label="URL"
          size="sm"
        >
          <UInput
            v-model="src"
            autofocus
            type="url"
            placeholder="https://…"
            class="w-full"
            @keydown.enter.prevent="insert"
          />
        </UFormField>

        <UFormField
          label="Titre"
          hint="Optionnel"
          size="sm"
        >
          <UInput
            v-model="title"
            placeholder="Titre accessible"
            class="w-full"
          />
        </UFormField>

        <UButton
          label="Insérer"
          icon="i-lucide-plus"
          size="sm"
          block
          :disabled="!canInsert"
          @click="insert"
        />
      </div>
    </template>
  </UPopover>
</template>
