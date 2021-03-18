export default {
  Commons: {
    cancel: "Cancel",
    close: "Close",
    no: "No",
    yes: "Yes",
    at: "at"
  },
  oidc: {
    callbackErrorMessage: "An error occured during authentication...",
    tryAgain: "Try Again"
  },
  AppHeaderMenu: {
    settings: "Account settings",
    connect: "BIMData Connect",
    documentation: "Documentation",
    marketplace: "Marketplace",
    selectLanguage: "Choose a language",
    logout: "Log Out"
  },
  Breadcrumb: {
    back: "Back",
    search: "Search"
  },
  Dashboard: {
    welcomeTitle: "Dashboard",
    welcomeMessage: "Hi {name}, it's great to see you again",
    activeSpaces: "Active Spaces",
    viewSpaces: "View spaces",
    activeProjects: "Active Projects",
    viewProjects: "View projects",
    security: "Security"
  },
  LanguageSelector: {
    title: "Choose a language"
  },
  Spaces: {
    searchSpaces: "Search spaces",
    sortSpaces: "",
    createSpace: "Create a space",
    projects: "PROJECTS",
    SpaceCreationCard: {
      title: "New space",
      inputName: "Name",
      buttonCreate: "Create",
      errorMessage: "You must provide a name for the space !"
    },
    SpaceActionMenu: {
      rename: "Rename",
      changeImage: "Upload image",
      removeImage: "Remove image",
      leave: "Leave",
      delete: "Delete"
    },
    SpaceRenameForm: {
      title: "Rename space",
      inputName: "Name",
      buttonRename: "Rename",
      errorMessage: "Invalid space name."
    },
    SpaceDeleteGuard: {
      title: "Delete space",
      message: "Are you sure ?",
      buttonDelete: "Delete"
    }
  },
  DashboardSpaceList: {
    title: "Recent spaces"
  },
  DashboardProjectList: {
    title: "Recent projects"
  },
  Projects: {
    searchProjects: "Search projets",
    ProjectCreationCard: {
      text: "Create a new project",
      title: "New project",
      inputName: "Name",
      buttonCreate: "Create",
      errorMessage: "You must provide a name for the project !"
    },
    ProjectActionMenu: {
      rename: "Rename",
      delete: "Delete"
    },
    ProjectUpdateForm: {
      title: "Rename project",
      inputName: "Name",
      buttonRename: "Rename",
      errorMessage: "Invalid project name."
    },
    ProjectDeleteGuard: {
      title: "Delete project",
      message: "Are you sure you want to (permanently) delete this project ?",
      buttonDelete: "Delete"
    }
  },
  SpaceUsersManager: {
    adminTabLabel: "Administrators",
    userTabLabel: "Users",
    title: "Manage space admins",
    searchUsers: "Search user",
    addUserButton: "Add new admin"
  },
  InvitationForm: {
    inputEmail: "Mail address",
    errorMessage: "Invalid email",
    inputRole: "Role",
    roles: {
      admin: "Administrator",
      user: "User",
      guest: "Guest"
    },
    buttonCancel: "Cancel",
    buttonSubmit: "Send invitation"
  },
  User: {
    self: "you",
    admin: "Admin",
    user: "User",
    guest: "Guest",
    UserDeleteGuard: {
      message: {
        space: "Remove {name} from this space ?",
        project: "Remove {name} from this project ?"
      },
      buttonDelete: "Remove"
    }
  },
  Invitation: {
    pending: "Invited - Pending.",
    sendAgain: "Send invitation again ?"
  },
  ProjectBoard: {
    projectTabLabel: "Project",
    bcfTabLabel: "BCF",
    addIFC: "Add an IFC",
    ProjectModelsOverview: {
      title: "Project Models Overview"
    },
    ProjectModelsManager: {
      title: "Project Models",
      onboardingText: "Upload your first IFC",
      buttonUpload: "Upload IFC",
      tabs: {
        ifc: "IFC",
        split: "Split / Export",
        merge: "Merge",
        archive: "Archives"
      },
      table: {
        id: "ID",
        name: "Name",
        version: "Version",
        creator: "Creator",
        lastupdate: "Last modified",
        status: "Status"
      }
    },
    ProjectUsersManager: {
      title: "Project Users",
      onboardingText: "Invite your first collaborator",
      buttonInvite: "Invite",
      searchUsers: "Search user"
    },
    ProjectFilesManager: {
      title: "Project Files",
      onboardingText: "Upload your first file",
      buttonUploadFile: "Upload a file",
      buttonCreateFolder: "Create a folder"
    }
  },
  ViewerCard: {
    buttonOpen: "Open"
  },
  ViewerCardModelPreview: {
    noPreview: "No preview available"
  },
  ModelLocation: {
    noLocationMessage: "No location data available",
    buttonAddLocation: "Fill in"
  },
  ModelLocationForm: {
    inputAddress: "Enter address",
    buttonCheck: "Check",
    buttonSubmit: "Validate",
    buttonCancel: "Change"
  }
};
