import { getEmbedUrlFromYoutubeUrl, isValidYoutubeUrl } from '@tiptap/extension-youtube'

/**
 * Pendant de `editorMediaPresets` pour un média qui n'est **pas** un fichier :
 * une vidéo YouTube n'a rien à envoyer, seulement une URL à coller. Elle vit
 * donc à côté des trois autres dans les barres d'outils, mais sans passer par
 * `useEditorUpload`.
 */
export const editorYoutubePreset = {
  /** Nœud TipTap final, fourni par `@tiptap/extension-youtube`. */
  node: 'youtube',
  /** Nœud « saisie d'URL » du template notion. */
  embedNode: 'youtubeEmbed',
  /** `data-type` sous lequel la saisie d'URL se sérialise en HTML. */
  embedDataType: 'youtube-embed',
  label: 'Vidéo YouTube',
  /** Libellé d'action des barres d'outils. */
  insertLabel: 'Insérer une vidéo YouTube',
  /** Libellé du bloc de saisie du template notion. */
  embedLabel: 'Collez le lien d\'une vidéo YouTube',
  openLabel: 'Ouvrir sur YouTube',
  icon: 'i-tabler-brand-youtube',
  placeholder: 'https://www.youtube.com/watch?v=…',
  /** Message affiché quand le lien collé n'est pas exploitable. */
  invalidMessage: 'Ce lien n\'est pas une vidéo YouTube.',
} as const

/**
 * Normalise une saisie : renvoie l'URL nettoyée si l'extension sait en faire
 * une vidéo, `null` sinon.
 */
export function editorYoutubeUrl(value: string): string | null {
  const url = value.trim()

  if (!url || !isValidYoutubeUrl(url)) {
    return null
  }

  // `isValidYoutubeUrl` se contente de reconnaître le domaine : une page de
  // chaîne passe, alors que la conversion en URL d'intégration échouera et
  // laissera une iframe sans `src`. On refait donc la conversion pour trancher,
  // et on en jette le résultat — c'est l'extension, configurée, qui la refera
  // au rendu.
  return getEmbedUrlFromYoutubeUrl({ url }) ? url : null
}

/** Vrai sur une vidéo YouTube insérée comme sur sa saisie d'URL. */
export function isEditorYoutubeNode(nodeName?: string | null): boolean {
  return nodeName === editorYoutubePreset.node || nodeName === editorYoutubePreset.embedNode
}
