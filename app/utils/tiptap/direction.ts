import { Extension } from '@tiptap/core'

export type TextDirection = 'ltr' | 'rtl'

export interface DirectionOptions {
  /** Types de nœuds qui acceptent l'attribut `dir`. */
  types: string[]
  /** Direction appliquée quand aucune n'est définie. */
  defaultDirection: TextDirection | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    direction: {
      setDirection: (direction: TextDirection) => ReturnType
      unsetDirection: () => ReturnType
    }
  }
}

/**
 * Ajoute un attribut global `dir` (ltr/rtl) sur les nœuds de bloc.
 * Équivalent de l'extension `Direction` du manifeste Directus.
 */
export const Direction = Extension.create<DirectionOptions>({
  name: 'direction',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'blockquote', 'listItem', 'taskItem', 'codeBlock', 'tableCell', 'tableHeader'],
      defaultDirection: null,
    }
  },

  addGlobalAttributes() {
    return [{
      types: this.options.types,
      attributes: {
        dir: {
          default: this.options.defaultDirection,
          parseHTML: element => element.getAttribute('dir') || this.options.defaultDirection,
          renderHTML: (attributes) => {
            if (!attributes.dir) {
              return {}
            }

            return { dir: attributes.dir }
          },
        },
      },
    }]
  },

  addCommands() {
    // `some` et non `every` : `updateAttributes` ne renvoie true que si un nœud
    // de ce type est dans la sélection. Avec `every`, un seul type absent de la
    // sélection suffirait à faire échouer la commande — et à griser le bouton.
    // C'est la convention de `TextAlign` en amont.
    return {
      setDirection: direction => ({ commands }) => {
        return this.options.types
          .map(type => commands.updateAttributes(type, { dir: direction }))
          .some(Boolean)
      },
      unsetDirection: () => ({ commands }) => {
        return this.options.types
          .map(type => commands.resetAttributes(type, 'dir'))
          .some(Boolean)
      },
    }
  },
})

export default Direction
