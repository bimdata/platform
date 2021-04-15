export default {
  // ==========
  // Views
  Dashboard: {
    spacesButtonTitle: "Active Spaces",
    spacesButtonText: "View spaces",
    projectsButtonTitle: "Active Projects",
    projectsButtonText: "View projects"
  },
  OidcCallbackError: {
    message: "An error occured during authentication...",
    tryAgainButtonText: "Try Again"
  },
  ProjectBoard: {
    tabs: {
      project: "Project",
      files: "Files",
      bcf: "BCF"
    },
    openFileUploadButtonText: "Add an IFC",
    closeFileUploadButtonText: "Close"
  },
  SpaceBoard: {
    searchInputPlaceholder: "Search projets"
  },
  UserProjects: {
    searchInputPlaceholder: "Search projets"
  },
  UserSpaces: {
    searchInputPlaceholder: "Search spaces",
    createButtonText: "Create a space"
  },

  // ==========
  // Generic components
  BreadcrumbSelector: {
    inputPlaceholder: "Search"
  },
  GenericTable: {
    pagination: "{start} - {end} of {total}"
  },
  GoBackButton: {
    text: "Back"
  },
  LanguageSelector: {
    title: "Choose a language"
  },

  // ==========
  // Specific components
  AppHeaderMenu: {
    entrySettings: "Account settings",
    entryConnect: "BIMData Connect",
    entryDocumentation: "Documentation",
    entryMarketplace: "Marketplace",
    entryLanguage: "Choose a language",
    logoutButtonText: "Log Out"
  },

  BreadcrumbProjectSelector: {
    placeholder: "< No project >"
  },

  DashboardInfoTile: {
    title: "Security"
  },

  DashboardProjectList: {
    title: "Recent projects"
  },

  DashboardSpaceList: {
    title: "Recent spaces"
  },

  DashboardWelcomeTile: {
    title: "Dashboard",
    message: "Hi {name}, it's great to see you again !"
  },

  EmptyFilesManager: {
    onboardingText: "Upload your first file",
    uploadFileButtonText: "Upload a file",
    createFolderButtonText: "Create a folder"
  },

  EmptyModelsOverview: {
    onboardingText: "Upload your first IFC",
    uploadButtonText: "Upload IFC"
  },

  EmptyUsersManager: {
    onboardingText: "Invite your first collaborator",
    inviteButtonText: "Invite"
  },

  FileUploadCard: {
    cancelMessage: "Canceled",
    errorMessage: "Upload failed"
  },

  InvitationCard: {
    pendingMessage: "Invited - Pending.",
    resendLinkText: "Send invitation again ?"
  },

  InvitationForm: {
    emailInputPlaceholder: "Mail address",
    emailInputErrorMessage: "Invalid email",
    roleInputLabel: "Role",
    roles: {
      admin: "Administrator",
      user: "User",
      guest: "Guest"
    },
    cancelButtonText: "Cancel",
    submitButtonText: "Send invitation"
  },

  ModelActionsCell: {
    addTagsButtonText: "Add tags",
    renameButtonText: "Rename",
    archiveButtonText: "Archive",
    deleteButtonText: "Delete"
  },

  ModelLastUpdateCell: {
    at: "at"
  },

  ModelLocation: {
    emptyLocationMessage: "No location data available",
    addLocationButtonText: "Fill in"
  },

  ModelLocationForm: {
    addressInputPlaceholder: "Enter address",
    checkButtonText: "Check",
    submitButtonText: "Validate",
    cancelButtonText: "Change"
  },

  ModelNameCell: {
    inputErrorMessage: "Invalid model name",
    submitButtonText: "Validate"
  },

  ModelsActionBar: {
    deleteButtonText: "Delete",
    archiveButtonText: "Archive",
    downloadButtonText: "Download",
    mergeButtonText: "Merge"
  },

  ModelsDeleteModal: {
    title: "Warning !",
    message: "This action will permanently delete the following models :",
    cancelButtonText: "Cancel",
    deleteButtonText: "Delete"
  },

  ModelsManagerTable: {
    emptyTablePlaceholder: "No model",
    header: {
      id: "ID",
      name: "Name",
      version: "Version",
      creator: "Creator",
      lastupdate: "Last modified",
      status: "Status"
    }
  },

  ModelsMergeModal: {
    title: "Merge selection",
    inputPlaceholder: "Name of your merge",
    inputErrorMessage: "You must provide a name for the file",
    submitButtonText: "Export"
  },

  ProjectCardActionMenu: {
    renameButtonText: "Rename",
    deleteButtonText: "Delete"
  },

  ProjectCardDeleteGuard: {
    title: "Delete project",
    message: "Are you sure you want to (permanently) delete this project ?",
    deleteButtonText: "Delete"
  },

  ProjectCardUpdateForm: {
    title: "Rename project",
    inputPlaceholder: "Name",
    inputErrorMessage: "Invalid project name.",
    renameButtonText: "Rename"
  },

  ProjectCreationCard: {
    title: "New project",
    text: "Create a new project",
    inputPlaceholder: "Name",
    inputErrorMessage: "You must provide a name for the project !",
    createButtonText: "Create"
  },

  ProjectFilesManager: {
    title: "Project Files"
  },

  ProjectFileUploader: {
    uploadAreaText: "Drag and drop to store your project assets",
    separatorText: "or",
    uploadButtonText: "Select file"
  },

  ProjectModelsManager: {
    title: "Project Models",
    tabs: {
      ifc: "IFC",
      split: "Split / Export",
      merge: "Merge",
      archive: "Archives"
    }
  },

  ProjectModelsOverview: {
    title: "Project Models Overview"
  },

  ProjectUsersManager: {
    title: "Project Users",
    searchInputPlaceholder: "Search user"
  },

  SpaceCard: {
    projects: "PROJECTS"
  },

  SpaceCardActionMenu: {
    renameButtonText: "Rename",
    removeImageButtonText: "Remove image",
    deleteButtonText: "Delete"
  },

  SpaceCardDeleteGuard: {
    title: "Delete space",
    message: "Are you sure ?",
    deleteButtonText: "Delete"
  },

  SpaceCardUpdateForm: {
    title: "Rename space",
    inputPlaceholder: "Name",
    inputErrorMessage: "Invalid space name.",
    submitButtonText: "Rename"
  },

  SpaceCreationCard: {
    title: "New space",
    inputPlaceholder: "Name",
    inputErrorMessage: "You must provide a name for the space !",
    createButtonText: "Create"
  },

  SpaceImageInput: {
    changeImageButtonText: "Upload image"
  },

  SpaceUsersManager: {
    title: "Manage space admins",
    tabs: {
      admins: "Administrators",
      users: "Users"
    },
    searchInputPlaceholder: "Search user",
    addUserButtonText: "Add new admin"
  },

  UserCard: {
    self: "you"
  },

  UserCardDeleteGuard: {
    message: {
      space: "Remove {name} from this space ?",
      project: "Remove {name} from this project ?"
    },
    deleteButtonText: "Remove"
  },

  UserRoleBadge: {
    admin: "Admin",
    user: "User",
    guest: "Guest"
  },

  ViewerCard: {
    openButtonText: "Open"
  },

  ViewerCardModelPreview: {
    emptyPreviewPlaceholder: "No preview available"
  }
};
