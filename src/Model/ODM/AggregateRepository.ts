import AggregateMapping from "../Mapping/AggregateMapping";
import AggregateManager from "./AggregateManager";

abstract class AggregateRepository {
    protected aggregateMapping: AggregateMapping;
    protected aggregateManager: AggregateManager;

    constructor(aggregateMapping: AggregateMapping, aggregateManager: AggregateManager) {
        this.aggregateMapping = aggregateMapping;
        this.aggregateManager = aggregateManager;
    }

    public abstract findById(uuid: string): Promise<object>;
    public abstract findOneBy(uuid: string): Promise<object>;
    public abstract findBy(criterias: []): Promise<object[]>;
    public abstract findAll(): Promise<object[]>;
}

export default AggregateRepository;
