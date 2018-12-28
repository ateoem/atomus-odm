import AggregateChanges from "../Document/DocumentChanges";
import MappedAggregate from "../Document/MappedDocument";
import AggregateMapping from "../Mapping/DocumentMapping";
import AggregateRepository from "./DocumentRepository";
import IAggregateNormalizer from "./IDocumentNormalizer";
import ManagedAggregate from "../Document/ManagedDocument";

abstract class AggregateManager {
    protected managedAggregates: Map<string, ManagedAggregate>;
    protected normalizer: IAggregateNormalizer;
    protected mappings: Map<string, AggregateMapping>;
    protected metadataSymbol: symbol;

    constructor($normalizer: IAggregateNormalizer) {
        this.normalizer = $normalizer;
        this.metadataSymbol = Symbol();
        this.mappings = new Map();
        this.managedAggregates = new Map();
    }

    public persist(payload: object) {
        const dirtyAggregate = this.normalizer.denormalize(payload);
        const originAggregate: ManagedAggregate = this.managedAggregates.get(dirtyAggregate.$id);

        if (!originAggregate) {
            throw new Error("Aggregate not found!");
        }

        const changes: AggregateChanges = originAggregate.$aggregate.computeChanges(dirtyAggregate);
        originAggregate.updateChanges(changes);
    }

    public manageAggregate(aggregate: ManagedAggregate) {
        this.managedAggregates.set(aggregate.$id, aggregate);
    }

    public createNewAggregate(mapping: AggregateMapping|string): object {
        let newAggregate: ManagedAggregate;
        if (mapping instanceof AggregateMapping) {
            newAggregate = new ManagedAggregate(new MappedAggregate(mapping));
        } else {
            const retrievedMapping = this.mappings.get(mapping);
            if (!retrievedMapping) {
                throw new Error("Mapping not found!");
            }
            newAggregate = new ManagedAggregate(new MappedAggregate(retrievedMapping));
        }

        this.manageAggregate(newAggregate);
        return this.normalizer.normalize(newAggregate.$aggregate);
    }

    public abstract getRepository(mapping: AggregateMapping|string): AggregateRepository;

    public get $mappings(): Map<string, AggregateMapping> {
        return this.mappings;
    }

    public get $symbol(): symbol {
        return this.metadataSymbol;
    }

    public get $normalizer(): IAggregateNormalizer {
        return this.normalizer;
    }

    public abstract flush();
}

export default AggregateManager;
