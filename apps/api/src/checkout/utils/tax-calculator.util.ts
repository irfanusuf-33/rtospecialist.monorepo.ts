export interface TaxCalculationResponse {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
}

/**
 * Pure helper function to compute uniform tax additions
 */
export function calculateTax(subtotal: number, taxRatePercentage = 10): TaxCalculationResponse {
  const subtotalNum = typeof subtotal === 'string' ? parseFloat(subtotal) : subtotal;
  
  const taxAmount = subtotalNum * (taxRatePercentage / 100);
  const grandTotal = subtotalNum + taxAmount;

  return {
    subtotal: parseFloat(subtotalNum.toFixed(2)),
    taxRate: taxRatePercentage,
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    grandTotal: parseFloat(grandTotal.toFixed(2)),
  };
}