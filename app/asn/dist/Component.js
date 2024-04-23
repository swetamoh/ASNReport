sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","sap/m/MessageBox","sap/fiori/asn/model/models","sap/ui/model/json/JSONModel","sap/ui/model/odata/ODataModel","sap/ui/core/routing/HashChanger","sap/fiori/asn/controller/formatter"],function(e,a,t,s,o,i,r,n){"use strict";return e.extend("sap.fiori.asn.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);var a=window.location.href.includes("site")?"/":"";var r=jQuery.sap.getModulePath("sap.fiori.asn");r=r==="."?"":r;var n=r+a+this.getMetadata().getManifestEntry("sap.app").dataSources.mainService.uri;var d=new i(n,true);d.attachMetadataFailed(e=>{var a=e.getParameter("response").body;if(a.indexOf("<?xml")!==-1){t.error($($.parseXML(a)).find("message").text())}else{t.error(a)}});d.attachMetadataLoaded(()=>{this.setModel(d);sap.ui.getCore().setModel(d,"oModel");d.setDefaultCountMode("None");sap.ui.getCore().setModel(new o,"navToItem");this.setModel(s.createDeviceModel(),"device");var e=window.location.href.includes("site");if(e){$.ajax({url:r+a+"user-api/attributes",type:"GET",success:e=>{sessionStorage.setItem("LoggedUser",e.email);if(e.login_name[0]!==e.email){sessionStorage.setItem("AddressCode",e.login_name[0])}else{sessionStorage.setItem("AddressCode","JSE-01-01")}}})}});d.attachRequestFailed(e=>{var a=e.getParameter("responseText");if(a.indexOf("<?xml")!==-1){t.error($($.parseXML(a)).find("message").text())}else{t.error(JSON.parse(a).error.message.value)}});this.getRouter().initialize()}})});