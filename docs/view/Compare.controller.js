sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
  "use strict";

  return Controller.extend("s4.fiori.model.analyzer.view.Compare", {
    
    onInit: function () {
      // Load sources list
      this.sourcesModel = new JSONModel("data/sources.json");
      this.getView().byId("selSource1").setModel(this.sourcesModel);
      this.getView().byId("selSource2").setModel(this.sourcesModel);

      // Model for comparison results
      this.compareModel = new JSONModel({
        showResults: false,
        compareResults: [],
        allResults: [],
        source1Label: "",
        source2Label: "",
        filterType: "all",
        filteredCount: 0
      });
      this.getView().setModel(this.compareModel);

      // Store loaded data
      this.source1Data = null;
      this.source2Data = null;
    },

    onNavBack: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.navTo("home");
    },

    onSourceSelect: function () {
      // Reset results when selection changes
      this.compareModel.setProperty("/showResults", false);
      this.compareModel.setProperty("/compareResults", []);
      this.compareModel.setProperty("/allResults", []);
      this.compareModel.setProperty("/filterType", "all");
      this.compareModel.setProperty("/filteredCount", 0);
      this.source1Data = null;
      this.source2Data = null;
    },

    onCompare: function () {
      const source1File = this.byId("selSource1").getSelectedKey();
      const source2File = this.byId("selSource2").getSelectedKey();

      if (!source1File || !source2File) {
        MessageToast.show("Please select both sources");
        return;
      }

      if (source1File === source2File) {
        MessageToast.show("Please select different sources");
        return;
      }

      // Get labels for column headers
      const source1Label = this.byId("selSource1").getSelectedItem().getText();
      const source2Label = this.byId("selSource2").getSelectedItem().getText();
      this.compareModel.setProperty("/source1Label", source1Label);
      this.compareModel.setProperty("/source2Label", source2Label);

      this.getView().setBusy(true);

      // Load both sources
      Promise.all([
        this._loadJSON(source1File),
        this._loadJSON(source2File)
      ]).then(([data1, data2]) => {
        this.source1Data = data1;
        this.source2Data = data2;
        this._performComparison();
        this.getView().setBusy(false);
      }).catch(err => {
        MessageToast.show("Error loading data: " + err.message);
        this.getView().setBusy(false);
      });
    },

    _loadJSON: function (file) {
      return new Promise((resolve, reject) => {
        const model = new JSONModel();
        model.attachRequestCompleted(() => {
          const data = model.getData();
          resolve(Array.isArray(data) ? data : []);
        });
        model.attachRequestFailed(() => {
          reject(new Error("Failed to load " + file));
        });
        model.loadData(file);
      });
    },

    _performComparison: function () {
      const data1 = this.source1Data || [];
      const data2 = this.source2Data || [];

      // Create maps by fioriId
      const map1 = new Map();
      const map2 = new Map();

      data1.forEach(item => {
        if (item.fioriId) {
          map1.set(item.fioriId, item);
        }
      });

      data2.forEach(item => {
        if (item.fioriId) {
          map2.set(item.fioriId, item);
        }
      });

      // Get all unique keys
      const allKeys = new Set([...map1.keys(), ...map2.keys()]);
      const results = [];

      allKeys.forEach(key => {
        const item1 = map1.get(key);
        const item2 = map2.get(key);

        let changeType = null;
        let changeIcon = "";
        let changeColor = "";
        let changeText = "";

        if (item1 && !item2) {
          // Removed: present in Source1 but not in Source2
          changeType = "removed";
          changeIcon = "sap-icon://less";
          changeColor = "#BB0000";
          changeText = "Removed";
        } else if (!item1 && item2) {
          // New: not in Source1 but present in Source2
          changeType = "new";
          changeIcon = "sap-icon://add";
          changeColor = "#107E3E";
          changeText = "New";
        } else if (item1 && item2) {
          // Check for changes in programmingModel or businessEntity
          const modelChanged = item1.programmingModel !== item2.programmingModel;
          const entityChanged = item1.businessEntity !== item2.businessEntity;

          if (modelChanged || entityChanged) {
            changeType = "changed";
            changeIcon = "sap-icon://edit";
            changeColor = "#E78C07";
            changeText = "Changed";
          } else {
            // No changes - skip this item
            return;
          }
        }

        // Only add items with differences
        if (changeType) {
          results.push({
            fioriId: (item1 || item2).fioriId,
            appName: (item1 || item2).appName,
            programmingModelSource1: item1 ? item1.programmingModel : "-",
            programmingModelSource2: item2 ? item2.programmingModel : "-",
            businessEntitySource1: item1 ? item1.businessEntity : "-",
            businessEntitySource2: item2 ? item2.businessEntity : "-",
            libraryLink: (item1 || item2).libraryLink,
            changeType: changeType,
            changeIcon: changeIcon,
            changeColor: changeColor,
            changeText: changeText
          });
        }
      });

      // Sort by change type: removed, changed, new
      const typeOrder = { removed: 1, changed: 2, new: 3 };
      results.sort((a, b) => {
        const orderDiff = typeOrder[a.changeType] - typeOrder[b.changeType];
        if (orderDiff !== 0) return orderDiff;
        return (a.fioriId || "").localeCompare(b.fioriId || "");
      });

      this.compareModel.setProperty("/compareResults", results);
      this.compareModel.setProperty("/allResults", results);
      this.compareModel.setProperty("/showResults", true);
      this.compareModel.setProperty("/filterType", "all");
      this.compareModel.setProperty("/filteredCount", results.length);

      // Show summary
      const removed = results.filter(r => r.changeType === "removed").length;
      const changed = results.filter(r => r.changeType === "changed").length;
      const newItems = results.filter(r => r.changeType === "new").length;

      MessageToast.show(
        `Comparison completed: ${removed} removed, ${changed} changed, ${newItems} new`
      );
    },

    onFilterChange: function (oEvent) {
      const filterType = oEvent.getParameter("item").getKey();
      this.compareModel.setProperty("/filterType", filterType);

      const allResults = this.compareModel.getProperty("/allResults");
      let filteredResults = allResults;

      if (filterType !== "all") {
        filteredResults = allResults.filter(item => item.changeType === filterType);
      }

      this.compareModel.setProperty("/compareResults", filteredResults);
      this.compareModel.setProperty("/filteredCount", filteredResults.length);
    }
  });
});