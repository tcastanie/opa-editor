<script setup lang="ts">
useSeoMeta({
  title: 'WYSIWYG | OPA Editor',
})

const presets = [
  { label: 'Basique', value: 'default', description: `${wysiwygToolbarDefault.length} boutons` },
  { label: 'Complet', value: 'all', description: `${wysiwygToolbarAll.length} boutons` },
]

const preset = ref<'all' | 'default'>('all')

const toolbarKeys = computed(() => preset.value === 'all' ? wysiwygToolbarAll : wysiwygToolbarDefault)

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

const content = ref(`<h1>Éditeur WYSIWYG</h1>
<p>Une barre d'outils classique au-dessus de la zone de texte.</p>
<p>Le texte accepte le <strong>gras</strong>, l'<em>italique</em>, le <u>souligné</u>, le <s>barré</s>, l'<sub>indice</sub> et l'<sup>exposant</sup>.</p>
<p style="text-align: center"><span style="font-size: 24px; color: #0891b2">Le corps et la couleur sont pilotés par la marque <code>textStyle</code>.</span></p>
<h2>Tableaux</h2>
<table><tbody><tr><th><p>Groupe</p></th><th><p>Priorité</p></th><th><p>Épinglé</p></th></tr><tr><td><p>history</p></td><td><p>100</p></td><td><p>oui</p></td></tr><tr><td><p>format</p></td><td><p>90</p></td><td><p>oui</p></td></tr><tr><td><p>style</p></td><td><p>70</p></td><td><p>oui</p></td></tr></tbody></table>
<hr>
<p>Le bouton « Code source » montre le HTML <em>après</em> passage dans le schéma TipTap.</p>`)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader>
      <USelectMenu
        v-model="preset"
        :items="presets"
        value-key="value"
        size="sm"
        class="w-32"
        :search-input="false"
      />
    </AppHeader>

    <UMain class="flex-1">
      <UContainer class="py-6">
        <WysiwygEditor
          v-model="content"
          :toolbar-keys="toolbarKeys"
        />
      </UContainer>
    </UMain>
  </div>
</template>
