import DocumentMapping from "../Mapping/FieldCollection";
import DocumentManager from "./DocumentManager";

abstract class DocumentRepository {
    protected mapping: DocumentMapping;
    protected manager: DocumentManager;

    constructor(mapping: DocumentMapping, manager: DocumentManager) {
        this.mapping = mapping;
        this.manager = manager;
    }

    public abstract findById(uuid: string): Promise<object>;
    public abstract findOneBy(uuid: string): Promise<object>;
    public abstract findBy(criterias: {}): Promise<object[]>;
    public abstract findAll(): Promise<object[]>;
}

export default DocumentRepository;
