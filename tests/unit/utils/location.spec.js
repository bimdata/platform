import { DD2DMS, DMS2DD } from "../../../src/utils/location.js";

describe("DMS2DD location convert", () => {
  it("Should work with legacy errors values", () => {
    expect(DMS2DD([-33, 52, 11.43])).toBeCloseTo(-33.8698439);
  });

  it("Should work with valid negative values", () => {
    expect(DMS2DD([-33, -52, -11.438039999997507])).toBeCloseTo(-33.8698439);
  });
  it("Should work with valid positive values", () => {
    expect(DMS2DD([55, 45, 1.948320000002468])).toBeCloseTo(55.7505412);
  });

  it("Should work with string", () => {  // We have strings in some old IFCs
    expect(DMS2DD(["55", "45", "1.948320000002468"])).toBeCloseTo(55.7505412);
  });
});


describe("DD2DMS location convert", () => {
  it("Should work with legacy errors values", () => {
    expect(DD2DMS(-33.8698439, 151.2082848 )).toStrictEqual([[-33, -52, -11.438039999997507], [151, 12, 29.82528000000453]]);
  });
  it("Should work with valid positive values", () => {
    expect(DD2DMS(55.7505412, 37.6174782)).toStrictEqual([[55, 45, 1.948320000002468], [37, 37, 2.9215200000026087]]);
  });

});
