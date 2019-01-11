import generateFieldValue from "../../Model/Mapping";
import FieldValue from "../../Model/Mapping/FieldValue";
import DocumentManager from "../../Model/ODM/DocumentManager";
import IDocumentNormalizer from "../../Model/ODM/IDocumentNormalizer";
import MappedDocument from "../../Model/ODM/MappedDocument";
import DocumentMapping from "../../Model/Schema/DocumentMapping";
import Field from "../../Model/Schema/Field";
import ChildField from "../../Model/Schema/Fields/ChildField";
import ChildrenField from "../../Model/Schema/Fields/ChildrenField";
import FieldType from "../../Model/Schema/FieldType";

class JSONDenormalizer implements IDocumentNormalizer {
    private manager: DocumentManager;

    public normalize(document: MappedDocument, isChild: boolean = false): object {
        const obj = {};
        document.$mapping.$fields.forEach((field: Field) => {
            if (field instanceof ChildField) {
                obj[field.$name] = this.normalize(document.getChild(field.$name), true);
            } else if (field instanceof ChildrenField) {
                obj[field.$name] = document.getChildren(field.$name)
                .map((child: MappedDocument) => this.normalize(child, true));
            } else {
                obj[field.$name] = document.$fieldValues.get(field.$name).$value;
            }
        });

        if (!isChild) {
            const metadata = {documentName: document.$name};
            obj[this.manager.$symbol] = metadata;
        }

        return obj;
    }

    public denormalize(payload: any, mappingDocumentGiven: DocumentMapping = null): MappedDocument {
        const tmp = {...payload};
        const mappingDocument =
            mappingDocumentGiven || this.manager.$mappings.get(payload[this.manager.$symbol].documentName);
        if (!mappingDocument) {
            throw new Error(`Mapping "${payload[this.manager.$symbol].documentName}" not found!`);
        }
        const fieldVals = Object.keys(tmp).map((key) => {
            const gotField: Field = mappingDocument.$fields.get(key);
            if (gotField instanceof ChildField) {
                return generateFieldValue(
                    gotField,
                    this.denormalize(tmp[key], gotField.$mapping),
                );
            } else if (gotField instanceof ChildrenField) {
                const mappedArray = tmp[key].map((obj) =>
                    this.denormalize(obj, gotField.$mapping),
                );
                return generateFieldValue(gotField, mappedArray);
            } else {
                return generateFieldValue(gotField, tmp[key]);
            }
        });

        return new MappedDocument(mappingDocument, fieldVals);
    }

    public setDocumentManager(manager: DocumentManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
