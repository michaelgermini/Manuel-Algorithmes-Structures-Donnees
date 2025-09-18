# Chapitre 1 : Introduction aux Algorithmes

## 🎯 Qu'est-ce qu'un Algorithme ?

Un **algorithme** est une séquence d'instructions finie et non ambiguë pour résoudre un problème ou accomplir une tâche.

### 💡 Exemple Simple : Addition de Deux Nombres

**Problème** : Additionner deux nombres `a` et `b`.

**Algorithme** :
1. Prendre le premier nombre `a`
2. Prendre le deuxième nombre `b`
3. Calculer `a + b`
4. Retourner le résultat

```javascript
function addition(a, b) {
    return a + b;
}

console.log(addition(5, 3)); // 8
```

### 🔍 Caractéristiques d'un Bon Algorithme

- **Finitude** : Se termine toujours
- **Déterminisme** : Même entrée = même sortie
- **Efficacité** : Utilise peu de ressources
- **Généralité** : Marche pour différentes entrées

---

## 📊 Complexité et Notation Big O

La complexité mesure les **ressources nécessaires** à un algorithme :
- **Temps** : nombre d'opérations
- **Espace** : mémoire utilisée

### 🧮 Notation Big O - Les Classes Principales

| Notation | Nom | Exemple | Description |
|----------|-----|---------|-------------|
| **O(1)** | Constante | Accès tableau | Temps constant |
| **O(log n)** | Logarithmique | Recherche binaire | Divise par 2 à chaque étape |
| **O(n)** | Linéaire | Parcours liste | Proportionnel à la taille |
| **O(n log n)** | Linéarithmique | Tri rapide | Bonne pour la plupart des tris |
| **O(n²)** | Quadratique | Tri bulle | Deux boucles imbriquées |
| **O(2ⁿ)** | Exponentielle | Sous-ensembles | Explosion combinatoire |
| **O(n!)** | Factorielle | Permutations | Très coûteux |

### 📈 Analyse d'Exemples

#### Exemple 1 : Recherche Linéaire
```javascript
function rechercheLineaire(arr, cible) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === cible) return i;
    }
    return -1;
}
```
**Complexité** : **O(n)** - Au pire, parcourt tout le tableau

#### Exemple 2 : Recherche Binaire
```javascript
function rechercheBinaire(arr, cible) {
    let gauche = 0;
    let droite = arr.length - 1;

    while (gauche <= droite) {
        let milieu = Math.floor((gauche + droite) / 2);
        if (arr[milieu] === cible) return milieu;
        if (arr[milieu] < cible) gauche = milieu + 1;
        else droite = milieu - 1;
    }
    return -1;
}
```
**Complexité** : **O(log n)** - Divise l'espace de recherche par 2

### 🎨 Visualisation des Complexités

```
Éléments (n)    | O(1) | O(log n) | O(n) | O(n log n) | O(n²)
---------------|------|----------|------|------------|-------
10             | 1    | 3        | 10   | 30         | 100
100            | 1    | 7        | 100  | 700        | 10,000
1,000          | 1    | 10       | 1,000| 10,000     | 1,000,000
10,000         | 1    | 13       | 10,000| 130,000   | 100,000,000
```

---

## 🏗️ Premières Notions Algorithmiques

### 1. Variables et Types de Base

```javascript
// Nombres
let nombre = 42;
let decimal = 3.14;

// Chaînes de caractères
let texte = "Hello World";

// Booléens
let vrai = true;
let faux = false;

// Tableaux
let tableau = [1, 2, 3, 4, 5];
```

### 2. Structures de Contrôle

#### Condition If-Else
```javascript
function maximum(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}
```

#### Boucle For
```javascript
function sommeTableau(arr) {
    let somme = 0;
    for (let i = 0; i < arr.length; i++) {
        somme += arr[i];
    }
    return somme;
}
```

#### Boucle While
```javascript
function factorielle(n) {
    let resultat = 1;
    let i = 1;
    while (i <= n) {
        resultat *= i;
        i++;
    }
    return resultat;
}
```

### 3. Fonctions et Modularité

```javascript
// Fonction avec paramètres et retour
function estPair(nombre) {
    return nombre % 2 === 0;
}

// Fonction sans retour (procédure)
function afficherTableau(arr) {
    for (let element of arr) {
        console.log(element);
    }
}
```

---

## 💻 Exercices Pratiques

### Exercice 1 : Calcul de Complexité

**Objectif** : Calculer la moyenne d'un tableau de nombres.

**Consignes** :
- Créer une fonction `moyenne`
- Prendre un tableau en paramètre
- Retourner la moyenne (somme / nombre d'éléments)
- Gérer le cas du tableau vide

```javascript
// Votre code ici

function moyenne(tableau) {
    // TODO: implémenter
}

// Tests
console.log(moyenne([1, 2, 3, 4, 5])); // 3
console.log(moyenne([])); // 0 ou gérer l'erreur
```

### Solution :
```javascript
function moyenne(tableau) {
    if (tableau.length === 0) return 0;

    let somme = 0;
    for (let nombre of tableau) {
        somme += nombre;
    }
    return somme / tableau.length;
}
```

---

## 🧠 Exercice Pratique 2

**Objectif** : Trouver le maximum dans un tableau.

**Analyse de complexité** : Quelle est la complexité temporelle de votre solution ?

```javascript
function maximumTableau(arr) {
    // TODO: implémenter
}

// Tests
console.log(maximumTableau([3, 1, 8, 2, 5])); // 8
console.log(maximumTableau([-1, -5, -3])); // -1
```

### Solution :
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
```
**Complexité** : O(n) - Un seul passage sur le tableau

---

### Exercice 3 : Recherche Linéaire

**Objectif** : Implémenter une recherche linéaire et analyser sa complexité.

**Consignes** :
- Créer une fonction `rechercheLineaire`
- Prendre un tableau et une valeur cible
- Retourner l'index si trouvé, -1 sinon
- Analyser la complexité dans les meilleurs et pires cas

```javascript
function rechercheLineaire(arr, cible) {
    // TODO: implémenter
}

// Tests
console.log(rechercheLineaire([1, 3, 5, 7, 9], 5)); // 2
console.log(rechercheLineaire([1, 3, 5, 7, 9], 4)); // -1
console.log(rechercheLineaire([], 5)); // -1
```

### Solution :
```javascript
function rechercheLineaire(arr, cible) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === cible) {
            return i; // Trouvé à l'index i
        }
    }
    return -1; // Non trouvé
}
```
**Complexité** :
- **Meilleur cas** : O(1) - élément au début
- **Pire cas** : O(n) - élément à la fin ou absent
- **Cas moyen** : O(n)

---

### Exercice 4 : Fonctions et Modularité

**Objectif** : Créer des fonctions modulaires pour résoudre un problème complexe.

**Consignes** :
- Créer une fonction `estPair` qui vérifie si un nombre est pair
- Créer une fonction `compterPairs` qui compte les nombres pairs dans un tableau
- Créer une fonction `moyennePairs` qui calcule la moyenne des nombres pairs
- Combiner ces fonctions pour résoudre le problème complet

```javascript
function estPair(nombre) {
    // TODO: implémenter
}

function compterPairs(tableau) {
    // TODO: implémenter
}

function moyennePairs(tableau) {
    // TODO: implémenter
}

// Tests
console.log(estPair(4)); // true
console.log(estPair(5)); // false
console.log(compterPairs([1, 2, 3, 4, 5, 6])); // 3
console.log(moyennePairs([1, 2, 3, 4, 5, 6])); // 4 (moyenne de 2, 4, 6)
```

### Solution :
```javascript
function estPair(nombre) {
    return nombre % 2 === 0;
}

function compterPairs(tableau) {
    let compteur = 0;
    for (let nombre of tableau) {
        if (estPair(nombre)) {
            compteur++;
        }
    }
    return compteur;
}

function moyennePairs(tableau) {
    let somme = 0;
    let compteur = 0;

    for (let nombre of tableau) {
        if (estPair(nombre)) {
            somme += nombre;
            compteur++;
        }
    }

    return compteur > 0 ? somme / compteur : 0;
}
```
**Complexité** : O(n) pour toutes les fonctions

---

## 📝 Quiz de Révision

### Question 1
Quelle est la complexité de l'algorithme suivant ?
```javascript
for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
        console.log(i, j);
    }
}
```
- A) O(1)
- B) O(n)
- C) O(n²)  ← **Réponse**
- D) O(2ⁿ)

### Question 2
Quelle notation Big O représente le meilleur cas pour un algorithme de tri ?
- A) O(1)
- B) O(n)
- C) O(n log n)  ← **Réponse**
- D) O(n²)

### Question 3
Un algorithme est considéré comme efficace si sa complexité est :
- A) O(1) seulement
- B) O(n²) ou moins  ← **Réponse**
- C) O(2ⁿ) ou moins
- D) Quelle que soit la complexité

---

## 🔑 Points Clés à Retenir

1. **Algorithme** = séquence d'instructions pour résoudre un problème
2. **Complexité** = mesure des ressources (temps/espace)
3. **Big O** = notation pour exprimer la complexité asymptotique
4. **O(1)** = constant, **O(log n)** = logarithmique, **O(n)** = linéaire
5. **Analyser** toujours la complexité de vos algorithmes
6. **Pratiquer** avec des exercices simples avant de passer aux structures complexes

---

*Chapitre suivant : [Tableaux et Algorithmes de Tri](02-arrays-sorting.md)*
