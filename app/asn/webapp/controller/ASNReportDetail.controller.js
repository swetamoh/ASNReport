sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("sap.fiori.asn.controller.ASNReportDetail", {

		onInit: function() {
			this._tableTemp = this.getView().byId("tableTempId").clone();
			this.detailModel = sap.ui.getCore().getModel("detailModel");
			this.getView().setModel(this.detailModel, "detailModel");
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRouteMatched(this.handleRouteMatched, this);
		},
		
		handleRouteMatched: function(oEvent) {
			if (oEvent.getParameter("name") === "ASNReportDetail") {
				//this.detailModel.refresh(true);
				var data = oEvent.getParameter("arguments");
				this.AsnNumber = data.AsnNumber.replace(/-/g, '/');
				this.getView().byId("pageId").setTitle("ASN Number - " + this.AsnNumber);

				this.getView().byId("TableDataId").bindItems({
					path: "/GetASNDetailList",
					parameters: {
						custom: {
							AddressCode: data.AddressCode,
							ASNNumber: this.AsnNumber,
						},
						countMode: 'None'
					},
					template: this._tableTemp
				});

			}
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