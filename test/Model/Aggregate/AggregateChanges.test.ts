import AggregateChange from "../../../src/Model/Aggregate/AggregateChange";
import AggregateChanges from "../../../src/Model/Aggregate/AggregateChanges";
import FieldType from "../../../src/Model/Mapping/FieldType";
import ScalarField from "../../../src/Model/Mapping/ScalarField";
describe("AggregateChanges", () => {
    it("should have setters/getters.", () => {
        const field = new ScalarField("test", FieldType.string);
        const change = new AggregateChange(field, {value: 1}, {value: 2});
        const aggregateChanges = new AggregateChanges();
        aggregateChanges.addChange(change);
        expect(aggregateChanges.length()).toBe(1);
        expect(aggregateChanges.$changed).toEqual([change]);
    });
});
