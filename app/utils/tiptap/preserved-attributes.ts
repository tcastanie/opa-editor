import { Extension } from '@tiptap/core'

export interface PreservedAttributesOptions {
  /** Types de nœuds concernés. */
  types: string[]
  /** Attributs conservés tels quels lors d'un aller-retour HTML. */
  attributes: string[]
  /**
   * Déclarations CSS retirées de l'attribut `style` conservé, parce qu'une
   * extension dédiée les possède déjà (sinon on les rendrait deux fois).
   */
  ignoredStyleProperties: string[]
}

/**
 * Conserve `id`, `class` et `style` sur les nœuds lors d'un aller-retour HTML.
 * Équivalent de `PreservedAttributes` du manifeste Directus : sans ça, TipTap
 * jette silencieusement tout attribut qu'aucune extension ne déclare.
 */
export const PreservedAttributes = Extension.create<PreservedAttributesOptions>({
  name: 'preservedAttributes',

  addOptions() {
    return {
      types: [
        'paragraph',
        'heading',
        'blockquote',
        'bulletList',
        'orderedList',
        'listItem',
        'codeBlock',
        'image',
        'table',
        'tableRow',
        'tableCell',
        'tableHeader',
      ],
      attributes: ['id', 'class', 'style'],
      ignoredStyleProperties: ['text-align'],
    }
  },

  addGlobalAttributes() {
    const { attributes, ignoredStyleProperties } = this.options

    return [{
      types: this.options.types,
      attributes: Object.fromEntries(attributes.map(name => [name, {
        default: null,
        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute(name)
          if (!value) {
            return null
          }

          if (name !== 'style') {
            return value
          }

          const kept = value
            .split(';')
            .map(declaration => declaration.trim())
            .filter(Boolean)
            .filter(declaration => !ignoredStyleProperties.some(
              property => new RegExp(`^${property}\\s*:`, 'i').test(declaration),
            ))
            .join('; ')

          return kept || null
        },
        renderHTML: (nodeAttributes: Record<string, unknown>) => {
          const value = nodeAttributes[name]
          if (!value) {
            return {}
          }

          return { [name]: value }
        },
      }])),
    }]
  },
})

export default PreservedAttributes
