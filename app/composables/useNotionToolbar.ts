import type { EditorToolbarItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'

export function useNotionToolbar<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    'kind': 'undo',
    'icon': 'i-tabler-arrow-back-up',
    'tooltip': { text: 'Annuler' },
    'aria-label': 'Annuler',
  }, {
    'kind': 'redo',
    'icon': 'i-tabler-arrow-forward-up',
    'tooltip': { text: 'Rétablir' },
    'aria-label': 'Rétablir',
  }], [{
    'kind': 'imageUpload',
    'aria-label': 'Image',
    'icon': 'i-tabler-photo-plus',
    'tooltip': { text: 'Ajouter une image' },
  }, {
    'icon': 'i-tabler-clock-plus',
    'tooltip': { text: 'Insérer date/heure' },
    'aria-label': 'Date/heure',
    'content': { align: 'end' },
    'items': [dateTimeMenuItems().map(item => ({ kind: 'dateTime' as const, ...item }))],
  }], [{
    'kind': 'sourceCode',
    'aria-label': 'Code source',
    'icon': 'i-tabler-html',
    'tooltip': { text: 'Voir le code source' },
  }]]

  const bubbleToolbarItems: EditorToolbarItem<T>[][] = [[{
    label: 'Transformer en',
    trailingIcon: 'i-tabler-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    tooltip: { text: 'Transformer en' },
    content: { align: 'start' },
    ui: { label: 'text-xs' },
    items: [{
      type: 'label',
      label: 'Transformer en',
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
    }],
  }], [{
    'kind': 'mark',
    'mark': 'bold',
    'icon': 'i-tabler-bold',
    'tooltip': { text: 'Gras' },
    'aria-label': 'Gras',
  }, {
    'kind': 'mark',
    'mark': 'italic',
    'icon': 'i-tabler-italic',
    'tooltip': { text: 'Italique' },
    'aria-label': 'Italique',
  }, {
    'kind': 'mark',
    'mark': 'underline',
    'icon': 'i-tabler-underline',
    'tooltip': { text: 'Souligné' },
    'aria-label': 'Souligné',
  }, {
    'kind': 'mark',
    'mark': 'strike',
    'icon': 'i-tabler-strikethrough',
    'tooltip': { text: 'Barré' },
    'aria-label': 'Barré',
  }, {
    'kind': 'mark',
    'mark': 'code',
    'icon': 'i-tabler-code',
    'tooltip': { text: 'Code' },
    'aria-label': 'Code',
  }], [{
    slot: 'link' as const,
    icon: 'i-tabler-link',
  }, {
    'kind': 'imageUpload',
    'icon': 'i-tabler-photo',
    'tooltip': { text: 'Image' },
    'aria-label': 'Image',
  }]]

  const getImageToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => {
    const node = editor.state.doc.nodeAt(editor.state.selection.from)

    return [[{
      'icon': 'i-tabler-download',
      'to': node?.attrs?.src,
      'download': true,
      'tooltip': { text: 'Télécharger' },
      'aria-label': 'Télécharger',
    }, {
      'icon': 'i-tabler-refresh',
      'tooltip': { text: 'Remplacer' },
      'aria-label': 'Remplacer',
      'onClick': () => {
        const pos = editor.state.selection.from
        const current = editor.state.doc.nodeAt(pos)

        if (current?.type.name === 'image') {
          editor.chain().focus()
            .deleteRange({ from: pos, to: pos + current.nodeSize })
            .insertContentAt(pos, { type: 'imageUpload' })
            .run()
        }
      },
    }], [{
      'icon': 'i-tabler-trash',
      'tooltip': { text: 'Supprimer' },
      'aria-label': 'Supprimer',
      'onClick': () => {
        const pos = editor.state.selection.from
        const current = editor.state.doc.nodeAt(pos)

        if (current?.type.name === 'image') {
          editor.chain().focus().deleteRange({ from: pos, to: pos + current.nodeSize }).run()
        }
      },
    }]]
  }

  const getTableToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => [[{
    'icon': 'i-tabler-row-insert-top',
    'tooltip': { text: 'Ligne au-dessus' },
    'aria-label': 'Ligne au-dessus',
    'onClick': () => editor.chain().focus().addRowBefore().run(),
  }, {
    'icon': 'i-tabler-row-insert-bottom',
    'tooltip': { text: 'Ligne en dessous' },
    'aria-label': 'Ligne en dessous',
    'onClick': () => editor.chain().focus().addRowAfter().run(),
  }, {
    'icon': 'i-tabler-column-insert-left',
    'tooltip': { text: 'Colonne avant' },
    'aria-label': 'Colonne avant',
    'onClick': () => editor.chain().focus().addColumnBefore().run(),
  }, {
    'icon': 'i-tabler-column-insert-right',
    'tooltip': { text: 'Colonne après' },
    'aria-label': 'Colonne après',
    'onClick': () => editor.chain().focus().addColumnAfter().run(),
  }], [{
    'icon': 'i-tabler-row-remove',
    'tooltip': { text: 'Supprimer la ligne' },
    'aria-label': 'Supprimer la ligne',
    'onClick': () => editor.chain().focus().deleteRow().run(),
  }, {
    'icon': 'i-tabler-column-remove',
    'tooltip': { text: 'Supprimer la colonne' },
    'aria-label': 'Supprimer la colonne',
    'onClick': () => editor.chain().focus().deleteColumn().run(),
  }], [{
    'icon': 'i-tabler-trash',
    'tooltip': { text: 'Supprimer le tableau' },
    'aria-label': 'Supprimer le tableau',
    'onClick': () => editor.chain().focus().deleteTable().run(),
  }]]

  return {
    toolbarItems,
    bubbleToolbarItems,
    getImageToolbarItems,
    getTableToolbarItems,
  }
}
