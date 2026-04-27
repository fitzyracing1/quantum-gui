// Quantum Simulator Engine
class QuantumSimulator {
    constructor(numQubits) {
        this.numQubits = numQubits;
        this.stateSize = Math.pow(2, numQubits);
        this.state = new Array(this.stateSize).fill(0);
        this.state[0] = { real: 1, imag: 0 }; // Initialize to |0...0⟩
        this.circuit = [];
        this.measurementResults = [];
    }

    // Reset quantum state
    reset() {
        this.state = new Array(this.stateSize).fill(0);
        this.state[0] = { real: 1, imag: 0 };
        this.circuit = [];
        this.measurementResults = [];
    }

    // Complex number operations
    complexMultiply(a, b) {
        return {
            real: a.real * b.real - a.imag * b.imag,
            imag: a.real * b.imag + a.imag * b.real
        };
    }

    complexAdd(a, b) {
        return {
            real: a.real + b.real,
            imag: a.imag + b.imag
        };
    }

    magnitude(c) {
        return Math.sqrt(c.real * c.real + c.imag * c.imag);
    }

    // Apply Hadamard gate
    applyHadamard(qubit) {
        const newState = new Array(this.stateSize);
        const factor = 1 / Math.sqrt(2);
        
        for (let i = 0; i < this.stateSize; i++) {
            const bit = (i >> qubit) & 1;
            const pair = i ^ (1 << qubit);
            
            if (i < pair) continue;
            
            if (bit === 0) {
                newState[i] = this.complexAdd(
                    this.scaleComplex(this.state[i], factor),
                    this.scaleComplex(this.state[pair], factor)
                );
                newState[pair] = this.complexAdd(
                    this.scaleComplex(this.state[i], factor),
                    this.scaleComplex(this.state[pair], -factor)
                );
            }
        }
        
        for (let i = 0; i < this.stateSize; i++) {
            if (newState[i] !== undefined) {
                this.state[i] = newState[i];
            }
        }
        
        this.circuit.push({ gate: 'H', qubit });
    }

    scaleComplex(c, factor) {
        return {
            real: c.real * factor,
            imag: c.imag * factor
        };
    }

    // Apply Pauli-X gate (NOT gate)
    applyPauliX(qubit) {
        for (let i = 0; i < this.stateSize; i++) {
            const bit = (i >> qubit) & 1;
            if (bit === 0) {
                const pair = i ^ (1 << qubit);
                const temp = this.state[i];
                this.state[i] = this.state[pair];
                this.state[pair] = temp;
            }
        }
        this.circuit.push({ gate: 'X', qubit });
    }

    // Apply Pauli-Y gate
    applyPauliY(qubit) {
        const newState = [...this.state];
        for (let i = 0; i < this.stateSize; i++) {
            const bit = (i >> qubit) & 1;
            const pair = i ^ (1 << qubit);
            
            if (bit === 0) {
                newState[i] = { real: this.state[pair].imag, imag: -this.state[pair].real };
                newState[pair] = { real: -this.state[i].imag, imag: this.state[i].real };
            }
        }
        this.state = newState;
        this.circuit.push({ gate: 'Y', qubit });
    }

    // Apply Pauli-Z gate
    applyPauliZ(qubit) {
        for (let i = 0; i < this.stateSize; i++) {
            const bit = (i >> qubit) & 1;
            if (bit === 1) {
                this.state[i] = {
                    real: -this.state[i].real,
                    imag: -this.state[i].imag
                };
            }
        }
        this.circuit.push({ gate: 'Z', qubit });
    }

    // Apply CNOT gate
    applyCNOT(control, target) {
        for (let i = 0; i < this.stateSize; i++) {
            const controlBit = (i >> control) & 1;
            if (controlBit === 1) {
                const pair = i ^ (1 << target);
                if (i < pair) {
                    const temp = this.state[i];
                    this.state[i] = this.state[pair];
                    this.state[pair] = temp;
                }
            }
        }
        this.circuit.push({ gate: 'CNOT', control, target });
    }

    // Measure all qubits
    measure(shots = 1000) {
        const results = {};
        
        // Calculate probabilities
        const probabilities = this.state.map(c => {
            const mag = this.magnitude(c);
            return mag * mag;
        });
        
        // Perform measurements
        for (let shot = 0; shot < shots; shot++) {
            const rand = Math.random();
            let cumulative = 0;
            
            for (let i = 0; i < this.stateSize; i++) {
                cumulative += probabilities[i];
                if (rand < cumulative) {
                    const binaryString = i.toString(2).padStart(this.numQubits, '0');
                    results[binaryString] = (results[binaryString] || 0) + 1;
                    break;
                }
            }
        }
        
        this.measurementResults = results;
        return results;
    }

    // Get current state vector
    getState() {
        return this.state.map((c, i) => {
            const mag = this.magnitude(c);
            const prob = mag * mag;
            const binary = i.toString(2).padStart(this.numQubits, '0');
            return {
                binary,
                amplitude: c,
                probability: prob
            };
        }).filter(s => s.probability > 0.0001);
    }
}
