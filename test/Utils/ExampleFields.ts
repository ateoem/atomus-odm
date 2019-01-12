import Aggregate from "../../src/Model/Mapping/Aggregate";
import IdField from "../../src/Model/Mapping/Field/IdField";
import NumberField from "../../src/Model/Mapping/Field/NumberField";
import StringField from "../../src/Model/Mapping/Field/StringField";
import FieldCollection from "../../src/Model/Mapping/FieldCollection";
import NumberFieldValue from "../../src/Model/Mapping/FieldValue/NumberFieldValue";
import StringFieldValue from "../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../src/Model/Mapping/FieldValueCollection";

export const FIELD_NAME = new StringField("name");
export const FIELD_SURNAME = new StringField("surname");
export const FIELD_AGE = new NumberField("age");
export const FIELD_ADDRESS = new StringField("address");
export const FIELD_MONGODBID = new IdField("_id");

export const FIELD_VALUE_NAME = new StringFieldValue(FIELD_NAME, "Jan");
export const FIELD_VALUE_AGE = new NumberFieldValue(FIELD_AGE, 10);
export const FIELD_VALUE_SURNAME = new StringFieldValue(FIELD_SURNAME, "Kowalski");


export const FIELDS_ARRAY_USER = [FIELD_NAME, FIELD_SURNAME];

export const FIELDS_USER = new FieldCollection("user", [FIELD_NAME, FIELD_SURNAME]);
export const FIELDS_USER_AGE = new FieldCollection("user_age", [...FIELDS_ARRAY_USER, FIELD_AGE]);

export const FIELD_VALUES_USER_JOE_DOE = new FieldValueCollection([new StringFieldValue(FIELD_NAME, "Joe"), new StringFieldValue(FIELD_SURNAME, "Doe")]);
export const FIELD_VALUES_USER_JAN_KOWALSKI = new FieldValueCollection([new StringFieldValue(FIELD_NAME, "Jan"), new StringFieldValue(FIELD_SURNAME, "Kowalski")]);

export const AGGREGATE_USER_JOE_DOE = new Aggregate(FIELDS_USER, FIELD_VALUES_USER_JOE_DOE);
export const AGGREGATE_USER_JAN_KOWALSKI = new Aggregate(FIELDS_USER, FIELD_VALUES_USER_JAN_KOWALSKI);

export const AGGREGATE_USERAGE_JOE_DOE = new Aggregate(FIELDS_USER_AGE, new FieldValueCollection([...FIELD_VALUES_USER_JOE_DOE.$fieldValuesArray, FIELD_VALUE_AGE]));
export const AGGREGATE_USERAGE_JAN_KOWALSKI = new Aggregate(FIELDS_USER_AGE, new FieldValueCollection([...FIELD_VALUES_USER_JAN_KOWALSKI.$fieldValuesArray, FIELD_VALUE_AGE]));
