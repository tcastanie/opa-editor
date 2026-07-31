<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import { wysiwygColorMenuText } from '~/utils/i18n/wysiwyg-strings'

/**
 * Équivalent du `ColorMenu` du manifeste : nuancier + sélecteur libre, pour la
 * couleur du texte (`mode: 'text'`) ou celle du fond (`mode: 'background'`).
 */
const { editor, mode } = defineProps<{
  editor: Editor
  mode: 'text' | 'background'
  label: string
  icon: string
}>()

const PALETTE = [
  ['#000000', '#404040', '#737373', '#a3a3a3', '#d4d4d4', '#ffffff'],
  ['#dc2626', '#ea580c', '#d97706', '#ca8a04', '#65a30d', '#16a34a'],
  ['#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb', '#4f46e5'],
  ['#7c3aed', '#9333ea', '#c026d3', '#db2777', '#e11d48', '#78716c'],
]

const open = ref(false)

const attribute = computed(() => mode === 'text' ? 'color' : 'backgroundColor')
const current = computed<string | null>(() => editor.getAttributes('textStyle')?.[attribute.value] ?? null)

const active = computed(() => !!current.value)
const disabled = computed(() => !editor.isEditable || !editor.schema.marks.textStyle)

function setColor(value: string) {
  const chain = editor.chain().focus()
  ;(mode === 'text' ? chain.setColor(value) : chain.setBackgroundColor(value)).run()
  open.value = false
}

function unsetColor() {
  const chain = editor.chain().focus()
  ;(mode === 'text' ? chain.unsetColor() : chain.unsetBackgroundColor()).run()
  open.value = false
}
</script>

<template>
  <UPopover
    v-model:open="open"
    :modal="false"
    :ui="{ content: 'p-2' }"
  >
    <UTooltip :text="label">
      <UButton
        :icon="icon"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        size="sm"
        :active="active"
        :disabled="disabled"
        :aria-label="label"
        :ui="{ base: 'relative' }"
      >
        <template #trailing>
          <span
            class="absolute inset-x-1.5 bottom-1 h-0.5 rounded-full"
            :class="current ? '' : 'bg-transparent'"
            :style="current ? { backgroundColor: current } : undefined"
          />
        </template>
      </UButton>
    </UTooltip>

    <template #content>
      <div class="w-max">
        <p class="text-xs text-muted px-1 pb-2">
          {{ label }}
        </p>

        <div class="flex flex-col gap-1">
          <div
            v-for="(row, rowIndex) in PALETTE"
            :key="rowIndex"
            class="flex gap-1"
          >
            <button
              v-for="color in row"
              :key="color"
              type="button"
              class="size-5 rounded ring-1 ring-inset ring-accented hover:ring-2 hover:ring-primary focus-visible:outline-2 focus-visible:outline-primary"
              :class="color === current && 'ring-2 ring-primary'"
              :style="{ backgroundColor: color }"
              :aria-label="color"
              @click="setColor(color)"
            />
          </div>
        </div>

        <USeparator class="my-2" />

        <div class="flex items-center gap-1">
          <label class="flex items-center gap-2 text-sm cursor-pointer px-1">
            <input
              type="color"
              :value="current ?? '#000000'"
              class="size-5 rounded border-0 bg-transparent p-0 cursor-pointer"
              @input="setColor(($event.target as HTMLInputElement).value)"
            >
            <span class="text-muted">{{ wysiwygColorMenuText.customLabel }}</span>
          </label>

          <UButton
            :label="wysiwygColorMenuText.noneLabel"
            icon="i-tabler-slash"
            color="neutral"
            variant="ghost"
            size="xs"
            class="ms-auto"
            :disabled="!current"
            @click="unsetColor"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
