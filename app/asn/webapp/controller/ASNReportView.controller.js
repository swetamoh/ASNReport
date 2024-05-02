sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/export/Spreadsheet",
	"sap/ui/export/library",
	"sap/m/MessageBox"
], function (Controller, Spreadsheet, exportLibrary, MessageBox) {
	"use strict";

	return Controller.extend("sap.fiori.asn.controller.ASNReportView", {

		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.DataModel = new sap.ui.model.json.JSONModel();
			this.DataModel.setSizeLimit(10000000);
			this.getView().setModel(this.DataModel, "DataModel");
			this.detailModel = sap.ui.getCore().getModel("detailModel");
			this.loginModel = sap.ui.getCore().getModel("loginModel");
			this.getView().setModel(this.loginModel, "loginModel");
			this.localModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(this.localModel, "localModel");
			this._tableTemp = this.getView().byId("tableTempId").clone();
			// this.StatusModel = new sap.ui.model.json.JSONModel();
			// this.getView().setModel(this.StatusModel, "StatusModel");
			// this.StatusFlag = false;
			this.oDataModel = sap.ui.getCore().getModel("oDataModel");
			this.getView().setModel(this.oDataModel);
			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyyMMdd"
			});
			var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "ddMMMyyyy"
			});
			this.curDate = new Date();
			this.startDate = new Date(this.curDate.getTime() - 30 * 24 * 3600 * 1000);
			//this.startDate = new Date();
			this.getView().byId("endDateId").setMinDate(this.startDate);
			this.curDate = dateFormat.format(this.curDate);
			this.startDate = dateFormat.format(this.startDate);
			this.getView().byId("endDateId").setValue(this.curDate);
			this.getView().byId("startDateId").setValue(this.startDate);
			this.ASNtodate = new Date();
			this.ASNfromdate = new Date(this.ASNtodate.getTime() - 30 * 24 * 3600 * 1000);
			//this.ASNfromdate = new Date();
			this.ASNtodate = dateFormat1.format(this.ASNtodate);
			this.ASNfromdate = dateFormat1.format(this.ASNfromdate);
			this.ASNtodate = this.ASNtodate.substring(0, 2) + " " + this.ASNtodate.substring(2, 5) + " " + this.ASNtodate.substring(5, 9);
			this.ASNfromdate = this.ASNfromdate.substring(0, 2) + " " + this.ASNfromdate.substring(2, 5) + " " + this.ASNfromdate.substring(5, 9);
			this.AddressCode = sessionStorage.getItem("AddressCode") || 'JSE-01-01';
			this.LoggedUser = sessionStorage.getItem("LoggedUser") || "rajeshsehgal@impauto.com";
			if (this.getOwnerComponent().getModel().getHeaders().loginType === "P") {
				this.getView().byId("vendorCodeId").setValue(this.AddressCode);
				this.getASNData();
			}

			var datePicker = this.getView().byId("startDateId");

			datePicker.addDelegate({
				onAfterRendering: function () {
					datePicker.$().find('INPUT').attr('disabled', true).css('color', '#000000');
				}
			}, datePicker);

			datePicker = this.getView().byId("endDateId");

			datePicker.addDelegate({
				onAfterRendering: function () {
					datePicker.$().find('INPUT').attr('disabled', true).css('color', '#000000');
				}
			}, datePicker);
		},
		getASNData: function () {
			sap.ui.core.BusyIndicator.show();
			var that = this;
			var oModel = this.getOwnerComponent().getModel();
			oModel.read("/GetASNHeaderList", {
				urlParameters: {
					username: this.LoggedUser,
					AddressCode: this.AddressCode,
					PoNumber: '',
					ASNNumber: '',
					ASNFromdate: this.ASNfromdate,
					ASNTodate: this.ASNtodate,
					InvoiceStatus: '',
					MRNStatus: '',
					ApprovedBy: ''
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					that.DataModel.setData(oData);
					that.DataModel.refresh();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					var value = JSON.parse(oError.response.body);
					MessageBox.error(value.error.message.value);
				}
			});
		},
		onFilterClear: function () {
			var data = this.localModel.getData();
			data.ASNNumber = "";
			data.PONumber = "";
			data.VendorCode = "";
			data.CreateStartDate = "";
			data.CreateEndDate = "";
			data.InvoiceStatus = "";
			data.GRNStatus = "";
			this.localModel.refresh(true);
			var oView = this.getView();
			oView.byId("asnnumId").setValue("");
			oView.byId("ponumId").setValue("");
			oView.byId("vendorCodeId").setValue("");
			oView.byId("createstartDateId").setValue("");
			oView.byId("createendDateId").setValue("");
			oView.byId("invoicestatusid").setSelectedKey("");
			oView.byId("grnstatusid").setSelectedKey("");
		},

		onFilterGoPress: function () {
			
			var that = this;
			var data = this.localModel.getData();
			var oModel = this.getOwnerComponent().getModel();
			var dateFormat1 = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "ddMMMyyyy"
			});

			this.EndDate = this.getView().byId("endDateId").getDateValue();
			this.StartDate = this.getView().byId("startDateId").getDateValue();
			this.EndDate = dateFormat1.format(this.EndDate);
			this.StartDate = dateFormat1.format(this.StartDate);
			this.EndDate = this.EndDate.substring(0, 2) + " " + this.EndDate.substring(2, 5) + " " + this.EndDate.substring(5, 9);
			this.StartDate = this.StartDate.substring(0, 2) + " " + this.StartDate.substring(2, 5) + " " + this.StartDate.substring(5, 9);

			if (!data.ASNNumber) {
				data.ASNNumber = "";
			}
			if (!data.PONumber) {
				data.PONumber = "";
			}
			if (!data.VendorCode) {
				if (this.getOwnerComponent().getModel().getHeaders().loginType === "P") {
					this.VendorCode = this.AddressCode;
				} else {
					MessageBox.error("Please enter Vendor Code to proceed");
					return;
				}
			} else if (data.VendorCode) {
				this.VendorCode = data.VendorCode;
			}
			if (!data.CreatedBy) {
				data.CreatedBy = "";
			}
			if (!data.InvoiceStatus) {
				data.InvoiceStatus = "";
			}
			if (!data.GRNStatus) {
				data.GRNStatus = "";
			}
			that.DataModel.setData([]);
			that.DataModel.refresh();
			sap.ui.core.BusyIndicator.show();
			oModel.read("/GetASNHeaderList", {
				urlParameters: {
					username: this.LoggedUser,
					AddressCode: this.VendorCode,
					PoNumber: data.PONumber,
					ASNNumber: data.ASNNumber,
					ASNFromdate: this.StartDate,
					ASNTodate: this.EndDate,
					InvoiceStatus: data.InvoiceStatus,
					MRNStatus: data.GRNStatus,
					ApprovedBy: data.CreatedBy
				},
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					that.DataModel.setData(oData);
					that.DataModel.refresh();
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					var value = JSON.parse(oError.response.body);
					MessageBox.error(value.error.message.value);
				}
			});

		},

		onItempress: function (oEvent) {
			var filterdata = this.localModel.getData();
			var data = oEvent.getParameter("listItem").getBindingContext("DataModel").getProperty();
			this.AsnNumber = data.ASNNumber.replace(/\//g, '-');
			//this.detailModel.setData(data);
			this.router.navTo("ASNReportDetail", {
				"AsnNumber": this.AsnNumber,
				"AddressCode": filterdata.VendorCode,
				"UnitCode": data.PlantCode
			});
		},
		/////////////////////////////////////////Table Personalization////////////////////////////////
		onColumnSelection: function (event) {
			var that = this;
			var List = that.byId("List");
			var popOver = this.byId("popOver");
			if (List !== undefined) {
				List.destroy();
			}
			if (popOver !== undefined) {
				popOver.destroy();
			}
			/*----- PopOver on Clicking ------ */
			var popover = new sap.m.Popover(this.createId("popOver"), {
				showHeader: true,
				// showFooter: true,
				placement: sap.m.PlacementType.Bottom,
				content: []
			}).addStyleClass("sapMOTAPopover sapTntToolHeaderPopover sapUiResponsivePadding--header sapUiResponsivePadding--footer");

			/*----- Adding List to the PopOver -----*/
			var oList = new sap.m.List(this.createId("List"), {});
			this.byId("popOver").addContent(oList);
			var openAssetTable = this.getView().byId("TableDataId"),
				columnHeader = openAssetTable.getColumns();
			var openAssetColumns = [];
			for (var i = 0; i < columnHeader.length; i++) {
				var hText = columnHeader[i].getAggregation("header").getProperty("text");
				var columnObject = {};
				columnObject.column = hText;
				openAssetColumns.push(columnObject);
			}
			var oModel1 = new sap.ui.model.json.JSONModel({
				list: openAssetColumns
			});
			var itemTemplate = new sap.m.StandardListItem({
				title: "{oList>column}"
			});
			oList.setMode("MultiSelect");
			oList.setModel(oModel1);
			sap.ui.getCore().setModel(oModel1, "oList");
			var oBindingInfo = {
				path: 'oList>/list',
				template: itemTemplate
			};
			oList.bindItems(oBindingInfo);
			var footer = new sap.m.Bar({
				contentLeft: [],
				contentMiddle: [new sap.m.Button({
					text: "Cancel",
					press: function () {
						that.onCancel();
					}
				})],
				contentRight: [new sap.m.Button({
					text: "Save",
					press: function () {
						that.onSave();
					}
				})
				]

			});

			this.byId("popOver").setFooter(footer);
			var oList1 = this.byId("List");
			var table = this.byId("TableDataId").getColumns();
			/*=== Update finished after list binded for selected visible columns ==*/
			oList1.attachEventOnce("updateFinished", function () {
				var a = [];
				for (var j = 0; j < table.length; j++) {
					var list = oList1.oModels.undefined.oData.list[j].column;
					a.push(list);
					var Text = table[j].getHeader().getProperty("text");
					var v = table[j].getProperty("visible");
					if (v === true) {
						if (a.indexOf(Text) > -1) {
							var firstItem = oList1.getItems()[j];
							oList1.setSelectedItem(firstItem, true);
						}
					}
				}
			});
			popover.openBy(event.getSource());
		},
		/*================ Closing the PopOver =================*/
		onCancel: function () {
			this.byId("popOver").close();
		},
		/*============== Saving User Preferences ==================*/
		onSave: function () {
			var that = this;
			var oList = this.byId("List");
			var array = [];
			var items = oList.getSelectedItems();

			// Getting the Selected Columns header Text.
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				var context = item.getBindingContext("oList");
				var obj = context.getProperty(null, context);
				var column = obj.column;
				array.push(column);
			}
			/*---- Displaying Columns Based on the selection of List ----*/
			var table = this.byId("TableDataId").getColumns();
			for (var j = 0; j < table.length; j++) {
				var Text = table[j].getHeader().getProperty("text");
				var Column = table[j].getId();
				var columnId = this.getView().byId(Column);
				if (array.indexOf(Text) > -1) {
					columnId.setVisible(true);
				} else {
					columnId.setVisible(false);
				}
			}

			this.byId("popOver").close();

		},
		/////////////////////////////////////////Table Personalization////////////////////////////////

		onFromDateChange: function (oEvent) {
			var FromDate = this.getView().byId("startDateId").getDateValue();
			var ToDate = this.getView().byId("endDateId").getDateValue();
			this.getView().byId("endDateId").setMinDate(FromDate);
			if (ToDate <= FromDate) {
				this.getView().byId("endDateId").setDateValue(new Date(FromDate));
			}
			oEvent.getSource().$().find('INPUT').attr('disabled', true).css('color', '#000000');
		},
		onCreateFromDateChange: function (oEvent) {
			var FromDate = this.getView().byId("createstartDateId").getDateValue();
			var ToDate = this.getView().byId("createendDateId").getDateValue();
			this.getView().byId("createendDateId").setMinDate(FromDate);
			if (ToDate <= FromDate) {
				this.getView().byId("createendDateId").setDateValue(new Date(FromDate));
			}
			oEvent.getSource().$().find('INPUT').attr('disabled', true).css('color', '#000000');
		},
		onDataExport: function () {
			var oSettings, aColumns,
				aColumnNames = [];
			var aExportData = this.DataModel.getData().results;
			if (aExportData) {
				aColumns = this.getView().byId("TableDataId").getColumns();
				// for (var i = 0; i < aColumns.length; i++) {
				// 	var sColumn = aColumns[i].getHeader().getText();
				// 	if (sColumn) {
				// 		aColumnNames.push({
				// 			label: aColumns[i].getHeader().getText(),
				// 			property: sColumn,
				// 			type: "string"
				// 		});
				// 	}
				// }
				aColumnNames = [{
					label: "ASN Number",
					property: "ASNNumber",
					type: "string"
				}, {
					label: "ASN Date/Time",
					property: "ASNDateTime",
					type: "string"
				}, {
					label: "PO Number",
					property: "PoNumber",
					type: "string"
				}, {
					label: "Schedule Number",
					property: "ScheduleNumber",
					type: "string"
				}, {
					label: "Gate Entry Status",
					property: "GateEntryStatus",
					type: "string"
				}, {
					label: "GRN Status",
					property: "GRNStatus",
					type: "string"
				}, {
					label: "Invoice Status",
					property: "InvoiceStatus",
					type: "string"
				}, {
					label: "Gate Entry No",
					property: "GateEntryNumber",
					type: "string"
				}, {
					label: "Gate Entry Date",
					property: "GateEntryDate",
					type: "string"
				}, {
					label: "Plant Code",
					property: "PlantCode",
					type: "string"
				}, {
					label: "Plant Name",
					property: "PlantName",
					type: "string"
				}, {
					label: "Vendor Code",
					property: "VendorCode",
					type: "string"
				}, {
					label: "Vendor Name",
					property: "VendorName",
					type: "string"
				}, {
					label: "Material",
					property: "MaterialCode",
					type: "string"
				}, {
					label: "Material Desription",
					property: "MaterialDescription",
					type: "string"
				}];
				oSettings = {
					workbook: {
						columns: aColumnNames
					},
					dataSource: aExportData,
					fileName: "ASN Report"
				};
				new Spreadsheet(oSettings).build();
			}
		},
	});

});