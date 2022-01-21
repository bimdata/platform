import { set } from "@/utils/misc.js";

describe("Misc Utils", () => {
  test("Should not throw on undefined object", () => {
    const obj = undefined;
    const path = ["a", "b", "c"];
    const value = 32;

    expect(() => set(obj, path, value)).not.toThrow();
  });

  test("Should do nothing if obj is not an object.", () => {
    const obj1 = "xyz";
    const obj2 = 123;
    const obj3 = true;
    const obj4 = 456n;

    const path = ["a", "b", "c"];
    const value = 32;

    set(obj1, path, value);
    expect(obj1).toBe("xyz");
    set(obj2, path, value);
    expect(obj2).toBe(123);
    set(obj3, path, value);
    expect(obj3).toBe(true);
    set(obj4, path, value);
    expect(obj4).toBe(456n);
  });

  test("Should do nothing on undefined path", () => {
    const obj = {};
    const path = undefined;
    const value = 32;

    set(obj, path, value);

    expect(obj).toStrictEqual({});
  });

  test("Should do nothing on empty path", () => {
    const obj = {};
    const path = [];
    const value = 32;

    set(obj, path, value);

    expect(obj).toStrictEqual({});
  });

  test("Should set object property", () => {
    const obj = {};
    const path = ["a", "b", "c"];
    const value = 32;

    set(obj, path, value);

    expect(obj).toStrictEqual({ a: { b: { c: 32 } } });
  });

  test("Should replace non-object properties by object", () => {
    const obj = { a: { b: 12 } };
    const path = ["a", "b", "c"];
    const value = 32;

    set(obj, path, value);

    expect(obj).toStrictEqual({ a: { b: { c: 32 } }});
  });

  test("Should replace nullish properties by object", () => {
    const obj1 = { a: { b: null } };
    const obj2 = { a: { b: undefined } }
    const path = ["a", "b", "c"];
    const value = 32;

    set(obj1, path, value);
    set(obj2, path, value);

    expect(obj1).toStrictEqual({ a: { b: { c: 32 } }});
    expect(obj2).toStrictEqual({ a: { b: { c: 32 } }});
  });

  test("Should preserve other object properties", () => {
    const obj = { d: "test" };
    const path = ["a", "b", "c"];
    const value = 32;

    set(obj, path, value);

    expect(obj).toStrictEqual({ a: { b: { c: 32 } }, d: "test" });
  });
});
