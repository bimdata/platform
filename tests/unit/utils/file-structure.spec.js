import { FileStructureHandler, getDescendants, segregate } from "../../../src/utils/file-structure";

const fileStructure = {
	id: 114758,
	parentId: null,
	type: "Folder",
	name: "My project",
	children: [
		{
			id: 114940,
			parentId: 114758,
			type: "Folder",
			name: "Folder-1",
			children: [
				{
					id: 3934,
					parentId: 114940,
					type: "Document",
					name: "model-preview.png"
				}
			]
		},
		{
			id: 114941,
			parentId: 114758,
			type: "Folder",
			name: "An empty folder",
			children: []
		},
		{
			id: 3943,
			parentId: 114758,
			type: "Document",
			name: "foo.txt"
		},
		{
			id: 3942,
			parentId: 114758,
			type: "Ifc",
			name: "my-awesome-model.ifc"
		},
		{
			id: 3941,
			parentId: 114758,
			type: "Ifc",
			name: "dummy.ifc",
		}
	]
};

describe("utils/file-structure - serialization/deserialization", () => {

  describe("Serialization", () => {
    it("Should throw with an undefined structure", () => {
      expect(() => new FileStructureHandler()).toThrow();
    });
  
    it("Should throw with an empty structure", () => {
      expect(() => new FileStructureHandler({})).toThrow();
    });
  
    it("Should throw structure root has no id", () => {
      expect(() => new FileStructureHandler({ name: "invalid struct" })).toThrow();
    });
  
    it("Should properly serialize a singleton structure", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123 });
      // Assert
      expect(handler.root).toEqual({ id: 123 });
      expect(handler.nodeMap.size).toBe(1);
      expect(handler.nodeMap.has(123)).toBeTruthy();
      expect(handler.structure()).toEqual({ id: 123, children: [] });
    });

    it("Should properly serialize a valid structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, children: [
          {
            id: 10, children: [
              { id: 30 }
            ]
          },
          { id: 20 }
        ]
      });
      // Assert
      expect(handler.root).toEqual({ id: 123 });
      expect(handler.nodeMap.size).toBe(4);
      expect(Array.from(handler.nodeMap.keys()))
        .toEqual(expect.arrayContaining([123, 10, 20, 30]));
    });
  });

  describe("Deserialization", () => {
    it("Should properly deserialize the entire structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, parentId: 123, name: "child 1", children: [
              { id: 30, parentId: 10, name: "child 3" }
            ]
          },
          { id: 20, parentId: 123, name: "child 2" }
        ]
      });
      // Assert
      expect(handler.structure()).toEqual({
        id: 123, name: "root", children: [
          {
            id: 10, parentId: 123, name: "child 1", children: [
              { id: 30, parentId: 10, name: "child 3", children: [] }
            ]
          },
          { id: 20, parentId: 123, name: "child 2", children: [] }
        ]
      });
    });

    it("Should properly deserialize a part of the structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, parentId: 123, name: "child 1", children: [
              { id: 30, parentId: 10, name: "child 3" }
            ]
          },
          { id: 20, parentId: 123, name: "child 2" }
        ]
      });
      // Assert
      expect(handler.structure({ id: 10 })).toEqual({
        id: 10, parentId: 123, name: "child 1", children: [
          { id: 30, parentId: 10, name: "child 3", children: [] }
        ]
      });
    });
  });

});

describe("utils/file-structure - accessors", () => {

  describe("Exists", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.exists()).toThrow();
    });

    it("Should return false if called with an invalid argument", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ name: "child" })).toBeFalsy();
    });

    it("Should return false if file does not exists in structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ id: 456 })).toBeFalsy();
    });

    it("Should return true if file exists in structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ id: 123 })).toBeTruthy();
    });
  });

  describe("Get", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.get()).toThrow();
    });
  
    it("Should return undefined if called with an invalid argument", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, name: "child" }
        ]
      });
      // Assert
      expect(handler.get({ name: "child" })).toBeUndefined();
    });
  
    it("Should return undefined if structure node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, name: "child" }
        ]
      });
      // Assert
      expect(handler.get({ id: 456 })).toBeUndefined();
    });
    
    it("Should return the specified structure node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 1", children: [
              { id: 20, name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.get({ id: 10 })).toEqual({
        id: 10,
        name: "child 1",
        children: []
      });
    });

    it("Should return the specified structure node with its children", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 1", children: [
              { id: 20, name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.get({ id: 10 }, { children: true })).toEqual({
        id: 10, name: "child 1", children: [
          { id: 20, name: "child 2", children: [] }
        ]
      });
    });
  });

  describe("Parent", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.parent()).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.parent({ id: 456 })).toThrow();
    });

    it("Should return null if the node has no parent", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          { id: 10, parentId: 123, name: "child 1" }
        ]
      });
      // Assert
      expect(handler.parent({ id: 123 })).toBeNull();
    });

    it("Should return the parent of the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 1", children: [
              { id: 20, name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.parent({ id: 20 })).toEqual({
        id: 10,
        name: "child 1",
        children: []
      });
    });
  });

  describe("Children", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.children()).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => handler.children({ id: 456 })).toThrow();
    });

    it("Should return an empty array if the node has no children", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(handler.children({ id: 123 })).toEqual([]);
    });

    it("Should return children of the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 1", children: [
              { id: 40, name: "child 4" }
            ]
          },
          { id: 20, name: "child 2" },
          { id: 30, name: "child 3" }
        ]
      });
      // Assert
      expect(handler.children({ id: 123 })).toEqual([
        { id: 10, name: "child 1", children: [] },
        { id: 20, name: "child 2", children: [] },
        { id: 30, name: "child 3", children: [] }
      ]);
    });
  });

  describe("Ancestors", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.ancestors()).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.ancestors({ id: 456 })).toThrow();
    });

    it("Should return an empty array if the node has no ancestors", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(hanlder.ancestors({ id: 123 })).toEqual([]);
    });

    it("Should return the node ancestors array", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 10", children: [
              { id: 20, name: "child 20" },
              { id: 30, name: "child 30" }
            ]
          },
          { 
            id: 11, name: "child 11", children: [
              { id: 40, name: "child 40" },
              { id: 50, name: "child 50" }
            ]
          },
          { id: 12, name: "child 12" }
        ]
      });
      // Assert
      expect(hanlder.ancestors({ id: 40 })).toEqual([
        { id: 11, name: "child 11", children: [] },
        { id: 123, name: "root", children: [] }
      ]);
    });
  });

  describe("Descendants", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.descendants()).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.descendants({ id: 456 })).toThrow();
    });

    it("Should return an empty array if the node has no descendants", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(hanlder.descendants({ id: 123 })).toEqual([]);
    });

    it("Should return the node descendants array", () => {
      // TODO
      fail("Not implemented.");
    });
  });

  describe("Siblings", () => {
    it("Should throw if called without argument", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.siblings()).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, name: "root" });
      // Assert
      expect(() => hanlder.siblings({ id: 456 })).toThrow();
    });

    it("Should return an empty array if the node does not have any sibling", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 1", children: [
              { id: 20, name: "child 2" },
              { id: 30, name: "child 3" },
              { id: 40, name: "child 4" }
            ]
          }
        ]
      });
      // Assert
      expect(hanlder.siblings({ id: 10 })).toEqual([]);
    });

    it("Should return the node siblings", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, name: "root", children: [
          {
            id: 10, name: "child 10", children: [
              { id: 20, name: "child 20" },
              { id: 30, name: "child 30" }
            ]
          },
          { 
            id: 11, name: "child 11", children: [
              { id: 40, name: "child 40" },
              { id: 50, name: "child 50" }
            ]
          },
          { id: 12, name: "child 12" }
        ]
      });
      // Assert
      expect(hanlder.siblings({ id: 10 })).toEqual([
        { id: 11, name: "child 11", children: [] },
        { id: 12, name: "child 12", children: [] }
      ]);
    });
  });

});

describe("utils/file-structure - mutations", () => {
  
  describe("Create File", () => {
    // TODO
  });

  describe("Update File", () => {
    // TODO
  });

  describe("Delete File", () => {
    // TODO
  });

});

describe("utils/file-structure - functions", () => {

  describe("Get Descendants", () => {
    it("Should throw if called without argument", () => {
      expect(() => getDescendants()).toThrow();
    });

    it("Should return an empty array if file has no children", () => {
      expect(getDescendants({ id: 123 })).toEqual([]);
    })

    it("Should return file descendants", () => {
      expect(getDescendants({
        id: 10, children: [
          {
            id: 20, children: [
              { id: 30 }, { id: 31 }
            ]
          },
          {
            id: 21, children: [
              { id: 32 }
            ]
          }
        ]
      })).toEqual([
        {
          id: 20, children: [
            { id: 30 }, { id: 31 }
          ]
        },
        {
          id: 21, children: [
            { id: 32 }
          ]
        },
        { id: 30 },
        { id: 31 },
        { id: 32 }
      ]);
    });
  });

  describe("Segregate", () => {
    it("Should throw if called without argument", () => {
      expect(() => segregate()).toThrow();
    });

    it("Should return empty arrays if called with an empty list", () => {
      expect(segregate([])).toEqual({
        folders: [],
        documents: []
      });
    });

    it("Should return documents and folders in separated lists", () => {
      expect(segregate([
        { id: 10, name: "file 1", type: "Folder" },
        { id: 20, name: "file 2", type: "Document" },
        { id: 30, name: "file 3", type: "Ifc" },
        { id: 40, name: "file 4", type: "Folder" },
        { id: 50, name: "file 5", type: "Unknown type" },
        { id: 60, name: "file 6", type: "" },
        { id: 70, name: "file 7" }
      ])).toEqual({
        folders: [
          { id: 10, name: "file 1", type: "Folder" },
          { id: 40, name: "file 4", type: "Folder" }
        ],
        documents: [
          { id: 20, name: "file 2", type: "Document" },
          { id: 30, name: "file 3", type: "Ifc" },
          { id: 50, name: "file 5", type: "Unknown type" },
          { id: 60, name: "file 6", type: "" },
          { id: 70, name: "file 7" }
        ]
      });
    });
  });

});
