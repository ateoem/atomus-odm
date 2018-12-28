import AggregateChange from "../../../src/Model/Aggregate/AggregateChange";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("AggregateChange", () => {
    it("should have setters/getters.", () => {
        const field = new Field("test", FieldType.string);
        const change = new AggregateChange(field, 1, 2);
        expect(change.$field).toBe(field);
        expect(change.$changed).toEqual("2");
        expect(change.$old).toEqual("1");
    });
});
