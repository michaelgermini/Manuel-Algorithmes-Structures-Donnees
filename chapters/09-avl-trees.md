# Chapitre 9 : Arbres AVL (Équilibrage Automatique)

## ⚖️ Le Problème des BST Non Équilibrés

Les BST classiques peuvent dégénérer en liste chaînée avec des insertions ordonnées, passant de O(log n) à O(n).

```javascript
const bst = new BinarySearchTree();
[1, 2, 3, 4, 5].forEach(val => bst.insert(val));
// Résultat : liste chaînée verticale !
```

---

## 🌲 Qu'est-ce qu'un Arbre AVL ?

Un **arbre AVL** est un BST **auto-équilibré** où la différence de hauteur entre sous-arbres gauche et droit est au maximum 1.

**Inventeurs** : Georgy Adelson-Velsky et Evgenii Landis (1962)

### Propriété d'Équilibre

Pour chaque nœud : |hauteur(gauche) - hauteur(droite)| ≤ 1

### Facteur d'Équilibre

**Balance Factor** = hauteur(gauche) - hauteur(droite)

- **-1, 0, 1** : Équilibré ✅
- **-2, 2** : Déséquilibré ❌ (nécessite rotation)

---

## 🔄 Rotations pour l'Équilibrage

### Structure d'un Nœud AVL

```javascript
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;  // Hauteur du sous-arbre
  }
}
```

### Rotation Simple à Droite (Right Rotation)

**Cas** : Déséquilibre gauche-gauche

```
    Avant :         Après :
       (30)         (20)
      /              /  \
    (20)     →     (10) (30)
   /
 (10)
```

```javascript
rightRotate(y) {
  let x = y.left;
  let T2 = x.right;

  // Rotation
  x.right = y;
  y.left = T2;

  // Mise à jour des hauteurs
  y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
  x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

  return x; // Nouvelle racine
}
```

### Rotation Simple à Gauche (Left Rotation)

**Cas** : Déséquilibre droite-droite

```
    Avant :         Après :
     (10)           (20)
       \            /  \
       (20)   →   (10) (30)
         \
         (30)
```

```javascript
leftRotate(x) {
  let y = x.right;
  let T2 = y.left;

  // Rotation
  y.left = x;
  x.right = T2;

  // Mise à jour des hauteurs
  x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
  y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

  return y; // Nouvelle racine
}
```

### Rotations Doubles

#### Gauche-Droite (Left-Right Rotation)

**Cas** : Déséquilibre gauche-droite

```
    Avant :         Étape 1 :       Étape 2 :
       (30)           (30)           (20)
      /              /              /  \
    (10)     →     (20)     →     (10) (30)
      \            /
     (20)        (10)
```

```javascript
leftRightRotate(node) {
  node.left = this.leftRotate(node.left);
  return this.rightRotate(node);
}
```

#### Droite-Gauche (Right-Left Rotation)

**Cas** : Déséquilibre droite-gauche

```
    Avant :         Étape 1 :       Étape 2 :
     (10)            (10)            (20)
       \              \              /  \
       (30)    →      (20)    →    (10) (30)
       /                \
     (20)               (30)
```

```javascript
rightLeftRotate(node) {
  node.right = this.rightRotate(node.right);
  return this.leftRotate(node);
}
```

---

## 🌳 Implémentation Complète d'un Arbre AVL

```javascript
class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalanceFactor(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  updateHeight(node) {
    node.height = Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

  rightRotate(y) {
    let x = y.left;
    let T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  insert(node, value) {
    // Insertion normale BST
    if (!node) return new AVLNode(value);

    if (value < node.value) {
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      node.right = this.insert(node.right, value);
    } else {
      return node; // Pas de doublons
    }

    // Mise à jour hauteur
    this.updateHeight(node);

    // Calcul facteur d'équilibre
    const balance = this.getBalanceFactor(node);

    // Cas de déséquilibre

    // Gauche-Gauche
    if (balance > 1 && value < node.left.value) {
      return this.rightRotate(node);
    }

    // Droite-Droite
    if (balance < -1 && value > node.right.value) {
      return this.leftRotate(node);
    }

    // Gauche-Droite
    if (balance > 1 && value > node.left.value) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

    // Droite-Gauche
    if (balance < -1 && value < node.right.value) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }

  add(value) {
    this.root = this.insert(this.root, value);
  }

  // Recherche (identique au BST)
  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }

  // Suppression avec rééquilibrage
  remove(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.remove(node.left, value);
    } else if (value > node.value) {
      node.right = this.remove(node.right, value);
    } else {
      // Nœud trouvé
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Deux enfants : successeur
      const successor = this.findMin(node.right);
      node.value = successor.value;
      node.right = this.remove(node.right, successor.value);
    }

    if (!node) return null;

    this.updateHeight(node);
    const balance = this.getBalanceFactor(node);

    // Rééquilibrage après suppression
    if (balance > 1) {
      if (this.getBalanceFactor(node.left) >= 0) {
        return this.rightRotate(node);
      } else {
        node.left = this.leftRotate(node.left);
        return this.rightRotate(node);
      }
    }

    if (balance < -1) {
      if (this.getBalanceFactor(node.right) <= 0) {
        return this.leftRotate(node);
      } else {
        node.right = this.rightRotate(node.right);
        return this.leftRotate(node);
      }
    }

    return node;
  }

  delete(value) {
    this.root = this.remove(this.root, value);
  }

  findMin(node = this.root) {
    while (node && node.left) node = node.left;
    return node;
  }

  // Vérification d'équilibre
  isBalanced() {
    function checkBalance(node) {
      if (!node) return { height: 0, balanced: true };

      const left = checkBalance(node.left);
      const right = checkBalance(node.right);

      const height = Math.max(left.height, right.height) + 1;
      const balance = Math.abs(left.height - right.height) <= 1;
      const balanced = left.balanced && right.balanced && balance;

      return { height, balanced };
    }

    return checkBalance(this.root).balanced;
  }

  // Affichage par niveaux
  printLevels() {
    if (!this.root) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const levelSize = queue.length;
      const level = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        level.push(`${node.value}(h:${node.height})`);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }

      console.log(level.join(' '));
    }
  }
}

// Exemple d'utilisation
const avl = new AVLTree();
const values = [10, 20, 30, 40, 50, 25];

console.log("Insertion des valeurs :", values);
values.forEach(val => avl.add(val));

console.log("\nArbre AVL (valeur/hauteur) :");
avl.printLevels();

console.log("\nÉquilibré :", avl.isBalanced());

console.log("\nSuppression de 30 :");
avl.delete(30);
avl.printLevels();
```

---

## 📊 Analyse de Performance

### Complexité Garantie

| Opération | Complexité |
|-----------|------------|
| **Recherche** | O(log n) |
| **Insertion** | O(log n) |
| **Suppression** | O(log n) |
| **Équilibrage** | O(1) amorti |

### Comparaison AVL vs BST Classique

| Aspect | BST Classique | AVL |
|--------|---------------|-----|
| **Équilibre** | Non garanti | Toujours équilibré |
| **Recherche** | O(log n) moyen, O(n) pire | O(log n) garanti |
| **Insertion** | O(log n) moyen, O(n) pire | O(log n) garanti |
| **Mémoire** | O(n) | O(n) + hauteur |
| **Complexité** | Simple | Plus complexe |

---

## 💻 Exercices Pratiques

### Exercice 1 : Calcul du Facteur d'Équilibre

```javascript
function calculateBalanceFactors(root) {
  const factors = {};

  function traverse(node, path = '') {
    if (!node) return;

    const balance = getHeight(node.left) - getHeight(node.right);
    factors[node.value] = balance;

    traverse(node.left, path + 'L');
    traverse(node.right, path + 'R');
  }

  function getHeight(node) {
    if (!node) return 0;
    return Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  }

  traverse(root);
  return factors;
}

// Test
const avl = new AVLTree();
[10, 5, 15, 3, 7].forEach(val => avl.add(val));
console.log(calculateBalanceFactors(avl.root));
// { 3: 0, 5: 0, 7: 0, 10: 1, 15: 0 }
```

### Exercice 2 : Vérification d'AVL

```javascript
function isValidAVL(root) {
  function checkAVL(node) {
    if (!node) return { height: 0, valid: true };

    const left = checkAVL(node.left);
    const right = checkAVL(node.right);

    if (!left.valid || !right.valid) return { height: 0, valid: false };

    const height = Math.max(left.height, right.height) + 1;
    const balance = Math.abs(left.height - right.height);
    const valid = balance <= 1;

    return { height, valid };
  }

  return checkAVL(root).valid;
}

// Test avec arbre équilibré et déséquilibré
console.log("AVL valide:", isValidAVL(avl.root)); // true
```

### Exercice 3 : Comptage des Rotations

```javascript
class AVLTreeWithCounter extends AVLTree {
  constructor() {
    super();
    this.rotationCount = 0;
  }

  rightRotate(y) {
    this.rotationCount++;
    return super.rightRotate(y);
  }

  leftRotate(x) {
    this.rotationCount++;
    return super.leftRotate(x);
  }

  getRotationCount() {
    return this.rotationCount;
  }

  resetCounter() {
    this.rotationCount = 0;
  }
}

// Test
const avlCounter = new AVLTreeWithCounter();
const testValues = [10, 5, 15, 3, 7, 12, 18, 1, 4, 6, 8];

console.log("Insertion avec comptage de rotations:");
testValues.forEach(val => {
  avlCounter.add(val);
  console.log(`Ajout ${val}: ${avlCounter.getRotationCount()} rotations`);
});
```

---

## 🔍 Visualisation des Rotations

### Exemple Détaillé : Insertion Causant un Déséquilibre

**Insertion séquentielle** : 10, 20, 30

```
Étape 1: Insertion de 10
    (10)  ✓ Équilibré

Étape 2: Insertion de 20
    (10)  Balance = -1 (déséquilibré!)
      \
      (20)

Étape 3: Rotation gauche
    (20)  ✓ Équilibré
   /
 (10)
```

### Exemple de Rotation Double

**Insertion** : 30, 10, 20

```
Étape 1: 30
    (30)

Étape 2: 10 (sous-arbre gauche)
    (30)  Balance = 1
   /
 (10)

Étape 3: 20 (déséquilibre gauche-droite)
    (30)  Balance de 30 = 2 (déséquilibré!)
   /
 (10)
   \
   (20)

Étape 4: Rotation gauche-droite
  1. Rotation gauche sur 10: (10) devient (20)
  2. Rotation droite sur 30: (30) devient (20)
Résultat:
    (20)  ✓ Équilibré
   /  \
 (10) (30)
```

---

## 🌟 Applications Réelles

### 1. Bases de Données et Index

```javascript
class DatabaseIndex {
  constructor() {
    this.index = new AVLTree();
  }

  insertRecord(key, record) {
    this.index.add(key);
    // Stocker record dans la vraie DB
  }

  findRecord(key) {
    return this.index.find(key) !== null;
  }

  // Recherche par plage garantie O(log n)
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

### 2. Systèmes de Fichiers

```javascript
class FileSystem {
  constructor() {
    this.files = new AVLTree(); // Index par nom
    this.metadata = new Map();  // Données détaillées
  }

  createFile(name, content) {
    this.files.add(name);
    this.metadata.set(name, {
      content,
      created: new Date(),
      size: content.length
    });
  }

  findFile(name) {
    return this.files.find(name);
  }

  listFilesInRange(start, end) {
    // Utilise la propriété ordonnée de l'AVL
    return this.files.findInRange(start, end);
  }
}
```

### 3. Tries et Dictionnaires

```javascript
class Dictionary {
  constructor() {
    this.words = new AVLTree();
  }

  addWord(word) {
    this.words.add(word.toLowerCase());
  }

  checkSpelling(word) {
    return this.words.find(word.toLowerCase()) !== null;
  }

  // Mots dans un intervalle alphabétique
  wordsInRange(start, end) {
    const results = [];
    function collectWords(node) {
      if (!node) return;

      if (node.value >= start) {
        collectWords(node.left);
      }

      if (node.value >= start && node.value <= end) {
        results.push(node.value);
      }

      if (node.value <= end) {
        collectWords(node.right);
      }
    }

    collectWords(this.words.root);
    return results;
  }
}
```

---

## ⚖️ AVL vs Autres Structures Équilibrées

| Structure | Avantages | Inconvénients |
|-----------|-----------|---------------|
| **AVL** | Équilibre strict, recherche rapide | Rotations coûteuses |
| **Rouge-Noir** | Moins de rotations, bonnes performances | Équilibre plus lâche |
| **B-Arbres** | Optimisé pour disque, nœuds pleins | Complexe, mémoire |

**Quand utiliser AVL** :
- Applications en mémoire principale
- Besoin de garanties strictes de performance
- Peu d'insertions/déletions fréquentes
- Recherche très fréquente

---

## 📝 Quiz de Révision

### Question 1
Quelle est la condition d'équilibre dans un arbre AVL ?
- A) Différence de hauteur ≤ 2
- B) Différence de hauteur ≤ 1  ← **Réponse**
- C) Tous les nœuds ont 2 enfants
- D) Hauteur maximale log₂n

### Question 2
Quel type de rotation corrige un déséquilibre gauche-gauche ?
- A) Rotation gauche
- B) Rotation droite  ← **Réponse**
- C) Rotation double gauche-droite
- D) Rotation double droite-gauche

### Question 3
Quelle est la complexité garantie d'une recherche dans un AVL ?
- A) O(1)
- B) O(log n)  ← **Réponse**
- C) O(n)
- D) O(n log n)

### Question 4
Quel est l'avantage principal d'un AVL par rapport à un BST classique ?
- A) Utilise moins de mémoire
- B) Performance garantie O(log n)  ← **Réponse**
- C) Plus simple à implémenter
- D) Supporte les doublons

---

## 🔑 Points Clés à Retenir

1. **AVL** = BST auto-équilibré avec |hauteur(gauche) - hauteur(droite)| ≤ 1
2. **Rotations** : simples (gauche/droite) et doubles (gauche-droite/droite-gauche)
3. **Complexité** : O(log n) garanti pour toutes les opérations
4. **Avantages** : performances prévisibles, recherches rapides
5. **Inconvénients** : rotations coûteuses lors d'insertions/suppressions
6. **Applications** : bases de données, systèmes de fichiers, dictionnaires

---

*Chapitre suivant : [Arbres Rouges-Noirs](10-red-black-trees.md)*
