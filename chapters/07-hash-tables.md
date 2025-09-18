# Chapitre 7 : Les Tables de Hachage (Hash Tables)

## 🔑 Qu'est-ce qu'une Table de Hachage ?

Une **table de hachage** est une structure de données qui associe des clés à des valeurs.

👉 Elle permet des opérations rapides (insertion, recherche, suppression) en moyenne en **O(1)**.

💡 **Exemple concret** :
- Un dictionnaire → mot = clé, définition = valeur
- Un carnet de contacts → nom = clé, numéro = valeur

### Schéma Illustratif

```
Fonction de hachage : "chat" → hash → case mémoire 5

Table de hachage :
[0] → ...
[1] → ...
[2] → ...
[3] → ...
[4] → ...
[5] → "chat" : "🐱"
[6] → ...
```

---

## 🔧 Les Opérations Principales

- **`set(key, value)`** → insérer une paire clé/valeur
- **`get(key)`** → retrouver la valeur associée à la clé
- **`remove(key)`** → supprimer la paire
- **`has(key)`** → vérifier si une clé existe

---

## 🔢 Fonction de Hachage

### Définition

Une **fonction de hachage** transforme une clé en un indice de tableau.

**Propriétés importantes** :
- **Déterministe** : même clé → même hash
- **Rapide** : calcul en O(1)
- **Uniforme** : distribution homogène des valeurs

### Exemples de Fonctions de Hachage

```javascript
// Hachage simple pour chaînes
function hashSimple(cle, tailleTable) {
  let hash = 0;
  for (let char of cle) {
    hash += char.charCodeAt(0);
  }
  return hash % tailleTable;
}

console.log(hashSimple("chat", 10)); // 5
console.log(hashSimple("chien", 10)); // 8

// Hachage DJB2 (plus robuste)
function hashDJB2(cle, tailleTable) {
  let hash = 5381;
  for (let char of cle) {
    hash = ((hash << 5) + hash) + char.charCodeAt(0);
  }
  return Math.abs(hash) % tailleTable;
}

console.log(hashDJB2("chat", 10)); // 7
console.log(hashDJB2("chien", 10)); // 3
```

---

## 💥 Gestion des Collisions

**Problème** : deux clés différentes peuvent produire le même hash.

### 1. Chaînage (Chaining)

Chaque case contient une liste d'éléments.

```javascript
class HashTableChaining {
  constructor(size = 10) {
    this.table = new Array(size);
    this.size = size;
  }

  _hash(key) {
    let hash = 0;
    for (let char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % this.size;
  }

  set(key, value) {
    const index = this._hash(key);
    if (!this.table[index]) {
      this.table[index] = [];
    }

    // Vérifier si la clé existe déjà
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i][0] === key) {
        this.table[index][i][1] = value;
        return;
      }
    }

    this.table[index].push([key, value]);
  }

  get(key) {
    const index = this._hash(key);
    const bucket = this.table[index];
    if (bucket) {
      for (let [k, v] of bucket) {
        if (k === key) return v;
      }
    }
    return undefined;
  }

  remove(key) {
    const index = this._hash(key);
    const bucket = this.table[index];
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          bucket.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}

// Exemple d'utilisation
const ht = new HashTableChaining();
ht.set("chat", "🐱");
ht.set("chien", "🐶");
console.log(ht.get("chat"));  // 🐱
console.log(ht.get("chien")); // 🐶

// Collision simulée
ht.set("tac", "collision!"); // Même hash que "chat" probablement
console.log(ht.get("tac"));   // collision!
```

### 2. Adressage Ouvert (Open Addressing)

Si une case est occupée, chercher la suivante disponible.

**Techniques** :
- **Linéaire** : case suivante (index + 1)
- **Quadratique** : case + 1², + 2², + 3²...
- **Double hachage** : utiliser une deuxième fonction de hachage

```javascript
class HashTableOpenAddressing {
  constructor(size = 10) {
    this.table = new Array(size).fill(null);
    this.size = size;
  }

  _hash(key) {
    let hash = 0;
    for (let char of key) {
      hash += char.charCodeAt(0);
    }
    return hash % this.size;
  }

  set(key, value) {
    let index = this._hash(key);
    let originalIndex = index;

    while (this.table[index] !== null && this.table[index][0] !== key) {
      index = (index + 1) % this.size;

      // Si on a fait le tour complet
      if (index === originalIndex) {
        throw new Error("Table pleine");
      }
    }

    this.table[index] = [key, value];
  }

  get(key) {
    let index = this._hash(key);
    let originalIndex = index;

    while (this.table[index] !== null) {
      if (this.table[index][0] === key) {
        return this.table[index][1];
      }
      index = (index + 1) % this.size;

      if (index === originalIndex) break;
    }

    return undefined;
  }

  remove(key) {
    let index = this._hash(key);
    let originalIndex = index;

    while (this.table[index] !== null) {
      if (this.table[index][0] === key) {
        this.table[index] = null;
        return true;
      }
      index = (index + 1) % this.size;

      if (index === originalIndex) break;
    }

    return false;
  }
}
```

---

## 💻 Implémentation Moderne (ES6 Map)

```javascript
// JavaScript fournit une implémentation native
const map = new Map();

map.set("chat", "🐱");
map.set("chien", "🐶");

console.log(map.get("chat"));  // 🐱
console.log(map.has("oiseau")); // false
console.log(map.size);         // 2

// Itération
for (let [cle, valeur] of map) {
  console.log(`${cle} -> ${valeur}`);
}
```

---

## 🌟 Cas d'Usage Réels

### 1. Dictionnaires (Objets JavaScript)

```javascript
// Un objet JS est essentiellement une table de hachage
const dictionnaire = {
  "chat": "🐱",
  "chien": "🐶",
  "oiseau": "🐦"
};

console.log(dictionnaire["chat"]); // 🐱
```

### 2. Cache Mémoire

```javascript
class Cache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // Remettre au début (LRU)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Supprimer le moins récemment utilisé
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}
```

### 3. Comptage d'Occurrences

```javascript
function compterMots(texte) {
  const mots = texte.toLowerCase().split(/\s+/);
  const compteur = new Map();

  for (let mot of mots) {
    mot = mot.replace(/[.,!?]/g, ''); // Nettoyer
    if (mot) {
      compteur.set(mot, (compteur.get(mot) || 0) + 1);
    }
  }

  return compteur;
}

const resultat = compterMots("Le chat chasse le chat.");
console.log(resultat); // Map { 'le' => 2, 'chat' => 2, 'chasse' => 1 }
```

### 4. Recherche Rapide dans un Ensemble

```javascript
class EnsembleRapide {
  constructor() {
    this.items = new Set(); // Set utilise une table de hachage
  }

  ajouter(element) {
    this.items.add(element);
  }

  contient(element) {
    return this.items.has(element);
  }

  supprimer(element) {
    return this.items.delete(element);
  }
}
```

---

## 💻 Exercice Pratique 1

**Objectif** : Implémentez une fonction `countWords(text)` qui utilise une table de hachage pour compter combien de fois chaque mot apparaît dans une phrase.

**Exemple** :
```
countWords("chat chien chat oiseau")
// Résultat attendu : { chat: 2, chien: 1, oiseau: 1 }
```

### Solution :
```javascript
function countWords(text) {
  const words = text.toLowerCase().split(/\s+/);
  const count = new Map();

  for (let word of words) {
    // Nettoyer le mot
    word = word.replace(/[.,!?;:]/g, '');
    if (word) {
      count.set(word, (count.get(word) || 0) + 1);
    }
  }

  return Object.fromEntries(count);
}

console.log(countWords("Le chat noir chasse le chat blanc."));
// { le: 2, chat: 2, noir: 1, chasse: 1, blanc: 1 }
```

---

## 💻 Exercice Pratique 2

**Objectif** : Implémentez un cache LRU (Least Recently Used) simple.

**Consignes** :
- Capacité maximale
- Quand plein, supprimer l'élément le moins récemment utilisé
- `get()` et `set()` doivent mettre à jour l'ordre d'utilisation

### Solution :
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Clé -> Valeur, ordre préservé
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    const value = this.cache.get(key);
    this.cache.delete(key); // Supprimer
    this.cache.set(key, value); // Remettre à la fin
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Supprimer le premier (moins récemment utilisé)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}

// Test
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1)); // 1 (remis au début)
cache.put(3, 3); // 2 sera supprimé (LRU)
console.log(cache.get(2)); // -1 (supprimé)
```

---

### Exercice 3 : Table de Hachage Personnalisée

**Objectif** : Implémenter une table de hachage complète avec chaînage.

**Consignes** :
- Implémenter une classe `HashTable` avec les méthodes de base
- Utiliser le chaînage pour gérer les collisions
- Inclure les opérations CRUD (Create, Read, Update, Delete)

```javascript
class HashTable {
    constructor(size = 53) {
        // TODO: implémenter le constructeur
    }

    // Fonction de hachage simple
    _hash(key) {
        // TODO: implémenter
    }

    set(key, value) {
        // TODO: implémenter
    }

    get(key) {
        // TODO: implémenter
    }

    remove(key) {
        // TODO: implémenter
    }

    has(key) {
        // TODO: implémenter
    }

    keys() {
        // TODO: retourner toutes les clés
    }

    values() {
        // TODO: retourner toutes les valeurs
    }

    clear() {
        // TODO: vider la table
    }
}

// Tests
const ht = new HashTable();
ht.set("nom", "Alice");
ht.set("age", 25);
ht.set("ville", "Paris");

console.log(ht.get("nom")); // "Alice"
console.log(ht.has("age")); // true
ht.remove("ville");
console.log(ht.has("ville")); // false
```

### Solution :
```javascript
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
    }

    _hash(key) {
        let total = 0;
        const WEIRD_PRIME = 31;

        for (let i = 0; i < Math.min(key.length, 100); i++) {
            const char = key[i];
            const value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }

        return total;
    }

    set(key, value) {
        const index = this._hash(key);

        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }

        // Vérifier si la clé existe déjà
        for (let i = 0; i < this.keyMap[index].length; i++) {
            if (this.keyMap[index][i][0] === key) {
                this.keyMap[index][i][1] = value;
                return;
            }
        }

        this.keyMap[index].push([key, value]);
    }

    get(key) {
        const index = this._hash(key);

        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    return this.keyMap[index][i][1];
                }
            }
        }

        return undefined;
    }

    remove(key) {
        const index = this._hash(key);

        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    this.keyMap[index].splice(i, 1);
                    return true;
                }
            }
        }

        return false;
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    keys() {
        const keysArr = [];

        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    keysArr.push(this.keyMap[i][j][0]);
                }
            }
        }

        return keysArr;
    }

    values() {
        const valuesArr = [];

        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    valuesArr.push(this.keyMap[i][j][1]);
                }
            }
        }

        return valuesArr;
    }

    clear() {
        this.keyMap = new Array(this.keyMap.length);
    }
}
```

---

### Exercice 4 : Analyse des Collisions

**Objectif** : Analyser l'impact des collisions sur les performances.

**Consignes** :
- Créer une fonction qui mesure le taux de collisions
- Tester différentes fonctions de hachage
- Étudier l'impact de la taille de la table

```javascript
function analyserCollisions(hashFunction, keys, tableSize) {
    // TODO: implémenter l'analyse des collisions
    // Retourner des métriques sur les collisions
}

// Fonctions de hachage à tester
function hashSimple(key, size) {
    let total = 0;
    for (let char of key) {
        total += char.charCodeAt(0);
    }
    return total % size;
}

function hashDJB2(key, size) {
    let hash = 5381;
    for (let char of key) {
        hash = ((hash << 5) + hash) + char.charCodeAt(0);
    }
    return Math.abs(hash) % size;
}

// Test
const mots = ["chat", "chien", "oiseau", "poisson", "lapin", "hamster", "perroquet"];

console.log("Analyse avec hashSimple:");
console.log(analyserCollisions(hashSimple, mots, 10));

console.log("Analyse avec hashDJB2:");
console.log(analyserCollisions(hashDJB2, mots, 10));
```

### Solution :
```javascript
function analyserCollisions(hashFunction, keys, tableSize) {
    const distribution = new Array(tableSize).fill(0);
    const collisions = new Array(tableSize).fill(0);

    // Calculer la distribution des hashes
    for (let key of keys) {
        const hash = hashFunction(key, tableSize);
        distribution[hash]++;

        if (distribution[hash] > 1) {
            collisions[hash] = distribution[hash] - 1;
        }
    }

    // Calculer les métriques
    const totalCollisions = collisions.reduce((sum, count) => sum + count, 0);
    const maxCollisions = Math.max(...collisions);
    const avgCollisions = totalCollisions / keys.length;
    const loadFactor = keys.length / tableSize;

    // Cases vides
    const emptySlots = distribution.filter(count => count === 0).length;

    return {
        totalCollisions,
        maxCollisions,
        avgCollisions,
        loadFactor,
        emptySlots,
        distribution,
        collisions
    };
}

// Fonction d'affichage des résultats
function afficherAnalyse(resultats, nomFonction) {
    console.log(`📊 Analyse pour ${nomFonction}:`);
    console.log(`   Total des collisions: ${resultats.totalCollisions}`);
    console.log(`   Maximum de collisions par case: ${resultats.maxCollisions}`);
    console.log(`   Moyenne de collisions: ${resultats.avgCollisions.toFixed(2)}`);
    console.log(`   Facteur de charge: ${resultats.loadFactor.toFixed(2)}`);
    console.log(`   Cases vides: ${resultats.emptySlots}`);
    console.log(`   Distribution: [${resultats.distribution.join(', ')}]`);
    console.log("");
}

// Test étendu
const mots = ["chat", "chien", "oiseau", "poisson", "lapin", "hamster", "perroquet"];

console.log("🔍 Analyse comparative des fonctions de hachage\n");

const resultatsSimple = analyserCollisions(hashSimple, mots, 10);
afficherAnalyse(resultatsSimple, "hashSimple");

const resultatsDJB2 = analyserCollisions(hashDJB2, mots, 10);
afficherAnalyse(resultatsDJB2, "hashDJB2");

// Test avec différentes tailles de table
console.log("📏 Impact de la taille de la table:");
const tailles = [5, 10, 20, 50];

for (let taille of tailles) {
    const resultats = analyserCollisions(hashDJB2, mots, taille);
    console.log(`   Taille ${taille}: ${resultats.totalCollisions} collisions, facteur ${resultats.loadFactor.toFixed(2)}`);
}
```

---

### Exercice 5 : Cache Multi-Niveau

**Objectif** : Implémenter un système de cache multi-niveau utilisant des tables de hachage.

**Consignes** :
- Cache L1 : petit, rapide (Map)
- Cache L2 : plus grand, plus lent (HashTable personnalisée)
- Stratégie de remplacement LRU
- Mesurer les performances

```javascript
class MultiLevelCache {
    constructor(l1Size = 10, l2Size = 100) {
        // TODO: implémenter le cache multi-niveau
    }

    get(key) {
        // TODO: vérifier L1 d'abord, puis L2
    }

    set(key, value) {
        // TODO: stratégie de placement
    }

    // Statistiques
    getStats() {
        // TODO: retourner les métriques de performance
    }
}

// Simulation d'utilisation
const cache = new MultiLevelCache(5, 20);

// Simulation de requêtes
const requests = ['A', 'B', 'A', 'C', 'B', 'D', 'A', 'E', 'F', 'A'];

for (let req of requests) {
    cache.get(req) || cache.set(req, `valeur-${req}`);
}

console.log(cache.getStats());
```

### Solution :
```javascript
class MultiLevelCache {
    constructor(l1Size = 10, l2Size = 100) {
        this.l1 = new Map(); // Cache L1 : rapide
        this.l2 = new Map(); // Cache L2 : plus grand
        this.l1Size = l1Size;
        this.l2Size = l2Size;

        // Statistiques
        this.stats = {
            l1Hits: 0,
            l2Hits: 0,
            misses: 0,
            totalRequests: 0
        };

        // Pour LRU, on utilise un ordre d'accès
        this.l1Order = [];
        this.l2Order = [];
    }

    get(key) {
        this.stats.totalRequests++;

        // Vérifier L1 d'abord
        if (this.l1.has(key)) {
            this.stats.l1Hits++;
            this.updateOrder(this.l1Order, key);
            return this.l1.get(key);
        }

        // Vérifier L2
        if (this.l2.has(key)) {
            this.stats.l2Hits++;
            this.updateOrder(this.l2Order, key);

            // Promouvoir vers L1
            const value = this.l2.get(key);
            this.set(key, value);
            return value;
        }

        // Cache miss
        this.stats.misses++;
        return null;
    }

    set(key, value) {
        // Si déjà dans L1, mettre à jour
        if (this.l1.has(key)) {
            this.l1.set(key, value);
            this.updateOrder(this.l1Order, key);
            return;
        }

        // Ajouter à L1
        if (this.l1.size >= this.l1Size) {
            // Évincer le moins récemment utilisé de L1
            const lruKey = this.l1Order.shift();
            const lruValue = this.l1.get(lruKey);

            // Déplacer vers L2 si L2 n'est pas plein
            if (this.l2.size < this.l2Size) {
                this.l2.set(lruKey, lruValue);
                this.l2Order.push(lruKey);
            }

            this.l1.delete(lruKey);
        }

        this.l1.set(key, value);
        this.l1Order.push(key);
    }

    updateOrder(orderArray, key) {
        // Retirer la clé existante et la remettre à la fin
        const index = orderArray.indexOf(key);
        if (index > -1) {
            orderArray.splice(index, 1);
        }
        orderArray.push(key);
    }

    getStats() {
        const l1HitRate = this.stats.l1Hits / this.stats.totalRequests;
        const l2HitRate = this.stats.l2Hits / this.stats.totalRequests;
        const totalHitRate = (this.stats.l1Hits + this.stats.l2Hits) / this.stats.totalRequests;

        return {
            totalRequests: this.stats.totalRequests,
            l1Hits: this.stats.l1Hits,
            l2Hits: this.stats.l2Hits,
            misses: this.stats.misses,
            l1HitRate: l1HitRate.toFixed(3),
            l2HitRate: l2HitRate.toFixed(3),
            totalHitRate: totalHitRate.toFixed(3),
            l1Size: this.l1.size,
            l2Size: this.l2.size
        };
    }
}

// Test du cache multi-niveau
const cache = new MultiLevelCache(3, 10);

// Simulation de requêtes avec localité temporelle
const requests = [
    'A', 'B', 'C', // Remplit L1
    'A', 'B',      // Hits L1
    'D', 'E', 'F', // Ajoute à L1, évince vers L2
    'A', 'D',      // A en L1, D promu de L2 vers L1
    'G', 'H', 'I', 'J', 'K' // Continue...
];

console.log("🔄 Simulation du cache multi-niveau:");
console.log("Requêtes:", requests.join(' → '));
console.log("");

for (let i = 0; i < requests.length; i++) {
    const req = requests[i];
    const result = cache.get(req);

    if (!result) {
        // Cache miss - définir une valeur
        cache.set(req, `data-${req}`);
        console.log(`${i + 1}. ${req}: MISS → ajouté au cache`);
    } else {
        console.log(`${i + 1}. ${req}: HIT → ${result}`);
    }
}

console.log("");
console.log("📊 Statistiques finales:");
const stats = cache.getStats();
console.log(`   Requêtes totales: ${stats.totalRequests}`);
console.log(`   Hits L1: ${stats.l1Hits} (${stats.l1HitRate})`);
console.log(`   Hits L2: ${stats.l2Hits} (${stats.l2HitRate})`);
console.log(`   Misses: ${stats.misses}`);
console.log(`   Taux de succès total: ${stats.totalHitRate}`);
console.log(`   Taille L1: ${stats.l1Size}, L2: ${stats.l2Size}`);
```

---

## 📊 Analyse de Complexité

| Opération | Moyenne | Pire Cas |
|-----------|---------|----------|
| `set()` | O(1) | O(n) - collisions |
| `get()` | O(1) | O(n) - collisions |
| `remove()` | O(1) | O(n) - collisions |

**Facteurs influençant les performances** :
- Qualité de la fonction de hachage
- Taux de remplissage (load factor)
- Stratégie de gestion des collisions

---

## 📝 Quiz de Révision

### Question 1
Quel est l'avantage principal d'une table de hachage par rapport à un tableau ?
- A) Tri automatique
- B) Recherche en O(1) moyenne  ← **Réponse**
- C) Mémoire réduite
- D) Stabilité garantie

### Question 2
Que se passe-t-il si deux clés produisent le même hash ?
- A) Erreur
- B) Collision, à gérer  ← **Réponse**
- C) Valeur écrasée
- D) Recherche impossible

### Question 3
Quelle méthode de gestion des collisions utilise des listes chaînées ?
- A) Adressage ouvert
- B) Chaînage  ← **Réponse**
- C) Double hachage
- D) Re-hachage

### Question 4
Dans quelle structure JavaScript retrouve-t-on une table de hachage ?
- A) Array
- B) Map  ← **Réponse**
- C) Set
- D) String

---

## 🔑 Points Clés à Retenir

1. **Table de hachage** = association clé-valeur avec recherche O(1) moyenne
2. **Fonction de hachage** = transforme clé en indice, doit être rapide et uniforme
3. **Collisions** = inévitables, gérées par chaînage ou adressage ouvert
4. **Applications** : caches, dictionnaires, comptage, ensembles rapides
5. **JavaScript** : `Map` et `Set` utilisent des tables de hachage
6. **Performance** : dépend de la fonction de hachage et du taux de remplissage

---

*Chapitre suivant : [Arbres Binaires de Recherche](08-binary-search-trees.md)*
