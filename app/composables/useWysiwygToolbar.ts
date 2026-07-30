import type { EditorToolbarItem } from '@nuxt/ui'
import type { WysiwygHandlers } from './useWysiwygHandlers'

type Item = EditorToolbarItem<WysiwygHandlers>

/**
 * Un item par clé du manifeste. Les clés qui ouvrent un panneau (lien, image,
 * média, couleurs, polices…) déclarent un `slot` : `WysiwygToolbar.vue` y place
 * le composant correspondant.
 */
const BUTTONS = {
  // history
  undo: { 'kind': 'undo', 'icon': 'i-lucide-undo', 'tooltip': { text: 'Annuler' }, 'aria-label': 'Annuler' },
  redo: { 'kind': 'redo', 'icon': 'i-lucide-redo', 'tooltip': { text: 'Rétablir' }, 'aria-label': 'Rétablir' },

  // format
  bold: { 'kind': 'mark', 'mark': 'bold', 'icon': 'i-lucide-bold', 'tooltip': { text: 'Gras', kbds: ['meta', 'B'] }, 'aria-label': 'Gras' },
  italic: { 'kind': 'mark', 'mark': 'italic', 'icon': 'i-lucide-italic', 'tooltip': { text: 'Italique', kbds: ['meta', 'I'] }, 'aria-label': 'Italique' },
  underline: { 'kind': 'mark', 'mark': 'underline', 'icon': 'i-lucide-underline', 'tooltip': { text: 'Souligné', kbds: ['meta', 'U'] }, 'aria-label': 'Souligné' },
  strikethrough: { 'kind': 'mark', 'mark': 'strike', 'icon': 'i-lucide-strikethrough', 'tooltip': { text: 'Barré' }, 'aria-label': 'Barré' },
  subscript: { 'kind': 'subscript', 'icon': 'i-lucide-subscript', 'tooltip': { text: 'Indice' }, 'aria-label': 'Indice' },
  superscript: { 'kind': 'superscript', 'icon': 'i-lucide-superscript', 'tooltip': { text: 'Exposant' }, 'aria-label': 'Exposant' },

  // style
  fontfamily: { slot: 'fontFamily', icon: 'i-lucide-type' },
  fontsize: { slot: 'fontSize', icon: 'i-lucide-a-large-small' },
  forecolor: { slot: 'foreColor', icon: 'i-lucide-baseline' },
  backcolor: { slot: 'backColor', icon: 'i-lucide-highlighter' },

  // customFormats
  styles: { slot: 'styles', icon: 'i-lucide-paintbrush' },

  // heading
  h1: { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', tooltip: { text: 'Titre 1' }, label: 'Titre 1' },
  h2: { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'Titre 2' }, label: 'Titre 2' },
  h3: { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', tooltip: { text: 'Titre 3' }, label: 'Titre 3' },
  h4: { kind: 'heading', level: 4, icon: 'i-lucide-heading-4', tooltip: { text: 'Titre 4' }, label: 'Titre 4' },
  h5: { kind: 'heading', level: 5, icon: 'i-lucide-heading-5', tooltip: { text: 'Titre 5' }, label: 'Titre 5' },
  h6: { kind: 'heading', level: 6, icon: 'i-lucide-heading-6', tooltip: { text: 'Titre 6' }, label: 'Titre 6' },

  // align (regroupés dans un menu, cf. `popover: true` dans le manifeste)
  alignleft: { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left', label: 'Aligner à gauche' },
  aligncenter: { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center', label: 'Centrer' },
  alignright: { kind: 'textAlign', align: 'right', icon: 'i-lucide-align-right', label: 'Aligner à droite' },
  alignjustify: { kind: 'textAlign', align: 'justify', icon: 'i-lucide-align-justify', label: 'Justifier' },
  alignnone: { kind: 'unsetTextAlign', icon: 'i-lucide-align-left', label: 'Aucun alignement' },

  // direction
  ltr: { 'kind': 'direction', 'direction': 'ltr', 'icon': 'i-lucide-pilcrow-right', 'tooltip': { text: 'Gauche → Droite' }, 'aria-label': 'Gauche vers droite' },
  rtl: { 'kind': 'direction', 'direction': 'rtl', 'icon': 'i-lucide-pilcrow-left', 'tooltip': { text: 'Droite → Gauche' }, 'aria-label': 'Droite vers gauche' },

  // list
  numlist: { 'kind': 'orderedList', 'icon': 'i-lucide-list-ordered', 'tooltip': { text: 'Liste numérotée' }, 'aria-label': 'Liste numérotée' },
  bullist: { 'kind': 'bulletList', 'icon': 'i-lucide-list', 'tooltip': { text: 'Liste à puces' }, 'aria-label': 'Liste à puces' },
  indent: { 'kind': 'indent', 'icon': 'i-lucide-indent-increase', 'tooltip': { text: 'Augmenter le retrait' }, 'aria-label': 'Augmenter le retrait' },
  outdent: { 'kind': 'outdent', 'icon': 'i-lucide-indent-decrease', 'tooltip': { text: 'Diminuer le retrait' }, 'aria-label': 'Diminuer le retrait' },

  // block
  blockquote: { 'kind': 'blockquote', 'icon': 'i-lucide-quote', 'tooltip': { text: 'Citation' }, 'aria-label': 'Citation' },
  hr: { 'kind': 'horizontalRule', 'icon': 'i-lucide-minus', 'tooltip': { text: 'Ligne horizontale' }, 'aria-label': 'Ligne horizontale' },

  // insert
  customLink: { slot: 'link', icon: 'i-lucide-link' },
  unlink: { 'kind': 'unlink', 'icon': 'i-lucide-link-2-off', 'tooltip': { text: 'Supprimer le lien' }, 'aria-label': 'Supprimer le lien' },
  customImage: { slot: 'image', icon: 'i-lucide-image' },
  customMedia: { slot: 'media', icon: 'i-lucide-film' },
  table: { slot: 'table', icon: 'i-lucide-table' },
  pagebreak: { 'kind': 'pageBreak', 'icon': 'i-lucide-separator-horizontal', 'tooltip': { text: 'Saut de page' }, 'aria-label': 'Saut de page' },
  insertdatetime: { slot: 'dateTime', icon: 'i-lucide-clock-plus' },

  // code
  customInlineCode: { 'kind': 'mark', 'mark': 'code', 'icon': 'i-lucide-code', 'tooltip': { text: 'Code inline' }, 'aria-label': 'Code inline' },
  code: { 'kind': 'sourceCode', 'icon': 'i-lucide-code-xml', 'tooltip': { text: 'Code source' }, 'aria-label': 'Code source' },
  customPre: { 'kind': 'codeBlock', 'icon': 'i-lucide-square-code', 'tooltip': { text: 'Bloc de code' }, 'aria-label': 'Bloc de code' },

  // clipboard
  cut: { 'kind': 'cut', 'icon': 'i-lucide-scissors', 'tooltip': { text: 'Couper' }, 'aria-label': 'Couper' },
  copy: { 'kind': 'copy', 'icon': 'i-lucide-copy', 'tooltip': { text: 'Copier' }, 'aria-label': 'Copier' },
  paste: { 'kind': 'paste', 'icon': 'i-lucide-clipboard', 'tooltip': { text: 'Coller' }, 'aria-label': 'Coller' },
  remove: { 'kind': 'deleteSelection', 'icon': 'i-lucide-trash-2', 'tooltip': { text: 'Supprimer' }, 'aria-label': 'Supprimer' },
  selectall: { 'kind': 'selectAll', 'icon': 'i-lucide-text-select', 'tooltip': { text: 'Tout sélectionner' }, 'aria-label': 'Tout sélectionner' },

  // tools
  removeformat: { 'kind': 'removeFormat', 'icon': 'i-lucide-remove-formatting', 'tooltip': { text: 'Supprimer le formatage' }, 'aria-label': 'Supprimer le formatage' },

  // view
  visualaid: { 'kind': 'visualAid', 'icon': 'i-lucide-grid-2x2', 'tooltip': { text: 'Aides visuelles' }, 'aria-label': 'Aides visuelles' },
  fullscreen: { 'kind': 'fullscreen', 'icon': 'i-lucide-maximize', 'tooltip': { text: 'Plein écran' }, 'aria-label': 'Plein écran' },
} as Record<WysiwygButtonKey, Item>

/**
 * Assemble les items de la barre d'outils à partir d'une liste de clés du
 * manifeste. Les groupes conservent leur ordre de priorité ; un groupe vide
 * disparaît, et un groupe `popover` se replie derrière un bouton unique.
 */
export function useWysiwygToolbar(keys: MaybeRefOrGetter<WysiwygButtonKey[]> = wysiwygToolbarAll) {
  const toolbarItems = computed<Item[][]>(() => {
    const enabled = new Set(toValue(keys))

    return wysiwygToolbarGroups
      .map((group) => {
        const items = group.keys.filter(key => enabled.has(key)).map(key => BUTTONS[key])

        if (!items.length) {
          return null
        }

        if (group.popover) {
          return [{
            'icon': group.icon,
            'tooltip': { text: group.label },
            'aria-label': group.label,
            'content': { align: 'start' as const },
            'items': [items],
          }] as Item[]
        }

        return items
      })
      .filter((group): group is Item[] => group !== null)
  })

  return { toolbarItems }
}
