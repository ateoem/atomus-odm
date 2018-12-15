import AggregateMapping from "../Mapping/AggregateMapping";
import AggregateManager from "./AggregateManager";

abstract class AggregateRepository {
    protected aggregateMapping: AggregateMapping;
    protected aggregateManager: AggregateManager;

    constructor(aggregateMapping: AggregateMapping, aggregateManager: AggregateManager) {
        this.aggregateMapping = aggregateMapping;
        this.aggregateManager = aggregateManager;
    }

    public abstract findById(uuid: string): object;
    public abstract findOneBy(uuid: string): object;
    public abstract findBy(criterias: []): object[];
    public abstract findAll(): object[];
}

export default AggregateRepository;
