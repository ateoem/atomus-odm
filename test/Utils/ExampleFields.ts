import IdField from "../../src/Model/Mapping/Field/IdField";
import NumberField from "../../src/Model/Mapping/Field/NumberField";
import StringField from "../../src/Model/Mapping/Field/StringField";
import FieldCollection from "../../src/Model/Mapping/FieldCollection";
import NumberFieldValue from "../../src/Model/Mapping/FieldValue/NumberFieldValue";
import StringFieldValue from "../../src/Model/Mapping/FieldValue/StringFieldValue";
import FieldValueCollection from "../../src/Model/Mapping/FieldValueCollection";

export const nameField = new StringField("name");
export const surnameField = new StringField("surname");
export const AgeField = new NumberField("age");
export const addressField = new StringField("address");
export const MongoDBIDField = new IdField("_id");

export const nameFieldValue = new StringFieldValue(nameField, "Jan");
export const ageFieldValue = new NumberFieldValue(AgeField, 10);
export const surnameFieldValue = new StringFieldValue(surnameField, "Kowalski");


export const userFieldsArray = [nameField, surnameField];

export const userFields = new FieldCollection("user", [nameField, surnameField]);
export const userWithAgeFields = new FieldCollection("user_age", [...userFieldsArray, AgeField]);

export const userJohnDoeFieldValues = new FieldValueCollection([new StringFieldValue(nameField, "Joe"), new StringFieldValue(surnameField, "Doe")]);
export const userJanKowalskiFieldValues = new FieldValueCollection([new StringFieldValue(nameField, "Jan"), new StringFieldValue(surnameField, "Kowalski")]);
