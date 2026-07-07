export interface MerchantStat { name: string; change: number; amount: string; }

export const TOP_MERCHANTS: MerchantStat[] = [
  { name: "Shopee", change: +38, amount: "2.4tr" },
  { name: "Grab", change: +22, amount: "890k" },
  { name: "Starbucks", change: +15, amount: "620k" },
];

export const MONTHLY_PHOTOS = ["a1", "b1", "c1", "d1"].map((s) => `https://picsum.photos/seed/${s}/200/200`);


export function getTopMerchants() { return TOP_MERCHANTS; }
export function getMonthlyPhotos() { return MONTHLY_PHOTOS; }
