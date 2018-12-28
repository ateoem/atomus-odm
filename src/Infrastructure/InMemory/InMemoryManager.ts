import AggregateChange from "../../Model/Aggregate/AggregateChange";
import FieldValue from "../../Model/Aggregate/FieldValue";
import AggregateMapping from "../../Model/Mapping/AggregateMapping";
import AggregateManager from "../../Model/ODM/AggregateManager";
import AggregateRepository from "../../Model/ODM/AggregateRepository";
import IAggregateNormalizer from "../../Model/ODM/IAggregateNormalizer";
import ManagedAggregate from "../../Model/ODM/ManagedAggregate";
import InMemoryRepository from "./InMemoryRepository";

class InMemoryManager extends AggregateManager {
    protected repositories: Map<string, InMemoryRepository>;

    constructor($normalizer: IAggregateNormalizer) {
        super($normalizer);
        this.repositories = new Map();
    }

    public getRepository(mappingName: string): InMemoryRepository {
        const mapping = this.mappings.get(mappingName);
        if (!mapping) {
            throw new Error("Mapping not found!");
        }
        if (!this.repositories.has(mappingName)) {
            this.repositories.set(mappingName, new InMemoryRepository(mapping, this));
        }

        return this.repositories.get(mappingName);
    }

    public flush() {
        this.managedAggregates.forEach( (aggregate: ManagedAggregate) => {
            const repository = this.getRepository(aggregate.$aggregate.$name);

            if (aggregate.$changes.size === 0 && repository.$data.has(aggregate.$id)) {
                return;
            }
            const obj = {};
            if (!repository.$data.has(aggregate.$id)) {
                aggregate.$aggregate.$fieldValuesArray.forEach( (fieldValue: FieldValue) => {
                    obj[fieldValue.$field.$name] = fieldValue.$value;
                });
                repository.$data.set(aggregate.$id, obj);
            }
            const aggregateData = repository.$data.get(aggregate.$id);

            aggregate.$changes.forEach((change: AggregateChange) => {
                aggregateData[change.$field.$name] = change.$changed;
            });
        });
    }
}

export default InMemoryManager;
