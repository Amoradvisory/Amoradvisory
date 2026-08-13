# Amor El Hamrouni — IA appliquée à l’éducation

Enseignant et formateur en Belgique francophone, je transforme des frictions pédagogiques concrètes en dispositifs simples, testables et responsables.

**Portfolio public :** [amoradvisory.github.io/Amoradvisory](https://amoradvisory.github.io/Amoradvisory/)

Le terrain fournit le problème. La conception pédagogique cadre la réponse. L’IA, les agents, les automatisations ou le code n’interviennent que lorsqu’ils améliorent réellement l’usage.

## Trois preuves principales

### TeacherFlow — de l’observation fugace à la mémoire pédagogique

Une boucle courte relie préparation, enseignement, observation, capitalisation et prochaine amélioration. Le démonstrateur fonctionne sans donnée élève et conserve ses données localement.

- [Tester TeacherFlow](https://amoradvisory.github.io/FlowPilot/teacher/)
- [Lire l’étude de cas](https://amoradvisory.github.io/Amoradvisory/cases/teacherflow.html)

### PiloteCours — garder le fil de la séance

Une aide de terrain mobile-first organise cinq phases de séance, des recadrages rapides, une reprise locale et un mode discret. Aucun compte, aucune donnée élève, aucun serveur et aucune API IA.

- [Ouvrir la démo web](https://amoradvisory.github.io/Amoradvisory/demos/pilotecours/)
- [Lire l’étude de cas](https://amoradvisory.github.io/Amoradvisory/cases/pilotecours.html)
- [Voir le prototype Android source](https://github.com/Amoradvisory/claude-agent-workspace/tree/master/PiloteCours)

### Second cerveau enseignant — une mémoire cumulative et traçable

Une architecture distingue explicitement **SOURCE → INFÉRENCE → PROPOSITION** afin que les faits, les raisonnements et les idées à tester ne se confondent pas.

- [Explorer l’étude de cas](https://amoradvisory.github.io/Amoradvisory/cases/second-cerveau.html)

## Méthode

**Observer → Cadrer → Concevoir → Orchestrer → Tester → Améliorer**

Principes : humain dans la boucle, données minimales, maturité annoncée, limites explicites et aucune métrique inventée.

## Autres expérimentations

Les dépôts TranscriptIA, PromptVault, Nanobot Omega et les autres projets publics restent accessibles dans le [laboratoire GitHub](https://github.com/Amoradvisory). Ils documentent des explorations complémentaires sans remplacer les trois preuves pédagogiques principales.

## Vérifier le site localement

Le portfolio et PiloteCours sont statiques, sans dépendance de production.

```powershell
node --test tests/pilotecours.test.mjs
node scripts/validate-site.mjs
python -m http.server 8000 --directory site
```

## Contact

- [Email professionnel](mailto:enseignant.be@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/amor-el-hamrouni/)

Les projets présentés sont des démonstrateurs personnels. Aucun déploiement institutionnel, usage externe ou impact mesuré n’est revendiqué sans preuve publique correspondante.
