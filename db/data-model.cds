namespace my.bookshop;

entity GetASNHeaderList{
  key ASNNumber : String;
  ASNDate  : String;
  CreatedBy: String;
  CreatedBOn: String;
  PoNumber: String;
  PlantCode: String;
  PlantName: String;
  VendorCode: String;
  VendorName: String;
  GateEntryStatus: String;
  GRNStatus: String;
  InvoiceStatus: String;
}

entity GetASNDetailList{
  ScheduleNumber : String;
  ScheduleLineNumber  : String;
  VendorCode: String;
  VendorName: String;
  MaterialCode: String;
  MaterialName: String;
  HSNCode: String;
  ScheduleQuantity: String;
  ScheduleBalancequantity: String;
  Price: String;
  UOM: String;
  Currency: String;
  BillNumber : String;
  BillDate  : String;
  BatchNumber: String;
  CGST: String;
  CGA: String;
  SGST: String;
  SGA: String;
  IGST: String;
  IGA: String;
  OtherCharges: String;
  Frieght: String;
  Packing: String;
  TotatAmount: String;
  LineValue: String;
  Packaging: String;
  WeightinKg: String;
  GateEntryStatus: String;
  GRNStatus: String;
  InvoiceStatus: String;
  CreatedBy: String;
  CreatedOn: String;
}