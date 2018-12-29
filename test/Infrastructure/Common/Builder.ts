import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import FieldValue from "../../../src/Model/Document/FieldValue";
import MappedDocument from "../../../src/Model/Document/MappedDocument";
import DocumentMapping from "../../../src/Model/Mapping/DocumentMapping";
import Field from "../../../src/Model/Mapping/Field";
import DocumentManager from "../../../src/Model/ODM/DocumentManager";
import DocumentManagerMock from "./DocumentManagerMock";

class MappingBuilder {
    private fields: Field[];
    private name: string;

    constructor(name: string) {
        this.fields = [];
        this.name = name;
    }

    public addField(field: Field): MappingBuilder {
        this.fields.push(field);
        return this;
    }

    public build() {
        return new DocumentMapping(this.name, this.fields);
    }
}

// tslint:disable-next-line:max-classes-per-file
class MappedDocumentBuilder {
    private mapping: DocumentMapping;
    private fieldValues: FieldValue[];

    constructor(mapping: DocumentMapping) {
        this.mapping = mapping;
        this.fieldValues = [];
    }

    public addFieldValue(name: string, value: any) {
        const field = this.mapping.get(name);
        if (!field) {
            throw new Error("Field not found!" + this.mapping.$name);
        }
        this.fieldValues.push(new FieldValue(field, value));

        return this;
    }

    public build() {
        return new MappedDocument(this.mapping, this.fieldValues);
    }
}

// tslint:disable-next-line:max-classes-per-file
class Builder {
    public static mapping(name: string): MappingBuilder {
        return new MappingBuilder(name);
    }

    public static mappedDocument(mapping: DocumentMapping): MappedDocumentBuilder {
        return new MappedDocumentBuilder(mapping);
    }

    public static documentManager(): DocumentManager {
        const denormalizer = new JSONDenormalizer();
        const managerMock = new DocumentManagerMock(denormalizer);
        denormalizer.setDocumentManager(managerMock);
        return managerMock;
    }
}

export default Builder;
