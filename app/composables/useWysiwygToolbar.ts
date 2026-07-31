import type { EditorToolbarItem } from '@nuxt/ui'
import { wysiwygToolbarText } from '~/utils/i18n/wysiwyg-strings'
import type { WysiwygHandlers } from './useWysiwygHandlers'

type Item = EditorToolbarItem<WysiwygHandlers>

/**
 * Un item par clé du manifeste. Les clés qui ouvrent un panneau (lien, image,
 * couleurs, taille de police…) déclarent un `slot` : `WysiwygToolbar.vue` y
 * place le composant correspondant.
 */
const BUTTONS = {
  // history
  undo: { 'kind': 'undo', 'icon': 'i-tabler-arrow-back-up', 'tooltip': { text: wysiwygToolbarText.undo }, 'aria-label': wysiwygToolbarText.undo },
  redo: { 'kind': 'redo', 'icon': 'i-tabler-arrow-forward-up', 'tooltip': { text: wysiwygToolbarText.redo }, 'aria-label': wysiwygToolbarText.redo },

  // format
  bold: { 'kind': 'mark', 'mark': 'bold', 'icon': 'i-tabler-bold', 'tooltip': { text: wysiwygToolbarText.bold, kbds: ['meta', 'B'] }, 'aria-label': wysiwygToolbarText.bold },
  italic: { 'kind': 'mark', 'mark': 'italic', 'icon': 'i-tabler-italic', 'tooltip': { text: wysiwygToolbarText.italic, kbds: ['meta', 'I'] }, 'aria-label': wysiwygToolbarText.italic },
  underline: { 'kind': 'mark', 'mark': 'underline', 'icon': 'i-tabler-underline', 'tooltip': { text: wysiwygToolbarText.underline, kbds: ['meta', 'U'] }, 'aria-label': wysiwygToolbarText.underline },
  strikethrough: { 'kind': 'mark', 'mark': 'strike', 'icon': 'i-tabler-strikethrough', 'tooltip': { text: wysiwygToolbarText.strikethrough }, 'aria-label': wysiwygToolbarText.strikethrough },
  subscript: { 'kind': 'subscript', 'icon': 'i-tabler-subscript', 'tooltip': { text: wysiwygToolbarText.subscript }, 'aria-label': wysiwygToolbarText.subscript },
  superscript: { 'kind': 'superscript', 'icon': 'i-tabler-superscript', 'tooltip': { text: wysiwygToolbarText.superscript }, 'aria-label': wysiwygToolbarText.superscript },

  // style
  fontsize: { slot: 'fontSize', icon: 'i-tabler-text-size' },
  forecolor: { slot: 'foreColor', icon: 'i-tabler-text-color' },
  backcolor: { slot: 'backColor', icon: 'i-tabler-highlight' },

  // heading
  h1: { kind: 'heading', level: 1, icon: 'i-tabler-h-1', tooltip: { text: wysiwygToolbarText.heading1 }, label: wysiwygToolbarText.heading1 },
  h2: { kind: 'heading', level: 2, icon: 'i-tabler-h-2', tooltip: { text: wysiwygToolbarText.heading2 }, label: wysiwygToolbarText.heading2 },
  h3: { kind: 'heading', level: 3, icon: 'i-tabler-h-3', tooltip: { text: wysiwygToolbarText.heading3 }, label: wysiwygToolbarText.heading3 },
  h4: { kind: 'heading', level: 4, icon: 'i-tabler-h-4', tooltip: { text: wysiwygToolbarText.heading4 }, label: wysiwygToolbarText.heading4 },
  h5: { kind: 'heading', level: 5, icon: 'i-tabler-h-5', tooltip: { text: wysiwygToolbarText.heading5 }, label: wysiwygToolbarText.heading5 },
  h6: { kind: 'heading', level: 6, icon: 'i-tabler-h-6', tooltip: { text: wysiwygToolbarText.heading6 }, label: wysiwygToolbarText.heading6 },

  // align (regroupés dans un menu, cf. `popover: true` dans le manifeste)
  alignleft: { kind: 'textAlign', align: 'left', icon: 'i-tabler-align-left', label: wysiwygToolbarText.alignLeft },
  aligncenter: { kind: 'textAlign', align: 'center', icon: 'i-tabler-align-center', label: wysiwygToolbarText.alignCenter },
  alignright: { kind: 'textAlign', align: 'right', icon: 'i-tabler-align-right', label: wysiwygToolbarText.alignRight },
  alignjustify: { kind: 'textAlign', align: 'justify', icon: 'i-tabler-align-justified', label: wysiwygToolbarText.alignJustify },
  alignnone: { kind: 'unsetTextAlign', icon: 'i-tabler-align-left', label: wysiwygToolbarText.alignNone },

  // list
  numlist: { 'kind': 'orderedList', 'icon': 'i-tabler-list-numbers', 'tooltip': { text: wysiwygToolbarText.numberedList }, 'aria-label': wysiwygToolbarText.numberedList },
  bullist: { 'kind': 'bulletList', 'icon': 'i-tabler-list', 'tooltip': { text: wysiwygToolbarText.bulletList }, 'aria-label': wysiwygToolbarText.bulletList },
  indent: { 'kind': 'indent', 'icon': 'i-tabler-indent-increase', 'tooltip': { text: wysiwygToolbarText.indent }, 'aria-label': wysiwygToolbarText.indent },
  outdent: { 'kind': 'outdent', 'icon': 'i-tabler-indent-decrease', 'tooltip': { text: wysiwygToolbarText.outdent }, 'aria-label': wysiwygToolbarText.outdent },

  // block
  blockquote: { 'kind': 'blockquote', 'icon': 'i-tabler-quote', 'tooltip': { text: wysiwygToolbarText.blockquote }, 'aria-label': wysiwygToolbarText.blockquote },
  hr: { 'kind': 'horizontalRule', 'icon': 'i-tabler-minus', 'tooltip': { text: wysiwygToolbarText.horizontalRule }, 'aria-label': wysiwygToolbarText.horizontalRule },

  // insert
  customLink: { slot: 'link', icon: 'i-tabler-link' },
  unlink: { 'kind': 'unlink', 'icon': 'i-tabler-unlink', 'tooltip': { text: wysiwygToolbarText.unlink }, 'aria-label': wysiwygToolbarText.unlink },
  customImage: { slot: 'image', icon: 'i-tabler-photo' },
  customVideo: { slot: 'video', icon: 'i-tabler-video' },
  customAudio: { slot: 'audio', icon: 'i-tabler-music' },
  customYoutube: { slot: 'youtube', icon: 'i-tabler-brand-youtube' },
  emoji: { slot: 'emoji', icon: 'i-tabler-mood-smile' },
  table: { slot: 'table', icon: 'i-tabler-table' },
  insertdatetime: { slot: 'dateTime', icon: 'i-tabler-clock-plus' },

  // code
  customInlineCode: { 'kind': 'mark', 'mark': 'code', 'icon': 'i-tabler-code', 'tooltip': { text: wysiwygToolbarText.inlineCode }, 'aria-label': wysiwygToolbarText.inlineCode },
  customPre: { 'kind': 'codeBlock', 'icon': 'i-tabler-codeblock', 'tooltip': { text: wysiwygToolbarText.codeBlock }, 'aria-label': wysiwygToolbarText.codeBlock },

  // source
  code: { 'kind': 'sourceCode', 'icon': 'i-tabler-html', 'tooltip': { text: wysiwygToolbarText.sourceCode }, 'aria-label': wysiwygToolbarText.sourceCode },

  // clipboard
  cut: { 'kind': 'cut', 'icon': 'i-tabler-scissors', 'tooltip': { text: wysiwygToolbarText.cut }, 'aria-label': wysiwygToolbarText.cut },
  copy: { 'kind': 'copy', 'icon': 'i-tabler-copy', 'tooltip': { text: wysiwygToolbarText.copy }, 'aria-label': wysiwygToolbarText.copy },
  paste: { 'kind': 'paste', 'icon': 'i-tabler-clipboard', 'tooltip': { text: wysiwygToolbarText.paste }, 'aria-label': wysiwygToolbarText.paste },
  remove: { 'kind': 'deleteSelection', 'icon': 'i-tabler-trash', 'tooltip': { text: wysiwygToolbarText.remove }, 'aria-label': wysiwygToolbarText.remove },
  selectall: { 'kind': 'selectAll', 'icon': 'i-tabler-select-all', 'tooltip': { text: wysiwygToolbarText.selectAll }, 'aria-label': wysiwygToolbarText.selectAll },

  // tools
  removeformat: { 'kind': 'removeFormat', 'icon': 'i-tabler-clear-formatting', 'tooltip': { text: wysiwygToolbarText.removeFormat }, 'aria-label': wysiwygToolbarText.removeFormat },

  // view
  fullscreen: { 'kind': 'fullscreen', 'icon': 'i-tabler-maximize', 'tooltip': { text: wysiwygToolbarText.fullscreen }, 'aria-label': wysiwygToolbarText.fullscreen },
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
