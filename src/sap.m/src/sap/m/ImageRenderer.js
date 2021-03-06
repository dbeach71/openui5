/*!
 * ${copyright}
 */

// Provides default renderer for control sap.m.Image
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Image renderer. 
	 * @author SAP SE
	 * @namespace
	 */
	var ImageRenderer = {
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	ImageRenderer.render = function(rm, oImage){
		var alt = oImage.getAlt(),
			tooltip = oImage.getTooltip_AsString(),
			myTabIndex = 0,
			bHasPressHandlers = oImage.hasListeners("press");

		// Open the <img> tag
		rm.write("<img");
	
		rm.writeAttributeEscaped("src", oImage._getDensityAwareSrc());
		rm.writeControlData(oImage);

		rm.addClass("sapMImg");
		if (oImage.hasListeners("press") || oImage.hasListeners("tap")) {
			rm.addClass("sapMPointer");
		}

		if (oImage.getUseMap() || !oImage.getDecorative()) {
			rm.addClass("sapMImgFocusable");
		}

		rm.writeClasses();

		//TODO implement the ImageMap control
		var sUseMap = oImage.getUseMap();
		if (sUseMap) {
			if (!(jQuery.sap.startsWith(sUseMap, "#"))) {
				sUseMap = "#" + sUseMap;
			}
			rm.writeAttributeEscaped("useMap", sUseMap);
		}

		if (oImage.getDecorative() && !sUseMap && !bHasPressHandlers) {
			rm.writeAttribute("role", "presentation");
			rm.writeAttribute("aria-hidden", "true");
			rm.write(" alt=''"); // accessibility requirement: write always empty alt attribute for decorative images
		} else {
			if (alt || tooltip) {
				rm.writeAttributeEscaped("alt", alt || tooltip);
			}
		}

		if (alt || tooltip) {
			rm.writeAttributeEscaped("aria-label", alt || tooltip);
		}

		if (tooltip) {
			rm.writeAttributeEscaped("title", tooltip);
		}

		if (bHasPressHandlers) {
			rm.writeAttribute("role", "button");
		} else {
			myTabIndex = -1;
		}
		rm.writeAttribute("tabIndex", myTabIndex);

		// Dimensions
		if (oImage.getWidth() && oImage.getWidth() != '') {
			rm.addStyle("width", oImage.getWidth());
		}
		if (oImage.getHeight() && oImage.getHeight() != '') {
			rm.addStyle("height", oImage.getHeight());
		}
		rm.writeStyles();

		rm.write(" />"); // close the <img> element
	};

	return ImageRenderer;

}, /* bExport= */ true);
