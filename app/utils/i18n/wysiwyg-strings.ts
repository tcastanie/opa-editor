/**
 * Textes propres au template WYSIWYG (`useWysiwyg*`, `Wysiwyg*.vue`).
 * Les libellés partagés avec le template notion vivent dans `editor-strings.ts`.
 */

/** Un par clé de `WysiwygButtonKey` utilisée dans `useWysiwygToolbar.ts`. */
export const wysiwygToolbarText = {
  undo: 'Annuler',
  redo: 'Rétablir',
  bold: 'Gras',
  italic: 'Italique',
  underline: 'Souligné',
  strikethrough: 'Barré',
  subscript: 'Indice',
  superscript: 'Exposant',
  heading1: 'Titre 1',
  heading2: 'Titre 2',
  heading3: 'Titre 3',
  heading4: 'Titre 4',
  heading5: 'Titre 5',
  heading6: 'Titre 6',
  alignLeft: 'Aligner à gauche',
  alignCenter: 'Centrer',
  alignRight: 'Aligner à droite',
  alignJustify: 'Justifier',
  alignNone: 'Aucun alignement',
  numberedList: 'Liste numérotée',
  bulletList: 'Liste à puces',
  indent: 'Augmenter le retrait',
  outdent: 'Diminuer le retrait',
  blockquote: 'Citation',
  horizontalRule: 'Ligne horizontale',
  unlink: 'Supprimer le lien',
  inlineCode: 'Code inline',
  codeBlock: 'Bloc de code',
  sourceCode: 'Code source',
  cut: 'Couper',
  copy: 'Copier',
  paste: 'Coller',
  remove: 'Supprimer',
  selectAll: 'Tout sélectionner',
  removeFormat: 'Supprimer le formatage',
  fullscreen: 'Plein écran',
  headingGroup: 'Titres',
  alignGroup: 'Alignement',
}

export const wysiwygHandlersText = {
  clipboardUnavailableTitle: 'Presse-papiers indisponible',
  clipboardUnavailableDescription: 'Le navigateur a refusé l\'accès. Utilisez les raccourcis clavier (Ctrl/⌘ + X, C, V).',
}

export const wysiwygColorMenuText = {
  textColorLabel: 'Couleur du texte',
  backgroundColorLabel: 'Couleur de fond',
  customLabel: 'Personnalisée',
  noneLabel: 'Aucune',
}

export const wysiwygDateTimeText = {
  insertDateTime: 'Insérer date/heure',
}

export const wysiwygFontSizeText = {
  label: 'Taille de police',
  default: 'Par défaut',
}

export const wysiwygLinkPopoverText = {
  insertTooltip: 'Insérer un lien',
}

export const wysiwygMediaPopoverText = {
  optionalHint: 'Optionnel',
}

/** Réutilisés par `WysiwygTableMenu.vue` et la barre flottante des tableaux de `WysiwygEditor.vue`. */
export const wysiwygTableText = {
  tableTooltip: 'Tableau',
  insertTable: 'Insérer un tableau 3×3',
  rowAbove: 'Ligne au-dessus',
  rowBelow: 'Ligne en dessous',
  columnBefore: 'Colonne avant',
  columnAfter: 'Colonne après',
  toggleHeaderRow: 'Basculer la ligne d\'en-tête',
  toggleHeaderColumn: 'Basculer la colonne d\'en-tête',
  mergeCells: 'Fusionner les cellules',
  splitCell: 'Scinder la cellule',
  deleteRow: 'Supprimer la ligne',
  deleteColumn: 'Supprimer la colonne',
  deleteTable: 'Supprimer le tableau',
}

export const wysiwygEditorText = {
  placeholder: 'Rédigez votre contenu…',
  alignLeft: 'Aligner à gauche',
  alignCenter: 'Centrer',
  alignRight: 'Aligner à droite',
  delete: 'Supprimer',
  wordsCount: (n: number) => `${n} mot${n > 1 ? 's' : ''}`,
  charactersCount: (n: number) => `${n} caractère${n > 1 ? 's' : ''}`,
  exitFullscreen: 'pour quitter le plein écran',
}
