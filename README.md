# Fiori Programming Model Analyzer for S/4HANA – Viewer

[![Run locally](https://img.shields.io/badge/npm-start-green?logo=npm)](#run-locally)

This repository contains the **Viewer App** of the **Fiori Programming Model Analyzer for S/4HANA**.  
It is a static **SAPUI5 application** to explore and filter
the datasets generated internally by the analyzer ABAP report (not yet available to the public)

👉 Live demo: [Viewer on GitHub Pages](https://alespad.github.io/s4-fiori-model-analyzer/)

---

## What is this?

As ABAP/Fiori developers we often ask ourselves:

- *Is this standard Fiori app SEGW, BOPF, or RAP?*  
- *Which CDS entity or Business Object is behind it?*  
- *Is it enhanced with Flexible Programming Model?*  

This Viewer lets you **browse, filter, and explore** the results in a user-friendly way.

---

## Features

- 📂 Select the **data source** (release-specific JSON file, e.g. `s4h2023fps2.json`)  
- 🔍 Filter by **Fiori Library ID** or **App name**  
- 📊 Tabular view built with **sap.ui.table.Table**  
- 🔗 Direct link to the Fiori Apps Library entry  
- 📥 Downloadable CSV/JSON datasets (see `/docs/data/`)

## Run locally

You can run the Viewer locally using Node.js:

```bash
# install dependencies (only once)
npm install

# start local static server on http://localhost:3000
npm start



