let currentChart = null;

function calculateHalfLife(initialDose, halfLife, time) {
    return initialDose * Math.pow(0.5, time / halfLife);
}

function generateSingleDoseData(initialDose, halfLife, duration) {
    const data = [];
    const timePoints = Math.min(duration * 10, 1000);
    const interval = duration / timePoints;
    
    for (let i = 0; i <= timePoints; i++) {
        const time = i * interval;
        const concentration = calculateHalfLife(initialDose, halfLife, time);
        data.push({
            time: time,
            concentration: concentration
        });
    }
    
    return data;
}

function generateRepeatedDoseData(dose, halfLife, dosingInterval, duration) {
    const data = [];
    const hoursToSimulate = duration * 24;
    const timeResolution = 0.25; // 15 minute intervals for smooth curves
    const timePoints = Math.floor(hoursToSimulate / timeResolution);
    let doses = [];
    
    // Add initial dose
    doses.push({ time: 0, amount: dose });
    
    // Add all subsequent doses
    let doseTime = dosingInterval;
    while (doseTime <= hoursToSimulate) {
        doses.push({ time: doseTime, amount: dose });
        doseTime += dosingInterval;
    }
    
    // Calculate concentration at each time point
    for (let i = 0; i <= timePoints; i++) {
        const currentTime = i * timeResolution;
        let totalConcentration = 0;
        
        // Sum contribution from each dose
        for (const doseEvent of doses) {
            if (currentTime >= doseEvent.time) {
                const timeSinceDose = currentTime - doseEvent.time;
                const remainingAmount = calculateHalfLife(doseEvent.amount, halfLife, timeSinceDose);
                totalConcentration += remainingAmount;
            }
        }
        
        data.push({
            time: currentTime,
            concentration: totalConcentration
        });
    }
    
    return data;
}

function plotConcentration(data, title) {
    const ctx = document.getElementById('concentration-chart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.time.toFixed(1)),
            datasets: [{
                label: 'Concentration (mg)',
                data: data.map(d => d.concentration),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: 2,
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true
                },
                zoom: {
                    limits: {
                        x: {min: 'original', max: 'original'},
                        y: {min: 'original', max: 'original'}
                    },
                    zoom: {
                        wheel: {
                            enabled: true,
                            speed: 0.1
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: 'x',
                    },
                    pan: {
                        enabled: true,
                        mode: 'x',
                        rangeMin: {
                            x: 0
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (hours)'
                    },
                    ticks: {
                        callback: function(value, index) {
                            const labelValue = parseFloat(this.getLabelForValue(value));
                            if (labelValue % 24 === 0) {
                                return `Day ${labelValue / 24}`;
                            } else if (labelValue % 6 === 0) {
                                return labelValue + 'h';
                            }
                            return '';
                        },
                        maxRotation: 0
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Concentration (mg)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function calculateSteadyState(dose, halfLife, interval) {
    const k = 0.693 / halfLife;
    const steadyStateMax = dose / (1 - Math.exp(-k * interval));
    const steadyStateMin = steadyStateMax * Math.exp(-k * interval);
    const steadyStateAvg = (steadyStateMax + steadyStateMin) / 2;
    const timeToSteadyState = halfLife * 5;
    
    return {
        max: steadyStateMax,
        min: steadyStateMin,
        avg: steadyStateAvg,
        time: timeToSteadyState
    };
}

document.getElementById('single-dose-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const initialDose = parseFloat(document.getElementById('initial-dose').value);
    const halfLife = parseFloat(document.getElementById('half-life').value);
    const timePeriod = parseFloat(document.getElementById('time-period').value);
    
    const data = generateSingleDoseData(initialDose, halfLife, timePeriod);
    
    const resultsDiv = document.getElementById('single-results-text');
    resultsDiv.innerHTML = '';
    
    const keyPoints = [0, halfLife, halfLife * 2, halfLife * 3, halfLife * 4, halfLife * 5];
    const relevantPoints = keyPoints.filter(t => t <= timePeriod);
    
    relevantPoints.forEach(time => {
        const remaining = calculateHalfLife(initialDose, halfLife, time);
        const percentage = (remaining / initialDose * 100).toFixed(1);
        const halfLives = time / halfLife;
        
        const text = `At ${time} hours (${halfLives} half-lives): <span class="highlight">${remaining.toFixed(2)} mg (${percentage}%)</span><br>`;
        resultsDiv.innerHTML += text;
    });
    
    const finalAmount = calculateHalfLife(initialDose, halfLife, timePeriod);
    const finalPercentage = (finalAmount / initialDose * 100).toFixed(1);
    resultsDiv.innerHTML += `<br><strong>Final amount at ${timePeriod} hours: ${finalAmount.toFixed(2)} mg (${finalPercentage}%)</strong>`;
    
    plotConcentration(data, `Single Dose Decay - ${initialDose}mg with ${halfLife}h half-life`);
});

document.getElementById('repeated-dose-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const dose = parseFloat(document.getElementById('dose-amount').value);
    const halfLife = parseFloat(document.getElementById('dose-half-life').value);
    const interval = parseFloat(document.getElementById('dose-interval').value);
    const duration = parseFloat(document.getElementById('duration').value);
    
    const data = generateRepeatedDoseData(dose, halfLife, interval, duration);
    
    const steadyState = calculateSteadyState(dose, halfLife, interval);
    
    const resultsDiv = document.getElementById('repeated-results-text');
    resultsDiv.innerHTML = `
        Dosing: ${dose} mg every ${interval} hours<br>
        Half-life: ${halfLife} hours<br><br>
        <div class="steady-state">
            <strong>Steady State Information:</strong><br>
            Maximum concentration: <span class="highlight">${steadyState.max.toFixed(2)} mg</span><br>
            Minimum concentration: <span class="highlight">${steadyState.min.toFixed(2)} mg</span><br>
            Average concentration: <span class="highlight">${steadyState.avg.toFixed(2)} mg</span><br>
            Time to reach steady state: <span class="highlight">${steadyState.time.toFixed(1)} hours (${(steadyState.time/24).toFixed(1)} days)</span><br>
            Accumulation factor: <span class="highlight">${(steadyState.avg / dose).toFixed(2)}x</span>
        </div>
    `;
    
    plotConcentration(data, `Repeated Dosing - ${dose}mg every ${interval}h, ${halfLife}h half-life`);
});

function loadExample(type) {
    switch(type) {
        case 'short':
            if (document.getElementById('single').classList.contains('active')) {
                document.getElementById('initial-dose').value = 500;
                document.getElementById('half-life').value = 2;
                document.getElementById('time-period').value = 24;
            } else {
                document.getElementById('dose-amount').value = 100;
                document.getElementById('dose-half-life').value = 2;
                document.getElementById('dose-interval').value = 6;
                document.getElementById('duration').value = 3;
            }
            break;
        case 'medium':
            if (document.getElementById('single').classList.contains('active')) {
                document.getElementById('initial-dose').value = 20;
                document.getElementById('half-life').value = 36;
                document.getElementById('time-period').value = 168;
            } else {
                document.getElementById('dose-amount').value = 20;
                document.getElementById('dose-half-life').value = 36;
                document.getElementById('dose-interval').value = 24;
                document.getElementById('duration').value = 14;
            }
            break;
        case 'long':
            if (document.getElementById('single').classList.contains('active')) {
                document.getElementById('initial-dose').value = 10;
                document.getElementById('half-life').value = 1200;
                document.getElementById('time-period').value = 2400;
            } else {
                document.getElementById('dose-amount').value = 10;
                document.getElementById('dose-half-life').value = 1200;
                document.getElementById('dose-interval').value = 24;
                document.getElementById('duration').value = 60;
            }
            break;
    }
}

function resetZoom() {
    if (currentChart) {
        currentChart.resetZoom();
    }
}

document.getElementById('single-dose-form').dispatchEvent(new Event('submit'));