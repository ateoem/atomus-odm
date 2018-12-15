import Aggregate from "./Aggregate";

interface IAggregateNormalizer {
    normalize(aggregate: Aggregate): object;
    denormalize(payload: object): Aggregate;
}

export default IAggregateNormalizer;
