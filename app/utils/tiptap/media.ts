import type { Attributes } from '@tiptap/core'
import { Node, mergeAttributes } from '@tiptap/core'

export interface MediaOptions {
  /** Attributs ajoutés à chaque rendu, à la manière de `Image`. */
  HTMLAttributes: Record<string, unknown>
}

export interface MediaAttributes {
  src: string
  title?: string | null
  width?: string | null
  height?: string | null
  /** Vidéo uniquement : image d'attente. */
  poster?: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    media: {
      /** Insère une vidéo (`<video controls>`). */
      setVideo: (attributes: MediaAttributes) => ReturnType
      /** Insère un fichier audio (`<audio controls>`). */
      setAudio: (attributes: MediaAttributes) => ReturnType
    }
  }
}

/** Dimensions lues sur l'attribut ou sur le style, comme pour `CustomImage`. */
function dimension(name: 'width' | 'height'): Attributes[string] {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute(name) || element.style[name] || null,
    renderHTML: (attributes: Record<string, unknown>) => {
      if (!attributes[name]) {
        return {}
      }

      return { [name]: attributes[name] }
    },
  }
}

/**
 * TipTap n'a pas d'équivalent de `Image` pour les médias temporels : cette
 * fabrique produit un nœud atomique qui se sérialise en `<video>` / `<audio>`
 * natif, `controls` compris — donc lisible tel quel hors de l'éditeur.
 */
function createMediaNode({ name, tag, attributes }: {
  name: string
  tag: string
  attributes?: Attributes
}) {
  return Node.create<MediaOptions>({
    name,

    group: 'block',
    atom: true,
    draggable: true,

    addOptions() {
      return { HTMLAttributes: {} }
    },

    addAttributes() {
      return {
        src: {
          default: null,
          // Un média collé depuis le web porte souvent son URL sur un `<source>`
          // enfant plutôt que sur l'élément lui-même.
          parseHTML: element => element.getAttribute('src')
            || element.querySelector('source')?.getAttribute('src')
            || null,
        },
        title: {
          default: null,
        },
        width: dimension('width'),
        height: dimension('height'),
        ...attributes,
      }
    },

    parseHTML() {
      return [{ tag }]
    },

    renderHTML({ HTMLAttributes }) {
      return [tag, mergeAttributes({ controls: 'true' }, this.options.HTMLAttributes, HTMLAttributes)]
    },
  })
}

/** `customVideo` du manifeste. */
export const CustomVideo = createMediaNode({
  name: 'video',
  tag: 'video',
  attributes: {
    poster: { default: null },
    preload: { default: 'metadata' },
  },
}).extend({
  addCommands() {
    return {
      setVideo: attributes => ({ commands }) => commands.insertContent({ type: this.name, attrs: attributes }),
    }
  },
})

/** `customAudio` du manifeste. */
export const CustomAudio = createMediaNode({
  name: 'audio',
  tag: 'audio',
  attributes: {
    preload: { default: 'metadata' },
  },
}).extend({
  addCommands() {
    return {
      setAudio: attributes => ({ commands }) => commands.insertContent({ type: this.name, attrs: attributes }),
    }
  },
})
