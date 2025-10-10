sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
  "use strict";
  return UIComponent.extend("s4.fiori.model.analyzer.Component", {
    metadata: { manifest: "json" },
    init: function() {
      UIComponent.prototype.init.apply(this, arguments);
      
      // Initialize router
      this.getRouter().initialize();
    }
  });
});
