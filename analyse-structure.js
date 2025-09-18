#!/usr/bin/env node

/**
 * Script d'analyse de la structure du livre d'algorithmes
 * Utilise le fichier structure-livre.json pour générer des statistiques
 */

const fs = require('fs');

// Charger la structure du livre
const structure = JSON.parse(fs.readFileSync('structure-livre.json', 'utf8'));

console.log('📊 Analyse du Manuel d\'Algorithmes et Structures de Données\n');
console.log('=' .repeat(60));

// Statistiques générales
console.log('📈 STATISTIQUES GÉNÉRALES');
console.log('-'.repeat(30));
console.log(`📚 Nombre total de chapitres: ${structure.structure.metriques.total_chapitres}`);
console.log(`💻 Lignes de code approximatives: ${structure.structure.metriques.total_lignes_code}`);
console.log(`🎯 Nombre total d'exercices: ${structure.structure.metriques.total_exercices}`);
console.log(`🏷️ Langages utilisés: ${structure.structure.technologies.langage_principal}`);

console.log('\n📋 RÉPARTITION PAR DIFFICULTÉ');
console.log('-'.repeat(30));
const difficulte = structure.structure.metriques.difficulte_repartition;
console.log(`🟢 Débutant: ${difficulte.debutant} chapitres`);
console.log(`🟡 Intermédiaire: ${difficulte.intermediaire} chapitres`);
console.log(`🔴 Avancé: ${difficulte.avance} chapitres`);

console.log('\n📊 ANALYSE PAR PARTIE');
console.log('-'.repeat(30));

// Analyse détaillée par partie
structure.structure.parties.forEach(partie => {
  const chapCount = partie.chapitres.length;
  const codeLines = partie.chapitres.reduce((sum, chap) => sum + chap.lignes_code, 0);
  const exercises = partie.chapitres.reduce((sum, chap) => sum + chap.exercices, 0);

  console.log(`\n${partie.numero}. ${partie.titre} (${chapCount} chapitres)`);
  console.log(`   💻 Code: ${codeLines} lignes`);
  console.log(`   🎯 Exercices: ${exercises}`);
  console.log(`   📝 Chapitres:`);

  partie.chapitres.forEach(chap => {
    const diffIcon = chap.difficulte === 'Débutant' ? '🟢' :
                    chap.difficulte === 'Intermédiaire' ? '🟡' : '🔴';
    console.log(`      ${diffIcon} ${chap.numero}. ${chap.titre} (${chap.exercices} ex.)`);
  });
});

console.log('\n🎓 PARCOURS D\'APPRENTISSAGE RECOMMANDÉS');
console.log('-'.repeat(40));

Object.entries(structure.structure.parcours_apprentissage).forEach(([niveau, chapitres]) => {
  const niveauIcon = niveau.includes('debutant') ? '👶' :
                    niveau.includes('intermediaire') ? '👦' :
                    niveau.includes('avance') ? '👨' : '🎯';
  console.log(`${niveauIcon} ${niveau.charAt(0).toUpperCase() + niveau.slice(1)}: ${chapitres.length} chapitres`);
  console.log(`   Parcours: ${chapitres.join(' → ')}\n`);
});

console.log('🔗 DÉPENDANCES ENTRE CHAPITRES');
console.log('-'.repeat(30));

// Analyser les dépendances
const dependances = {};
structure.structure.parties.forEach(partie => {
  partie.chapitres.forEach(chap => {
    if (chap.dependances && chap.dependances.length > 0) {
      dependances[chap.numero] = chap.dependances;
    }
  });
});

Object.entries(dependances).forEach(([chap, deps]) => {
  if (deps.length > 0) {
    console.log(`Chapitre ${chap} dépend de: ${deps.join(', ')}`);
  }
});

console.log('\n🏆 CONCEPTS LES PLUS IMPORTANTS');
console.log('-'.repeat(30));

// Compter les occurrences des concepts clés
const conceptCount = {};
structure.structure.parties.forEach(partie => {
  partie.chapitres.forEach(chap => {
    chap.concepts_cles.forEach(concept => {
      conceptCount[concept] = (conceptCount[concept] || 0) + 1;
    });
  });
});

// Trier par fréquence
const topConcepts = Object.entries(conceptCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10);

topConcepts.forEach(([concept, count]) => {
  console.log(`🔹 ${concept} (${count} chapitres)`);
});

console.log('\n💡 RECOMMANDATIONS D\'APPRENTISSAGE');
console.log('-'.repeat(35));
console.log('1. Commencez par les fondations (Partie I)');
console.log('2. Maîtrisez les structures linéaires (Partie II)');
console.log('3. Explorez les structures avancées progressivement');
console.log('4. Terminez par les graphes et projets pratiques');
console.log('5. Utilisez les quiz pour valider vos connaissances');
console.log('6. Consultez le glossaire en cas de doute');

console.log('\n✨ FIN DE L\'ANALYSE');
console.log('Utilisez ce livre pour maîtriser les algorithmes et structures de données !');
