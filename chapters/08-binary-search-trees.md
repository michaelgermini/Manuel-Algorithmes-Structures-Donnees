# Chapitre 8 : Arbres Binaires de Recherche (BST)

## 🌳 Qu'est-ce qu'un Arbre Binaire de Recherche ?

Un **arbre binaire de recherche** (BST) est une structure de données arborescente où chaque nœud respecte une propriété d'ordre.

### Propriété Fondamentale

Pour chaque nœud :
- **Sous-arbre gauche** : valeurs ≤ valeur du nœud
- **Sous-arbre droit** : valeurs > valeur du nœud

### Structure d'un Nœud

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;   // Sous-arbre gauche
    this.right = null;  // Sous-arbre droit
  }
}
```

---

## 🌲 Implémentation Complète d'un BST

```javascript
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insertion d'une valeur
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;

    while (true) {
      if (value === current.value) {
        return this; // Valeurs dupliquées non autorisées
      }

      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Recherche d'une valeur
  find(value) {
    let current = this.root;

    while (current) {
      if (value === current.value) {
        return current;
      }

      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  // Vérification de l'existence
  contains(value) {
    return this.find(value) !== null;
  }

  // Suppression d'une valeur
  remove(value) {
    this.root = this.removeNode(this.root, value);
    return this;
  }

  removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this.removeNode(node.right, value);
      return node;
    } else {
      // Nœud trouvé - 3 cas possibles

      // Cas 1 : Feuille (pas d'enfants)
      if (!node.left && !node.right) {
        return null;
      }

      // Cas 2 : Un seul enfant
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Cas 3 : Deux enfants - trouver le successeur
      const successor = this.findMin(node.right);
      node.value = successor.value;
      node.right = this.removeNode(node.right, successor.value);
      return node;
    }
  }

  findMin(node = this.root) {
    while (node && node.left) {
      node = node.left;
    }
    return node;
  }

  findMax(node = this.root) {
    while (node && node.right) {
      node = node.right;
    }
    return node;
  }
}

// Exemple d'utilisation
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(3);
bst.insert(7);
bst.insert(13);
bst.insert(17);

console.log(bst.contains(7));  // true
console.log(bst.contains(12)); // false

bst.remove(5); // Supprimer nœud avec deux enfants
```

---

## 🔍 Parcours d'un Arbre Binaire

### 1. Parcours en Ordre (In-Order)

**Ordre** : Gauche → Racine → Droite  
**Résultat** : Valeurs triées !

```javascript
function inOrderTraversal(node, result = []) {
  if (node) {
    inOrderTraversal(node.left, result);
    result.push(node.value);
    inOrderTraversal(node.right, result);
  }
  return result;
}

// Exemple
const bst = new BinarySearchTree();
[10, 5, 15, 3, 7, 13, 17].forEach(val => bst.insert(val));

console.log(inOrderTraversal(bst.root));
// [3, 5, 7, 10, 13, 15, 17] - trié !
```

### 2. Parcours Préfixe (Pre-Order)

**Ordre** : Racine → Gauche → Droite  
**Usage** : Copier un arbre, expressions préfixées

```javascript
function preOrderTraversal(node, result = []) {
  if (node) {
    result.push(node.value);
    preOrderTraversal(node.left, result);
    preOrderTraversal(node.right, result);
  }
  return result;
}

console.log(preOrderTraversal(bst.root));
// [10, 5, 3, 7, 15, 13, 17]
```

### 3. Parcours Postfixe (Post-Order)

**Ordre** : Gauche → Droite → Racine  
**Usage** : Supprimer un arbre, expressions postfixées

```javascript
function postOrderTraversal(node, result = []) {
  if (node) {
    postOrderTraversal(node.left, result);
    postOrderTraversal(node.right, result);
    result.push(node.value);
  }
  return result;
}

console.log(postOrderTraversal(bst.root));
// [3, 7, 5, 13, 17, 15, 10]
```

### 4. Parcours en Largeur (Level-Order / BFS)

```javascript
function levelOrderTraversal(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }

    result.push(currentLevel);
  }

  return result;
}

console.log(levelOrderTraversal(bst.root));
// [[10], [5, 15], [3, 7, 13, 17]]
```

---

## 📊 Propriétés et Analyse

### Hauteur et Profondeur

```javascript
// Hauteur d'un nœud (longueur du plus long chemin descendant)
function getHeight(node) {
  if (!node) return -1;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// Profondeur d'un nœud (distance depuis la racine)
function getDepth(root, target, depth = 0) {
  if (!root) return -1;
  if (root.value === target) return depth;

  const leftDepth = getDepth(root.left, target, depth + 1);
  if (leftDepth !== -1) return leftDepth;

  return getDepth(root.right, target, depth + 1);
}

// Vérifier si l'arbre est équilibré
function isBalanced(root) {
  function checkBalance(node) {
    if (!node) return { height: -1, balanced: true };

    const left = checkBalance(node.left);
    const right = checkBalance(node.right);

    const height = 1 + Math.max(left.height, right.height);
    const balanced = left.balanced && right.balanced &&
                     Math.abs(left.height - right.height) <= 1;

    return { height, balanced };
  }

  return checkBalance(root).balanced;
}
```

### Complexité des Opérations

| Opération | Meilleur Cas | Pire Cas | Cas Moyen |
|-----------|-------------|----------|-----------|
| **Recherche** | O(log n) | O(n) | O(log n) |
| **Insertion** | O(log n) | O(n) | O(log n) |
| **Suppression** | O(log n) | O(n) | O(log n) |
| **Parcours** | O(n) | O(n) | O(n) |

**Note** : Le pire cas (O(n)) survient quand l'arbre dégénère en liste chaînée.

---

## 💻 Exercices Pratiques

### Exercice 1 : Vérifier si un BST est Valide

**Objectif** : Vérifier que l'arbre respecte la propriété BST.

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;

  if (root.value <= min || root.value >= max) {
    return false;
  }

  return isValidBST(root.left, min, root.value) &&
         isValidBST(root.right, root.value, max);
}

// Test
const bst = new BinarySearchTree();
[10, 5, 15, 3, 7].forEach(val => bst.insert(val));
console.log(isValidBST(bst.root)); // true
```

### Exercice 2 : Trouver le k-ième Plus Petit Élément

```javascript
function kthSmallest(root, k) {
  let count = 0;
  let result = null;

  function inOrder(node) {
    if (!node || result !== null) return;

    inOrder(node.left);

    count++;
    if (count === k) {
      result = node.value;
      return;
    }

    inOrder(node.right);
  }

  inOrder(root);
  return result;
}

// Test
console.log(kthSmallest(bst.root, 3)); // 7 (3ème plus petit)
```

### Exercice 3 : Convertir un Tableau Trié en BST Équilibré

```javascript
function sortedArrayToBST(nums, start = 0, end = nums.length - 1) {
  if (start > end) return null;

  const mid = Math.floor((start + end) / 2);
  const root = new Node(nums[mid]);

  root.left = sortedArrayToBST(nums, start, mid - 1);
  root.right = sortedArrayToBST(nums, mid + 1, end);

  return root;
}

// Test
const nums = [1, 2, 3, 4, 5, 6, 7];
const root = sortedArrayToBST(nums);
console.log(inOrderTraversal(root)); // [1, 2, 3, 4, 5, 6, 7]
```

### Exercice 4 : Ancêtre Commun le Plus Bas (LCA)

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root.value === p || root.value === q) {
    return root;
  }

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;
  return left || right;
}

// Test
console.log(lowestCommonAncestor(bst.root, 3, 7).value); // 5
console.log(lowestCommonAncestor(bst.root, 3, 13).value); // 10
```

### Exercice 5 : Inverser un BST

```javascript
function invertTree(root) {
  if (!root) return null;

  // Échanger les sous-arbres
  [root.left, root.right] = [root.right, root.left];

  // Inverser récursivement
  invertTree(root.left);
  invertTree(root.right);

  return root;
}

// Test
const original = inOrderTraversal(bst.root);
invertTree(bst.root);
const inverted = inOrderTraversal(bst.root);
console.log("Original:", original);
console.log("Inverted:", inverted);
```

---

## 🌟 Applications Réelles

### 1. Systèmes de Base de Données

```javascript
class DatabaseIndex {
  constructor() {
    this.index = new BinarySearchTree();
  }

  insertRecord(id, data) {
    this.index.insert(id);
    // Stocker data dans la vraie base
  }

  findRecord(id) {
    return this.index.contains(id);
  }

  // Recherche par plage
  findInRange(min, max) {
    const results = [];

    function collectInRange(node) {
      if (!node) return;

      if (node.value >= min) {
        collectInRange(node.left);
      }

      if (node.value >= min && node.value <= max) {
        results.push(node.value);
      }

      if (node.value <= max) {
        collectInRange(node.right);
      }
    }

    collectInRange(this.index.root);
    return results;
  }
}
```

### 2. Système de Fichiers Hiérarchique

```javascript
class FileSystem {
  constructor() {
    this.root = null;
  }

  insertPath(path) {
    const parts = path.split('/').filter(p => p);
    let current = this.root;

    for (let part of parts) {
      if (!current) {
        current = new Node(part);
        this.root = current;
      } else {
        // Insérer dans l'arbre (logique simplifiée)
        if (part < current.value) {
          if (!current.left) current.left = new Node(part);
          current = current.left;
        } else {
          if (!current.right) current.right = new Node(part);
          current = current.right;
        }
      }
    }
  }

  listPaths() {
    const paths = [];

    function collectPaths(node, currentPath = '') {
      if (!node) return;

      const newPath = currentPath + '/' + node.value;

      if (!node.left && !node.right) {
        // Feuille = fichier
        paths.push(newPath);
      }

      collectPaths(node.left, newPath);
      collectPaths(node.right, newPath);
    }

    collectPaths(this.root);
    return paths;
  }
}
```

### 3. Correction Orthographique (Suggestion de Mots)

```javascript
class SpellChecker {
  constructor() {
    this.dictionary = new BinarySearchTree();
  }

  addWord(word) {
    this.dictionary.insert(word.toLowerCase());
  }

  // Trouver le mot le plus proche (distance d'édition simplifiée)
  findClosest(word) {
    word = word.toLowerCase();
    let closest = null;
    let minDistance = Infinity;

    function checkWord(node) {
      if (!node) return;

      const distance = levenshteinDistance(word, node.value);
      if (distance < minDistance) {
        minDistance = distance;
        closest = node.value;
      }

      // Optimisation : ne visiter que les branches pertinentes
      if (word < node.value) {
        checkWord(node.left);
      } else {
        checkWord(node.right);
      }
    }

    checkWord(this.dictionary.root);
    return closest;
  }
}

function levenshteinDistance(a, b) {
  // Distance d'édition simplifiée
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  return Math.min(
    levenshteinDistance(a.slice(1), b) + 1,      // Suppression
    levenshteinDistance(a, b.slice(1)) + 1,      // Insertion
    levenshteinDistance(a.slice(1), b.slice(1)) + (a[0] === b[0] ? 0 : 1) // Substitution
  );
}
```

---

## ⚖️ Comparaison avec Autres Structures

| Structure | Recherche | Insertion | Tri Auto | Équilibrage |
|-----------|-----------|-----------|----------|-------------|
| **BST** | O(log n)* | O(log n)* | ✅ | ❌ |
| **Arbre AVL** | O(log n) | O(log n) | ✅ | ✅ |
| **Arbre Rouge-Noir** | O(log n) | O(log n) | ✅ | ✅ |
| **Table de hachage** | O(1) | O(1) | ❌ | N/A |
| **Tableau trié** | O(log n) | O(n) | ✅ | N/A |

*Peut dégénérer en O(n) si non équilibré

---

## 🔍 Problèmes Avancés

### Problème : Sérialisation/Désérialisation d'un BST

```javascript
// Convertir arbre en chaîne
function serialize(root) {
  if (!root) return 'null';

  const left = serialize(root.left);
  const right = serialize(root.right);

  return `${root.value},${left},${right}`;
}

// Reconstruire arbre depuis chaîne
function deserialize(data) {
  const values = data.split(',');

  function build() {
    const val = values.shift();
    if (val === 'null') return null;

    const node = new Node(parseInt(val));
    node.left = build();
    node.right = build();
    return node;
  }

  return build();
}

// Test
const bst = new BinarySearchTree();
[5, 3, 7, 2, 4, 6, 8].forEach(val => bst.insert(val));

const serialized = serialize(bst.root);
console.log("Sérialisé:", serialized);

const deserialized = deserialize(serialized);
console.log("Désérialisé:", inOrderTraversal(deserialized));
```

---

## 📝 Quiz de Révision

### Question 1
Quelle propriété définit un arbre binaire de recherche ?
- A) Racine à gauche
- B) Valeurs gauches ≤ racine < valeurs droites  ← **Réponse**
- C) Hauteur maximale 3
- D) Un seul enfant par nœud

### Question 2
Quel parcours donne les valeurs dans l'ordre trié ?
- A) Préfixe
- B) Infixe  ← **Réponse**
- C) Postfixe
- D) En largeur

### Question 3
Quelle est la complexité moyenne d'une recherche dans un BST équilibré ?
- A) O(1)
- B) O(log n)  ← **Réponse**
- C) O(n)
- D) O(n²)

### Question 4
Dans quel cas un BST peut-il dégénérer en liste chaînée ?
- A) Insertion dans l'ordre croissant  ← **Réponse**
- B) Insertion aléatoire
- C) Suppression équilibrée
- D) Parcours en largeur

---

## 🔑 Points Clés à Retenir

1. **BST** = arbre binaire avec propriété d'ordre
2. **Opérations** : insertion, recherche, suppression en O(log n) moyen
3. **Parcours** : in-order = trié, pre/post-order = structure
4. **Problème** : peut dégénérer si insertions ordonnées
5. **Solutions** : AVL, rouge-noir pour équilibrage automatique
6. **Applications** : bases de données, systèmes de fichiers, correction orthographique

---

*Chapitre suivant : [Arbres AVL](09-avl-trees.md)*
