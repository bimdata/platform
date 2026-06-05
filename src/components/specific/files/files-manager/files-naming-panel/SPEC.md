# Naming Convention (Naming Template) — Spécification technique

## Vue d'ensemble

Feature permettant aux administrateurs d'un projet BIMData de définir des **règles de nommage** pour les fichiers déposés dans les dossiers de la GED. Les règles peuvent être appliquées en mode souple (avertissement) ou strict (blocage).

---

## Architecture

```
src/
├── composables/
│   └── useNamingConvention.js        ← Hook principal à brancher dans l'upload
├── services/
│   └── namingConventionService.js    ← Logique pure (regex, validation, suggestions)
├── stores/
│   └── namingConventionStore.js      ← State Pinia, CRUD règles, check upload
└── components/naming/
    ├── NamingConventionPanel.vue     ← Panneau création/édition d'une règle
    ├── NamingSegmentRow.vue          ← Ligne d'un segment dans le formulaire
    ├── NamingRulesList.vue           ← Liste des règles + assignation dossier
    ├── NamingViolationModal.vue      ← Modale bloquante (mode strict)
    ├── NamingViolationBanner.vue     ← Bannière non-bloquante (mode souple)
    └── GedFileUpload.integration.vue ← Exemple d'intégration dans la GED
```

---

## Modèle de données

### NamingRule

```ts
interface NamingRule {
  id: string;
  name: string;                    // "Convention métier projet X"
  separator: "-" | "." | "_";
  segments: NamingSegment[];
  mode: "soft" | "strict";
  recursive: boolean;              // s'applique aux sous-dossiers
  folder_ids: string[];            // dossiers cibles
  pattern: string;                 // ex: "a.1.a" (généré auto)
  creator_email?: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}
```

### NamingSegment

```ts
type NamingSegment =
  | { type: "n_chars";  config: { min?: number; max?: number } }
  | { type: "bounded";  config: { min: number; max: number } }
  | { type: "list";     config: { listId?: string; values: string[] } }
```

### CustomList

```ts
interface CustomList {
  id: string;
  name: string;
  values: string[];    // ["WIP", "VAL", "ARCH", ...]
}
```

---

## Règles de validation

Le service `namingConventionService.js` construit un regex depuis la définition d'une règle :

| Segment       | Pattern regex généré         | Exemple          |
|---------------|------------------------------|------------------|
| N caractères  | `[\w\-]{min,max}`            | `[\w\-]{2,8}`    |
| Valeurs bornées | Alternation numérique      | `(1\|2\|...\|50)` |
| Liste         | Alternation des valeurs      | `(WIP\|VAL\|ARCH)` |

Le séparateur est intercalé entre chaque segment.
L'extension de fichier (`.ifc`, `.pdf`…) est tolérée en suffixe.

**Exemple** : Règle `a.1.a` avec séparateur `.` :
- Segments : [N chars, Bounded(1-99), N chars]
- Regex : `^[\w\-]+\.(1|2|...|99)\.[\w\-]+(\.[a-zA-Z0-9]+)?$`
- ✅ `20191002.1.Piping.ifc`
- ❌ `20191002Mechanical Piping.ifc`

---

## Flux d'upload (intégration GED)

```
User sélectionne fichier(s)
        ↓
useNamingConvention.checkBeforeUpload(files)
        ↓
store.checkFilesBeforeUpload(files, folder)
  → récupère les règles effectives du dossier (directes + récursives)
  → valide chaque fichier contre chaque règle
        ↓
    ┌───────────────────────────────┐
    │  Aucune violation ?           │ → upload immédiat
    ├───────────────────────────────┤
    │  Violations soft seulement ?  │ → NamingViolationBanner (non-bloquant)
    │                               │   upload continue, user peut renommer après
    ├───────────────────────────────┤
    │  Violations strictes ?        │ → NamingViolationModal (bloquant)
    │                               │   upload suspendu, Promise en attente
    │                               │   User renomme → confirm → upload reprend
    │                               │   User annule → Promise rejected
    └───────────────────────────────┘
```

---

## Routes API (à implémenter dans platform-back)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET`   | `/cloud/:cloudPk/project/:projectPk/naming-rules` | Liste des règles |
| `POST`  | `/cloud/:cloudPk/project/:projectPk/naming-rules` | Créer une règle |
| `PATCH` | `/cloud/:cloudPk/project/:projectPk/naming-rules/:id` | Modifier une règle |
| `DELETE`| `/cloud/:cloudPk/project/:projectPk/naming-rules/:id` | Supprimer une règle |
| `GET`   | `/cloud/:cloudPk/project/:projectPk/naming-lists` | Listes personnalisées |
| `POST`  | `/cloud/:cloudPk/project/:projectPk/naming-lists` | Créer une liste |

> **Note** : En attendant l'implémentation backend, le store utilise `localStorage` comme stub. Remplacer les blocs commentés `// When platform-back implements this endpoint` par les vrais appels API.

---

## Composants UI — résumé

### `NamingConventionPanel.vue`
Panneau latéral de création/édition d'une règle.
- **Étape 1** : Nom de la règle
- **Étape 2** : Séparateur (tiret / point / underscore)
- **Étape 3** : Segments (N chars / Borné / Liste) avec aperçu live du pattern
- **Mode** : checkbox stricte + checkbox récursive
- Emit : `saved(rule)`, `close`

### `NamingSegmentRow.vue`
Ligne d'un segment dans le builder. Drag-handle pour réordonner.
- N chars : inputs min/max
- Borné : inputs min/max numériques
- Liste : select parmi les `CustomList` du projet

### `NamingRulesList.vue`
Panneau latéral listant les règles existantes.
- Recherche texte
- Sélection par radio pour assigner au dossier courant
- Badge "strict" sur les règles en mode strict
- Bouton édition inline
- Section d'assignation/désassignation au dossier courant

### `NamingViolationModal.vue`
Modale **bloquante** (mode strict).
- Affiche les fichiers non-conformes groupés par règle
- Champ de renommage inline par fichier
- Validation live du nouveau nom contre la règle
- Bouton "Renommer" actif uniquement quand tous les fichiers sont résolus

### `NamingViolationBanner.vue`
Bannière **non-bloquante** (mode souple).
- Résumé cliquable avec compteur de violations
- Liste expandable des fichiers non-conformes
- Renommage inline optionnel
- Dismiss pour ignorer

---

## Intégration dans la GED existante

1. **Importer le composable** dans votre composant d'upload GED :
   ```js
   import { useNamingConvention } from "@/composables/useNamingConvention.js";
   const naming = useNamingConvention(() => currentFolder.value);
   ```

2. **Intercepter les fichiers** avant l'upload :
   ```js
   const { files } = await naming.checkBeforeUpload(selectedFiles);
   await uploadFiles(files); // avec les noms potentiellement renommés
   ```

3. **Afficher les composants UI** dans le template :
   ```html
   <NamingViolationBanner v-if="naming.showBanner.value" ... />
   <NamingViolationModal  v-if="naming.showModal.value"  ... />
   ```

4. **Exposer le panneau de gestion** via un bouton "Conventions de nommage" dans la toolbar GED.

5. **Initialiser les règles** au mount :
   ```js
   store.fetchRules(cloudPk, projectPk);
   ```

---

## Tests

Fichier : `src/services/namingConventionService.test.js`

Couverture :
- `buildRuleRegex` : N chars, borné, liste, extension, règle complexe
- `validateFileName` : valid / invalid / extension
- `buildHumanReadablePattern` : tous types de segments
- `suggestRenames` : génération de suggestions, préservation extension
- Flow complet soft vs strict (simulation store)

Run : `npx jest src/services/namingConventionService.test.js`
