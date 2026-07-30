import type { NodeViewRenderer } from '@tiptap/core'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { editorYoutubePreset } from '~/utils/editor-youtube'
import YoutubeEmbedNode from './NotionYoutubeEmbedNode.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    youtubeEmbed: {
      insertYoutubeEmbed: () => ReturnType
    }
  }
}

/**
 * Pendant YouTube des zones de dépôt de `MediaUploadExtension` : le bloc réclame
 * une URL puis se remplace par le nœud `youtube`. Il n'est donc pas censé
 * survivre dans le document final, mais il se sérialise quand même en
 * `<div data-type="youtube-embed">` pour survivre à un aller-retour HTML avant
 * la saisie.
 */
export const YoutubeEmbed = Node.create({
  name: editorYoutubePreset.embedNode,

  group: 'block',
  atom: true,
  draggable: true,

  parseHTML() {
    return [{ tag: `div[data-type="${editorYoutubePreset.embedDataType}"]` }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': editorYoutubePreset.embedDataType })]
  },

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(YoutubeEmbedNode)
  },

  addCommands() {
    return {
      insertYoutubeEmbed: () => ({ commands }) => commands.insertContent({ type: this.name }),
    }
  },
})
