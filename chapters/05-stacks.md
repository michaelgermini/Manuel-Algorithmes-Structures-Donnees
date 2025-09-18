# Chapitre 5 : Les Piles (Stacks)

## 🥞 Qu'est-ce qu'une Pile ?

Une **pile** (stack) est une structure de données linéaire qui suit le principe :

👉 **LIFO** (Last In, First Out) : le dernier élément ajouté est le premier à être retiré.

💡 **Exemple concret** : une pile d'assiettes dans une cantine → tu ajoutes toujours au-dessus, tu retires toujours au-dessus.

### Schéma Illustratif

```
Haut de la pile → [🍎]
                  [🍌]
                  [🍐]  ← Base de la pile
```

- `push(🍎)` → ajoute en haut
- `pop()` → retire 🍎

---

## 🔧 Opérations Principales

- **`push(x)`** → ajoute un élément en haut
- **`pop()`** → retire l'élément du haut
- **`peek()`** → consulte l'élément du haut sans le retirer
- **`isEmpty()`** → vérifie si la pile est vide

---

## 💻 Implémentation en JavaScript

```javascript
class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// Exemple d'utilisation
const stack = new Stack();
stack.push("🍎");
stack.push("🍌");
console.log(stack.peek()); // 🍌
console.log(stack.pop());  // 🍌
console.log(stack.pop());  // 🍎
console.log(stack.pop());  // null
```

### Implémentation avec Objets (alternative)

```javascript
class StackObj {
  constructor() {
    this.items = {};
    this.count = 0;
  }

  push(element) {
    this.items[this.count] = element;
    this.count++;
  }

  pop() {
    if (this.isEmpty()) return null;
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.count - 1];
  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }
}
```

---

## 🌟 Cas d'Usage Réels

### 1. Gestion des Annulations (Ctrl+Z)

```javascript
class EditeurTexte {
  constructor() {
    this.texte = "";
    this.historique = new Stack();
  }

  ecrire(texte) {
    this.historique.push(this.texte);
    this.texte += texte;
  }

  annuler() {
    if (!this.historique.isEmpty()) {
      this.texte = this.historique.pop();
    }
  }
}

const editeur = new EditeurTexte();
editeur.ecrire("Hello ");
editeur.ecrire("World!");
console.log(editeur.texte); // "Hello World!"
editeur.annuler();
console.log(editeur.texte); // "Hello "
```

### 2. Parcours Récursif Transformé en Itératif

```javascript
// Parcours en profondeur d'un arbre (DFS itératif)
function dfsIteratif(racine) {
  const pile = new Stack();
  pile.push(racine);

  while (!pile.isEmpty()) {
    const noeud = pile.pop();
    console.log(noeud.valeur);

    // Ajouter les enfants (du dernier au premier pour garder l'ordre)
    if (noeud.droit) pile.push(noeud.droit);
    if (noeud.gauche) pile.push(noeud.gauche);
  }
}
```

### 3. Évaluation d'Expressions Arithmétiques

```javascript
function evaluerExpression(expression) {
  const pile = new Stack();
  const tokens = expression.split(' ');

  for (let token of tokens) {
    if (!isNaN(token)) {
      pile.push(parseFloat(token));
    } else {
      const b = pile.pop();
      const a = pile.pop();

      switch(token) {
        case '+': pile.push(a + b); break;
        case '-': pile.push(a - b); break;
        case '*': pile.push(a * b); break;
        case '/': pile.push(a / b); break;
      }
    }
  }

  return pile.pop();
}

console.log(evaluerExpression("3 4 + 2 *")); // (3 + 4) * 2 = 14
```

### 4. Vérification de Parentheses

```javascript
function parenthesesEquilibrees(expression) {
  const pile = new Stack();
  const ouvrantes = '({[';
  const fermantes = ')}]';

  for (let char of expression) {
    if (ouvrantes.includes(char)) {
      pile.push(char);
    } else if (fermantes.includes(char)) {
      if (pile.isEmpty()) return false;

      const ouvrante = pile.pop();
      const indexOuvrante = ouvrantes.indexOf(ouvrante);
      const indexFermante = fermantes.indexOf(char);

      if (indexOuvrante !== indexFermante) return false;
    }
  }

  return pile.isEmpty();
}

console.log(parenthesesEquilibrees("((2+3) * (5-1))")); // true
console.log(parenthesesEquilibrees("(2+3))(")); // false
```

---

## 💻 Exercice Pratique 1

**Objectif** : Implémentez une fonction `isBalanced(expression)` qui vérifie si les parenthèses d'une expression sont bien équilibrées.

**Exemples** :
- `"((2+3) * (5-1))"` → ✅ équilibré
- `"(2+3))("` → ❌ déséquilibré
- `"[{(2+3)*5}]"` → ✅ équilibré

### Solution :
```javascript
function isBalanced(expression) {
  const pile = new Stack();
  const paires = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (let char of expression) {
    if (['(', '{', '['].includes(char)) {
      pile.push(char);
    } else if ([')', '}', ']'].includes(char)) {
      if (pile.isEmpty() || pile.pop() !== paires[char]) {
        return false;
      }
    }
  }

  return pile.isEmpty();
}
```

---

## 💻 Exercice Pratique 2

**Objectif** : Implémentez une calculatrice RPN (Notation Polonaise Inverse).

**Exemple** :
- Expression : `"3 4 + 5 *"`
- Résultat : `(3 + 4) * 5 = 35`

### Solution :
```javascript
function calculatriceRPN(expression) {
  const pile = new Stack();
  const tokens = expression.split(' ');

  for (let token of tokens) {
    if (!isNaN(token)) {
      pile.push(parseFloat(token));
    } else {
      const b = pile.pop();
      const a = pile.pop();

      switch(token) {
        case '+': pile.push(a + b); break;
        case '-': pile.push(a - b); break;
        case '*': pile.push(a * b); break;
        case '/': pile.push(a / b); break;
        case '^': pile.push(Math.pow(a, b)); break;
      }
    }
  }

  return pile.pop();
}

console.log(calculatriceRPN("3 4 + 5 *")); // 35
console.log(calculatriceRPN("10 2 / 3 +")); // 8 (10/2 + 3)
```

---

## 💻 Exercice Pratique 3

**Objectif** : Implémentez une fonction qui inverse une chaîne de caractères en utilisant une pile.

**Exemple** :
- `"Hello World"` → `"dlroW olleH"`

### Solution :
```javascript
function inverserChaine(chaine) {
  const pile = new Stack();

  // Empiler chaque caractère
  for (let char of chaine) {
    pile.push(char);
  }

  // Dépiler pour reconstruire
  let resultat = '';
  while (!pile.isEmpty()) {
    resultat += pile.pop();
  }

  return resultat;
}

console.log(inverserChaine("Hello World")); // "dlroW olleH"
```

---

## 📊 Analyse de Complexité

| Opération | Complexité |
|-----------|------------|
| `push()` | O(1) |
| `pop()` | O(1) |
| `peek()` | O(1) |
| `isEmpty()` | O(1) |

**Espace** : O(n) où n est le nombre d'éléments

---

## 📝 Quiz de Révision

### Question 1
Quelle est la différence entre une pile et une file ?
- A) La pile est LIFO, la file est FIFO  ← **Réponse**
- B) La pile utilise plus de mémoire
- C) La file est plus rapide
- D) Aucune différence

### Question 2
Quelle opération permet de consulter le dernier élément sans le retirer ?
- A) `pop()`
- B) `push()`
- C) `peek()`  ← **Réponse**
- D) `isEmpty()`

### Question 3
Donnez un exemple concret d'utilisation d'une pile dans un logiciel.
- A) Imprimante
- B) Annulation (Ctrl+Z)  ← **Réponse**
- C) File d'attente de processus
- D) Cache mémoire

### Question 4
Dans une pile vide, que retourne `pop()` dans notre implémentation ?
- A) `undefined`
- B) Erreur
- C) `null`  ← **Réponse**
- D) `0`

---

## 🔑 Points Clés à Retenir

1. **Pile** = structure LIFO (Last In, First Out)
2. **Opérations principales** : `push()`, `pop()`, `peek()`, `isEmpty()`
3. **Complexité** : toutes les opérations en O(1)
4. **Applications** : annulations, récursion itérative, vérification de parenthèses
5. **Implémentation** : facile avec un tableau JavaScript (`push()` et `pop()`)

---

*Chapitre suivant : [Les Files (Queues)](06-queues.md)*
