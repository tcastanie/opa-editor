import type { EditorToolbarItem, EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { notionBlockTypeLabels, notionToolbarText } from '~/utils/i18n/notion-strings'

export function useNotionToolbar<T extends EditorCustomHandlers>(_customHandlers?: T) {
  const toolbarItems: EditorToolbarItem<T>[][] = [[{
    'kind': 'undo',
    'icon': 'i-tabler-arrow-back-up',
    'tooltip': { text: notionToolbarText.undo },
    'aria-label': notionToolbarText.undo,
  }, {
    'kind': 'redo',
    'icon': 'i-tabler-arrow-forward-up',
    'tooltip': { text: notionToolbarText.redo },
    'aria-label': notionToolbarText.redo,
  }], [{
    // Panneau branché dans `NotionEditor.vue`, comme le lien de la barre flottante.
    slot: 'emoji' as const,
    icon: 'i-tabler-mood-smile',
  }, {
    'kind': 'imageUpload',
    'aria-label': editorMediaPresets.image.label,
    'icon': 'i-tabler-photo-plus',
    'tooltip': { text: editorMediaPresets.image.insertLabel },
  }, {
    'kind': 'videoUpload',
    'aria-label': editorMediaPresets.video.label,
    'icon': 'i-tabler-video-plus',
    'tooltip': { text: editorMediaPresets.video.insertLabel },
  }, {
    'kind': 'audioUpload',
    'aria-label': editorMediaPresets.audio.label,
    'icon': 'i-tabler-music-plus',
    'tooltip': { text: editorMediaPresets.audio.insertLabel },
  }, {
    'kind': 'youtubeEmbed',
    'aria-label': editorYoutubePreset.label,
    'icon': editorYoutubePreset.icon,
    'tooltip': { text: editorYoutubePreset.insertLabel },
  }, {
    'icon': 'i-tabler-clock-plus',
    'tooltip': { text: notionToolbarText.insertDateTime },
    'aria-label': notionToolbarText.dateTime,
    'content': { align: 'end' },
    'items': [dateTimeMenuItems().map(item => ({ kind: 'dateTime' as const, ...item }))],
  }], [{
    'kind': 'sourceCode',
    'aria-label': notionToolbarText.sourceCode,
    'icon': 'i-tabler-html',
    'tooltip': { text: notionToolbarText.viewSourceCode },
  }]]

  const bubbleToolbarItems: EditorToolbarItem<T>[][] = [[{
    label: notionToolbarText.transformInto,
    trailingIcon: 'i-tabler-chevron-down',
    activeColor: 'neutral',
    activeVariant: 'ghost',
    tooltip: { text: notionToolbarText.transformInto },
    content: { align: 'start' },
    ui: { label: 'text-xs' },
    items: [{
      type: 'label',
      label: notionToolbarText.transformInto,
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
    }],
  }], [{
    'kind': 'mark',
    'mark': 'bold',
    'icon': 'i-tabler-bold',
    'tooltip': { text: notionToolbarText.bold },
    'aria-label': notionToolbarText.bold,
  }, {
    'kind': 'mark',
    'mark': 'italic',
    'icon': 'i-tabler-italic',
    'tooltip': { text: notionToolbarText.italic },
    'aria-label': notionToolbarText.italic,
  }, {
    'kind': 'mark',
    'mark': 'underline',
    'icon': 'i-tabler-underline',
    'tooltip': { text: notionToolbarText.underline },
    'aria-label': notionToolbarText.underline,
  }, {
    'kind': 'mark',
    'mark': 'strike',
    'icon': 'i-tabler-strikethrough',
    'tooltip': { text: notionToolbarText.strikethrough },
    'aria-label': notionToolbarText.strikethrough,
  }, {
    'kind': 'mark',
    'mark': 'code',
    'icon': 'i-tabler-code',
    'tooltip': { text: notionToolbarText.code },
    'aria-label': notionToolbarText.code,
  }], [{
    slot: 'link' as const,
    icon: 'i-tabler-link',
  }, {
    'kind': 'imageUpload',
    'icon': editorMediaPresets.image.icon,
    'tooltip': { text: editorMediaPresets.image.insertLabel },
    'aria-label': editorMediaPresets.image.label,
  }, {
    'kind': 'videoUpload',
    'icon': editorMediaPresets.video.icon,
    'tooltip': { text: editorMediaPresets.video.insertLabel },
    'aria-label': editorMediaPresets.video.label,
  }, {
    'kind': 'audioUpload',
    'icon': editorMediaPresets.audio.icon,
    'tooltip': { text: editorMediaPresets.audio.insertLabel },
    'aria-label': editorMediaPresets.audio.label,
  }, {
    'kind': 'youtubeEmbed',
    'icon': editorYoutubePreset.icon,
    'tooltip': { text: editorYoutubePreset.insertLabel },
    'aria-label': editorYoutubePreset.label,
  }]]

  /** Bloc d'attente à réinsérer pour remplacer un média : dépôt ou saisie d'URL. */
  const placeholderOf = (nodeName?: string | null) => {
    if (nodeName === editorYoutubePreset.node) {
      return editorYoutubePreset.embedNode
    }

    return editorMediaPresetOf(nodeName)?.uploadNode
  }

  /** Barre flottante d'un média inséré : image, vidéo, audio ou YouTube. */
  const getMediaToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => {
    const node = editor.state.doc.nodeAt(editor.state.selection.from)
    const isYoutube = node?.type.name === editorYoutubePreset.node

    // Le nœud est relu au clic : la sélection a pu bouger depuis le rendu.
    const selectedMedia = () => {
      const pos = editor.state.selection.from
      const current = editor.state.doc.nodeAt(pos)

      return placeholderOf(current?.type.name) && current ? { pos, node: current } : null
    }

    return [[
      // Une vidéo YouTube n'est pas un fichier hébergé : rien à télécharger,
      // seulement un lien à ouvrir.
      isYoutube
        ? {
            'icon': 'i-tabler-external-link',
            'to': node?.attrs?.src,
            'target': '_blank',
            'tooltip': { text: editorYoutubePreset.openLabel },
            'aria-label': editorYoutubePreset.openLabel,
          }
        : {
            'icon': 'i-tabler-download',
            'to': node?.attrs?.src,
            'download': true,
            'tooltip': { text: notionToolbarText.download },
            'aria-label': notionToolbarText.download,
          },
      {
        'icon': 'i-tabler-refresh',
        'tooltip': { text: notionToolbarText.replace },
        'aria-label': notionToolbarText.replace,
        'onClick': () => {
          const selected = selectedMedia()
          const placeholder = placeholderOf(selected?.node.type.name)

          if (selected && placeholder) {
            editor.chain().focus()
              .deleteRange({ from: selected.pos, to: selected.pos + selected.node.nodeSize })
              .insertContentAt(selected.pos, { type: placeholder })
              .run()
          }
        },
      }], [{
      'icon': 'i-tabler-trash',
      'tooltip': { text: notionToolbarText.delete },
      'aria-label': notionToolbarText.delete,
      'onClick': () => {
        const selected = selectedMedia()

        if (selected) {
          editor.chain().focus().deleteRange({ from: selected.pos, to: selected.pos + selected.node.nodeSize }).run()
        }
      },
    }]]
  }

  const getTableToolbarItems = (editor: Editor): EditorToolbarItem<T>[][] => [[{
    'icon': 'i-tabler-row-insert-top',
    'tooltip': { text: notionToolbarText.rowAbove },
    'aria-label': notionToolbarText.rowAbove,
    'onClick': () => editor.chain().focus().addRowBefore().run(),
  }, {
    'icon': 'i-tabler-row-insert-bottom',
    'tooltip': { text: notionToolbarText.rowBelow },
    'aria-label': notionToolbarText.rowBelow,
    'onClick': () => editor.chain().focus().addRowAfter().run(),
  }, {
    'icon': 'i-tabler-column-insert-left',
    'tooltip': { text: notionToolbarText.columnBefore },
    'aria-label': notionToolbarText.columnBefore,
    'onClick': () => editor.chain().focus().addColumnBefore().run(),
  }, {
    'icon': 'i-tabler-column-insert-right',
    'tooltip': { text: notionToolbarText.columnAfter },
    'aria-label': notionToolbarText.columnAfter,
    'onClick': () => editor.chain().focus().addColumnAfter().run(),
  }], [{
    'icon': 'i-tabler-row-remove',
    'tooltip': { text: notionToolbarText.deleteRow },
    'aria-label': notionToolbarText.deleteRow,
    'onClick': () => editor.chain().focus().deleteRow().run(),
  }, {
    'icon': 'i-tabler-column-remove',
    'tooltip': { text: notionToolbarText.deleteColumn },
    'aria-label': notionToolbarText.deleteColumn,
    'onClick': () => editor.chain().focus().deleteColumn().run(),
  }], [{
    'icon': 'i-tabler-trash',
    'tooltip': { text: notionToolbarText.deleteTable },
    'aria-label': notionToolbarText.deleteTable,
    'onClick': () => editor.chain().focus().deleteTable().run(),
  }]]

  return {
    toolbarItems,
    bubbleToolbarItems,
    getMediaToolbarItems,
    getTableToolbarItems,
  }
}
