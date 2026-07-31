import type { EditorToolbarItem } from '@nuxt/ui'
import type { WysiwygHandlers } from './useWysiwygHandlers'

type Item = EditorToolbarItem<WysiwygHandlers>

/**
 * Un item par clé du manifeste. Les clés qui ouvrent un panneau (lien, image,
 * couleurs, taille de police…) déclarent un `slot` : `WysiwygToolbar.vue` y
 * place le composant correspondant.
 */
const BUTTONS = {
  // history
  undo: { 'kind': 'undo', 'icon': 'i-tabler-arrow-back-up', 'tooltip': { text: 'Annuler' }, 'aria-label': 'Annuler' },
  redo: { 'kind': 'redo', 'icon': 'i-tabler-arrow-forward-up', 'tooltip': { text: 'Rétablir' }, 'aria-label': 'Rétablir' },

  // format
  bold: { 'kind': 'mark', 'mark': 'bold', 'icon': 'i-tabler-bold', 'tooltip': { text: 'Gras', kbds: ['meta', 'B'] }, 'aria-label': 'Gras' },
  italic: { 'kind': 'mark', 'mark': 'italic', 'icon': 'i-tabler-italic', 'tooltip': { text: 'Italique', kbds: ['meta', 'I'] }, 'aria-label': 'Italique' },
  underline: { 'kind': 'mark', 'mark': 'underline', 'icon': 'i-tabler-underline', 'tooltip': { text: 'Souligné', kbds: ['meta', 'U'] }, 'aria-label': 'Souligné' },
  strikethrough: { 'kind': 'mark', 'mark': 'strike', 'icon': 'i-tabler-strikethrough', 'tooltip': { text: 'Barré' }, 'aria-label': 'Barré' },
  subscript: { 'kind': 'subscript', 'icon': 'i-tabler-subscript', 'tooltip': { text: 'Indice' }, 'aria-label': 'Indice' },
  superscript: { 'kind': 'superscript', 'icon': 'i-tabler-superscript', 'tooltip': { text: 'Exposant' }, 'aria-label': 'Exposant' },

  // style
  fontsize: { slot: 'fontSize', icon: 'i-tabler-text-size' },
  forecolor: { slot: 'foreColor', icon: 'i-tabler-text-color' },
  backcolor: { slot: 'backColor', icon: 'i-tabler-highlight' },

  // heading
  h1: { kind: 'heading', level: 1, icon: 'i-tabler-h-1', tooltip: { text: 'Titre 1' }, label: 'Titre 1' },
  h2: { kind: 'heading', level: 2, icon: 'i-tabler-h-2', tooltip: { text: 'Titre 2' }, label: 'Titre 2' },
  h3: { kind: 'heading', level: 3, icon: 'i-tabler-h-3', tooltip: { text: 'Titre 3' }, label: 'Titre 3' },
  h4: { kind: 'heading', level: 4, icon: 'i-tabler-h-4', tooltip: { text: 'Titre 4' }, label: 'Titre 4' },
  h5: { kind: 'heading', level: 5, icon: 'i-tabler-h-5', tooltip: { text: 'Titre 5' }, label: 'Titre 5' },
  h6: { kind: 'heading', level: 6, icon: 'i-tabler-h-6', tooltip: { text: 'Titre 6' }, label: 'Titre 6' },

  // align (regroupés dans un menu, cf. `popover: true` dans le manifeste)
  alignleft: { kind: 'textAlign', align: 'left', icon: 'i-tabler-align-left', label: 'Aligner à gauche' },
  aligncenter: { kind: 'textAlign', align: 'center', icon: 'i-tabler-align-center', label: 'Centrer' },
  alignright: { kind: 'textAlign', align: 'right', icon: 'i-tabler-align-right', label: 'Aligner à droite' },
  alignjustify: { kind: 'textAlign', align: 'justify', icon: 'i-tabler-align-justified', label: 'Justifier' },
  alignnone: { kind: 'unsetTextAlign', icon: 'i-tabler-align-left', label: 'Aucun alignement' },

  // list
  numlist: { 'kind': 'orderedList', 'icon': 'i-tabler-list-numbers', 'tooltip': { text: 'Liste numérotée' }, 'aria-label': 'Liste numérotée' },
  bullist: { 'kind': 'bulletList', 'icon': 'i-tabler-list', 'tooltip': { text: 'Liste à puces' }, 'aria-label': 'Liste à puces' },
  indent: { 'kind': 'indent', 'icon': 'i-tabler-indent-increase', 'tooltip': { text: 'Augmenter le retrait' }, 'aria-label': 'Augmenter le retrait' },
  outdent: { 'kind': 'outdent', 'icon': 'i-tabler-indent-decrease', 'tooltip': { text: 'Diminuer le retrait' }, 'aria-label': 'Diminuer le retrait' },

  // block
  blockquote: { 'kind': 'blockquote', 'icon': 'i-tabler-quote', 'tooltip': { text: 'Citation' }, 'aria-label': 'Citation' },
  hr: { 'kind': 'horizontalRule', 'icon': 'i-tabler-minus', 'tooltip': { text: 'Ligne horizontale' }, 'aria-label': 'Ligne horizontale' },

  // insert
  customLink: { slot: 'link', icon: 'i-tabler-link' },
  unlink: { 'kind': 'unlink', 'icon': 'i-tabler-unlink', 'tooltip': { text: 'Supprimer le lien' }, 'aria-label': 'Supprimer le lien' },
  customImage: { slot: 'image', icon: 'i-tabler-photo' },
  customVideo: { slot: 'video', icon: 'i-tabler-video' },
  customAudio: { slot: 'audio', icon: 'i-tabler-music' },
  customYoutube: { slot: 'youtube', icon: 'i-tabler-brand-youtube' },
  emoji: { slot: 'emoji', icon: 'i-tabler-mood-smile' },
  table: { slot: 'table', icon: 'i-tabler-table' },
  insertdatetime: { slot: 'dateTime', icon: 'i-tabler-clock-plus' },

  // code
  customInlineCode: { 'kind': 'mark', 'mark': 'code', 'icon': 'i-tabler-code', 'tooltip': { text: 'Code inline' }, 'aria-label': 'Code inline' },
  customPre: { 'kind': 'codeBlock', 'icon': 'i-tabler-codeblock', 'tooltip': { text: 'Bloc de code' }, 'aria-label': 'Bloc de code' },

  // source
  code: { 'kind': 'sourceCode', 'icon': 'i-tabler-html', 'tooltip': { text: 'Code source' }, 'aria-label': 'Code source' },

  // clipboard
  cut: { 'kind': 'cut', 'icon': 'i-tabler-scissors', 'tooltip': { text: 'Couper' }, 'aria-label': 'Couper' },
  copy: { 'kind': 'copy', 'icon': 'i-tabler-copy', 'tooltip': { text: 'Copier' }, 'aria-label': 'Copier' },
  paste: { 'kind': 'paste', 'icon': 'i-tabler-clipboard', 'tooltip': { text: 'Coller' }, 'aria-label': 'Coller' },
  remove: { 'kind': 'deleteSelection', 'icon': 'i-tabler-trash', 'tooltip': { text: 'Supprimer' }, 'aria-label': 'Supprimer' },
  selectall: { 'kind': 'selectAll', 'icon': 'i-tabler-select-all', 'tooltip': { text: 'Tout sélectionner' }, 'aria-label': 'Tout sélectionner' },

  // tools
  removeformat: { 'kind': 'removeFormat', 'icon': 'i-tabler-clear-formatting', 'tooltip': { text: 'Supprimer le formatage' }, 'aria-label': 'Supprimer le formatage' },

  // view
  fullscreen: { 'kind': 'fullscreen', 'icon': 'i-tabler-maximize', 'tooltip': { text: 'Plein écran' }, 'aria-label': 'Plein écran' },
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
