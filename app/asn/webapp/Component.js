/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "sap/m/MessageBox",
    "sap/fiori/asn/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/core/routing/HashChanger",
    "sap/fiori/asn/controller/formatter"
],
    function (UIComponent, Device, MessageBox, models, JSONModel, ODataModel, HashChanger, formatter) {
        "use strict";

        return UIComponent.extend("sap.fiori.asn.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);
                var slash = window.location.href.includes("site") ? "/" : "";
                var modulePath = jQuery.sap.getModulePath("sap.fiori.asn");
                modulePath = modulePath === "." ? "" : modulePath;
                var serviceUrl = modulePath + slash + this.getMetadata().getManifestEntry("sap.app").dataSources.mainService.uri;
                var oDataModel = new ODataModel(serviceUrl, true);

                // metadata failed
                oDataModel.attachMetadataFailed(err => {
                    var response = err.getParameter("response").body;
                    if (response.indexOf("<?xml") !== -1) {
                        MessageBox.error($($.parseXML(response)).find("message").text());
                    } else {
                        MessageBox.error(response);
                    }
                });

                oDataModel.attachMetadataLoaded(() => {
                    this.setModel(oDataModel);
                    sap.ui.getCore().setModel(oDataModel, "oModel");
                    oDataModel.setDefaultCountMode("None");

                    sap.ui.getCore().setModel(new JSONModel(), "navToItem");

                    // set the device model
                    this.setModel(models.createDeviceModel(), "device");
                  
                    var site = window.location.href.includes("site");
                    if (site) {
                        $.ajax({
                            //url: hardcodedURL,
                            url: modulePath + slash + "user-api/attributes",
                            type: "GET",
                            success: res => {
                                sessionStorage.setItem('LoggedUser', res.email);
                                if(!sessionStorage.getItem('AddressCode')){
                                sessionStorage.setItem('AddressCode', res.login_name[0]);
                                }
                                this.setHeaders(res.login_name[0], res.type[0].substring(0, 1).toUpperCase());
                            }
                        });
                    } else {
                        this.setHeaders("RA046 ", "E");
                    }
                });

                // odata request failed
                oDataModel.attachRequestFailed(err => {
                    var responseText = err.getParameter("responseText");
                    if (responseText.indexOf("<?xml") !== -1) {
                        MessageBox.error($($.parseXML(responseText)).find("message").text());
                    } else {
                        MessageBox.error(JSON.parse(responseText).error.message.value);
                    }
                });
            },
            setHeaders: function (loginId, loginType) {
                this.getModel().setHeaders({
                    "loginId": loginId,
                    "loginType": loginType
                });

                // enable routing
                this.getRouter().initialize();
            },
        });
    }
);