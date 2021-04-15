export default {
  // ==========
  // Views
  Dashboard: {
    spacesButtonTitle: "Espaces",
    spacesButtonText: "Mes espaces",
    projectsButtonTitle: "Projets",
    projectsButtonText: "Mes projets"
  },
  OidcCallbackError: {
    message: "Une erreur s'est produite lors de l'authentification...",
    tryAgainButtonText: "Réessayer"
  },
  ProjectBoard: {
    tabs: {
      project: "Projet",
      files: "GED",
      bcf: "BCF"
    },
    openFileUploadButtonText: "Ajouter un IFC",
    closeFileUploadButtonText: "Fermer"
  },
  SpaceBoard: {
    searchInputPlaceholder: "Rechercher un projet"
  },
  UserProjects: {
    searchInputPlaceholder: "Rechercher un projet"
  },
  UserSpaces: {
    searchInputPlaceholder: "Rechercher un espace",
    createButtonText: "Créer un espace"
  },

  // ==========
  // Generic components
  BreadcrumbSelector: {
    inputPlaceholder: "Rechercher"
  },
  GenericTable: {
    pagination: "{start} - {end} sur {total}"
  },
  GoBackButton: {
    text: "Retour"
  },
  LanguageSelector: {
    title: "Choix de la langue"
  },

  // ==========
  // Specific components
  AppHeaderMenu: {
    entrySettings: "Paramètres du compte",
    entryConnect: "BIMData Connect",
    entryDocumentation: "Documentation",
    entryMarketplace: "Marketplace",
    entryLanguage: "Choix de la langue",
    logoutButtonText: "Se Déconnecter"
  },

  BreadcrumbProjectSelector: {
    placeholder: "< Aucun projet >"
  },

  DashboardInfoTile: {
    title: "Securité"
  },

  DashboardProjectList: {
    title: "Projets récents"
  },

  DashboardSpaceList: {
    title: "Espaces récents"
  },

  DashboardWelcomeTile: {
    title: "Dashboard",
    message: "Bonjour {name}, content de vous revoir !"
  },

  EmptyFilesManager: {
    onboardingText: "Téléverser votre premier fichier",
    uploadFileButtonText: "Téléverser un fichier",
    createFolderButtonText: "Créer un dossier"
  },

  EmptyModelsOverview: {
    onboardingText: "Téléverser votre premier IFC",
    uploadButtonText: "Téléversement"
  },

  EmptyUsersManager: {
    onboardingText: "Inviter votre premier collaborateur",
    inviteButtonText: "Invitation"
  },

  FileUploadCard: {
    cancelMessage: "Annulé",
    errorMessage: "Le téléversement a échoué"
  },

  InvitationCard: {
    pendingMessage: "Invité - Sans réponse.",
    resendLinkText: "Renvoyer l'invitation ?"
  },

  InvitationForm: {
    emailInputPlaceholder: "Email de l'utilisateur",
    emailInputErrorMessage: "Email invalide",
    roleInputLabel: "Rôle",
    roles: {
      admin: "Administrateur",
      user: "Utilisateur",
      guest: "Invité"
    },
    cancelButtonText: "Annuler",
    submitButtonText: "Inviter"
  },

  ModelActionsCell: {
    addTagsButtonText: "Ajouter des tags",
    renameButtonText: "Renommer",
    archiveButtonText: "Archiver",
    deleteButtonText: "Supprimer"
  },

  ModelLastUpdateCell: {
    at: "à"
  },

  ModelLocation: {
    emptyLocationMessage: "Aucune données de localisation disponible",
    addLocationButtonText: "Renseigner"
  },

  ModelLocationForm: {
    addressInputPlaceholder: "Entrer une adresse",
    checkButtonText: "Vérifier",
    submitButtonText: "Valider",
    cancelButtonText: "Changer"
  },

  ModelNameCell: {
    inputErrorMessage: "Nom de modèle invalide",
    submitButtonText: "Valider"
  },

  ModelsActionBar: {
    deleteButtonText: "Supprimer",
    archiveButtonText: "Archiver",
    downloadButtonText: "Télécharger",
    mergeButtonText: "Fusionner"
  },

  ModelsDeleteModal: {
    title: "Attention !",
    message: "Cette action est irresversible. Cela supprimera :",
    cancelButtonText: "Annuler",
    deleteButtonText: "Supprimer"
  },

  ModelsManagerTable: {
    emptyTablePlaceholder: "Aucun modèle",
    header: {
      id: "ID",
      name: "Nom",
      version: "Version",
      creator: "Crée par",
      lastupdate: "Modifié le",
      status: "Statut"
    }
  },

  ModelsMergeModal: {
    title: "Fusionner la sélection",
    inputPlaceholder: "Nom de votre fusion d'ifc",
    inputErrorMessage: "Vous devez renseigner un nom pour le fichier",
    submitButtonText: "Exporter"
  },

  ProjectCardActionMenu: {
    renameButtonText: "Renommer",
    deleteButtonText: "Supprimer"
  },

  ProjectCardDeleteGuard: {
    title: "Supprimer le projet",
    message: "Êtes vous sûr de vouloir supprimer (définitivement) ce projet ?",
    deleteButtonText: "Supprimer"
  },

  ProjectCardUpdateForm: {
    title: "Renommer le projet",
    inputPlaceholder: "Nom",
    inputErrorMessage: "Ce nom de projet n'est pas valide.",
    renameButtonText: "Renommer"
  },

  ProjectCreationCard: {
    title: "Nouveau projet",
    text: "Créer un nouveau projet",
    inputPlaceholder: "Nom",
    inputErrorMessage: "Vous devez donner un nom au projet !",
    createButtonText: "Créer"
  },

  ProjectFilesManager: {
    title: "Documents du projet"
  },

  ProjectFileUploader: {
    uploadAreaText: "Cliquer/Glisser vos fichiers ici",
    separatorText: "ou",
    uploadButtonText: "Selectionner un fichier"
  },

  ProjectModelsManager: {
    title: "Modèles du projet",
    tabs: {
      ifc: "IFC",
      split: "Split / Export",
      merge: "Merge",
      archive: "Archives"
    }
  },

  ProjectModelsOverview: {
    title: "Aperçu du projet"
  },

  ProjectUsersManager: {
    title: "Utilisateurs",
    searchInputPlaceholder: "Rechercher un utilisateur"
  },

  SpaceCard: {
    projects: "PROJETS"
  },

  SpaceCardActionMenu: {
    renameButtonText: "Renommer",
    removeImageButtonText: "Supprimer l'image",
    deleteButtonText: "Supprimer cet espace"
  },

  SpaceCardDeleteGuard: {
    title: "Supprimer l'espace",
    message: "Êtes vous sûr de vouloir supprimer (définitivement) cet espace ?",
    deleteButtonText: "Supprimer"
  },

  SpaceCardUpdateForm: {
    title: "Renommer l'espace",
    inputPlaceholder: "Nom",
    inputErrorMessage: "Ce nom d'espace n'est pas valide.",
    submitButtonText: "Renommer"
  },

  SpaceCreationCard: {
    title: "Nouvel espace",
    inputPlaceholder: "Nom",
    inputErrorMessage: "Vous devez donner un nom à l'espace !",
    createButtonText: "Créer"
  },

  SpaceImageInput: {
    changeImageButtonText: "Changer l'image"
  },

  SpaceUsersManager: {
    title: "Gestion administrateur espace",
    tabs: {
      admins: "Administrateurs",
      users: "Utilisateurs"
    },
    searchInputPlaceholder: "Rechercher un utilisateur",
    addUserButtonText: "Ajouter un utilisateur"
  },

  UserCard: {
    self: "vous"
  },

  UserCardDeleteGuard: {
    message: {
      space: "Supprimer {name} de cet espace ?",
      project: "Supprimer {name} de ce projet ?"
    },
    deleteButtonText: "Supprimer"
  },

  UserRoleBadge: {
    admin: "Admin",
    user: "User",
    guest: "Guest"
  },

  ViewerCard: {
    openButtonText: "Ouvrir"
  },

  ViewerCardModelPreview: {
    emptyPreviewPlaceholder: "Aucune prévisualisation"
  }
};
