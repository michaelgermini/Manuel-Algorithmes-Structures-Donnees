// Visualiseur Interactif de la Récursion
// Implémentation complète avec pile d'exécution et arbre des appels

class RecursionFrame {
    constructor(functionName, params, lineNumber) {
        this.functionName = functionName;
        this.params = params;
        this.lineNumber = lineNumber;
        this.result = null;
        this.returned = false;
        this.id = Date.now() + Math.random(); // Identifiant unique
    }
}

class RecursionVisualizer {
    constructor() {
        this.callStack = [];
        this.executionTree = [];
        this.currentFrame = null;
        this.isExecuting = false;
        this.isPaused = false;
        this.stepMode = false;
        this.executionSpeed = 1000;
        this.maxDepth = 0;
        this.currentDepth = 0;
        this.result = null;

        this.initializeEventListeners();
        this.resetVisualization();
    }

    initializeEventListeners() {
        document.getElementById('loadFunctionBtn').addEventListener('click', () => this.loadFunction());
        document.getElementById('stepBtn').addEventListener('click', () => this.stepExecution());
        document.getElementById('playBtn').addEventListener('click', () => this.startExecution());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseExecution());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetVisualization());

        document.getElementById('functionSelect').addEventListener('change', () => {
            this.updateFunctionDisplay();
        });

        // Initialisation
        this.updateFunctionDisplay();
    }

    loadFunction() {
        const functionName = document.getElementById('functionSelect').value;
        this.updateFunctionDisplay();
        this.addLogEntry(`Fonction ${functionName} chargée`, 'initial');
    }

    updateFunctionDisplay() {
        const functionName = document.getElementById('functionSelect').value;
        const codeDisplay = document.getElementById('codeDisplay');

        const functions = {
            factorial: `function factorial(n) {
    // Cas de base
    if (n <= 1) {
        return 1;
    }
    // Cas récursif
    return n * factorial(n - 1);
}`,
            fibonacci: `function fibonacci(n) {
    // Cas de base
    if (n <= 1) {
        return n;
    }
    // Cas récursif
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
            binarySearch: `function binarySearch(arr, target, left = 0, right = arr.length - 1) {
    // Cas de base
    if (left > right) {
        return -1;
    }

    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] > target) {
        return binarySearch(arr, target, left, mid - 1);
    } else {
        return binarySearch(arr, target, mid + 1, right);
    }
}`,
            towerOfHanoi: `function towerOfHanoi(n, source, target, auxiliary) {
    // Cas de base
    if (n === 1) {
        return [\`Déplacer disque 1 de \${source} vers \${target}\`];
    }

    // Cas récursif
    const moves = [];

    // Déplacer n-1 disques du source vers auxiliary
    moves.push(...towerOfHanoi(n-1, source, auxiliary, target));

    // Déplacer le plus grand disque du source vers target
    moves.push(\`Déplacer disque \${n} de \${source} vers \${target}\`);

    // Déplacer n-1 disques de auxiliary vers target
    moves.push(...towerOfHanoi(n-1, auxiliary, target, source));

    return moves;
}`,
            mergeSort: `function mergeSort(arr) {
    // Cas de base
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}`,
            quickSort: `function quickSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return arr;

    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);

    return arr;
}`
        };

        codeDisplay.innerHTML = `<pre><code>${functions[functionName]}</code></pre>`;
        this.currentFunction = functionName;
    }

    async startExecution() {
        if (this.isExecuting) return;

        const input = parseInt(document.getElementById('inputValue').value);
        if (isNaN(input) || input < 0) {
            this.showError('Veuillez saisir un nombre positif');
            return;
        }

        this.resetVisualization();
        this.isExecuting = true;
        this.stepMode = false;

        document.getElementById('playBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('stepBtn').disabled = true;

        this.updateExecutionState('Exécution en cours...');

        try {
            await this.executeFunction(this.currentFunction, input);
            this.updateExecutionState('Exécution terminée');
            this.updateResult(this.result);
        } catch (error) {
            this.updateExecutionState('Erreur: ' + error.message);
        }

        this.isExecuting = false;
        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('stepBtn').disabled = false;
    }

    async stepExecution() {
        if (this.isExecuting) return;

        const input = parseInt(document.getElementById('inputValue').value);
        if (isNaN(input) || input < 0) {
            this.showError('Veuillez saisir un nombre positif');
            return;
        }

        if (!this.stepMode) {
            this.resetVisualization();
            this.stepMode = true;
            this.updateExecutionState('Mode pas à pas - Appuyez sur "Pas à pas" pour continuer');
        }

        try {
            const hasMoreSteps = await this.executeNextStep(this.currentFunction, input);
            if (!hasMoreSteps) {
                this.stepMode = false;
                this.updateExecutionState('Exécution terminée');
                this.updateResult(this.result);
            }
        } catch (error) {
            this.updateExecutionState('Erreur: ' + error.message);
            this.stepMode = false;
        }
    }

    pauseExecution() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');

        if (this.isPaused) {
            pauseBtn.textContent = '▶️ Reprendre';
            this.updateExecutionState('Exécution en pause');
        } else {
            pauseBtn.textContent = '⏸️ Pause';
            this.updateExecutionState('Exécution reprise');
        }
    }

    resetVisualization() {
        this.callStack = [];
        this.executionTree = [];
        this.currentFrame = null;
        this.isExecuting = false;
        this.isPaused = false;
        this.stepMode = false;
        this.maxDepth = 0;
        this.currentDepth = 0;
        this.result = null;

        this.updateDisplay();
        this.updateStats();
        this.updateExecutionState('Prêt');
        this.updateResult('-');

        document.getElementById('playBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('stepBtn').disabled = false;

        this.clearLogs();
        this.addLogEntry('Visualisation réinitialisée', 'initial');
    }

    async executeFunction(functionName, input) {
        this.result = null;

        switch (functionName) {
            case 'factorial':
                this.result = await this.factorial(input);
                break;
            case 'fibonacci':
                this.result = await this.fibonacci(input);
                break;
            case 'binarySearch':
                const arr = Array.from({length: input * 2 + 1}, (_, i) => i);
                this.result = await this.binarySearch(arr, input);
                break;
            case 'towerOfHanoi':
                this.result = await this.towerOfHanoi(input, 'A', 'C', 'B');
                break;
            case 'mergeSort':
                const unsorted = Array.from({length: Math.min(input, 8)}, () => Math.floor(Math.random() * 100));
                this.result = await this.mergeSort(unsorted);
                break;
            case 'quickSort':
                const unsortedQS = Array.from({length: Math.min(input, 8)}, () => Math.floor(Math.random() * 100));
                this.result = await this.quickSort([...unsortedQS]);
                break;
        }
    }

    async executeNextStep(functionName, input) {
        // Implémentation simplifiée pour le mode pas à pas
        // Dans une vraie implémentation, cela serait plus complexe
        await this.executeFunction(functionName, input);
        return false;
    }

    // Fonctions récursives instrumentées
    async factorial(n) {
        await this.pushFrame('factorial', { n }, 1);

        if (n <= 1) {
            await this.markBaseCase();
            await this.popFrame(1);
            return 1;
        }

        const recursiveResult = await this.factorial(n - 1);
        const result = n * recursiveResult;

        await this.popFrame(result);
        return result;
    }

    async fibonacci(n) {
        await this.pushFrame('fibonacci', { n }, 1);

        if (n <= 1) {
            await this.markBaseCase();
            await this.popFrame(n);
            return n;
        }

        const fib1 = await this.fibonacci(n - 1);
        const fib2 = await this.fibonacci(n - 2);
        const result = fib1 + fib2;

        await this.popFrame(result);
        return result;
    }

    async binarySearch(arr, target, left = 0, right = arr.length - 1) {
        await this.pushFrame('binarySearch', { arr, target, left, right }, 1);

        if (left > right) {
            await this.markBaseCase();
            await this.popFrame(-1);
            return -1;
        }

        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            await this.markBaseCase();
            await this.popFrame(mid);
            return mid;
        } else if (arr[mid] > target) {
            const result = await this.binarySearch(arr, target, left, mid - 1);
            await this.popFrame(result);
            return result;
        } else {
            const result = await this.binarySearch(arr, target, mid + 1, right);
            await this.popFrame(result);
            return result;
        }
    }

    async towerOfHanoi(n, source, target, auxiliary) {
        await this.pushFrame('towerOfHanoi', { n, source, target, auxiliary }, 1);

        if (n === 1) {
            await this.markBaseCase();
            await this.popFrame([`Déplacer disque 1 de ${source} vers ${target}`]);
            return [`Déplacer disque 1 de ${source} vers ${target}`];
        }

        const moves1 = await this.towerOfHanoi(n-1, source, auxiliary, target);
        const move = `Déplacer disque ${n} de ${source} vers ${target}`;
        const moves2 = await this.towerOfHanoi(n-1, auxiliary, target, source);

        const allMoves = [...moves1, move, ...moves2];
        await this.popFrame(allMoves);
        return allMoves;
    }

    async mergeSort(arr) {
        await this.pushFrame('mergeSort', { arr: [...arr] }, 1);

        if (arr.length <= 1) {
            await this.markBaseCase();
            await this.popFrame([...arr]);
            return [...arr];
        }

        const mid = Math.floor(arr.length / 2);
        const left = await this.mergeSort(arr.slice(0, mid));
        const right = await this.mergeSort(arr.slice(mid));

        const result = this.merge(left, right);
        await this.popFrame(result);
        return result;
    }

    merge(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        return [...result, ...left.slice(i), ...right.slice(j)];
    }

    async quickSort(arr, left = 0, right = arr.length - 1) {
        await this.pushFrame('quickSort', { arr: [...arr], left, right }, 1);

        if (left >= right) {
            await this.markBaseCase();
            await this.popFrame([...arr]);
            return [...arr];
        }

        const pivotIndex = this.partition(arr, left, right);
        await this.quickSort(arr, left, pivotIndex - 1);
        await this.quickSort(arr, pivotIndex + 1, right);

        await this.popFrame([...arr]);
        return [...arr];
    }

    partition(arr, left, right) {
        const pivot = arr[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        return i + 1;
    }

    async pushFrame(functionName, params, lineNumber) {
        const frame = new RecursionFrame(functionName, params, lineNumber);
        this.callStack.push(frame);
        this.currentDepth = this.callStack.length;
        this.maxDepth = Math.max(this.maxDepth, this.currentDepth);

        this.updateDisplay();
        this.updateStats();
        this.highlightLine(lineNumber);
        this.addLogEntry(`APPEL: ${functionName}(${JSON.stringify(params)})`, 'call');

        await this.delay();
    }

    async popFrame(result) {
        if (this.callStack.length > 0) {
            const frame = this.callStack[this.callStack.length - 1];
            frame.result = result;
            frame.returned = true;

            this.addLogEntry(`RETOUR: ${frame.functionName} → ${JSON.stringify(result)}`, 'return');

            await this.delay();
        }
    }

    async markBaseCase() {
        this.addLogEntry('CAS DE BASE atteint', 'base');
        await this.delay();
    }

    updateDisplay() {
        this.updateCallStack();
        this.updateRecursionTree();
    }

    updateCallStack() {
        const stackContainer = document.getElementById('callStack');
        stackContainer.innerHTML = '';

        if (this.callStack.length === 0) {
            stackContainer.innerHTML = '<div class="empty-stack">Pile vide - Aucun appel en cours</div>';
            return;
        }

        // Afficher la pile (du sommet vers le bas)
        for (let i = this.callStack.length - 1; i >= 0; i--) {
            const frame = this.callStack[i];
            const frameElement = document.createElement('div');
            frameElement.className = `stack-frame ${i === this.callStack.length - 1 ? 'active' : ''}`;

            frameElement.innerHTML = `
                <div class="frame-info">
                    <div class="frame-function">${frame.functionName}</div>
                    <div class="frame-params">${this.formatParams(frame.params)}</div>
                    ${frame.returned ? `<div class="frame-result">→ ${this.formatResult(frame.result)}</div>` : ''}
                </div>
            `;

            stackContainer.appendChild(frameElement);
        }
    }

    updateRecursionTree() {
        const treeContainer = document.getElementById('recursionTree');
        treeContainer.innerHTML = '';

        if (this.executionTree.length === 0 && this.callStack.length === 0) {
            treeContainer.innerHTML = '<div class="empty-tree">Arbre vide - Lancez une exécution</div>';
            return;
        }

        // Pour simplifier, on affiche juste les nœuds actifs
        this.callStack.forEach((frame, index) => {
            const nodeElement = document.createElement('div');
            nodeElement.className = `tree-node ${index === this.callStack.length - 1 ? 'active' : ''}`;
            nodeElement.textContent = `${frame.functionName}(${this.formatParams(frame.params)})`;
            treeContainer.appendChild(nodeElement);
        });
    }

    updateStats() {
        document.getElementById('recursionDepth').textContent = this.currentDepth;
        document.getElementById('maxDepth').textContent = this.maxDepth;
    }

    updateExecutionState(state) {
        document.getElementById('executionState').textContent = state;
    }

    updateResult(result) {
        document.getElementById('result').textContent = this.formatResult(result);
    }

    highlightLine(lineNumber) {
        const codeLines = document.querySelectorAll('.code-line');
        codeLines.forEach(line => line.classList.remove('active'));

        if (codeLines[lineNumber - 1]) {
            codeLines[lineNumber - 1].classList.add('active');
        }

        document.getElementById('lineNumber').textContent = lineNumber;
    }

    formatParams(params) {
        if (!params) return '';

        const entries = Object.entries(params);
        if (entries.length === 0) return '';

        return entries.map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key}:[${value.slice(0, 5).join(',')}${value.length > 5 ? '...' : ''}]`;
            }
            return `${key}:${value}`;
        }).join(', ');
    }

    formatResult(result) {
        if (result === null || result === undefined) return 'null';
        if (Array.isArray(result)) {
            return `[${result.slice(0, 10).join(', ')}${result.length > 10 ? '...' : ''}]`;
        }
        return result.toString();
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

    clearLogs() {
        document.getElementById('operationsLog').innerHTML = '<p class="log-entry initial">Prêt pour l\'exécution...</p>';
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

    delay() {
        return new Promise(resolve => {
            const checkPause = () => {
                if (this.isPaused) {
                    setTimeout(checkPause, 100);
                } else {
                    setTimeout(resolve, this.stepMode ? 1000 : this.executionSpeed);
                }
            };
            checkPause();
        });
    }
}

// Fonctions pour les exercices

function loadFactorialExercise() {
    document.getElementById('functionSelect').value = 'factorial';
    document.getElementById('inputValue').value = '5';
    document.getElementById('loadFunctionBtn').click();

    const resultDiv = document.getElementById('factorialResult');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 1</h4>
        <p><strong>Objectif :</strong> Observer factorielle(5) = 5 × 4 × 3 × 2 × 1 = 120</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Étapes d'exécution :</h5>
            <ol>
                <li><code>factorial(5)</code> → appelle <code>factorial(4)</code></li>
                <li><code>factorial(4)</code> → appelle <code>factorial(3)</code></li>
                <li><code>factorial(3)</code> → appelle <code>factorial(2)</code></li>
                <li><code>factorial(2)</code> → appelle <code>factorial(1)</code></li>
                <li><code>factorial(1)</code> → retourne 1 (cas de base)</li>
                <li><code>factorial(2)</code> → retourne 2 × 1 = 2</li>
                <li><code>factorial(3)</code> → retourne 3 × 2 = 6</li>
                <li><code>factorial(4)</code> → retourne 4 × 6 = 24</li>
                <li><code>factorial(5)</code> → retourne 5 × 24 = 120</li>
            </ol>
        </div>
        <p><strong>Observation :</strong> La pile atteint une profondeur de 5, puis se vide en cascade.</p>
    `;
}

function loadFibonacciExercise() {
    document.getElementById('functionSelect').value = 'fibonacci';
    document.getElementById('inputValue').value = '6';
    document.getElementById('loadFunctionBtn').click();

    const resultDiv = document.getElementById('fibonacciResult');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 2</h4>
        <p><strong>Objectif :</strong> Observer fibonacci(6) et compter les appels récursifs</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Problème de l'approche naïve :</h5>
            <ul>
                <li><code>fibonacci(6)</code> appelle <code>fibonacci(5)</code> et <code>fibonacci(4)</code></li>
                <li><code>fibonacci(5)</code> appelle <code>fibonacci(4)</code> et <code>fibonacci(3)</code></li>
                <li>Beaucoup de calculs redondants !</li>
            </ul>
        </div>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Solution : Mémoïsation</h5>
            <pre><code>function fibonacci(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;

    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo);
    return memo[n];
}</code></pre>
        </div>
        <p><strong>Complexité :</strong> O(2^n) naïve vs O(n) avec mémoïsation</p>
    `;
}

function loadBinarySearchExercise() {
    document.getElementById('functionSelect').value = 'binarySearch';
    document.getElementById('inputValue').value = '7';
    document.getElementById('loadFunctionBtn').click();

    const resultDiv = document.getElementById('binarySearchResult');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 3</h4>
        <p><strong>Objectif :</strong> Rechercher 7 dans [1,3,5,7,9,11,13,15]</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Stratégie "Diviser pour Régner" :</h5>
            <ol>
                <li>Milieu de [1,3,5,7,9,11,13,15] = position 3, valeur 7 ✅</li>
                <li><strong>Trouvé !</strong> Retourne l'index 3</li>
            </ol>
        </div>
        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Comparaison avec recherche linéaire :</h5>
            <ul>
                <li><strong>Linéaire :</strong> Vérifie chaque élément → O(n)</li>
                <li><strong>Binaire :</strong> Divise l'espace en 2 → O(log n)</li>
                <li><strong>Pour n=1000 :</strong> 1000 vs 10 comparaisons !</li>
            </ul>
        </div>
        <p><strong>Condition :</strong> Le tableau doit être trié</p>
    `;
}

function loadHanoiExercise() {
    document.getElementById('functionSelect').value = 'towerOfHanoi';
    document.getElementById('inputValue').value = '3';
    document.getElementById('loadFunctionBtn').click();

    const resultDiv = document.getElementById('hanoiResult');
    resultDiv.innerHTML = `
        <h4>Résultat de l'Exercice 4</h4>
        <p><strong>Objectif :</strong> Résoudre la Tour de Hanoï avec 3 disques</p>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Solution récursive optimale :</h5>
            <ol>
                <li>Déplacer 2 disques du dessus vers B (récursion)</li>
                <li>Déplacer le plus gros disque vers C</li>
                <li>Déplacer 2 disques de B vers C (récursion)</li>
            </ol>
        </div>
        <div style="background: #cce5ff; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h5>Séquence complète pour 3 disques :</h5>
            <ol>
                <li>Déplacer disque 1 de A vers C</li>
                <li>Déplacer disque 2 de A vers B</li>
                <li>Déplacer disque 1 de C vers B</li>
                <li>Déplacer disque 3 de A vers C</li>
                <li>Déplacer disque 1 de B vers A</li>
                <li>Déplacer disque 2 de B vers C</li>
                <li>Déplacer disque 1 de A vers C</li>
            </ol>
        </div>
        <p><strong>Formule :</strong> 2^n - 1 mouvements pour n disques</p>
        <p><strong>Pour n=3 :</strong> 2³ - 1 = 7 mouvements ✅</p>
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
`;
document.head.appendChild(style);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.recursionVisualizer = new RecursionVisualizer();
});
