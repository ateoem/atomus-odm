import {v1 as uuid} from "uuid";
import Document from "./Document";
import FieldValue from "./FieldValue";
import MappedDocument from "./MappedDocument";

class ManagedDocument extends Document {

    public get $id() {
        return this.document.$id;
    }

    public get $document(): MappedDocument {
        return this.document;
    }

    public get $changes() {
        return this.document.$changes;
    }

    public get $isDirty() {
        return this.isDirty;
    }

    private document: MappedDocument;
    private isDirty: boolean;

    constructor($document: MappedDocument) {
        super();
        this.document = $document;
        this.computeUuid();
        this.isDirty = false;
    }

    public getChild(name: string): MappedDocument {
        return this.document.getChild(name);
    }

    public computeChanges(dirtyDocument: ManagedDocument|MappedDocument): boolean {
        const documentToCompare = (dirtyDocument instanceof MappedDocument)
            ? dirtyDocument : dirtyDocument.$document;
        const isDirty = this.document.computeChanges(documentToCompare);
        this.isDirty = isDirty;
        return isDirty;
    }

    private computeUuid() {
        const uuidField = this.document.$mapping.$fields.get("id");
        if (!uuidField) {
            throw new Error("Id not present!");
        }
        const uuidFieldValue = this.document.$fieldValues.get("id");
        if (uuidFieldValue.$value !== "") {
            return;
        }
        const uuidFieldValueTmp = new FieldValue(uuidField, uuid());
        this.document.$fieldValues.set("id", uuidFieldValueTmp);
    }
}

export default ManagedDocument;
