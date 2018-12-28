import MappedAggregate from "../Document/MappedDocument";
import AggregateMapping from "../Mapping/DocumentMapping";
import AggregateManager from "./DocumentManager";

interface IAggregateNormalizer {
    normalize(aggregate: MappedAggregate): object;
    denormalize(payload: any): MappedAggregate;
    setAggregateManager(manager: AggregateManager);
}

export default IAggregateNormalizer;
