/**
 * Formata valores monetários em Real Brasileiro (BRL)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Parse string de moeda para número
 */
export function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9,-]+/g, '').replace(',', '.'))
}
