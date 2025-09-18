# Chapitre 4 : Récursion & Diviser pour Régner

## 🔄 La Récursion

### Définition

La **récursion** est une technique où une fonction s'appelle elle-même pour résoudre un problème.

💡 **Analogie** : Comme une poupée russe - chaque poupée contient une version plus petite d'elle-même.

### Éléments Essentiels

1. **Cas de base** : condition d'arrêt pour éviter la récursion infinie
2. **Cas récursif** : appel à soi-même avec un problème plus petit
3. **Progression** : chaque appel doit se rapprocher du cas de base

---

## 📊 Exemples de Base

### Factorielle

**Définition mathématique** : `n! = n × (n-1) × ... × 1`

```javascript
function factorielle(n) {
  // Cas de base
  if (n === 0 || n === 1) {
    return 1;
  }

  // Cas récursif
  return n * factorielle(n - 1);
}

console.log(factorielle(5)); // 120 (5! = 5 × 4 × 3 × 2 × 1)
```

**Visualisation de l'exécution** :
```
factorielle(5)
  ↳ 5 × factorielle(4)
      ↳ 4 × factorielle(3)
          ↳ 3 × factorielle(2)
              ↳ 2 × factorielle(1)
                  ↳ 1
              ↳ 2 × 1 = 2
          ↳ 3 × 2 = 6
      ↳ 4 × 6 = 24
  ↳ 5 × 24 = 120
```

### Suite de Fibonacci

**Définition** : `F(n) = F(n-1) + F(n-2)` avec `F(0) = 0, F(1) = 1`

```javascript
function fibonacci(n) {
  // Cas de base
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Cas récursif
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(6)); // 8 (0, 1, 1, 2, 3, 5, 8)
```

⚠️ **Problème** : Cette implémentation est **exponentielle** O(2ⁿ) à cause des recalculs !

### Version Optimisée (Mémoïsation)

```javascript
function fibonacciMemo(n, memo = {}) {
  // Vérifier si déjà calculé
  if (memo[n] !== undefined) {
    return memo[n];
  }

  // Cas de base
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Calcul récursif avec mémoïsation
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

console.log(fibonacciMemo(50)); // Très rapide !
```

**Complexité** : O(n) temps, O(n) espace

---

## 🧠 Raisonnement Récursif

### Comment Décomposer un Problème

Prenons **la somme d'un tableau** :

**Approche itérative** :
```javascript
function sommeIterative(arr) {
  let total = 0;
  for (let nombre of arr) {
    total += nombre;
  }
  return total;
}
```

**Approche récursive** :
```javascript
function sommeRecursive(arr) {
  // Cas de base : tableau vide
  if (arr.length === 0) {
    return 0;
  }

  // Cas récursif : premier élément + somme du reste
  return arr[0] + sommeRecursive(arr.slice(1));
}

console.log(sommeRecursive([1, 2, 3, 4])); // 10
```

### Règles pour Reconnaître un Problème Récursif

1. **Sous-problèmes similaires** : Le problème peut être divisé en versions plus petites du même problème
2. **Réduction progressive** : Chaque étape réduit la taille du problème
3. **Cas de base identifiable** : Il existe une solution évidente pour les petits cas

---

## ✂️ Diviser pour Régner

### Stratégie Fondamentale

**Diviser pour régner** consiste à :
1. **Diviser** : Casser le problème en sous-problèmes indépendants
2. **Régner** : Résoudre récursivement les sous-problèmes
3. **Combiner** : Fusionner les solutions des sous-problèmes

### Recherche Binaire (Exemple Classique)

```javascript
function rechercheBinaireRecursive(arr, cible, gauche = 0, droite = arr.length - 1) {
  // Cas de base : élément non trouvé
  if (gauche > droite) {
    return -1;
  }

  // Diviser : trouver le milieu
  const milieu = Math.floor((gauche + droite) / 2);

  // Régner : comparer avec l'élément du milieu
  if (arr[milieu] === cible) {
    return milieu;
  }

  // Diviser plus : chercher dans la moitié appropriée
  if (arr[milieu] > cible) {
    return rechercheBinaireRecursive(arr, cible, gauche, milieu - 1);
  } else {
    return rechercheBinaireRecursive(arr, cible, milieu + 1, droite);
  }
}

const arr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log(rechercheBinaireRecursive(arr, 7)); // 3
```

**Complexité** : O(log n)

### Tri Fusion (Merge Sort)

```javascript
function triFusion(arr) {
  // Cas de base
  if (arr.length <= 1) {
    return arr;
  }

  // Diviser : couper en deux
  const milieu = Math.floor(arr.length / 2);
  const gauche = arr.slice(0, milieu);
  const droite = arr.slice(milieu);

  // Régner : trier récursivement
  const gaucheTrie = triFusion(gauche);
  const droiteTrie = triFusion(droite);

  // Combiner : fusionner les deux moitiés triées
  return fusion(gaucheTrie, droiteTrie);
}

function fusion(gauche, droite) {
  const resultat = [];
  let i = 0, j = 0;

  // Fusionner en comparant les éléments
  while (i < gauche.length && j < droite.length) {
    if (gauche[i] <= droite[j]) {
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

console.log(triFusion([38, 27, 43, 3, 9, 82, 10]));
// [3, 9, 10, 27, 38, 43, 82]
```

**Complexité** : O(n log n)

### Tour de Hanoï (Problème Classique)

**Règles** :
- 3 tours (départ, auxiliaire, arrivée)
- Déplacer n disques du départ vers l'arrivée
- Un disque plus petit ne peut pas être posé sur un plus grand

```javascript
function tourHanoi(n, depart, auxiliaire, arrivee) {
  // Cas de base
  if (n === 1) {
    console.log(`Déplacer disque 1 de ${depart} vers ${arrivee}`);
    return;
  }

  // Étape 1 : déplacer n-1 disques vers l'auxiliaire
  tourHanoi(n - 1, depart, arrivee, auxiliaire);

  // Étape 2 : déplacer le plus grand disque vers l'arrivée
  console.log(`Déplacer disque ${n} de ${depart} vers ${arrivee}`);

  // Étape 3 : déplacer les n-1 disques de l'auxiliaire vers l'arrivée
  tourHanoi(n - 1, auxiliaire, depart, arrivee);
}

tourHanoi(3, 'A', 'B', 'C');
/*
Déplacer disque 1 de A vers C
Déplacer disque 2 de A vers B
Déplacer disque 1 de C vers B
Déplacer disque 3 de A vers C
Déplacer disque 1 de B vers A
Déplacer disque 2 de B vers C
Déplacer disque 1 de A vers C
*/
```

**Complexité** : O(2ⁿ) - exponentielle !

---

## 🔄 Récursion vs Itération

### Quand Utiliser la Récursion ?

✅ **Avantages** :
- Code plus concis et élégant
- Modélise naturellement certains problèmes (arborescences)
- Utilise la pile d'appel automatiquement

❌ **Inconvénients** :
- Risque de débordement de pile (stack overflow)
- Moins efficace (overhead des appels de fonction)
- Plus difficile à déboguer

### Transformation Récursion → Itération

**Exemple : Factorielle**

```javascript
// Récursif
function factorielleRec(n) {
  if (n <= 1) return 1;
  return n * factorielleRec(n - 1);
}

// Itératif
function factorielleIter(n) {
  let resultat = 1;
  for (let i = 2; i <= n; i++) {
    resultat *= i;
  }
  return resultat;
}
```

**Exemple : Fibonacci**

```javascript
// Récursif avec mémoïsation
function fibonacciRec(n, memo = {}) {
  if (memo[n] !== undefined) return memo[n];
  if (n <= 1) return n;
  return memo[n] = fibonacciRec(n - 1, memo) + fibonacciRec(n - 2, memo);
}

// Itératif
function fibonacciIter(n) {
  if (n <= 1) return n;

  let precedent = 0;
  let courant = 1;

  for (let i = 2; i <= n; i++) {
    const suivant = precedent + courant;
    precedent = courant;
    courant = suivant;
  }

  return courant;
}
```

---

## 💻 Exercices Pratiques

### Exercice 1 : Puissance Récursive

**Objectif** : Calculer x^n de manière récursive.

**Version naïve** : O(n)
```javascript
function puissance(x, n) {
  if (n === 0) return 1;
  return x * puissance(x, n - 1);
}
```

**Version optimisée** : O(log n)
```javascript
function puissanceOptimisee(x, n) {
  if (n === 0) return 1;
  if (n === 1) return x;

  const moitie = puissanceOptimisee(x, Math.floor(n / 2));

  if (n % 2 === 0) {
    return moitie * moitie;
  } else {
    return x * moitie * moitie;
  }
}

console.log(puissanceOptimisee(2, 10)); // 1024
```

### Exercice 2 : Inverser une Chaîne

```javascript
function inverserChaine(chaine) {
  // Cas de base
  if (chaine.length <= 1) {
    return chaine;
  }

  // Cas récursif
  return inverserChaine(chaine.slice(1)) + chaine[0];
}

console.log(inverserChaine("hello")); // "olleh"
```

### Exercice 3 : Somme des Chiffres

```javascript
function sommeChiffres(n) {
  // Cas de base
  if (n === 0) {
    return 0;
  }

  // Cas récursif
  return (n % 10) + sommeChiffres(Math.floor(n / 10));
}

console.log(sommeChiffres(12345)); // 15 (1+2+3+4+5)
```

### Exercice 4 : Palindrome Récursif

```javascript
function estPalindrome(chaine) {
  // Cas de base
  if (chaine.length <= 1) {
    return true;
  }

  // Vérifier les extrémités
  if (chaine[0] !== chaine[chaine.length - 1]) {
    return false;
  }

  // Cas récursif : vérifier le milieu
  return estPalindrome(chaine.slice(1, -1));
}

console.log(estPalindrome("radar")); // true
console.log(estPalindrome("hello")); // false
```

### Exercice 5 : Maximum dans un Tableau

```javascript
function maximumTableau(arr, index = 0, maxActuel = -Infinity) {
  // Cas de base
  if (index >= arr.length) {
    return maxActuel;
  }

  // Cas récursif
  const nouveauMax = Math.max(maxActuel, arr[index]);
  return maximumTableau(arr, index + 1, nouveauMax);
}

console.log(maximumTableau([3, 7, 2, 9, 1])); // 9
```

---

## 🔍 Problèmes Avancés

### Problème : Génération de Sous-Ensembles

**Objectif** : Générer tous les sous-ensembles d'un ensemble.

```javascript
function sousEnsembles(arr, index = 0, courant = []) {
  // Cas de base : tous les éléments traités
  if (index >= arr.length) {
    console.log(courant);
    return;
  }

  // Ne pas inclure l'élément actuel
  sousEnsembles(arr, index + 1, [...courant]);

  // Inclure l'élément actuel
  sousEnsembles(arr, index + 1, [...courant, arr[index]]);
}

sousEnsembles([1, 2, 3]);
/*
[]
[3]
[2]
[2, 3]
[1]
[1, 3]
[1, 2]
[1, 2, 3]
*/
```

### Problème : Résolution de Labyrinthe

```javascript
function resoudreLabyrinthe(labyrinthe, depart, arrivee, chemin = []) {
  const [x, y] = depart;

  // Cas de base : arrivé
  if (x === arrivee[0] && y === arrivee[1]) {
    return [chemin.concat([depart])];
  }

  // Marquer comme visité
  labyrinthe[y][x] = 1;

  const solutions = [];
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  for (let [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    // Vérifier les limites et si chemin libre
    if (nx >= 0 && nx < labyrinthe[0].length &&
        ny >= 0 && ny < labyrinthe.length &&
        labyrinthe[ny][nx] === 0) {

      const nouvellesSolutions = resoudreLabyrinthe(
        labyrinthe,
        [nx, ny],
        arrivee,
        chemin.concat([depart])
      );

      solutions.push(...nouvellesSolutions);
    }
  }

  // Remettre à 0 (backtracking)
  labyrinthe[y][x] = 0;

  return solutions;
}

// Labyrinthe : 0 = chemin libre, 1 = mur
const labyrinthe = [
  [0, 1, 0, 0],
  [0, 1, 0, 1],
  [0, 0, 0, 1],
  [1, 0, 0, 0]
];

const solutions = resoudreLabyrinthe(labyrinthe, [0, 0], [3, 3]);
console.log(`Nombre de solutions: ${solutions.length}`);
```

---

## ⚠️ Pièges et Erreurs Courantes

### 1. Oubli du Cas de Base

```javascript
// ❌ ERREUR : récursion infinie
function factorielleInfinie(n) {
  return n * factorielleInfinie(n - 1); // Pas de cas de base !
}
```

### 2. Cas de Base Incorrect

```javascript
// ❌ ERREUR : factorielle(1) = 0 ?
function factorielleErreur(n) {
  if (n === 1) return 0; // Erreur !
  return n * factorielleErreur(n - 1);
}
```

### 3. Problème de Performance

```javascript
// ❌ Fibonacci récursif naïf = O(2ⁿ)
function fibonacciLent(n) {
  if (n <= 1) return n;
  return fibonacciLent(n - 1) + fibonacciLent(n - 2);
}
```

### 4. Variables Globales dans la Récursion

```javascript
// ❌ ERREUR : variable globale modifiée
let compteur = 0;
function compter(n) {
  compteur++; // Problème si appels imbriqués !
  if (n <= 1) return n;
  return compter(n - 1) + compter(n - 2);
}
```

---

## 📊 Complexité des Algorithmes Récursifs

| Algorithme | Complexité | Explication |
|------------|------------|-------------|
| **Factorielle** | O(n) | n appels récursifs |
| **Fibonacci (mémoïsé)** | O(n) | Chaque valeur calculée une fois |
| **Fibonacci (naïf)** | O(2ⁿ) | Arbre d'appels exponentiel |
| **Recherche binaire** | O(log n) | Division par 2 à chaque étape |
| **Tri fusion** | O(n log n) | Division + fusion linéaire |
| **Tour de Hanoï** | O(2ⁿ) | Doublement des appels |

---

## 🎯 Applications Réelles

### 1. Systèmes de Fichiers (Arborescences)

```javascript
function listerFichiers(dossier, profondeur = 0) {
  const indentation = '  '.repeat(profondeur);

  for (let element of dossier.contenu) {
    console.log(`${indentation}${element.nom}`);

    if (element.type === 'dossier') {
      listerFichiers(element, profondeur + 1);
    }
  }
}
```

### 2. Évaluation d'Expressions Mathématiques

```javascript
function evaluerExpression(expression) {
  // Parser et évaluer récursivement
  // Exemple simplifié pour illustration
  if (typeof expression === 'number') {
    return expression;
  }

  const [gauche, operateur, droite] = expression;

  switch (operateur) {
    case '+': return evaluerExpression(gauche) + evaluerExpression(droite);
    case '-': return evaluerExpression(gauche) - evaluerExpression(droite);
    case '*': return evaluerExpression(gauche) * evaluerExpression(droite);
    case '/': return evaluerExpression(gauche) / evaluerExpression(droite);
  }
}
```

### 3. Algorithmes de Tri et Recherche

- **Tri rapide** : partition récursive
- **Tri fusion** : division récursive
- **Recherche dans les arbres** : parcours récursif

---

## 📝 Quiz de Révision

### Question 1
Quel est l'élément essentiel pour éviter une récursion infinie ?
- A) Une boucle while
- B) Un cas de base  ← **Réponse**
- C) Une variable globale
- D) Un paramètre optionnel

### Question 2
Quelle est la complexité du tri fusion ?
- A) O(n)
- B) O(n log n)  ← **Réponse**
- C) O(n²)
- D) O(2ⁿ)

### Question 3
Quelle stratégie algorithmique divise le problème en sous-problèmes indépendants ?
- A) Programmation dynamique
- B) Diviser pour régner  ← **Réponse**
- C) Algorithme glouton
- D) Backtracking

### Question 4
Pourquoi la récursion peut-elle causer un stack overflow ?
- A) Mémoire insuffisante
- B) Trop d'appels récursifs empilés  ← **Réponse**
- C) Variables locales trop grandes
- D) Calculs trop complexes

---

## 🔑 Points Clés à Retenir

1. **Récursion** = fonction qui s'appelle elle-même
2. **Cas de base** = condition d'arrêt obligatoire
3. **Diviser pour régner** = diviser, régner, combiner
4. **Complexité** : attention aux appels multiples (exponentielle)
5. **Mémoïsation** = optimisation pour éviter les recalculs
6. **Récursion vs Itération** : élégance vs performance

---

*Chapitre suivant : [Arbres Binaires de Recherche](08-binary-search-trees.md)*
