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
