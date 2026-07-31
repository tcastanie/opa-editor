<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'
import type { Emoji } from 'vue-frimousse'
import EmojiPicker from 'vue-frimousse'

/**
 * Sélecteur d'émojis bâti sur `vue-frimousse`.
 * Les données Emojibase sont téléchargées à la première ouverture puis gardées
 * en cache local (`localStorage`) — d'où l'état « Chargement… ».
 */
const { editor, size = 'sm' } = defineProps<{
  editor: Editor
  /** Aligné sur la taille de la barre d'outils qui accueille le bouton. */
  size?: 'sm' | 'md' | 'lg'
}>()

const open = defineModel<boolean>('open', { default: false })

/**
 * Élément virtuel sur lequel le panneau s'aligne. Vide, il retombe sur son
 * propre bouton ; `openAtCaret` l'accroche au curseur pour les ouvertures qui
 * ne viennent pas de la barre d'outils (menu « / »).
 */
const reference = ref<{ getBoundingClientRect: () => DOMRect }>()

const pickerRef = useTemplateRef('pickerRef')

const disabled = computed(() => !editor.isEditable)

/** Ouvre le panneau au niveau du curseur plutôt que sous le bouton. */
function openAtCaret() {
  const { left, top, bottom } = editor.view.coordsAtPos(editor.state.selection.from)

  reference.value = { getBoundingClientRect: () => new DOMRect(left, top, 0, bottom - top) }
  open.value = true
}

function insert(emoji: Emoji) {
  editor.chain().focus().insertContent(emoji.emoji).run()
  open.value = false
}

// Le contenu du popover n'est monté qu'à l'ouverture : on rend la main au champ
// de recherche, sinon les flèches pilotent le conteneur et non la grille.
watch(open, async (value) => {
  if (!value) {
    return
  }

  await nextTick()
  pickerRef.value?.querySelector<HTMLInputElement>('input[frimousse-search]')?.focus()
})

defineExpose({ openAtCaret })
</script>

<template>
  <UPopover
    v-model:open="open"
    :reference="reference"
    :ui="{ content: 'p-0 overflow-hidden' }"
  >
    <UTooltip text="Émoji">
      <UButton
        icon="i-tabler-mood-smile"
        color="neutral"
        active-color="primary"
        variant="ghost"
        active-variant="soft"
        :size="size"
        :active="open"
        :disabled="disabled"
        aria-label="Émoji"
        @click="reference = undefined"
      />
    </UTooltip>

    <template #content>
      <div ref="pickerRef">
        <EmojiPicker.Root
          class="flex flex-col w-76 h-88 bg-default text-default"
          locale="fr"
          :on-emoji-select="insert"
        >
          <EmojiPicker.Search
            class="shrink-0 m-1.5 px-2.5 py-1.5 text-sm rounded-md bg-elevated/50 text-default ring ring-inset ring-accented placeholder:text-dimmed focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            placeholder="Rechercher un émoji…"
          />

          <EmojiPicker.Viewport class="relative flex-1 px-1.5 focus:outline-none">
            <EmojiPicker.Loading class="absolute inset-0 flex items-center justify-center text-sm text-muted">
              Chargement…
            </EmojiPicker.Loading>

            <EmojiPicker.Empty class="absolute inset-0 flex items-center justify-center px-4 text-sm text-center text-muted">
              <template #default="{ search }">
                Aucun émoji pour « {{ search }} ».
              </template>
            </EmojiPicker.Empty>

            <EmojiPicker.List class="pb-1.5 select-none">
              <template #category-header="{ category }">
                <div class="px-1 pt-2.5 pb-1 text-xs font-semibold text-muted bg-default">
                  {{ category.label }}
                </div>
              </template>

              <template #emoji="{ emoji }">
                <span
                  class="flex items-center justify-center w-full h-8 text-xl leading-none rounded-md"
                  :class="emoji.isActive && 'bg-elevated'"
                >
                  {{ emoji.emoji }}
                </span>
              </template>
            </EmojiPicker.List>
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>
/* Les cellules sont posées dans une ligne flex sans largeur imposée. On les
   cale sur la grille annoncée par la liste, sinon une ligne incomplète — le
   dernier rang, ou un résultat de recherche isolé — s'étale sur la largeur. */
:deep([frimousse-emoji]) {
  flex: 0 0 calc(100% / var(--frimousse-list-columns, 9));
}
</style>
