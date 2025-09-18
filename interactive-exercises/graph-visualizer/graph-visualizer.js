// Visualiseur Interactif des Graphes - BFS et DFS

class GraphNode {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.visited = false;
        this.visiting = false;
        this.distance = Infinity;
        this.parent = null;
    }
}

class GraphVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.nodes = new Map();
        this.edges = [];
        this.animationSpeed = 1000;

        this.initializeGraphPresets();
        this.loadPreset('simple');
        this.draw();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('loadPresetBtn').addEventListener('click', () => {
            const preset = document.getElementById('graphPreset').value;
            this.loadPreset(preset);
        });

        document.getElementById('bfsBtn').addEventListener('click', () => this.runBFS());
        document.getElementById('dfsBtn').addEventListener('click', () => this.runDFS());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    }

    initializeGraphPresets() {
        this.presets = {
            simple: {
                nodes: [
                    { id: 'A', x: 100, y: 150 },
                    { id: 'B', x: 250, y: 100 },
                    { id: 'C', x: 400, y: 150 },
                    { id: 'D', x: 250, y: 200 }
                ],
                edges: [
                    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']
                ]
            },
            tree: {
                nodes: [
                    { id: 'A', x: 250, y: 50 },
                    { id: 'B', x: 150, y: 120 },
                    { id: 'C', x: 350, y: 120 },
                    { id: 'D', x: 100, y: 190 },
                    { id: 'E', x: 200, y: 190 },
                    { id: 'F', x: 300, y: 190 },
                    { id: 'G', x: 400, y: 190 }
                ],
                edges: [
                    ['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['C', 'G']
                ]
            },
            cycle: {
                nodes: [
                    { id: 'A', x: 200, y: 100 },
                    { id: 'B', x: 350, y: 100 },
                    { id: 'C', x: 400, y: 250 },
                    { id: 'D', x: 150, y: 250 },
                    { id: 'E', x: 275, y: 300 }
                ],
                edges: [
                    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'], ['A', 'E'], ['B', 'E']
                ]
            },
            complex: {
                nodes: [
                    { id: 'A', x: 150, y: 100 }, { id: 'B', x: 300, y: 100 },
                    { id: 'C', x: 450, y: 100 }, { id: 'D', x: 150, y: 200 },
                    { id: 'E', x: 300, y: 200 }, { id: 'F', x: 450, y: 200 },
                    { id: 'G', x: 225, y: 300 }, { id: 'H', x: 375, y: 300 }
                ],
                edges: [
                    ['A', 'B'], ['B', 'C'], ['A', 'D'], ['B', 'E'], ['C', 'F'],
                    ['D', 'E'], ['E', 'F'], ['D', 'G'], ['E', 'H'], ['F', 'H'], ['G', 'H']
                ]
            }
        };
    }

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        this.nodes.clear();
        this.edges = [];

        // Créer les nœuds
        preset.nodes.forEach(nodeData => {
            const node = new GraphNode(nodeData.id, nodeData.x, nodeData.y);
            this.nodes.set(nodeData.id, node);
        });

        // Créer les arêtes
        this.edges = preset.edges.map(([from, to]) => [from, to]);

        // Mettre à jour le sélecteur de nœud de départ
        const startNodeSelect = document.getElementById('startNode');
        startNodeSelect.innerHTML = '';
        Array.from(this.nodes.keys()).forEach(nodeId => {
            const option = document.createElement('option');
            option.value = nodeId;
            option.textContent = nodeId;
            startNodeSelect.appendChild(option);
        });

        this.reset();
        this.showSteps('Graphe chargé: ' + presetName);
    }

    async runBFS() {
        const startId = document.getElementById('startNode').value;
        await this.bfs(startId);
    }

    async runDFS() {
        const startId = document.getElementById('startNode').value;
        await this.dfs(startId);
    }

    async bfs(startId) {
        // Réinitialiser
        this.resetNodes();

        const queue = [];
        const startNode = this.nodes.get(startId);
        startNode.visited = true;
        startNode.distance = 0;
        queue.push(startNode);

        const steps = ['Démarrage BFS depuis ' + startId];
        let stepCount = 1;

        while (queue.length > 0) {
            const currentNode = queue.shift();

            // Marquer comme en cours de visite
            currentNode.visiting = true;
            this.draw();
            steps.push(`${stepCount}. Traitement de ${currentNode.id} (distance: ${currentNode.distance})`);
            await this.delay();

            // Visiter les voisins
            const neighbors = this.getNeighbors(currentNode.id);
            for (const neighborId of neighbors) {
                const neighbor = this.nodes.get(neighborId);
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    neighbor.distance = currentNode.distance + 1;
                    neighbor.parent = currentNode;
                    queue.push(neighbor);
                    steps.push(`   → Ajout de ${neighborId} à la file`);
                }
            }

            currentNode.visiting = false;
            stepCount++;
            this.draw();
            await this.delay();
        }

        this.showSteps(steps.join('\n'));
    }

    async dfs(startId) {
        // Réinitialiser
        this.resetNodes();

        const stack = [];
        const startNode = this.nodes.get(startId);
        startNode.visited = true;
        startNode.distance = 0;
        stack.push(startNode);

        const steps = ['Démarrage DFS depuis ' + startId];
        let stepCount = 1;

        while (stack.length > 0) {
            const currentNode = stack.pop();

            // Marquer comme en cours de visite
            currentNode.visiting = true;
            this.draw();
            steps.push(`${stepCount}. Traitement de ${currentNode.id}`);
            await this.delay();

            // Visiter les voisins (dans l'ordre inverse pour la pile)
            const neighbors = this.getNeighbors(currentNode.id).reverse();
            for (const neighborId of neighbors) {
                const neighbor = this.nodes.get(neighborId);
                if (!neighbor.visited) {
                    neighbor.visited = true;
                    neighbor.distance = currentNode.distance + 1;
                    neighbor.parent = currentNode;
                    stack.push(neighbor);
                    steps.push(`   → Empile ${neighborId}`);
                }
            }

            currentNode.visiting = false;
            stepCount++;
            this.draw();
            await this.delay();
        }

        this.showSteps(steps.join('\n'));
    }

    getNeighbors(nodeId) {
        return this.edges
            .filter(([from, to]) => from === nodeId || to === nodeId)
            .map(([from, to]) => from === nodeId ? to : from);
    }

    reset() {
        this.resetNodes();
        this.draw();
        this.showSteps('Cliquez sur BFS ou DFS pour commencer');
    }

    resetNodes() {
        for (const node of this.nodes.values()) {
            node.visited = false;
            node.visiting = false;
            node.distance = Infinity;
            node.parent = null;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner les arêtes
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        for (const [fromId, toId] of this.edges) {
            const fromNode = this.nodes.get(fromId);
            const toNode = this.nodes.get(toId);

            // Couleur selon l'état des nœuds
            if (fromNode.visited && toNode.visited) {
                this.ctx.strokeStyle = '#28a745';
            } else if (fromNode.visiting || toNode.visiting) {
                this.ctx.strokeStyle = '#ffc107';
            } else {
                this.ctx.strokeStyle = '#333';
            }

            this.ctx.beginPath();
            this.ctx.moveTo(fromNode.x, fromNode.y);
            this.ctx.lineTo(toNode.x, toNode.y);
            this.ctx.stroke();

            // Flèche
            this.drawArrow(fromNode.x, fromNode.y, toNode.x, toNode.y);
        }

        // Dessiner les nœuds
        for (const node of this.nodes.values()) {
            this.drawNode(node);
        }
    }

    drawNode(node) {
        // Couleur selon l'état
        let color = '#4CAF50'; // Non visité
        if (node.visiting) color = '#ffc107'; // En cours
        if (node.visited) color = '#28a745'; // Visité

        // Cercle
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Texte
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.id, node.x, node.y);

        // Distance si définie
        if (node.distance !== Infinity && node.distance > 0) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(node.distance.toString(), node.x + 20, node.y - 20);
        }
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headlen = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);

        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    showSteps(steps) {
        document.getElementById('stepsContainer').innerHTML = steps.replace(/\n/g, '<br>');
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.animationSpeed));
    }
}

// Fonctions pour les exercices
function loadCycleGraph() {
    document.getElementById('graphPreset').value = 'cycle';
    document.getElementById('loadPresetBtn').click();
}

function demonstrateCycleDetection() {
    const result = document.getElementById('cycleResult');
    result.innerHTML = `
        <h4>Détection de Cycles</h4>
        <p><strong>Avec le graphe actuel :</strong></p>
        <ul>
            <li>DFS utilise 3 couleurs : Blanc (non visité), Gris (en cours), Noir (terminé)</li>
            <li>Un cycle est détecté si on trouve un arc vers un nœud Gris</li>
            <li>Cela permet de détecter les dépendances circulaires</li>
        </ul>
    `;
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new GraphVisualizer('graphCanvas');
});
