# Fiori Programming Model Analyzer for S/4HANA – Viewer

[![Run locally](https://img.shields.io/badge/npm-start-green?logo=npm)](#run-locally)

This repository contains the **Viewer App** of the **Fiori Programming Model Analyzer for S/4HANA**.  
It is a static **SAPUI5 application** to explore and filter
the datasets generated internally by the analyzer ABAP report (not yet available to the public)

👉 Live demo: [Viewer on GitHub Pages](https://alespad.github.io/s4-fiori-model-analyzer/)


## Background

The story and reference for this project can be found in this **SAP Community blog post**:  
[Is It RAP or BOPF? Fiori Programming Model Analyzer for S/4HANA](https://community.sap.com/t5/abap-blog-posts/is-it-rap-or-bopf-fiori-programming-model-analyzer-for-s-4hana/ba-p/14240651)

---

## What is this?

As ABAP/Fiori developers we often ask ourselves:

- *Is this standard Fiori app SEGW, BOPF, or RAP?*  
- *Which CDS entity or Business Object is behind it?*  
- *Is it enhanced with Flexible Programming Model?*  
- *What is the name of the SEGW Project?*  

This Viewer lets you **browse, filter, and explore** the results in a user-friendly way.

## Features

- 📂 Select the **data source** (release-specific JSON file, check data/sources.json)  
- 🔍 Filter by **Fiori Library ID**,  **App name**, **Entity name** or **Programming Model**
- 🔗 Direct link to the Fiori Apps Library entry  
- 📥 Downloadable CSV/JSON datasets (see `/docs/data/`)

## Using Your Own Data

Have you generated data on your S/4HANA system using the related project [**ABAP Generator**](https://github.com/alespad/s4-fiori-model-generator)?

### Steps to add your custom dataset:

1. **Generate the JSON/CSV file** using the ABAP Generator on your system
2. **Copy the generated JSON file** to the `docs/data/` folder
3. **Update `docs/data/sources.json`** to register your new dataset:
```json
{
  "sources": [
    {
      "id": "my-system",
      "label": "My S/4HANA System",
      "file": "data/my-system-results.json"
    }
  ]
}
```

## Run locally

You can run the Viewer locally using Node.js:

```bash
# install dependencies (only once)
npm install

# start local static server on http://localhost:3000
npm start



