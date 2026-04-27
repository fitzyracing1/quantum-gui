# ⚛️ Quantum GUI Simulator

A web-based quantum computing simulator with visual circuit builder and ENOS energy calculator.

## Features

### 🔬 ENOS Energy Calculator
- Interactive calculator implementing the ENOS equation: **E = mc × 1 × 2 × 3 × 4 × 1 = 24mc**
- Real-time energy computation
- Adjustable mass parameter
- Uses speed of light constant (299,792,458 m/s)

### 🎯 Quantum Circuit Builder
- Visual circuit design interface
- Drag-and-drop gate placement
- Supported quantum gates:
  - **Hadamard (H)**: Creates superposition
  - **Pauli-X**: Quantum NOT gate
  - **Pauli-Y**: Y-axis rotation
  - **Pauli-Z**: Phase flip
  - **CNOT**: Controlled-NOT (entanglement)
  - **Measurement (M)**: Collapse to classical state

### 📊 Quantum State Visualizer
- Real-time state vector display
- Probability amplitude visualization
- Interactive probability bars
- Complex number representation

### 📈 Measurement Results
- Histogram visualization of measurement outcomes
- Statistical analysis (counts and probabilities)
- 1000-shot measurement sampling
- Sortable results table

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required!

### Installation

1. Clone or download this repository
2. Open `index.html` in your web browser

### Usage

#### ENOS Calculator
1. Enter the mass value (kg)
2. Click "Calculate Energy"
3. View the computed energy in Joules

#### Quantum Circuit Builder
1. Select a quantum gate from the control panel
2. Click on a qubit line to place the gate
3. Build your circuit by adding multiple gates
4. Click "Run Circuit" to execute and measure
5. View results in the histogram and statistics table

#### Controls
- **Gate Buttons**: Select which gate to place
- **Clear**: Reset the circuit
- **Run Circuit**: Execute and measure the quantum circuit
- **Update Qubits**: Change the number of qubits (1-5)

## Technical Details

### Architecture
- **Frontend**: Pure HTML5, CSS3, JavaScript (no frameworks)
- **Quantum Simulator**: Custom JavaScript implementation
- **Visualization**: HTML5 Canvas API

### Quantum Simulator
- Implements statevector simulation
- Complex number arithmetic
- Unitary gate operations
- Probabilistic measurement
- Supports up to 5 qubits (32 states)

### Files
- `index.html`: Main application interface
- `styles.css`: Styling and responsive design
- `quantum.js`: Quantum simulator engine
- `circuit.js`: Circuit and histogram visualization
- `app.js`: Application logic and event handling

## Examples

### Creating Bell State (Entanglement)
1. Set qubits to 2
2. Place Hadamard (H) on qubit 0
3. Place CNOT with control on qubit 0
4. Run circuit
5. Observe 50/50 split between |00⟩ and |11⟩

### Quantum Superposition
1. Place Hadamard (H) on qubit 0
2. Run circuit
3. Observe equal probability for |0⟩ and |1⟩

## ENOS Equation

The ENOS (Energy Number Operator Sequence) equation is:

```
E = mc × 1 × 2 × 3 × 4 × 1
E = 24mc
```

Where:
- E = Energy (Joules)
- m = Mass (kilograms)
- c = Speed of light (299,792,458 m/s)

For 1 kg of mass:
```
E = 24 × 1 × 299,792,458
E = 7,195,018,992 Joules
E ≈ 7.195 × 10^9 J
```

## Browser Compatibility

✅ Chrome/Edge (recommended)  
✅ Firefox  
✅ Safari  
✅ Opera

## License

MIT License - Feel free to use and modify!

## Contributing

Contributions welcome! Feel free to submit issues or pull requests.

## Acknowledgments

- Inspired by quantum computing principles
- Built with educational purposes in mind
- ENOS equation implementation

---

**Note**: This is a simulator for educational purposes. For production quantum computing, use IBM Qiskit, Google Cirq, or Microsoft Q#.
