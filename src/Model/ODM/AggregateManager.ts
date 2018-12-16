import Aggregate from "../Aggregate/Aggregate";
import AggregateChanges from "../Aggregate/AggregateChanges";
import AggregateMapping from "../Mapping/AggregateMapping";
import IAggregateNormalizer from "./IAggregateNormalizer";
import ManagedAggregate from "./ManagedAggregate";

abstract class AggregateManager {
    private managedAggregates: ManagedAggregate[];
    private normalizer: IAggregateNormalizer;
    private mappings: AggregateMapping[];
    private metadataSymbol: symbol;

    constructor($normalizer: IAggregateNormalizer) {
        this.normalizer = $normalizer;
        this.metadataSymbol = Symbol();
        this.mappings = [];
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
        this.managedAggregates.push(new ManagedAggregate(aggregate));
    }

    public get $mappings(): AggregateMapping[] {
        return this.mappings;
    }

    public get $symbol(): symbol {
        return this.metadataSymbol;
    }

    public abstract flush();
}

export default AggregateManager;
