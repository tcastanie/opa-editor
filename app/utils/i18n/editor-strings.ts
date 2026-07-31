/**
 * Textes partagés par les deux templates (notion et WYSIWYG). Regroupés ici
 * pour que changer de langue se limite à ce fichier, `notion-strings.ts` et
 * `wysiwyg-strings.ts`, plutôt qu'à une chasse dans les composables/composants.
 */

import type { EditorMediaKind } from '~/utils/editor-media'

export const editorMediaText: Record<EditorMediaKind, {
  label: string
  insertLabel: string
  downloadLabel: string
  uploadLabel: string
  dropLabel: string
  formats: string
  fieldLabel: string
  fieldPlaceholder: string
}> = {
  image: {
    label: 'Image',
    insertLabel: 'Insérer une image',
    downloadLabel: 'Télécharger l\'image',
    uploadLabel: 'Envoyer une image',
    dropLabel: 'Déposez une image ou cliquez',
    formats: 'SVG, PNG, JPG ou GIF',
    fieldLabel: 'Texte alternatif',
    fieldPlaceholder: 'Description de l\'image',
  },
  video: {
    label: 'Vidéo',
    insertLabel: 'Insérer une vidéo',
    downloadLabel: 'Télécharger la vidéo',
    uploadLabel: 'Envoyer une vidéo',
    dropLabel: 'Déposez une vidéo ou cliquez',
    formats: 'MP4, WebM ou Ogg',
    fieldLabel: 'Titre',
    fieldPlaceholder: 'Description de la vidéo',
  },
  audio: {
    label: 'Audio',
    insertLabel: 'Insérer un audio',
    downloadLabel: 'Télécharger l\'audio',
    uploadLabel: 'Envoyer un fichier audio',
    dropLabel: 'Déposez un fichier audio ou cliquez',
    formats: 'MP3, WAV ou Ogg',
    fieldLabel: 'Titre',
    fieldPlaceholder: 'Description de l\'audio',
  },
}

export const editorYoutubeText = {
  label: 'Vidéo YouTube',
  insertLabel: 'Insérer une vidéo YouTube',
  embedLabel: 'Collez le lien d\'une vidéo YouTube',
  openLabel: 'Ouvrir sur YouTube',
  formats: 'youtube.com ou youtu.be',
  placeholder: 'https://www.youtube.com/watch?v=…',
  invalidMessage: 'Ce lien n\'est pas une vidéo YouTube.',
}

export const editorUploadText = {
  noHandlerWarning: '[opa-editor] Aucun gestionnaire d\'upload fourni : utilisation d\'une URL d\'objet locale, non persistée.\n'
    + 'Passez `:on-upload="votreFonction"` à l\'éditeur pour brancher votre stockage.',
  uploadError: 'Échec de l\'envoi du fichier.',
  noStorageTitle: 'Aucun stockage branché',
  noStorageDescription: 'Le fichier reçoit une URL locale temporaire. Passez `on-upload` à l\'éditeur pour utiliser votre backend.',
}

/** Texte des deux popovers de lien (`WysiwygLinkPopover`, `NotionLinkPopover`). */
export const editorLinkPopoverText = {
  placeholder: 'Collez un lien…',
  applyTitle: 'Appliquer le lien',
  deleteTitle: 'Supprimer le lien',
}

export const editorEmojiPopoverText = {
  tooltip: 'Émoji',
  searchPlaceholder: 'Rechercher un émoji…',
  loading: 'Chargement…',
  empty: (search: string) => `Aucun émoji pour « ${search} ».`,
}

export const editorSourceCodeModalText = {
  title: 'Code source',
  description: 'Modifiez le HTML du document. Les balises inconnues du schéma de l\'éditeur seront écartées.',
  cancel: 'Annuler',
  apply: 'Appliquer',
}

/** Libellés des formats de `dateTimeFormats`, dans le même ordre. */
export const editorDateTimeLabels = ['Date courte', 'Date longue', 'Heure', 'Date et heure', 'ISO 8601'] as const
