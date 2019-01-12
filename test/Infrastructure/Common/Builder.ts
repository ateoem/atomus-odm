import JSONDenormalizer from "../../../src/Infrastructure/Common/JSONDenormalizer";
import ChildField from "../../../src/Model/Mapping/Field/ChildField";
import ChildrenField from "../../../src/Model/Mapping/Field/ChildrenField";
import Field from "../../../src/Model/Mapping/Field/Field";
import StringField from "../../../src/Model/Mapping/Field/StringField";
import UuidField from "../../../src/Model/Mapping/Field/UuidField";
import DocumentMapping from "../../../src/Model/Mapping/FieldCollection";
import ChildFieldValue from "../../../src/Model/Mapping/FieldValue/ChildFieldValue";
import ChildrenFieldValue from "../../../src/Model/Mapping/FieldValue/ChildrenFieldValue";
import FieldValue from "../../../src/Model/Mapping/FieldValue/FieldValue";
import StringFieldValue from "../../../src/Model/Mapping/FieldValue/StringFieldValue";
import IdFieldValue from "../../../src/Model/Mapping/FieldValue/UuidFieldValue";
import DocumentManager from "../../../src/Model/ODM/DocumentManager";
import MappedDocument from "../../../src/Model/ODM/MappedDocument";
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
            this.fieldValues.push(new IdFieldValue(field, value));
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
