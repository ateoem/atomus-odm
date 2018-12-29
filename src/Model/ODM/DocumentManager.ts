import MappedDocument from "../Document/MappedDocument";
import ManagedDocument from "../Document/RootDocument";
import DocumentMapping from "../Mapping/DocumentMapping";
import DocumentRepository from "./DocumentRepository";
import IDocumentNormalizer from "./IDocumentNormalizer";

abstract class DocumentManager {
    protected managedDocuments: Map<string, ManagedDocument>;
    protected normalizer: IDocumentNormalizer;
    protected mappings: Map<string, DocumentMapping>;
    protected metadataSymbol: symbol;

    constructor($normalizer: IDocumentNormalizer) {
        this.normalizer = $normalizer;
        this.metadataSymbol = Symbol();
        this.mappings = new Map();
        this.managedDocuments = new Map();
    }

    public persist(payload: object) {
        const dirtyDocument: MappedDocument = this.normalizer.denormalize(payload);
        const originDocument: ManagedDocument = this.managedDocuments.get(dirtyDocument.$id);

        if (!originDocument) {
            throw new Error("Document not found!");
        }

        originDocument.computeChanges(dirtyDocument);
    }

    public manageMapping(mapping: DocumentMapping) {
        if (this.mappings.has(mapping.$name)) {
            throw new Error("Mapping in system!");
        }
        this.mappings.set(mapping.$name, mapping);
    }

    public manageDocument(document: ManagedDocument) {
        this.managedDocuments.set(document.$id, document);
    }

    public createNewDocument(mapping: DocumentMapping|string): object {
        let newDocument: ManagedDocument;
        if (mapping instanceof DocumentMapping) {
            newDocument = new ManagedDocument(new MappedDocument(mapping));
        } else {
            const retrievedMapping = this.mappings.get(mapping);
            if (!retrievedMapping) {
                throw new Error("Mapping not found!");
            }
            newDocument = new ManagedDocument(new MappedDocument(retrievedMapping));
        }

        this.manageDocument(newDocument);
        return this.normalizer.normalize(newDocument.$document);
    }

    public abstract getRepository(mapping: DocumentMapping|string): DocumentRepository;

    public get $mappings(): Map<string, DocumentMapping> {
        return this.mappings;
    }

    public get $symbol(): symbol {
        return this.metadataSymbol;
    }

    public get $normalizer(): IDocumentNormalizer {
        return this.normalizer;
    }

    public abstract flush();
}

export default DocumentManager;
