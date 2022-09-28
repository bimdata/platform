import { FileStructureHandler, getDescendants, segregate } from "../../../src/utils/file-structure.js";

describe("FileStructureHandler - serialize/deserialize", () => {

  describe("Serialize", () => {
    it("Should throw if structure is undefined, null or empty", () => {
      // Arrange
      const handler = new FileStructureHandler();
      // Assert
      expect(() => handler.serialize()).toThrow();
      expect(() => handler.serialize(null)).toThrow();
      expect(() => handler.serialize({})).toThrow();
    });
  
    it("Should throw if structure has no id", () => {
      // Arrange
      const handler = new FileStructureHandler();
      // Assert
      expect(() => handler.serialize({ nature: "Folder" })).toThrow();
    });

    it("Should throw if structure has no type", () => {
      // Arrange
      const handler = new FileStructureHandler();
      // Assert
      expect(() => handler.serialize({ id: 123 })).toThrow();
    });
  
    it("Should properly serialize a singleton structure", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(handler.root).toEqual({ id: 123, nature: "Folder" });
      expect(handler.nodeMap.size).toEqual(1);
      expect(Array.from(handler.nodeMap.keys())).toEqual(
        expect.arrayContaining([
          "Folder-123"
        ])
      );
    });

    it("Should properly serialize a valid structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", children: [
          {
            id: 10, nature: "Folder", children: [
              { id: 30, nature: "Document" }
            ]
          },
          { id: 20, nature: "Folder" }
        ]
      });
      // Assert
      expect(handler.root).toEqual({ id: 123, nature: "Folder" });
      expect(handler.nodeMap.size).toEqual(4);
      expect(Array.from(handler.nodeMap.keys())).toEqual(
        expect.arrayContaining([
          "Folder-123",
          "Folder-10",
          "Folder-20",
          "Document-30"
        ])
      );
    });
  });

  describe("Deserialize", () => {
    it("Should throw if root is not defined", () => {
      // Arrange
      const handler = new FileStructureHandler();
      // Assert
      expect(() => handler.deserialize()).toThrow();
    });

    it("Should properly deserialize the entire structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 30, nature: "Document", name: "child 3" }
            ]
          },
          { id: 20, nature: "Folder", name: "child 2" }
        ]
      });
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 30, nature: "Document", name: "child 3", children: [] }
            ]
          },
          { id: 20, nature: "Folder", name: "child 2", children: [] }
        ]
      });
    });

    it("Should properly deserialize a part of the structure", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 30, nature: "Document", name: "child 3" }
            ]
          },
          { id: 20, nature: "Folder", name: "child 2" }
        ]
      });
      // Assert
      expect(handler.deserialize({ id: 10, nature: "Folder" })).toEqual({
        id: 10, nature: "Folder", name: "child 1", children: [
          { id: 30, nature: "Document", name: "child 3", children: [] }
        ]
      });
    });
  });

});

describe("FileStructureHandler - accessors", () => {

  describe("Exists", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Assert
      expect(() => handler.exists()).toThrow();
      expect(() => handler.exists(null)).toThrow();
    });

    it("Should return false if file has no id", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ nature: "Folder" })).toBeFalsy();
    });

    it("Should return false if file has no type", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ id: 123 })).toBeFalsy();
    });

    it("Should return false if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ id: 456, nature: "Folder" })).toBeFalsy();
    });

    it("Should return true if the node exists", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.exists({ id: 123, nature: "Folder" })).toBeTruthy();
    });
  });

  describe("Get", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Assert
      expect(() => handler.get()).toThrow();
      expect(() => handler.get(null)).toThrow();
    });
  
    it("Should return undefined if file has no id", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.get({ nature: "Folder" })).toBeUndefined();
    });

    it("Should return undefined if file has no type", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.get({ id: 123 })).toBeUndefined();
    });
  
    it("Should return undefined if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, nature: "Document", name: "child" }
        ]
      });
      // Assert
      expect(handler.get({ id: 456, nature: "Folder" })).toBeUndefined();
    });
    
    it("Should return the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 20, nature: "Document", name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.get({ id: 10, nature: "Folder" })).toEqual({
        id: 10,
        nature: "Folder",
        name: "child 1",
        children: []
      });
    });

    it("Should return the node with its children", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 20, nature: "Document", name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.get({ id: 10, nature: "Folder" }, { children: true })).toEqual({
        id: 10, nature: "Folder", name: "child 1", children: [
          { id: 20, nature: "Document", name: "child 2", children: [] }
        ]
      });
    });
  });

  describe("Parent", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Assert
      expect(() => handler.parent()).toThrow();
      expect(() => handler.parent(null)).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Assert
      expect(() => handler.parent({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should return null if the node has no parent", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, parent_id: 123, nature: "Folder", name: "child 1" }
        ]
      });
      // Assert
      expect(handler.parent({ id: 123, nature: "Folder" })).toBeNull();
    });

    it("Should return the parent of the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "child 1", children: [
              { id: 20, parent_id: 10, nature: "Document", name: "child 2" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.parent({ id: 20, parent_id: 10, nature: "Document" })).toEqual({
        id: 10,
        parent_id: 123,
        nature: "Folder",
        name: "child 1",
        children: []
      });
    });
  });

  describe("Children", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.children()).toThrow();
      expect(() => handler.children(null)).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.children({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should return an empty array if the node has no children", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(handler.children({ id: 123, nature: "Folder" })).toEqual([]);
    });

    it("Should return children of the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 1", children: [
              { id: 40, nature: "Document", name: "child 4" }
            ]
          },
          { id: 20, nature: "Document", name: "child 2" },
          { id: 30, nature: "Ifc", name: "child 3" }
        ]
      });
      // Assert
      expect(handler.children({ id: 123, nature: "Folder" })).toEqual([
        { id: 10, nature: "Folder", name: "child 1", children: [] },
        { id: 20, nature: "Document", name: "child 2", children: [] },
        { id: 30, nature: "Ifc", name: "child 3", children: [] }
      ]);
    });
  });

  describe("Ancestors", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.ancestors()).toThrow();
      expect(() => hanlder.ancestors(null)).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.ancestors({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should return an empty array if the node has no ancestors", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(hanlder.ancestors({ id: 123, nature: "Folder" })).toEqual([]);
    });

    it("Should return the node ancestors", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "child 10", children: [
              { id: 20, parent_id: 10, nature: "Folder", name: "child 20" },
              { id: 30, parent_id: 10, nature: "Document", name: "child 30" }
            ]
          },
          { 
            id: 11, parent_id: 123, nature: "Folder", name: "child 11", children: [
              { id: 40, parent_id: 11, nature: "Document", name: "child 40" },
              { id: 50, parent_id: 11, nature: "Document", name: "child 50" }
            ]
          },
          { uuid: 12, parent_id: 123, nature: "Ifc", name: "child 12" }
        ]
      });
      // Assert
      expect(hanlder.ancestors({ id: 40, nature: "Document", parent_id: 11 })).toEqual([
        { id: 123, nature: "Folder", name: "root", children: [] },
        { id: 11, parent_id: 123, nature: "Folder", name: "child 11", children: [] }
      ]);
    });
  });

  describe("Descendants", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.descendants()).toThrow();
      expect(() => hanlder.descendants(null)).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.descendants({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should return an empty array if the node has no descendants", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(hanlder.descendants({ id: 123, nature: "Folder" })).toEqual([]);
    });

    it("Should return the node descendants", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "child 10", children: [
              { id: 20, nature: "Ifc", name: "child 20" },
              {
                id: 21, nature: "Folder", name: "child 21" , children: [
                  { id: 30, nature: "Document", name: "child 30", children: [] },
                ]
              },
              { 
                id: 22, nature: "Folder", name: "child 22", children: [
                  { id: 40, nature: "Ifc", name: "child 40" },
                  { id: 41, nature: "Document", name: "child 41" }
                ]
              }
            ]
          },
          { id: 11, nature: "Folder", name: "child 11" }
        ]
      });
      // Assert
      expect(hanlder.descendants({ id: 10, nature: "Folder" })).toEqual([
        { id: 20, nature: "Ifc", name: "child 20", children: [] },
        { id: 21, nature: "Folder", name: "child 21", children: [] },
        { id: 22, nature: "Folder", name: "child 22", children: [] },
        { id: 30, nature: "Document", name: "child 30", children: [] },
        { id: 40, nature: "Ifc", name: "child 40", children: [] },
        { id: 41, nature: "Document", name: "child 41", children: [] },
      ]);
    });
  });

  describe("Siblings", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.siblings()).toThrow();
      expect(() => hanlder.siblings(null)).toThrow();
    });

    it("Should throw if the node does not exist", () => {
      // Arrange
      const hanlder = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => hanlder.siblings({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should return an empty array if the node has no siblings", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "child 1", children: [
              { id: 20, parent_id: 10, nature: "Document", name: "child 2" },
              { id: 30, parent_id: 10, nature: "Folder", name: "child 3" },
              { id: 40, parent_id: 10, nature: "Folder", name: "child 4" }
            ]
          }
        ]
      });
      // Assert
      expect(hanlder.siblings({ id: 10, parent_id: 123, nature: "Folder" })).toEqual([]);
    });

    it("Should return the node siblings", () => {
      // Arrange
      const hanlder = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "child 10", children: [
              { id: 20, parent_id: 10, nature: "Document", name: "child 20" },
              { id: 30, parent_id: 10, nature: "Document", name: "child 30" }
            ]
          },
          { 
            id: 11, parent_id: 123, nature: "Folder", name: "child 11", children: [
              { id: 40, parent_id: 11, nature: "Folder", name: "child 40" },
              { id: 50, parent_id: 11, nature: "Ifc", name: "child 50" }
            ]
          },
          { id: 12, parent_id: 123, nature: "Document", name: "child 12" }
        ]
      });
      // Assert
      expect(hanlder.siblings({ id: 10, parent_id: 123, nature: "Folder" })).toEqual([
        { id: 11, parent_id: 123, nature: "Folder", name: "child 11", children: [] },
        { id: 12, parent_id: 123, nature: "Document", name: "child 12", children: [] }
      ]);
    });
  });

});

describe("FileStructureHandler - mutations", () => {
  
  describe("Create File", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.createFile()).toThrow();
      expect(() => handler.createFile(null)).toThrow();
    });

    it("Should throw if file has no id", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.createFile({})).toThrow();
      expect(() => handler.createFile({ parent_id: 123, nature: "Folder" })).toThrow();
    });

    it("Should throw if file has no type", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.createFile({ id: 10, parent_id: 123 })).toThrow();
    });

    it("Should throw if file has no parent id", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.createFile({ id: 10, nature: "Folder" })).toThrow();
    });

    it("Should properly create a simple file node", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Act
      handler.createFile({ id: 10, parent_id: 123, nature: "Folder", name: "new node" });
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, parent_id: 123, nature: "Folder", name: "new node", children: [] }
        ]
      });
    });

    it("Should properly create file node with its children", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder", name: "root" });
      // Act
      handler.createFile({
        id: 10, parent_id: 123, nature: "Folder", name: "new node", children: [
          { id: 20, parent_id: 10, nature: "Document", name: "child 1" },
          {
            id: 21, parent_id: 10, nature: "Folder", name: "child 2", children: [
              { id: 30, parent_id: 21, nature: "Ifc", name: "sub-child" }
            ]
          }
        ]
      });
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "new node", children: [
              { id: 20, parent_id: 10, nature: "Document", name: "child 1", children: [] },
              {
                id: 21, parent_id: 10, nature: "Folder", name: "child 2", children: [
                  { id: 30, parent_id: 21, nature: "Ifc", name: "sub-child", children: [] }
                ]
              }
            ]
          }
        ]
      });
    });
  });

  describe("Update File", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.updateFile()).toThrow();
      expect(() => handler.updateFile(null)).toThrow();
    });

    it("Should throw if file has no id", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.updateFile({})).toThrow();
      expect(() => handler.updateFile({ nature: "Folder" })).toThrow();
    });

    it.skip("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.updateFile({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should properly update the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "Child Name", children: [
              { id: 20, nature: "Document", name: "Child of the child" }
            ] 
          }
        ]
      });
      // Act
      handler.updateFile({ id: 10, nature: "Folder", name: "Updated Child Name" });
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, nature: "Folder", name: "Updated Child Name", children: [
              { id: 20, nature: "Document", name: "Child of the child", children: [] }
            ] 
          }
        ]
      });
    });
  });

  describe("Delete File", () => {
    it("Should throw if file is undefined or null", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.deleteFile()).toThrow();
      expect(() => handler.deleteFile(null)).toThrow();
    });

    it("Should throw if file has no id", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.deleteFile({})).toThrow();
      expect(() => handler.deleteFile({ nature: "Folder" })).toThrow();
    });

    it.skip("Should throw if the node does not exist", () => {
      // Arrange
      const handler = new FileStructureHandler({ id: 123, nature: "Folder" });
      // Assert
      expect(() => handler.deleteFile({ id: 456, nature: "Folder" })).toThrow();
    });

    it("Should properly delete the node", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 10, parent_id: 123, nature: "Folder", name: "node 1" },
          { id: 20, parent_id: 123, nature: "Document", name: "node 2" }
        ]
      });
      // Act
      handler.deleteFile({ id: 10, nature: "Folder" }); 
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 20, parent_id: 123, nature: "Document", name: "node 2", children: [] }
        ]
      });
    });

    it("Should properly delete the node with its children", () => {
      // Arrange
      const handler = new FileStructureHandler({
        id: 123, nature: "Folder", name: "root", children: [
          {
            id: 10, parent_id: 123, nature: "Folder", name: "node 1", children: [
              { id: 20, parent_id: 10, nature: "Document", name: "child node 1" },
              { id: 21, parent_id: 10, nature: "Ifc", name: "child node 2" }
            ]
          },
          { id: 11, parent_id: 123, nature: "Folder", name: "node 2" }
        ]
      });
      // Act
      handler.deleteFile({ id: 10, nature: "Folder" }); 
      // Assert
      expect(handler.deserialize()).toEqual({
        id: 123, nature: "Folder", name: "root", children: [
          { id: 11, parent_id: 123, nature: "Folder", name: "node 2", children: [] }
        ]
      });
    });
  });

});

describe("Functions", () => {

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
        { id: 10, name: "file 1", nature: "Folder" },
        { id: 20, name: "file 2", nature: "Document" },
        { id: 30, name: "file 3", nature: "Ifc" },
        { id: 40, name: "file 4", nature: "Folder" },
        { id: 50, name: "file 5", nature: "Unknown type" },
        { id: 60, name: "file 6", nature: "" },
        { id: 70, name: "file 7" }
      ])).toEqual({
        folders: [
          { id: 10, name: "file 1", nature: "Folder" },
          { id: 40, name: "file 4", nature: "Folder" }
        ],
        documents: [
          { id: 20, name: "file 2", nature: "Document" },
          { id: 30, name: "file 3", nature: "Ifc" },
          { id: 50, name: "file 5", nature: "Unknown type" },
          { id: 60, name: "file 6", nature: "" },
          { id: 70, name: "file 7" }
        ]
      });
    });
  });

});
