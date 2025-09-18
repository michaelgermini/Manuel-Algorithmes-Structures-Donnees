# Chapitre 13 : Algorithmes de Plus Court Chemin

## 🛣️ Le Problème du Plus Court Chemin

Dans un graphe pondéré, trouver le chemin de coût minimum entre deux sommets.

**Applications** :
- GPS : itinéraire le plus rapide
- Jeux vidéo : IA de déplacement
- Réseaux : routage de paquets
- Logistique : optimisation de trajets

---

## ⚡ Algorithme de Dijkstra

**Inventeur** : Edsger Dijkstra (1956)

**Principe** : Exploration progressive des sommets les plus proches.

### Étapes

1. Initialiser les distances : départ = 0, autres = ∞
2. Sélectionner le sommet non visité de distance minimale
3. Mettre à jour les distances des voisins
4. Répéter jusqu'à destination atteinte

### Implémentation

```javascript
function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  // Initialisation
  for (let vertex of Object.keys(graph)) {
    distances[vertex] = vertex === start ? 0 : Infinity;
    unvisited.add(vertex);
  }

  while (unvisited.size > 0) {
    // Trouver le sommet non visité de distance minimale
    let current = null;
    let minDistance = Infinity;

    for (let vertex of unvisited) {
      if (distances[vertex] < minDistance) {
        minDistance = distances[vertex];
        current = vertex;
      }
    }

    if (current === null || distances[current] === Infinity) break;

    unvisited.delete(current);

    // Mettre à jour les voisins
    for (let neighbor of Object.keys(graph[current] || {})) {
      const weight = graph[current][neighbor];
      const newDistance = distances[current] + weight;

      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = current;
      }
    }
  }

  // Reconstruire le chemin
  const path = [];
  let current = end;

  while (current !== start) {
    if (!previous[current]) return null; // Pas de chemin
    path.unshift(current);
    current = previous[current];
  }
  path.unshift(start);

  return {
    path: path,
    distance: distances[end]
  };
}

// Exemple
const graph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 1, D: 5 },
  C: { A: 2, B: 1, D: 8, E: 10 },
  D: { B: 5, C: 8, E: 2, F: 6 },
  E: { C: 10, D: 2, F: 3 },
  F: { D: 6, E: 3 }
};

console.log(dijkstra(graph, 'A', 'F'));
// { path: ['A', 'C', 'B', 'D', 'E', 'F'], distance: 12 }
```

**Complexité** : O(V²) avec tableau, O((V + E) log V) avec tas binaire

---

## 🎯 Algorithme A* (A-Star)

**Inventeurs** : Peter Hart, Nils Nilsson, Bertram Raphael (1968)

**Principe** : Dijkstra + heuristique pour guider la recherche.

### Fonctionnement

- **f(n)** = coût réel + estimation heuristique
- **g(n)** = coût du chemin depuis le départ
- **h(n)** = estimation heuristique vers l'arrivée

**f(n) = g(n) + h(n)**

### Heuristiques

Pour grille 2D :
- **Distance de Manhattan** : |x₁ - x₂| + |y₁ - y₂| (pas de diagonales)
- **Distance Euclidienne** : √((x₁ - x₂)² + (y₁ - y₂)²)
- **Distance de Chebyshev** : max(|x₁ - x₂|, |y₁ - y₂|)

### Implémentation

```javascript
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift().element;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

function aStar(graph, start, end, heuristic) {
  const openSet = new PriorityQueue();
  const cameFrom = {};
  const gScore = {};
  const fScore = {};

  // Initialisation
  for (let vertex of Object.keys(graph)) {
    gScore[vertex] = Infinity;
    fScore[vertex] = Infinity;
  }

  gScore[start] = 0;
  fScore[start] = heuristic(start, end);
  openSet.enqueue(start, fScore[start]);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();

    if (current === end) {
      // Reconstruire le chemin
      const path = [];
      let temp = current;
      while (temp !== start) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }
      path.unshift(start);
      return {
        path: path,
        distance: gScore[end]
      };
    }

    for (let neighbor of Object.keys(graph[current] || {})) {
      const weight = graph[current][neighbor];
      const tentativeGScore = gScore[current] + weight;

      if (tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, end);

        // Ajouter à la file si pas déjà présent
        if (!openSet.items.some(item => item.element === neighbor)) {
          openSet.enqueue(neighbor, fScore[neighbor]);
        }
      }
    }
  }

  return null; // Pas de chemin
}

// Heuristique pour grille (coordonnées)
function manhattanHeuristic(a, b) {
  const [x1, y1] = a.split(',').map(Number);
  const [x2, y2] = b.split(',').map(Number);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Exemple sur grille
const gridGraph = {
  '0,0': { '0,1': 1, '1,0': 1 },
  '0,1': { '0,0': 1, '0,2': 1, '1,1': 1 },
  '0,2': { '0,1': 1, '0,3': 1, '1,2': 1 },
  '0,3': { '0,2': 1, '1,3': 1 },
  '1,0': { '0,0': 1, '1,1': 1, '2,0': 1 },
  '1,1': { '0,1': 1, '1,0': 1, '1,2': 1, '2,1': 1 },
  '1,2': { '0,2': 1, '1,1': 1, '1,3': 1, '2,2': 1 },
  '1,3': { '0,3': 1, '1,2': 1, '2,3': 1 },
  '2,0': { '1,0': 1, '2,1': 1, '3,0': 1 },
  '2,1': { '1,1': 1, '2,0': 1, '2,2': 1, '3,1': 1 },
  '2,2': { '1,2': 1, '2,1': 1, '2,3': 1, '3,2': 1 },
  '2,3': { '1,3': 1, '2,2': 1, '3,3': 1 },
  '3,0': { '2,0': 1, '3,1': 1 },
  '3,1': { '2,1': 1, '3,0': 1, '3,2': 1 },
  '3,2': { '2,2': 1, '3,1': 1, '3,3': 1 },
  '3,3': { '2,3': 1, '3,2': 1 }
};

console.log(aStar(gridGraph, '0,0', '3,3', manhattanHeuristic));
// { path: ['0,0', '0,1', '0,2', '0,3', '1,3', '2,3', '3,3'], distance: 6 }
```

---

## 🆚 Comparaison Dijkstra vs A*

| Aspect | Dijkstra | A* |
|--------|----------|----|
| **Complétude** | ✅ Toujours complet | ✅ Avec heuristique admissible |
| **Optimalité** | ✅ Toujours optimal | ✅ Avec heuristique admissible |
| **Efficacité** | Plus lent | Plus rapide (guidé) |
| **Heuristique** | Aucune | Nécessaire |
| **Complexité** | O((V + E) log V) | Variable selon heuristique |
| **Usage** | Graphes généraux | Problèmes avec heuristique |

### Propriétés de l'Heuristique

- **Admissible** : h(n) ≤ coût réel vers l'objectif
- **Consistante** : h(n) ≤ h(m) + coût(n,m) pour voisins
- **Monotone** : heuristique consistante

---

## 🚀 Applications Avancées

### 1. A* avec Obstacles (Jeux Vidéo)

```javascript
function aStarGrid(grid, start, end) {
  // grid[y][x] = 0 (libre), 1 (obstacle)
  const [startX, startY] = start;
  const [endX, endY] = end;

  function heuristic([x, y]) {
    return Math.abs(x - endX) + Math.abs(y - endY);
  }

  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const startKey = `${startX},${startY}`;
  const endKey = `${endX},${endY}`;

  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start));
  openSet.enqueue(start, fScore.get(startKey));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue();
    const [x, y] = current;
    const currentKey = `${x},${y}`;

    if (x === endX && y === endY) {
      // Reconstruire chemin
      const path = [];
      let temp = current;
      while (temp) {
        path.unshift(temp);
        const tempKey = `${temp[0]},${temp[1]}`;
        temp = cameFrom.get(tempKey);
      }
      return path;
    }

    // Vérifier les 4 directions
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    for (let [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length && grid[ny][nx] === 0) {
        const neighbor = [nx, ny];
        const neighborKey = `${nx},${ny}`;
        const tentativeG = gScore.get(currentKey) + 1;

        if (!gScore.has(neighborKey) || tentativeG < gScore.get(neighborKey)) {
          cameFrom.set(neighborKey, current);
          gScore.set(neighborKey, tentativeG);
          fScore.set(neighborKey, tentativeG + heuristic(neighbor));

          if (!openSet.items.some(item =>
            item.element[0] === nx && item.element[1] === ny)) {
            openSet.enqueue(neighbor, fScore.get(neighborKey));
          }
        }
      }
    }
  }

  return null;
}

// Exemple grille 4x4 avec obstacles
const grid = [
  [0, 0, 0, 0],
  [0, 1, 1, 0], // 1 = obstacle
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

console.log(aStarGrid(grid, [0, 0], [3, 3]));
```

---

## 💻 Exercice Pratique 1

**Objectif** : Implémentez Dijkstra pour trouver le chemin le plus rapide dans un réseau routier.

**Données** :
```javascript
const routes = {
  Paris: { Lyon: 465, Marseille: 775, Bordeaux: 579 },
  Lyon: { Paris: 465, Marseille: 316, Nice: 400 },
  Marseille: { Paris: 775, Lyon: 316, Nice: 200 },
  Nice: { Lyon: 400, Marseille: 200 },
  Bordeaux: { Paris: 579, Toulouse: 253 },
  Toulouse: { Bordeaux: 253, Marseille: 407 }
};
```

### Solution :
```javascript
function plusCourtTrajet(routes, depart, arrivee) {
  return dijkstra(routes, depart, arrivee);
}

console.log(plusCourtTrajet(routes, 'Paris', 'Nice'));
// { path: ['Paris', 'Marseille', 'Nice'], distance: 975 }
```

---

## 💻 Exercice Pratique 2

**Objectif** : Comparez les performances de Dijkstra et A* sur différents graphes.

### Solution :
```javascript
function comparerAlgorithmes(graph, start, end, heuristic) {
  console.time('Dijkstra');
  const dijkstraResult = dijkstra(graph, start, end);
  console.timeEnd('Dijkstra');

  console.time('A*');
  const aStarResult = aStar(graph, start, end, heuristic);
  console.timeEnd('A*');

  return {
    dijkstra: dijkstraResult,
    aStar: aStarResult,
    memeDistance: dijkstraResult?.distance === aStarResult?.distance
  };
}

// Test avec heuristique nulle (A* = Dijkstra)
function heuristiqueNulle(a, b) {
  return 0;
}

comparerAlgorithmes(graph, 'A', 'F', heuristiqueNulle);
```

---

### Exercice 3 : Bellman-Ford - Détection de Cycles Négatifs

**Objectif** : Implémenter Bellman-Ford et détecter les cycles de poids négatif.

**Consignes** :
- Implémenter l'algorithme de Bellman-Ford complet
- Détecter les cycles de poids négatif accessibles
- Retourner le résultat avec information sur les cycles

```javascript
function bellmanFordAvecDetection(graph, start) {
    // TODO: implémenter avec détection de cycles négatifs
}

// Graphe avec cycle négatif
const grapheAvecCycleNegatif = {
    A: { B: 4, C: 2 },
    B: { C: 1, D: 5 },
    C: { B: -3, D: 8 }, // Cycle A->B->C->B = 4+1+(-3) = 2 > 0
    D: { A: -10 }       // Cycle négatif D->A->B->C->D = -10+4+1+8 = 3 > 0
};

console.log(bellmanFordAvecDetection(grapheAvecCycleNegatif, 'A'));
```

### Solution :
```javascript
function bellmanFordAvecDetection(graph, start) {
    const distances = {};
    const previous = {};
    const vertices = Object.keys(graph);

    // Initialisation
    for (let vertex of vertices) {
        distances[vertex] = vertex === start ? 0 : Infinity;
        previous[vertex] = null;
    }

    // Relâchement de toutes les arêtes V-1 fois
    for (let i = 0; i < vertices.length - 1; i++) {
        for (let u of vertices) {
            for (let v in graph[u]) {
                const weight = graph[u][v];
                if (distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    previous[v] = u;
                }
            }
        }
    }

    // Vérification de cycles négatifs (V-ième itération)
    let hasNegativeCycle = false;
    const negativeCycleEdges = [];

    for (let u of vertices) {
        for (let v in graph[u]) {
            const weight = graph[u][v];
            if (distances[u] + weight < distances[v]) {
                hasNegativeCycle = true;
                negativeCycleEdges.push({ from: u, to: v, weight: weight });
            }
        }
    }

    return {
        distances: distances,
        previous: previous,
        hasNegativeCycle: hasNegativeCycle,
        negativeCycleEdges: negativeCycleEdges
    };
}

// Fonction pour reconstruire le chemin
function reconstruireChemin(previous, start, end) {
    const path = [];
    let current = end;

    while (current !== null) {
        path.unshift(current);
        if (current === start) break;
        current = previous[current];
    }

    if (path[0] !== start) return null; // Pas de chemin
    return path;
}

// Test avec différents graphes
console.log("🔍 Test Bellman-Ford avec détection de cycles négatifs:");

// Graphe normal
const grapheNormal = {
    A: { B: 4, C: 2 },
    B: { C: 1, D: 5 },
    C: { D: 8 },
    D: {}
};

const resultNormal = bellmanFordAvecDetection(grapheNormal, 'A');
console.log("Graphe normal:", resultNormal.hasNegativeCycle ? "Cycle négatif détecté" : "Pas de cycle négatif");

// Graphe avec cycle négatif
const grapheAvecCycleNegatif = {
    A: { B: 4, C: 2 },
    B: { C: 1, D: 5 },
    C: { B: -3, D: 8 }, // Cycle A->B->C->B = 4+1+(-3) = 2
    D: { A: -10 }       // Cycle négatif D->A->B->C->D = -10+4+1+8 = 3
};

const resultCycle = bellmanFordAvecDetection(grapheAvecCycleNegatif, 'A');
console.log("Graphe avec cycle négatif:", resultCycle.hasNegativeCycle ? "❌ Cycle négatif détecté" : "✅ Pas de cycle négatif");

if (resultCycle.hasNegativeCycle) {
    console.log("Arêtes impliquées dans les cycles négatifs:");
    resultCycle.negativeCycleEdges.forEach(edge => {
        console.log(`   ${edge.from} → ${edge.to} (poids: ${edge.weight})`);
    });
}
```

---

### Exercice 4 : Algorithme de Floyd-Warshall

**Objectif** : Implémenter Floyd-Warshall pour tous les couples de plus courts chemins.

**Consignes** :
- Programmer la matrice de distances
- Gérer les chemins indirects
- Détecter les cycles négatifs

```javascript
function floydWarshall(graph) {
    // TODO: implémenter Floyd-Warshall
    // Retourner matrice des distances et matrice des prédécesseurs
}

// Représentation matricielle d'un graphe
const graphMatrix = [
    [0, 3, 8, Infinity, -4],
    [Infinity, 0, Infinity, 1, 7],
    [Infinity, 4, 0, Infinity, Infinity],
    [2, Infinity, -5, 0, Infinity],
    [Infinity, Infinity, Infinity, 6, 0]
];

console.log(floydWarshall(graphMatrix));
```

### Solution :
```javascript
function floydWarshall(graph) {
    const n = graph.length;
    const dist = [];
    const next = [];

    // Initialisation des matrices
    for (let i = 0; i < n; i++) {
        dist[i] = [...graph[i]];
        next[i] = new Array(n).fill(null);

        for (let j = 0; j < n; j++) {
            if (graph[i][j] !== Infinity && i !== j) {
                next[i][j] = j;
            }
        }
    }

    // Algorithme principal
    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    // Détection de cycles négatifs
    let hasNegativeCycle = false;
    for (let i = 0; i < n; i++) {
        if (dist[i][i] < 0) {
            hasNegativeCycle = true;
            break;
        }
    }

    return {
        distances: dist,
        predecessors: next,
        hasNegativeCycle: hasNegativeCycle
    };
}

// Fonction pour reconstruire le chemin
function reconstruireCheminFloyd(next, start, end) {
    if (next[start][end] === null) return null;

    const path = [start];
    let current = start;

    while (current !== end) {
        current = next[current][end];
        if (current === null) return null;
        path.push(current);
    }

    return path;
}

// Test avec un graphe exemple
const graphMatrix = [
    [0, 3, 8, Infinity, -4],
    [Infinity, 0, Infinity, 1, 7],
    [Infinity, 4, 0, Infinity, Infinity],
    [2, Infinity, -5, 0, Infinity],
    [Infinity, Infinity, Infinity, 6, 0]
];

const result = floydWarshall(graphMatrix);

console.log("🔄 Floyd-Warshall - Tous les plus courts chemins:");
console.log("Matrice des distances:");
result.distances.forEach((row, i) => {
    console.log(`   ${i}: [${row.map(d => d === Infinity ? '∞' : d).join(', ')}]`);
});

if (result.hasNegativeCycle) {
    console.log("❌ Cycle négatif détecté !");
} else {
    console.log("✅ Pas de cycle négatif");

    // Afficher quelques chemins
    const chemins = [
        [0, 4], [1, 3], [2, 0], [3, 4]
    ];

    console.log("Exemples de chemins:");
    chemins.forEach(([start, end]) => {
        const path = reconstruireCheminFloyd(result.predecessors, start, end);
        const distance = result.distances[start][end];
        console.log(`   ${start} → ${end}: ${path ? path.join(' → ') : 'pas de chemin'} (distance: ${distance === Infinity ? '∞' : distance})`);
    });
}
```

---

### Exercice 5 : A* avec Différentes Heuristiques

**Objectif** : Comparer l'impact de différentes heuristiques sur A*.

**Consignes** :
- Implémenter plusieurs heuristiques (Manhattan, Euclidienne, Chebyshev)
- Mesurer l'efficacité de chaque heuristique
- Analyser le compromis précision/efficacité

```javascript
// Grille 2D pour les tests
const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0], // 1 = obstacle
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

// Heuristiques à comparer
function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function euclidean(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function chebyshev(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}

function comparerHeuristiques(grid, start, end) {
    // TODO: tester chaque heuristique et comparer
}

comparerHeuristiques(grid, [0, 0], [4, 4]);
```

### Solution :
```javascript
// Implémentation de A* pour grille 2D
function aStarGrid(grid, start, end, heuristic) {
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1], // Haut, Bas, Gauche, Droite
        [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonales
    ];

    const openSet = new PriorityQueue();
    const cameFrom = new Map();
    const gScore = new Map();
    const fScore = new Map();

    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;

    openSet.push({ pos: start, f: 0 });
    gScore.set(startKey, 0);
    fScore.set(startKey, heuristic(start, end));

    let nodesExplored = 0;

    while (!openSet.isEmpty()) {
        const current = openSet.pop();
        nodesExplored++;

        const currentKey = `${current.pos[0]},${current.pos[1]}`;

        if (current.pos[0] === end[0] && current.pos[1] === end[1]) {
            // Chemin trouvé
            const path = [];
            let temp = current.pos;
            while (temp) {
                path.unshift(temp);
                const tempKey = `${temp[0]},${temp[1]}`;
                temp = cameFrom.get(tempKey);
            }
            return { path, nodesExplored, found: true };
        }

        for (let [dr, dc] of directions) {
            const neighbor = [current.pos[0] + dr, current.pos[1] + dc];

            // Vérifier les limites et les obstacles
            if (neighbor[0] < 0 || neighbor[0] >= rows ||
                neighbor[1] < 0 || neighbor[1] >= cols ||
                grid[neighbor[0]][neighbor[1]] === 1) {
                continue;
            }

            const neighborKey = `${neighbor[0]},${neighbor[1]}`;
            const tentativeGScore = gScore.get(currentKey) + 1; // Distance de 1 pour chaque déplacement

            if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
                cameFrom.set(neighborKey, current.pos);
                gScore.set(neighborKey, tentativeGScore);
                fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));

                // Vérifier si neighbor n'est pas déjà dans openSet
                let alreadyInOpenSet = false;
                for (let item of openSet.values) {
                    if (item.pos[0] === neighbor[0] && item.pos[1] === neighbor[1]) {
                        alreadyInOpenSet = true;
                        break;
                    }
                }

                if (!alreadyInOpenSet) {
                    openSet.push({ pos: neighbor, f: fScore.get(neighborKey) });
                }
            }
        }
    }

    return { path: [], nodesExplored, found: false };
}

// File de priorité (nécessaire pour A*)
class PriorityQueue {
    constructor() {
        this.values = [];
    }

    push(element) {
        this.values.push(element);
        this.bubbleUp();
    }

    pop() {
        if (this.values.length === 0) return null;
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }

    bubbleUp() {
        let index = this.values.length - 1;
        const element = this.values[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.values[parentIndex];
            if (element.f >= parent.f) break;
            this.values[parentIndex] = element;
            this.values[index] = parent;
            index = parentIndex;
        }
    }

    sinkDown() {
        let index = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let leftChild, rightChild;
            let swapIndex = null;
            if (leftChildIndex < length) {
                leftChild = this.values[leftChildIndex];
                if (leftChild.f < element.f) {
                    swapIndex = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swapIndex === null && rightChild.f < element.f) ||
                    (swapIndex !== null && rightChild.f < leftChild.f)
                ) {
                    swapIndex = rightChildIndex;
                }
            }
            if (swapIndex === null) break;
            this.values[index] = this.values[swapIndex];
            this.values[swapIndex] = element;
            index = swapIndex;
        }
    }

    isEmpty() {
        return this.values.length === 0;
    }
}

// Heuristiques
function manhattan(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

function euclidean(a, b) {
    return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}

function chebyshev(a, b) {
    return Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
}

// Fonction de comparaison
function comparerHeuristiques(grid, start, end) {
    const heuristiques = {
        'Manhattan': manhattan,
        'Euclidienne': euclidean,
        'Chebyshev': chebyshev
    };

    const resultats = {};

    console.log("🏁 Comparaison des heuristiques A*:");

    for (const [nom, heuristique] of Object.entries(heuristiques)) {
        console.time(nom);
        const resultat = aStarGrid(grid, start, end, heuristique);
        console.timeEnd(nom);

        resultats[nom] = resultat;

        console.log(`${nom}: ${resultat.found ? '✅ Chemin trouvé' : '❌ Pas de chemin'}`);
        if (resultat.found) {
            console.log(`   Longueur: ${resultat.path.length} nœuds`);
            console.log(`   Nœuds explorés: ${resultat.nodesExplored}`);
            console.log(`   Chemin: ${resultat.path.map(p => `(${p[0]},${p[1]})`).join(' → ')}`);
        }
        console.log("");
    }

    return resultats;
}

// Test avec une grille
const grid = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0], // 1 = obstacle
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

comparerHeuristiques(grid, [0, 0], [4, 4]);
```

---

## 📊 Complexités

| Algorithme | Cas Général | Avec Tas Binaire | Conditions |
|------------|-------------|------------------|------------|
| **Dijkstra** | O(V²) | O((V + E) log V) | Aucune |
| **A*** | Variable | O((V + E) log V) | Heuristique admissible |

---

## 🎯 Bellman-Ford (pour graphes avec poids négatifs)

**Principe** : Relâchement de toutes les arêtes V-1 fois.

```javascript
function bellmanFord(graph, start) {
  const distances = {};
  const previous = {};

  // Initialisation
  for (let vertex of Object.keys(graph)) {
    distances[vertex] = vertex === start ? 0 : Infinity;
  }

  // V-1 itérations
  const vertices = Object.keys(graph);
  for (let i = 0; i < vertices.length - 1; i++) {
    for (let u of vertices) {
      for (let v of Object.keys(graph[u] || {})) {
        const weight = graph[u][v];
        if (distances[u] + weight < distances[v]) {
          distances[v] = distances[u] + weight;
          previous[v] = u;
        }
      }
    }
  }

  // Vérifier les cycles négatifs
  for (let u of vertices) {
    for (let v of Object.keys(graph[u] || {})) {
      if (distances[u] + graph[u][v] < distances[v]) {
        throw new Error("Cycle négatif détecté");
      }
    }
  }

  return { distances, previous };
}
```

**Complexité** : O(V × E)

---

## 🌟 Cas d'Usage Réels

- **GPS/Navigation** : Google Maps, Waze, TomTom
- **Jeux vidéo** : pathfinding pour NPC, stratégie
- **Réseaux** : routage OSPF, RIP
- **Logistique** : optimisation de tournées
- **IA** : recherche heuristique, planning

---

## 📝 Quiz de Révision

### Question 1
Quelle est la principale différence entre Dijkstra et A* ?
- A) Dijkstra est plus lent
- B) A* utilise une heuristique  ← **Réponse**
- C) Dijkstra ne fonctionne qu'avec des poids positifs
- D) A* garantit toujours le plus court chemin

### Question 2
Pour qu'A* trouve le chemin optimal, l'heuristique doit être :
- A) Admissible (h(n) ≤ coût réel)
- B) Consistante
- C) Les deux  ← **Réponse**
- D) Aucune des deux

### Question 3
Quel algorithme peut gérer des poids négatifs ?
- A) Dijkstra
- B) A*
- C) Bellman-Ford  ← **Réponse**
- D) Aucun

### Question 4
Dans A*, que représente f(n) ?
- A) Coût depuis le départ
- B) Estimation heuristique
- C) f(n) = g(n) + h(n)  ← **Réponse**
- D) Nombre de nœuds visités

---

## 🔑 Points Clés à Retenir

1. **Dijkstra** : plus court chemin sans heuristique, poids positifs
2. **A*** : Dijkstra + heuristique pour accélérer la recherche
3. **Heuristique** : admissible et consistante pour optimalité
4. **Bellman-Ford** : gère les poids négatifs, détecte les cycles
5. **Complexité** : O((V + E) log V) avec tas binaire
6. **Applications** : GPS, jeux, réseaux, optimisation

---

*Chapitre suivant : [Projets Pratiques](14-projects.md)*
