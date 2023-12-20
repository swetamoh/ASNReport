sap.ui.define([], function() {
	"use strict";
	return {
		modeCheck: function(mode) {
			if (mode === "01") {
				return "By Road";
			} else if (mode === "02") {
				return "By Air";
			} else if (mode === "03") {
				return "By Ship";
			} else if (mode === "04") {
				return "By Rail";
			}
		},

		transportModeCheck: function(mode) {
			if (mode === "1") {
				return "Vehicle Reg. Number";
			} else if ((mode === "2") || (mode === "3")) {
				return "AWB";
			} else if (mode === "4") {
				return "Train Number";
			} else {
				return "Vehicle Reg. Number";
			}
		}
	}
});