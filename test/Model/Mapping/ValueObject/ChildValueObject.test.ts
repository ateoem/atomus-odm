import ChildrenField from "../../../../src/Model/Mapping/Field/ChildrenField";
import ChildValueObject from "../../../../src/Model/Mapping/ValueObject/ChildValueObject";
import { AGGREGATE_USER_JOE_DOE, AGGREGATE_USERAGE_JAN_KOWALSKI, AGGREGATE_USERAGE_JOE_DOE } from "../../../Utils/ExampleFields";

describe('IdValueObject', () => {
    it('should have clone/isEqual.', () => {
        const numberVO = new ChildValueObject(AGGREGATE_USER_JOE_DOE);
        expect(numberVO.$value.isEqual(AGGREGATE_USER_JOE_DOE)).toBe(true);
        expect(numberVO.clone().isEqual(numberVO)).toBe(true);
    });

    it('should not be equal if different fields.', () => {
        const childJohnDoe = new ChildValueObject(AGGREGATE_USERAGE_JOE_DOE);
        const childJanKowalski = new ChildValueObject(AGGREGATE_USER_JOE_DOE);
        expect(childJanKowalski.isEqual(childJohnDoe)).toBe(false);
        expect(childJohnDoe.isEqual(childJanKowalski)).toBe(false);
    });

    it('should not be equal if different values.', () => {
        const childJohnDoe = new ChildValueObject(AGGREGATE_USERAGE_JOE_DOE);
        const childJanKowalski = new ChildValueObject(AGGREGATE_USERAGE_JAN_KOWALSKI);
        expect(childJanKowalski.isEqual(childJohnDoe)).toBe(false);
        expect(childJohnDoe.isEqual(childJanKowalski)).toBe(false);
    });
});