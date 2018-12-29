import FieldValue from "../../Model/Document/FieldValue";
import MappedAggregate from "../../Model/Document/MappedDocument";
import AggregateMapping from "../../Model/Mapping/DocumentMapping";
import Field from "../../Model/Mapping/Field";
import ChildField from "../../Model/Mapping/Fields/ChildField";
import ChildrenField from "../../Model/Mapping/Fields/ChildrenField";
import FieldType from "../../Model/Mapping/FieldType";
import AggregateManager from "../../Model/ODM/DocumentManager";
import IAggregateNormalizer from "../../Model/ODM/IDocumentNormalizer";

class JSONDenormalizer implements IAggregateNormalizer {
    private manager: AggregateManager;

    public normalize(aggregate: MappedAggregate, isChild: boolean = false): object {
        const fieldValuesArray = aggregate.$fieldValuesArray;
        const computedFields = fieldValuesArray.reduce((jsonObj: object, fieldValue: FieldValue) => {
            if (fieldValue.$type === FieldType.child) {
                jsonObj[fieldValue.$name] = this.normalize(fieldValue.$value, true);
            } else if (fieldValue.$type === FieldType.children) {
                jsonObj[fieldValue.$name] =
                    fieldValue.$value.map((childAggregate: MappedAggregate) => this.normalize(childAggregate, true) );
            } else {
                jsonObj[fieldValue.$name] = fieldValue.$value;
            }
            return {...jsonObj};
        }, {});

        if (!isChild) {
        const metadata = {aggregateName: aggregate.$name};
        computedFields[this.manager.$symbol] = metadata;
        }

        return computedFields;
    }

    public denormalize(payload: any, mappingAggregateGiven: AggregateMapping = null): MappedAggregate {
        const tmp = {...payload};
        const mappingAggregate =
            mappingAggregateGiven || this.manager.$mappings.get(payload[this.manager.$symbol].aggregateName);
        if (!mappingAggregate) {
            throw new Error("Mapping Aggregate not found!");
        }
        const fieldVals = Object.keys(tmp).map((key) => {
            const gotField: Field = mappingAggregate.$fields.get(key);
            if (gotField instanceof ChildField) {
                return new FieldValue(
                    gotField,
                    this.denormalize(tmp[key], gotField.$mapping),
                );
            } else if (gotField instanceof ChildrenField) {
                const mappedArray = tmp[key].map((obj) =>
                    this.denormalize(obj, gotField.$mapping),
                );
                return new FieldValue(gotField, mappedArray);
            } else {
                return new FieldValue(gotField, tmp[key]);
            }
        });

        return new MappedAggregate(mappingAggregate, fieldVals);
    }

    public setAggregateManager(manager: AggregateManager) {
        this.manager = manager;
    }

}

export default JSONDenormalizer;
