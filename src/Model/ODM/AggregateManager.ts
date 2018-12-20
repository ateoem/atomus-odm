import AggregateChanges from "../Aggregate/AggregateChanges";
import MappedAggregate from "../Aggregate/MappedAggregate";
import AggregateMapping from "../Mapping/AggregateMapping";
import IAggregateNormalizer from "./IAggregateNormalizer";
import ManagedAggregate from "./ManagedAggregate";

abstract class AggregateManager {
    private managedAggregates: Map<string, ManagedAggregate>;
    private normalizer: IAggregateNormalizer;
    private mappings: Map<string, AggregateMapping>;
    private metadataSymbol: symbol;

    constructor($normalizer: IAggregateNormalizer) {
        this.normalizer = $normalizer;
        this.metadataSymbol = Symbol();
        this.mappings = new Map();
        this.managedAggregates = new Map();
    }

    public persist(payload: object, mapping: AggregateMapping) {
        const dirtyAggregate = this.normalizer.denormalize(payload, mapping);
        const originAggregate: ManagedAggregate = this.managedAggregates.get(dirtyAggregate.$id);

        if (!originAggregate) {
            throw new Error("Aggregate not found!");
        }

        const changes: AggregateChanges = originAggregate.$aggregate.computeChanges(dirtyAggregate);
        originAggregate.updateChanges(changes);
    }

    public manageAggregate(aggregate: MappedAggregate) {
        if (this.managedAggregates.has(aggregate.$id)) {
            throw new Error("Entity already in manage!");
        }
        this.managedAggregates.set(aggregate.$id, new ManagedAggregate(aggregate));
    }

    public get $mappings(): Map<string, AggregateMapping> {
        return this.mappings;
    }

    public get $symbol(): symbol {
        return this.metadataSymbol;
    }

    public abstract flush();
}

export default AggregateManager;
