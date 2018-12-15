import ManagedAggregate from "./ManagedAggregate";
import Aggregate from "./Aggregate";
import AggregateChanges from "./AggregateChanges";

test("ManagedAggregate", () => {
    const aggregate = new Aggregate();
    const changes = new AggregateChanges();
    const managedAggregate = new ManagedAggregate(aggregate, changes);
    expect(managedAggregate.$changes).toBe(changes);
    expect(managedAggregate.$aggregate).toBe(aggregate);
});
