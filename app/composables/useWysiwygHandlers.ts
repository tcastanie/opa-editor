import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { DOMSerializer } from '@tiptap/pm/model'

const LIST_ITEM_TYPES = ['listItem', 'taskItem']

function activeListItemType(editor: Editor) {
  return LIST_ITEM_TYPES.find(type => editor.schema.nodes[type] && editor.isActive(type)) ?? 'listItem'
}

function serializeSelection(editor: Editor) {
  const { state } = editor
  const { from, to } = state.selection
  const fragment = DOMSerializer.fromSchema(state.schema).serializeFragment(state.doc.slice(from, to).content)
  const container = document.createElement('div')
  container.appendChild(fragment)

  return {
    html: container.innerHTML,
    text: state.doc.textBetween(from, to, '\n'),
  }
}

async function writeClipboard({ html, text }: { html: string, text: string }) {
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    await navigator.clipboard.write([new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([text], { type: 'text/plain' }),
    })])
    return
  }

  await navigator.clipboard.writeText(text)
}

async function readClipboardInto(editor: Editor) {
  if (navigator.clipboard?.read) {
    const items = await navigator.clipboard.read()

    for (const item of items) {
      if (item.types.includes('text/html')) {
        editor.chain().focus().insertContent(await (await item.getType('text/html')).text()).run()
        return
      }
    }
  }

  const text = await navigator.clipboard.readText()
  if (text) {
    editor.chain().focus().insertContent(text).run()
  }
}

export interface UseWysiwygHandlersOptions {
  /** Ouvre la modale « Code source ». */
  onOpenSourceCode?: () => void
  /** Bascule le mode plein écran. */
  onToggleFullscreen?: () => void
  /** Bascule les aides visuelles. */
  onToggleVisualAid?: () => void
  fullscreen?: Ref<boolean>
  visualAid?: Ref<boolean>
}

/**
 * Handlers `kind` absents de Nuxt UI, requis par le manifeste. Ils suivent
 * l'interface `EditorHandler` : `execute` renvoie une chaîne TipTap que la
 * barre d'outils exécute avec `.run()`.
 */
export function useWysiwygHandlers(options: UseWysiwygHandlersOptions = {}) {
  const toast = useToast()

  function notifyClipboardFailure() {
    toast.add({
      title: 'Presse-papiers indisponible',
      description: 'Le navigateur a refusé l\'accès. Utilisez les raccourcis clavier (Ctrl/⌘ + X, C, V).',
      color: 'warning',
      icon: 'i-tabler-clipboard-x',
    })
  }

  const handlers = {
    subscript: {
      canExecute: editor => editor.can().toggleSubscript(),
      execute: editor => editor.chain().focus().toggleSubscript(),
      isActive: editor => editor.isActive('subscript'),
      isDisabled: editor => !editor.schema.marks.subscript,
    },

    superscript: {
      canExecute: editor => editor.can().toggleSuperscript(),
      execute: editor => editor.chain().focus().toggleSuperscript(),
      isActive: editor => editor.isActive('superscript'),
      isDisabled: editor => !editor.schema.marks.superscript,
    },

    unsetTextAlign: {
      canExecute: editor => editor.can().unsetTextAlign(),
      execute: editor => editor.chain().focus().unsetTextAlign(),
      isActive: editor => !editor.isActive({ textAlign: 'left' })
        && !editor.isActive({ textAlign: 'center' })
        && !editor.isActive({ textAlign: 'right' })
        && !editor.isActive({ textAlign: 'justify' }),
    },

    direction: {
      canExecute: (editor, cmd) => editor.can().setDirection(cmd.direction),
      execute: (editor, cmd) => editor.chain().focus().setDirection(cmd.direction),
      isActive: (editor, cmd) => editor.isActive({ dir: cmd.direction }),
    },

    indent: {
      canExecute: editor => editor.can().sinkListItem(activeListItemType(editor)),
      execute: editor => editor.chain().focus().sinkListItem(activeListItemType(editor)),
      isActive: () => false,
    },

    outdent: {
      canExecute: editor => editor.can().liftListItem(activeListItemType(editor)),
      execute: editor => editor.chain().focus().liftListItem(activeListItemType(editor)),
      isActive: () => false,
    },

    pageBreak: {
      canExecute: editor => editor.can().insertPageBreak(),
      execute: editor => editor.chain().focus().insertPageBreak(),
      isActive: editor => editor.isActive('pageBreak'),
    },

    unlink: {
      canExecute: editor => editor.isActive('link'),
      execute: editor => editor.chain().focus().extendMarkRange('link').unsetLink().setMeta('preventAutolink', true),
      isActive: () => false,
      isDisabled: editor => !editor.isActive('link'),
    },

    /**
     * `removeformat` du manifeste : comme `clearFormatting` de Nuxt UI mais en
     * réinitialisant aussi la direction du texte.
     */
    removeFormat: {
      canExecute: editor => editor.can().unsetAllMarks() || editor.can().clearNodes(),
      execute: editor => editor.chain().focus().unsetAllMarks().clearNodes().unsetDirection(),
      isActive: () => false,
    },

    cut: {
      canExecute: editor => !editor.state.selection.empty,
      execute: (editor) => {
        // La sélection est capturée maintenant : la chaîne renvoyée la supprime
        // avant que l'écriture asynchrone dans le presse-papiers n'aboutisse.
        const payload = serializeSelection(editor)
        writeClipboard(payload).catch(notifyClipboardFailure)

        return editor.chain().focus().deleteSelection()
      },
      isActive: () => false,
      isDisabled: editor => editor.state.selection.empty,
    },

    copy: {
      canExecute: editor => !editor.state.selection.empty,
      execute: (editor) => {
        writeClipboard(serializeSelection(editor)).catch(notifyClipboardFailure)
        return editor.chain().focus()
      },
      isActive: () => false,
      isDisabled: editor => editor.state.selection.empty,
    },

    paste: {
      canExecute: () => true,
      execute: (editor) => {
        readClipboardInto(editor).catch(notifyClipboardFailure)
        return editor.chain()
      },
      isActive: () => false,
    },

    deleteSelection: {
      canExecute: editor => !editor.state.selection.empty,
      execute: editor => editor.chain().focus().deleteSelection(),
      isActive: () => false,
      isDisabled: editor => editor.state.selection.empty,
    },

    selectAll: {
      canExecute: () => true,
      execute: editor => editor.chain().focus().selectAll(),
      isActive: () => false,
    },

    insertDateTime: {
      canExecute: () => true,
      execute: (editor, cmd) => editor.chain().focus().insertContent(cmd?.text ?? new Date().toLocaleString('fr-FR')),
      isActive: () => false,
    },

    sourceCode: {
      canExecute: () => true,
      execute: (editor) => {
        options.onOpenSourceCode?.()
        return editor.chain()
      },
      isActive: () => false,
    },

    fullscreen: {
      canExecute: () => true,
      execute: (editor) => {
        options.onToggleFullscreen?.()
        return editor.chain()
      },
      isActive: () => options.fullscreen?.value ?? false,
    },

    visualAid: {
      canExecute: () => true,
      execute: (editor) => {
        options.onToggleVisualAid?.()
        return editor.chain()
      },
      isActive: () => options.visualAid?.value ?? false,
    },

    /** Insère un tableau 3×3 avec ligne d'en-tête. */
    table: {
      canExecute: editor => editor.can().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
      execute: editor => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
      isActive: editor => editor.isActive('table'),
    },
  } satisfies EditorCustomHandlers

  return handlers
}

export type WysiwygHandlers = ReturnType<typeof useWysiwygHandlers>
