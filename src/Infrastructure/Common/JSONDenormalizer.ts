import FieldValue from "../../Model/Document/FieldValue";
import MappedDocument from "../../Model/Document/MappedDocument";
import DocumentMapping from "../../Model/Mapping/DocumentMapping";
import Field from "../../Model/Mapping/Field";
import ChildField from "../../Model/Mapping/Fields/ChildField";
import ChildrenField from "../../Model/Mapping/Fields/ChildrenField";
import FieldType from "../../Model/Mapping/FieldType";
import DocumentManager from "../../Model/ODM/DocumentManager";
import IDocumentNormalizer from "../../Model/ODM/IDocumentNormalizer";

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
            throw new Error("Mapping Document not found!");
        }
        const fieldVals = Object.keys(tmp).map((key) => {
            const gotField: Field = mappingDocument.$fields.get(key);
            if (gotField instanceof ChildField) {
                return new FieldValue(
                    gotField,
                    this.denormalize(tmp[key], gotField.$mapping),
                );
            } else if (gotField instanceof ChildrenField) {
                const mappedArray = tmp[key].map((obj) =>
                    this.denormalize(obj, gotField.$mapping),
                );
                return new FieldValue(gotField, mappedArray);
            } else {
                return new FieldValue(gotField, tmp[key]);
            }
        });

        return new MappedDocument(mappingDocument, fieldVals);
    }

    public setDocumentManager(manager: DocumentManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
