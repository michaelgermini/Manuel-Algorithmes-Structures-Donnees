# Chapitre 11 : Tas Binaires (Binary Heaps)

## 🏗️ Qu'est-ce qu'un Tas Binaire ?

Un **tas binaire** (binary heap) est une structure de données basée sur un arbre binaire complet où chaque nœud respecte une propriété d'ordre.

### Types de Tas

- **Max-Heap** : Parent ≥ Enfants (racine = maximum)
- **Min-Heap** : Parent ≤ Enfants (racine = minimum)

### Propriétés

1. **Arbre complet** : Tous les niveaux remplis sauf dernier (à gauche)
2. **Propriété de tas** : Ordre entre parent et enfants
3. **Représentation** : Tableau (pas de pointeurs)

### Représentation en Tableau

```
Indices :  0  1  2  3  4  5  6  7  8  9
Valeurs: [50,30,40,10,20,35,45,5,15,25]

Relations :
Parent(i) = floor((i-1)/2)
Gauche(i) = 2*i + 1
Droite(i) = 2*i + 2
```

---

## 📊 Implémentation d'un Max-Heap

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  // Obtenir l'index du parent
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // Obtenir l'index du fils gauche
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  // Obtenir l'index du fils droit
  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // Échanger deux éléments
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  // Remonter un élément (heapify up)
  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0 && this.heap[currentIndex] > this.heap[parentIndex]) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  // Descendre un élément (heapify down)
  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let largestIndex = currentIndex;

    // Trouver le plus grand entre parent, gauche, droite
    if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] > this.heap[largestIndex]) {
      largestIndex = leftChildIndex;
    }

    if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] > this.heap[largestIndex]) {
      largestIndex = rightChildIndex;
    }

    // Si le plus grand n'est pas le parent, échanger et continuer
    if (largestIndex !== currentIndex) {
      this.swap(currentIndex, largestIndex);
      this.heapifyDown(largestIndex);
    }
  }

  // Insérer un élément
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  // Extraire le maximum
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return max;
  }

  // Obtenir le maximum sans l'extraire
  getMax() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // Taille du tas
  size() {
    return this.heap.length;
  }

  // Vérifier si vide
  isEmpty() {
    return this.heap.length === 0;
  }

  // Afficher le tas
  print() {
    console.log(this.heap);
  }

  // Construire un tas à partir d'un tableau
  buildHeap(array) {
    this.heap = [...array];

    // Commencer par les nœuds internes (de bas en haut)
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }
}

// Exemple d'utilisation
const heap = new MaxHeap();
heap.insert(10);
heap.insert(5);
heap.insert(20);
heap.insert(15);
heap.insert(30);

console.log("Tas:", heap.heap); // [30, 20, 10, 5, 15]
console.log("Maximum:", heap.getMax()); // 30
console.log("Extraction:", heap.extractMax()); // 30
console.log("Nouveau maximum:", heap.getMax()); // 20
```

---

## 📈 Implémentation d'un Min-Heap

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
  }

  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0 && this.heap[currentIndex] < this.heap[parentIndex]) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let smallestIndex = currentIndex;

    // Trouver le plus petit entre parent, gauche, droite
    if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = leftChildIndex;
    }

    if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = rightChildIndex;
    }

    if (smallestIndex !== currentIndex) {
      this.swap(currentIndex, smallestIndex);
      this.heapifyDown(smallestIndex);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown(0);

    return min;
  }

  getMin() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  buildHeap(array) {
    this.heap = [...array];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapifyDown(i);
    }
  }
}
```

---

## 🔄 Tri par Tas (Heap Sort)

**Principe** : Transformer le tableau en tas, puis extraire les éléments un par un.

```javascript
function heapSort(array) {
  const heap = new MaxHeap();
  heap.buildHeap(array);

  const sorted = [];
  while (!heap.isEmpty()) {
    sorted.push(heap.extractMax());
  }

  return sorted;
}

// Version in-place (plus efficace)
function heapSortInPlace(arr) {
  const n = arr.length;

  // Construire le tas (heapify)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extraire les éléments un par un
  for (let i = n - 1; i > 0; i--) {
    // Échanger racine avec dernier élément
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Réorganiser le tas réduit
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // Trouver le plus grand
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // Si le plus grand n'est pas la racine
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// Test
const arr = [12, 11, 13, 5, 6, 7];
console.log("Original:", arr);
console.log("Trié:", heapSortInPlace([...arr]));
```

**Complexité** : O(n log n) dans tous les cas

---

## 📊 Analyse de Complexité

| Opération | Complexité |
|-----------|------------|
| **Construction** | O(n) |
| **Insertion** | O(log n) |
| **Extraction** | O(log n) |
| **getMax/getMin** | O(1) |
| **Heap Sort** | O(n log n) |

### Comparaison avec Autres Tris

| Algorithme | Meilleur | Moyen | Pire | Stable | Espace |
|------------|----------|-------|------|--------|--------|
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | ❌ | O(1) |
| **Quick Sort** | O(n log n) | O(n log n) | O(n²) | ❌ | O(log n) |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | ✅ | O(n) |
| **Insertion** | O(n) | O(n²) | O(n²) | ✅ | O(1) |

---

## 💻 Exercices Pratiques

### Exercice 1 : File de Priorité

```javascript
class PriorityQueue {
  constructor() {
    this.heap = new MaxHeap();
  }

  enqueue(element, priority) {
    const item = { element, priority };
    this.heap.insert(item);
  }

  dequeue() {
    return this.heap.extractMax().element;
  }

  isEmpty() {
    return this.heap.isEmpty();
  }

  peek() {
    return this.heap.getMax()?.element;
  }
}

// Redéfinir MaxHeap pour comparer les priorités
class PriorityHeap extends MaxHeap {
  heapifyUp(index) {
    let currentIndex = index;
    let parentIndex = this.getParentIndex(currentIndex);

    while (currentIndex > 0 &&
           this.heap[currentIndex].priority > this.heap[parentIndex].priority) {
      this.swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = this.getParentIndex(currentIndex);
    }
  }

  heapifyDown(index) {
    let currentIndex = index;
    let leftChildIndex = this.getLeftChildIndex(currentIndex);
    let rightChildIndex = this.getRightChildIndex(currentIndex);
    let largestIndex = currentIndex;

    if (leftChildIndex < this.heap.length &&
        this.heap[leftChildIndex].priority > this.heap[largestIndex].priority) {
      largestIndex = leftChildIndex;
    }

    if (rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].priority > this.heap[largestIndex].priority) {
      largestIndex = rightChildIndex;
    }

    if (largestIndex !== currentIndex) {
      this.swap(currentIndex, largestIndex);
      this.heapifyDown(largestIndex);
    }
  }
}
```

### Exercice 2 : K Plus Grands Éléments

```javascript
function findKLargest(array, k) {
  const minHeap = new MinHeap();

  for (let num of array) {
    minHeap.insert(num);

    // Garder seulement les k plus grands
    if (minHeap.size() > k) {
      minHeap.extractMin();
    }
  }

  // Les k éléments restants sont les plus grands
  const result = [];
  while (!minHeap.isEmpty()) {
    result.push(minHeap.extractMin());
  }

  return result.reverse(); // Du plus petit au plus grand
}

// Test
const array = [3, 2, 1, 5, 6, 4];
console.log(findKLargest(array, 3)); // [4, 5, 6]
```

### Exercice 3 : Fusion de K Listes Triées

```javascript
function mergeKSortedLists(lists) {
  const minHeap = new MinHeap();
  const result = [];

  // Insérer le premier élément de chaque liste
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].length > 0) {
      minHeap.insert({
        value: lists[i][0],
        listIndex: i,
        elementIndex: 0
      });
    }
  }

  while (!minHeap.isEmpty()) {
    const smallest = minHeap.extractMin();
    result.push(smallest.value);

    // Insérer l'élément suivant de la même liste
    const nextIndex = smallest.elementIndex + 1;
    if (nextIndex < lists[smallest.listIndex].length) {
      minHeap.insert({
        value: lists[smallest.listIndex][nextIndex],
        listIndex: smallest.listIndex,
        elementIndex: nextIndex
      });
    }
  }

  return result;
}

// Test
const lists = [
  [1, 4, 5],
  [1, 3, 4],
  [2, 6]
];

console.log(mergeKSortedLists(lists)); // [1, 1, 2, 3, 4, 4, 5, 6]
```

---

## 🌟 Applications Réelles

### 1. Ordonnanceur de Processus (OS)

```javascript
class ProcessScheduler {
  constructor() {
    this.processQueue = new PriorityQueue();
  }

  addProcess(process, priority) {
    this.processQueue.enqueue(process, priority);
  }

  runNextProcess() {
    const process = this.processQueue.dequeue();
    if (process) {
      console.log(`Exécution de ${process.name} (priorité: ${process.priority})`);
      // Simuler l'exécution
    }
  }
}
```

### 2. Algorithme de Huffman (Compression)

```javascript
class HuffmanNode {
  constructor(char, freq) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

function buildHuffmanTree(text) {
  // Compter les fréquences
  const freq = {};
  for (let char of text) {
    freq[char] = (freq[char] || 0) + 1;
  }

  // Créer un min-heap avec les nœuds
  const minHeap = new MinHeap();
  for (let char in freq) {
    minHeap.insert(new HuffmanNode(char, freq[char]));
  }

  // Redéfinir les comparaisons pour MinHeap
  minHeap.heapifyDown = function(index) {
    // Version modifiée pour comparer les fréquences
    // (implémentation détaillée dans le code complet)
  };

  // Construire l'arbre
  while (minHeap.size() > 1) {
    const left = minHeap.extractMin();
    const right = minHeap.extractMin();

    const merged = new HuffmanNode(null, left.freq + right.freq);
    merged.left = left;
    merged.right = right;

    minHeap.insert(merged);
  }

  return minHeap.extractMin();
}
```

### 3. Algorithme de Dijkstra (avec tas)

```javascript
function dijkstraWithHeap(graph, start) {
  const distances = {};
  const minHeap = new MinHeap();

  // Initialisation
  for (let vertex in graph) {
    distances[vertex] = vertex === start ? 0 : Infinity;
  }

  minHeap.insert({ vertex: start, distance: 0 });

  while (!minHeap.isEmpty()) {
    const { vertex: current, distance: currentDist } = minHeap.extractMin();

    if (currentDist > distances[current]) continue;

    for (let neighbor in graph[current]) {
      const weight = graph[current][neighbor];
      const newDist = currentDist + weight;

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        minHeap.insert({ vertex: neighbor, distance: newDist });
      }
    }
  }

  return distances;
}
```

---

## 🔍 Problèmes Avancés

### Problème : Médiane dans un Flux de Données

```javascript
class MedianFinder {
  constructor() {
    this.maxHeap = new MaxHeap(); // Moitié inférieure
    this.minHeap = new MinHeap(); // Moitié supérieure
  }

  addNum(num) {
    // Ajouter à maxHeap (moitié inférieure)
    this.maxHeap.insert(num);

    // Équilibrer : maxHeap ne doit pas avoir plus d'éléments que minHeap
    if (this.maxHeap.size() > this.minHeap.size() + 1) {
      this.minHeap.insert(this.maxHeap.extractMax());
    }

    // Équilibrer : minHeap ne doit pas avoir le plus petit élément
    if (this.minHeap.size() > 0 && this.maxHeap.getMax() > this.minHeap.getMin()) {
      const maxFromMax = this.maxHeap.extractMax();
      const minFromMin = this.minHeap.extractMin();

      this.maxHeap.insert(minFromMin);
      this.minHeap.insert(maxFromMax);
    }
  }

  findMedian() {
    if (this.maxHeap.size() > this.minHeap.size()) {
      return this.maxHeap.getMax();
    } else {
      return (this.maxHeap.getMax() + this.minHeap.getMin()) / 2;
    }
  }
}

// Test
const medianFinder = new MedianFinder();
[1, 2, 3, 4, 5].forEach(num => medianFinder.addNum(num));

console.log("Médiane:", medianFinder.findMedian()); // 3
```

---

## 📊 Comparaison des Structures

| Structure | Accès Min/Max | Insertion | Extraction | Application |
|-----------|---------------|-----------|------------|-------------|
| **Tas** | O(1) | O(log n) | O(log n) | Files de priorité |
| **BST équilibré** | O(log n) | O(log n) | O(log n) | Recherche ordonnée |
| **Table de hachage** | O(1) | O(1) | O(1) | Accès par clé |
| **Tableau trié** | O(1) | O(n) | O(1) | Accès par index |

---

## 📝 Quiz de Révision

### Question 1
Quelle propriété définit un arbre binaire complet ?
- A) Tous les niveaux remplis sauf le dernier à gauche  ← **Réponse**
- B) Parent toujours plus grand que les enfants
- C) Hauteur minimale
- D) Un seul enfant par nœud

### Question 2
Quelle est la complexité du tri par tas ?
- A) O(n)
- B) O(n log n)  ← **Réponse**
- C) O(n²)
- D) O(2ⁿ)

### Question 3
Quel algorithme utilise un tas comme structure principale ?
- A) Recherche binaire
- B) Tri fusion
- C) Tri rapide
- D) Tri par tas  ← **Réponse**

### Question 4
Quelle opération est en O(1) sur un tas ?
- A) Insertion
- B) Extraction
- C) Accès au maximum/minimum  ← **Réponse**
- D) Construction

---

## 🔑 Points Clés à Retenir

1. **Tas binaire** = arbre complet avec propriété d'ordre
2. **Représentation** : tableau (efficace, pas de pointeurs)
3. **Types** : max-heap (racine max), min-heap (racine min)
4. **Opérations** : insertion O(log n), extraction O(log n), accès racine O(1)
5. **Tri par tas** : O(n log n), in-place, pas stable
6. **Applications** : files de priorité, ordonnancement, algorithmes de graphes

---

*Fin du livre : [Annexes et Quiz](15-quizzes-exercises.md)*
