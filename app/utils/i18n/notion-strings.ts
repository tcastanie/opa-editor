/**
 * Textes propres au template notion-like (`useNotion*`, `Notion*.vue`).
 * Les libellés partagés avec le WYSIWYG vivent dans `editor-strings.ts`.
 */

/** Réutilisés par le menu « / », le menu « Transformer en » et la poignée de bloc. */
export const notionBlockTypeLabels = {
  paragraph: 'Paragraphe',
  heading1: 'Titre 1',
  heading2: 'Titre 2',
  heading3: 'Titre 3',
  heading4: 'Titre 4',
  bulletList: 'Liste à puces',
  orderedList: 'Liste numérotée',
  taskList: 'Liste de tâches',
  blockquote: 'Citation',
  codeBlock: 'Bloc de code',
}

export const notionEditorText = {
  placeholder: 'Écrivez, ou tapez « / » pour les commandes…',
  insertBlock: 'Insérer un bloc',
  blockOptions: 'Options du bloc',
}

export const notionLinkPopoverText = {
  tooltip: 'Lien',
  openInNewTab: 'Ouvrir dans un nouvel onglet',
}

export const notionSuggestionsText = {
  styleGroup: 'Style',
  insertGroup: 'Insérer',
  mention: 'Mention',
  emoji: 'Émoji',
  table: 'Tableau',
  horizontalRule: 'Séparateur',
}

export const notionDragHandleText = {
  typeLabels: {
    ...notionBlockTypeLabels,
    heading: 'Titre',
    listItem: 'Élément de liste',
    taskItem: 'Tâche',
    image: 'Image',
    imageUpload: 'Envoi d\'image',
    video: 'Vidéo',
    videoUpload: 'Envoi de vidéo',
    audio: 'Audio',
    audioUpload: 'Envoi de fichier audio',
    youtube: 'Vidéo YouTube',
    youtubeEmbed: 'Lien YouTube',
    table: 'Tableau',
    horizontalRule: 'Séparateur',
  } as Record<string, string>,
  transformInto: 'Transformer en',
  resetFormatting: 'Réinitialiser le formatage',
  clearTable: 'Vider le tableau',
  duplicate: 'Dupliquer',
  copyToClipboard: 'Copier dans le presse-papiers',
  moveUp: 'Monter',
  moveDown: 'Descendre',
  delete: 'Supprimer',
}

export const notionToolbarText = {
  undo: 'Annuler',
  redo: 'Rétablir',
  insertDateTime: 'Insérer date/heure',
  dateTime: 'Date/heure',
  sourceCode: 'Code source',
  viewSourceCode: 'Voir le code source',
  transformInto: 'Transformer en',
  bold: 'Gras',
  italic: 'Italique',
  underline: 'Souligné',
  strikethrough: 'Barré',
  code: 'Code',
  download: 'Télécharger',
  replace: 'Remplacer',
  delete: 'Supprimer',
  rowAbove: 'Ligne au-dessus',
  rowBelow: 'Ligne en dessous',
  columnBefore: 'Colonne avant',
  columnAfter: 'Colonne après',
  deleteRow: 'Supprimer la ligne',
  deleteColumn: 'Supprimer la colonne',
  deleteTable: 'Supprimer le tableau',
}
