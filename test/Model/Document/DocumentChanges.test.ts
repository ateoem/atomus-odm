import AggregateChange from "../../../src/Model/Document/DocumentChange";
import AggregateChanges from "../../../src/Model/Document/DocumentChanges";
import Field from "../../../src/Model/Mapping/Field";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("DocumentChanges", () => {
    it("should have setters/getters.", () => {
        const field = new Field("test", FieldType.string);
        const change = new AggregateChange(field, {value: 1}, {value: 2});
        const aggregateChanges = new AggregateChanges();
        aggregateChanges.setChange(change);
        expect(aggregateChanges.$changed.size).toBe(1);
        expect(aggregateChanges.$changed.get("test")).toEqual(change);
    });
});
