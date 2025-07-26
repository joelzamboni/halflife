# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web application for calculating and visualizing half-life decay patterns for medications and other substances. The application uses vanilla JavaScript with Chart.js for visualizations. No build process or package manager is required.

## Common Commands

### Local Development

Run a local web server to view the application:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server
```

Then navigate to http://localhost:8000

### Deployment

The project automatically deploys to GitHub Pages via GitHub Actions when changes are pushed to the main branch. The deployment workflow is defined in `.github/workflows/deploy.yml`.

## Architecture

The application consists of 4 main files:

- **index.html**: Main HTML structure with tabs for Single Dose and Repeated Dosing calculators
- **app.js**: Core JavaScript logic containing:
  - `calculateHalfLife()`: Implements first-order kinetics formula C(t) = C₀ × (1/2)^(t/t½)
  - `generateSingleDoseData()`: Generates decay curve data points
  - `generateRepeatedDoseData()`: Models accumulation patterns with regular dosing
  - `calculateSteadyState()`: Computes steady-state concentrations using pharmacokinetic formulas
  - Chart.js integration for interactive visualizations with zoom/pan capabilities
- **styles.css**: Responsive CSS styling
- **.github/workflows/deploy.yml**: GitHub Actions workflow for automatic deployment

The application uses Chart.js (loaded via CDN) for creating interactive concentration-time graphs with zoom and pan functionality.

## Key Features Implementation

- **Single Dose Calculator**: Shows exponential decay at each half-life interval and elimination times
- **Repeated Dosing Calculator**: Models sawtooth accumulation patterns and calculates steady-state parameters
- **Elimination Time Calculator**: Calculates how long a substance remains in the system after stopping
  - `calculateEliminationTime()`: Uses formula t = -log₂(remaining_fraction) × half-life
  - Shows time to reach various elimination thresholds (90%, 95%, 99%, 99.9%, 99.99%)
  - Integrated into single dose and repeated dosing results
- **Example Presets**: Three pre-configured scenarios (short, medium, long half-lives) loaded via `loadExample()`
- **Interactive Charts**: Uses Chart.js with zoom plugin for desktop (mouse wheel) and mobile (pinch) interaction