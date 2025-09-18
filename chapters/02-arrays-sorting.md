# Chapitre 2 : Tableaux et Algorithmes de Tri

## 📊 Les Tableaux en JavaScript

### Définition et Déclaration

Un **tableau** (array) est une structure de données qui stocke une collection ordonnée d'éléments.

```javascript
// Déclaration d'un tableau vide
let tableauVide = [];

// Tableau avec des éléments
let nombres = [1, 2, 3, 4, 5];
let fruits = ["pomme", "banane", "orange"];

// Tableau mixte (possible en JS, mais déconseillé)
let mixte = [1, "hello", true, null];
```

### 🧮 Opérations de Base

#### Accès aux Éléments
```javascript
let nombres = [10, 20, 30, 40, 50];

// Accès par index (commence à 0)
console.log(nombres[0]);  // 10 (premier élément)
console.log(nombres[2]);  // 30 (troisième élément)
console.log(nombres[nombres.length - 1]); // 50 (dernier élément)
```

#### Modification d'Éléments
```javascript
let nombres = [10, 20, 30];
nombres[1] = 25;  // Remplace 20 par 25
console.log(nombres); // [10, 25, 30]
```

#### Ajout et Suppression
```javascript
let fruits = ["pomme", "banane"];

// Ajout à la fin
fruits.push("orange");
console.log(fruits); // ["pomme", "banane", "orange"]

// Suppression du dernier élément
let dernier = fruits.pop();
console.log(dernier); // "orange"
console.log(fruits); // ["pomme", "banane"]

// Ajout au début
fruits.unshift("fraise");
console.log(fruits); // ["fraise", "pomme", "banane"]

// Suppression du premier élément
let premier = fruits.shift();
console.log(premier); // "fraise"
console.log(fruits); // ["pomme", "banane"]
```

### 🔍 Algorithmes de Base sur les Tableaux

#### Recherche Linéaire
```javascript
function rechercheLineaire(arr, cible) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === cible) {
            return i; // Retourne l'index
        }
    }
    return -1; // Non trouvé
}

console.log(rechercheLineaire([1, 3, 5, 7, 9], 5)); // 2
console.log(rechercheLineaire([1, 3, 5, 7, 9], 4)); // -1
```
**Complexité** : O(n)

#### Calcul de Somme
```javascript
function sommeTableau(arr) {
    let somme = 0;
    for (let nombre of arr) {
        somme += nombre;
    }
    return somme;
}

console.log(sommeTableau([1, 2, 3, 4])); // 10
```
**Complexité** : O(n)

#### Recherche du Maximum
```javascript
function maximumTableau(arr) {
    if (arr.length === 0) return undefined;

    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

console.log(maximumTableau([3, 1, 8, 2, 5])); // 8
```
**Complexité** : O(n)

---

## 🔄 Algorithmes de Tri

### 🎯 Tri par Insertion (Insertion Sort)

**Principe** : Construit le tableau trié élément par élément.

```javascript
function triInsertion(arr) {
    for (let i = 1; i < arr.length; i++) {
        let cle = arr[i];
        let j = i - 1;

        // Décaler les éléments plus grands que la clé
        while (j >= 0 && arr[j] > cle) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = cle;
    }
    return arr;
}

// Exemple
let tableau = [12, 11, 13, 5, 6];
console.log(triInsertion(tableau)); // [5, 6, 11, 12, 13]
```

**Complexité** :
- Meilleur cas : O(n) - tableau déjà trié
- Pire cas : O(n²) - tableau trié en ordre inverse
- Cas moyen : O(n²)

### 🫧 Tri à Bulles (Bubble Sort)

**Principe** : Compare et échange les éléments adjacents.

```javascript
function triBulles(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Échange
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Exemple
let tableau = [64, 34, 25, 12, 22, 11, 90];
console.log(triBulles(tableau)); // [11, 12, 22, 25, 34, 64, 90]
```

**Complexité** : O(n²) dans tous les cas

### ⚡ Tri Rapide (QuickSort)

**Principe** : Diviser pour régner - choisit un pivot et partitionne.

```javascript
function triRapide(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[arr.length - 1];
    const gauche = [];
    const droite = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            gauche.push(arr[i]);
        } else {
            droite.push(arr[i]);
        }
    }

    return [...triRapide(gauche), pivot, ...triRapide(droite)];
}

// Exemple
let tableau = [10, 7, 8, 9, 1, 5];
console.log(triRapide(tableau)); // [1, 5, 7, 8, 9, 10]
```

**Complexité** :
- Meilleur cas : O(n log n)
- Pire cas : O(n²) - quand le pivot est toujours l'élément extrême
- Cas moyen : O(n log n)

### 🔀 Tri Fusion (Merge Sort)

**Principe** : Divise le tableau en deux, trie récursivement, puis fusionne.

```javascript
function triFusion(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const milieu = Math.floor(arr.length / 2);
    const gauche = arr.slice(0, milieu);
    const droite = arr.slice(milieu);

    return fusion(triFusion(gauche), triFusion(droite));
}

function fusion(gauche, droite) {
    let resultat = [];
    let i = 0, j = 0;

    while (i < gauche.length && j < droite.length) {
        if (gauche[i] < droite[j]) {
            resultat.push(gauche[i]);
            i++;
        } else {
            resultat.push(droite[j]);
            j++;
        }
    }

    // Ajouter les éléments restants
    return resultat.concat(gauche.slice(i)).concat(droite.slice(j));
}

// Exemple
let tableau = [12, 11, 13, 5, 6, 7];
console.log(triFusion(tableau)); // [5, 6, 7, 11, 12, 13]
```

**Complexité** : O(n log n) dans tous les cas

---

## 📊 Comparaison des Algorithmes de Tri

| Algorithme | Meilleur | Moyen | Pire | Stable | Complexité Espace |
|------------|----------|-------|------|--------|-------------------|
| **Insertion** | O(n) | O(n²) | O(n²) | ✅ | O(1) |
| **Bulles** | O(n) | O(n²) | O(n²) | ✅ | O(1) |
| **Rapide** | O(n log n) | O(n log n) | O(n²) | ❌ | O(log n) |
| **Fusion** | O(n log n) | O(n log n) | O(n log n) | ✅ | O(n) |

### 🚀 Tris Linéaires

#### Tri par Comptage (Counting Sort)

**Principe** : Compte les occurrences de chaque valeur.

```javascript
function triComptage(arr) {
    if (arr.length === 0) return arr;

    // Trouver min et max
    let min = Math.min(...arr);
    let max = Math.max(...arr);

    // Initialiser le tableau de comptage
    let comptage = new Array(max - min + 1).fill(0);

    // Compter les occurrences
    for (let nombre of arr) {
        comptage[nombre - min]++;
    }

    // Reconstruire le tableau trié
    let resultat = [];
    for (let i = 0; i < comptage.length; i++) {
        for (let j = 0; j < comptage[i]; j++) {
            resultat.push(i + min);
        }
    }

    return resultat;
}

// Exemple
let tableau = [4, 2, 2, 8, 3, 3, 1];
console.log(triComptage(tableau)); // [1, 2, 2, 3, 3, 4, 8]
```

**Complexité** : O(n + k) où k = plage de valeurs
**Utilisation** : Quand la plage de valeurs est limitée

---

## 💻 Exercice Pratique 1

**Objectif** : Implémenter un tri personnalisé pour des objets.

**Consignes** :
- Créer une fonction qui trie un tableau d'objets par une propriété donnée
- Utiliser un algorithme de tri de votre choix

```javascript
let personnes = [
    { nom: "Alice", age: 25 },
    { nom: "Bob", age: 30 },
    { nom: "Charlie", age: 20 }
];

// Trier par âge croissant
function trierParPropriete(arr, propriete) {
    // TODO: implémenter
}

console.log(trierParPropriete(personnes, "age"));
// Résultat attendu :
// [{nom: "Charlie", age: 20}, {nom: "Alice", age: 25}, {nom: "Bob", age: 30}]
```

### Solution :
```javascript
function trierParPropriete(arr, propriete) {
    return arr.slice().sort((a, b) => {
        if (a[propriete] < b[propriete]) return -1;
        if (a[propriete] > b[propriete]) return 1;
        return 0;
    });
}
```

---

## 💻 Exercice Pratique 2

**Objectif** : Analyser les performances des tris.

**Consignes** :
- Créer une fonction qui mesure le temps d'exécution d'un tri
- Tester avec différents algorithmes et tailles de tableaux

```javascript
function mesurerTemps(algorithmeTri, arr) {
    const debut = performance.now();
    const resultat = algorithmeTri([...arr]); // Copie pour ne pas modifier l'original
    const fin = performance.now();
    return {
        temps: fin - debut,
        resultat: resultat
    };
}

// Test avec un grand tableau
let grandTableau = Array.from({length: 10000}, () => Math.floor(Math.random() * 10000));

console.log("Tri rapide:", mesurerTemps(triRapide, grandTableau).temps, "ms");
console.log("Tri fusion:", mesurerTemps(triFusion, grandTableau).temps, "ms");
```

---

### Exercice 3 : Tri à Bulles Optimisé

**Objectif** : Implémenter une version optimisée du tri à bulles avec détection précoce.

**Consignes** :
- Implémenter le tri à bulles de base
- Ajouter une optimisation : arrêter si aucun échange n'a eu lieu dans un passage
- Comparer les performances avec la version non optimisée

```javascript
function triBullesOptimise(arr) {
    // TODO: implémenter la version optimisée
}

// Tests
let testArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Avant:", testArray);
triBullesOptimise(testArray);
console.log("Après:", testArray);
```

### Solution :
```javascript
function triBullesOptimise(arr) {
    let n = arr.length;
    let swapped;

    for (let i = 0; i < n - 1; i++) {
        swapped = false;

        // Derniers i éléments sont déjà triés
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Échange
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }

        // Si aucun échange n'a eu lieu, le tableau est trié
        if (!swapped) {
            break;
        }
    }
}
```
**Amélioration** : Dans le meilleur cas (tableau déjà trié), complexité O(n) au lieu de O(n²)

---

### Exercice 4 : Tri par Sélection Étape par Étape

**Objectif** : Implémenter le tri par sélection avec traçage détaillé.

**Consignes** :
- Implémenter le tri par sélection
- Afficher l'état du tableau après chaque itération
- Montrer quel élément est sélectionné comme minimum

```javascript
function triSelectionAvecTrace(arr) {
    // TODO: implémenter avec affichage détaillé
}

// Test
let arr = [64, 25, 12, 22, 11];
triSelectionAvecTrace(arr);
```

### Solution :
```javascript
function triSelectionAvecTrace(arr) {
    console.log("État initial:", arr);

    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;

        // Trouver l'élément minimum dans la partie non triée
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        // Échanger avec le premier élément non trié
        if (minIndex !== i) {
            console.log(`Échange: ${arr[i]} ↔ ${arr[minIndex]} (indices ${i} ↔ ${minIndex})`);
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        } else {
            console.log(`Pas d'échange nécessaire (position ${i} est déjà minimum)`);
        }

        console.log(`Après itération ${i + 1}:`, arr);
        console.log(`Partie triée: [${arr.slice(0, i + 1).join(', ')}]`);
        console.log("---");
    }

    console.log("Tri terminé:", arr);
}
```
**Avantages du tri par sélection** :
- Nombre minimal d'échanges (au plus n-1)
- Simple à comprendre et implémenter
- Performant pour les petits tableaux

---

### Exercice 5 : Benchmark Complet des Algorithmes

**Objectif** : Créer un benchmark complet comparant tous les algorithmes de tri.

**Consignes** :
- Implémenter tous les algorithmes de tri vus dans ce chapitre
- Créer une fonction de benchmark qui mesure temps et nombre d'opérations
- Tester avec différents types de données (aléatoire, trié, inverse)

```javascript
// Structure attendue
const benchmarkResults = {
    bubble: { time: 0, comparisons: 0, swaps: 0 },
    insertion: { time: 0, comparisons: 0, swaps: 0 },
    selection: { time: 0, comparisons: 0, swaps: 0 },
    quick: { time: 0, comparisons: 0, swaps: 0 },
    merge: { time: 0, comparisons: 0, swaps: 0 }
};

function runBenchmark() {
    // TODO: implémenter le benchmark complet
    // Retourner les résultats comparatifs
}
```

### Solution :
```javascript
// Compteurs globaux pour mesurer les opérations
let comparisons = 0;
let swaps = 0;

// Fonction utilitaire pour mesurer le temps
function measureTime(fn, arr) {
    comparisons = 0;
    swaps = 0;

    const start = performance.now();
    const result = fn([...arr]); // Copie pour ne pas modifier l'original
    const end = performance.now();

    return {
        time: end - start,
        comparisons: comparisons,
        swaps: swaps,
        result: result
    };
}

// Tri à bulles avec compteurs
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            comparisons++;
            if (arr[j] > arr[j + 1]) {
                swaps++;
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Tri par insertion avec compteurs
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            comparisons++;
            arr[j + 1] = arr[j];
            swaps++;
            j--;
        }
        comparisons++; // Pour la dernière comparaison qui échoue
        arr[j + 1] = key;
    }
    return arr;
}

// Fonction principale de benchmark
function runBenchmark() {
    // Génération de différents types de données de test
    const sizes = [100, 500, 1000];
    const dataTypes = {
        random: (size) => Array.from({length: size}, () => Math.floor(Math.random() * 1000)),
        sorted: (size) => Array.from({length: size}, (_, i) => i),
        reverse: (size) => Array.from({length: size}, (_, i) => size - i),
        nearlySorted: (size) => {
            const arr = Array.from({length: size}, (_, i) => i);
            // Échanger quelques éléments
            for (let i = 0; i < Math.floor(size * 0.1); i++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
            }
            return arr;
        }
    };

    const algorithms = {
        bubble: bubbleSort,
        insertion: insertionSort
        // Ajouter les autres algorithmes...
    };

    const results = {};

    console.log("🏃 Lancement du benchmark complet...\n");

    for (const [dataType, generator] of Object.entries(dataTypes)) {
        console.log(`📊 Test avec données ${dataType}:`);
        results[dataType] = {};

        for (const size of sizes) {
            const testData = generator(size);
            console.log(`  Taille ${size}:`);

            for (const [algoName, algoFn] of Object.entries(algorithms)) {
                const metrics = measureTime(algoFn, testData);
                results[dataType][size] = results[dataType][size] || {};
                results[dataType][size][algoName] = metrics;

                console.log(`    ${algoName}: ${metrics.time.toFixed(2)}ms, ${metrics.comparisons} comp, ${metrics.swaps} swaps`);
            }
        }
        console.log("");
    }

    return results;
}

// Exécution du benchmark
const benchmarkResults = runBenchmark();
console.log("Benchmark terminé ! Résultats disponibles dans benchmarkResults");
```

---

## 📝 Quiz de Révision

### Question 1
Quelle est la complexité temporelle moyenne du tri rapide ?
- A) O(n)
- B) O(n log n)  ← **Réponse**
- C) O(n²)
- D) O(2ⁿ)

### Question 2
Quel algorithme de tri est considéré comme stable ?
- A) Tri rapide
- B) Tri fusion  ← **Réponse**
- C) Tri rapide seulement
- D) Aucun des trois

### Question 3
Pour quel type de données le tri par comptage est-il particulièrement efficace ?
- A) Chaînes de caractères
- B) Nombres avec une petite plage de valeurs  ← **Réponse**
- C) Objets complexes
- D) Données non comparables

### Question 4
Quelle opération sur un tableau JavaScript est en O(1) ?
- A) push()  ← **Réponse**
- B) splice() au milieu
- C) sort()
- D) indexOf()

---

## 🔑 Points Clés à Retenir

1. **Tableaux** = structures de données ordonnées avec accès O(1) par index
2. **Tri insertion** = simple, efficace sur petits tableaux ou presque triés
3. **Tri rapide** = généralement le plus rapide en pratique, O(n log n) moyen
4. **Tri fusion** = stable, O(n log n) garanti, utilise O(n) espace
5. **Tri bulle** = simple à comprendre, mais O(n²) - à éviter en production
6. **Choisir l'algorithme** selon les contraintes (stabilité, mémoire, données)

---

*Chapitre suivant : [Listes Chaînées](03-linked-lists.md)*
