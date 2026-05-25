# Historical Maps

Interactive Islamic history map with era-based choropleth regions, timeline navigation, scholars, events, and Greek influence context.

## Run Locally

```bash
./serve.sh
```

Then open:

```text
http://localhost:8000/
```

## Deploy With GitHub Pages

This repo is static and can be published directly with GitHub Pages.

1. Push the repo to GitHub.
2. Go to repository `Settings` > `Pages`.
3. Choose `Deploy from a branch`.
4. Select the branch and root folder.

The app entry point is `index.html`.

## Project Structure

```text
index.html          Main page
assets/app.css      App styles
assets/app.js       Map and timeline logic
data/               GeoJSON and historical context data
serve.sh            Local static server helper
```
