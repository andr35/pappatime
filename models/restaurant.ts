export interface Restaurant {
  // Number of store
  number: number;
  // Store name
  name: string;
  // Store address
  address: string;
  // Store city
  city: string;
  // Store postal code
  postalCode: string;
  // Store province
  province: string;
  // Store region
  region?: string;
  // Store fraction
  fraction?: string;
  // Store type
  type: string;
  // Store closing day
  closingDay: string;
  // Store VAT number
  vatNumber?: string;
  // Store supplier name
  supplierName?: string;
  // Store code
  code?: string;
}
