import { fileExtension, formatBytes } from "../../../src/utils/files.js";

describe("File Utils - file extension", () => {
  it("Should return file extension", () => {
    expect(fileExtension("hello-world.txt")).toBe(".txt");
    expect(fileExtension("This is a document.pdf")).toBe(".pdf");
    expect(fileExtension("myModel.xyz.ifc")).toBe(".ifc");
    expect(fileExtension(".gitignore")).toBe(".gitignore");
  });

  it("Should return an empty string if no extension", () => {
    expect(fileExtension("test")).toBe("");
    expect(fileExtension("test.")).toBe("");
    expect(fileExtension("t.e.s.t.")).toBe("");
    expect(fileExtension(".")).toBe("");
    expect(fileExtension("")).toBe("");
  });
});

describe("File Utils - format bytes", () => {
  it("Should return standard format", () => {
    expect(formatBytes(0.1234, 2)).toBe("0 Bytes");
    expect(formatBytes(0.3456, 2)).toBe("0 Bytes");
    expect(formatBytes(56.7, 2)).toBe("57 Bytes");
    expect(formatBytes(1024, 2)).toBe("1.00 KB");
    expect(formatBytes(1260, 2)).toBe("1.23 KB");
    expect(formatBytes(1048576, 2)).toBe("1.00 MB");
    expect(formatBytes(47521464.32, 2)).toBe("45.32 MB");
    expect(formatBytes(1073741824, 2)).toBe("1.00 GB");
    expect(formatBytes(6571299962.88, 2)).toBe("6.12 GB");
  });

  it("Should return '0 Bytes'", () => {
    expect(formatBytes()).toBe("0 Bytes");
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes("")).toBe("0 Bytes");
    expect(formatBytes("0.00")).toBe("0 Bytes");
    // expect(formatBytes(-1)).toBe("0 Bytes");
  });
});
