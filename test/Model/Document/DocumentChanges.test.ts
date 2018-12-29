import AggregateChange from "../../../src/Model/Document/DocumentChange";
import AggregateChanges from "../../../src/Model/Document/DocumentChanges";
import Field from "../../../src/Model/Mapping/Field";
import StringField from "../../../src/Model/Mapping/Fields/StringField";
import FieldType from "../../../src/Model/Mapping/FieldType";

describe("DocumentChanges", () => {
    it("should have setters/getters.", () => {
        const field = new StringField("test");
        const change = new AggregateChange(field, {value: 1}, {value: 2});
        const aggregateChanges = new AggregateChanges();
        aggregateChanges.setChange(change);
        expect(aggregateChanges.size()).toBe(1);
        expect(aggregateChanges.has("test")).toEqual(true);
        expect(aggregateChanges.get("test")).toEqual(change);
    });
});
