/**
 * Ce fichier ne contient que des **données** : les groupes, leur priorité et
 * leur épinglage, et les tailles de police. La construction des items de barre
 * d'outils vit dans `useWysiwygToolbar` ; les formats de date, partagés avec
 * l'éditeur notion, vivent dans `app/utils/date-time.ts`.
 */

export type WysiwygButtonKey
  = | 'undo' | 'redo'
    | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'subscript' | 'superscript'
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    | 'alignleft' | 'aligncenter' | 'alignright' | 'alignjustify' | 'alignnone'
    | 'numlist' | 'bullist' | 'indent' | 'outdent'
    | 'fontsize' | 'forecolor' | 'backcolor'
    | 'blockquote' | 'hr'
    | 'customLink' | 'unlink' | 'customImage' | 'customVideo' | 'customAudio' | 'table' | 'insertdatetime'
    | 'customInlineCode' | 'code' | 'customPre'
    | 'cut' | 'copy' | 'paste' | 'remove' | 'selectall'
    | 'removeformat'
    | 'fullscreen'

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
  { id: 'style', priority: 70, pinned: true, keys: ['fontsize', 'forecolor', 'backcolor'] },
  // { id: 'heading', priority: 62, keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  { id: 'heading', priority: 62, pinned: true, popover: true, icon: 'i-tabler-heading', label: 'Titres', keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  { id: 'align', priority: 60, pinned: true, popover: true, icon: 'i-tabler-align-left', label: 'Alignement', keys: ['alignleft', 'aligncenter', 'alignright', 'alignjustify', 'alignnone'] },
  { id: 'block', priority: 60, keys: ['blockquote', 'hr'] },
  { id: 'list', priority: 55, pinned: true, keys: ['numlist', 'bullist', 'indent', 'outdent'] },
  { id: 'insert', priority: 50, keys: ['customLink', 'unlink', 'customImage', 'customVideo', 'customAudio', 'table', 'insertdatetime'] },
  { id: 'code', priority: 40, keys: ['customInlineCode', 'customPre'] },
  { id: 'source', priority: 35, keys: ['code'] },
  { id: 'clipboard', priority: 30, keys: ['cut', 'copy', 'paste', 'remove', 'selectall'] },
  { id: 'tools', priority: 20, keys: ['removeformat'] },
  { id: 'view', priority: 10, pinned: true, keys: ['fullscreen'] },
]

/** Jeu de boutons minimal proposé par le manifeste (`toolbarDefault`). */
export const wysiwygToolbarDefault: WysiwygButtonKey[] = [
  'bold', 'italic', 'underline',
  'h1', 'h2', 'h3',
  'numlist', 'bullist',
  'removeformat',
  'blockquote',
  'customLink', 'customImage',
  'hr', 'code', 'fullscreen',
]

/** Tous les boutons du manifeste, dans l'ordre des groupes. */
export const wysiwygToolbarAll: WysiwygButtonKey[] = wysiwygToolbarGroups.flatMap(group => group.keys)

export interface FontOption {
  label: string
  value: string | null
  description?: string
}

export const fontSizes: FontOption[] = [
  { label: '12', value: '12px' },
  { label: '14', value: '14px' },
  { label: '16', value: null, description: 'Par défaut' },
  { label: '18', value: '18px' },
  { label: '24', value: '24px' },
  { label: '30', value: '30px' },
  { label: '36', value: '36px' },
  { label: '48', value: '48px' },
]
