import AggregateChange from "../../Model/Document/DocumentChange";
import FieldValue from "../../Model/Document/FieldValue";
import MappedAggregate from "../../Model/Document/MappedDocument";
import ManagedAggregate from "../../Model/Document/RootDocument";
import AggregateMapping from "../../Model/Mapping/DocumentMapping";
import Field from "../../Model/Mapping/Field";
import ChildField from "../../Model/Mapping/Fields/ChildField";
import ChildrenField from "../../Model/Mapping/Fields/ChildrenField";
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

            if (!aggregate.$isDirty && repository.$data.has(aggregate.$id)) {
                return;
            }
            this.updateAggregate(aggregate.$aggregate);

            this.manageAggregate(aggregate);
            repository.$data.set(aggregate.$id, this.$normalizer.normalize(aggregate.$aggregate));
        });
    }

    public updateAggregate(aggregate: MappedAggregate) {
        aggregate.$mapping.$fields.forEach((field: Field) => {
            if (field instanceof ChildField) {
                this.updateAggregate(aggregate.getChild(field.$name));
            } else if (field instanceof ChildrenField) {
                const children = aggregate.getChildren(field.$name);
                const childrenNotRemoved = children.
                    filter((child: MappedAggregate) => !child.$changes.has("delete"));
                aggregate.setChildren(field.$name, childrenNotRemoved);
                childrenNotRemoved.forEach((child: MappedAggregate) => {
                    this.updateAggregate(child);
                });
            } else {
                if (!aggregate.$changes.has(field.$name)) {
                    return;
                }
                const newValue = aggregate.$changes.get(field.$name).$changed;
                aggregate.$fieldValues.set(field.$name, new FieldValue(field, newValue));
                aggregate.$changes.delete(field.$name);
            }
        });
    }
}

export default InMemoryManager;
