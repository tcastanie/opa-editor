import { Extension } from '@tiptap/core'

export interface PreKeymapOptions {
  /** Chaîne insérée par Tab dans un bloc de code. */
  indent: string
}

/**
 * Raccourcis clavier propres aux blocs de code (`<pre>`) :
 * Tab / Maj+Tab pour l'indentation, Ctrl+Entrée pour sortir du bloc.
 * Sans ça, Tab sort du champ et casse la saisie de code.
 */
export const PreKeymap = Extension.create<PreKeymapOptions>({
  name: 'preKeymap',

  addOptions() {
    return {
      indent: '  ',
    }
  },

  addKeyboardShortcuts() {
    const { indent } = this.options

    return {
      'Tab': () => {
        if (!this.editor.isActive('codeBlock')) {
          return false
        }

        return this.editor.commands.insertContent(indent)
      },

      'Shift-Tab': () => {
        if (!this.editor.isActive('codeBlock')) {
          return false
        }

        const { state } = this.editor
        const { $from } = state.selection
        const lineStart = $from.start()
        const textBefore = $from.parent.textBetween(0, $from.parentOffset)
        const currentLineOffset = textBefore.lastIndexOf('\n') + 1
        const from = lineStart + currentLineOffset

        const lineText = $from.parent.textBetween(currentLineOffset, $from.parent.content.size)
        if (!lineText.startsWith(indent)) {
          return false
        }

        return this.editor.commands.deleteRange({ from, to: from + indent.length })
      },

      'Mod-Enter': () => {
        if (!this.editor.isActive('codeBlock')) {
          return false
        }

        return this.editor.commands.exitCode()
      },
    }
  },
})

export default PreKeymap
