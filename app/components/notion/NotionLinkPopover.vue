<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor
}>()

const open = ref(false)
const url = ref('')

const active = computed(() => props.editor.isActive('link'))
const disabled = computed(() => {
  if (!props.editor.isEditable) {
    return true
  }

  const { selection } = props.editor.state
  return selection.empty && !props.editor.isActive('link')
})

watch(() => props.editor, (editor, _previous, onCleanup) => {
  if (!editor) {
    return
  }

  const syncUrl = () => {
    url.value = editor.getAttributes('link').href || ''
  }

  syncUrl()
  editor.on('selectionUpdate', syncUrl)

  onCleanup(() => editor.off('selectionUpdate', syncUrl))
}, { immediate: true })

function setLink() {
  if (!url.value) {
    return
  }

  const { selection } = props.editor.state
  const isEmpty = selection.empty
  let chain = props.editor.chain().focus()

  if (props.editor.isActive('code') && !isEmpty) {
    chain = chain.extendMarkRange('code').setLink({ href: url.value })
  }
  else {
    chain = chain.extendMarkRange('link').setLink({ href: url.value })

    if (isEmpty) {
      chain = chain.insertContent({ type: 'text', text: url.value })
    }
  }

  chain.run()
  open.value = false
}

function removeLink() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run()
  url.value = ''
  open.value = false
}

function openLink() {
  if (url.value) {
    window.open(url.value, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :ui="{ content: 'p-0.5' }"
  >
    <UTooltip text="Lien">
      <UButton
        icon="i-lucide-link"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="disabled"
        aria-label="Lien"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        name="url"
        type="url"
        variant="none"
        placeholder="Collez un lien…"
        @keydown.enter.prevent="setLink"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-lucide-corner-down-left"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            title="Appliquer le lien"
            @click="setLink"
          />

          <USeparator
            orientation="vertical"
            class="h-6 mx-1"
          />

          <UButton
            icon="i-lucide-external-link"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            title="Ouvrir dans un nouvel onglet"
            @click="openLink"
          />

          <UButton
            icon="i-lucide-trash-2"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            title="Supprimer le lien"
            @click="removeLink"
          />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
