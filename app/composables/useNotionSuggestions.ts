import type { EditorSuggestionMenuItem, EditorCustomHandlers } from '@nuxt/ui'
import { notionBlockTypeLabels, notionSuggestionsText } from '~/utils/i18n/notion-strings'

/** Menu déclenché par `/` dans le template notion-like. */
export function useNotionSuggestions<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const items = [[{
    type: 'label',
    label: notionSuggestionsText.styleGroup,
  }, {
    kind: 'paragraph',
    label: notionBlockTypeLabels.paragraph,
    icon: 'i-tabler-pilcrow',
  }, {
    kind: 'heading',
    level: 1,
    label: notionBlockTypeLabels.heading1,
    icon: 'i-tabler-h-1',
  }, {
    kind: 'heading',
    level: 2,
    label: notionBlockTypeLabels.heading2,
    icon: 'i-tabler-h-2',
  }, {
    kind: 'heading',
    level: 3,
    label: notionBlockTypeLabels.heading3,
    icon: 'i-tabler-h-3',
  }, {
    kind: 'heading',
    level: 4,
    label: notionBlockTypeLabels.heading4,
    icon: 'i-tabler-h-4',
  }, {
    kind: 'bulletList',
    label: notionBlockTypeLabels.bulletList,
    icon: 'i-tabler-list',
  }, {
    kind: 'orderedList',
    label: notionBlockTypeLabels.orderedList,
    icon: 'i-tabler-list-numbers',
  }, {
    kind: 'taskList',
    label: notionBlockTypeLabels.taskList,
    icon: 'i-tabler-list-check',
  }, {
    kind: 'blockquote',
    label: notionBlockTypeLabels.blockquote,
    icon: 'i-tabler-quote',
  }, {
    kind: 'codeBlock',
    label: notionBlockTypeLabels.codeBlock,
    icon: 'i-tabler-codeblock',
  }], [{
    type: 'label',
    label: notionSuggestionsText.insertGroup,
  }, {
    kind: 'mention',
    label: notionSuggestionsText.mention,
    icon: 'i-tabler-at',
  }, {
    kind: 'emoji',
    label: notionSuggestionsText.emoji,
    icon: 'i-tabler-mood-plus',
  }, {
    kind: 'imageUpload',
    label: editorMediaPresets.image.label,
    icon: editorMediaPresets.image.icon,
  }, {
    kind: 'videoUpload',
    label: editorMediaPresets.video.label,
    icon: editorMediaPresets.video.icon,
  }, {
    kind: 'audioUpload',
    label: editorMediaPresets.audio.label,
    icon: editorMediaPresets.audio.icon,
  }, {
    kind: 'youtubeEmbed',
    label: editorYoutubePreset.label,
    icon: editorYoutubePreset.icon,
  }, {
    kind: 'table',
    label: notionSuggestionsText.table,
    icon: 'i-tabler-table',
  }, {
    kind: 'horizontalRule',
    label: notionSuggestionsText.horizontalRule,
    icon: 'i-tabler-separator-horizontal',
  }]] satisfies EditorSuggestionMenuItem<T>[][]

  return { items }
}
