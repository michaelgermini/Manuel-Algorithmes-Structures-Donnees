// Générateur de footer uniforme pour tous les exercices
class FooterGenerator {
    constructor(exerciseConfig) {
        this.config = exerciseConfig;
    }

    generateFooter() {
        return `
        <footer>
            <div class="footer-main">
                <h3>🎓 Exercices Interactifs - Algorithmes et Structures de Données</h3>
                <p><strong>${this.config.chapterTitle}</strong></p>
                <p>${this.config.description}</p>
            </div>

            <div class="chapter-ref">
                <p>
                    <strong>📖 Référence complète :</strong> ${this.config.chapterRef}<br>
                    <strong>🎯 Objectif :</strong> ${this.config.objective}<br>
                    <strong>⏱️ Durée estimée :</strong> ${this.config.duration}<br>
                    <strong>💡 Prérequis :</strong> ${this.config.prerequisites}
                </p>
            </div>

            <div class="footer-links">
                <a href="../index.html" class="footer-btn">🏠 Menu Principal</a>
                <a href="../README.md" class="footer-btn">📚 Documentation</a>
                <a href="${this.config.chapterLink}" class="footer-btn">📖 Chapitre Complet</a>
            </div>

            <div class="copyright">
                <p>&copy; 2025 Manuel d'Algorithmes et Structures de Données</p>
                <p>Créé avec ❤️ pour l'apprentissage de l'algorithmique</p>
            </div>
        </footer>`;
    }
}

// Configuration pour chaque exercice
const exerciseConfigs = {
    'sorting-visualizer': {
        chapterTitle: 'Chapitre 2 - Tableaux et Algorithmes de Tri',
        description: 'Maîtrisez les algorithmes de tri avec des visualisations interactives',
        chapterRef: 'Chapitre 2 du manuel',
        objective: 'Comprendre visuellement le fonctionnement des algorithmes de tri',
        duration: '45 minutes',
        prerequisites: 'Notions de base en JavaScript et tableaux',
        chapterLink: '../chapters/02-arrays-sorting.md'
    },
    'linked-list-visualizer': {
        chapterTitle: 'Chapitre 3 - Listes Chaînées',
        description: 'Découvrez les structures de données chaînées et leurs opérations',
        chapterRef: 'Chapitre 3 du manuel',
        objective: 'Comprendre les listes simplement et doublement chaînées',
        duration: '40 minutes',
        prerequisites: 'Notions de base en programmation et pointeurs',
        chapterLink: '../chapters/03-linked-lists.md'
    },
    'recursion-visualizer': {
        chapterTitle: 'Chapitre 4 - Récursion et Diviser pour Régner',
        description: 'Explorez la récursion et les algorithmes diviser pour régner',
        chapterRef: 'Chapitre 4 du manuel',
        objective: 'Comprendre la mécanique des appels récursifs et la pile d\'exécution',
        duration: '50 minutes',
        prerequisites: 'Notions de base en programmation et fonctions',
        chapterLink: '../chapters/04-recursion-divide-conquer.md'
    },
    'stack-visualizer': {
        chapterTitle: 'Chapitre 5 - Les Piles (Stacks)',
        description: 'Maîtrisez le principe LIFO avec les piles',
        chapterRef: 'Chapitre 5 du manuel',
        objective: 'Comprendre le principe LIFO et les applications des piles',
        duration: '35 minutes',
        prerequisites: 'Notions de base en structures de données',
        chapterLink: '../chapters/05-stacks.md'
    },
    'queue-visualizer': {
        chapterTitle: 'Chapitre 6 - Les Files d\'Attente',
        description: 'Découvrez FIFO et les files de priorité',
        chapterRef: 'Chapitre 6 du manuel',
        objective: 'Comprendre FIFO et les files de priorité',
        duration: '35 minutes',
        prerequisites: 'Notions de base en structures de données et algorithmes',
        chapterLink: '../chapters/06-queues.md'
    },
    'hash-table-visualizer': {
        chapterTitle: 'Chapitre 7 - Tables de Hachage',
        description: 'Explorez le hachage et la résolution des collisions',
        chapterRef: 'Chapitre 7 du manuel',
        objective: 'Comprendre le hachage et la résolution des collisions',
        duration: '45 minutes',
        prerequisites: 'Notions de base en algorithmes et structures de données',
        chapterLink: '../chapters/07-hash-tables.md'
    },
    'binary-tree-visualizer': {
        chapterTitle: 'Chapitre 8 - Arbres Binaires de Recherche',
        description: 'Maîtrisez les BST et leurs opérations',
        chapterRef: 'Chapitre 8 du manuel',
        objective: 'Comprendre les BST et leurs opérations',
        duration: '50 minutes',
        prerequisites: 'Notions de base en structures de données et récursion',
        chapterLink: '../chapters/08-binary-search-trees.md'
    },
    'graph-visualizer': {
        chapterTitle: 'Chapitre 12 - Graphes',
        description: 'Découvrez BFS et DFS dans les graphes',
        chapterRef: 'Chapitre 12 du manuel',
        objective: 'Comprendre BFS et DFS visuellement',
        duration: '55 minutes',
        prerequisites: 'Notions de base en structures de données et algorithmes',
        chapterLink: '../chapters/12-graphs.md'
    }
};

// Fonction pour obtenir la configuration d'un exercice
function getExerciseConfig(exerciseName) {
    return exerciseConfigs[exerciseName];
}

// Fonction pour générer automatiquement le footer
function generateFooterForExercise(exerciseName) {
    const config = getExerciseConfig(exerciseName);
    if (!config) {
        console.error(`Configuration non trouvée pour l'exercice: ${exerciseName}`);
        return '';
    }

    const generator = new FooterGenerator(config);
    return generator.generateFooter();
}
