import { Node, mergeAttributes } from '@tiptap/core'

export type MediaKind = 'video' | 'audio' | 'iframe'

export interface MediaAttributes {
  src: string
  kind?: MediaKind
  title?: string | null
  width?: string | null
  height?: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    media: {
      setMedia: (attributes: MediaAttributes) => ReturnType
    }
  }
}

const TAG_BY_KIND: Record<MediaKind, string> = {
  video: 'video',
  audio: 'audio',
  iframe: 'iframe',
}

/**
 * Nœud média : `<video>`, `<audio>` ou `<iframe>` (embed YouTube, Vimeo…).
 * Le manifeste appelle ce bouton `customMedia`.
 */
export const Media = Node.create({
  name: 'media',

  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      kind: {
        default: 'video' as MediaKind,
        parseHTML: element => (element.getAttribute('data-kind') || element.tagName.toLowerCase()) as MediaKind,
        renderHTML: attributes => ({ 'data-kind': attributes.kind }),
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'video[src]' },
      { tag: 'audio[src]' },
      { tag: 'iframe[src]' },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const kind = (node.attrs.kind || 'video') as MediaKind
    const tag = TAG_BY_KIND[kind] ?? 'video'

    const extra = kind === 'iframe'
      ? { frameborder: '0', allowfullscreen: 'true', allow: 'accelerometer; clipboard-write; encrypted-media; picture-in-picture' }
      : { controls: 'true' }

    return [tag, mergeAttributes(HTMLAttributes, extra)]
  },

  addCommands() {
    return {
      setMedia: attributes => ({ commands }) => {
        return commands.insertContent({ type: this.name, attrs: attributes })
      },
    }
  },
})

export default Media
