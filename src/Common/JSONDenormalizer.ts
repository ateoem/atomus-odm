import Aggregate from "../Model/Aggregate/Aggregate";
import FieldValue from "../Model/Aggregate/FieldValue";
import IAggregateNormalizer from "../Model/ODM/IAggregateNormalizer";
import AggregateMapping from "../Model/Mapping/AggregateMapping";

class JSONDenormalizer implements IAggregateNormalizer {
    public normalize(aggregate: Aggregate): object {
        return aggregate.$fieldValues.reduce((previousValue, fieldValue: FieldValue) => {
            return {...previousValue };
        }, {});
    }

    public denormalize(payload: object, mapping: AggregateMapping): Aggregate {
        const aggregate = Aggregate.createFromFieldValues(mapping.$name, mapping.$fields);
        mapping.$fields.forEach((field) => {
            
        });
        return new Aggregate();
    }
}

export default JSONDenormalizer;
