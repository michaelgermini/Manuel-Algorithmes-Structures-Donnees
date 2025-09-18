# 🤝 Guide de Contribution

Bienvenue ! Nous sommes ravis que vous souhaitiez contribuer à ce manuel d'algorithmes et structures de données. Ce guide vous explique comment participer au projet.

## 🚀 Démarrage Rapide

### Prérequis

- Connaissances en **JavaScript moderne** (ES6+)
- Compréhension des **algorithmes et structures de données**
- **Git** et un éditeur de code
- Navigateur web moderne pour tester

### Configuration

1. **Fork** le projet sur GitHub
2. **Clone** votre fork :
   ```bash
   git clone https://github.com/votre-username/algorithmes-structures-donnees.git
   cd algorithmes-structures-donnees
   ```

3. **Installez les dépendances** (si nécessaire) :
   ```bash
   # Pas de dépendances externes pour le développement de base
   # Ouvrez simplement les fichiers HTML dans votre navigateur
   ```

## 🎯 Types de Contributions

### 📝 Améliorer le Contenu

- **Corriger des erreurs** dans les chapitres théoriques
- **Améliorer les explications** et exemples de code
- **Ajouter des exercices** ou quiz
- **Traduire** en d'autres langues

### 💻 Développer de Nouveaux Exercices

- **Créer des visualisations** pour de nouveaux algorithmes
- **Améliorer l'interface** des exercices existants
- **Ajouter des fonctionnalités** pédagogiques
- **Optimiser les performances**

### 🐛 Signaler et Corriger des Bugs

- **Tester** les exercices sur différents navigateurs
- **Vérifier** la responsivité mobile
- **Signaler** les erreurs dans les issues
- **Proposer** des corrections

## 📋 Processus de Contribution

### 1. Choisir une Issue

- Consultez les [issues ouvertes](https://github.com/[votre-username]/algorithmes-structures-donnees/issues)
- Commentez sur l'issue pour indiquer que vous travaillez dessus
- Créez une nouvelle issue si vous avez une idée

### 2. Créer une Branche

```bash
# Créez une branche descriptive
git checkout -b feature/nouvelle-visualisation-tri
# ou
git checkout -b fix/erreur-calcul-factorielle
# ou
git checkout -b docs/ameliorer-explications-recursion
```

### 3. Développer

#### Pour les Exercices Interactifs

- Respectez la **structure existante** :
  ```
  nom-exercice/
  ├── index.html      # Interface utilisateur
  ├── styles.css      # Styles CSS
  └── nom-exercice.js # Logique JavaScript
  ```

- Utilisez le **système de chapitres intégré** :
  ```javascript
  initChapterLoader('XX'); // Numéro du chapitre
  ```

- **Testez** sur plusieurs navigateurs :
  - Chrome/Chromium
  - Firefox
  - Safari (si possible)
  - Edge

#### Pour le Contenu Théorique

- Suivez la **structure Markdown** existante
- Incluez des **exemples de code** exécutables
- Ajoutez des **exercices pratiques**
- Respectez la **progression pédagogique**

### 4. Tester

#### Tests Fonctionnels

- Ouvrez les fichiers HTML dans votre navigateur
- Vérifiez que toutes les fonctionnalités marchent
- Testez avec différentes tailles d'écran
- Vérifiez l'accessibilité (contraste, navigation clavier)

#### Tests de Performance

- Vérifiez que les animations sont fluides
- Testez avec de gros ensembles de données
- Surveillez la consommation mémoire

### 5. Commiter

```bash
# Commits clairs et descriptifs
git add .
git commit -m "feat: ajouter visualiseur pour l'algorithme de tri par tas

- Implémentation complète avec animations
- Interface responsive
- Intégration chapitre 11
- Tests de performance validés"
```

### 6. Push et Pull Request

```bash
# Push vers votre fork
git push origin feature/nouvelle-fonctionnalite

# Créez une Pull Request sur GitHub
# Décrivez clairement vos changements
# Référencez les issues liées
```

## 🎨 Standards de Code

### JavaScript

```javascript
// ✅ Bon
class SortingVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.data = [];
  }

  async bubbleSort() {
    // Implémentation claire et commentée
  }
}

// ❌ Éviter
function sort(arr){for(var i=0;i<arr.length;i++)for(var j=0;j<arr.length-i-1;j++)if(arr[j]>arr[j+1]){var temp=arr[j];arr[j]=arr[j+1];arr[j+1]=temp;}}
```

### HTML/CSS

- Utilisez la **sémantique** HTML5
- **Classes descriptives** en anglais
- **CSS modulaire** et organisé
- **Responsive design** obligatoire

### Markdown

- **Titres hiérarchisés** (H1 → H6)
- **Code en ligne** avec \`backticks\`
- **Blocs de code** avec langage spécifié
- **Liens et images** avec alt-text

## 📚 Ressources Utiles

### Outils de Développement

- **Visual Studio Code** avec extensions :
  - ES6 Mocha Snippets
  - HTML CSS Support
  - Markdown Preview
- **Navigateurs** avec outils développeur
- **Git** pour le contrôle de version

### Documentation

- [MDN Web Docs](https://developer.mozilla.org) - JavaScript
- [CSS Tricks](https://css-tricks.com) - CSS
- [HTML5 Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Graphismes

### Algorithmes et Structures

- [GeeksforGeeks](https://www.geeksforgeeks.org) - Explications détaillées
- [Visualgo](https://visualgo.net) - Visualisations d'algorithmes
- [Big O Cheat Sheet](https://www.bigocheatsheet.com) - Complexité

## 🤔 Besoin d'Aide ?

- **Issues** : Pour les bugs et demandes de fonctionnalités
- **Discussions** : Pour les questions générales
- **Documentation** : Lisez le README et les commentaires dans le code

## 📜 Code de Conduite

- Respectez tous les contributeurs
- Soyez constructif dans vos retours
- Testez vos changements avant de les proposer
- Documentez vos modifications

## 🎉 Reconnaissance

Tous les contributeurs sont crédités dans le README et les releases. Les contributions significatives sont mentionnées dans les notes de version.

---

**Merci de contribuer à l'éducation en algorithmique ! 🚀**
