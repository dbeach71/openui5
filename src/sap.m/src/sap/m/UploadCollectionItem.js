/*!
 * ${copyright}
 */

// Provides control sap.m.UploadCollectionItem.
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Element', 'sap/m/ObjectAttribute', 'sap/m/ObjectStatus'],
	function(jQuery, library, Element, ObjectAttribute, ObjectStatus) {
	"use strict";

	/**
	 * Constructor for a new UploadCollectionItem
	 *
	 * @param {string} [sId] ID for the new control, will be generated automatically if no ID is provided.
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * Items provide information about the uploaded files.
	 * @extends sap.ui.core.Element
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @constructor
	 * @public
	 * @since 1.26
	 * @alias sap.m.UploadCollectionItem
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var UploadCollectionItem = Element.extend("sap.m.UploadCollectionItem", /** @lends sap.m.UploadCollectionItem.prototype */ {
		metadata : {

			library : "sap.m",
			properties : {

				/**
				 * Specifies the name of the user who uploaded the file.
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 * However, if the property is filled, it is displayed as an attribute. To make sure the title does not appear twice, do not use the property.
				 */
				contributor : {
					type : "string",
					group : "Data",
					defaultValue : null
				},

				/**
				 * Specifies a unique identifier of the file (created by the application).
				 */
				documentId : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the name of the uploaded file.
				 */
				fileName : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the size of the uploaded file (in megabytes).
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 */
				fileSize : {
					type : "float",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the MIME type of the file.
				 */
				mimeType : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the URL where the thumbnail of the file is located.
				 */
				thumbnailUrl : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the date on which the file was uploaded. 
				 * The application has to define the date format.
				 * @deprecated since version 1.30. This property is deprecated; use the aggregation attributes instead.
				 */
				uploadedDate : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Specifies the URL where the file is located.
				 */
				url : {
					type : "string",
					group : "Misc",
					defaultValue : null
				},

				/**
				 * Enables/Disables the Edit pushbutton.
				 * If the value is true, the Edit pushbutton is enabled and the edit function can be used.
				 * If the value is false, the edit function is not available.
				 */
				enableEdit : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Enables/Disables the Edit pushbutton.
				 * If the value is true, the Edit pushbutton is enabled and the edit function can be used.
				 * If the value is false, the edit function is not available.
				 */
				enableDelete : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Show/Hide the Edit pushbutton.
				 * If the value is true, the Edit pushbutton is visible.
				 * If the value is false, the Edit pushbutton is not visible.
				 */
				visibleEdit : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				},

				/**
				 * Show/Hide the Delete pushbutton.
				 * If the value is true, the Delete pushbutton is visible.
				 * If the value is false, the Delete pushbutton is not visible.
				 */
				visibleDelete : {
					type : "boolean",
					group : "Behavior",
					defaultValue : true
				}
			},

			aggregations : {
				/**
				 * Attributes of an uploaded item, for example, 'Uploaded By', 'Uploaded On', 'File Size'
				 * Attributes are displayed after an item has been uploaded.
				 * The Active property of sap.m.ObjectAttribute is not supported.
				 * @experimental since version 1.30. The behavior of aggregations might change in the next version.
				 * Note that if one of the deprecated properties contributor, fileSize or UploadedDate is filled in addition to this attribute, two attributes with the same title
				 * are displayed as these properties get displayed as an attribute.
				 * Example: An application passes the property ‘contributor’ with the value ‘A’ and the aggregation attributes ‘contributor’: ‘B’. As a result, the attributes
				 * ‘contributor’:’A’ and ‘contributor’:’B’ are displayed. To make sure the title does not appear twice, check if one of the properties is filled.
				 */
				attributes : {
					type : "sap.m.ObjectAttribute",
					multiple : true
				},
				/**
				 * Hidden aggregation for the attributes created from the deprecated properties uploadedDate, contributor and fileSize
				 * @experimental since version 1.30. The behavior of aggregations might change in the next version.
				 */
				_propertyAttributes : {
					type : "sap.m.ObjectAttribute",
					multiple : true,
					visibility : "hidden"
				},
				/**
				 * Statuses of an uploaded item
				 * Statuses will be displayed after an item has been uploaded
				 * @experimental since version 1.30. The behavior might change in the next version.
				 */
				statuses : {
					type : "sap.m.ObjectStatus",
					multiple : true
				}
			},

			associations : {
				/**
				 * ID of the FileUploader instance
				 * since version 1.30
				 */
				fileUplaoder : {
					type : "sap.ui.unified.FileUploader",
					group : "misc",
					multiple : false
				}
			}
		}
	});

	UploadCollectionItem.prototype.init = function() {
		this._mDeprecatedProperties = {};
	};

	/**
	 * @description Setter of the deprecated contributor property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 */
	UploadCollectionItem.prototype.setContributor = function(sContributor) {
		this.setProperty("contributor", sContributor, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Setter of the deprecated uploadedDate property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 */
	UploadCollectionItem.prototype.setUploadedDate = function(sUploadedDate) {
		this.setProperty("uploadedDate", sUploadedDate, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Setter of the deprecated fileSize property. The property is mapped to the aggregation attributes.
	 * @deprecated since version 1.30
	 */
	UploadCollectionItem.prototype.setFileSize = function(sFileSize) {
		this.setProperty("fileSize", sFileSize, false);
		this._updateDeprecatedProperties();
		return this;
	};

	/**
	 * @description Update deprecated properties aggregation
	 * @private
	 * @experimental since version 1.30. The behavior might change in the next version.
	 */
	UploadCollectionItem.prototype._updateDeprecatedProperties = function() {
		var aProperties = ["uploadedDate", "contributor", "fileSize"];
		this.removeAllAggregation("_propertyAttributes");
		jQuery.each(aProperties, function(i, sName) {
			var sValue = this.getProperty(sName),
				oAttribute = this._mDeprecatedProperties[sName];
			if (sValue) {
				if (oAttribute) {
					oAttribute.setText(sValue);
				} else {
					oAttribute = new ObjectAttribute({
						active : false,
						text : sValue
					});
					this._mDeprecatedProperties[sName] = oAttribute;
				}
				this.addAggregation("_propertyAttributes", oAttribute);
			} else {
				if (oAttribute) {
					oAttribute.destroy();
					delete this._mDeprecatedProperties[sName];
				}
			}
		}.bind(this));
	};

	/**
	 * @description Return all attributes, the deprecated property attributes and the aggregated attributes in one array
	 * @private
	 * @experimental since version 1.30. The behavior might change in the next version.
	 */
	UploadCollectionItem.prototype.getAllAttributes = function() {
		return this.getAggregation("_propertyAttributes", []).concat(this.getAttributes());
	};

	return UploadCollectionItem;

}, /* bExport= */true);
