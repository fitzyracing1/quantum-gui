// Main Application Logic
let simulator;
let circuitViz;
let histogramViz;
let selectedGate = null;
let selectedQubit = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quantum simulator
    const numQubits = parseInt(document.getElementById('qubitCount').value);
    simulator = new QuantumSimulator(numQubits);
    
    // Initialize visualizers
    circuitViz = new CircuitVisualizer('circuitCanvas');
    histogramViz = new HistogramVisualizer('histogramCanvas');
    
    // Set up event listeners
    setupENOSCalculator();
    setupCircuitBuilder();
    updateStateDisplay();
});

// ENOS Calculator Setup
function setupENOSCalculator() {
    const calculateBtn = document.getElementById('calculateBtn');
    const massInput = document.getElementById('mass');
    const speedInput = document.getElementById('speed');
    const resultDiv = document.getElementById('result');
    
    calculateBtn.addEventListener('click', () => {
        const m = parseFloat(massInput.value);
        const c = parseFloat(speedInput.value);
        
        // ENOS Equation: E = mc × 1 × 2 × 3 × 4 × 1 = 24mc
        const energy = 24 * m * c;
        
        resultDiv.innerHTML = `
            <div>
                <strong>Energy (E):</strong> ${energy.toExponential(4)} Joules
                <br>
                <small>E = 24 × ${m} kg × ${c.toExponential(2)} m/s</small>
            </div>
        `;
    });
    
    // Calculate on load
    calculateBtn.click();
}

// Circuit Builder Setup
function setupCircuitBuilder() {
    // Gate button selection
    const gateButtons = document.querySelectorAll('.gate-btn');
    gateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            gateButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedGate = btn.dataset.gate;
        });
    });
    
    // Canvas click for adding gates
    const canvas = document.getElementById('circuitCanvas');
    canvas.addEventListener('click', (e) => {
        if (!selectedGate) {
            alert('Please select a gate first');
            return;
        }
        
        const rect = canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const qubitSpacing = (canvas.height - 40) / (simulator.numQubits + 1);
        
        // Determine which qubit was clicked
        let clickedQubit = -1;
        for (let i = 0; i < simulator.numQubits; i++) {
            const qy = (i + 1) * qubitSpacing + 20;
            if (Math.abs(y - qy) < 25) {
                clickedQubit = i;
                break;
            }
        }
        
        if (clickedQubit === -1) return;
        
        // Apply gate
        applyGate(selectedGate, clickedQubit);
    });
    
    // Clear circuit
    document.getElementById('clearCircuit').addEventListener('click', () => {
        simulator.reset();
        circuitViz.clear();
        updateStateDisplay();
        histogramViz.draw({});
        document.getElementById('measurements').innerHTML = '';
    });
    
    // Run circuit
    document.getElementById('runCircuit').addEventListener('click', () => {
        const results = simulator.measure(1000);
        histogramViz.draw(results, 1000);
        displayMeasurements(results);
    });
    
    // Update qubits
    document.getElementById('updateQubits').addEventListener('click', () => {
        const numQubits = parseInt(document.getElementById('qubitCount').value);
        simulator = new QuantumSimulator(numQubits);
        circuitViz.setQubits(numQubits);
        circuitViz.clear();
        updateStateDisplay();
    });
}

function applyGate(gate, qubit) {
    try {
        switch (gate) {
            case 'H':
                simulator.applyHadamard(qubit);
                circuitViz.addGate('H', qubit);
                break;
            case 'X':
                simulator.applyPauliX(qubit);
                circuitViz.addGate('X', qubit);
                break;
            case 'Y':
                simulator.applyPauliY(qubit);
                circuitViz.addGate('Y', qubit);
                break;
            case 'Z':
                simulator.applyPauliZ(qubit);
                circuitViz.addGate('Z', qubit);
                break;
            case 'CNOT':
                if (simulator.numQubits < 2) {
                    alert('CNOT requires at least 2 qubits');
                    return;
                }
                const control = qubit;
                const target = (qubit + 1) % simulator.numQubits;
                simulator.applyCNOT(control, target);
                circuitViz.addGate('CNOT', target, control);
                break;
            case 'M':
                circuitViz.addGate('M', qubit);
                break;
        }
        updateStateDisplay();
    } catch (error) {
        console.error('Error applying gate:', error);
        alert('Error applying gate: ' + error.message);
    }
}

function updateStateDisplay() {
    const stateDisplay = document.getElementById('stateDisplay');
    const probabilityBars = document.getElementById('probabilityBars');
    const state = simulator.getState();
    
    // Update state vector display
    let stateHTML = '<div class="state-vector"><p><strong>Current State:</strong></p>';
    state.forEach(s => {
        const amp = s.amplitude;
        const ampStr = `${amp.real.toFixed(3)}${amp.imag >= 0 ? '+' : ''}${amp.imag.toFixed(3)}i`;
        stateHTML += `<p>${ampStr} |${s.binary}⟩ (${(s.probability * 100).toFixed(2)}%)</p>`;
    });
    stateHTML += '</div>';
    stateDisplay.innerHTML = stateHTML;
    
    // Update probability bars
    probabilityBars.innerHTML = '';
    state.forEach(s => {
        const barDiv = document.createElement('div');
        barDiv.className = 'prob-bar';
        
        const percentage = s.probability * 100;
        barDiv.innerHTML = `
            <span class="prob-label">|${s.binary}⟩</span>
            <div class="prob-fill" style="width: ${percentage}%">
                <span class="prob-value">${percentage.toFixed(2)}%</span>
            </div>
        `;
        probabilityBars.appendChild(barDiv);
    });
}

function displayMeasurements(results) {
    const measurementsDiv = document.getElementById('measurements');
    const totalShots = Object.values(results).reduce((a, b) => a + b, 0);
    
    let html = '<h3>Measurement Statistics:</h3>';
    html += `<p>Total Shots: ${totalShots}</p>`;
    html += '<table style="width: 100%; border-collapse: collapse;">';
    html += '<tr style="background: #667eea; color: white;"><th style="padding: 10px;">State</th><th>Count</th><th>Probability</th></tr>';
    
    Object.entries(results)
        .sort((a, b) => b[1] - a[1])
        .forEach(([state, count]) => {
            const prob = (count / totalShots * 100).toFixed(2);
            html += `<tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 10px;">|${state}⟩</td>
                <td style="padding: 10px;">${count}</td>
                <td style="padding: 10px;">${prob}%</td>
            </tr>`;
        });
    
    html += '</table>';
    measurementsDiv.innerHTML = html;
}

// Handle window resize
window.addEventListener('resize', () => {
    if (circuitViz) {
        circuitViz.resize();
        circuitViz.draw();
    }
    if (histogramViz) {
        histogramViz.resize();
        histogramViz.draw(simulator.measurementResults || {});
    }
});
