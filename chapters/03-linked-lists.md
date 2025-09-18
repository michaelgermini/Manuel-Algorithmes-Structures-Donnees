# Chapitre 3 : Listes Chaînées

## 🔗 Qu'est-ce qu'une Liste Chaînée ?

Une **liste chaînée** est une structure de données dynamique où chaque élément (nœud) contient :
- **Données** : la valeur stockée
- **Référence** : pointeur vers l'élément suivant (ou précédent)

💡 **Analogie** : Comme des wagons de train connectés. Chaque wagon transporte des passagers et est accroché au suivant.

### Avantages vs Tableaux

| Aspect | Tableau | Liste Chaînée |
|--------|---------|---------------|
| **Accès** | O(1) par index | O(n) - parcours séquentiel |
| **Insertion/Déletion** | O(n) au milieu | O(1) si position connue |
| **Taille** | Fixe (statique) | Dynamique |
| **Mémoire** | Contiguë | Éparpillée |

---

## 📋 Liste Simplement Chaînée

### Structure d'un Nœud

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

### Implémentation Complète

```javascript
class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  // Ajouter au début
  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
  }

  // Ajouter à la fin
  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }

  // Insérer à une position donnée
  insertAt(value, index) {
    if (index < 0 || index > this.size) return false;

    const newNode = new Node(value);

    if (index === 0) {
      this.prepend(value);
      return true;
    }

    let current = this.head;
    let previous = null;
    let i = 0;

    while (i < index) {
      previous = current;
      current = current.next;
      i++;
    }

    previous.next = newNode;
    newNode.next = current;
    this.size++;
    return true;
  }

  // Supprimer du début
  removeFirst() {
    if (!this.head) return null;

    const removedValue = this.head.value;
    this.head = this.head.next;
    this.size--;
    return removedValue;
  }

  // Supprimer de la fin
  removeLast() {
    if (!this.head) return null;

    if (!this.head.next) {
      const removedValue = this.head.value;
      this.head = null;
      this.size--;
      return removedValue;
    }

    let current = this.head;
    let previous = null;

    while (current.next) {
      previous = current;
      current = current.next;
    }

    previous.next = null;
    this.size--;
    return current.value;
  }

  // Supprimer à une position
  removeAt(index) {
    if (index < 0 || index >= this.size) return null;

    if (index === 0) return this.removeFirst();

    let current = this.head;
    let previous = null;
    let i = 0;

    while (i < index) {
      previous = current;
      current = current.next;
      i++;
    }

    previous.next = current.next;
    this.size--;
    return current.value;
  }

  // Obtenir la valeur à un index
  get(index) {
    if (index < 0 || index >= this.size) return null;

    let current = this.head;
    let i = 0;

    while (i < index) {
      current = current.next;
      i++;
    }

    return current.value;
  }

  // Modifier la valeur à un index
  set(value, index) {
    if (index < 0 || index >= this.size) return false;

    let current = this.head;
    let i = 0;

    while (i < index) {
      current = current.next;
      i++;
    }

    current.value = value;
    return true;
  }

  // Vérifier si vide
  isEmpty() {
    return this.size === 0;
  }

  // Obtenir la taille
  getSize() {
    return this.size;
  }

  // Afficher la liste
  print() {
    let current = this.head;
    const values = [];

    while (current) {
      values.push(current.value);
      current = current.next;
    }

    console.log(values.join(' -> '));
  }

  // Inverser la liste
  reverse() {
    let previous = null;
    let current = this.head;
    let next = null;

    while (current) {
      next = current.next;      // Sauvegarder le suivant
      current.next = previous;  // Inverser le pointeur
      previous = current;       // Avancer previous
      current = next;           // Avancer current
    }

    this.head = previous;
  }

  // Trouver la valeur médiane
  findMiddle() {
    if (!this.head) return null;

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow.value;
  }

  // Détecter un cycle (algorithme de Floyd)
  hasCycle() {
    if (!this.head) return false;

    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;

      if (slow === fast) {
        return true;
      }
    }

    return false;
  }
}

// Exemple d'utilisation
const list = new LinkedList();

list.append(10);
list.append(20);
list.append(30);
list.print(); // 10 -> 20 -> 30

list.prepend(5);
list.print(); // 5 -> 10 -> 20 -> 30

list.insertAt(15, 2);
list.print(); // 5 -> 10 -> 15 -> 20 -> 30

console.log(list.get(2)); // 15
console.log(list.findMiddle()); // 15 (milieu de 5 éléments)

list.reverse();
list.print(); // 30 -> 20 -> 15 -> 10 -> 5
```

---

## 🔄 Liste Doublement Chaînée

### Structure d'un Nœud

```javascript
class DoublyNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}
```

### Implémentation Complète

```javascript
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  // Ajouter au début
  prepend(value) {
    const newNode = new DoublyNode(value);

    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.size++;
  }

  // Ajouter à la fin
  append(value) {
    const newNode = new DoublyNode(value);

    if (!this.tail) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
  }

  // Supprimer du début
  removeFirst() {
    if (!this.head) return null;

    const removedValue = this.head.value;

    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = null;
    }

    this.size--;
    return removedValue;
  }

  // Supprimer de la fin
  removeLast() {
    if (!this.tail) return null;

    const removedValue = this.tail.value;

    if (this.head === this.tail) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }

    this.size--;
    return removedValue;
  }

  // Parcours inverse
  printReverse() {
    let current = this.tail;
    const values = [];

    while (current) {
      values.push(current.value);
      current = current.prev;
    }

    console.log(values.join(' <- '));
  }

  // Autres méthodes similaires à la liste simplement chaînée...
}
```

---

## 💻 Exercices Pratiques

### Exercice 1 : Fusion de Deux Listes Triées

**Objectif** : Fusionner deux listes chaînées triées en une seule liste triée.

```javascript
function mergeSortedLists(list1, list2) {
  const merged = new LinkedList();
  let current1 = list1.head;
  let current2 = list2.head;

  while (current1 && current2) {
    if (current1.value <= current2.value) {
      merged.append(current1.value);
      current1 = current1.next;
    } else {
      merged.append(current2.value);
      current2 = current2.next;
    }
  }

  // Ajouter les éléments restants
  while (current1) {
    merged.append(current1.value);
    current1 = current1.next;
  }

  while (current2) {
    merged.append(current2.value);
    current2 = current2.next;
  }

  return merged;
}

// Test
const list1 = new LinkedList();
list1.append(1);
list1.append(3);
list1.append(5);

const list2 = new LinkedList();
list2.append(2);
list2.append(4);
list2.append(6);

const merged = mergeSortedLists(list1, list2);
merged.print(); // 1 -> 2 -> 3 -> 4 -> 5 -> 6
```

### Exercice 2 : Suppression des Doublons

**Objectif** : Supprimer les éléments dupliqués d'une liste chaînée non triée.

```javascript
function removeDuplicates(list) {
  if (!list.head) return;

  const seen = new Set();
  let current = list.head;
  let previous = null;

  while (current) {
    if (seen.has(current.value)) {
      // Supprimer le nœud
      previous.next = current.next;
      list.size--;
    } else {
      seen.add(current.value);
      previous = current;
    }
    current = current.next;
  }
}

// Test
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(2);
list.append(3);
list.append(1);

removeDuplicates(list);
list.print(); // 1 -> 2 -> 3
```

### Exercice 3 : Point d'Intersection de Deux Listes

**Objectif** : Trouver le nœud d'intersection de deux listes chaînées (si elles se croisent).

```javascript
function getIntersectionNode(list1, list2) {
  if (!list1.head || !list2.head) return null;

  // Calculer les longueurs
  let len1 = 0, len2 = 0;
  let current1 = list1.head, current2 = list2.head;

  while (current1) { len1++; current1 = current1.next; }
  while (current2) { len2++; current2 = current2.next; }

  // Aligner les têtes
  current1 = list1.head;
  current2 = list2.head;

  if (len1 > len2) {
    for (let i = 0; i < len1 - len2; i++) {
      current1 = current1.next;
    }
  } else {
    for (let i = 0; i < len2 - len1; i++) {
      current2 = current2.next;
    }
  }

  // Chercher l'intersection
  while (current1 && current2) {
    if (current1 === current2) {
      return current1;
    }
    current1 = current1.next;
    current2 = current2.next;
  }

  return null;
}
```

---

## 📊 Analyse de Complexité

| Opération | Liste Simplement Chaînée | Liste Doublement Chaînée |
|-----------|--------------------------|--------------------------|
| **Accès par index** | O(n) | O(n) |
| **Insertion début** | O(1) | O(1) |
| **Insertion fin** | O(n) | O(1) |
| **Insertion milieu** | O(n) | O(n) |
| **Suppression début** | O(1) | O(1) |
| **Suppression fin** | O(n) | O(1) |
| **Recherche** | O(n) | O(n) |
| **Mémoire** | O(n) | O(n) |

---

## 🌟 Cas d'Usage Réels

### 1. Gestion de la Mémoire (Allocation Dynamique)

```javascript
class MemoryManager {
  constructor() {
    this.freeBlocks = new LinkedList(); // Blocs libres
    this.allocatedBlocks = new LinkedList(); // Blocs alloués
  }

  allocate(size) {
    // Chercher un bloc libre assez grand
    let current = this.freeBlocks.head;
    while (current) {
      if (current.value.size >= size) {
        // Allouer ce bloc
        this.freeBlocks.removeAt(/* index du bloc */);
        this.allocatedBlocks.append(current.value);
        return current.value;
      }
      current = current.next;
    }
    return null; // Pas de bloc disponible
  }

  deallocate(block) {
    // Libérer le bloc
    this.allocatedBlocks.removeAt(/* index */);
    this.freeBlocks.append(block);
  }
}
```

### 2. Cache LRU (Least Recently Used)

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Pour accès O(1)
    this.order = new DoublyLinkedList(); // Pour ordre d'utilisation
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Déplacer vers le début (récemment utilisé)
    const node = this.cache.get(key);
    this.order.removeNode(node);
    this.order.prepend(node);

    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // Mettre à jour et déplacer
      const node = this.cache.get(key);
      node.value = value;
      this.order.removeNode(node);
      this.order.prepend(node);
    } else {
      // Ajouter nouveau
      if (this.order.size >= this.capacity) {
        // Supprimer le moins récemment utilisé
        const lru = this.order.tail;
        this.cache.delete(lru.key);
        this.order.removeLast();
      }

      const newNode = { key, value };
      this.order.prepend(newNode);
      this.cache.set(key, newNode);
    }
  }
}
```

### 3. Annuler/Rétablir (Undo/Redo)

```javascript
class TextEditor {
  constructor() {
    this.text = "";
    this.undoStack = new LinkedList(); // Actions à annuler
    this.redoStack = new LinkedList(); // Actions à rétablir
  }

  type(text) {
    this.undoStack.append({ action: 'type', text: this.text });
    this.text += text;
    this.redoStack = new LinkedList(); // Vider redo
  }

  undo() {
    if (this.undoStack.isEmpty()) return;

    const lastAction = this.undoStack.removeLast();
    this.redoStack.append({ action: 'undo', text: this.text });
    this.text = lastAction.text;
  }

  redo() {
    if (this.redoStack.isEmpty()) return;

    const lastRedo = this.redoStack.removeLast();
    this.undoStack.append({ action: 'redo', text: this.text });
    this.text = lastRedo.text;
  }
}
```

---

## 🔄 Comparaison avec Autres Structures

### Liste Chaînée vs Tableau Dynamique

| Aspect | Liste Chaînée | ArrayList/Vector |
|--------|---------------|------------------|
| **Accès aléatoire** | ❌ O(n) | ✅ O(1) |
| **Insertion/Déletion** | ✅ O(1) si position connue | ❌ O(n) |
| **Mémoire** | ❌ Overhead (pointeurs) | ✅ Compact |
| **Cache CPU** | ❌ Pas contigu | ✅ Bon |
| **Taille dynamique** | ✅ Facile | ✅ (avec redimensionnement) |

### Quand Utiliser une Liste Chaînée ?

- **Insertions/Déletions fréquentes** au milieu
- **Taille inconnue** au départ
- **Pas besoin d'accès aléatoire**
- **Implémentation de piles/files** (sans redimensionnement)

---

## 📝 Quiz de Révision

### Question 1
Quelle est la complexité temporelle pour accéder au n-ième élément d'une liste chaînée ?
- A) O(1)
- B) O(log n)
- C) O(n)  ← **Réponse**
- D) O(n²)

### Question 2
Quel est l'avantage principal d'une liste doublement chaînée par rapport à une liste simplement chaînée ?
- A) Moins de mémoire utilisée
- B) Parcours dans les deux sens en O(1)  ← **Réponse**
- C) Recherche plus rapide
- D) Insertion plus rapide

### Question 3
Quelle opération est plus efficace sur une liste chaînée que sur un tableau ?
- A) Accès par index
- B) Insertion au début  ← **Réponse**
- C) Recherche d'un élément
- D) Tri

### Question 4
Quel algorithme permet de détecter un cycle dans une liste chaînée ?
- A) Tri rapide
- B) Recherche binaire
- C) Algorithme des deux pointeurs (tortue/lièvre)  ← **Réponse**
- D) Tri fusion

---

## 🔑 Points Clés à Retenir

1. **Liste chaînée** = structure dynamique avec nœuds connectés
2. **Simplement chaînée** = next seulement, **doublement** = next + prev
3. **Complexité** : O(1) insertion/déletion connue, O(n) accès aléatoire
4. **Avantages** : taille dynamique, insertions efficaces
5. **Inconvénients** : pas d'accès direct, overhead mémoire
6. **Applications** : piles, files, caches, gestion mémoire

---

*Chapitre suivant : [Récursion & Diviser pour Régner](04-recursion-divide-conquer.md)*
