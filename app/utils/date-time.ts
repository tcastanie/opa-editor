import { editorDateTimeLabels } from '~/utils/i18n/editor-strings'

/** Formats proposés par l'insertion de date/heure, partagés par les deux éditeurs. */
export const dateTimeFormats = [
  { label: editorDateTimeLabels[0], format: (d: Date) => d.toLocaleDateString('fr-FR') },
  { label: editorDateTimeLabels[1], format: (d: Date) => d.toLocaleDateString('fr-FR', { dateStyle: 'full' }) },
  { label: editorDateTimeLabels[2], format: (d: Date) => d.toLocaleTimeString('fr-FR', { timeStyle: 'short' }) },
  { label: editorDateTimeLabels[3], format: (d: Date) => d.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) },
  { label: editorDateTimeLabels[4], format: (d: Date) => d.toISOString() },
] as const

export type DateTimeFormat = (typeof dateTimeFormats)[number]

/**
 * Entrées de menu prêtes à l'emploi : le libellé, la fonction de formatage
 * (rejouée à l'insertion) et un aperçu figé à l'instant de l'appel — suffisant
 * pour se repérer.
 */
export function dateTimeMenuItems() {
  const now = new Date()

  return dateTimeFormats.map(entry => ({
    label: entry.label,
    description: entry.format(now),
    format: entry.format,
  }))
}
