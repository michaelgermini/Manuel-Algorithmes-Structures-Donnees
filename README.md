# 🎓 Manuel d'Algorithmes et Structures de Données

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/fr/docs/Web/JavaScript)
[![Interactive](https://img.shields.io/badge/Interactive-Yes-green.svg)]()
[![Educational](https://img.shields.io/badge/Educational-Open--Source-orange.svg)]()

> **Apprenez les algorithmes et structures de données de manière interactive et visuelle**

Un manuel complet d'algorithmique avec **8 exercices interactifs** qui permettent de comprendre visuellement les concepts fondamentaux de l'informatique.

---

## 🎯 Vue d'ensemble

### 📊 Contenu du Manuel

- **16 chapitres** couvrant tous les concepts essentiels
- **8 exercices interactifs** avec visualisations en temps réel
- **30+ algorithmes** implémentés et démontrés
- **Théorie complète** avec exemples pratiques
- **JavaScript moderne** (ES6+)

### 🏗️ Structures de Données Couvertes

| Structure | Complexité | Exercices |
|-----------|------------|-----------|
| **Tableaux & Tris** | O(1) accès, O(n²) tri | ✅ Visualiseur de tris |
| **Listes Chaînées** | O(1) insertion, O(n) accès | ✅ Visualiseur de listes |
| **Piles (Stacks)** | LIFO - O(1) opérations | ✅ Visualiseur de piles |
| **Files d'Attente** | FIFO - O(1) opérations | ✅ Visualiseur de files |
| **Tables de Hachage** | O(1) moyenne | ✅ Visualiseur de hash |
| **Arbres Binaires** | O(log n) recherche | ✅ Visualiseur d'arbres |
| **Graphes** | Algorithmes variés | ✅ Visualiseur de graphes |
| **Récursion** | Pile d'exécution | ✅ Visualiseur récursif |

---

## 🚀 Démarrage Rapide

### Prérequis

- Navigateur web moderne (Chrome, Firefox, Edge, Safari)
- Connaissances de base en JavaScript recommandées
- Aucun serveur requis - fonctionne directement dans le navigateur

### Utilisation

1. **Clonez le repository** :
   ```bash
   git clone https://github.com/[votre-username]/algorithmes-structures-donnees.git
   cd algorithmes-structures-donnees
   ```

2. **Ouvrez les exercices** :
   - Lancez `interactive-exercises/index.html` dans votre navigateur
   - Choisissez un exercice dans le menu principal
   - Explorez les visualisations interactives

3. **Lisez la théorie** :
   - Chaque chapitre se trouve dans le dossier `chapters/`
   - Les exercices intègrent automatiquement le contenu théorique

---

## 🎮 Exercices Interactifs

### 📋 Liste Complète

| Exercice | Chapitre | Concepts Clés | Durée |
|----------|----------|---------------|-------|
| 🔄 **Visualiseur de Tris** | 2 | Bubble, Quick, Merge, Insertion | 45 min |
| 🔗 **Listes Chaînées** | 3 | Singly/Doubly Linked Lists | 40 min |
| 🔁 **Récursion** | 4 | Pile d'exécution, Factorielle, Fibonacci | 50 min |
| 📚 **Piles (Stacks)** | 5 | LIFO, Applications pratiques | 35 min |
| 📋 **Files d'Attente** | 6 | FIFO, Files de priorité | 35 min |
| 🔐 **Tables de Hachage** | 7 | Hashing, Collisions, Performance | 45 min |
| 🌳 **Arbres Binaires** | 8 | BST, Insertion, Recherche, Suppression | 50 min |
| 🕸️ **Graphes** | 12 | BFS, DFS, Composantes connexes | 55 min |

### 🎯 Objectifs Pédagogiques

Chaque exercice vous permet de :

- **👁️ Observer** : Voir les algorithmes s'exécuter pas à pas
- **🧠 Comprendre** : Analyser les mécanismes internes
- **🎮 Expérimenter** : Tester différents scénarios
- **📊 Comparer** : Évaluer les performances relatives
- **🏗️ Construire** : Créer vos propres implémentations

---

## 📖 Structure du Projet

```
algorithmes-structures-donnees/
├── 📂 chapters/                    # Chapitres théoriques (Markdown)
│   ├── 01-introduction.md
│   ├── 02-arrays-sorting.md
│   ├── 03-linked-lists.md
│   ├── ...
│   └── 16-glossary.md
├── 📂 interactive-exercises/       # Exercices interactifs
│   ├── index.html                 # 🏠 Menu principal
│   ├── chapters-data.js          # 📚 Données des chapitres
│   ├── chapter-loader.js         # 🔄 Chargeur de chapitres
│   ├── footer-generator.js       # 🎨 Générateur de footers
│   ├── sorting-visualizer/       # 🔄 Visualiseur de tris
│   ├── linked-list-visualizer/   # 🔗 Listes chaînées
│   ├── ...
│   └── graph-visualizer/         # 🕸️ Graphes
├── 📄 README.md                   # 📖 Documentation principale
├── 📄 .gitignore                  # 🚫 Fichiers ignorés
└── 📊 autres fichiers analytiques
```

---

## 🎓 Pour les Étudiants

### Comment utiliser efficacement

1. **Commencez par un chapitre** : Lisez la théorie dans `chapters/`
2. **Pratiquez avec l'exercice** : Utilisez le visualiseur correspondant
3. **Expérimentez** : Modifiez les paramètres et observez les résultats
4. **Approfondissez** : Lisez le chapitre complet intégré dans l'exercice
5. **Répétez** : Passez à d'autres algorithmes

### Niveaux de difficulté

- **🔰 Débutant** : Tableaux, Listes, Piles, Files
- **🟡 Intermédiaire** : Tris, Hash, Arbres, Récursion
- **🔴 Avancé** : Graphes, Algorithmes complexes

---

## 👨‍🏫 Pour les Enseignants

### Utilisation en classe

- **Démonstrations** : Visualisez les algorithmes en temps réel
- **Exercices pratiques** : Les étudiants peuvent expérimenter
- **Théorie intégrée** : Chaque concept est expliqué
- **Auto-apprentissage** : Les étudiants peuvent travailler seuls

### Personnalisation

Le code est entièrement modifiable pour :
- Ajouter de nouveaux exercices
- Modifier les visualisations
- Adapter le contenu pédagogique
- Intégrer dans votre propre plateforme

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment participer :

### 🚀 Améliorations possibles

- [ ] Ajouter plus d'exercices interactifs
- [ ] Implémenter d'autres algorithmes de tri
- [ ] Créer des visualisations pour les arbres AVL/Rouge-Noir
- [ ] Ajouter des exercices sur les plus courts chemins
- [ ] Traduire en d'autres langues

### 📝 Comment contribuer

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajoute nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- Inspiré par les cours d'algorithmique et structures de données
- Construit avec JavaScript moderne et HTML5 Canvas
- Design responsive et accessible
- Open source pour l'éducation

---

## 📞 Contact

Pour questions ou suggestions :
- Ouvrez une [issue](https://github.com/[votre-username]/algorithmes-structures-donnees/issues) sur GitHub
- Consultez la [documentation](./docs/) pour plus d'informations

---

**🎯 Prêt à maîtriser les algorithmes ? Lancez votre premier exercice interactif !**

---
