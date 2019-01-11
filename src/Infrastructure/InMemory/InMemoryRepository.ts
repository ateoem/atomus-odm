import * as PropertyPath from "get-value";
import DocumentMapping from "../../Model/Mapping/FieldCollection";
import DocumentManager from "../../Model/ODM/DocumentManager";
import DocumentRepository from "../../Model/ODM/DocumentRepository";
import ManagedDocument from "../../Model/ODM/RootDocument";

class InMemoryRepository extends DocumentRepository {
    protected data: Map<string, object>;

    constructor(mapping: DocumentMapping, manager: DocumentManager) {
        super(mapping, manager);
        this.data = new Map();
    }

    public get $data() {
        return this.data;
    }

    public findById(uuid: string): Promise<object> {
        const json = this.data.get(uuid);
        this.manager.manageDocument(
            new ManagedDocument(this.manager.$normalizer.denormalize(json)));
        return Promise.resolve(json);
    }

    public findOneBy(uuid: string): Promise<object> {
        const json = this.data.get(uuid);
        this.manager.manageDocument(
            new ManagedDocument(this.manager.$normalizer.denormalize(json)));
        return Promise.resolve(json);
    }

    public findBy(criterias: {}): Promise<object[]> {
        return Promise.resolve(Array.from(this.$data.values()).filter((obj) => {
            return Object.keys(criterias).every(
                (key) => PropertyPath(obj, key) === criterias[key],
            );
        }));
    }

    public findAll(): Promise<object[]> {
        return Promise.resolve(Array.from(this.$data.values()));
    }

}

export default InMemoryRepository;
