import AggregateChange from "../../Model/Document/DocumentChange";
import FieldValue from "../../Model/Document/FieldValue";
import ManagedAggregate from "../../Model/Document/RootDocument";
import AggregateMapping from "../../Model/Mapping/DocumentMapping";
import AggregateManager from "../../Model/ODM/DocumentManager";
import AggregateRepository from "../../Model/ODM/DocumentRepository";
import IAggregateNormalizer from "../../Model/ODM/IDocumentNormalizer";
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
