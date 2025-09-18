// Visualiseur Interactif des Piles (Stacks)
// Implémentation complète avec animations et démonstrations

class Stack {
    constructor() {
        this.items = [];
        this.operationCount = 0;
    }

    push(element) {
        this.items.push(element);
        this.operationCount++;
        return this.items.length;
    }

    pop() {
        if (this.isEmpty()) return null;
        this.operationCount++;
        return this.items.pop();
    }

    peek() {
        if (this.isEmpty()) return null;
        this.operationCount++;
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    size() {
        return this.items.length;
    }

    clear() {
        this.items = [];
        this.operationCount++;
        return true;
    }

    toArray() {
        return [...this.items];
    }

    getOperationCount() {
        return this.operationCount;
    }
}

class StackVisualizer {
    constructor() {
        this.stack = new Stack();
        this.initializeEventListeners();
        this.updateDisplay();
        this.addLogEntry('Bienvenue ! La pile est vide.', 'initial');
    }

    initializeEventListeners() {
        // Boutons principaux
        document.getElementById('pushBtn').addEventListener('click', () => this.handlePush());
        document.getElementById('popBtn').addEventListener('click', () => this.handlePop());
        document.getElementById('peekBtn').addEventListener('click', () => this.handlePeek());
        document.getElementById('clearBtn').addEventListener('click', () => this.handleClear());

        // Gestionnaire pour la touche Entrée dans le champ push
        document.getElementById('pushInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handlePush();
            }
        });

        // Focus automatique sur le champ input
        document.getElementById('pushInput').focus();
    }

    handlePush() {
        const input = document.getElementById('pushInput');
        const value = input.value.trim();

        if (!value) {
            this.showError('Veuillez saisir une valeur à empiler.');
            return;
        }

        // Empiler la valeur
        const newSize = this.stack.push(value);

        // Animer l'ajout
        this.animatePush(value);

        // Mettre à jour l'affichage
        this.updateDisplay();

        // Journaliser l'opération
        this.addLogEntry(`PUSH "${value}" → Taille: ${newSize}`, 'push');

        // Vider le champ et remettre le focus
        input.value = '';
        input.focus();
    }

    handlePop() {
        if (this.stack.isEmpty()) {
            this.showError('La pile est vide ! Impossible de dépiler.');
            return;
        }

        const removedValue = this.stack.pop();

        // Animer la suppression
        this.animatePop();

        // Mettre à jour l'affichage
        this.updateDisplay();

        // Journaliser l'opération
        this.addLogEntry(`POP "${removedValue}" → Taille: ${this.stack.size()}`, 'pop');
    }

    handlePeek() {
        const topValue = this.stack.peek();

        if (topValue === null) {
            this.showError('La pile est vide !');
            return;
        }

        // Mettre en évidence l'élément du sommet
        this.highlightTop();

        // Journaliser l'opération
        this.addLogEntry(`PEEK "${topValue}" (sommet conservé)`, 'peek');

        // Afficher temporairement la valeur
        setTimeout(() => {
            this.clearHighlights();
        }, 2000);
    }

    handleClear() {
        const oldSize = this.stack.size();
        this.stack.clear();

        // Animer la suppression de tous les éléments
        this.animateClear();

        // Mettre à jour l'affichage
        this.updateDisplay();

        // Journaliser l'opération
        this.addLogEntry(`CLEAR → Supprimé ${oldSize} éléments`, 'clear');
    }

    animatePush(value) {
        const container = document.getElementById('stackVisualization');

        // Créer le nouvel élément avec animation
        const newItem = document.createElement('div');
        newItem.className = 'stack-item new-item';
        newItem.innerHTML = `
            <span class="value">${value}</span>
            <span class="position">Sommet</span>
        `;

        // L'ajouter en bas (bas = sommet dans la visualisation)
        container.appendChild(newItem);

        // Mettre à jour les positions après un court délai
        setTimeout(() => {
            this.updateItemPositions();
        }, 100);
    }

    animatePop() {
        const container = document.getElementById('stackVisualization');
        const items = container.querySelectorAll('.stack-item');

        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            lastItem.classList.add('removing');

            setTimeout(() => {
                if (lastItem.parentNode) {
                    lastItem.parentNode.removeChild(lastItem);
                }
                this.updateItemPositions();
            }, 300);
        }
    }

    animateClear() {
        const container = document.getElementById('stackVisualization');
        const items = container.querySelectorAll('.stack-item');

        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('removing');
                setTimeout(() => {
                    if (item.parentNode) {
                        item.parentNode.removeChild(item);
                    }
                }, 300);
            }, index * 100);
        });
    }

    highlightTop() {
        const container = document.getElementById('stackVisualization');
        const items = container.querySelectorAll('.stack-item');

        if (items.length > 0) {
            const topItem = items[items.length - 1];
            topItem.classList.add('top-highlight');

            setTimeout(() => {
                topItem.classList.remove('top-highlight');
            }, 2000);
        }
    }

    clearHighlights() {
        const container = document.getElementById('stackVisualization');
        const items = container.querySelectorAll('.stack-item');
        items.forEach(item => item.classList.remove('top-highlight'));
    }

    updateItemPositions() {
        const container = document.getElementById('stackVisualization');
        const items = container.querySelectorAll('.stack-item');

        items.forEach((item, index) => {
            // Le dernier élément (index le plus élevé) est le sommet
            const isTop = index === items.length - 1;
            item.classList.toggle('top-item', isTop);

            // Mettre à jour le label de position
            const positionSpan = item.querySelector('.position');
            if (positionSpan) {
                positionSpan.textContent = isTop ? 'Sommet' : `Position ${index + 1}`;
            }
        });
    }

    updateDisplay() {
        const size = this.stack.size();
        const top = this.stack.peek();

        // Mettre à jour les informations
        document.getElementById('stackSize').textContent = size;
        document.getElementById('stackTop').textContent = top || '-';
        document.getElementById('operationCount').textContent = this.stack.getOperationCount();

        // Mettre à jour la visualisation des éléments existants
        this.updateItemPositions();
    }

    addLogEntry(message, type = 'info') {
        const logContainer = document.getElementById('operationsLog');

        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

        logContainer.appendChild(logEntry);

        // Scroll automatique vers le bas
        logContainer.scrollTop = logContainer.scrollHeight;

        // Limiter le nombre d'entrées (garder les 20 dernières)
        const entries = logContainer.querySelectorAll('.log-entry');
        if (entries.length > 20) {
            logContainer.removeChild(entries[0]);
        }
    }

    showError(message) {
        // Créer une notification d'erreur temporaire
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;

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

        document.body.appendChild(notification);

        // Supprimer automatiquement après 3 secondes
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

// Fonctions pour les démonstrations d'applications

function showUndoDemo() {
    const demo = `
        <h4>Démonstration : Système d'Annulation</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Principe :</strong></p>
            <ul>
                <li>Chaque action est empilée</li>
                <li>Annuler = dépiler la dernière action</li>
                <li>Exemple : Éditeur de texte (Ctrl+Z)</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                <strong>Code conceptuel :</strong><br>
                <code>undoStack.push(action); // Empiler chaque action</code><br>
                <code>lastAction = undoStack.pop(); // Dépiler pour annuler</code>
            </div>
        </div>
    `;

    showDemoModal('Système d\'Annulation (Undo)', demo);
}

function showBrowserDemo() {
    const demo = `
        <h4>Démonstration : Navigation Web</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Principe :</strong></p>
            <ul>
                <li>Chaque page visitée est empilée</li>
                <li>Bouton "Précédent" = dépiler l'URL actuelle</li>
                <li>Historique de navigation</li>
            </ul>
            <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                <strong>Navigation :</strong><br>
                Page A → Page B → Page C<br>
                <code>historyStack: [A, B, C] // C au sommet</code><br>
                <code>Bouton Précédent: pop() → retourne à B</code>
            </div>
        </div>
    `;

    showDemoModal('Navigation Web', demo);
}

function showParenthesesDemo() {
    const demo = `
        <h4>Démonstration : Vérification de Parentheses</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Algorithme :</strong></p>
            <ol>
                <li>Parcourir chaque caractère</li>
                <li>Parenthèse ouvrante → empiler</li>
                <li>Parenthèse fermante → dépiler et vérifier</li>
                <li>Pile vide à la fin → expression valide</li>
            </ol>
            <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                <strong>Exemple : ((2+3)*5)</strong><br>
                <code>Étape 1: ( → pile: ['(']</code><br>
                <code>Étape 2: ( → pile: ['(', '(']</code><br>
                <code>Étape 3: ) → dépile '(' → pile: ['(']</code><br>
                <code>Étape 4: ) → dépile '(' → pile: []</code><br>
                <code>Résultat: ✓ Valide</code>
            </div>
        </div>
    `;

    showDemoModal('Vérification de Parentheses', demo);
}

function showMazeDemo() {
    const demo = `
        <h4>Démonstration : Résolution de Labyrinthe</h4>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Algorithme de backtracking :</strong></p>
            <ol>
                <li>Empiler la position de départ</li>
                <li>Explorer les directions possibles</li>
                <li>Cul-de-sac → dépiler et revenir</li>
                <li>Arrivée atteinte → succès</li>
            </ol>
            <div style="margin-top: 10px; padding: 10px; background: white; border-radius: 4px;">
                <strong>Exemple visuel :</strong><br>
                <pre style="font-size: 12px; margin: 10px 0;">
┌───┬───┬───┐
│ S │   │ █ │
├───┼───┼───┤
│ █ │   │   │
├───┼───┼───┤
│   │   │ E │
└───┴───┴───┘
                </pre>
                <code>Chemins explorés sont empilés/dépilés</code>
            </div>
        </div>
    `;

    showDemoModal('Résolution de Labyrinthe', demo);
}

function showDemoModal(title, content) {
    // Créer une modal simple
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()"
                    style="
                        position: absolute;
                        top: 10px;
                        right: 15px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        cursor: pointer;
                        font-size: 16px;
                    ">×</button>
            <h2 style="color: #4CAF50; margin-bottom: 20px;">${title}</h2>
            ${content}
        </div>
    `;

    document.body.appendChild(modal);
}

// Fonctions pour les exercices interactifs

function typeText() {
    const editor = document.getElementById('textEditor');
    const currentText = editor.value;
    editor.value = currentText + "Hello ";

    // Simuler l'ajout à une pile d'actions (conceptuellement)
    const history = document.getElementById('undoHistory');
    history.innerHTML += '<div>✓ Action: Écrire "Hello"</div>';
}

function undoText() {
    const editor = document.getElementById('textEditor');
    const currentText = editor.value;

    // Simuler l'annulation (enlever le dernier "Hello ")
    if (currentText.endsWith("Hello ")) {
        editor.value = currentText.slice(0, -6);
        const history = document.getElementById('undoHistory');
        history.innerHTML += '<div style="color: #dc3545;">↶ Annulé: "Hello"</div>';
    } else {
        alert("Rien à annuler !");
    }
}

function evaluatePostfix() {
    const expression = document.getElementById('postfixInput').value.trim().split(' ');
    const stack = [];
    const stepsDiv = document.getElementById('postfixSteps');
    const resultDiv = document.getElementById('postfixResult');

    stepsDiv.innerHTML = '<h5>Détail des étapes :</h5>';
    resultDiv.innerHTML = '';

    try {
        for (let i = 0; i < expression.length; i++) {
            const token = expression[i];

            if (!isNaN(token)) {
                // Nombre - empiler
                stack.push(parseFloat(token));
                stepsDiv.innerHTML += `<div>${i + 1}. PUSH ${token} → Pile: [${stack.join(', ')}]</div>`;
            } else {
                // Opérateur - dépiler deux valeurs, calculer, rempiler
                if (stack.length < 2) {
                    throw new Error('Expression invalide');
                }

                const b = stack.pop();
                const a = stack.pop();
                let result;

                switch (token) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = a / b; break;
                    default: throw new Error(`Opérateur inconnu: ${token}`);
                }

                stack.push(result);
                stepsDiv.innerHTML += `<div>${i + 1}. ${a} ${token} ${b} = ${result} → Pile: [${stack.join(', ')}]</div>`;
            }
        }

        if (stack.length !== 1) {
            throw new Error('Expression invalide');
        }

        resultDiv.innerHTML = `<div style="color: #28a745; font-size: 1.2em; font-weight: bold;">
            ✓ Résultat: ${stack[0]}
        </div>`;

    } catch (error) {
        resultDiv.innerHTML = `<div style="color: #dc3545;">
            ✗ Erreur: ${error.message}
        </div>`;
    }
}

function checkParentheses() {
    const expression = document.getElementById('parenthesesInput').value;
    const resultDiv = document.getElementById('parenthesesResult');
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    let isValid = true;
    let errorMessage = '';

    for (let i = 0; i < expression.length; i++) {
        const char = expression[i];

        if (['(', '{', '['].includes(char)) {
            stack.push(char);
        } else if ([')', '}', ']'].includes(char)) {
            if (stack.length === 0) {
                isValid = false;
                errorMessage = `Parenthèse fermante '${char}' sans ouvrante correspondante à la position ${i + 1}`;
                break;
            }

            const top = stack.pop();
            if (top !== pairs[char]) {
                isValid = false;
                errorMessage = `Parenthèse '${char}' ne correspond pas à '${top}' à la position ${i + 1}`;
                break;
            }
        }
    }

    if (isValid && stack.length > 0) {
        isValid = false;
        errorMessage = `Parenthèse ouvrante '${stack[stack.length - 1]}' sans fermante correspondante`;
    }

    if (isValid) {
        resultDiv.innerHTML = `
            <div style="color: #28a745;">
                ✓ Expression valide<br>
                <small>Pile finale vide: toutes les parenthèses sont équilibrées</small>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div style="color: #dc3545;">
                ✗ Expression invalide<br>
                <small>${errorMessage}</small>
            </div>
        `;
    }
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

    .top-highlight {
        animation: pulse 1s infinite;
        border-color: #ffc107 !important;
        box-shadow: 0 0 20px rgba(255, 193, 7, 0.5) !important;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Initialiser le visualiseur
document.addEventListener('DOMContentLoaded', () => {
    new StackVisualizer();
});
