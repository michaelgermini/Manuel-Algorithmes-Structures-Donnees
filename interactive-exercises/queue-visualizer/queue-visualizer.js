// Visualiseur Interactif des Files d'Attente
// Implémentation complète avec animations pour files FIFO et files de priorité

class QueueElement {
    constructor(value, priority = 1) {
        this.value = value;
        this.priority = priority;
        this.timestamp = Date.now(); // Pour gérer les égalités de priorité
    }
}

class Queue {
    constructor(type = 'fifo') {
        this.elements = [];
        this.type = type;
        this.operationCount = 0;
        this.front = 0;
        this.rear = 0;
    }

    enqueue(value, priority = 1) {
        this.operationCount++;
        const element = new QueueElement(value, priority);

        if (this.type === 'fifo') {
            this.elements.push(element);
        } else {
            // File de priorité : insérer selon la priorité
            let inserted = false;
            for (let i = 0; i < this.elements.length; i++) {
                if (element.priority < this.elements[i].priority ||
                    (element.priority === this.elements[i].priority && element.timestamp < this.elements[i].timestamp)) {
                    this.elements.splice(i, 0, element);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.elements.push(element);
            }
        }

        return this.size();
    }

    dequeue() {
        this.operationCount++;
        if (this.isEmpty()) return null;

        return this.elements.shift();
    }

    peek() {
        this.operationCount++;
        return this.isEmpty() ? null : this.elements[0];
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    size() {
        return this.elements.length;
    }

    clear() {
        this.elements = [];
        this.operationCount = 0;
    }

    toArray() {
        return this.elements.map(el => el.value);
    }

    getFront() {
        return this.isEmpty() ? null : this.elements[0].value;
    }

    getRear() {
        return this.isEmpty() ? null : this.elements[this.elements.length - 1].value;
    }

    getOperationCount() {
        return this.operationCount;
    }
}

class QueueVisualizer {
    constructor() {
        this.queue = new Queue('fifo');
        this.isSimulating = false;
        this.simulationInterval = null;

        this.initializeEventListeners();
        this.updateDisplay();
        this.addLogEntry('File initialisée - Type: FIFO', 'initial');
    }

    initializeEventListeners() {
        // Changement de type de file
        document.querySelectorAll('input[name="queueType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.changeQueueType(e.target.value);
            });
        });

        // Boutons d'opération
        document.getElementById('enqueueBtn').addEventListener('click', () => this.handleEnqueue());
        document.getElementById('dequeueBtn').addEventListener('click', () => this.handleDequeue());
        document.getElementById('peekBtn').addEventListener('click', () => this.handlePeek());
        document.getElementById('resetQueueBtn').addEventListener('click', () => this.handleReset());
        document.getElementById('simulateBtn').addEventListener('click', () => this.toggleSimulation());

        // Simulation
        document.getElementById('addCustomerBtn').addEventListener('click', () => this.addCustomer());
        document.getElementById('serveCustomerBtn').addEventListener('click', () => this.serveCustomer());
        document.getElementById('autoSimulateBtn').addEventListener('click', () => this.toggleAutoSimulation());

        // Gestion des entrées
        document.getElementById('valueInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleEnqueue();
            }
        });

        document.getElementById('priorityInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleEnqueue();
            }
        });
    }

    changeQueueType(type) {
        const currentElements = this.queue.elements.map(el => ({
            value: el.value,
            priority: el.priority
        }));

        this.queue = new Queue(type);
        this.queue.operationCount = 0;

        // Réinsérer les éléments dans le nouveau type
        currentElements.forEach(el => {
            this.queue.enqueue(el.value, el.priority);
        });

        this.updateTypeDisplay();
        this.updateDisplay();
        this.addLogEntry(`Type changé vers file ${type === 'fifo' ? 'FIFO' : 'de priorité'}`, 'initial');

        // Afficher/cacher les contrôles de priorité
        const priorityControls = document.getElementById('priorityControls');
        priorityControls.style.display = type === 'priority' ? 'flex' : 'none';
    }

    updateTypeDisplay() {
        const typeDisplay = document.getElementById('queueTypeDisplay');
        typeDisplay.textContent = this.queue.type === 'fifo' ? 'File FIFO' : 'File de Priorité';
    }

    handleEnqueue() {
        const value = document.getElementById('valueInput').value.trim();
        const priority = parseInt(document.getElementById('priorityInput').value) || 5;

        if (!value) {
            this.showError('Veuillez saisir une valeur');
            return;
        }

        const newSize = this.queue.enqueue(value, priority);
        this.animateEnqueue(value, priority);
        this.updateDisplay();
        this.addLogEntry(`ENQUEUE "${value}"${this.queue.type === 'priority' ? ` (priorité: ${priority})` : ''} → Taille: ${newSize}`, 'enqueue');

        document.getElementById('valueInput').value = '';
        document.getElementById('valueInput').focus();
    }

    handleDequeue() {
        if (this.queue.isEmpty()) {
            this.showError('La file est vide !');
            return;
        }

        const removedElement = this.queue.dequeue();
        this.animateDequeue();
        this.updateDisplay();
        this.addLogEntry(`DEQUEUE "${removedElement.value}" → Taille: ${this.queue.size()}`, 'dequeue');
    }

    handlePeek() {
        const frontElement = this.queue.peek();
        if (!frontElement) {
            this.showError('La file est vide !');
            return;
        }

        this.animatePeek();
        this.addLogEntry(`PEEK "${frontElement.value}" (élément conservé)`, 'peek');
    }

    handleReset() {
        this.queue.clear();
        this.stopAutoSimulation();
        this.updateDisplay();
        this.addLogEntry('RESET → File vidée', 'initial');
        this.updateSimulationStats();
    }

    toggleSimulation() {
        const simulationPanel = document.getElementById('simulationPanel');
        const isVisible = simulationPanel.style.display !== 'none';

        if (isVisible) {
            simulationPanel.style.display = 'none';
            this.stopAutoSimulation();
        } else {
            simulationPanel.style.display = 'block';
            this.addLogEntry('Mode simulation activé', 'initial');
        }
    }

    addCustomer() {
        const customerNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];
        const randomName = customerNames[Math.floor(Math.random() * customerNames.length)];
        const priority = Math.floor(Math.random() * 4) + 1; // 1-4

        document.getElementById('valueInput').value = `Client ${randomName}`;
        if (this.queue.type === 'priority') {
            document.getElementById('priorityInput').value = priority;
        }

        this.handleEnqueue();
    }

    serveCustomer() {
        if (this.queue.isEmpty()) {
            this.showError('Aucun client en attente !');
            return;
        }

        const servedCustomer = this.queue.dequeue();
        this.animateDequeue();
        this.updateDisplay();

        // Mettre à jour les statistiques de simulation
        const servedCount = parseInt(document.getElementById('servedCount').textContent) + 1;
        document.getElementById('servedCount').textContent = servedCount;

        this.addLogEntry(`🍽️ SERVI: ${servedCustomer.value}`, 'dequeue');
        this.updateSimulationStats();
    }

    toggleAutoSimulation() {
        const btn = document.getElementById('autoSimulateBtn');

        if (this.isSimulating) {
            this.stopAutoSimulation();
            btn.textContent = '▶️ Simulation Auto';
            btn.className = 'btn btn-secondary';
        } else {
            this.startAutoSimulation();
            btn.textContent = '⏸️ Arrêter Auto';
            btn.className = 'btn btn-warning';
        }
    }

    startAutoSimulation() {
        this.isSimulating = true;
        this.simulationInterval = setInterval(() => {
            // Ajouter un client (probabilité 70%)
            if (Math.random() < 0.7) {
                this.addCustomer();
            }

            // Servir un client si la file n'est pas vide (probabilité 60%)
            if (!this.queue.isEmpty() && Math.random() < 0.6) {
                this.serveCustomer();
            }
        }, 2000);
    }

    stopAutoSimulation() {
        this.isSimulating = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
    }

    animateEnqueue(value, priority) {
        setTimeout(() => {
            const elements = document.querySelectorAll('.queue-element');
            if (elements.length > 0) {
                const lastElement = elements[elements.length - 1];
                lastElement.classList.add('enqueuing');
                setTimeout(() => {
                    lastElement.classList.remove('enqueuing');
                }, 500);
            }
        }, 50);
    }

    animateDequeue() {
        const elements = document.querySelectorAll('.queue-element');
        if (elements.length > 0) {
            const firstElement = elements[0];
            firstElement.classList.add('dequeuing');
            // L'élément sera supprimé par updateDisplay()
        }
    }

    animatePeek() {
        const elements = document.querySelectorAll('.queue-element');
        if (elements.length > 0) {
            const firstElement = elements[0];
            firstElement.classList.add('front');
            setTimeout(() => {
                firstElement.classList.remove('front');
            }, 2000);
        }
    }

    updateDisplay() {
        const container = document.getElementById('queueVisualization');
        container.innerHTML = '';

        if (this.queue.isEmpty()) {
            container.innerHTML = `
                <div class="empty-queue">
                    <p>📭 File vide</p>
                    <small>Cliquez sur "Enfiler" pour ajouter des éléments</small>
                </div>
            `;
        } else {
            this.queue.elements.forEach((element, index) => {
                const elementDiv = this.createQueueElement(element, index);
                container.appendChild(elementDiv);
            });
        }

        this.updateStats();
    }

    createQueueElement(element, index) {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'queue-element';

        // Classes spéciales
        if (index === 0) elementDiv.classList.add('front');

        if (this.queue.type === 'priority') {
            if (element.priority <= 2) elementDiv.classList.add('priority-high');
            else if (element.priority <= 4) elementDiv.classList.add('priority-medium');
            else elementDiv.classList.add('priority-low');
        }

        elementDiv.innerHTML = `
            <div class="element-value">${element.value}</div>
            ${this.queue.type === 'priority' ? `<div class="element-priority">P${element.priority}</div>` : ''}
            <div class="element-position">${index + 1}</div>
        `;

        return elementDiv;
    }

    updateStats() {
        document.getElementById('queueSize').textContent = this.queue.size();
        document.getElementById('queueFront').textContent = this.queue.getFront() || '-';
        document.getElementById('queueRear').textContent = this.queue.getRear() || '-';
    }

    updateSimulationStats() {
        // Calcul du temps d'attente moyen (simplifié)
        const servedCount = parseInt(document.getElementById('servedCount').textContent);
        if (servedCount > 0) {
            const avgTime = Math.floor(Math.random() * 10) + 5; // Simulation
            document.getElementById('avgWaitTime').textContent = `${avgTime}s`;
        }
    }

    addLogEntry(message, type = 'info') {
        const logContainer = document.getElementById('operationsLog');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Limiter à 20 entrées
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 20) {
            logContainer.removeChild(entries[0]);
        }
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInError 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutError 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Fonctions pour les exercices

function loadCheckoutExercise() {
    const visualizer = window.queueVisualizer;
    visualizer.handleReset();
    visualizer.changeQueueType('fifo');

    const customers = ['A', 'B', 'C', 'D', 'E'];
    const servedOrder = [];

    // Ajouter les clients
    customers.forEach(customer => {
        document.getElementById('valueInput').value = customer;
        visualizer.handleEnqueue();
    });

    // Simuler le service (FIFO)
    setTimeout(() => {
        let serveInterval = setInterval(() => {
            if (!visualizer.queue.isEmpty()) {
                const served = visualizer.queue.dequeue();
                servedOrder.push(served.value);
                visualizer.animateDequeue();
                visualizer.updateDisplay();
                visualizer.addLogEntry(`🍽️ Client ${served.value} servi`, 'dequeue');
            } else {
                clearInterval(serveInterval);

                const resultDiv = document.getElementById('checkoutResult');
                resultDiv.innerHTML = `
                    <h4>Résultat de l'Exercice 1</h4>
                    <p><strong>Ordre d'arrivée :</strong> ${customers.join(' → ')}</p>
                    <p><strong>Ordre de service :</strong> ${servedOrder.join(' → ')}</p>
                    <p><strong>Principe FIFO respecté :</strong> ✅ ${customers.join('') === servedOrder.join('') ? 'Oui' : 'Non'}</p>
                    <p><em>Dans une file FIFO, le premier arrivé est le premier servi.</em></p>
                `;
            }
        }, 1000);
    }, 1000);
}

function loadTriageExercise() {
    const visualizer = window.queueVisualizer;
    visualizer.handleReset();
    visualizer.changeQueueType('priority');

    // Patients avec différents niveaux d'urgence
    const patients = [
        { name: 'Patient Rouge', priority: 1 }, // Urgence vitale
        { name: 'Patient Jaune', priority: 3 }, // Stable
        { name: 'Patient Orange', priority: 2 }, // Urgent
        { name: 'Patient Vert', priority: 4 }, // Mineur
        { name: 'Patient Rouge 2', priority: 1 } // Urgence vitale
    ];

    // Ajouter les patients
    patients.forEach(patient => {
        document.getElementById('valueInput').value = patient.name;
        document.getElementById('priorityInput').value = patient.priority;
        visualizer.handleEnqueue();
    });

    // Simuler le triage
    setTimeout(() => {
        let triageInterval = setInterval(() => {
            if (!visualizer.queue.isEmpty()) {
                const treated = visualizer.queue.dequeue();
                visualizer.animateDequeue();
                visualizer.updateDisplay();

                const priorityText = treated.priority === 1 ? '🔴 Critique' :
                                   treated.priority === 2 ? '🟠 Urgent' :
                                   treated.priority === 3 ? '🟡 Stable' : '🟢 Mineur';

                visualizer.addLogEntry(`🏥 ${treated.value} traité (${priorityText})`, 'dequeue');
            } else {
                clearInterval(triageInterval);

                const resultDiv = document.getElementById('triageResult');
                resultDiv.innerHTML = `
                    <h4>Résultat de l'Exercice 2</h4>
                    <p>Les patients ont été traités selon leur priorité :</p>
                    <ol>
                        <li><strong>🔴 Priorité 1 (Critique)</strong> : Patients rouges traités en premier</li>
                        <li><strong>🟠 Priorité 2 (Urgent)</strong> : Patients oranges ensuite</li>
                        <li><strong>🟡 Priorité 3 (Stable)</strong> : Patients jaunes après</li>
                        <li><strong>🟢 Priorité 4 (Mineur)</strong> : Patients verts en dernier</li>
                    </ol>
                    <p><em>Les files de priorité permettent de traiter d'abord les cas les plus urgents.</em></p>
                `;
            }
        }, 1500);
    }, 1000);
}

function compareQueueTypes() {
    const resultDiv = document.getElementById('comparisonResult');
    resultDiv.innerHTML = '<p>🔄 Comparaison en cours...</p>';

    // Même ensemble de données pour les deux types
    const tasks = [
        { name: 'Tâche Importante', priority: 1 },
        { name: 'Tâche Normale', priority: 3 },
        { name: 'Tâche Urgent', priority: 2 },
        { name: 'Tâche Mineure', priority: 4 },
        { name: 'Tâche Critique', priority: 1 }
    ];

    // Test FIFO
    const fifoQueue = new Queue('fifo');
    tasks.forEach(task => fifoQueue.enqueue(task.name, task.priority));
    const fifoOrder = [];
    while (!fifoQueue.isEmpty()) {
        fifoOrder.push(fifoQueue.dequeue().value);
    }

    // Test Priority Queue
    const priorityQueue = new Queue('priority');
    tasks.forEach(task => priorityQueue.enqueue(task.name, task.priority));
    const priorityOrder = [];
    while (!priorityQueue.isEmpty()) {
        priorityOrder.push(priorityQueue.dequeue().value);
    }

    resultDiv.innerHTML = `
        <h4>Comparaison FIFO vs File de Priorité</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
                <h5 style="color: #28a745;">File FIFO</h5>
                <p><strong>Ordre d'arrivée :</strong> ${tasks.map(t => t.name.split(' ')[1]).join(' → ')}</p>
                <p><strong>Ordre de traitement :</strong> ${fifoOrder.map(t => t.split(' ')[1]).join(' → ')}</p>
                <p><strong>Principe :</strong> Premier arrivé, premier servi</p>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
                <h5 style="color: #1976d2;">File de Priorité</h5>
                <p><strong>Ordre d'arrivée :</strong> ${tasks.map(t => t.name.split(' ')[1]).join(' → ')}</p>
                <p><strong>Ordre de traitement :</strong> ${priorityOrder.map(t => t.split(' ')[1]).join(' → ')}</p>
                <p><strong>Principe :</strong> Plus haute priorité d'abord</p>
            </div>
        </div>

        <p><strong>Conclusion :</strong></p>
        <ul>
            <li><strong>FIFO</strong> : Respecte l'ordre chronologique</li>
            <li><strong>Priorité</strong> : Optimise selon l'importance/urgence</li>
            <li><strong>Choix</strong> : Dépend du contexte d'utilisation</li>
        </ul>
    `;
}

// Styles CSS pour les animations d'erreur
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInError {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutError {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.queueVisualizer = new QueueVisualizer();
});

