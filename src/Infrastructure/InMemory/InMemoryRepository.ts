import AggregateMapping from "../../Model/Mapping/AggregateMapping";
import AggregateManager from "../../Model/ODM/AggregateManager";
import AggregateRepository from "../../Model/ODM/AggregateRepository";

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
        return Promise.resolve(this.data.get(uuid));
    }

    public findOneBy(uuid: string): Promise<object> {
        return Promise.resolve(this.data.get(uuid));
    }

    public findBy(criterias: []): Promise<object[]> {
        throw new Error("Method not implemented.");
    }

    public findAll(): Promise<object[]> {
        throw new Error("Method not implemented.");
    }

}

export default InMemoryRepository;
