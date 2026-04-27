// Circuit Visualization
class CircuitVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gates = [];
        this.numQubits = 2;
        this.resize();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 40;
        this.canvas.height = Math.max(300, 80 * this.numQubits + 40);
    }

    setQubits(num) {
        this.numQubits = num;
        this.resize();
    }

    clear() {
        this.gates = [];
        this.draw();
    }

    addGate(gate, qubit, control = null) {
        this.gates.push({ gate, qubit, control });
        this.draw();
    }

    draw() {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        const qubitSpacing = (height - 40) / (this.numQubits + 1);
        const gateWidth = 50;
        const gateSpacing = 80;
        
        // Draw qubit lines
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        for (let i = 0; i < this.numQubits; i++) {
            const y = (i + 1) * qubitSpacing + 20;
            ctx.beginPath();
            ctx.moveTo(20, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
            
            // Draw qubit label
            ctx.fillStyle = '#667eea';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`q${i}`, 5, y + 5);
        }
        
        // Draw gates
        this.gates.forEach((gateInfo, index) => {
            const x = 60 + index * gateSpacing;
            const y = (gateInfo.qubit + 1) * qubitSpacing + 20;
            
            if (gateInfo.gate === 'CNOT' && gateInfo.control !== null) {
                // Draw CNOT
                const cy = (gateInfo.control + 1) * qubitSpacing + 20;
                
                // Control dot
                ctx.fillStyle = '#667eea';
                ctx.beginPath();
                ctx.arc(x + gateWidth / 2, cy, 8, 0, 2 * Math.PI);
                ctx.fill();
                
                // Line connecting control and target
                ctx.beginPath();
                ctx.moveTo(x + gateWidth / 2, cy);
                ctx.lineTo(x + gateWidth / 2, y);
                ctx.stroke();
                
                // Target circle
                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(x + gateWidth / 2, y, 15, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Target cross
                ctx.beginPath();
                ctx.moveTo(x + gateWidth / 2 - 10, y);
                ctx.lineTo(x + gateWidth / 2 + 10, y);
                ctx.moveTo(x + gateWidth / 2, y - 10);
                ctx.lineTo(x + gateWidth / 2, y + 10);
                ctx.stroke();
                
                ctx.lineWidth = 2;
            } else if (gateInfo.gate === 'M') {
                // Draw measurement
                ctx.strokeStyle = '#764ba2';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y - 20, gateWidth, 40);
                
                ctx.fillStyle = '#764ba2';
                ctx.font = 'bold 20px Arial';
                ctx.fillText('M', x + 15, y + 7);
            } else {
                // Draw single-qubit gate
                const gradient = ctx.createLinearGradient(x, y - 20, x, y + 20);
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, y - 20, gateWidth, 40);
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 18px Arial';
                ctx.fillText(gateInfo.gate, x + (gateWidth - ctx.measureText(gateInfo.gate).width) / 2, y + 6);
            }
        });
    }
}

// Histogram Visualization
class HistogramVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth - 50;
        this.canvas.height = 250;
    }

    draw(results, totalShots = 1000) {
        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        if (Object.keys(results).length === 0) {
            ctx.fillStyle = '#999';
            ctx.font = '16px Arial';
            ctx.fillText('No measurement results yet', width / 2 - 100, height / 2);
            return;
        }
        
        const states = Object.keys(results).sort();
        const barWidth = (width - 60) / states.length;
        const maxCount = Math.max(...Object.values(results));
        const scale = (height - 60) / maxCount;
        
        // Draw bars
        states.forEach((state, i) => {
            const count = results[state];
            const barHeight = count * scale;
            const x = 40 + i * barWidth;
            const y = height - 40 - barHeight;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(x, y, x, height - 40);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 10, barHeight);
            
            // Draw count
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.save();
            ctx.translate(x + barWidth / 2, y - 5);
            ctx.textAlign = 'center';
            ctx.fillText(count, 0, 0);
            ctx.restore();
            
            // Draw state label
            ctx.save();
            ctx.translate(x + barWidth / 2, height - 25);
            ctx.rotate(-Math.PI / 4);
            ctx.textAlign = 'right';
            ctx.fillText('|' + state + '⟩', 0, 0);
            ctx.restore();
        });
        
        // Draw axes
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(35, height - 40);
        ctx.lineTo(width - 20, height - 40);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(35, 20);
        ctx.lineTo(35, height - 40);
        ctx.stroke();
        
        // Y-axis label
        ctx.fillStyle = '#333';
        ctx.font = 'bold 14px Arial';
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.fillText('Counts', 0, 0);
        ctx.restore();
    }
}
