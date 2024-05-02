sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","sap/m/MessageBox","sap/fiori/asn/model/models","sap/ui/model/json/JSONModel","sap/ui/model/odata/ODataModel","sap/ui/core/routing/HashChanger","sap/fiori/asn/controller/formatter"],function(e,t,s,a,i,o,r,n){"use strict";return e.extend("sap.fiori.asn.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);var t=window.location.href.includes("site")?"/":"";var r=jQuery.sap.getModulePath("sap.fiori.asn");r=r==="."?"":r;var n=r+t+this.getMetadata().getManifestEntry("sap.app").dataSources.mainService.uri;var d=new o(n,true);d.attachMetadataFailed(e=>{var t=e.getParameter("response").body;if(t.indexOf("<?xml")!==-1){s.error($($.parseXML(t)).find("message").text())}else{s.error(t)}});d.attachMetadataLoaded(()=>{this.setModel(d);sap.ui.getCore().setModel(d,"oModel");d.setDefaultCountMode("None");sap.ui.getCore().setModel(new i,"navToItem");this.setModel(a.createDeviceModel(),"device");var e=window.location.href.includes("site");if(e){$.ajax({url:r+t+"user-api/attributes",type:"GET",success:e=>{sessionStorage.setItem("LoggedUser",e.email);if(!sessionStorage.getItem("AddressCode")){sessionStorage.setItem("AddressCode",e.login_name[0])}this.setHeaders(e.login_name[0],e.type[0].substring(0,1).toUpperCase())}})}else{this.setHeaders("RA046 ","E")}});d.attachRequestFailed(e=>{var t=e.getParameter("responseText");if(t.indexOf("<?xml")!==-1){s.error($($.parseXML(t)).find("message").text())}else{s.error(JSON.parse(t).error.message.value)}})},setHeaders:function(e,t){this.getModel().setHeaders({loginId:e,loginType:t});this.getRouter().initialize()}})});