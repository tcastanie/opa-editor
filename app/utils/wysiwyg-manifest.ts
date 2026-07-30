/**
 * Transcription du manifeste `wysiwyg-manifest.yaml` (Directus -> TipTap).
 *
 * Ce fichier ne contient que des **données** : les groupes, leur priorité et
 * leur épinglage, les listes de polices et les formats personnalisés. La
 * construction des items de barre d'outils vit dans `useWysiwygToolbar`.
 */

export type WysiwygButtonKey
  = | 'undo' | 'redo'
    | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'subscript' | 'superscript'
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'styles'
    | 'alignleft' | 'aligncenter' | 'alignright' | 'alignjustify' | 'alignnone'
    | 'ltr' | 'rtl'
    | 'numlist' | 'bullist' | 'indent' | 'outdent'
    | 'fontfamily' | 'fontsize' | 'forecolor' | 'backcolor'
    | 'blockquote' | 'hr'
    | 'customLink' | 'unlink' | 'customImage' | 'customMedia' | 'table' | 'pagebreak' | 'insertdatetime'
    | 'customInlineCode' | 'code' | 'customPre'
    | 'cut' | 'copy' | 'paste' | 'remove' | 'selectall'
    | 'removeformat'
    | 'visualaid' | 'fullscreen'

export interface WysiwygToolbarGroup {
  id: string
  priority: number
  pinned?: boolean
  /** Le groupe se replie derrière un seul bouton à menu. */
  popover?: boolean
  icon?: string
  label?: string
  keys: WysiwygButtonKey[]
}

/** Groupes du manifeste, déjà triés par priorité décroissante. */
export const wysiwygToolbarGroups: WysiwygToolbarGroup[] = [
  { id: 'history', priority: 100, pinned: true, keys: ['undo', 'redo'] },
  { id: 'format', priority: 90, pinned: true, keys: ['bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript'] },
  { id: 'style', priority: 70, pinned: true, keys: ['fontfamily', 'fontsize', 'forecolor', 'backcolor'] },
  { id: 'customFormats', priority: 68, keys: ['styles'] },
  // { id: 'heading', priority: 62, keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  { id: 'heading', priority: 62, pinned: true, popover: true, icon: 'i-tabler-heading', label: 'Titres', keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  { id: 'align', priority: 60, pinned: true, popover: true, icon: 'i-tabler-align-left', label: 'Alignement', keys: ['alignleft', 'aligncenter', 'alignright', 'alignjustify', 'alignnone'] },
  { id: 'block', priority: 60, keys: ['blockquote', 'hr'] },
  { id: 'direction', priority: 58, keys: ['ltr', 'rtl'] },
  { id: 'list', priority: 55, pinned: true, keys: ['numlist', 'bullist', 'indent', 'outdent'] },
  { id: 'insert', priority: 50, keys: ['customLink', 'unlink', 'customImage', 'customMedia', 'table', 'pagebreak', 'insertdatetime'] },
  { id: 'code', priority: 40, keys: ['customInlineCode', 'customPre'] },
  { id: 'source', priority: 35, keys: ['code'] },
  { id: 'clipboard', priority: 30, keys: ['cut', 'copy', 'paste', 'remove', 'selectall'] },
  { id: 'tools', priority: 20, keys: ['removeformat'] },
  { id: 'view', priority: 10, pinned: true, keys: ['visualaid', 'fullscreen'] },
]

/** Jeu de boutons minimal proposé par le manifeste (`toolbarDefault`). */
export const wysiwygToolbarDefault: WysiwygButtonKey[] = [
  'bold', 'italic', 'underline',
  'h1', 'h2', 'h3',
  'numlist', 'bullist',
  'removeformat',
  'blockquote',
  'customLink', 'customImage', 'customMedia',
  'hr', 'code', 'fullscreen',
]

/** Tous les boutons du manifeste, dans l'ordre des groupes. */
export const wysiwygToolbarAll: WysiwygButtonKey[] = wysiwygToolbarGroups.flatMap(group => group.keys)

export interface FontOption {
  label: string
  value: string | null
}

export const fontFamilies: FontOption[] = [
  { label: 'Par défaut', value: null },
  { label: 'Andale Mono', value: '\'Andale Mono\', monospace' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Arial Black', value: '\'Arial Black\', sans-serif' },
  { label: 'Book Antiqua', value: '\'Book Antiqua\', Palatino, serif' },
  { label: 'Comic Sans MS', value: '\'Comic Sans MS\', sans-serif' },
  { label: 'Courier New', value: '\'Courier New\', Courier, monospace' },
  { label: 'Georgia', value: 'Georgia, Palatino, serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Impact', value: 'Impact, sans-serif' },
  { label: 'Symbol', value: 'Symbol' },
  { label: 'Tahoma', value: 'Tahoma, Arial, Helvetica, sans-serif' },
  { label: 'Terminal', value: 'Terminal, Monaco, monospace' },
  { label: 'Times New Roman', value: '\'Times New Roman\', Times, serif' },
  { label: 'Trebuchet MS', value: '\'Trebuchet MS\', Geneva, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Webdings', value: 'Webdings' },
  { label: 'Wingdings', value: '\'Wingdings\', \'Zapf Dingbats\'' },
]

export const fontSizes: FontOption[] = [
  { label: 'Par défaut', value: null },
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: '16px' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '30', value: '30px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
]

/**
 * Dans Directus, `customFormats` est injecté par la configuration du champ.
 * Hors Directus il n'y a rien à injecter, donc voici un jeu de démonstration :
 * chaque entrée applique une classe CSS au bloc courant (voir `main.css`).
 */
export interface CustomFormat {
  label: string
  className: string
  description?: string
}

export const customFormats: CustomFormat[] = [
  { label: 'Chapô', className: 'format-lead', description: 'Paragraphe d\'introduction' },
  { label: 'Note', className: 'format-note', description: 'Encadré d\'information' },
  { label: 'Avertissement', className: 'format-warning', description: 'Encadré d\'alerte' },
  { label: 'Petit texte', className: 'format-small', description: 'Mentions légales' },
]

/** Largeurs fixes reprises du manifeste, pour éviter que la barre ne saute. */
export const wysiwygWidths = {
  caretButton: 40,
  fontFamilyDropdown: 132,
  fontSizeDropdown: 80,
  customFormatsDropdown: 132,
} as const

/** Formats proposés par le bouton `insertdatetime`. */
export const dateTimeFormats = [
  { label: 'Date courte', format: (d: Date) => d.toLocaleDateString('fr-FR') },
  { label: 'Date longue', format: (d: Date) => d.toLocaleDateString('fr-FR', { dateStyle: 'full' }) },
  { label: 'Heure', format: (d: Date) => d.toLocaleTimeString('fr-FR', { timeStyle: 'short' }) },
  { label: 'Date et heure', format: (d: Date) => d.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) },
  { label: 'ISO 8601', format: (d: Date) => d.toISOString() },
] as const
