import Aggregate from "../Aggregate/Aggregate";
import AggregateChanges from "../Aggregate/AggregateChanges";
import AggregateMapping from "../Mapping/AggregateMapping";
import IAggregateNormalizer from "./IAggregateNormalizer";
import ManagedAggregate from "./ManagedAggregate";

abstract class AggregateManager {
    private managedAggregates: ManagedAggregate[];
    private normalizer: IAggregateNormalizer;

    constructor($normalizer: IAggregateNormalizer) {
        this.normalizer = $normalizer;
    }

    public persist(payload: object, mapping: AggregateMapping) {
        const dirtyAggregate = this.normalizer.denormalize(payload, mapping);
        const originAggregate: ManagedAggregate = this.managedAggregates
        .find( (aggregate) => aggregate.id() === dirtyAggregate.id());

        if (!originAggregate) {
            throw new Error("Aggregate not found!");
        }

        const changes: AggregateChanges = originAggregate.$aggregate.computeChanges(dirtyAggregate);
        originAggregate.updateChanges(changes);
    }

    public manageAggregate(aggregate: Aggregate) {
        this.managedAggregates.push(new ManagedAggregate(aggregate, new AggregateChanges()));
    }

    public abstract flush();
}

export default AggregateManager;
