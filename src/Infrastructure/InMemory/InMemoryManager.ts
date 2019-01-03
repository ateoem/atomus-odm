import DocumentChange from "../../Model/Document/DocumentChange";
import FieldValue from "../../Model/Document/FieldValue";
import MappedDocument from "../../Model/Document/MappedDocument";
import ManagedDocument from "../../Model/Document/RootDocument";
import DocumentMapping from "../../Model/Mapping/DocumentMapping";
import Field from "../../Model/Mapping/Field";
import ChildField from "../../Model/Mapping/Fields/ChildField";
import ChildrenField from "../../Model/Mapping/Fields/ChildrenField";
import DocumentManager from "../../Model/ODM/DocumentManager";
import DocumentRepository from "../../Model/ODM/DocumentRepository";
import IDocumentNormalizer from "../../Model/ODM/IDocumentNormalizer";
import InMemoryRepository from "./InMemoryRepository";

class InMemoryManager extends DocumentManager {
    protected repositories: Map<string, InMemoryRepository>;

    constructor($normalizer: IDocumentNormalizer) {
        super($normalizer);
        this.repositories = new Map();
    }

    public getRepository(mappingName: string): InMemoryRepository {
        const mapping = this.mappings.get(mappingName);
        if (!mapping) {
            throw new Error(`Mapping "${mappingName}" not found!`);
        }
        if (!this.repositories.has(mappingName)) {
            this.repositories.set(mappingName, new InMemoryRepository(mapping, this));
        }

        return this.repositories.get(mappingName);
    }

    public flush() {
        this.managedDocuments.forEach( (document: ManagedDocument) => {
            const repository = this.getRepository(document.$document.$name);

            if (!document.$isDirty && repository.$data.has(document.$id)) {
                return;
            }
            this.updateDocument(document.$document);

            this.manageDocument(document);
            repository.$data.set(document.$id, this.$normalizer.normalize(document.$document));
        });
    }

    public updateDocument(document: MappedDocument) {
        document.$mapping.$fields.forEach((field: Field) => {
            if (field instanceof ChildField) {
                this.updateDocument(document.getChild(field.$name));
            } else if (field instanceof ChildrenField) {
                const children = document.getChildren(field.$name);
                const childrenNotRemoved = children.
                    filter((child: MappedDocument) => !child.$changes.has("delete"));
                document.setChildren(field.$name, childrenNotRemoved);
                childrenNotRemoved.forEach((child: MappedDocument) => {
                    this.updateDocument(child);
                });
            } else {
                if (!document.$changes.has(field.$name)) {
                    return;
                }
                const newValue = document.$changes.get(field.$name).$updated;
                document.$fieldValues.set(field.$name, new FieldValue(field, newValue));
                document.$changes.delete(field.$name);
            }
        });
    }
}

export default InMemoryManager;
