import Aggregate from "../Aggregate/Aggregate";
import AggregateMapping from "../Mapping/AggregateMapping";
import AggregateManager from "./AggregateManager";

interface IAggregateNormalizer {
    normalize(aggregate: Aggregate): object;
    denormalize(payload: any, mapping: AggregateMapping): Aggregate;
    setAggregateManager(manager: AggregateManager);
}

export default IAggregateNormalizer;
