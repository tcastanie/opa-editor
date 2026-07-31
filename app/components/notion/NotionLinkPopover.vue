<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { editorLinkPopoverText } from '~/utils/i18n/editor-strings'
import { notionLinkPopoverText } from '~/utils/i18n/notion-strings'

const { editor } = defineProps<{
  editor: Editor
}>()

const open = ref(false)
const url = ref('')

const active = computed(() => editor.isActive('link'))
const disabled = computed(() => {
  if (!editor.isEditable) {
    return true
  }

  const { selection } = editor.state
  return selection.empty && !editor.isActive('link')
})

watch(() => editor, (current, _previous, onCleanup) => {
  if (!current) {
    return
  }

  const syncUrl = () => {
    url.value = current.getAttributes('link').href || ''
  }

  syncUrl()
  current.on('selectionUpdate', syncUrl)

  onCleanup(() => current.off('selectionUpdate', syncUrl))
}, { immediate: true })

function setLink() {
  if (!url.value) {
    return
  }

  const { selection } = editor.state
  const isEmpty = selection.empty
  let chain = editor.chain().focus()

  if (editor.isActive('code') && !isEmpty) {
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
  editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true).run()
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
    <UTooltip :text="notionLinkPopoverText.tooltip">
      <UButton
        icon="i-tabler-link"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="disabled"
        :aria-label="notionLinkPopoverText.tooltip"
      />
    </UTooltip>

    <template #content>
      <UInput
        v-model="url"
        autofocus
        name="url"
        type="url"
        variant="none"
        :placeholder="editorLinkPopoverText.placeholder"
        @keydown.enter.prevent="setLink"
      >
        <div class="flex items-center mr-0.5">
          <UButton
            icon="i-tabler-corner-down-left"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            :title="editorLinkPopoverText.applyTitle"
            @click="setLink"
          />

          <USeparator
            orientation="vertical"
            class="h-6 mx-1"
          />

          <UButton
            icon="i-tabler-external-link"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            :title="notionLinkPopoverText.openInNewTab"
            @click="openLink"
          />

          <UButton
            icon="i-tabler-trash"
            color="neutral"
            variant="ghost"
            size="sm"
            :disabled="!url && !active"
            :title="editorLinkPopoverText.deleteTitle"
            @click="removeLink"
          />
        </div>
      </UInput>
    </template>
  </UPopover>
</template>
