# Chapitre 15 : Quiz et Exercices de Révision

## 📊 Quiz par Chapitre

### Quiz Chapitre 1 : Introduction

1. **Quelle notation représente la complexité d'un algorithme qui parcourt un tableau une fois ?**
   - A) O(1)
   - B) O(log n)  ← **Réponse**
   - C) O(n)
   - D) O(n²)

2. **Un algorithme est dit déterministe si :**
   - A) Il se termine toujours
   - B) Il donne toujours le même résultat pour les mêmes entrées  ← **Réponse**
   - C) Il utilise peu de mémoire
   - D) Il est écrit en JavaScript

3. **Quelle complexité a l'accès à un élément d'un tableau par index ?**
   - A) O(n)
   - B) O(log n)
   - C) O(1)  ← **Réponse**
   - D) O(n²)

### Quiz Chapitre 2 : Tableaux et Tris

1. **Quel algorithme de tri est stable et a une complexité O(n log n) garantie ?**
   - A) Tri rapide
   - B) Tri bulle
   - C) Tri fusion  ← **Réponse**
   - D) Tri insertion

2. **Dans quel cas le tri insertion est-il particulièrement efficace ?**
   - A) Tableau trié à l'envers
   - B) Tableau presque trié  ← **Réponse**
   - C) Éléments aléatoires
   - D) Tableau vide

3. **Quelle est la complexité moyenne du tri rapide ?**
   - A) O(n)
   - B) O(n log n)  ← **Réponse**
   - C) O(n²)
   - D) O(2ⁿ)

### Quiz Chapitre 5 : Les Piles

1. **Quelle structure de données suit le principe LIFO ?**
   - A) File
   - B) Pile  ← **Réponse**
   - C) Liste chaînée
   - D) Table de hachage

2. **Quelle opération permet de consulter l'élément du haut sans le retirer ?**
   - A) `push()`
   - B) `pop()`
   - C) `peek()`  ← **Réponse**
   - D) `isEmpty()`

3. **Quel est un cas d'usage classique des piles ?**
   - A) Impression de documents
   - B) Annulation (Ctrl+Z)  ← **Réponse**
   - C) File d'attente
   - D) Cache mémoire

### Quiz Chapitre 6 : Les Files

1. **Quelle structure suit le principe FIFO ?**
   - A) Pile
   - B) File  ← **Réponse**
   - C) Arbre binaire
   - D) Graphe

2. **Quelle opération retire l'élément au début d'une file ?**
   - A) `enqueue()`
   - B) `dequeue()`  ← **Réponse**
   - C) `peek()`
   - D) `push()`

3. **Dans quelle situation une file est-elle particulièrement utile ?**
   - A) Vérification de parenthèses
   - B) Parcours en profondeur
   - C) Gestion d'imprimante  ← **Réponse**
   - D) Tri de données

### Quiz Chapitre 7 : Tables de Hachage

1. **Quelle est l'avantage principal des tables de hachage ?**
   - A) Tri automatique
   - B) Recherche en O(1) moyenne  ← **Réponse**
   - C) Mémoire réduite
   - D) Stabilité garantie

2. **Que se passe-t-il quand deux clés produisent le même hash ?**
   - A) Erreur
   - B) Collision, à gérer  ← **Réponse**
   - C) Valeur écrasée
   - D) Recherche impossible

3. **Quelle méthode de gestion des collisions utilise des listes ?**
   - A) Adressage ouvert
   - B) Chaînage  ← **Réponse**
   - C) Double hachage
   - D) Re-hachage

### Quiz Chapitre 12 : Graphes

1. **Quelle est la différence entre un graphe orienté et non orienté ?**
   - A) L'orientation change la complexité
   - B) Les arêtes orientées sont à sens unique  ← **Réponse**
   - C) Les graphes orientés utilisent plus de mémoire
   - D) Aucune différence pratique

2. **Quelle représentation est la plus économe pour un graphe clairsemé ?**
   - A) Matrice d'adjacence
   - B) Liste d'adjacence  ← **Réponse**
   - C) Liste de successeurs
   - D) Tableau de pointeurs

3. **Quel algorithme trouve un plus court chemin non pondéré ?**
   - A) DFS
   - B) BFS  ← **Réponse**
   - C) Dijkstra
   - D) A*

### Quiz Chapitre 13 : Plus Court Chemin

1. **Quelle est la principale différence entre Dijkstra et A* ?**
   - A) Dijkstra est plus lent
   - B) A* utilise une heuristique  ← **Réponse**
   - C) Dijkstra ne fonctionne qu'avec des poids positifs
   - D) A* garantit toujours le plus court chemin

2. **Pour qu'A* soit optimal, l'heuristique doit être :**
   - A) Admissible (h(n) ≤ coût réel)
   - B) Consistante
   - C) Les deux  ← **Réponse**
   - D) Aucune des deux

3. **Quel algorithme gère les poids négatifs ?**
   - A) Dijkstra
   - B) A*
   - C) Bellman-Ford  ← **Réponse**
   - D) Aucun

---

## 💻 Exercices Pratiques Corrigés

### Exercice 1 : Recherche Binaire Récursive

**Énoncé** : Implémentez une fonction de recherche binaire récursive.

**Solution** :
```javascript
function rechercheBinaireRecursive(arr, cible, gauche = 0, droite = arr.length - 1) {
    if (gauche > droite) return -1;

    const milieu = Math.floor((gauche + droite) / 2);

    if (arr[milieu] === cible) return milieu;
    if (arr[milieu] > cible) {
        return rechercheBinaireRecursive(arr, cible, gauche, milieu - 1);
    }
    return rechercheBinaireRecursive(arr, cible, milieu + 1, droite);
}

// Test
const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(rechercheBinaireRecursive(arr, 7)); // 3
console.log(rechercheBinaireRecursive(arr, 4)); // -1
```

**Complexité** : O(log n)

### Exercice 2 : Tri Fusion

**Énoncé** : Implémentez le tri fusion complet.

**Solution** :
```javascript
function triFusion(arr) {
    if (arr.length <= 1) return arr;

    const milieu = Math.floor(arr.length / 2);
    const gauche = triFusion(arr.slice(0, milieu));
    const droite = triFusion(arr.slice(milieu));

    return fusion(gauche, droite);
}

function fusion(gauche, droite) {
    const resultat = [];
    let i = 0, j = 0;

    while (i < gauche.length && j < droite.length) {
        if (gauche[i] <= droite[j]) {
            resultat.push(gauche[i]);
            i++;
        } else {
            resultat.push(droite[j]);
            j++;
        }
    }

    return resultat.concat(gauche.slice(i)).concat(droite.slice(j));
}

// Test
const arr = [38, 27, 43, 3, 9, 82, 10];
console.log(triFusion(arr)); // [3, 9, 10, 27, 38, 43, 82]
```

**Complexité** : O(n log n)

### Exercice 3 : Vérification de Parentheses

**Énoncé** : Vérifiez si une expression a des parenthèses équilibrées.

**Solution** :
```javascript
function parenthesesEquilibrees(expression) {
    const pile = [];
    const paires = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let char of expression) {
        if (['(', '{', '['].includes(char)) {
            pile.push(char);
        } else if ([')', '}', ']'].includes(char)) {
            if (pile.length === 0 || pile.pop() !== paires[char]) {
                return false;
            }
        }
    }

    return pile.length === 0;
}

// Tests
console.log(parenthesesEquilibrees("((2+3)*5)")); // true
console.log(parenthesesEquilibrees("(2+3))")); // false
console.log(parenthesesEquilibrees("[{(2+3)*5}]")); // true
```

**Complexité** : O(n)

### Exercice 4 : File avec Priorité

**Énoncé** : Implémentez une file avec priorité simple.

**Solution** :
```javascript
class PriorityQueue {
    constructor() {
        this.items = [];
    }

    enqueue(element, priorite) {
        const item = { element, priorite };
        let ajoute = false;

        for (let i = 0; i < this.items.length; i++) {
            if (priorite > this.items[i].priorite) {
                this.items.splice(i, 0, item);
                ajoute = true;
                break;
            }
        }

        if (!ajoute) {
            this.items.push(item);
        }
    }

    dequeue() {
        return this.items.shift()?.element;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    peek() {
        return this.items[0]?.element;
    }
}

// Test
const pq = new PriorityQueue();
pq.enqueue("Tâche normale", 1);
pq.enqueue("Urgence", 5);
pq.enqueue("Importante", 3);

console.log(pq.dequeue()); // "Urgence"
console.log(pq.dequeue()); // "Importante"
console.log(pq.dequeue()); // "Tâche normale"
```

### Exercice 5 : Détection de Cycle dans un Graphe

**Énoncé** : Implémentez une fonction qui détecte les cycles dans un graphe orienté.

**Solution** :
```javascript
function contientCycle(graphe) {
    const visites = new Set();
    const enCours = new Set();

    function dfs(sommet) {
        visites.add(sommet);
        enCours.add(sommet);

        for (let voisin of graphe[sommet] || []) {
            if (!visites.has(voisin)) {
                if (dfs(voisin)) return true;
            } else if (enCours.has(voisin)) {
                return true; // Cycle détecté
            }
        }

        enCours.delete(sommet);
        return false;
    }

    for (let sommet of Object.keys(graphe)) {
        if (!visites.has(sommet)) {
            if (dfs(sommet)) return true;
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
    C: ["A"] // Cycle
};

console.log(contientCycle(grapheAcyclique)); // false
console.log(contientCycle(grapheCyclique)); // true
```

---

## 🧩 Problèmes Avancés

### Problème 1 : Le Plus Grand Rectangle dans un Histogramme

**Énoncé** : Trouvez la plus grande aire rectangulaire possible dans un histogramme.

**Solution utilisant une pile** :
```javascript
function plusGrandRectangle(histogramme) {
    const pile = [];
    let maxAire = 0;
    let i = 0;

    while (i < histogramme.length) {
        if (pile.length === 0 || histogramme[pile[pile.length - 1]] <= histogramme[i]) {
            pile.push(i);
            i++;
        } else {
            const hauteur = histogramme[pile.pop()];
            const largeur = pile.length === 0 ? i : i - pile[pile.length - 1] - 1;
            maxAire = Math.max(maxAire, hauteur * largeur);
        }
    }

    while (pile.length > 0) {
        const hauteur = histogramme[pile.pop()];
        const largeur = pile.length === 0 ? i : i - pile[pile.length - 1] - 1;
        maxAire = Math.max(maxAire, hauteur * largeur);
    }

    return maxAire;
}

// Test
console.log(plusGrandRectangle([2, 1, 5, 6, 2, 3])); // 10
```

### Problème 2 : Chemin dans une Matrice

**Énoncé** : Trouvez tous les chemins possibles d'un coin à l'autre d'une matrice, avec contraintes.

**Solution utilisant la récursion** :
```javascript
function cheminsDansMatrice(matrice) {
    const chemins = [];
    const lignes = matrice.length;
    const colonnes = matrice[0].length;

    function explorer(x, y, chemin) {
        // Arrivée atteinte
        if (x === lignes - 1 && y === colonnes - 1) {
            chemins.push([...chemin, [x, y]]);
            return;
        }

        // Marquer comme visité
        matrice[x][y] = -1;

        // Essayer les 4 directions
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < lignes && ny >= 0 && ny < colonnes && matrice[nx][ny] === 0) {
                explorer(nx, ny, [...chemin, [x, y]]);
            }
        }

        // Remettre à 0 (backtracking)
        matrice[x][y] = 0;
    }

    if (matrice[0][0] === 0) {
        explorer(0, 0, []);
    }

    return chemins;
}

// Test (0 = chemin libre, 1 = obstacle)
const matrice = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
];

console.log(cheminsDansMatrice(matrice)); // Tous les chemins possibles
```

---

## 📈 Exercices de Complexité

### Exercice 1 : Analyse de Complexité

Pour chaque fonction, déterminez la complexité temporelle :

```javascript
function mystere1(n) {
    let somme = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            somme += i * j;
        }
    }
    return somme;
}
// Réponse : O(n²)

function mystere2(n) {
    if (n <= 1) return 1;
    return mystere2(n - 1) + mystere2(n - 2);
}
// Réponse : O(2ⁿ) - Fibonacci récursif inefficace

function mystere3(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
}
// Réponse : O(n²) - Tri bulle
```

### Exercice 2 : Optimisation

**Énoncé** : Optimisez cette fonction qui compte les occurrences de chaque élément.

Version originale (O(n²)) :
```javascript
function compterOccurrences(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        let found = false;
        for (let j = 0; j < result.length; j++) {
            if (result[j].element === arr[i]) {
                result[j].count++;
                found = true;
                break;
            }
        }
        if (!found) {
            result.push({ element: arr[i], count: 1 });
        }
    }
    return result;
}
```

Version optimisée (O(n)) :
```javascript
function compterOccurrences(arr) {
    const count = new Map();
    for (let element of arr) {
        count.set(element, (count.get(element) || 0) + 1);
    }
    return Array.from(count.entries()).map(([element, count]) => ({ element, count }));
}
```

---

## 🎯 Conseils pour les Entretiens Techniques

### Préparation Algorithmique

1. **Maîtrisez les bases** : tris, recherche, structures de données
2. **Pratiquez régulièrement** : LeetCode, HackerRank, CodeSignal
3. **Analysez la complexité** : temps et espace pour chaque solution
4. **Considérez les cas limites** : tableaux vides, éléments manquants
5. **Expliquez votre raisonnement** : parlez en pensant à voix haute

### Questions Courantes

- **Tableaux** : recherche binaire, maximum sous-tableau, rotation
- **Chaînes** : palindromes, anagrammes, compression
- **Liées listes** : inversion, détection de cycle, fusion
- **Arbres** : parcours, BST, équilibre
- **Graphes** : DFS/BFS, plus court chemin, composants connexes
- **DP** : problèmes de sac à dos, séquences, optimisation

### Signes de Bonne Réponse

- ✅ Analyse de complexité correcte
- ✅ Gestion des cas d'erreur
- ✅ Code lisible et commenté
- ✅ Optimisations appropriées
- ✅ Tests des cas limites

---

*Bilan final : Vous maîtrisez maintenant les concepts fondamentaux des algorithmes et structures de données !*
