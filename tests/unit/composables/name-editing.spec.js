import { effectScope, nextTick, ref, watch } from "vue";
import { useNameEditing } from "../../../src/composables/name-editing.js";

describe("useNameEditing", () => {
  let scope;
  let rows;
  let editedNameId;
  let closeNameEditor;

  beforeEach(() => {
    scope = effectScope();
    rows = ref([{ id: 1 }, { id: 2 }]);
    ({ editedNameId, closeNameEditor } = scope.run(() =>
      useNameEditing(() => rows.value)
    ));
  });

  afterEach(() => {
    scope.stop();
  });

  it("starts with no editor open", () => {
    expect(editedNameId.value).toBeNull();
  });

  it("allows only one row to be edited at a time", () => {
    editedNameId.value = 1;
    editedNameId.value = 2;

    expect(rows.value.filter(row => row.id === editedNameId.value)).toEqual([{ id: 2 }]);
  });

  it("ignores close events from the previously edited or unmounted row", () => {
    editedNameId.value = 1;
    editedNameId.value = 2;
    closeNameEditor(1);

    expect(editedNameId.value).toBe(2);
  });

  it("keeps the new editor open when the old editor reacts to editMode becoming false", async () => {
    scope.run(() => {
      watch(
        () => editedNameId.value === 1,
        editing => {
          if (!editing) closeNameEditor(1);
        }
      );
    });

    editedNameId.value = 1;
    await nextTick();
    editedNameId.value = 2;
    await nextTick();

    expect(editedNameId.value).toBe(2);
  });

  it("clears editing when the active row closes or unmounts", () => {
    editedNameId.value = 1;
    closeNameEditor(1);

    expect(editedNameId.value).toBeNull();
  });

  it("handles a zero ID without treating it as no editor", () => {
    editedNameId.value = 0;
    closeNameEditor(1);
    expect(editedNameId.value).toBe(0);

    closeNameEditor(0);
    expect(editedNameId.value).toBeNull();
  });

  it("resets editing when the row collection is replaced", async () => {
    editedNameId.value = 1;
    rows.value = [{ id: 1 }, { id: 3 }];
    await nextTick();

    expect(editedNameId.value).toBeNull();

    editedNameId.value = 3;
    expect(editedNameId.value).toBe(3);
  });
});
