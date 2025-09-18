// Script partagé pour charger le contenu des chapitres Markdown
class ChapterLoader {
    constructor(chapterNumber, contentElementId = 'chapter-content') {
        this.chapterNumber = chapterNumber;
        this.contentElementId = contentElementId;
    }

    loadChapter() {
        try {
            // Vérifier si les données des chapitres sont chargées
            if (typeof chaptersData === 'undefined') {
                throw new Error('Données des chapitres non disponibles');
            }

            const markdown = chaptersData[this.chapterNumber];
            if (!markdown) {
                throw new Error(`Chapitre ${this.chapterNumber} non trouvé`);
            }

            const html = this.convertMarkdownToHtml(markdown);
            const contentElement = document.getElementById(this.contentElementId);
            if (contentElement) {
                contentElement.innerHTML = html;
            }
        } catch (error) {
            console.error('Erreur lors du chargement du chapitre:', error);
            const contentElement = document.getElementById(this.contentElementId);
            if (contentElement) {
                contentElement.innerHTML =
                    '<p style="color: red; text-align: center; padding: 20px; background: #ffe6e6; border: 1px solid #ffcccc; border-radius: 5px;">Erreur lors du chargement du contenu du chapitre.</p>';
            }
        }
    }

    convertMarkdownToHtml(markdown) {
        let html = markdown
            // Headers
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
            .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
            .replace(/^###### (.+)$/gm, '<h6>$1</h6>')

                // Code blocks - ajouter la classe pour Highlight.js
                .replace(/```([\s\S]*?)```/g, '<pre><code class="language-javascript">$1</code></pre>')

            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')

            // Bold
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.+?)__/g, '<strong>$1</strong>')

            // Italic
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/_(.+?)_/g, '<em>$1</em>')

            // Lists
            .replace(/^\* (.+)$/gm, '<li>$1</li>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

            // Wrap consecutive list items
            .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')

            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')

            // Tables (simple support)
            .replace(/\|(.+)\|/g, '<td>$1</td>')
            .replace(/<td>(.*?)<\/td>\n<td>/g, '<tr><td>$1</td><td>')
            .replace(/(<tr>.*?<\/tr>)/g, '<table><tbody>$1</tbody></table>');

        // Wrap in paragraph tags
        html = '<p>' + html + '</p>';

        // Clean up
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p><h/g, '<h');
        html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
        html = html.replace(/<p><ul/g, '<ul');
        html = html.replace(/<\/ul><\/p>/g, '</ul>');
        html = html.replace(/<p><table/g, '<table');
        html = html.replace(/<\/table><\/p>/g, '</table>');
        html = html.replace(/<p><pre/g, '<pre');
        html = html.replace(/<\/pre><\/p>/g, '</pre>');

        return html;
    }
}

// Fonction globale pour initialiser le chargeur de chapitre
function initChapterLoader(chapterNumber, contentElementId = 'chapter-content') {
    const loader = new ChapterLoader(chapterNumber, contentElementId);
    // Charger immédiatement si le DOM est déjà prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => loader.loadChapter());
    } else {
        loader.loadChapter();
    }
}
