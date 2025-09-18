# Chapitre 10 : Arbres Rouges-Noirs (Red-Black Trees)

## 🔴⚫ Théorie des Arbres Rouges-Noirs

Les **arbres rouges-noirs** (Red-Black Trees) sont des BST équilibrés utilisant des couleurs pour maintenir l'équilibre.

**Propriété** : Équilibre plus flexible que les AVL mais toujours O(log n).

---

## 📋 Propriétés des Arbres Rouges-Noirs

### Règles Fondamentales

1. **Chaque nœud est rouge OU noir**
2. **La racine est toujours noire**
3. **Les feuilles (NIL) sont noires**
4. **Un nœud rouge ne peut pas avoir de parent rouge** (pas de rouge-rouge)
5. **Chemin racine-feuille : même nombre de nœuds noirs** (hauteur noire)

### Structure d'un Nœud

```javascript
class RBNode {
  constructor(value, color = "RED") {
    this.value = value;
    this.color = color; // "RED" ou "BLACK"
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}
```

---

## 🔄 Rotations et Rééquilibrage

### Rotations de Base

```javascript
class RedBlackTree {
  constructor() {
    this.root = null;
    this.NIL = new RBNode(null, "BLACK"); // Feuille sentinelle
  }

  leftRotate(x) {
    let y = x.right;
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  rightRotate(y) {
    let x = y.left;
    y.left = x.right;

    if (x.right !== this.NIL) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }

    x.right = y;
    y.parent = x;
  }
}
```

### Cas d'Insertion et Corrections

#### Cas 1 : Le parent est noir
**Solution** : Rien à faire, l'arbre reste valide.

#### Cas 2 : L'oncle est rouge (Recoloration)
```
Avant :
    (P)⚫
   /     \
 (U)🔴  (N)🔴

Après :
    (P)🔴
   /     \
 (U)⚫  (N)⚫
```

#### Cas 3 : Triangle (Rotation + Recoloration)
```
Avant :
   (G)⚫
  /
(P)🔴
  \
  (N)🔴

Après :
   (P)⚫
  /     \
(G)🔴  (N)🔴
```

---

## 💻 Implémentation Complète

```javascript
class RedBlackTree {
  constructor() {
    this.NIL = new RBNode(null, "BLACK");
    this.root = this.NIL;
  }

  // Rotations
  leftRotate(x) {
    let y = x.right;
    x.right = y.left;

    if (y.left !== this.NIL) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  rightRotate(y) {
    let x = y.left;
    y.left = x.right;

    if (x.right !== this.NIL) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === null) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }

    x.right = y;
    y.parent = x;
  }

  // Insertion
  insert(value) {
    let newNode = new RBNode(value, "RED");
    newNode.left = this.NIL;
    newNode.right = this.NIL;

    let parent = null;
    let current = this.root;

    // Trouver la position
    while (current !== this.NIL) {
      parent = current;
      if (newNode.value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;

    if (parent === null) {
      this.root = newNode;
    } else if (newNode.value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    if (newNode.parent === null) {
      newNode.color = "BLACK";
      return;
    }

    if (newNode.parent.parent === null) {
      return;
    }

    this.fixInsert(newNode);
  }

  fixInsert(node) {
    while (node.parent.color === "RED") {
      if (node.parent === node.parent.parent.right) {
        let uncle = node.parent.parent.left;

        if (uncle.color === "RED") {
          // Cas 1: Oncle rouge - recoloration
          uncle.color = "BLACK";
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            // Cas 2: Triangle droit - rotation droite puis gauche
            node = node.parent;
            this.rightRotate(node);
          }
          // Cas 3: Ligne droite - rotation gauche
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.leftRotate(node.parent.parent);
        }
      } else {
        let uncle = node.parent.parent.right;

        if (uncle.color === "RED") {
          // Cas 1: Oncle rouge - recoloration
          uncle.color = "BLACK";
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            // Cas 2: Triangle gauche - rotation gauche puis droite
            node = node.parent;
            this.leftRotate(node);
          }
          // Cas 3: Ligne droite - rotation droite
          node.parent.color = "BLACK";
          node.parent.parent.color = "RED";
          this.rightRotate(node.parent.parent);
        }
      }

      if (node === this.root) {
        break;
      }
    }

    this.root.color = "BLACK";
  }

  // Recherche (comme BST)
  find(value) {
    let current = this.root;
    while (current !== this.NIL) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }

  // Suppression (complexe - simplification pour l'exemple)
  delete(value) {
    // Version simplifiée - en pratique très complexe
    let node = this.find(value);
    if (!node) return;

    // Suppression comme dans BST
    // Puis rééquilibrage (très complexe)
    console.log("Suppression non implémentée complètement");
  }

  // Vérification des propriétés
  isValidRedBlack() {
    if (!this.root || this.root.color !== "BLACK") return false;

    function checkProperties(node, blackCount, pathBlackCount) {
      if (node === this.NIL) return pathBlackCount === blackCount;

      if (node.color === "RED") {
        // Vérifier pas de rouge-rouge
        if ((node.left && node.left.color === "RED") ||
            (node.right && node.right.color === "RED")) {
          return false;
        }
      } else {
        pathBlackCount++;
      }

      // Vérifier BST property (simplifié)
      if (node.left !== this.NIL && node.left.value >= node.value) return false;
      if (node.right !== this.NIL && node.right.value <= node.value) return false;

      const leftCount = checkProperties.call(this, node.left, blackCount, pathBlackCount);
      const rightCount = checkProperties.call(this, node.right, blackCount, pathBlackCount);

      return leftCount && rightCount;
    }

    // Compter les noirs sur un chemin
    let blackCount = 0;
    let temp = this.root;
    while (temp !== this.NIL) {
      if (temp.color === "BLACK") blackCount++;
      temp = temp.left;
    }

    return checkProperties.call(this, this.root, blackCount, 0);
  }

  // Affichage par niveaux
  printLevels() {
    if (this.root === this.NIL) return;

    const queue = [this.root];
    while (queue.length > 0) {
      const levelSize = queue.length;
      const level = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        if (node !== this.NIL) {
          const colorSymbol = node.color === "RED" ? "🔴" : "⚫";
          level.push(`${colorSymbol}${node.value}`);

          if (node.left) queue.push(node.left);
          if (node.right) queue.push(node.right);
        }
      }

      if (level.length > 0) {
        console.log(level.join(' '));
      }
    }
  }
}

// Exemple d'utilisation
const rbt = new RedBlackTree();
const values = [10, 20, 30, 15, 25, 5];

console.log("Insertion dans l'arbre rouge-noir:");
values.forEach(val => {
  rbt.insert(val);
  console.log(`Après insertion de ${val}:`);
  rbt.printLevels();
  console.log("Valide:", rbt.isValidRedBlack());
  console.log("---");
});
```

---

## ⚖️ Comparaison AVL vs Red-Black

| Aspect | AVL | Red-Black |
|--------|-----|-----------|
| **Équilibre** | Strict (≤1) | Flexible (≤2×log n) |
| **Rotations** | Fréquentes | Moins fréquentes |
| **Recherche** | Plus rapide | Légèrement plus lente |
| **Insertion/Suppression** | Plus coûteuses | Plus efficaces |
| **Mémoire** | Hauteur stockée | Couleur stockée |
| **Utilisation** | Mémoire, recherches | Systèmes, bases de données |

### Quand Utiliser Red-Black ?

- **Systèmes d'exploitation** (Linux kernel)
- **Bibliothèques standard** (Java TreeMap, C++ map/set)
- **Bases de données** (index équilibrés)
- **Applications** avec beaucoup d'insertions/suppressions

---

## 💻 Exercices Pratiques

### Exercice 1 : Comptage des Couleurs

```javascript
function countColors(root) {
  let red = 0, black = 0;

  function traverse(node) {
    if (!node || node.value === null) return;

    if (node.color === "RED") red++;
    else black++;

    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);
  return { red, black };
}

// Test
const rbt = new RedBlackTree();
[10, 5, 15, 3, 7, 12, 18].forEach(val => rbt.insert(val));
console.log(countColors(rbt.root)); // { red: 4, black: 4 }
```

### Exercice 2 : Hauteur Noire

```javascript
function blackHeight(root) {
  if (!root || root.value === null) return 1;

  let height = root.color === "BLACK" ? 1 : 0;
  return height + blackHeight(root.left);
}

// Test
console.log("Hauteur noire:", blackHeight(rbt.root));
```

### Exercice 3 : Vérification Complète

```javascript
function isValidRedBlackTree(root) {
  // 1. Racine noire
  if (!root || root.color !== "BLACK") return false;

  // 2. Pas de rouge-rouge
  function noRedRed(node) {
    if (!node || node.value === null) return true;

    if (node.color === "RED") {
      if ((node.left && node.left.color === "RED") ||
          (node.right && node.right.color === "RED")) {
        return false;
      }
    }

    return noRedRed(node.left) && noRedRed(node.right);
  }

  // 3. Même hauteur noire
  function sameBlackHeight(node, height = 0, result = { valid: true, height: 0 }) {
    if (!node || node.value === null) {
      if (result.height === 0) result.height = height;
      else if (result.height !== height) result.valid = false;
      return;
    }

    const newHeight = height + (node.color === "BLACK" ? 1 : 0);
    sameBlackHeight(node.left, newHeight, result);
    sameBlackHeight(node.right, newHeight, result);
  }

  const blackHeightCheck = { valid: true, height: 0 };
  sameBlackHeight(root, 0, blackHeightCheck);

  return noRedRed(root) && blackHeightCheck.valid;
}
```

---

## 🌟 Applications Réelles

### 1. Linux Kernel (Gestion Mémoire)

```javascript
// Exemple conceptuel
class KernelMemoryManager {
  constructor() {
    this.allocatedBlocks = new RedBlackTree();
  }

  allocate(size) {
    // Trouver bloc libre de taille appropriée
    // Utilise l'ordre de l'arbre pour recherche efficace
  }

  free(address) {
    // Libérer et fusionner blocs adjacents
    // L'arbre maintient l'ordre des adresses
  }
}
```

### 2. Java TreeMap / TreeSet

```javascript
// Simulation d'une TreeMap simple
class TreeMap {
  constructor() {
    this.tree = new RedBlackTree();
    this.map = new Map(); // Valeurs associées
  }

  put(key, value) {
    this.tree.insert(key);
    this.map.set(key, value);
  }

  get(key) {
    return this.tree.find(key) ? this.map.get(key) : null;
  }

  // Recherche par plage
  subMap(fromKey, toKey) {
    const results = new Map();

    function collectInRange(node) {
      if (!node || node.value === null) return;

      if (node.value >= fromKey) {
        collectInRange(node.left);
      }

      if (node.value >= fromKey && node.value <= toKey) {
        results.set(node.value, this.map.get(node.value));
      }

      if (node.value <= toKey) {
        collectInRange(node.right);
      }
    }

    collectInRange.call(this, this.tree.root);
    return results;
  }
}
```

### 3. Ordonnanceur de Processus

```javascript
class ProcessScheduler {
  constructor() {
    this.processes = new RedBlackTree(); // Index par priorité
    this.processData = new Map();
  }

  addProcess(pid, priority, data) {
    this.processes.insert(priority * 1000 + pid); // Éviter collisions
    this.processData.set(pid, { priority, data });
  }

  getNextProcess() {
    // Trouver processus de plus haute priorité
    let maxNode = this.findMax(this.processes.root);

    if (maxNode) {
      let pid = maxNode.value % 1000;
      this.processes.delete(maxNode.value);
      return this.processData.get(pid);
    }

    return null;
  }

  findMax(node) {
    while (node && node.right && node.right.value !== null) {
      node = node.right;
    }
    return node;
  }
}
```

---

## 📊 Analyse de Performance

### Complexité Asymptotique

| Opération | Complexité |
|-----------|------------|
| **Recherche** | O(log n) |
| **Insertion** | O(log n) |
| **Suppression** | O(log n) |
| **Parcours** | O(n) |

### Avantages sur AVL

- **Moins de rotations** lors d'insertions/suppressions fréquentes
- **Équilibre plus flexible** = meilleures performances en pratique
- **Utilisé dans** les bibliothèques standard de nombreux langages

---

## 📝 Quiz de Révision

### Question 1
Quelle propriété interdit deux nœuds rouges consécutifs ?
- A) Racine noire
- B) Même hauteur noire
- C) Pas de rouge-rouge  ← **Réponse**
- D) Feuilles noires

### Question 2
Quelle est la principale différence entre AVL et Red-Black ?
- A) AVL utilise des couleurs
- B) Red-Black a un équilibre plus strict
- C) AVL fait plus de rotations  ← **Réponse**
- D) Red-Black est plus rapide

### Question 3
Quel langage utilise des Red-Black Trees dans sa bibliothèque standard ?
- A) Python (dict)
- B) Java (TreeMap)  ← **Réponse**
- C) JavaScript (Map)
- D) PHP (array)

### Question 4
Quelle propriété garantit que les chemins ont la même longueur ?
- A) Racine noire
- B) Même hauteur noire  ← **Réponse**
- C) Pas de rouge-rouge
- D) Équilibre AVL

---

## 🔑 Points Clés à Retenir

1. **Rouge-Noir** = BST équilibré avec couleurs (rouge/noir)
2. **Propriétés** : racine noire, pas de rouge-rouge, hauteur noire égale
3. **Rotations** : moins fréquentes qu'AVL, meilleures performances pratiques
4. **Complexité** : O(log n) garanti pour toutes les opérations
5. **Applications** : systèmes d'exploitation, bibliothèques standard
6. **Avantage** : équilibre flexible, efficace pour mises à jour fréquentes

---

*Chapitre suivant : [Tas Binaires](11-binary-heaps.md)*
