import Aggregate from "../../src/Model/Aggregate/Aggregate";
import AggregateChanges from "../../src/Model/Aggregate/AggregateChanges";
import ManagedAggregate from "../../src/Model/ODM/ManagedAggregate";
describe("ManagedAggregate", () => {
    it("should have getters/setters.", () => {
        const aggregate = new Aggregate();
        const changes = new AggregateChanges();
        const managedAggregate = new ManagedAggregate(aggregate, changes);
        expect(managedAggregate.$changes).toBe(changes);
        expect(managedAggregate.$aggregate).toBe(aggregate);
    });
});
