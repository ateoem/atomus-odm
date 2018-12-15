import AggregateChange from "../../../src/Model/Aggregate/AggregateChange";
import FieldType from "../../../src/Model/Mapping/FieldType";
import ScalarField from "../../../src/Model/Mapping/ScalarField";

describe("AggregateChange", () => {
    it("should have setters/getters.", () => {
        const field = new ScalarField("test", FieldType.string);
        const change = new AggregateChange(field, {value: 1}, {value: 2});
        expect(change.$field).toBe(field);
        expect(change.$changed).toEqual({value: 2});
        expect(change.$old).toEqual({value: 1});
    });
});
