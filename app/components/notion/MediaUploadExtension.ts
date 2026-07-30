import type { NodeViewRenderer } from '@tiptap/core'
import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import type { EditorMediaPreset } from '~/utils/editor-media'
import { editorMediaPresets } from '~/utils/editor-media'
import MediaUploadNode from './NotionMediaUploadNode.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mediaUpload: {
      insertImageUpload: () => ReturnType
      insertVideoUpload: () => ReturnType
      insertAudioUpload: () => ReturnType
    }
  }
}

/**
 * Bloc « zone de dépôt » : il se remplace lui-même par le vrai média une fois
 * l'envoi terminé. Le nœud n'est donc jamais censé survivre dans le document
 * final, mais il se sérialise quand même en `<div data-type="…-upload">` pour
 * survivre à un aller-retour HTML avant l'envoi.
 */
function createMediaUploadNode(preset: EditorMediaPreset) {
  return Node.create({
    name: preset.uploadNode,

    group: 'block',
    atom: true,
    draggable: true,

    parseHTML() {
      return [{ tag: `div[data-type="${preset.uploadDataType}"]` }]
    },

    renderHTML({ HTMLAttributes }) {
      return ['div', mergeAttributes(HTMLAttributes, { 'data-type': preset.uploadDataType })]
    },

    addNodeView(): NodeViewRenderer {
      return VueNodeViewRenderer(MediaUploadNode)
    },
  })
}

export const ImageUpload = createMediaUploadNode(editorMediaPresets.image).extend({
  addCommands() {
    return {
      insertImageUpload: () => ({ commands }) => commands.insertContent({ type: this.name }),
    }
  },
})

export const VideoUpload = createMediaUploadNode(editorMediaPresets.video).extend({
  addCommands() {
    return {
      insertVideoUpload: () => ({ commands }) => commands.insertContent({ type: this.name }),
    }
  },
})

export const AudioUpload = createMediaUploadNode(editorMediaPresets.audio).extend({
  addCommands() {
    return {
      insertAudioUpload: () => ({ commands }) => commands.insertContent({ type: this.name }),
    }
  },
})

export const mediaUploadExtensions = [ImageUpload, VideoUpload, AudioUpload]
