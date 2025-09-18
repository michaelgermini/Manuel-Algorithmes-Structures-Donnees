// Visualiseur Interactif des Listes Chaînées
// Implémentation complète avec animations pour listes simplement et doublement chaînées

class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null; // Pour les listes doublement chaînées
    }
}

class LinkedList {
    constructor(type = 'singly') {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.type = type; // 'singly' ou 'doubly'
        this.operationCount = 0;
    }

    // Insertion au début
    insertFront(value) {
        this.operationCount++;
        const newNode = new ListNode(value);

        if (this.head === null) {
            this.head = this.tail = newNode;
        } else {
            newNode.next = this.head;
            if (this.type === 'doubly') {
                this.head.prev = newNode;
            }
            this.head = newNode;
        }

        this.size++;
        return this.size;
    }

    // Insertion à la fin
    insertEnd(value) {
        this.operationCount++;
        const newNode = new ListNode(value);

        if (this.head === null) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;
            if (this.type === 'doubly') {
                newNode.prev = this.tail;
            }
            this.tail = newNode;
        }

        this.size++;
        return this.size;
    }

    // Insertion à une position donnée
    insertAt(value, position) {
        this.operationCount++;

        if (position < 0 || position > this.size) {
            throw new Error('Position invalide');
        }

        if (position === 0) {
            return this.insertFront(value);
        }

        if (position === this.size) {
            return this.insertEnd(value);
        }

        const newNode = new ListNode(value);
        let current = this.head;
        let index = 0;

        // Trouver le nœud précédent la position
        while (index < position - 1) {
            current = current.next;
            index++;
        }

        newNode.next = current.next;
        current.next = newNode;

        if (this.type === 'doubly') {
            if (newNode.next) {
                newNode.next.prev = newNode;
            }
            newNode.prev = current;
        }

        this.size++;
        return this.size;
    }

    // Suppression à une position donnée
    removeAt(position) {
        this.operationCount++;

        if (position < 0 || position >= this.size || this.head === null) {
            throw new Error('Position invalide');
        }

        let removedValue;

        if (position === 0) {
            removedValue = this.head.value;
            this.head = this.head.next;

            if (this.head && this.type === 'doubly') {
                this.head.prev = null;
            }

            if (this.size === 1) {
                this.tail = null;
            }
        } else {
            let current = this.head;
            let index = 0;

            while (index < position - 1) {
                current = current.next;
                index++;
            }

            const nodeToRemove = current.next;
            removedValue = nodeToRemove.value;
            current.next = nodeToRemove.next;

            if (this.type === 'doubly') {
                if (current.next) {
                    current.next.prev = current;
                }
            }

            if (position === this.size - 1) {
                this.tail = current;
            }
        }

        this.size--;
        return removedValue;
    }

    // Recherche d'une valeur
    search(value) {
        this.operationCount++;
        let current = this.head;
        let position = 0;

        while (current) {
            if (current.value === value) {
                return position;
            }
            current = current.next;
            position++;
        }

        return -1;
    }

    // Inversion de la liste
    reverse() {
        this.operationCount++;

        if (this.size <= 1) return;

        if (this.type === 'singly') {
            let prev = null;
            let current = this.head;
            let next = null;

            while (current) {
                next = current.next;
                current.next = prev;
                prev = current;
                current = next;
            }

            this.tail = this.head;
            this.head = prev;
        } else {
            // Pour les listes doublement chaînées
            let current = this.head;
            let temp = null;

            while (current) {
                temp = current.prev;
                current.prev = current.next;
                current.next = temp;
                current = current.prev;
            }

            if (temp) {
                this.head = temp.prev;
            }

            // Échanger head et tail
            [this.head, this.tail] = [this.tail, this.head];
        }
    }

    // Conversion en tableau
    toArray() {
        const result = [];
        let current = this.head;

        while (current) {
            result.push(current.value);
            current = current.next;
        }

        return result;
    }

    // Conversion en tableau inversé (pour doublement chaînées)
    toArrayReverse() {
        if (this.type === 'singly') return null;

        const result = [];
        let current = this.tail;

        while (current) {
            result.push(current.value);
            current = current.prev;
        }

        return result;
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.operationCount = 0;
    }

    getSize() {
        return this.size;
    }

    getOperationCount() {
        return this.operationCount;
    }
}

class LinkedListVisualizer {
    constructor() {
        this.list = new LinkedList('singly');
        this.initializeEventListeners();
        this.updateDisplay();
        this.addLogEntry('Liste initialisée - Type: Simplement chaînée', 'initial');
    }

    initializeEventListeners() {
        // Changement de type de liste
        document.querySelectorAll('input[name="listType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.changeListType(e.target.value);
            });
        });

        // Boutons d'opération
        document.getElementById('insertFrontBtn').addEventListener('click', () => this.handleInsertFront());
        document.getElementById('insertEndBtn').addEventListener('click', () => this.handleInsertEnd());
        document.getElementById('insertAtBtn').addEventListener('click', () => this.handleInsertAt());
        document.getElementById('removeAtBtn').addEventListener('click', () => this.handleRemoveAt());
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('reverseBtn').addEventListener('click', () => this.handleReverse());
        document.getElementById('resetListBtn').addEventListener('click', () => this.handleReset());

        // Gestion des entrées
        document.getElementById('valueInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsertEnd();
            }
        });

        document.getElementById('positionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsertAt();
            }
        });
    }

    changeListType(type) {
        const currentArray = this.list.toArray();
        this.list = new LinkedList(type);
        this.list.operationCount = 0;

        // Reconstruire la liste avec le nouveau type
        for (const value of currentArray) {
            this.list.insertEnd(value);
        }

        this.updateTypeDisplay();
        this.updateDisplay();
        this.addLogEntry(`Type changé vers liste ${type === 'singly' ? 'simplement' : 'doublement'} chaînée`, 'initial');
    }

    updateTypeDisplay() {
        const typeDisplay = document.getElementById('listTypeDisplay');
        typeDisplay.textContent = this.list.type === 'singly' ? 'Simplement chaînée' : 'Doublement chaînée';
    }

    handleInsertFront() {
        const value = document.getElementById('valueInput').value.trim();
        if (!value) {
            this.showError('Veuillez saisir une valeur');
            return;
        }

        const newSize = this.list.insertFront(value);
        this.animateInsert(0, value);
        this.updateDisplay();
        this.addLogEntry(`INSERT_FRONT "${value}" → Taille: ${newSize}`, 'insert');

        document.getElementById('valueInput').value = '';
        document.getElementById('valueInput').focus();
    }

    handleInsertEnd() {
        const value = document.getElementById('valueInput').value.trim();
        if (!value) {
            this.showError('Veuillez saisir une valeur');
            return;
        }

        const newSize = this.list.insertEnd(value);
        this.animateInsert(this.list.getSize() - 1, value);
        this.updateDisplay();
        this.addLogEntry(`INSERT_END "${value}" → Taille: ${newSize}`, 'insert');

        document.getElementById('valueInput').value = '';
        document.getElementById('valueInput').focus();
    }

    handleInsertAt() {
        const value = document.getElementById('valueInput').value.trim();
        const position = parseInt(document.getElementById('positionInput').value);

        if (!value) {
            this.showError('Veuillez saisir une valeur');
            return;
        }

        if (isNaN(position)) {
            this.showError('Veuillez saisir une position valide');
            return;
        }

        try {
            const newSize = this.list.insertAt(value, position);
            this.animateInsert(position, value);
            this.updateDisplay();
            this.addLogEntry(`INSERT_AT "${value}" position ${position} → Taille: ${newSize}`, 'insert');
        } catch (error) {
            this.showError(error.message);
        }

        document.getElementById('valueInput').value = '';
        document.getElementById('positionInput').value = '';
    }

    handleRemoveAt() {
        const position = parseInt(document.getElementById('positionInput').value);

        if (isNaN(position)) {
            this.showError('Veuillez saisir une position valide');
            return;
        }

        try {
            const removedValue = this.list.removeAt(position);
            this.animateRemove(position);
            this.updateDisplay();
            this.addLogEntry(`REMOVE_AT position ${position} ("${removedValue}") → Taille: ${this.list.getSize()}`, 'remove');
        } catch (error) {
            this.showError(error.message);
        }

        document.getElementById('positionInput').value = '';
    }

    handleSearch() {
        const value = document.getElementById('valueInput').value.trim();
        if (!value) {
            this.showError('Veuillez saisir une valeur à rechercher');
            return;
        }

        const position = this.list.search(value);
        if (position !== -1) {
            this.animateSearch(position);
            this.addLogEntry(`SEARCH "${value}" → Trouvé à position ${position}`, 'search');
        } else {
            this.addLogEntry(`SEARCH "${value}" → Non trouvé`, 'search');
            this.showError(`Valeur "${value}" non trouvée dans la liste`);
        }
    }

    handleReverse() {
        this.list.reverse();
        this.animateReverse();
        this.updateDisplay();
        this.addLogEntry('REVERSE → Liste inversée', 'reverse');
    }

    handleReset() {
        this.list.clear();
        this.updateDisplay();
        this.addLogEntry('RESET → Liste vidée', 'initial');
    }

    animateInsert(position, value) {
        // Temporiser pour permettre au DOM de se mettre à jour
        setTimeout(() => {
            const nodes = document.querySelectorAll('.list-node');
            if (nodes[position]) {
                nodes[position].classList.add('inserting');
                setTimeout(() => {
                    nodes[position].classList.remove('inserting');
                }, 500);
            }
        }, 50);
    }

    animateRemove(position) {
        const nodes = document.querySelectorAll('.list-node');
        if (nodes[position]) {
            nodes[position].classList.add('removing');
            // Le nœud sera supprimé par updateDisplay()
        }
    }

    animateSearch(position) {
        const nodes = document.querySelectorAll('.list-node');
        if (nodes[position]) {
            nodes[position].classList.add('searching');
            setTimeout(() => {
                nodes[position].classList.remove('searching');
            }, 2000);
        }
    }

    animateReverse() {
        const container = document.getElementById('linkedList');
        container.style.animation = 'reverseList 1s ease-in-out';

        setTimeout(() => {
            container.style.animation = '';
        }, 1000);
    }

    updateDisplay() {
        const container = document.getElementById('linkedList');
        container.innerHTML = '';

        let current = this.list.head;
        let index = 0;

        while (current) {
            const nodeElement = this.createNodeElement(current, index);
            container.appendChild(nodeElement);

            // Ajouter une flèche si ce n'est pas le dernier nœud
            if (current.next) {
                const arrow = document.createElement('div');
                arrow.className = 'arrow';
                arrow.textContent = '→';
                container.appendChild(arrow);
            }

            current = current.next;
            index++;
        }

        // Mettre à jour les statistiques
        this.updateStats();
        this.updatePointers();
    }

    createNodeElement(node, index) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'list-node';
        nodeElement.dataset.index = index;

        nodeElement.innerHTML = `
            <div class="node-value">${node.value}</div>
            <div class="node-pointers">
                ${this.list.type === 'doubly' ? `<span class="node-prev">${index > 0 ? 'prev' : ''}</span> | ` : ''}
                <span class="node-next">${node.next ? 'next' : ''}</span>
            </div>
        `;

        return nodeElement;
    }

    updateStats() {
        document.getElementById('listSize').textContent = this.list.getSize();
        document.getElementById('operationCount').textContent = this.list.getOperationCount();
        document.getElementById('listStatus').textContent = this.list.getSize() === 0 ? 'Vide' : 'Active';
    }

    updatePointers() {
        const headValue = this.list.head ? `"${this.list.head.value}"` : 'NULL';
        const tailValue = this.list.tail ? `"${this.list.tail.value}"` : 'NULL';

        document.getElementById('headPointer').textContent = headValue;
        document.getElementById('tailPointer').textContent = tailValue;
    }

    addLogEntry(message, type = 'info') {
        const logContainer = document.getElementById('operationsLog');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;

        // Limiter à 20 entrées
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 20) {
            logContainer.removeChild(entries[0]);
        }
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideInError 0.3s ease-out;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutError 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Fonctions pour les exercices

function loadExercise1() {
    const visualizer = window.listVisualizer;
    visualizer.handleReset();

    const values = ["Chat", "Chien", "Oiseau", "Poisson"];

    // Insérer dans l'ordre demandé
    values.forEach(value => {
        document.getElementById('valueInput').value = value;
        visualizer.handleInsertEnd();
    });

    const resultDiv = document.getElementById('exercise1Result');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 1</h4>
        <p>Liste construite avec succès dans l'ordre demandé :</p>
        <p><strong>Contenu :</strong> ${values.join(' → ')}</p>
        <p><strong>Taille :</strong> ${visualizer.list.getSize()}</p>
        <p><strong>Type :</strong> ${visualizer.list.type === 'singly' ? 'Simplement' : 'Doublement'} chaînée</p>
    `;
}

function loadExercise2() {
    const visualizer = window.listVisualizer;
    visualizer.handleReset();

    // Initialiser avec ["A", "B", "C", "D"]
    const initialValues = ["A", "B", "C", "D"];
    initialValues.forEach(value => {
        document.getElementById('valueInput').value = value;
        visualizer.handleInsertEnd();
    });

    // Attendre un peu puis effectuer les opérations
    setTimeout(() => {
        // 1. Insérer "X" au début
        document.getElementById('valueInput').value = "X";
        visualizer.handleInsertFront();

        setTimeout(() => {
            // 2. Supprimer l'élément à la position 2 (qui est maintenant "B")
            document.getElementById('positionInput').value = "2";
            visualizer.handleRemoveAt();

            setTimeout(() => {
                // 3. Inverser la liste
                visualizer.handleReverse();

                const resultDiv = document.getElementById('exercise2Result');
                resultDiv.innerHTML = `
                    <h4>Résultat de l'Exercice 2</h4>
                    <p>Opérations effectuées :</p>
                    <ol>
                        <li>✅ Inséré "X" au début</li>
                        <li>✅ Supprimé élément à position 2 ("B")</li>
                        <li>✅ Inversé la liste</li>
                    </ol>
                    <p><strong>Résultat final :</strong> ${visualizer.list.toArray().join(' → ')}</p>
                `;
            }, 1000);
        }, 1000);
    }, 500);
}

function demonstrateComparison() {
    const resultDiv = document.getElementById('comparisonResult');
    resultDiv.innerHTML = '<p>🔄 Démonstration en cours...</p>';

    // Créer deux listes identiques
    const singlyList = new LinkedList('singly');
    const doublyList = new LinkedList('doubly');

    const testData = ['A', 'B', 'C', 'D', 'E'];

    // Insérer les données
    testData.forEach(value => {
        singlyList.insertEnd(value);
        doublyList.insertEnd(value);
    });

    // Test 1: Insertion au milieu (position 3)
    console.log('=== Test 1: Insertion au milieu ===');
    singlyList.insertAt('X', 3);
    doublyList.insertAt('X', 3);

    console.log('Simplement chaînée:', singlyList.toArray());
    console.log('Doublement chaînée:', doublyList.toArray());

    // Test 2: Suppression du dernier élément
    console.log('=== Test 2: Suppression du dernier ===');
    singlyList.removeAt(singlyList.getSize() - 1);
    doublyList.removeAt(doublyList.getSize() - 1);

    console.log('Simplement chaînée:', singlyList.toArray());
    console.log('Doublement chaînée:', doublyList.toArray());

    // Test 3: Parcours inverse (si possible)
    console.log('=== Test 3: Parcours inverse ===');
    console.log('Simplement chaînée (inverse):', singlyList.toArray().reverse());
    console.log('Doublement chaînée (inverse):', doublyList.toArrayReverse());

    resultDiv.innerHTML = `
        <h4>Comparaison Simplement vs Doublement Chaînées</h4>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
                <h5 style="color: #28a745;">Simplement Chaînée</h5>
                <ul style="margin: 10px 0;">
                    <li>✅ Insertion milieu: O(n)</li>
                    <li>✅ Suppression fin: O(n)</li>
                    <li>❌ Parcours inverse: O(n) avec reverse()</li>
                    <li>💾 Mémoire: 1 pointeur/nœud</li>
                </ul>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px;">
                <h5 style="color: #1976d2;">Doublement Chaînée</h5>
                <ul style="margin: 10px 0;">
                    <li>✅ Insertion milieu: O(n)</li>
                    <li>✅ Suppression fin: O(1)</li>
                    <li>✅ Parcours inverse: O(n) direct</li>
                    <li>💾 Mémoire: 2 pointeurs/nœud</li>
                </ul>
            </div>
        </div>

        <p><strong>Conclusion :</strong> Les doublement chaînées offrent plus de flexibilité au prix d'une consommation mémoire légèrement supérieure.</p>
    `;
}

// Styles CSS pour les animations d'erreur
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInError {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOutError {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    @keyframes reverseList {
        0% { transform: scaleX(1); }
        50% { transform: scaleX(0.95); }
        100% { transform: scaleX(1); }
    }
`;
document.head.appendChild(style);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.listVisualizer = new LinkedListVisualizer();
});

