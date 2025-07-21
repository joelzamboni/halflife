# Half-Life Calculator

A simple, open-source web application for calculating and visualizing half-life decay patterns for medications and other substances.

## Live Demo

Visit the live application at: https://joelzamboni.github.io/halflife/

## Features

- **Single Dose Calculator**: Calculate how much substance remains after a given time period
- **Repeated Dosing Calculator**: Model accumulation patterns with regular dosing schedules
- **Interactive Visualizations**: Real-time charts showing concentration over time
- **Steady-State Analysis**: Calculate steady-state concentrations for repeated dosing
- **Example Presets**: Quick-load common scenarios (short, medium, and long half-lives)
- **Responsive Design**: Works on desktop and mobile devices

## Usage

1. Open `index.html` in a web browser
2. Choose between "Single Dose" or "Repeated Dosing" tabs
3. Enter your parameters:
   - For single dose: initial dose, half-life, and time period
   - For repeated dosing: dose amount, half-life, dosing interval, and duration
4. Click "Calculate" to see results and visualization
5. Use example buttons to load preset scenarios

## Understanding the Results

### Single Dose
- Shows remaining amount at key time points (each half-life)
- Displays percentage of original dose remaining
- Plots exponential decay curve

### Repeated Dosing
- Calculates steady-state concentrations (min, max, average)
- Shows accumulation factor
- Estimates time to reach steady state (5 half-lives)
- Visualizes the sawtooth pattern of peaks and troughs

## Examples

### Short Half-Life (2 hours)
- 500mg dose → 250mg after 2h → 125mg after 4h
- Rapid clearance, minimal accumulation with regular dosing

### Medium Half-Life (36 hours)
- 20mg daily dosing shows significant accumulation
- Steady state reached in ~7.5 days
- ~2.4x accumulation factor

### Long Half-Life (50 days)
- 10mg daily dosing leads to substantial accumulation
- Steady state takes months to achieve
- Very high accumulation factor

## Technical Details

- Pure JavaScript (no frameworks required)
- Uses Chart.js for visualizations
- Calculations based on first-order kinetics: C(t) = C₀ × (1/2)^(t/t½)
- Steady-state calculations use standard pharmacokinetic formulas

## Deployment

This project is automatically deployed to GitHub Pages when changes are pushed to the main branch.

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to Pages section
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The workflow will automatically deploy your site

### Manual Deployment

To deploy manually or to another hosting service:

1. Clone the repository
2. All files are static - simply upload to any web server
3. No build process required

### GitHub Actions Workflow

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:
- Triggers on pushes to the main branch
- Uploads the site content as an artifact
- Deploys to GitHub Pages using `actions/deploy-pages@v4`

## Local Development

To run the application locally:

```bash
# Clone the repository
git clone https://github.com/joelzamboni/halflife.git
cd halflife

# Open in browser (macOS)
open index.html

# Or use a local server (Python)
python -m http.server 8000

# Or use a local server (Node.js)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Disclaimer

This tool is for educational purposes only. Do not use for medical decisions. Always consult healthcare professionals for medication-related advice.

## License

Open source - feel free to use, modify, and distribute.
