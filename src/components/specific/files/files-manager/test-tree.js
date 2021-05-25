export default {
  id: 0,
  name: "root",
  children: [
    {
      id: 11,
      name: "model-1",
      type: "Ifc"
    },
    {
      id: 12,
      name: "Dossier de Toto",
      type: "Folder",
      children: [
        {
          id: 21,
          name: "Doc 1",
          type: "Document"
        },
        {
          id: 22,
          name: "document important",
          type: "Document"
        },
        {
          id: 23,
          name: "Sub Folder",
          type: "Folder",
          children: [
            {
              id: 31,
              name: "model-2",
              type: "Ifc"
            }
          ]
        },
        {
          id: 1001,
          name: "Sub Folder",
          type: "Folder",
          children: [
            {
              id: 1002,
              name: "Sub Folder",
              type: "Folder",
              children: [
                {
                  id: 1003,
                  name: "Sub Folder",
                  type: "Folder",
                  children: [
                    {
                      id: 1004,
                      name: "Sub Folder",
                      type: "Folder",
                      children: [
                        {
                          id: 1005,
                          name: "model-2",
                          type: "Folder"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 13,
      name: "Another Folder",
      type: "Folder",
      children: [
        {
          id: 24,
          name: "Model 1234",
          type: "Ifc"
        }
      ]
    },
    {
      id: 14,
      name: "Yet Another Folder",
      type: "Folder",
      children: [
        {
          id: 25,
          name: "Model 1234",
          type: "Ifc"
        }
      ]
    },
    {
      id: 16,
      name: "Folder 123",
      type: "Folder",
      children: [
        {
          id: 26,
          name: "Model 1234",
          type: "Ifc"
        }
      ]
    },
    {
      id: 17,
      name: "Folder ABC",
      type: "Folder",
      children: [
        {
          id: 27,
          name: "Model 1234",
          type: "Ifc"
        }
      ]
    }
  ]
};
