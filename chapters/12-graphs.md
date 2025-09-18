# Chapitre 12 : Les Graphes

## 🌐 Problème à Résoudre

Certaines données ne sont pas hiérarchiques (comme les arbres) mais **réseautées** :

- Réseaux sociaux → amis, abonnés
- GPS → routes entre villes
- Internet → pages liées entre elles

👉 Pour modéliser ce type de relations complexes, on utilise les **graphes**.

---

## 📊 Définition d'un Graphe

Un **graphe** est un ensemble de :

- **Sommets** (nœuds/vertices) : entités (villes, personnes, pages web)
- **Arêtes** (edges) : connexions entre sommets

### Types de Graphes

Un graphe peut être :

- **Orienté** : chaque arête a un sens (ex. Twitter : "je te suis" ≠ "tu me suis")
- **Non orienté** : arêtes bidirectionnelles (ex. Facebook : "amis")
- **Pondéré** : chaque arête a un coût (distance, temps, poids)
- **Non pondéré** : simple connexion sans coût

### Exemple de Graphe

#### Graphe Non Orienté
```
   (A) —— (B)
    |     / |
    |    /  |
   (C) —— (D)
```

#### Graphe Orienté
```
   (A) → (B)
    ↓      ↑
   (C) → (D)
```

---

## 💾 Représentation en Informatique

### 1. Liste d'Adjacence (Recommandée)

Chaque sommet pointe vers ses voisins.

```javascript
// Graphe non orienté
const graphe = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C"]
};

// Graphe orienté
const grapheOriented = {
  A: ["B", "C"],
  B: ["D"],
  C: ["D"],
  D: []
};

// Graphe pondéré
const graphePondere = {
  A: [{sommet: "B", poids: 4}, {sommet: "C", poids: 2}],
  B: [{sommet: "A", poids: 4}, {sommet: "D", poids: 5}],
  C: [{sommet: "A", poids: 2}, {sommet: "D", poids: 1}],
  D: [{sommet: "B", poids: 5}, {sommet: "C", poids: 1}]
};
```

### 2. Matrice d'Adjacence

Tableau 2D où matrice[i][j] = 1 si connexion entre i et j.

```javascript
// Pour les sommets A, B, C, D
const matrice = [
  // A  B  C  D
  [ 0, 1, 1, 0 ], // A
  [ 1, 0, 0, 1 ], // B
  [ 1, 0, 0, 1 ], // C
  [ 0, 1, 1, 0 ]  // D
];

// Accès : matrice[0][1] = 1 signifie A connecté à B
```

**Comparaison** :
- **Liste** : économe en mémoire pour graphes clairsemés
- **Matrice** : accès O(1), mais O(n²) mémoire même pour graphes vides

---

## 🔍 Parcours de Graphes

### 1. Parcours en Largeur (BFS - Breadth First Search)

👉 Explore "couche par couche".

- Utilise une **file** (queue)
- Utile pour trouver le **plus court chemin non pondéré**

```javascript
function parcoursLargeur(graphe, depart) {
  const visites = new Set();
  const file = [];

  file.push(depart);
  visites.add(depart);

  while (file.length > 0) {
    const sommet = file.shift();
    console.log(sommet);

    // Ajouter les voisins non visités
    for (let voisin of graphe[sommet] || []) {
      if (!visites.has(voisin)) {
        visites.add(voisin);
        file.push(voisin);
      }
    }
  }
}

// Exemple
const reseau = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C"]
};

parcoursLargeur(reseau, "A"); // A, B, C, D
```

### 2. Parcours en Profondeur (DFS - Depth First Search)

👉 Explore "jusqu'au bout d'un chemin" avant de revenir.

- Utilise une **pile** (stack) ou **récursivité**
- Utile pour détecter des **cycles**, **composants connexes**

```javascript
function parcoursProfondeur(graphe, sommet, visites = new Set()) {
  if (visites.has(sommet)) return;

  console.log(sommet);
  visites.add(sommet);

  for (let voisin of graphe[sommet] || []) {
    parcoursProfondeur(graphe, voisin, visites);
  }
}

// Version itérative
function parcoursProfondeurIteratif(graphe, depart) {
  const visites = new Set();
  const pile = [depart];

  while (pile.length > 0) {
    const sommet = pile.pop();

    if (!visites.has(sommet)) {
      console.log(sommet);
      visites.add(sommet);

      // Ajouter les voisins (dans l'ordre inverse pour garder la logique)
      for (let voisin of (graphe[sommet] || []).reverse()) {
        if (!visites.has(voisin)) {
          pile.push(voisin);
        }
      }
    }
  }
}

parcoursProfondeur(reseau, "A"); // A, B, D, C (selon l'ordre)
```

---

## 🔍 Applications Pratiques

### 1. Réseaux Sociaux - Suggestion d'Amis

```javascript
function suggererAmis(graphe, utilisateur, degre = 2) {
  const visites = new Set();
  const suggestions = new Map();

  function explorer(sommet, distance) {
    if (distance > degre || visites.has(sommet)) return;

    visites.add(sommet);

    if (distance > 0 && distance <= degre) {
      suggestions.set(sommet, distance);
    }

    for (let ami of graphe[sommet] || []) {
      explorer(ami, distance + 1);
    }
  }

  explorer(utilisateur, 0);
  suggestions.delete(utilisateur); // Ne pas se suggérer soi-même

  return Array.from(suggestions.entries())
    .sort((a, b) => a[1] - b[1]); // Trier par proximité
}

// Exemple
const reseauSocial = {
  Alice: ["Bob", "Charlie"],
  Bob: ["Alice", "Diana", "Eve"],
  Charlie: ["Alice", "Diana"],
  Diana: ["Bob", "Charlie", "Eve"],
  Eve: ["Bob", "Diana"],
  Frank: ["Grace"] // Island
};

console.log(suggererAmis(reseauSocial, "Alice"));
// [["Bob", 1], ["Charlie", 1], ["Diana", 2], ["Eve", 2]]
```

### 2. Détection de Cycles

```javascript
function contientCycle(graphe) {
  const visites = new Set();
  const enCours = new Set();

  function dfsCycle(sommet) {
    visites.add(sommet);
    enCours.add(sommet);

    for (let voisin of graphe[sommet] || []) {
      if (!visites.has(voisin)) {
        if (dfsCycle(voisin)) return true;
      } else if (enCours.has(voisin)) {
        return true; // Cycle détecté
      }
    }

    enCours.delete(sommet);
    return false;
  }

  for (let sommet of Object.keys(graphe)) {
    if (!visites.has(sommet)) {
      if (dfsCycle(sommet)) return true;
    }
  }

  return false;
}

// Test
const grapheAcyclique = {
  A: ["B", "C"],
  B: ["D"],
  C: ["D"],
  D: []
};

const grapheCyclique = {
  A: ["B"],
  B: ["C"],
  C: ["A"] // Cycle A -> B -> C -> A
};

console.log(contientCycle(grapheAcyclique)); // false
console.log(contientCycle(grapheCyclique)); // true
```

### 3. Composants Connexes

```javascript
function composantsConnexes(graphe) {
  const visites = new Set();
  const composants = [];

  function dfs(sommet, composant) {
    visites.add(sommet);
    composant.push(sommet);

    for (let voisin of graphe[sommet] || []) {
      if (!visites.has(voisin)) {
        dfs(voisin, composant);
      }
    }
  }

  for (let sommet of Object.keys(graphe)) {
    if (!visites.has(sommet)) {
      const composant = [];
      dfs(sommet, composant);
      composants.push(composant);
    }
  }

  return composants;
}

// Exemple
const grapheDecconex = {
  A: ["B", "C"],
  B: ["A", "C"],
  C: ["A", "B"],
  D: ["E"],     // Composant séparé
  E: ["D"],
  F: []         // Sommet isolé
};

console.log(composantsConnexes(grapheDecconex));
// [["A", "B", "C"], ["D", "E"], ["F"]]
```

---

## 💻 Exercice Pratique 1

**Objectif** : Implémentez une fonction `hasPath(graph, start, end)` qui retourne `true` si un chemin existe entre `start` et `end`.

Utilisez **DFS** pour la première version, **BFS** pour la deuxième.

### Solution DFS :
```javascript
function hasPathDFS(graph, start, end, visited = new Set()) {
  if (start === end) return true;
  if (visited.has(start)) return false;

  visited.add(start);

  for (let neighbor of graph[start] || []) {
    if (hasPathDFS(graph, neighbor, end, visited)) {
      return true;
    }
  }

  return false;
}
```

### Solution BFS :
```javascript
function hasPathBFS(graph, start, end) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length > 0) {
    const current = queue.shift();

    if (current === end) return true;

    for (let neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

// Tests
const graph = {
  A: ["B", "C"],
  B: ["A", "D"],
  C: ["A", "D"],
  D: ["B", "C"],
  E: ["F"],
  F: ["E"]
};

console.log(hasPathDFS(graph, "A", "D")); // true
console.log(hasPathBFS(graph, "A", "E")); // false
```

---

## 💻 Exercice Pratique 2

**Objectif** : Implémentez une fonction qui trouve le plus court chemin non pondéré entre deux sommets.

### Solution :
```javascript
function plusCourtChemin(graph, start, end) {
  const visited = new Set();
  const queue = [[start, [start]]]; // [sommet, chemin]
  visited.add(start);

  while (queue.length > 0) {
    const [current, path] = queue.shift();

    if (current === end) {
      return path;
    }

    for (let neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null; // Pas de chemin
}

console.log(plusCourtChemin(graph, "A", "D")); // ["A", "B", "D"] ou ["A", "C", "D"]
```

---

### Exercice 3 : Détection de Cycles

**Objectif** : Implémentez une fonction qui détecte si un graphe contient un cycle.

**Consignes** :
- Utiliser DFS avec coloriage des nœuds (Blanc, Gris, Noir)
- Un cycle est détecté si on trouve un arc vers un nœud Gris
- Tester avec différents graphes

```javascript
function detecteCycle(graph) {
    // TODO: implémenter la détection de cycles
}

// Graphes de test
const grapheAcyclique = {
    A: ['B', 'C'],
    B: ['D'],
    C: ['D'],
    D: []
};

const grapheCyclique = {
    A: ['B'],
    B: ['C'],
    C: ['A', 'D'],
    D: []
};

console.log(detecteCycle(grapheAcyclique)); // false
console.log(detecteCycle(grapheCyclique)); // true
```

### Solution :
```javascript
function detecteCycle(graph) {
    const visited = new Set();
    const recStack = new Set();

    function dfs(node) {
        visited.add(node);
        recStack.add(node);

        for (let neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor)) {
                    return true;
                }
            } else if (recStack.has(neighbor)) {
                // Cycle détecté !
                return true;
            }
        }

        recStack.delete(node);
        return false;
    }

    // Tester tous les nœuds (au cas où le graphe serait déconnecté)
    for (let node in graph) {
        if (!visited.has(node)) {
            if (dfs(node)) {
                return true;
            }
        }
    }

    return false;
}

// Tests étendus
const tests = [
    {
        name: "Graphe acyclique simple",
        graph: { A: ['B'], B: ['C'], C: [] },
        expected: false
    },
    {
        name: "Graphe avec cycle",
        graph: { A: ['B'], B: ['C'], C: ['A'] },
        expected: true
    },
    {
        name: "Graphe déconnecté sans cycle",
        graph: { A: ['B'], B: [], C: ['D'], D: [] },
        expected: false
    },
    {
        name: "Graphe déconnecté avec cycle",
        graph: { A: ['B'], B: ['A'], C: ['D'], D: ['C'] },
        expected: true
    }
];

console.log("🌀 Tests de détection de cycles:");
tests.forEach(test => {
    const result = detecteCycle(test.graph);
    const status = result === test.expected ? "✅" : "❌";
    console.log(`${status} ${test.name}: ${result} (attendu: ${test.expected})`);
});
```

---

### Exercice 4 : Composantes Connexes

**Objectif** : Trouver toutes les composantes connexes d'un graphe.

**Consignes** :
- Utiliser DFS ou BFS pour explorer chaque composante
- Retourner une liste des composantes
- Tester avec un graphe déconnecté

```javascript
function composantesConnexes(graph) {
    // TODO: implémenter
}

// Test
const grapheDeconnecte = {
    A: ['B'],
    B: ['A'],
    C: ['D'],
    D: ['C', 'E'],
    E: ['D'],
    F: [] // Nœud isolé
};

console.log(composantesConnexes(grapheDeconnecte));
// Résultat attendu: [['A', 'B'], ['C', 'D', 'E'], ['F']]
```

### Solution :
```javascript
function composantesConnexes(graph) {
    const visited = new Set();
    const composantes = [];

    function dfs(node, composante) {
        visited.add(node);
        composante.push(node);

        for (let neighbor of graph[node] || []) {
            if (!visited.has(neighbor)) {
                dfs(neighbor, composante);
            }
        }
    }

    // Parcourir tous les nœuds
    for (let node in graph) {
        if (!visited.has(node)) {
            const composante = [];
            dfs(node, composante);
            composantes.push(composante.sort()); // Trier pour la cohérence
        }
    }

    return composantes.sort((a, b) => a.length - b.length); // Trier par taille
}

// Fonction alternative avec BFS
function composantesConnexesBFS(graph) {
    const visited = new Set();
    const composantes = [];

    for (let node in graph) {
        if (!visited.has(node)) {
            const composante = [];
            const queue = [node];
            visited.add(node);

            while (queue.length > 0) {
                const current = queue.shift();
                composante.push(current);

                for (let neighbor of graph[current] || []) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push(neighbor);
                    }
                }
            }

            composantes.push(composante.sort());
        }
    }

    return composantes.sort((a, b) => a.length - b.length);
}

// Tests
const grapheDeconnecte = {
    A: ['B'],
    B: ['A'],
    C: ['D'],
    D: ['C', 'E'],
    E: ['D'],
    F: [] // Nœud isolé
};

console.log("🔗 Composantes connexes (DFS):");
console.log(composantesConnexes(grapheDeconnecte));

console.log("🔗 Composantes connexes (BFS):");
console.log(composantesConnexesBFS(grapheDeconnecte));

// Test avec graphe vide
console.log("🔗 Graphe vide:");
console.log(composantesConnexes({}));

// Test avec un seul nœud
console.log("🔗 Un seul nœud:");
console.log(composantesConnexes({ A: [] }));
```

---

### Exercice 5 : Graphe Pondéré - Algorithme de Prim

**Objectif** : Implémenter l'algorithme de Prim pour trouver l'arbre couvrant de poids minimal.

**Consignes** :
- Représenter le graphe avec des poids sur les arêtes
- Utiliser une file de priorité pour sélectionner l'arête de poids minimal
- Construire l'arbre couvrant minimum

```javascript
// Représentation d'un graphe pondéré
const graphePondere = {
    A: [{ vers: 'B', poids: 4 }, { vers: 'C', poids: 2 }],
    B: [{ vers: 'A', poids: 4 }, { vers: 'C', poids: 1 }, { vers: 'D', poids: 5 }],
    C: [{ vers: 'A', poids: 2 }, { vers: 'B', poids: 1 }, { vers: 'D', poids: 8 }],
    D: [{ vers: 'B', poids: 5 }, { vers: 'C', poids: 8 }]
};

function arbreCouvrantPrim(graph, start) {
    // TODO: implémenter l'algorithme de Prim
}

console.log(arbreCouvrantPrim(graphePondere, 'A'));
```

### Solution :
```javascript
function arbreCouvrantPrim(graph, start) {
    const mst = []; // Arêtes de l'arbre couvrant
    const visited = new Set();
    const minHeap = new PriorityQueue();

    visited.add(start);

    // Ajouter toutes les arêtes du nœud de départ
    for (let edge of graph[start] || []) {
        minHeap.push({ poids: edge.poids, de: start, vers: edge.vers });
    }

    while (!minHeap.isEmpty() && visited.size < Object.keys(graph).length) {
        const edge = minHeap.pop();

        if (visited.has(edge.vers)) {
            continue; // Cette arête créerait un cycle
        }

        // Ajouter l'arête à l'arbre couvrant
        mst.push(edge);
        visited.add(edge.vers);

        // Ajouter les nouvelles arêtes disponibles
        for (let newEdge of graph[edge.vers] || []) {
            if (!visited.has(newEdge.vers)) {
                minHeap.push({
                    poids: newEdge.poids,
                    de: edge.vers,
                    vers: newEdge.vers
                });
            }
        }
    }

    return mst;
}

// File de priorité simple (min-heap)
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

            if (element.poids >= parent.poids) break;

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
                if (leftChild.poids < element.poids) {
                    swapIndex = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                rightChild = this.values[rightChildIndex];
                if (
                    (swapIndex === null && rightChild.poids < element.poids) ||
                    (swapIndex !== null && rightChild.poids < leftChild.poids)
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

// Test de l'algorithme de Prim
const graphePondere = {
    A: [{ vers: 'B', poids: 4 }, { vers: 'C', poids: 2 }],
    B: [{ vers: 'A', poids: 4 }, { vers: 'C', poids: 1 }, { vers: 'D', poids: 5 }],
    C: [{ vers: 'A', poids: 2 }, { vers: 'B', poids: 1 }, { vers: 'D', poids: 8 }],
    D: [{ vers: 'B', poids: 5 }, { vers: 'C', poids: 8 }]
};

console.log("🌲 Arbre couvrant minimum (Prim):");
const mst = arbreCouvrantPrim(graphePondere, 'A');

let totalWeight = 0;
console.log("Arêtes de l'arbre couvrant:");
mst.forEach(edge => {
    console.log(`   ${edge.de} --(${edge.poids})-- ${edge.vers}`);
    totalWeight += edge.poids;
});

console.log(`Poids total: ${totalWeight}`);

// Vérification: devrait être 2 + 1 + 5 = 8
console.log("Vérification: A-C(2) + B-C(1) + B-D(5) = 8 ✓");
```

---

## 📊 Analyse de Complexité

| Algorithme | Complexité Temps | Complexité Espace |
|------------|------------------|-------------------|
| **BFS** | O(V + E) | O(V) |
| **DFS** | O(V + E) | O(V) |

Où :
- **V** = nombre de sommets (vertices)
- **E** = nombre d'arêtes (edges)

---

## 🌟 Cas d'Usage Réels

- **GPS** (Google Maps, Waze) → trouver l'itinéraire le plus court
- **Réseaux sociaux** → suggestion d'amis
- **IA** (jeux vidéo) → déplacement de personnages
- **Internet** (PageRank de Google) → importance des pages web
- **Réseaux informatiques** → routage des paquets
- **Base de données** → optimisation de requêtes

---

## 📝 Quiz de Révision

### Question 1
Quelle est la différence entre un graphe orienté et non orienté ?
- A) L'orientation change la complexité
- B) Les arêtes orientées sont à sens unique  ← **Réponse**
- C) Les graphes orientés utilisent plus de mémoire
- D) Aucune différence pratique

### Question 2
Quelle représentation est la plus économe en mémoire pour un graphe clairsemé ?
- A) Matrice d'adjacence
- B) Liste d'adjacence  ← **Réponse**
- C) Liste de successeurs
- D) Tableau de pointeurs

### Question 3
Quel algorithme de parcours est le plus adapté pour trouver un plus court chemin non pondéré ?
- A) DFS
- B) BFS  ← **Réponse**
- C) Dijkstra
- D) A*

### Question 4
Dans un graphe, que signifie "V + E" dans la complexité ?
- A) Nombre maximum de sommets
- B) Sommets + Arêtes  ← **Réponse**
- C) Visites + Explorations
- D) Variables + Équations

---

## 🔑 Points Clés à Retenir

1. **Graphe** = ensemble de sommets connectés par des arêtes
2. **Représentations** : liste d'adjacence (recommandée), matrice d'adjacence
3. **Parcours** : BFS (file) pour plus court chemin, DFS (pile) pour exploration
4. **Applications** : réseaux sociaux, GPS, IA, optimisation
5. **Complexité** : O(V + E) pour la plupart des algorithmes
6. **Choix** : orienté/non orienté, pondéré/non pondéré selon le problème

---

*Chapitre suivant : [Plus Court Chemin](13-shortest-path.md)*
