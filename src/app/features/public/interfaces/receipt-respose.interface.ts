import { ReceiptType } from "@public/enums/receipt-type.enum";

export interface ReceiptResponse {
  userName: string | null,
  chart1Url: string | null,
  chart2Url: string | null,
  receiptType: ReceiptType,
  table: Record<string, string>[] | null,
}
