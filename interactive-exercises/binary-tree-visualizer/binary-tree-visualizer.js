// Visualiseur Interactif des Arbres Binaires de Recherche
// Implémentation complète avec animations et opérations

class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.highlighted = false;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
        this.operationCount = 0;
    }

    insert(value) {
        this.operationCount++;
        const newNode = new TreeNode(value);

        if (!this.root) {
            this.root = newNode;
            return true;
        }

        let current = this.root;
        while (true) {
            if (value === current.value) {
                return false; // Valeur déjà présente
            }

            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return true;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return true;
                }
                current = current.right;
            }
        }
    }

    search(value) {
        this.operationCount++;
        let current = this.root;

        while (current) {
            if (value === current.value) {
                current.highlighted = true;
                setTimeout(() => current.highlighted = false, 2000);
                return current;
            }

            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return null;
    }

    delete(value) {
        this.operationCount++;
        this.root = this.deleteNode(this.root, value);
        return this.root !== null;
    }

    deleteNode(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this.deleteNode(node.left, value);
        } else if (value > node.value) {
            node.right = this.deleteNode(node.right, value);
        } else {
            // Nœud trouvé
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // Nœud avec deux enfants
            const successor = this.findMin(node.right);
            node.value = successor.value;
            node.right = this.deleteNode(node.right, successor.value);
        }

        return node;
    }

    findMin(node = this.root) {
        while (node && node.left) {
            node = node.left;
        }
        return node;
    }

    findMax(node = this.root) {
        while (node && node.right) {
            node = node.right;
        }
        return node;
    }

    getHeight(node = this.root) {
        if (!node) return 0;
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    getSize(node = this.root) {
        if (!node) return 0;
        return 1 + this.getSize(node.left) + this.getSize(node.right);
    }

    isBalanced(node = this.root) {
        if (!node) return true;

        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);

        return Math.abs(leftHeight - rightHeight) <= 1 &&
               this.isBalanced(node.left) &&
               this.isBalanced(node.right);
    }

    inOrder(node = this.root, result = []) {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.value);
            this.inOrder(node.right, result);
        }
        return result;
    }

    preOrder(node = this.root, result = []) {
        if (node) {
            result.push(node.value);
            this.preOrder(node.left, result);
            this.preOrder(node.right, result);
        }
        return result;
    }

    postOrder(node = this.root, result = []) {
        if (node) {
            this.postOrder(node.left, result);
            this.postOrder(node.right, result);
            result.push(node.value);
        }
        return result;
    }

    levelOrder() {
        if (!this.root) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const level = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                level.push(node.value);

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            result.push(level);
        }

        return result;
    }

    clear() {
        this.root = null;
        this.operationCount = 0;
    }

    getOperationCount() {
        return this.operationCount;
    }
}

class TreeVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.tree = new BinarySearchTree();

        // Paramètres de visualisation
        this.nodeRadius = 25;
        this.levelHeight = 80;
        this.zoom = 1;
        this.offsetX = this.canvas.width / 2;
        this.offsetY = 50;

        // Couleurs
        this.colors = {
            node: '#4CAF50',
            nodeHighlighted: '#ffc107',
            text: 'white',
            line: '#333',
            background: 'white'
        };

        this.initializeEventListeners();
        this.draw();
        this.updateStats();
    }

    initializeEventListeners() {
        // Opérations principales
        document.getElementById('insertBtn').addEventListener('click', () => this.handleInsert());
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('deleteBtn').addEventListener('click', () => this.handleDelete());

        // Parcours
        document.getElementById('inorderBtn').addEventListener('click', () => this.showTraversal('inorder'));
        document.getElementById('preorderBtn').addEventListener('click', () => this.showTraversal('preorder'));
        document.getElementById('postorderBtn').addEventListener('click', () => this.showTraversal('postorder'));
        document.getElementById('levelorderBtn').addEventListener('click', () => this.showTraversal('levelorder'));

        // Utilitaires
        document.getElementById('clearBtn').addEventListener('click', () => this.handleClear());
        document.getElementById('randomBtn').addEventListener('click', () => this.generateRandomTree());
        document.getElementById('resetViewBtn').addEventListener('click', () => this.resetView());

        // Contrôles de vue
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('panUpBtn').addEventListener('click', () => this.pan(0, -20));
        document.getElementById('panDownBtn').addEventListener('click', () => this.pan(0, 20));
        document.getElementById('panLeftBtn').addEventListener('click', () => this.pan(-20, 0));
        document.getElementById('panRightBtn').addEventListener('click', () => this.pan(20, 0));

        // Gestion des entrées
        document.getElementById('valueInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsert();
            }
        });
    }

    handleInsert() {
        const value = parseInt(document.getElementById('valueInput').value);
        if (isNaN(value)) {
            this.showStatus('Veuillez saisir un nombre valide', 'error');
            return;
        }

        const success = this.tree.insert(value);
        if (success) {
            this.showStatus(`Valeur ${value} insérée avec succès`, 'success');
            this.calculatePositions();
            this.draw();
            this.updateStats();
        } else {
            this.showStatus(`Valeur ${value} déjà présente dans l'arbre`, 'warning');
        }

        document.getElementById('valueInput').value = '';
        document.getElementById('valueInput').focus();
    }

    handleSearch() {
        const value = parseInt(document.getElementById('valueInput').value);
        if (isNaN(value)) {
            this.showStatus('Veuillez saisir un nombre valide', 'error');
            return;
        }

        const found = this.tree.search(value);
        if (found) {
            this.showStatus(`Valeur ${value} trouvée !`, 'success');
            this.draw(); // Redessiner pour montrer le surlignage
        } else {
            this.showStatus(`Valeur ${value} non trouvée`, 'warning');
        }
    }

    handleDelete() {
        const value = parseInt(document.getElementById('valueInput').value);
        if (isNaN(value)) {
            this.showStatus('Veuillez saisir un nombre valide', 'error');
            return;
        }

        const success = this.tree.delete(value);
        if (success) {
            this.showStatus(`Valeur ${value} supprimée avec succès`, 'success');
            this.calculatePositions();
            this.draw();
            this.updateStats();
        } else {
            this.showStatus(`Valeur ${value} non trouvée`, 'warning');
        }
    }

    handleClear() {
        this.tree.clear();
        this.showStatus('Arbre vidé', 'info');
        this.draw();
        this.updateStats();
    }

    generateRandomTree() {
        this.tree.clear();
        const values = [];

        // Générer 10 valeurs uniques aléatoires
        while (values.length < 10) {
            const value = Math.floor(Math.random() * 100) + 1;
            if (!values.includes(value)) {
                values.push(value);
            }
        }

        // Insérer les valeurs
        values.forEach(value => this.tree.insert(value));

        this.showStatus(`Arbre aléatoire généré avec les valeurs : ${values.join(', ')}`, 'success');
        this.calculatePositions();
        this.draw();
        this.updateStats();
    }

    showTraversal(type) {
        let result = [];
        let traversalName = '';

        switch (type) {
            case 'inorder':
                result = this.tree.inOrder();
                traversalName = 'In-Order (trié)';
                break;
            case 'preorder':
                result = this.tree.preOrder();
                traversalName = 'Pre-Order';
                break;
            case 'postorder':
                result = this.tree.postOrder();
                traversalName = 'Post-Order';
                break;
            case 'levelorder':
                result = this.tree.levelOrder();
                traversalName = 'Level-Order (par niveaux)';
                break;
        }

        const resultDiv = document.getElementById('traversalResult');
        if (Array.isArray(result[0])) {
            // Level-order
            resultDiv.innerHTML = `<strong>${traversalName} :</strong><br>${result.map((level, i) =>
                `Niveau ${i + 1}: [${level.join(', ')}]`).join('<br>')}`;
        } else {
            resultDiv.innerHTML = `<strong>${traversalName} :</strong> [${result.join(', ')}]`;
        }

        this.showStatus(`Parcours ${traversalName} effectué`, 'info');
    }

    calculatePositions(node = this.tree.root, x = this.canvas.width / 2, y = 50, levelWidth = this.canvas.width / 2) {
        if (!node) return;

        node.x = x;
        node.y = y;

        const childLevelWidth = levelWidth / 2;
        this.calculatePositions(node.left, x - childLevelWidth, y + this.levelHeight, childLevelWidth);
        this.calculatePositions(node.right, x + childLevelWidth, y + this.levelHeight, childLevelWidth);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTree(this.tree.root);
    }

    drawTree(node) {
        if (!node) return;

        // Dessiner les liens vers les enfants
        if (node.left) {
            this.drawLine(node.x, node.y, node.left.x, node.left.y);
            this.drawTree(node.left);
        }

        if (node.right) {
            this.drawLine(node.x, node.y, node.right.x, node.right.y);
            this.drawTree(node.right);
        }

        // Dessiner le nœud
        this.drawNode(node);
    }

    drawNode(node) {
        const x = node.x * this.zoom + this.offsetX - this.canvas.width / 2;
        const y = node.y * this.zoom + this.offsetY;

        // Cercle du nœud
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = node.highlighted ? this.colors.nodeHighlighted : this.colors.node;
        this.ctx.fill();
        this.ctx.strokeStyle = this.colors.line;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Valeur du nœud
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value.toString(), x, y);
    }

    drawLine(x1, y1, x2, y2) {
        const startX = x1 * this.zoom + this.offsetX - this.canvas.width / 2;
        const startY = y1 * this.zoom + this.offsetY;
        const endX = x2 * this.zoom + this.offsetX - this.canvas.width / 2;
        const endY = y2 * this.zoom + this.offsetY;

        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = this.colors.line;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    zoomIn() {
        this.zoom *= 1.2;
        this.draw();
    }

    zoomOut() {
        this.zoom /= 1.2;
        this.draw();
    }

    pan(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
        this.draw();
    }

    resetView() {
        this.zoom = 1;
        this.offsetX = this.canvas.width / 2;
        this.offsetY = 50;
        this.calculatePositions();
        this.draw();
    }

    updateStats() {
        document.getElementById('treeSize').textContent = this.tree.getSize();
        document.getElementById('treeHeight').textContent = this.tree.getHeight();
        document.getElementById('isBalanced').textContent = this.tree.isBalanced() ? 'Oui' : 'Non';
        document.getElementById('operationCount').textContent = this.tree.getOperationCount();
    }

    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('operationStatus');
        statusDiv.textContent = message;
        statusDiv.className = `status-${type}`;

        // Style dynamique selon le type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };

        statusDiv.style.borderLeftColor = colors[type] || colors.info;
    }
}

// Fonctions pour les exercices

function loadExercise1() {
    const visualizer = window.treeVisualizer;
    visualizer.tree.clear();

    // Insérer dans l'ordre optimal pour un arbre équilibré
    const values = [4, 2, 6, 1, 3, 5, 7]; // Ordre qui donne un arbre équilibré

    values.forEach(value => {
        visualizer.tree.insert(value);
    });

    visualizer.showStatus('Exercice 1 chargé : Arbre équilibré avec valeurs 1-7', 'success');
    visualizer.calculatePositions();
    visualizer.draw();
    visualizer.updateStats();

    const resultDiv = document.getElementById('exercise1Result');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 1</h4>
        <p>Arbre équilibré obtenu avec l'ordre d'insertion : ${values.join(' → ')}</p>
        <p>Hauteur : ${visualizer.tree.getHeight()}</p>
        <p>Équilibré : ${visualizer.tree.isBalanced() ? 'Oui ✓' : 'Non ✗'}</p>
    `;
}

function loadExercise2() {
    const visualizer = window.treeVisualizer;
    visualizer.tree.clear();

    // Insérer les valeurs demandées
    const values = [15, 10, 20, 8, 12, 16, 25];
    values.forEach(value => visualizer.tree.insert(value));

    visualizer.showStatus('Exercice 2 chargé : BST avec [15, 10, 20, 8, 12, 16, 25]', 'success');
    visualizer.calculatePositions();
    visualizer.draw();
    visualizer.updateStats();

    const inOrder = visualizer.tree.inOrder();
    const min = visualizer.tree.findMin().value;
    const max = visualizer.tree.findMax().value;
    const isBalanced = visualizer.tree.isBalanced();

    const resultDiv = document.getElementById('exercise2Result');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 2</h4>
        <p><strong>Parcours In-Order :</strong> [${inOrder.join(', ')}]</p>
        <p><strong>Valeur minimale :</strong> ${min}</p>
        <p><strong>Valeur maximale :</strong> ${max}</p>
        <p><strong>Arbre équilibré :</strong> ${isBalanced ? 'Oui ✓' : 'Non ✗'}</p>
    `;
}

function demonstrateDeletion() {
    const value = parseInt(document.getElementById('deleteValueInput').value);
    if (isNaN(value)) {
        alert('Veuillez saisir une valeur numérique');
        return;
    }

    const visualizer = window.treeVisualizer;
    const nodeToDelete = visualizer.tree.search(value);

    if (!nodeToDelete) {
        alert(`Valeur ${value} non trouvée dans l'arbre`);
        return;
    }

    // Analyser le type de suppression
    let deletionType = 'feuille';
    if (nodeToDelete.left && nodeToDelete.right) {
        deletionType = 'deux enfants';
    } else if (nodeToDelete.left || nodeToDelete.right) {
        deletionType = 'un enfant';
    }

    // Effectuer la suppression
    visualizer.tree.delete(value);
    visualizer.showStatus(`Suppression de ${value} (${deletionType})`, 'success');
    visualizer.calculatePositions();
    visualizer.draw();
    visualizer.updateStats();

    const resultDiv = document.getElementById('deletionDemo');
    resultDiv.innerHTML = `
        <h4>Démonstration de Suppression</h4>
        <p><strong>Valeur supprimée :</strong> ${value}</p>
        <p><strong>Type de suppression :</strong> ${deletionType}</p>
        <p><strong>État après suppression :</strong></p>
        <ul>
            <li>Taille : ${visualizer.tree.getSize()}</li>
            <li>Hauteur : ${visualizer.tree.getHeight()}</li>
            <li>Équilibré : ${visualizer.tree.isBalanced() ? 'Oui' : 'Non'}</li>
        </ul>
    `;

    document.getElementById('deleteValueInput').value = '';
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.treeVisualizer = new TreeVisualizer('treeCanvas');
});
