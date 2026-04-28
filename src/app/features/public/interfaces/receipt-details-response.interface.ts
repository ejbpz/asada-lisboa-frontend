export interface ReceiptDetailsResponse {
  meter: string | null,
  lapse: string | null,
  address: string | null,
  userName: string | null,
  expirationDate: string | null,

  total: number | null,
  cubicMeters: number | null,
  currentReading: number | null,
  previousReading: number | null,

  taxes: number | null,
  repairs: number | null,
  arrears: number | null,
  hydrants: number | null,
  baseRate: number | null,
  creditNote: number | null,
  consumption: number | null,
  fixedCharges: number | null,
  otherCharges: number | null,
  waterResource: number | null,
  disconnectionReconnection: number | null,
}
