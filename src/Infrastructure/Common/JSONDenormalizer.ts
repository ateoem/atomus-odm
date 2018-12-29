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
        const obj = {};
        aggregate.$mapping.$fields.forEach((field: Field) => {
            if (field instanceof ChildField) {
                obj[field.$name] = this.normalize(aggregate.getChild(field.$name), true);
            } else if (field instanceof ChildrenField) {
                obj[field.$name] = aggregate.getChildren(field.$name)
                .map((child: MappedAggregate) => this.normalize(child, true));
            } else {
                obj[field.$name] = aggregate.$fieldValues.get(field.$name).$value;
            }
        });

        if (!isChild) {
            const metadata = {aggregateName: aggregate.$name};
            obj[this.manager.$symbol] = metadata;
        }

        return obj;
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
