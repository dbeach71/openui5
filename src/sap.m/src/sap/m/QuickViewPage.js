/*
 * ! ${copyright}
 */

// Provides control sap.m.QuickViewPage
sap.ui.define([
			'jquery.sap.global', './library', 'sap/ui/core/Control',
				'sap/ui/core/IconPool', 'sap/ui/layout/form/SimpleForm',
				'sap/ui/layout/VerticalLayout', 'sap/ui/layout/HorizontalLayout',
				'./Page', './Button', './ButtonType', './Bar',
				'./Title', './Image', './Link', './Text',
				'./QuickViewGroupElementType',
				'./Label', './HBox', 'sap/ui/core/Icon', 'sap/ui/core/Title', 'sap/ui/core/TitleLevel',
				'sap/ui/core/CustomData', 'sap/ui/layout/form/SimpleFormLayout'],
		function(jQuery, library, Control,
					IconPool, SimpleForm,
					VerticalLayout, HorizontalLayout,
					Page, Button, ButtonType, Bar,
					Title, Image, Link, Text,
					QuickViewGroupElementType,
					Label, HBox, Icon, CoreTitle, CoreTitleLevel,
					CustomData, SimpleFormLayout) {
			"use strict";

			/**
			 * Constructor for a new QuickViewPage.
			 *
			 * @param {string} [sId] id for the new control, generated automatically if no id is given
			 * @param {object} [mSettings] initial settings for the new control
			 * @class QuickViewPage consists of  a page header, an object icon or image,
			 * an object name with short description, and an object information divided in groups.
			 * The control uses the sap.m.SimpleForm control to display information.
			 * @extends sap.ui.core.Control
			 * @author SAP SE
			 * @constructor
			 * @public
			 * @alias sap.m.QuickViewPage
			 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
			 */
			var QuickViewPage = Control.extend("sap.m.QuickViewPage",
					{
						metadata: {

							library: "sap.m",
							properties: {

								/**
								 * Page id
								 */
								pageId: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								},

								/**
								 * The text displayed in the header of the control
								 */
								header: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								},

								/**
								 * The text displayed in the header of the content section of the control
								 */
								title: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								},

								/**
								 * The URL which opens when the title or the thumbnail is clicked
								 */
								titleUrl: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								},

								/**
								 * The application provides target and param configuration  for cross-application navigation from the 'page header'.
								 */
								crossAppNavCallback : {
									type: "object",
									group: "Misc"
								},

								/**
								 * The text displayed under the header of the content section
								 */
								description: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								},

								/**
								 * The URL of the icon displayed under the header of the page
								 */
								icon: {
									type: "string",
									group: "Misc",
									defaultValue: ""
								}
							},
							defaultAggregation: "groups",
							aggregations: {

								/**
								 * QuickViewGroup consists of a title (optional) and an entity of group elements.
								 */
								groups: {
									type: "sap.m.QuickViewGroup",
									multiple: true,
									singularName: "group",
									bindable: "bindable"
								}
							}
						}
					});


			QuickViewPage.prototype.init =  function() {
				this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle('sap.m');

				try {
					jQuery.sap.require("sap.ushell.services.CrossApplicationNavigation");
				} catch(e) {
					//move the require in onInit method to avoid the OpenAJAX check error
				}

				//see API docu for sap.ushell.services.CrossApplicationNavigation
				var fGetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
				if (fGetService) {
					this.oCrossAppNavigator = fGetService("CrossApplicationNavigation");
				}

			};

			QuickViewPage.prototype._createPage = function () {
				var oForm = this._createForm(),
					that = this,
					oHeaderContent = this._getPageHeaderContent(),
					aContent = [];

				aContent.push(oHeaderContent, oForm);

				var oPage = new Page(this.getPageId(), {
					content : aContent,
					customHeader : new Bar()
				});

				var oCustomHeader = oPage.getCustomHeader();

				oCustomHeader.addContentMiddle(
					new Title({
						text : this.getHeader()
					})
				);

				if (this._hasBackButton) {
					oCustomHeader.addContentLeft(
						new Button({
							type : ButtonType.Back,
							tooltip : this._oResourceBundle.getText("PAGE_NAVBUTTON_TEXT"),
							press : function() {
								if (that._oNavContainer) {
									that._oNavContainer.back();
								}
							}
						})
					);
				}

				if (sap.ui.Device.system.phone) {
					oCustomHeader.addContentRight(
						new Button({
							icon : "sap-icon://decline",
							press : function() {
								if (that._oPopover) {
									that._oPopover.close();
								}
							}
						})
					);
				}

				oPage.addStyleClass('sapMQuickViewPage');

				return oPage;
			};

			QuickViewPage.prototype._createPageContent = function () {

				var mPageContent = {};

				mPageContent.form = this._createForm();
				mPageContent.header = this._getPageHeaderContent();

				return mPageContent;
			};

			QuickViewPage.prototype._createForm = function () {
				var aGroups = this.getAggregation("groups"),
				    oForm = new SimpleForm({
						maxContainerCols: 1,
						editable: false,
						layout: SimpleFormLayout.ResponsiveGridLayout
					});

				if (aGroups) {
					for (var j = 0; j < aGroups.length; j++) {
						this._renderGroup(aGroups[j], oForm);
					}
				}

				return oForm;
			};

			QuickViewPage.prototype._getPageHeaderContent = function() {
				var oIcon,
					oVLayout = new VerticalLayout(),
					oHLayout = new HorizontalLayout();

				if (this.getIcon()) {
					if (this.getIcon().indexOf("sap-icon") == 0) {
						oIcon = new Icon({
							src: this.getIcon()
						});
					} else {
						oIcon = new Image({
							src: this.getIcon()
						}).addStyleClass("sapUiIcon");
					}

					oIcon.addStyleClass("sapMQuickViewThumbnail");

					if (this.getTitleUrl()) {
						oIcon.attachPress(this._crossApplicationNavigation(this));
					}

					oHLayout.addContent(oIcon);
				}

				var oTitle;

				if (this.getTitleUrl()) {
					oTitle = new Link({
						text	: this.getTitle(),
						href	: this.getTitleUrl(),
						target	: "_blank"
					});
				} else if (this.getCrossAppNavCallback()) {
					oTitle = new Link({
						text	: this.getTitle()
					});
					oTitle.attachPress(this._crossApplicationNavigation(this));
				} else {
					oTitle = new Title({
						text	: this.getTitle(),
						level	: CoreTitleLevel.H1
					});
				}

				var oDescription = new Text({
					text	: this.getDescription()
				});

				oVLayout.addContent(oTitle);
				oVLayout.addContent(oDescription);
				oHLayout.addContent(oVLayout);

				return oHLayout;
			};

			QuickViewPage.prototype._renderGroup = function(oGroup, oForm) {
				var aElements = oGroup.getAggregation("elements");

				var oCurrentGroupElement,
					oCurrentGroupElementValue,
					oLabel;

				if (oGroup.getHeading()) {
					oForm.addContent(new CoreTitle({
						text : oGroup.getHeading(),
						level : CoreTitleLevel.H2
					}));
				}

				if (!aElements) {
					return;
				}

				for (var k = 0; k < aElements.length; k++) {
					oCurrentGroupElement = aElements[k];

					if (!oCurrentGroupElement.getVisible()) {
						continue;
					}

					oLabel = new Label({
						text: oCurrentGroupElement.getLabel()
					});

					oCurrentGroupElementValue = oCurrentGroupElement._getGroupElementValue();

					if (oCurrentGroupElementValue instanceof Link) {
						oCurrentGroupElementValue.addAriaLabelledBy(oCurrentGroupElementValue);
					}

					oForm.addContent(oLabel);

					if (oCurrentGroupElement.getType() == QuickViewGroupElementType.pageLink) {
						oCurrentGroupElementValue.attachPress(this._attachPressLink(this));
					}

					if (oCurrentGroupElement.getType() == QuickViewGroupElementType.mobile) {
						var oSmsLink = new Icon({
							src: IconPool.getIconURI("post"),
							decorative : false,
							customData: [new CustomData({
								key: "phoneNumber",
								value: oCurrentGroupElement.getValue()
							})],
							press: this._mobilePress
						});
						var oBox = new HBox({
							items: [oCurrentGroupElementValue, oSmsLink]
						});
						oForm.addContent(oBox);
					} else {
						oForm.addContent(oCurrentGroupElementValue);
					}
				}
			};

			QuickViewPage.prototype._crossApplicationNavigation = function (that) {
				return function () {
					if (that.getCrossAppNavCallback() && that.oCrossAppNavigator) {
						var targetConfig = that.getCrossAppNavCallback();
						var href = that.oCrossAppNavigator.hrefForExternal(
							{
								target : {
									semanticObject : targetConfig.target.semanticObject,
									action : targetConfig.target.action
								},
								params : targetConfig.params
							}
						);

						sap.m.URLHelper.redirect(href);
					} else if (that.getTitleUrl()) {
						var oWindow = window.open(that.getTitleUrl(), "_blank");
						oWindow.focus();
					}
				};
			};

			QuickViewPage.prototype.exit = function() {
				this._oResourceBundle = null;
			};

			QuickViewPage.prototype._attachPressLink = function (that) {
				return function (e) {
					e.preventDefault();
					var sPageId = this.getCustomData()[0].getValue();
					if (that._oNavContainer && sPageId) {
						that._oNavContainer.to(sPageId);
					}
				};
			};

			QuickViewPage.prototype._mobilePress = function () {
				var sms = "sms://" + jQuery.sap.encodeURL(this.getCustomData()[0].getValue());
				window.location.replace(sms);
			};

			return QuickViewPage;

		}, /* bExport= */true);
