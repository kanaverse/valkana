import * as valkana from "../js/index.js";
import * as h5 from "h5wasm";

beforeAll(async () => {
  await valkana.initialize({ localFile: true });
  await h5.ready;
});

test("validateState does, at least, run", () => {
    const path = "TEST-dummy.h5";
    {
        let new_file = new h5.File(path, "w");
        new_file.close();
        expect(() => valkana.validateState(path, true, 2001000)).toThrow("inputs");
    }
  
    {
        let new_file = new h5.File(path, "w");
        new_file.create_group("inputs");
        new_file.close();
        expect(() => valkana.validateState(path, true, 2001000)).toThrow("parameters");
    }
})

test("validateInputsState does, at least, run", () => {
    const path = "TEST-dummy.h5";
    {
        let new_file = new h5.File(path, "w");
        new_file.close();
        expect(() => valkana.validateInputsState(path, true, 2001000)).toThrow("inputs");
    }
  
    {
        let new_file = new h5.File(path, "w");
        new_file.create_group("inputs");
        new_file.close();
        expect(() => valkana.validateInputsState(path, true, 2001000)).toThrow("parameters");
    }
})

test("validateQualityControlState does, at least, run", () => {
    const path = "TEST-dummy.h5";
    {
        let new_file = new h5.File(path, "w");
        new_file.close();
        expect(() => valkana.validateQualityControlState(path, 100, 1, 2001000)).toThrow("quality_control");
    }
  
    {
        let new_file = new h5.File(path, "w");
        new_file.create_group("quality_control");
        new_file.close();
        expect(() => valkana.validateQualityControlState(path, 100, 1, 2001000)).toThrow("parameters");
    }
})

test("validateAdtQualityControlState does, at least, run", () => {
    const path = "TEST-dummy.h5";
    {
        let new_file = new h5.File(path, "w");
        new_file.close();
        expect(() => valkana.validateAdtQualityControlState(path, 100, 1, true, 2001000)).toThrow("adt_quality_control");
    }
  
    {
        let new_file = new h5.File(path, "w");
        new_file.create_group("adt_quality_control");
        new_file.close();
        expect(() => valkana.validateAdtQualityControlState(path, 100, 1, true, 2001000)).toThrow("parameters");
    }
})

test("validateCombineEmbeddings does, at least, run", () => {
    const path = "TEST-dummy.h5";
    {
        let new_file = new h5.File(path, "w");
        new_file.close();
        expect(() => valkana.validateCombineEmbeddingsState(path, 100, ["ADT", "RNA"], 50, 2001000)).toThrow("combine_embeddings");
    }
  
    {
        let new_file = new h5.File(path, "w");
        new_file.create_group("combine_embeddings");
        new_file.close();
        expect(() => valkana.validateCombineEmbeddingsState(path, 100, ["ADT", "RNA"], 50, 2001000)).toThrow("parameters");
    }
})

