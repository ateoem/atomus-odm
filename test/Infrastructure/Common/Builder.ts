import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import ChildFieldValue from "../../../src/Model/Mapping/ChildFieldValue";
import ChildrenFieldValue from "../../../src/Model/Mapping/ChildrenFieldValue";
import FieldValue from "../../../src/Model/Mapping/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/StringFieldValue";
import UuidFieldValue from "../../../src/Model/Mapping/UuidFieldValue";
import DocumentManager from "../../../src/Model/ODM/DocumentManager";
import MappedDocument from "../../../src/Model/ODM/MappedDocument";
import DocumentMapping from "../../../src/Model/Schema/DocumentMapping";
import Field from "../../../src/Model/Schema/Field";
import ChildField from "../../../src/Model/Schema/Fields/ChildField";
import ChildrenField from "../../../src/Model/Schema/Fields/ChildrenField";
import StringField from "../../../src/Model/Schema/Fields/StringField";
import UuidField from "../../../src/Model/Schema/Fields/UuidField";
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
            throw new Error("Field not found!" + name + this.mapping.$name);
        }
        if (field instanceof StringField) {
            this.fieldValues.push(new StringFieldValue(field, value));
        } else if (field instanceof UuidField) {
            this.fieldValues.push(new UuidFieldValue(field, value));
        } else if (field instanceof ChildrenField) {
            this.fieldValues.push(new ChildrenFieldValue(field, value));
        } else if (field instanceof ChildField) {
            this.fieldValues.push(new ChildFieldValue(field, value));
        }

        return this;
    }

    public build() {
        return new MappedDocument(this.mapping, this.fieldValues);
    }
}

// tslint:disable-next-line:max-classes-per-file
export class Builder {
    public static mapping(name: string): MappingBuilder {
        return new MappingBuilder(name);
    }

    public static mappedDocument(mapping: DocumentMapping): MappedDocumentBuilder {
        return new MappedDocumentBuilder(mapping);
    }

    public static documentManager(mappings: DocumentMapping[]): DocumentManager {
        const denormalizer = new JSONDenormalizer();
        const managerMock = new DocumentManagerMock(denormalizer);
        denormalizer.setDocumentManager(managerMock);
        mappings.forEach( (mapping) => managerMock.manageMapping(mapping));
        return managerMock;
    }
}
