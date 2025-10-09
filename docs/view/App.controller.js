sap.ui.define(
  ["sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator"],
  function (Controller, JSONModel, Filter, FilterOperator) {
    "use strict";
    return Controller.extend("s4.fiori.model.analyzer.view.App", {
      onInit: function () {
        this.sourcesModel = new JSONModel("data/sources.json");
        this.getView().byId("selSource").setModel(this.sourcesModel);
        
        this.sourcesModel.attachRequestCompleted(() => {
          const list = this.sourcesModel.getProperty("/sources") || [];
          if (list.length) {
            const sel = this.getView().byId("selSource");
            const file = list[0].file;
            sel.setSelectedKey(file);
            this._loadSource(file);
          }
        });
        
        // Model table
        this._dataModel = new JSONModel([]);
        this.getView().byId("tbl").setModel(this._dataModel);
        
        // Set default selected values for Programming Model filter (RAP and BOPF)
        const progModelCombo = this.getView().byId("selProgModel");
        progModelCombo.setSelectedKeys(["RAP", "BOPF"]);
      },
      
      // Reusable helper
      _loadSource: function (file) {
        if (!file) {
          this._dataModel.setData([]);
          return;
        }
        // Reload and apply filters
        this._dataModel.detachRequestCompleted(this._onDataLoaded, this);
        this._dataModel.attachRequestCompleted(this._onDataLoaded, this);
        this._dataModel.loadData(file);
      },
      
      _onDataLoaded: function () {
        var data = this._dataModel.getData();
        this._allData = Array.isArray(data) ? data : [];
        this.onFilter();
        this._dataModel.detachRequestCompleted(this._onDataLoaded, this);
      },
      
      onSourceChange: function (e) {
        var file = e.getSource().getSelectedKey();
        this._loadSource(file);
      },
      
      onFilter: function () {
        const id = (this.byId("inpFioriId").getValue() || "").trim();
        const app = (this.byId("inpAppName").getValue() || "").trim();
        const models = this.byId("selProgModel").getSelectedKeys();
        const entity = (this.byId("inpEntity").getValue() || "").trim();
        
        const aFilters = [];
        
        if (id) { 
          aFilters.push(new Filter("fioriId", FilterOperator.Contains, id)); 
        }
        if (app) { 
          aFilters.push(new Filter("appName", FilterOperator.Contains, app)); 
        }
        if (models && models.length > 0) {
          // Create OR filter for multiple programming models
          const modelFilters = models.map(function(model) {
            return new Filter("programmingModel", FilterOperator.EQ, model);
          });
          aFilters.push(new Filter({ filters: modelFilters, and: false }));
        }
        if (entity) { 
          aFilters.push(new Filter("businessEntity", FilterOperator.Contains, entity)); 
        }
        
        const oBinding = this.byId("tbl").getBinding("rows");
        if (oBinding) {
          oBinding.filter(aFilters, "Application");
        }
      },
      
      onClear: function() {
        this.byId("inpFioriId").setValue("");
        this.byId("inpAppName").setValue("");
        this.byId("selProgModel").setSelectedKeys(["RAP", "BOPF"]);
        this.byId("inpEntity").setValue("");
        this.onFilter();
      }
    });
  }
);
