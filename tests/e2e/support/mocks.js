function createMock(spaceID, projectID, modelIDs = []) {
  const mock = [
    {
      name: `space-${spaceID}-users`,
      path: `/cloud/${spaceID}/user`,
      data: `spaces/${spaceID}/users.json`
    },
    {
      name: `space-${spaceID}-invitations`,
      path: `/cloud/${spaceID}/invitation`,
      data: `spaces/${spaceID}/invitations.json`
    },
    {
      name: `project-${projectID}-users`,
      path: `/cloud/${spaceID}/project/${projectID}/user`,
      data: `projects/${projectID}/users.json`
    },
    {
      name: `project-${projectID}-invitations`,
      path: `/cloud/${spaceID}/project/${projectID}/invitation`,
      data: `projects/${projectID}/invitations.json`
    },
    {
      name: `project-${projectID}-models`,
      path: `/cloud/${spaceID}/project/${projectID}/ifc`,
      data: `projects/${projectID}/models.json`
    },
    {
      name: `project-${projectID}-files`,
      path: `/cloud/${spaceID}/project/${projectID}/dms-tree`,
      data: `projects/${projectID}/file-structure.json`
    },
    {
      name: `project-${projectID}-groups`,
      path: `/cloud/${spaceID}/project/${projectID}/group`,
      data: `projects/${projectID}/groups.json`
    }
  ];
  for (const modelID of modelIDs) {
    mock.concat([
      {
        name: `model-${modelID}-site`,
        path: `/cloud/${spaceID}/project/${projectID}/ifc/${modelID}/element?type=IfcSite`,
        data: `models/${modelID}/ifc-site.json`
      },
      { name: `model-${modelID}-site`,
        path: `/cloud/${spaceID}/project/${projectID}/ifc/${modelID}/element?type=IfcSite`,
        data: `models/${modelID}/ifc-site.json`
      }
    ]);
  }
  return mock;
}

function spaceImage(spaceID) {
  return {
    path: `/space-image/${spaceID}`,
    data: `spaces/${spaceID}/image.jpg`
  };
}

function modelPreview(modelID) {
  return {
    path: `/model-preview/${modelID}`,
    data: `models/${modelID}/preview.png`
  };
}

const apiMocks = [
  { name: "user",     path: "/user",          data: "user.json"     },
  { name: "spaces",   path: "/cloud",         data: "spaces.json"   },
  { name: "projects", path: "/user/projects", data: "projects.json" },
  ...createMock(100, 100, [1001, 1002]),
  ...createMock(100, 101),
  ...createMock(200, 200),
  ...createMock(300, 300)
];

const fileMocks = [
  spaceImage(100),
  modelPreview(1001),
  modelPreview(1002)
];

export {
  apiMocks,
  fileMocks
};
