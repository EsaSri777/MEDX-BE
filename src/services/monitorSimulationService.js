class MonitorSimulationService {
    constructor() {
        this.simulationIntervals = new Map();
    }

    generateVitalSigns() {
        return {
            heartRate: Math.floor(60 + Math.random() * 40), // 60-100 bpm
            bloodPressure: {
                systolic: Math.floor(110 + Math.random() * 30), // 110-140 mmHg
                diastolic: Math.floor(70 + Math.random() * 20)  // 70-90 mmHg
            },
            oxygenSaturation: Math.floor(95 + Math.random() * 5), // 95-100%
            temperature: (36.5 + Math.random() * 1.5).toFixed(1), // 36.5-38.0°C
            respiratoryRate: Math.floor(12 + Math.random() * 8), // 12-20 breaths/min
            endTidalCO2: Math.floor(35 + Math.random() * 10) // 35-45 mmHg
        };
    }

    startSimulation(patientId, socket) {
        // Clear any existing simulation for this patient
        this.stopSimulation(patientId);

        // Create new simulation interval
        const interval = setInterval(() => {
            const vitalSigns = this.generateVitalSigns();
            socket.emit('patient-vitals', {
                patientId,
                timestamp: new Date().toISOString(),
                ...vitalSigns
            });
        }, 1000); // Generate data every second

        this.simulationIntervals.set(patientId, interval);
    }

    stopSimulation(patientId) {
        const existingInterval = this.simulationIntervals.get(patientId);
        if (existingInterval) {
            clearInterval(existingInterval);
            this.simulationIntervals.delete(patientId);
        }
    }
}

const monitorService = new MonitorSimulationService();
export default monitorService;