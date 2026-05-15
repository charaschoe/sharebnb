# ShareBnB Data Visualization

ShareBnB is an interactive data visualization about Airbnb pressure in New York,
Tokyo, and Paris. The interface keeps the original vertical hover-card concept:
hover a city card to open a responsive 2x2 data stage with key figures, context,
and two city-specific visualizations.

## Current Release State

This version repairs the project after the layout and visualization regressions:

- The hover-card accordion now fills the browser dynamically without black side
  bands or page scrolling on ordinary desktop/laptop sizes.
- City titles stay aligned at the same height across ShareBnB, New York, Tokyo,
  and Paris.
- Expanded city panels use a shared responsive stage:
  - KPI block
  - context text block
  - primary visualization slot
  - secondary visualization slot
- Visualization slots have fixed gutters and contained frames so charts do not
  overlap titles, text, captions, or each other.
- New York dot hover no longer changes layout height.
- New York borough bubbles are larger and clickable.
- Tokyo pack chart is clickable and can drill into neighborhood distribution.
- Paris availability canvas renders correctly before the slider is touched.
- Hovering city cards no longer changes the city background color.

## Run Locally

Use a local static server from the project root:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/index.html
```

The app loads local JSON/JS data files, so opening `index.html` directly from the
filesystem is not recommended.

## Project Structure

```text
sharebnb-main/
├── index.html
├── css/
│   ├── layout.css
│   ├── tabs.css
│   ├── tab-interaction.css
│   ├── content.css
│   └── city/chart-specific styles
├── js/
│   ├── script.js
│   ├── newyork.js
│   ├── bubbles_newyork.js
│   ├── script_tokyo.js
│   ├── script_tokyo2.js
│   ├── barchart.js
│   └── circle.js
├── data/
│   ├── newyork.json
│   ├── paris.json
│   ├── tokyo.js
│   ├── apartments.js
│   └── population.js
└── libraries/
    └── local visualization dependencies
```

## Interaction Notes

- Hover over a vertical card to open that city.
- New York:
  - Hover the dot grid to see the affordability note.
  - Click borough bubbles to update the caption with listing share.
- Tokyo:
  - Click a room type bubble to inspect neighborhood distribution.
  - Click inside the chart area to reset.
- Paris:
  - Hover bars in the minimum-nights chart for details.
  - Move the slider to update the availability dot canvas.

## Verification Checklist

Before publishing changes, check:

- `http://127.0.0.1:8000/index.html` opens with no console errors.
- ShareBnB, New York, Tokyo, and Paris all open on hover.
- At desktop sizes around `1800x1000`, `1440x900`, `1200x800`, and `1000x700`,
  no chart or text spills outside its panel.
- Resizing while a city is open keeps charts centered and contained.
- Paris canvas is visible before touching the slider.

## Credits

- Project lead: Dr. Franklin Hernández Castro
- Course: Data Visualization, HfG Schwäbisch Gmünd IG3
- Team: Jonas Wienberg, Marlon Mutlu, Philipp Maginot
- Technologies: D3.js, HTML, CSS, JavaScript
