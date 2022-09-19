import { MODEL_SOURCE, MODEL_TYPE } from "../../../src/config/models.js";
import { segregateBySource, segregateByType } from "../../../src/utils/models.js";

describe("Models Utils", () => {

  it("Should segregate by source", () => {
    // Arrange
    const models = [
      { id: 0, source: MODEL_SOURCE.UPLOAD },
      { id: 1, source: MODEL_SOURCE.UPLOAD },
      { id: 2, source: MODEL_SOURCE.OPTIMIZED },
      { id: 3, source: MODEL_SOURCE.SPLIT },
      { id: 4, source: MODEL_SOURCE.EXPORT },
      { id: 5, source: MODEL_SOURCE.MERGE },
      { id: 6, source: "Unknown" },
      { id: 7, source: MODEL_SOURCE.UPLOAD, archived: true },
      { id: 8, source: MODEL_SOURCE.OPTIMIZED, archived: true },
      { id: 9, source: MODEL_SOURCE.EXPORT, archived: true },
      { id: 10, source: MODEL_SOURCE.MERGE, archived: true },
      { id: 11, source: "Unknown", archived: true },
    ];

    // Act
    const result = segregateBySource(models);

    // Assert
    expect(result.upload).toEqual([
      models[0], models[1], models[2], models[6]
    ]);
    expect(result.split).toEqual([
      models[3], models[4]
    ]);
    expect(result.merge).toEqual([
      models[5]
    ]);
    expect(result.archive).toEqual([
      models[7], models[8], models[9], models[10], models[11]
    ]);
  });

  it("Should segregate by type", () => {
    // Arrange
    const models = [
      { id: 0, type: MODEL_TYPE.DWG },
      { id: 1, type: MODEL_TYPE.IFC },
      { id: 2, type: MODEL_TYPE.DWG },
      { id: 3, type: MODEL_TYPE.PDF },
      { id: 4, type: MODEL_TYPE.IFC },
      { id: 5, type: MODEL_TYPE.IFC },
      { id: 6, type: MODEL_TYPE.DWG },
    ];

    // Act
    const result = segregateByType(models);

    // Assert
    expect(result.dwg).toEqual([
      models[0], models[2], models[6]
    ]);
    expect(result.ifc).toEqual([
      models[1], models[4], models[5]
    ]);
    expect(result.pdf).toEqual([
      models[3]
    ]);
  });

});
