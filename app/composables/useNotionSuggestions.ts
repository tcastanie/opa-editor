import type { EditorSuggestionMenuItem, EditorCustomHandlers } from '@nuxt/ui'

/** Menu déclenché par `/` dans le template notion-like. */
export function useNotionSuggestions<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const items = [[{
    type: 'label',
    label: 'Style',
  }, {
    kind: 'paragraph',
    label: 'Paragraphe',
    icon: 'i-lucide-type',
  }, {
    kind: 'heading',
    level: 1,
    label: 'Titre 1',
    icon: 'i-lucide-heading-1',
  }, {
    kind: 'heading',
    level: 2,
    label: 'Titre 2',
    icon: 'i-lucide-heading-2',
  }, {
    kind: 'heading',
    level: 3,
    label: 'Titre 3',
    icon: 'i-lucide-heading-3',
  }, {
    kind: 'heading',
    level: 4,
    label: 'Titre 4',
    icon: 'i-lucide-heading-4',
  }, {
    kind: 'bulletList',
    label: 'Liste à puces',
    icon: 'i-lucide-list',
  }, {
    kind: 'orderedList',
    label: 'Liste numérotée',
    icon: 'i-lucide-list-ordered',
  }, {
    kind: 'taskList',
    label: 'Liste de tâches',
    icon: 'i-lucide-list-check',
  }, {
    kind: 'blockquote',
    label: 'Citation',
    icon: 'i-lucide-quote',
  }, {
    kind: 'codeBlock',
    label: 'Bloc de code',
    icon: 'i-lucide-square-code',
  }], [{
    type: 'label',
    label: 'Insérer',
  }, {
    kind: 'mention',
    label: 'Mention',
    icon: 'i-lucide-at-sign',
  }, {
    kind: 'emoji',
    label: 'Émoji',
    icon: 'i-lucide-smile-plus',
  }, {
    kind: 'imageUpload',
    label: 'Image',
    icon: 'i-lucide-image',
  }, {
    kind: 'table',
    label: 'Tableau',
    icon: 'i-lucide-table',
  }, {
    kind: 'horizontalRule',
    label: 'Séparateur',
    icon: 'i-lucide-separator-horizontal',
  }]] satisfies EditorSuggestionMenuItem<T>[][]

  return { items }
}
