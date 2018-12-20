import MappedAggregate from "../Aggregate/MappedAggregate";
import AggregateMapping from "../Mapping/AggregateMapping";
import AggregateManager from "./AggregateManager";

interface IAggregateNormalizer {
    normalize(aggregate: MappedAggregate): object;
    denormalize(payload: any, mapping: AggregateMapping): MappedAggregate;
    setAggregateManager(manager: AggregateManager);
}

export default IAggregateNormalizer;
