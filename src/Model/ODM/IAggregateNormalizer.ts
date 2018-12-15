import Aggregate from "../Aggregate/Aggregate";
import AggregateMapping from "../Mapping/AggregateMapping";

interface IAggregateNormalizer {
    normalize(aggregate: Aggregate): object;
    denormalize(payload: object, mapping: AggregateMapping): Aggregate;
}

export default IAggregateNormalizer;
