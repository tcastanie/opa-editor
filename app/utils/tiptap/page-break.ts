import { Node, mergeAttributes } from '@tiptap/core'

export const PAGE_BREAK_NODE = 'pageBreak'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pageBreak: {
      insertPageBreak: () => ReturnType
    }
  }
}

/**
 * Saut de page imprimable. Sérialisé en `<div data-type="page-break">`,
 * ce qui reste inoffensif pour les consommateurs HTML qui l'ignorent.
 */
export const PageBreak = Node.create({
  name: PAGE_BREAK_NODE,

  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [
      { tag: 'div[data-type="page-break"]' },
      { tag: 'hr[data-type="page-break"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, {
      'data-type': 'page-break',
      'class': 'page-break',
    })]
  },

  addCommands() {
    return {
      insertPageBreak: () => ({ commands }) => {
        return commands.insertContent({ type: this.name })
      },
    }
  },
})

export default PageBreak
