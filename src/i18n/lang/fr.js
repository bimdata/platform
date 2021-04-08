export default {
  Commons: {
    cancel: "Annuler",
    close: "Fermer",
    no: "Non",
    yes: "Oui",
    at: "à"
  },
  oidc: {
    callbackErrorMessage:
      "Une erreur s'est produite lors de l'authentification...",
    tryAgain: "Réessayer"
  },
  AppHeaderMenu: {
    settings: "Paramètres du compte",
    connect: "BIMData Connect",
    documentation: "Documentation",
    marketplace: "Marketplace",
    selectLanguage: "Choix de la langue",
    logout: "Se Déconnecter"
  },
  Breadcrumb: {
    back: "Retour",
    search: "Rechercher"
  },
  Dashboard: {
    welcomeTitle: "Dashboard",
    welcomeMessage: "Bonjour {name}, content de vous revoir !",
    activeSpaces: "Espaces",
    viewSpaces: "Mes espaces",
    activeProjects: "Projets",
    viewProjects: "Mes projets",
    security: "Security"
  },
  LanguageSelector: {
    title: "Choix de la langue"
  },
  Spaces: {
    searchSpaces: "Rechercher un espace",
    sortSpaces: "",
    createSpace: "Créer un espace",
    projects: "PROJETS",
    SpaceCreationCard: {
      title: "Nouvel espace",
      inputName: "Nom",
      buttonCreate: "Créer",
      errorMessage: "Vous devez donner un nom à l'espace !"
    },
    SpaceActionMenu: {
      rename: "Renommer",
      changeImage: "Changer l'image",
      removeImage: "Supprimer l'image",
      leave: "Quitter cet espace",
      delete: "Supprimer cet espace"
    },
    SpaceRenameForm: {
      title: "Renommer l'espace",
      inputName: "Nom",
      buttonRename: "Renommer",
      errorMessage: "Ce nom d'espace n'est pas valide."
    },
    SpaceDeleteGuard: {
      title: "Supprimer l'espace",
      message:
        "Êtes vous sûr de vouloir supprimer (définitivement) cet espace ?",
      buttonDelete: "Supprimer"
    }
  },
  DashboardSpaceList: {
    title: "Espaces récents"
  },
  DashboardProjectList: {
    title: "Projets récents"
  },
  Projects: {
    searchProjects: "Rechercher un projet",
    ProjectCreationCard: {
      text: "Créer un nouveau projet",
      title: "Nouveau projet",
      inputName: "Nom",
      buttonCreate: "Créer",
      errorMessage: "Vous devez donner un nom au projet !"
    },
    ProjectActionMenu: {
      rename: "Renommer",
      delete: "Supprimer"
    },
    ProjectUpdateForm: {
      title: "Renommer le projet",
      inputName: "Nom",
      buttonRename: "Renommer",
      errorMessage: "Ce nom de projet n'est pas valide."
    },
    ProjectDeleteGuard: {
      title: "Supprimer le projet",
      message:
        "Êtes vous sûr de vouloir supprimer (définitivement) ce projet ?",
      buttonDelete: "Supprimer"
    }
  },
  SpaceUsersManager: {
    adminTabLabel: "Administrateurs",
    userTabLabel: "Utilisateurs",
    title: "Gestion administrateur espace",
    searchUsers: "Rechercher un utilisateur",
    addUserButton: "Ajouter un utilisateur"
  },
  InvitationForm: {
    inputEmail: "Email de l'utilisateur",
    errorMessage: "Email invalide",
    inputRole: "Rôle",
    roles: {
      admin: "Administrateur",
      user: "Utilisateur",
      guest: "Invité"
    },
    buttonCancel: "Annuler",
    buttonSubmit: "Inviter"
  },
  User: {
    self: "vous",
    admin: "Admin",
    user: "User",
    guest: "Guest",
    UserDeleteGuard: {
      message: {
        space: "Supprimer {name} de cet espace ?",
        project: "Supprimer {name} de ce projet ?"
      },
      buttonDelete: "Supprimer"
    }
  },
  Invitation: {
    pending: "Invité - Sans réponse.",
    sendAgain: "Renvoyer l'invitation ?"
  },
  ProjectBoard: {
    projectTabLabel: "Projet",
    filesTabLabel: "GED",
    bcfTabLabel: "BCF",
    addIFC: "Ajouter un IFC",
    closeFileUploader: "Fermer",
    ProjectModelsOverview: {
      title: "Aperçu du projet"
    },
    ProjectModelsManager: {
      title: "Modèles du projet",
      onboardingText: "Téléverser votre premier IFC",
      buttonUpload: "Téléversement",
      tabs: {
        ifc: "IFC",
        split: "Split / Export",
        merge: "Merge",
        archive: "Archives"
      }
    },
    ProjectUsersManager: {
      title: "Utilisateurs",
      onboardingText: "Inviter votre premier collaborateur",
      buttonInvite: "Invitation",
      searchUsers: "Rechercher un utilisateur"
    },
    ProjectFilesManager: {
      title: "Documents du projet",
      onboardingText: "Téléverser votre premier fichier",
      buttonUploadFile: "Téléverser un fichier",
      buttonCreateFolder: "Créer un dossier"
    }
  },
  ViewerCard: {
    buttonOpen: "Ouvrir"
  },
  ViewerCardModelPreview: {
    noPreview: "Aucune prévisualisation"
  },
  ModelLocation: {
    noLocationMessage: "Aucune données de localisation disponible",
    buttonAddLocation: "Renseigner"
  },
  ModelLocationForm: {
    inputAddress: "Entrer une adresse",
    buttonCheck: "Vérifier",
    buttonSubmit: "Valider",
    buttonCancel: "Changer"
  },
  GenericTable: {
    pagination: "{start} - {end} sur {total}"
  },
  ModelsActionBar: {
    delete: "Supprimer",
    archive: "Archiver",
    download: "Télécharger",
    merge: "Fusionner"
  },
  ModelActionMenu: {
    buttonAddTags: "Ajouter des tags",
    buttonRename: "Renommer",
    buttonArchive: "Archiver",
    buttonDelete: "Supprimer"
  },
  ProjectFileUploader: {
    uploadAreaText: "Cliquer/Glisser vos fichiers ici",
    separatorText: "ou",
    buttonUpload: "Selectionner un fichier"
  },
  ModelNameCell: {
    inputErrorMessage: "Nom de modèle invalide",
    buttonSubmit: "Valider"
  },
  ModelsManagerTable: {
    tablePlaceholder: "Aucun modèle",
    header: {
      id: "ID",
      name: "Nom",
      version: "Version",
      creator: "Crée par",
      lastupdate: "Modifié le",
      status: "Statut"
    }
  },
  ModelsDeleteModal: {
    title: "Attention !",
    message: "Cette action est irresversible. Cela supprimera :",
    buttonCancel: "Annuler",
    buttonDelete: "Supprimer",
    loadingMessage: "Suppression en cours..."
  },
  ModelsMergeModal: {
    title: "Fusionner la sélection",
    inputName: "Nom de votre fusion d'ifc",
    inputError: "Vous devez renseigner un nom pour le fichier",
    buttonSubmit: "Exporter"
  },
  BreadcrumbProjectSelector: {
    noProject: "< Aucun projet >"
  },
  FileUploadCard: {
    cancelMessage: "Annulé",
    errorMessage: "Le téléversement a échoué"
  }
};
