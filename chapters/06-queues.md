# Chapitre 6 : Les Files (Queues)

## 🚶 Qu'est-ce qu'une File ?

Une **file** (queue) est une structure de données linéaire qui suit le principe :

👉 **FIFO** (First In, First Out) : le premier élément entré est le premier à sortir.

💡 **Exemple concret** : une file d'attente au supermarché → le premier client arrivé est le premier servi.

### Schéma Illustratif

```
Entrée → [🚶] [🚶] [🚶] → Sortie
         Alice  Bob   Clara
```

- `enqueue(🚶)` → ajoute une personne à la fin de la file
- `dequeue()` → retire la personne en tête de file

---

## 🔧 Opérations Principales

- **`enqueue(x)`** → ajoute un élément à la fin
- **`dequeue()`** → retire l'élément au début
- **`peek()`** → consulte le premier élément sans le retirer
- **`isEmpty()`** → vérifie si la file est vide

---

## 💻 Implémentation en JavaScript

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift(); // retire le premier élément
  }

  peek() {
    return this.isEmpty() ? null : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Exemple d'utilisation
const queue = new Queue();
queue.enqueue("Alice");
queue.enqueue("Bob");
queue.enqueue("Clara");

console.log(queue.dequeue()); // Alice
console.log(queue.peek());    // Bob
console.log(queue.dequeue()); // Bob
```

### Implémentation Optimisée (avec deux pointeurs)

```javascript
class QueueOptimisee {
  constructor() {
    this.items = {};
    this.debut = 0;
    this.fin = 0;
  }

  enqueue(element) {
    this.items[this.fin] = element;
    this.fin++;
  }

  dequeue() {
    if (this.isEmpty()) return null;
    const element = this.items[this.debut];
    delete this.items[this.debut];
    this.debut++;
    return element;
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.debut];
  }

  isEmpty() {
    return this.debut === this.fin;
  }

  size() {
    return this.fin - this.debut;
  }
}
```

---

## 🌟 Cas d'Usage Réels

### 1. Imprimante

```javascript
class GestionImprimante {
  constructor() {
    this.fileImpression = new Queue();
  }

  ajouterDocument(document) {
    this.fileImpression.enqueue(document);
    console.log(`Document "${document}" ajouté à la file d'impression`);
  }

  imprimer() {
    if (this.fileImpression.isEmpty()) {
      console.log("Aucun document à imprimer");
      return;
    }

    const document = this.fileImpression.dequeue();
    console.log(`Impression de "${document}"...`);
  }
}

const imprimante = new GestionImprimante();
imprimante.ajouterDocument("Rapport.pdf");
imprimante.ajouterDocument("CV.docx");
imprimante.imprimer(); // Imprime Rapport.pdf en premier
```

### 2. Systèmes d'Exploitation (Ordonnanceur de Processus)

```javascript
class Ordonnanceur {
  constructor() {
    this.fileProcessus = new Queue();
  }

  ajouterProcessus(processus) {
    this.fileProcessus.enqueue({
      ...processus,
      arrivee: Date.now()
    });
  }

  executerProcessus() {
    if (this.fileProcessus.isEmpty()) return;

    const processus = this.fileProcessus.dequeue();
    console.log(`Exécution de ${processus.nom} (priorité: ${processus.priorite})`);

    // Simulation d'exécution
    setTimeout(() => {
      console.log(`${processus.nom} terminé`);
    }, processus.duree * 1000);
  }
}
```

### 3. Simulations de Files d'Attente

```javascript
class SimulationSupermarche {
  constructor() {
    this.file = new Queue();
    this.tempsTotal = 0;
  }

  arriver(client) {
    this.file.enqueue({
      nom: client,
      arrivee: Date.now()
    });
  }

  servir() {
    if (this.file.isEmpty()) return null;

    const client = this.file.dequeue();
    const tempsAttente = Date.now() - client.arrivee;
    this.tempsTotal += tempsAttente;

    return {
      client: client.nom,
      tempsAttente: tempsAttente
    };
  }

  moyenneTempsAttente() {
    return this.tempsTotal / Math.max(1, this.file.size());
  }
}
```

### 4. Parcours en Largeur (BFS)

```javascript
function parcoursLargeur(graphe, depart) {
  const file = new Queue();
  const visites = new Set();

  file.enqueue(depart);
  visites.add(depart);

  while (!file.isEmpty()) {
    const sommet = file.dequeue();
    console.log(sommet);

    // Ajouter les voisins non visités
    for (let voisin of graphe[sommet] || []) {
      if (!visites.has(voisin)) {
        visites.add(voisin);
        file.enqueue(voisin);
      }
    }
  }
}

// Exemple
const reseau = {
  'Alice': ['Bob', 'Charlie'],
  'Bob': ['Alice', 'Diana'],
  'Charlie': ['Alice', 'Diana'],
  'Diana': ['Bob', 'Charlie']
};

parcoursLargeur(reseau, 'Alice'); // Alice, Bob, Charlie, Diana
```

---

## 💻 Exercice Pratique 1

**Objectif** : Implémentez une file et simulez une file d'attente au cinéma.

**Consignes** :
- 5 clients arrivent successivement dans la file
- À chaque étape, un client est servi (retiré de la file)
- Affichez l'état de la file après chaque opération

```javascript
class Cinema {
  constructor() {
    this.file = new Queue();
  }

  arriver(client) {
    this.file.enqueue(client);
    this.afficherFile();
  }

  servir() {
    const client = this.file.dequeue();
    if (client) {
      console.log(`🎟️ ${client} est servi`);
      this.afficherFile();
    }
  }

  afficherFile() {
    console.log(`File actuelle: [${this.file.items.join(', ')}]`);
  }
}

const cinema = new Cinema();
cinema.arriver("Alice");
cinema.arriver("Bob");
cinema.arriver("Charlie");
cinema.arriver("Diana");
cinema.arriver("Eve");

cinema.servir();
cinema.servir();
```

---

## 💻 Exercice Pratique 2

**Objectif** : Implémentez une file avec priorité.

**Consignes** :
- Les éléments ont une priorité (nombre)
- Les éléments de haute priorité sont servis en premier
- Implémentez `enqueue(element, priorite)` et `dequeue()`

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

---

## 💻 Exercice Pratique 3

**Objectif** : Résoudre le problème des producteurs-consommateurs.

**Scénario** : Plusieurs producteurs ajoutent des tâches, un consommateur les traite.

```javascript
class TacheSysteme {
  constructor() {
    this.fileTaches = new Queue();
    this.enCours = false;
  }

  ajouterTache(tache) {
    this.fileTaches.enqueue(tache);
    console.log(`📋 Tâche ajoutée: ${tache}`);
    this.traiterSiPossible();
  }

  traiterSiPossible() {
    if (!this.enCours && !this.fileTaches.isEmpty()) {
      this.enCours = true;
      const tache = this.fileTaches.dequeue();
      console.log(`⚙️ Traitement de: ${tache}`);

      // Simulation de traitement asynchrone
      setTimeout(() => {
        console.log(`✅ ${tache} terminée`);
        this.enCours = false;
        this.traiterSiPossible(); // Traiter la suivante
      }, Math.random() * 2000 + 1000);
    }
  }
}

const systeme = new TacheSysteme();
systeme.ajouterTache("Sauvegarde données");
systeme.ajouterTache("Mise à jour antivirus");
systeme.ajouterTache("Nettoyage disque");
```

---

## 📊 Analyse de Complexité

| Opération | Complexité (Tableau) | Complexité (Optimisée) |
|-----------|---------------------|----------------------|
| `enqueue()` | O(1) | O(1) |
| `dequeue()` | O(n) - à cause de `shift()` | O(1) |
| `peek()` | O(1) | O(1) |
| `isEmpty()` | O(1) | O(1) |

**Espace** : O(n) dans les deux cas

⚠️ **Note** : L'implémentation avec tableau natif a un `dequeue()` en O(n) à cause du `shift()`. L'implémentation optimisée résout ce problème.

---

## 📝 Quiz de Révision

### Question 1
Quelle est la différence entre une pile et une file ?
- A) La pile est LIFO, la file est FIFO  ← **Réponse**
- B) La file utilise plus de mémoire
- C) La pile est plus rapide
- D) Aucune différence

### Question 2
Quelle méthode permet de retirer le premier élément ?
- A) `enqueue()`
- B) `dequeue()`  ← **Réponse**
- C) `peek()`
- D) `push()`

### Question 3
Cite un exemple d'utilisation d'une file dans un système informatique.
- A) Annulation (Ctrl+Z)
- B) Vérification de parenthèses
- C) Impression de documents  ← **Réponse**
- D) Calculatrice RPN

### Question 4
Dans l'implémentation avec tableau, quelle opération est coûteuse ?
- A) `enqueue()` (O(1))
- B) `dequeue()` (O(n))  ← **Réponse**
- C) `peek()` (O(1))
- D) `isEmpty()` (O(1))

---

## 🔑 Points Clés à Retenir

1. **File** = structure FIFO (First In, First Out)
2. **Opérations principales** : `enqueue()`, `dequeue()`, `peek()`, `isEmpty()`
3. **Complexité** : `enqueue()` et `peek()` en O(1), `dequeue()` en O(n) avec tableau
4. **Applications** : impression, ordonnancement, simulations, BFS
5. **Optimisation** : utiliser des pointeurs pour éviter le coût du `shift()`

---

*Chapitre suivant : [Récursion & Diviser pour Régner](04-recursion-divide-conquer.md)*
