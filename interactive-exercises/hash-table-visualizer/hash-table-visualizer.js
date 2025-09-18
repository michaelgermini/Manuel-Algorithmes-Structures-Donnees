// Visualiseur Interactif des Tables de Hachage
// Implémentation complète avec animations et démonstration des collisions

class HashTableVisualizer {
    constructor() {
        this.tableSize = 11;
        this.hashFunction = 'djb2';
        this.table = new Array(this.tableSize).fill(null).map(() => []);
        this.operationCount = 0;
        this.collisionCount = 0;

        this.initializeEventListeners();
        this.createTable();
        this.updateStats();
        this.addLogEntry('Table de hachage initialisée', 'initial');
    }

    initializeEventListeners() {
        // Configuration
        document.getElementById('tableSize').addEventListener('change', (e) => {
            this.changeTableSize(parseInt(e.target.value));
        });

        document.getElementById('hashFunction').addEventListener('change', (e) => {
            this.hashFunction = e.target.value;
            this.addLogEntry(`Fonction de hachage changée: ${this.hashFunction}`, 'initial');
        });

        // Opérations
        document.getElementById('insertBtn').addEventListener('click', () => this.handleInsert());
        document.getElementById('searchBtn').addEventListener('click', () => this.handleSearch());
        document.getElementById('deleteBtn').addEventListener('click', () => this.handleDelete());
        document.getElementById('resetTableBtn').addEventListener('click', () => this.handleReset());
        document.getElementById('loadDemoBtn').addEventListener('click', () => this.loadDemo());

        // Gestion des entrées
        document.getElementById('keyInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsert();
            }
        });

        document.getElementById('valueInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsert();
            }
        });
    }

    // Fonctions de hachage
    hashSimple(key) {
        let total = 0;
        for (let char of key) {
            total += char.charCodeAt(0);
        }
        return total % this.tableSize;
    }

    hashDJB2(key) {
        let hash = 5381;
        for (let char of key) {
            hash = ((hash << 5) + hash) + char.charCodeAt(0);
        }
        return Math.abs(hash) % this.tableSize;
    }

    hashSDBM(key) {
        let hash = 0;
        for (let char of key) {
            hash = char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
        }
        return Math.abs(hash) % this.tableSize;
    }

    computeHash(key) {
        switch (this.hashFunction) {
            case 'simple': return this.hashSimple(key);
            case 'djb2': return this.hashDJB2(key);
            case 'sdbm': return this.hashSDBM(key);
            default: return this.hashDJB2(key);
        }
    }

    changeTableSize(newSize) {
        // Sauvegarder les données actuelles
        const currentData = [];
        for (let bucket of this.table) {
            currentData.push(...bucket);
        }

        // Recréer la table
        this.tableSize = newSize;
        this.table = new Array(this.tableSize).fill(null).map(() => []);
        this.collisionCount = 0;

        // Réinsérer les données
        for (let entry of currentData) {
            this.insert(entry.key, entry.value, false); // false = pas d'animation
        }

        this.createTable();
        this.updateStats();
        this.addLogEntry(`Taille de table changée: ${newSize}`, 'initial');
    }

    insert(key, value, animate = true) {
        this.operationCount++;
        const hash = this.computeHash(key);
        const bucket = this.table[hash];

        // Vérifier si la clé existe déjà
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                bucket[i].value = value; // Mise à jour
                if (animate) this.animateInsert(hash, { key, value }, false);
                return true;
            }
        }

        // Nouvelle entrée
        const entry = { key, value };
        bucket.push(entry);

        // Compter les collisions (plus d'une entrée dans le bucket)
        if (bucket.length > 1) {
            this.collisionCount++;
        }

        if (animate) this.animateInsert(hash, entry, bucket.length > 1);
        return true;
    }

    search(key, animate = true) {
        this.operationCount++;
        const hash = this.computeHash(key);
        const bucket = this.table[hash];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                if (animate) this.animateSearch(hash, i);
                return bucket[i].value;
            }
        }

        return null;
    }

    delete(key, animate = true) {
        this.operationCount++;
        const hash = this.computeHash(key);
        const bucket = this.table[hash];

        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i].key === key) {
                const deletedValue = bucket[i].value;
                bucket.splice(i, 1);

                // Recalculer les collisions pour ce bucket
                this.recalculateCollisions();

                if (animate) this.animateDelete(hash, i);
                return deletedValue;
            }
        }

        return null;
    }

    recalculateCollisions() {
        this.collisionCount = 0;
        for (let bucket of this.table) {
            if (bucket.length > 1) {
                this.collisionCount += bucket.length - 1;
            }
        }
    }

    handleInsert() {
        const key = document.getElementById('keyInput').value.trim();
        const value = document.getElementById('valueInput').value.trim();

        if (!key || !value) {
            this.showError('Veuillez saisir une clé et une valeur');
            return;
        }

        const success = this.insert(key, value);
        if (success) {
            this.updateDisplay();
            this.updateStats();
            this.showHashDetails(key, value);
            this.addLogEntry(`INSERT "${key}" → "${value}" (hash: ${this.computeHash(key)})`, 'insert');
        }

        document.getElementById('keyInput').value = '';
        document.getElementById('valueInput').value = '';
        document.getElementById('keyInput').focus();
    }

    handleSearch() {
        const key = document.getElementById('keyInput').value.trim();

        if (!key) {
            this.showError('Veuillez saisir une clé à rechercher');
            return;
        }

        const result = this.search(key);
        this.showHashDetails(key, result);

        if (result !== null) {
            this.addLogEntry(`SEARCH "${key}" → trouvé "${result}"`, 'search');
        } else {
            this.addLogEntry(`SEARCH "${key}" → non trouvé`, 'search');
            this.showError(`Clé "${key}" non trouvée`);
        }
    }

    handleDelete() {
        const key = document.getElementById('keyInput').value.trim();

        if (!key) {
            this.showError('Veuillez saisir une clé à supprimer');
            return;
        }

        const deletedValue = this.delete(key);

        if (deletedValue !== null) {
            this.updateDisplay();
            this.updateStats();
            this.addLogEntry(`DELETE "${key}" → supprimé "${deletedValue}"`, 'delete');
        } else {
            this.addLogEntry(`DELETE "${key}" → non trouvé`, 'delete');
            this.showError(`Clé "${key}" non trouvée`);
        }

        document.getElementById('keyInput').value = '';
    }

    handleReset() {
        this.table = new Array(this.tableSize).fill(null).map(() => []);
        this.operationCount = 0;
        this.collisionCount = 0;

        this.createTable();
        this.updateStats();
        this.showOperation('Table réinitialisée');
        this.addLogEntry('RESET → table vidée', 'initial');
    }

    loadDemo() {
        const demoData = [
            { key: 'pomme', value: 'fruit rouge' },
            { key: 'banane', value: 'fruit jaune' },
            { key: 'orange', value: 'fruit orange' },
            { key: 'raisin', value: 'fruit violet' },
            { key: 'fraise', value: 'petit fruit rouge' },
            { key: 'kiwi', value: 'fruit exotique' },
            { key: 'ananas', value: 'fruit tropical' }
        ];

        this.handleReset();

        // Insérer les données avec un délai pour l'animation
        let index = 0;
        const insertNext = () => {
            if (index < demoData.length) {
                const { key, value } = demoData[index];
                document.getElementById('keyInput').value = key;
                document.getElementById('valueInput').value = value;
                this.handleInsert();
                index++;
                setTimeout(insertNext, 500);
            }
        };

        insertNext();
    }

    createTable() {
        const tableContainer = document.getElementById('hashTable');
        tableContainer.innerHTML = '';

        for (let i = 0; i < this.tableSize; i++) {
            const bucket = document.createElement('div');
            bucket.className = 'hash-bucket';
            bucket.innerHTML = `
                <div class="bucket-index">${i}</div>
                <div class="bucket-content" id="bucket-${i}">
                    <!-- Les entrées seront ajoutées ici -->
                </div>
            `;
            tableContainer.appendChild(bucket);
        }
    }

    updateDisplay() {
        for (let i = 0; i < this.tableSize; i++) {
            const bucketContent = document.getElementById(`bucket-${i}`);
            bucketContent.innerHTML = '';

            const bucket = this.table[i];
            if (bucket.length > 0) {
                bucket.forEach(entry => {
                    const entryElement = document.createElement('div');
                    entryElement.className = 'hash-entry';
                    entryElement.innerHTML = `
                        <span class="entry-key">${entry.key}</span>
                        <span class="entry-value">${entry.value}</span>
                    `;
                    bucketContent.appendChild(entryElement);
                });

                // Indicateur de collision
                if (bucket.length > 1) {
                    const collisionIndicator = document.createElement('div');
                    collisionIndicator.className = 'collision-indicator';
                    collisionIndicator.textContent = bucket.length;
                    bucketContent.appendChild(collisionIndicator);
                }
            }
        }
    }

    animateInsert(hashIndex, entry, isCollision) {
        setTimeout(() => {
            this.updateDisplay();

            const bucketContent = document.getElementById(`bucket-${hashIndex}`);
            const entries = bucketContent.querySelectorAll('.hash-entry');

            if (entries.length > 0) {
                const lastEntry = entries[entries.length - 1];
                lastEntry.classList.add('inserting');

                if (isCollision) {
                    lastEntry.classList.add('colliding');
                    this.addLogEntry(`COLLISION détectée à l'index ${hashIndex}`, 'collision');
                }

                setTimeout(() => {
                    lastEntry.classList.remove('inserting', 'colliding');
                }, 1000);
            }
        }, 100);
    }

    animateSearch(hashIndex, entryIndex) {
        const bucketContent = document.getElementById(`bucket-${hashIndex}`);
        const entries = bucketContent.querySelectorAll('.hash-entry');

        if (entries[entryIndex]) {
            entries[entryIndex].classList.add('searching');

            setTimeout(() => {
                entries[entryIndex].classList.remove('searching');
                entries[entryIndex].classList.add('found');

                setTimeout(() => {
                    entries[entryIndex].classList.remove('found');
                }, 1000);
            }, 1000);
        }
    }

    animateDelete(hashIndex, entryIndex) {
        const bucketContent = document.getElementById(`bucket-${hashIndex}`);
        const entries = bucketContent.querySelectorAll('.hash-entry');

        if (entries[entryIndex]) {
            entries[entryIndex].style.animation = 'fadeOut 0.5s ease-out';

            setTimeout(() => {
                this.updateDisplay();
            }, 500);
        }
    }

    showOperation(message) {
        document.getElementById('operationDisplay').innerHTML = `<p>${message}</p>`;
    }

    showHashDetails(key, value) {
        const hash = this.computeHash(key);
        const detailsDiv = document.getElementById('hashDetails');

        let calculation = '';
        switch (this.hashFunction) {
            case 'simple':
                calculation = `Somme des codes ASCII: ${[...key].map(c => c.charCodeAt(0)).join(' + ')} = ${[...key].reduce((sum, c) => sum + c.charCodeAt(0), 0)}`;
                break;
            case 'djb2':
                calculation = `Algorithme DJB2: hash = 5381, puis hash = ((hash << 5) + hash) + code pour chaque caractère`;
                break;
            case 'sdbm':
                calculation = `Algorithme SDBM: hash = code + (hash << 6) + (hash << 16) - hash pour chaque caractère`;
                break;
        }

        detailsDiv.innerHTML = `
            <p><strong>Clé :</strong> "${key}"</p>
            <p><strong>Valeur :</strong> "${value || 'non trouvée'}"</p>
            <p><strong>Hash calculé :</strong> ${hash}</p>
            <div class="hash-calculation">${calculation}</div>
            <p><strong>Index dans la table :</strong> ${hash} % ${this.tableSize} = ${hash}</p>
        `;
    }

    updateStats() {
        const elementCount = this.table.reduce((sum, bucket) => sum + bucket.length, 0);
        const loadFactor = ((elementCount / this.tableSize) * 100).toFixed(1);

        document.getElementById('elementCount').textContent = elementCount;
        document.getElementById('collisionCount').textContent = this.collisionCount;
        document.getElementById('loadFactor').textContent = `${loadFactor}%`;
        document.getElementById('operationCount').textContent = this.operationCount;
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

function runCollisionAnalysis() {
    const visualizer = window.hashVisualizer;
    visualizer.handleReset();

    const testKeys = ['chat', 'chien', 'oiseau', 'poisson', 'lapin', 'hamster', 'perroquet', 'canari', 'serpent'];

    const results = {};

    // Tester chaque fonction de hachage
    const hashFunctions = ['simple', 'djb2', 'sdbm'];

    hashFunctions.forEach(funcName => {
        visualizer.hashFunction = funcName;
        visualizer.collisionCount = 0;

        // Simuler les insertions
        testKeys.forEach(key => {
            const hash = visualizer.computeHash(key);
            if (!visualizer.table[hash]) visualizer.table[hash] = [];
            visualizer.table[hash].push({ key, value: 'test' });

            if (visualizer.table[hash].length > 1) {
                visualizer.collisionCount++;
            }
        });

        results[funcName] = {
            collisions: visualizer.collisionCount,
            distribution: visualizer.table.map(bucket => bucket.length)
        };

        // Réinitialiser pour le prochain test
        visualizer.table = new Array(visualizer.tableSize).fill(null).map(() => []);
    });

    // Restaurer la fonction par défaut
    visualizer.hashFunction = 'djb2';

    const resultDiv = document.getElementById('collisionResult');
    resultDiv.innerHTML = `
        <h4>Analyse des Collisions</h4>
        <p><strong>Clés testées :</strong> ${testKeys.join(', ')}</p>
        <p><strong>Taille de table :</strong> ${visualizer.tableSize}</p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: #ffe6e6; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #dc3545;">Simple (somme)</h5>
                <p style="font-size: 1.5em; font-weight: bold;">${results.simple.collisions} collisions</p>
                <p>Distribution: [${results.simple.distribution.join(', ')}]</p>
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #28a745;">DJB2</h5>
                <p style="font-size: 1.5em; font-weight: bold;">${results.djb2.collisions} collisions</p>
                <p>Distribution: [${results.djb2.distribution.join(', ')}]</p>
            </div>

            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #1976d2;">SDBM</h5>
                <p style="font-size: 1.5em; font-weight: bold;">${results.sdbm.collisions} collisions</p>
                <p>Distribution: [${results.sdbm.distribution.join(', ')}]</p>
            </div>
        </div>

        <p><strong>Conclusion :</strong> ${results.simple.collisions > results.djb2.collisions ?
            'Les fonctions de hachage plus sophistiquées réduisent les collisions !' :
            'Les collisions dépendent des données et de la fonction utilisée.'}</p>
    `;
}

function demonstrateSizeImpact() {
    const visualizer = window.hashVisualizer;
    const originalSize = visualizer.tableSize;
    const testData = [
        { key: 'alpha', value: 'première' },
        { key: 'beta', value: 'seconde' },
        { key: 'gamma', value: 'troisième' },
        { key: 'delta', value: 'quatrième' },
        { key: 'epsilon', value: 'cinquième' }
    ];

    const sizes = [5, 11, 23];
    const results = {};

    sizes.forEach(size => {
        visualizer.tableSize = size;
        visualizer.table = new Array(size).fill(null).map(() => []);
        visualizer.collisionCount = 0;

        testData.forEach(item => {
            visualizer.insert(item.key, item.value, false);
        });

        results[size] = {
            collisions: visualizer.collisionCount,
            loadFactor: ((testData.length / size) * 100).toFixed(1)
        };
    });

    // Restaurer la taille originale
    visualizer.tableSize = originalSize;
    visualizer.handleReset();

    const resultDiv = document.getElementById('sizeResult');
    resultDiv.innerHTML = `
        <h4>Impact de la Taille de Table</h4>
        <p><strong>Données testées :</strong> 5 éléments</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f8f9fa;">
                <th style="border: 1px solid #ddd; padding: 12px;">Taille</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Collisions</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Remplissage</th>
                <th style="border: 1px solid #ddd; padding: 12px;">Évaluation</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">5</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[5].collisions}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[5].loadFactor}%</td>
                <td style="border: 1px solid #ddd; padding: 12px; color: #dc3545;">Trop petite ❗</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">11</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[11].collisions}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[11].loadFactor}%</td>
                <td style="border: 1px solid #ddd; padding: 12px; color: #ffc107;">Correcte ⚠️</td>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">23</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[23].collisions}</td>
                <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${results[23].loadFactor}%</td>
                <td style="border: 1px solid #ddd; padding: 12px; color: #28a745;">Optimale ✅</td>
            </tr>
        </table>

        <p><strong>Règle générale :</strong></p>
        <ul>
            <li><strong>Trop petite :</strong> Beaucoup de collisions, performances dégradées</li>
            <li><strong>Trop grande :</strong> Gaspillage mémoire, temps d'accès plus long</li>
            <li><strong>Optimale :</strong> ~50-75% de remplissage, minimum de collisions</li>
        </ul>
    `;
}

function runPerformanceTest() {
    const visualizer = window.hashVisualizer;
    const testSizes = [25, 50, 75]; // Pourcentages de remplissage
    const operations = 100;
    const results = {};

    testSizes.forEach(fillPercent => {
        const targetElements = Math.floor((visualizer.tableSize * fillPercent) / 100);
        visualizer.handleReset();

        // Remplir la table au pourcentage souhaité
        for (let i = 0; i < targetElements; i++) {
            visualizer.insert(`key${i}`, `value${i}`, false);
        }

        // Mesurer les performances
        const startTime = performance.now();

        for (let i = 0; i < operations; i++) {
            const key = `key${Math.floor(Math.random() * targetElements)}`;
            visualizer.search(key, false);
        }

        const endTime = performance.now();
        const avgTime = ((endTime - startTime) / operations).toFixed(3);

        results[fillPercent] = {
            elements: targetElements,
            avgTime: avgTime,
            collisions: visualizer.collisionCount
        };
    });

    visualizer.handleReset();

    const resultDiv = document.getElementById('performanceResult');
    resultDiv.innerHTML = `
        <h4>Test de Performance</h4>
        <p><strong>Opérations testées :</strong> ${operations} recherches</p>
        <p><strong>Taille de table :</strong> ${visualizer.tableSize}</p>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0;">
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #28a745;">25% remplie</h5>
                <p><strong>${results[25].elements} éléments</strong></p>
                <p>Temps moyen: ${results[25].avgTime}ms</p>
                <p>Collisions: ${results[25].collisions}</p>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #856404;">50% remplie</h5>
                <p><strong>${results[50].elements} éléments</strong></p>
                <p>Temps moyen: ${results[50].avgTime}ms</p>
                <p>Collisions: ${results[50].collisions}</p>
            </div>

            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; text-align: center;">
                <h5 style="color: #721c24;">75% remplie</h5>
                <p><strong>${results[75].elements} éléments</strong></p>
                <p>Temps moyen: ${results[75].avgTime}ms</p>
                <p>Collisions: ${results[75].collisions}</p>
            </div>
        </div>

        <p><strong>Observation :</strong> ${results[25].avgTime < results[75].avgTime ?
            'Les performances se dégradent avec le remplissage !' :
            'Impact variable selon la distribution des clés.'}</p>

        <p><strong>Recommandation :</strong> Redimensionner la table quand le taux de remplissage dépasse 75%.</p>
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

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.hashVisualizer = new HashTableVisualizer();
});

