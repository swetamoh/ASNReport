namespace my.bookshop;

entity GetASNHeaderList{
  key ASNNumber : String;
  ASNDate  : String;
  ApprovedBy: String;
  ApprovedDate: String;
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
  ASNNumber : String;
  ASNStatus: String;
  ASNDate: String;
  VendorCode: String;
  VendorDesc: String;
  UnitCode: String;
  UnitDesc: String;
  DocketNumber: String;
  DocketDate: String;
  MillNumber: String;
  HeatNumber: String;
  ASNInvoiceNumber: String;
  ASNInvoiceDate: String;
  TransportMode: String;
  TransportName: String;
  Ewaybillnumber: String;
  Ewaybilldate: String;
  MillName: String;
  BatchCode: String;
  PDIRNumber: String;
  ManufMonth: String;
  CreatedBy: String;
  CreatedOn: String;
  ScheduleAgreementValidFromdate: String;
  ScheduleAgreementValidTodate: String;
  ScheduleAgreementDuedate: String;
  BillLineNumber: String;
  ScheduleNumber: String;
  ScheduleLineNumber: String;
  PONumber: String;
  ScheduleQuantity: String;
  POStatus: String;
  BalanceQtyagainstMrn: String;
  ItemCode: String;
  ItemDesc: String;
  ItemUOM: String;
  HSNCode: String;
  ItemRate: String;
  ASNQuantity: String;
  Packing: String;
  Frieght: String;
  OtherCharges: String;
  TCS: String;
  ASSValue: String;
  SGST: String;
  SGA: String;
  CGST: String;
  CGA: String;
  IGST: String;
  IGA: String;
  TCA: String;
  LineValue: String;
  WeightinKg: String;
  GateEntryNumber: String;
  GateEntryQuantity: String;
  GateEntryStatus: String;
  GRNNumber: String;
  GRNQuantity: String;
  GRNStatus: String;
  InvoiceStatus: String;
}