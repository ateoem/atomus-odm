import * as PropertyPath from "get-value";
import ManagedAggregate from "../../Model/Document/RootDocument";
import AggregateMapping from "../../Model/Mapping/DocumentMapping";
import AggregateManager from "../../Model/ODM/DocumentManager";
import AggregateRepository from "../../Model/ODM/DocumentRepository";

class InMemoryRepository extends AggregateRepository {
    protected data: Map<string, object>;

    constructor(aggregateMapping: AggregateMapping, aggregateManager: AggregateManager) {
        super(aggregateMapping, aggregateManager);
        this.data = new Map();
    }

    public get $data() {
        return this.data;
    }

    public findById(uuid: string): Promise<object> {
        const json = this.data.get(uuid);
        this.aggregateManager.manageAggregate(
            new ManagedAggregate(this.aggregateManager.$normalizer.denormalize(json)));
        return Promise.resolve(json);
    }

    public findOneBy(uuid: string): Promise<object> {
        const json = this.data.get(uuid);
        this.aggregateManager.manageAggregate(
            new ManagedAggregate(this.aggregateManager.$normalizer.denormalize(json)));
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
