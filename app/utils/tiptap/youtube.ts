import Youtube from '@tiptap/extension-youtube'

/**
 * `customYoutube` du manifeste, partagé par les deux templates pour que la même
 * URL produise la même iframe des deux côtés.
 *
 * Les dimensions ne servent qu'aux attributs `width` / `height` du HTML
 * sérialisé : dans l'éditeur, la feuille de style les rend fluides (16/9).
 */
export const CustomYoutube = Youtube.configure({
  width: 640,
  height: 360,
  nocookie: true,
})
