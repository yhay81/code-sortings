import type { TranslationDictionary } from "./ja";

export const fr: TranslationDictionary = {
  "meta.description":
    "Visualisez et apprenez, ligne par ligne, des algorithmes de tri écrits en Python ordinaire",
  "brand.home": "Accueil de Code Sortings",
  "locale.label": "Langue de l’interface",
  "settings.label": "Paramètres d’exécution",
  "field.algorithm": "Algorithme",
  "algorithm.custom": "Votre propre tri",
  "field.pattern": "Type d’entrée",
  "field.length": "Éléments",
  "pattern.random": "Aléatoire",
  "pattern.nearlySorted": "Presque trié",
  "pattern.reversed": "Inversé",
  "pattern.fewUnique": "Peu de valeurs",
  "patternHint.random":
    "Une entrée sans biais d’ordre, utile pour observer le comportement habituel.",
  "patternHint.nearlySorted":
    "Montre comment sont traitées les valeurs déjà proches de leur destination. Insertion Sort excelle ici.",
  "patternHint.reversed":
    "De nombreuses méthodes simples effectuent plus d’échanges. Utilisez-la pour explorer le pire cas.",
  "patternHint.fewUnique":
    "Montre le traitement des valeurs égales et invite à réfléchir aux comparaisons et à la stabilité.",
  "action.run": "Exécuter",
  "action.newSort": "Partir de zéro",
  "editor.label": "Code Python de tri",
  "source.waiting": "En attente",
  "source.before": "Avant l’exécution",
  "source.line": "{function}() · ligne {line}",
  "metrics.label": "Mesures d’exécution",
  "metrics.comparisons": "Comparaisons",
  "metrics.frames": "Image",
  "timeline.label": "Chronologie",
  "transport.label": "Commandes de lecture",
  "transport.first": "Début",
  "transport.firstTitle": "Aller à la première image",
  "transport.back": "Retour",
  "transport.backTitle": "Reculer d’une image",
  "transport.play": "Lire",
  "transport.playTitle": "Lire (Space)",
  "transport.pause": "Pause",
  "transport.pauseTitle": "Pause (Space)",
  "transport.stop": "Arrêter",
  "transport.forward": "Suivant",
  "transport.forwardTitle": "Avancer d’une image",
  "speed.label": "Vitesse",
  "speed.slow": "Lente",
  "speed.normal": "Normale",
  "speed.fast": "Rapide",
  "status.enginePreparing": "Préparation du moteur Python…",
  "status.executing": "Exécution du code Python…",
  "status.valuesChanged":
    "L’exécution est terminée, mais les valeurs du tableau d’origine ont changé",
  "status.notSorted":
    "L’exécution est terminée, mais le tableau n’est pas en ordre croissant (Python {version})",
  "status.sampled": " · échantillon de {steps} opérations",
  "status.complete": "Terminé · {frames} images{sampling} · Python {version}",
  "status.customReady":
    "Le code minimal est prêt. Écrivez votre tri, puis exécutez-le",
  "error.loadExample": "Impossible de charger le code d’exemple",
  "error.visualizationTitle": "Impossible d’exécuter le code",
  "error.visualizationDetail":
    "Consultez l’erreur, modifiez le code puis réessayez.",
  "lesson.algorithm": "Algorithme",
  "lesson.complexity": "Complexité",
  "lesson.best": "Meilleur",
  "lesson.average": "Moyen",
  "lesson.worst": "Pire",
  "lesson.trait": "Caractéristiques",
  "lesson.focus": "À observer",
  "lesson.learnMore": "En savoir plus sur Wikipédia",
  "lesson.learnMoreAria":
    "En savoir plus sur {algorithm} sur Wikipédia (s’ouvre dans un nouvel onglet)",
  "operation.mark.kind": "Position fixée",
  "operation.mark.title": "Positions triées : {indices}{suffix}",
  "operation.mark.more": " et {count} autres",
  "operation.swap.kind": "Échanger les valeurs",
  "operation.swap.title": "array[{left}] et array[{right}] ont été échangés",
  "operation.write.kind": "Écrire une valeur",
  "operation.write.one": "array[{index}] a été mis à jour",
  "operation.write.many": "{count} positions ont été mises à jour",
  "operation.compare.kind": "Comparer les valeurs",
  "operation.compare.title":
    "array[{left}] et array[{right}] comparés avec « {operator} »",
  "operation.compare.fallback": "comparer",
  "operation.read.kind": "Lire une valeur",
  "operation.read.title": "Valeur {value} lue dans array[{index}]",
  "operation.advance.kind": "Avancer dans le code",
  "operation.advance.title": "Ligne {line} de {function}() exécutée",
  "operation.advance.noChange":
    "Cette ligne ne modifie aucune valeur du tableau",
  "operation.start.kind": "Point de départ",
  "operation.start.title": "Voici le tableau avant l’exécution",
  "operation.start.detail":
    "Lancez la lecture ou déplacez la chronologie pour suivre chaque changement.",
  "operation.boot.detail":
    "Le premier exemple s’exécutera automatiquement lorsque Python sera prêt.",
  "chart.label":
    "Tableau en cours de tri. {comparisons} comparaisons, image {frame}",
  "chart.title": "Tableau : {values}",
  "runner.cancelled": "Une nouvelle exécution a commencé",
  "runner.stopped": "Exécution arrêtée",
  "runner.timeout": "L’exécution a dépassé {seconds} secondes et a été arrêtée",
  "runner.bootTimeout": "Le moteur Python a dépassé le délai de démarrage",
  "runnerError.finite":
    "Seuls des nombres finis peuvent être affectés au tableau",
  "runnerError.fixedLength":
    "La longueur du tableau ne peut pas changer pendant le tri",
  "runnerError.inputLength":
    "La longueur du tableau doit être comprise entre 3 et 300",
  "runnerError.defineSort": "Définissez d’abord def sort(array):",
  "runnerError.load": "Impossible de charger l’exécuteur Python",
  "runnerError.notReady": "Le moteur Python n’est pas encore prêt",
  "runnerError.traceLimit":
    "La visualisation a dépassé la limite de {steps} étapes",
};
