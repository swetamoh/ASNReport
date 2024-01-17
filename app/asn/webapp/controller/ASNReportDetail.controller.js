sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.fiori.asn.controller.ASNReportDetail", {

		onInit: function() {
			this._tableTemp = this.getView().byId("tableTempId").clone();
			this.detailModel = new sap.ui.model.json.JSONModel();
			this.detailModel.setSizeLimit(10000000);
			this.getView().setModel(this.detailModel, "detailModel");
			// this.detailModel = sap.ui.getCore().getModel("detailModel");
			// this.getView().setModel(this.detailModel, "detailModel");
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this.handleRouteMatched, this);
			this.byId("uploadSet").attachEvent("openPressed", this.onOpenPressed, this);
		},
		
		handleRouteMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "ASNReportDetail") {
				//this.detailModel.refresh(true);
				var that = this;
				this.UnitCode = sessionStorage.getItem("unitCode") || "P01";
				var data = oEvent.getParameter("arguments");
				this.AsnNumber = data.AsnNumber.replace(/-/g, '/');
				this.AsnNum = data.AsnNumber;
				this.getView().byId("pageId").setTitle("ASN Number - " + this.AsnNumber);
				var oModel = this.getOwnerComponent().getModel();
				var oUploadSet = this.byId("uploadSet");
				oUploadSet.removeAllItems();
				oModel.read("/GetASNDetailList" ,{
				urlParameters: {
					AddressCode: data.AddressCode,
					ASNNumber: this.AsnNumber,
					UnitCode: this.UnitCode
				},
				success : function (oData) {
					that.detailModel.setData(oData);
					that.detailModel.refresh();
					that._fetchFilesForPoNum(that.AsnNum);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					var value = JSON.parse(oError.response.body);
					MessageBox.error(value.error.message.value);
				}
		});

				// this.getView().byId("TableDataId").bindItems({
				// 	path: "/GetASNDetailList",
				// 	parameters: {
				// 		custom: {
				// 			AddressCode: data.AddressCode,
				// 			ASNNumber: this.AsnNumber,
				// 		},
				// 		countMode: 'None'
				// 	},
				// 	template: this._tableTemp
				// });

			}
		},
		_fetchFilesForPoNum: function (AsnNum) {
			var oModel = this.getView().getModel("catalog");
			var oUploadSet = this.byId("uploadSet");
			oUploadSet.removeAllItems();

			oModel.read("/Files", {
				filters: [new sap.ui.model.Filter("AsnNum", sap.ui.model.FilterOperator.EQ, AsnNum)],
				success: function (oData) {
					oData.results.forEach(function(fileData) {
						var oItem = new sap.m.upload.UploadSetItem({
							fileName: fileData.fileName,
							mediaType: fileData.mediaType,
							url: fileData.url,
							attributes: [
								new sap.m.ObjectAttribute({ title: "Uploaded By", text: fileData.createdBy }),
								new sap.m.ObjectAttribute({ title: "Uploaded on", text: fileData.createdAt }),
								new sap.m.ObjectAttribute({ title: "File Size", text: fileData.size.toString() })
							]
						});
	
						oUploadSet.addItem(oItem);
					});
				},
				error: function (oError) {
					console.log("Error: "+ oError)
				}
			});
		},
		onOpenPressed: function (oEvent) {
			oEvent.preventDefault();
			//var item = oEvent.getSource();
			var item = oEvent.getParameter("item");
			this._fileName = item.getFileName();
			this._download(item)
				.then((blob) => {
					var url = window.URL.createObjectURL(blob);
					var link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', this._fileName);
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);						
				})
				.catch((err)=> {
					console.log(err);
				});					
		},
		_download: function (item) {
			console.log("_download")
			var settings = {
				url: item.getUrl(),
				method: "GET",
				xhrFields:{
					responseType: "blob"
				}
			}	

			return new Promise((resolve, reject) => {
				$.ajax(settings)
				.done((result, textStatus, request) => {
					resolve(result);
				})
				.fail((err) => {
					reject(err);
				})
			});						
		},

		onNavPress: function() {
			history.go(-1);
		},
		// onFilterClear: function() {
		// 	var oView = this.getView();
		// 	oView.byId("MaterialId").setSelectedKey("");
		// },
		// handleMaterialHelp: function() {

		// 	if (!this.materialFragment) {
		// 		this.materialFragment = sap.ui.xmlfragment("sap.fiori.asn.fragment.fragMaterial", this);
		// 		this.getView().addDependent(this.materialFragment);
		// 		this._materialTemp = sap.ui.getCore().byId("materialTempId").clone();
		// 	}

		// 	sap.ui.getCore().byId("materialF4Id").bindAggregation("items", {
		// 		path: "/MaterialHelpSet?$filter=Ebeln eq '" + this.data1.Ebeln + "'",
		// 		template: this._materialTemp
		// 	});

		// 	this.materialFragment.open();

		// },
		// handleMaterialValueHelpSearch: function(evt) {
		// 	var sValue = evt.getParameter("value");
		// 	if (sValue) {
		// 		sap.ui.getCore().byId("materialF4Id").bindAggregation("items", {
		// 			path: "/MaterialHelpSet?$filter=Matnr eq '" + sValue + "' and Ebeln eq '" + this.data1.Ebeln + "'",
		// 			template: this._materialTemp
		// 		});
		// 	} else {
		// 		sap.ui.getCore().byId("materialF4Id").bindAggregation("items", {
		// 			path: "/MaterialHelpSet?$filter=Ebeln eq='" + this.data1.Ebeln + "' ",
		// 			template: this._materialTemp
		// 		});
		// 	}
		// },
		// handleMaterialValueHelpClose: function(evt) {
		// 	var oSelectedItem = evt.getParameter("selectedItem");
		// 	var Matnr = oSelectedItem.getBindingContext().getProperty("Matnr");
		// 	this.getView().byId("MaterialId").setValue(Matnr);
		// }
	});

});