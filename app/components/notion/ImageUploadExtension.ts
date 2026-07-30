import { Node, mergeAttributes } from '@tiptap/core'
import type { NodeViewRenderer } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNode from './NotionImageUploadNode.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      insertImageUpload: () => ReturnType
    }
  }
}

/**
 * Bloc « zone de dépôt » : il se remplace lui-même par une vraie image une fois
 * l'envoi terminé. Le nœud n'est donc jamais censé survivre dans le document
 * final, mais il se sérialise quand même en `<div data-type="image-upload">`
 * pour survivre à un aller-retour HTML avant l'envoi.
 */
export const ImageUpload = Node.create({
  name: 'imageUpload',

  group: 'block',
  atom: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })]
  },

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(ImageUploadNode)
  },

  addCommands() {
    return {
      insertImageUpload: () => ({ commands }) => commands.insertContent({ type: this.name }),
    }
  },
})

export default ImageUpload
