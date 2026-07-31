<script setup lang="ts">
import type { EditorMentionMenuItem } from '@nuxt/ui'

useSeoMeta({
  title: 'Notion-like | OPA Editor',
})

const mentions: EditorMentionMenuItem[] = [
  { label: 'James Holden', avatar: { alt: 'James Holden' } },
  { label: 'Naomi Nagata', avatar: { alt: 'Naomi Nagata' } },
  { label: 'Amos Burton', avatar: { alt: 'Amos Burton' } },
]

// Branchement du stockage. Décommentez, adaptez à votre backend, puis passez
// `:on-upload="onUpload"` à l'éditeur ci-dessous. Sans ça, `useEditorUpload`
// retombe sur son bouchon : une URL d'objet locale, qui meurt avec l'onglet.
//
// La fonction reçoit indifféremment images, vidéos et fichiers audio — c'est à
// elle de discriminer sur `file.type` si le traitement diffère. Elle renvoie
// une URL, ou un `EditorUploadResult` pour renseigner aussi `alt` / `poster`.
//
// async function onUpload(file: File): Promise<EditorUploadResult> {
//   // Toute exception est rattrapée : son message s'affiche sous la zone de
//   // dépôt, à la place de la liste des formats acceptés.
//   if (file.size > 32 * 1024 * 1024) {
//     throw new Error('Fichier trop lourd (32 Mo maximum).')
//   }
//
//   const body = new FormData()
//   body.append('file', file)
//
//   const { url, poster } = await $fetch<{ url: string, poster?: string }>('/api/upload', {
//     method: 'POST',
//     body,
//   })
//
//   return {
//     src: url,
//     alt: file.name,
//     // L'image d'attente n'a de sens que pour une vidéo.
//     poster: file.type.startsWith('video/') ? poster : undefined,
//   }
// }

const content = ref(`<h1>Éditeur notion-like</h1>
<p>Un éditeur WYSIWYG sans barre d'outils permanente, construit avec <a href="https://tiptap.dev/">TipTap</a>, <a href="https://nuxt.com/">Nuxt</a> et <a href="https://ui.nuxt.com/">Nuxt UI</a>.</p>
<blockquote><p>Sélectionnez du texte pour faire apparaître la barre flottante, ou tapez <code>/</code> n'importe où.</p></blockquote>
<hr>
<h2>Mise en forme</h2>
<p>Le texte accepte le <strong>gras</strong>, l'<em>italique</em>, le <u>souligné</u>, le <s>barré</s> et le <code>code inline</code>.</p>
<h3>Blocs de code</h3>
<p>La coloration syntaxique est assurée par <a href="https://github.com/shikijs/shiki">Shiki</a>.</p>
<pre><code class="language-vue">&lt;template&gt;
  &lt;UEditor v-slot="{ editor }" v-model="value" content-type="html"&gt;
    &lt;UEditorToolbar :editor="editor" :items="items" /&gt;
  &lt;/UEditor&gt;
&lt;/template&gt;</code></pre>
<h3>Listes</h3>
<ol><li><p>Les listes numérotées suivent l'ordre</p></li><li><p>La numérotation est automatique</p></li></ol>
<ul><li><p>Les listes à puces aussi</p><ul><li><p>Avec des niveaux imbriqués</p></li></ul></li></ul>
<ul data-type="taskList"><li data-checked="true" data-type="taskItem"><label><input type="checkbox" checked><span></span></label><div><p>Acheter des fraises</p></div></li><li data-checked="false" data-type="taskItem"><label><input type="checkbox"><span></span></label><div><p>Préparer un délicieux dessert</p></div></li></ul>
<h3>Tableaux</h3>
<table><tbody><tr><th><p>Fonctionnalité</p></th><th><p>Description</p></th><th><p>État</p></th></tr><tr><td><p>Tableaux</p></td><td><p>Lignes, colonnes et sélection de cellules</p></td><td><p>✅</p></td></tr><tr><td><p>HTML</p></td><td><p>Sérialisation du contenu</p></td><td><p>✅</p></td></tr></tbody></table>
<hr>
<h2>Médias</h2>
<div data-type="image-upload"></div>
<div data-type="video-upload"></div>
<div data-type="audio-upload"></div>
<div data-type="youtube-embed"></div>
<p>Mentionnez quelqu'un avec <code>@</code>, et piochez un émoji dans la barre d'outils ou via <code>/</code> 🚀</p>`)
</script>

<template>
  <div>
    <AppHeader />

    <UMain>
      <NotionEditor
        v-model="content"
        :mentions="mentions"
      />
    </UMain>
  </div>
</template>
