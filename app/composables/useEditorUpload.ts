import { editorUploadText } from '~/utils/i18n/editor-strings'

export interface EditorUploadResult {
  src: string
  alt?: string
  title?: string
  width?: string
  height?: string
  /** Vidéo uniquement : image d'attente. */
  poster?: string
}

/**
 * Reçoit indifféremment images, vidéos et fichiers audio : c'est au
 * gestionnaire de discriminer sur `file.type` s'il le souhaite.
 */
export type EditorUploadHandler = (file: File) => EditorUploadResult | string | Promise<EditorUploadResult | string>

/**
 * Gestionnaire par défaut : crée une URL d'objet locale. Le média s'affiche
 * immédiatement mais n'est **pas** persisté — l'URL meurt avec l'onglet.
 * C'est volontairement un bouchon : branchez le vôtre via `onUpload`.
 */
export const defaultUploadHandler: EditorUploadHandler = (file) => {
  if (import.meta.dev) {
    console.warn(editorUploadText.noHandlerWarning)
  }

  return {
    src: URL.createObjectURL(file),
    alt: file.name,
  }
}

/**
 * Point d'extension unique pour l'envoi de fichiers, partagé par les deux
 * templates. Aucune dépendance à un stockage : c'est à l'application hôte de
 * fournir `onUpload` (S3, NuxtHub Blob, Directus, une route `/api/upload`…).
 */
export function useEditorUpload(handler?: MaybeRefOrGetter<EditorUploadHandler | undefined>) {
  const pending = ref(false)
  const error = ref<string | null>(null)

  const isConfigured = computed(() => !!toValue(handler))

  async function upload(file: File): Promise<EditorUploadResult | null> {
    pending.value = true
    error.value = null

    try {
      const fn = toValue(handler) ?? defaultUploadHandler
      const result = await fn(file)

      return typeof result === 'string' ? { src: result } : result
    }
    catch (e) {
      error.value = e instanceof Error ? e.message : editorUploadText.uploadError
      return null
    }
    finally {
      pending.value = false
    }
  }

  return {
    upload,
    pending,
    error,
    isConfigured,
  }
}
