import type { EditorUploadResult } from '~/composables/useEditorUpload'

/**
 * Descripteurs des médias insérables (image, vidéo, audio).
 *
 * Les deux templates y puisent les libellés, l'icône, le filtre `accept` et les
 * noms de nœuds TipTap, pour que l'ajout d'un type de média reste une seule
 * entrée à écrire.
 */

export type EditorMediaKind = 'image' | 'video' | 'audio'

export interface EditorMediaPreset {
  kind: EditorMediaKind
  /** Nœud TipTap final, une fois l'envoi terminé. */
  node: string
  /** Nœud « zone de dépôt » du template notion. */
  uploadNode: string
  /** `data-type` sous lequel la zone de dépôt se sérialise en HTML. */
  uploadDataType: string
  label: string
  /** Libellé d'action de la barre d'outils. */
  insertLabel: string
  downloadLabel: string
  /** Libellé de la zone de dépôt du template notion. */
  uploadLabel: string
  /** Libellé de la zone de dépôt du template WYSIWYG. */
  dropLabel: string
  icon: string
  accept: string
  /** Formats cités en aide sous la zone de dépôt. */
  formats: string
  /** Champ libre du popover WYSIWYG : `alt` pour l'image, `title` sinon. */
  fieldLabel: string
  fieldPlaceholder: string
}

export const editorMediaPresets = {
  image: {
    kind: 'image',
    node: 'image',
    uploadNode: 'imageUpload',
    uploadDataType: 'image-upload',
    label: 'Image',
    insertLabel: 'Insérer une image',
    downloadLabel: 'Télécharger l\'image',
    uploadLabel: 'Envoyer une image',
    dropLabel: 'Déposez une image ou cliquez',
    icon: 'i-tabler-photo',
    accept: 'image/*',
    formats: 'SVG, PNG, JPG ou GIF',
    fieldLabel: 'Texte alternatif',
    fieldPlaceholder: 'Description de l\'image',
  },
  video: {
    kind: 'video',
    node: 'video',
    uploadNode: 'videoUpload',
    uploadDataType: 'video-upload',
    label: 'Vidéo',
    insertLabel: 'Insérer une vidéo',
    downloadLabel: 'Télécharger la vidéo',
    uploadLabel: 'Envoyer une vidéo',
    dropLabel: 'Déposez une vidéo ou cliquez',
    icon: 'i-tabler-video',
    accept: 'video/*',
    formats: 'MP4, WebM ou Ogg',
    fieldLabel: 'Titre',
    fieldPlaceholder: 'Description de la vidéo',
  },
  audio: {
    kind: 'audio',
    node: 'audio',
    uploadNode: 'audioUpload',
    uploadDataType: 'audio-upload',
    label: 'Audio',
    insertLabel: 'Insérer un audio',
    downloadLabel: 'Télécharger l\'audio',
    uploadLabel: 'Envoyer un fichier audio',
    dropLabel: 'Déposez un fichier audio ou cliquez',
    icon: 'i-tabler-music',
    accept: 'audio/*',
    formats: 'MP3, WAV ou Ogg',
    fieldLabel: 'Titre',
    fieldPlaceholder: 'Description de l\'audio',
  },
} as const satisfies Record<EditorMediaKind, EditorMediaPreset>

export const editorMediaKinds = Object.keys(editorMediaPresets) as EditorMediaKind[]

/**
 * Retrouve le préréglage d'un nœud, qu'il s'agisse du média lui-même (`video`)
 * ou de sa zone de dépôt (`videoUpload`).
 */
export function editorMediaPresetOf(nodeName?: string | null): EditorMediaPreset | undefined {
  return editorMediaKinds
    .map(kind => editorMediaPresets[kind] as EditorMediaPreset)
    .find(preset => preset.node === nodeName || preset.uploadNode === nodeName)
}

/**
 * Attributs du nœud final à partir du résultat d'envoi. L'image porte sa
 * description sur `alt`, les médias temporels sur `title`.
 */
export function editorMediaAttributes(
  kind: EditorMediaKind,
  result: EditorUploadResult,
  options: { label?: string, fallback?: string } = {},
) {
  const label = options.label || (kind === 'image' ? result.alt : result.title) || options.fallback

  if (kind === 'image') {
    return { src: result.src, alt: label, title: result.title }
  }

  return { src: result.src, title: label, poster: result.poster }
}
