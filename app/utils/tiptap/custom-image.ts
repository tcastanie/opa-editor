import Image from '@tiptap/extension-image'

/**
 * Image du manifeste (`CustomImage`) : l'image de base de TipTap ne conserve
 * ni les dimensions ni le titre. On garde le nom de nœud `image` pour rester
 * compatible avec le handler `image` fourni par Nuxt UI.
 *
 * À utiliser avec `<UEditor :image="false">` pour éviter d'enregistrer
 * l'extension deux fois.
 */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: element => element.getAttribute('width') || element.style.width || null,
        renderHTML: (attributes) => {
          if (!attributes.width) {
            return {}
          }

          return { width: attributes.width }
        },
      },
      height: {
        default: null,
        parseHTML: element => element.getAttribute('height') || element.style.height || null,
        renderHTML: (attributes) => {
          if (!attributes.height) {
            return {}
          }

          return { height: attributes.height }
        },
      },
      loading: {
        default: 'lazy',
      },
    }
  },
})

export default CustomImage
