// Unit translations and mappings
export const UNIT_TYPES = [
  { value: 'gram', label: 'Грамм' },
  { value: 'kilogram', label: 'Килограмм' },
  { value: 'piece', label: 'Штука' },
  { value: 'liter', label: 'Литр' },
  { value: 'milliliter', label: 'Миллилитр' },
  { value: 'tablespoon', label: 'Столовая ложка' },
  { value: 'teaspoon', label: 'Чайная ложка' },
  { value: 'cup', label: 'Стакан' },
] as const

export const UNIT_LABELS: Record<string, string> = {
  gram: 'г',
  kilogram: 'кг',
  piece: 'шт',
  liter: 'л',
  milliliter: 'мл',
  tablespoon: 'ст.л.',
  teaspoon: 'ч.л.',
  cup: 'стакан',
}

export function getUnitLabel(unit: string): string {
  return UNIT_LABELS[unit] || unit
}

export function getUnitFullName(unit: string): string {
  const unitType = UNIT_TYPES.find(u => u.value === unit)
  return unitType?.label || unit
}