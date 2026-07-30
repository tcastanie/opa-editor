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

const content = ref(`<h1>Éditeur WYSIWYG</h1>
<p class="format-lead">Une barre d'outils classique au-dessus de la zone de texte, transposée depuis le manifeste Directus → TipTap.</p>
<p>Le texte accepte le <strong>gras</strong>, l'<em>italique</em>, le <u>souligné</u>, le <s>barré</s>, l'<sub>indice</sub> et l'<sup>exposant</sup>.</p>
<p style="text-align: center"><span style="font-family: Georgia, Palatino, serif; font-size: 24px; color: #0891b2">Police, corps et couleur sont pilotés par la marque <code>textStyle</code>.</span></p>
<h2>Formats personnalisés</h2>
<p class="format-note">Dans Directus, la liste des styles vient de la configuration du champ. Ici, chaque format applique une classe CSS au bloc — ce qui n'est possible que parce que l'extension <code>PreservedAttributes</code> conserve l'attribut <code>class</code> en HTML.</p>
<p class="format-warning">Le bouton « Code source » montre le HTML <em>après</em> passage dans le schéma TipTap : tout ce qu'aucune extension ne déclare a déjà été écarté.</p>
<h2>Tableaux</h2>
<table><tbody><tr><th><p>Groupe</p></th><th><p>Priorité</p></th><th><p>Épinglé</p></th></tr><tr><td><p>history</p></td><td><p>100</p></td><td><p>oui</p></td></tr><tr><td><p>format</p></td><td><p>90</p></td><td><p>oui</p></td></tr><tr><td><p>style</p></td><td><p>70</p></td><td><p>oui</p></td></tr></tbody></table>
<h2>Direction du texte</h2>
<p dir="rtl">Ce paragraphe est en direction droite → gauche.</p>
<hr>
<p class="format-small">Activez les aides visuelles pour matérialiser les bordures de cellules et les sauts de page.</p>`)
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
