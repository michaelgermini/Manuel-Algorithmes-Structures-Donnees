# Chapitre 14 : Projets Pratiques

## 🎮 Visualisation de A* : Pathfinding Interactif

**Objectif** : Créer une visualisation interactive de l'algorithme A* sur une grille avec obstacles.

### 🛠️ Technologies Utilisées

- HTML5 Canvas pour le rendu graphique
- JavaScript ES6+ pour la logique
- A* avec distance de Manhattan comme heuristique

### 📁 Structure du Projet

```
astar-visualization/
├── index.html
├── style.css
├── script.js
└── README.md
```

### 🎨 Interface Utilisateur

- **Grille cliquable** : définir départ, arrivée, obstacles
- **Boutons de contrôle** : jouer, pause, reset, vitesse
- **Légende** : couleurs pour chaque état (visité, chemin, etc.)
- **Informations** : longueur du chemin, nœuds explorés

### 💻 Implémentation Complète

#### index.html
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visualisation A* - Pathfinding</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>🧭 Visualisation de l'Algorithme A*</h1>

        <div class="controls">
            <button id="playBtn">▶️ Jouer</button>
            <button id="pauseBtn">⏸️ Pause</button>
            <button id="resetBtn">🔄 Reset</button>
            <label>
                Vitesse:
                <input type="range" id="speedSlider" min="1" max="100" value="50">
            </label>
            <button id="clearBtn">🗑️ Effacer Obstacles</button>
        </div>

        <div class="info">
            <div id="pathLength">Longueur du chemin: -</div>
            <div id="nodesExplored">Nœuds explorés: -</div>
            <div id="status">Cliquez pour placer départ (vert) et arrivée (rouge)</div>
        </div>

        <canvas id="gridCanvas" width="800" height="600"></canvas>

        <div class="legend">
            <div class="legend-item">
                <div class="color-box" style="background-color: #4CAF50;"></div>
                <span>Départ</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: #f44336;"></div>
                <span>Arrivée</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: #2196F3;"></div>
                <span>Chemin final</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: #FFEB3B;"></div>
                <span>Exploré</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: #9C27B0;"></div>
                <span>À explorer</span>
            </div>
            <div class="legend-item">
                <div class="color-box" style="background-color: #000000;"></div>
                <span>Obstacle</span>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```

#### style.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    padding: 20px;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.controls {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    background: #007bff;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
}

button:hover {
    background: #0056b3;
}

button:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.info {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 5px;
}

.legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 5px;
}

.color-box {
    width: 20px;
    height: 20px;
    border-radius: 3px;
}

#gridCanvas {
    display: block;
    margin: 0 auto;
    border: 2px solid #333;
    border-radius: 5px;
    cursor: crosshair;
}
```

#### script.js
```javascript
class AStarVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Configuration de la grille
        this.gridSize = 20;
        this.cols = Math.floor(this.canvas.width / this.gridSize);
        this.rows = Math.floor(this.canvas.height / this.gridSize);

        // États
        this.grid = this.createGrid();
        this.start = null;
        this.end = null;
        this.isPlaying = false;
        this.animationSpeed = 50;

        // État de l'algorithme
        this.openSet = [];
        this.closedSet = [];
        this.path = [];
        this.current = null;

        // Gestion des événements
        this.setupEventListeners();
        this.draw();

        // Scores pour A*
        this.gScore = {};
        this.fScore = {};
        this.cameFrom = {};
    }

    createGrid() {
        return Array(this.rows).fill().map(() =>
            Array(this.cols).fill(0) // 0: vide, 1: obstacle, 2: start, 3: end
        );
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => {
            if (this.isPlaying) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.gridSize);
            const y = Math.floor((e.clientY - rect.top) / this.gridSize);

            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                this.handleCellClick(x, y);
            }
        });

        // Contrôles
        document.getElementById('playBtn').addEventListener('click', () => this.play());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearObstacles());
        document.getElementById('speedSlider').addEventListener('input', (e) => {
            this.animationSpeed = 101 - e.target.value; // Inverser pour que plus haut = plus rapide
        });
    }

    handleCellClick(x, y) {
        if (!this.start) {
            this.start = [x, y];
            this.grid[y][x] = 2;
            this.updateStatus("Cliquez pour placer l'arrivée (rouge)");
        } else if (!this.end) {
            this.end = [x, y];
            this.grid[y][x] = 3;
            this.updateStatus("Cliquez pour placer des obstacles (noir) ou appuyez sur Jouer");
        } else {
            // Toggle obstacle
            if (this.grid[y][x] === 0) {
                this.grid[y][x] = 1;
            } else if (this.grid[y][x] === 1) {
                this.grid[y][x] = 0;
            }
        }
        this.draw();
    }

    play() {
        if (!this.start || !this.end) {
            alert("Placez d'abord le départ et l'arrivée !");
            return;
        }

        this.isPlaying = true;
        this.initializeAStar();
        this.animate();
    }

    pause() {
        this.isPlaying = false;
    }

    reset() {
        this.isPlaying = false;
        this.grid = this.createGrid();
        this.start = null;
        this.end = null;
        this.openSet = [];
        this.closedSet = [];
        this.path = [];
        this.current = null;
        this.gScore = {};
        this.fScore = {};
        this.cameFrom = {};
        this.updateStatus("Cliquez pour placer départ (vert) et arrivée (rouge)");
        this.updateInfo("-", "-");
        this.draw();
    }

    clearObstacles() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                if (this.grid[y][x] === 1) {
                    this.grid[y][x] = 0;
                }
            }
        }
        this.draw();
    }

    initializeAStar() {
        this.openSet = [this.start];
        this.closedSet = [];
        this.gScore = {};
        this.fScore = {};
        this.cameFrom = {};

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const key = `${x},${y}`;
                this.gScore[key] = Infinity;
                this.fScore[key] = Infinity;
            }
        }

        const startKey = `${this.start[0]},${this.start[1]}`;
        this.gScore[startKey] = 0;
        this.fScore[startKey] = this.heuristic(this.start, this.end);
    }

    heuristic(a, b) {
        // Distance de Manhattan
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    animate() {
        if (!this.isPlaying) return;

        if (this.step()) {
            setTimeout(() => this.animate(), this.animationSpeed);
        } else {
            this.isPlaying = false;
            this.updateStatus("Chemin trouvé !");
        }
    }

    step() {
        if (this.openSet.length === 0) {
            this.updateStatus("Aucun chemin trouvé !");
            return false;
        }

        // Trouver le nœud avec le plus petit fScore
        let lowestIndex = 0;
        for (let i = 0; i < this.openSet.length; i++) {
            const currentKey = `${this.openSet[i][0]},${this.openSet[i][1]}`;
            const lowestKey = `${this.openSet[lowestIndex][0]},${this.openSet[lowestIndex][1]}`;

            if (this.fScore[currentKey] < this.fScore[lowestKey]) {
                lowestIndex = i;
            }
        }

        this.current = this.openSet[lowestIndex];

        // Vérifier si on a atteint l'arrivée
        if (this.current[0] === this.end[0] && this.current[1] === this.end[1]) {
            this.reconstructPath();
            return false;
        }

        // Retirer de openSet, ajouter à closedSet
        this.openSet.splice(lowestIndex, 1);
        this.closedSet.push(this.current);

        // Explorer les voisins
        const neighbors = this.getNeighbors(this.current);

        for (let neighbor of neighbors) {
            const neighborKey = `${neighbor[0]},${neighbor[1]}`;

            if (this.closedSet.some(n => n[0] === neighbor[0] && n[1] === neighbor[1])) {
                continue;
            }

            const currentKey = `${this.current[0]},${this.current[1]}`;
            const tentativeGScore = this.gScore[currentKey] + 1; // Distance = 1 pour chaque mouvement

            if (!this.openSet.some(n => n[0] === neighbor[0] && n[1] === neighbor[1])) {
                this.openSet.push(neighbor);
            } else if (tentativeGScore >= this.gScore[neighborKey]) {
                continue;
            }

            this.cameFrom[neighborKey] = this.current;
            this.gScore[neighborKey] = tentativeGScore;
            this.fScore[neighborKey] = this.gScore[neighborKey] + this.heuristic(neighbor, this.end);
        }

        this.draw();
        return true;
    }

    getNeighbors([x, y]) {
        const neighbors = [];
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Droite, bas, gauche, haut

        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows &&
                this.grid[ny][nx] !== 1) { // Pas d'obstacle
                neighbors.push([nx, ny]);
            }
        }

        return neighbors;
    }

    reconstructPath() {
        this.path = [];
        let current = this.end;
        const startKey = `${this.start[0]},${this.start[1]}`;
        const endKey = `${this.end[0]},${this.end[1]}`;

        while (current) {
            this.path.unshift(current);
            const currentKey = `${current[0]},${current[1]}`;

            if (currentKey === startKey) break;

            current = this.cameFrom[currentKey];
        }

        this.updateInfo(this.path.length - 1, this.closedSet.length);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la grille
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                let color = '#ffffff';

                if (this.grid[y][x] === 1) {
                    color = '#000000'; // Obstacle
                } else if (this.grid[y][x] === 2) {
                    color = '#4CAF50'; // Départ
                } else if (this.grid[y][x] === 3) {
                    color = '#f44336'; // Arrivée
                } else if (this.closedSet.some(n => n[0] === x && n[1] === y)) {
                    color = '#FFEB3B'; // Exploré
                } else if (this.openSet.some(n => n[0] === x && n[1] === y)) {
                    color = '#9C27B0'; // À explorer
                }

                // Dessiner le chemin final
                if (this.path.some(p => p[0] === x && p[1] === y) &&
                    !(x === this.start[0] && y === this.start[1]) &&
                    !(x === this.end[0] && y === this.end[1])) {
                    color = '#2196F3'; // Chemin
                }

                this.ctx.fillStyle = color;
                this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);

                // Bordures
                this.ctx.strokeStyle = '#ddd';
                this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
            }
        }
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    updateInfo(pathLength, nodesExplored) {
        document.getElementById('pathLength').textContent = `Longueur du chemin: ${pathLength}`;
        document.getElementById('nodesExplored').textContent = `Nœuds explorés: ${nodesExplored}`;
    }
}

// Initialiser la visualisation
const visualization = new AStarVisualization('gridCanvas');
```

### 🚀 Améliorations Possibles

- **Diagonales** : permettre les mouvements diagonaux
- **Différentes heuristiques** : Manhattan, Euclidienne, Chebyshev
- **Poids variables** : terrains avec différents coûts
- **Plusieurs chemins** : afficher tous les chemins optimaux
- **Animations** : transitions fluides entre états
- **Export/Import** : sauvegarder et charger des grilles

---

## 🧮 Autres Projets Suggérés

### 1. Moteur de Recherche Simplifié

**Objectif** : Implémenter un moteur de recherche avec indexation utilisant des tables de hachage.

**Fonctionnalités** :
- Indexation de documents
- Recherche par mots-clés
- Classement par pertinence (TF-IDF)
- Interface web simple

### 2. Simulateur de Réseau Social

**Objectif** : Modéliser les connexions sociales avec des graphes.

**Fonctionnalités** :
- Ajout/Suppression d'utilisateurs
- Création de relations (amis)
- Suggestion d'amis (BFS/DFS)
- Analyse de connexions (composants connexes)

### 3. Planificateur de Tâches

**Objectif** : Ordonnancement de tâches avec contraintes utilisant des graphes orientés.

**Fonctionnalités** :
- Définition de tâches avec dépendances
- Calcul du chemin critique
- Détection de cycles (dépendances circulaires)
- Visualisation du planning

### 4. Compression de Texte (Huffman)

**Objectif** : Implémenter l'algorithme de Huffman pour compresser du texte.

**Fonctionnalités** :
- Analyse des fréquences de caractères
- Construction de l'arbre de Huffman
- Encodage/Décodage
- Calcul du taux de compression

### 5. Système de Cache LRU

**Objectif** : Implémenter un cache LRU (Least Recently Used) avec tables de hachage.

**Fonctionnalités** :
- Stockage clé-valeur
- Éjection automatique des anciens éléments
- Interface d'administration
- Statistiques d'utilisation

---

## 📋 Structure Générique d'un Projet

Chaque projet devrait contenir :

1. **README.md** - Description, installation, utilisation
2. **Code source** - Bien structuré et commenté
3. **Tests** - Cas de test pour valider le fonctionnement
4. **Documentation** - Explication des algorithmes utilisés
5. **Interface** - Web, console, ou graphique selon le besoin

### 🧪 Tests Recommandés

```javascript
// Exemple de tests pour le projet A*
describe('A* Pathfinding', () => {
  test('trouve le chemin simple', () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0], // Obstacle au milieu
      [0, 0, 0]
    ];
    const result = aStar(grid, [0, 0], [2, 2]);
    expect(result.path).toEqual([[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]);
  });

  test('retourne null si pas de chemin', () => {
    const grid = [
      [0, 1, 0],
      [0, 1, 0], // Mur bloquant
      [0, 1, 0]
    ];
    const result = aStar(grid, [0, 0], [2, 2]);
    expect(result).toBeNull();
  });
});
```

---

## 🎯 Critères d'Évaluation

Pour chaque projet, évaluez :

- **Fonctionnalité** : Toutes les fonctionnalités demandées
- **Performance** : Complexité algorithmique appropriée
- **Code** : Lisibilité, structure, commentaires
- **Tests** : Couverture des cas limites
- **Interface** : Utilisabilité et design

---

## 🔗 Ressources Supplémentaires

- **Visualgo** : Visualisations interactives d'algorithmes
- **LeetCode** : Plateforme de problèmes algorithmiques
- **GeeksforGeeks** : Explications détaillées d'algorithmes
- **MDN Web Docs** : Référence JavaScript
- **freeCodeCamp** : Tutoriels et projets pratiques

---

*Chapitre suivant : [Quiz et Exercices](15-quizzes-exercises.md)*
