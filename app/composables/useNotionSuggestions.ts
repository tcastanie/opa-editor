import type { EditorSuggestionMenuItem, EditorCustomHandlers } from '@nuxt/ui'

/** Menu déclenché par `/` dans le template notion-like. */
export function useNotionSuggestions<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const items = [[{
    type: 'label',
    label: 'Style',
  }, {
    kind: 'paragraph',
    label: 'Paragraphe',
    icon: 'i-tabler-pilcrow',
  }, {
    kind: 'heading',
    level: 1,
    label: 'Titre 1',
    icon: 'i-tabler-h-1',
  }, {
    kind: 'heading',
    level: 2,
    label: 'Titre 2',
    icon: 'i-tabler-h-2',
  }, {
    kind: 'heading',
    level: 3,
    label: 'Titre 3',
    icon: 'i-tabler-h-3',
  }, {
    kind: 'heading',
    level: 4,
    label: 'Titre 4',
    icon: 'i-tabler-h-4',
  }, {
    kind: 'bulletList',
    label: 'Liste à puces',
    icon: 'i-tabler-list',
  }, {
    kind: 'orderedList',
    label: 'Liste numérotée',
    icon: 'i-tabler-list-numbers',
  }, {
    kind: 'taskList',
    label: 'Liste de tâches',
    icon: 'i-tabler-list-check',
  }, {
    kind: 'blockquote',
    label: 'Citation',
    icon: 'i-tabler-quote',
  }, {
    kind: 'codeBlock',
    label: 'Bloc de code',
    icon: 'i-tabler-codeblock',
  }], [{
    type: 'label',
    label: 'Insérer',
  }, {
    kind: 'mention',
    label: 'Mention',
    icon: 'i-tabler-at',
  }, {
    kind: 'emoji',
    label: 'Émoji',
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
    label: 'Tableau',
    icon: 'i-tabler-table',
  }, {
    kind: 'horizontalRule',
    label: 'Séparateur',
    icon: 'i-tabler-separator-horizontal',
  }]] satisfies EditorSuggestionMenuItem<T>[][]

  return { items }
}
