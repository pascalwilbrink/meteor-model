import { assert } from 'meteor/practicalmeteor:chai';
import {ValidationRule, LengthValidator, RegExpValidator,
   EmailValidator, RequiredValidator, AllowedValueSwitchValidator, 
   DataTypeValidator} from "@gdn/meteor-model";
import {SampleValidationRuleFixture, SampleValidationRuleFixture2} from "./fixtures/sample_validation_rule_fixture";


describe("ValidationRule", () => {
  let validationRule;

  beforeEach(() => {
    validationRule = new ValidationRule({ firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ }});
  });

  describe('.constructor()', () => {
    it("should assign the value and validator params within the instance", () => {
      assert.isDefined(validationRule['params']);
      assert.deepEqual(validationRule['params'], { firstParamName: 'whatever value', secondParamName: { a: 1001, b: /.*guidion/ }});
    });

    it("should initialize the _invalidMessage as empty", () => {
      assert.equal(validationRule._invalidMessage, "");
    });
  });

  describe('.isValid()', () => {
    it("should assign the original and final values within the instance", () => {
      validationRule.isValid("original value", "new value");
      assert.isDefined(validationRule['fromValue']);
      assert.equal(validationRule['fromValue'], "original value");
      assert.isDefined(validationRule['toValue']);
      assert.equal(validationRule['toValue'], "new value");
    });
    it("should return true when all the ValidationRule conditions return true", () => {
      const sampleValidationRuleFixture = new SampleValidationRuleFixture();
      assert.equal(sampleValidationRuleFixture.isValid(), true);
    });
    it("should return false when at least one of the ValidationRule conditions return false", () => {
      const sampleValidationRuleFixture2 = new SampleValidationRuleFixture2();
      assert.equal(sampleValidationRuleFixture2.isValid(), false);
    });
  });

  describe('.addInvalidMessage()', () => {
    it("should add a message to the invalid messages", () => {
      assert.equal(validationRule._invalidMessage, "");
      validationRule.addInvalidMessage("A new invalid message describing the error");
      assert.equal(validationRule._invalidMessage, "A new invalid message describing the error");
    });
  });
});

describe("LengthValidator", () => {
  let lengthValidator = new LengthValidator({ min: 5, max: 100 });
  let value;

  describe("when the value to validate is of a type Array", () => {
    beforeEach(() => {
      value = [];
    });
    describe("when the value is below the minimum", () => {
      it("should validate that the number of the destination Array value is below the minimum", () => {
        value = [1,2];
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
    describe("when the value is between the minimum and the maximum", () => {
      it("should validate that the number of the destination Array value is between the minimum and the maxium", () => {
        value = [1,2,3,4,5];
        assert.equal(lengthValidator.isValid(null, value), true);
      });
    });
    describe("when the value is higher than the maximum", () => {
      it("should validate that the number of the destination Array value is higher than the maximum", () => {
        for (let i = 1; i <= 105; i++) {
          value.push(i);
        }
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
  });

  describe("when the value to validate is of a type String", () => {
    describe("when the value is below the minimum", () => {
      it("should validate that the size of the destination string value is below the minimum", () => {
        value = "ab";
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
    describe("when the value is between the minimum and the maximum", () => {
      it("should validate that the size of the destination string value is between the minimum and the maximum", () => {
        value = "abcde";
        assert.equal(lengthValidator.isValid(null, value), true);
      });
    });
    describe("when the value is higher than the maximum", () => {
      it("should validate that the size of the destination string value is higher than the maximum", () => {
        for (let i = 1; i <= 105; i++) {
          value += i;
        }
        assert.equal(lengthValidator.isValid(null, value), false);
      });
    });
  });
});

describe("RegExpValidator", () => {
  xit("should validate that the destination value match with a specific RegExp", () => {

  });
});

describe("EmailValidator", () => {
  let emailValidator = new EmailValidator();

  describe("when the value to validate has invalid email values", () => {
    let invalidEmails = [];
    beforeEach(() => {
      invalidEmails = [undefined, null, 1, "holacomoestas", "hola@como", "hola@@comoestas.com"];
    });

    it("should be invalid", () => {
      for (let i = 0; i < invalidEmails.length-1; i++) {
        assert.equal(emailValidator.isValid(null, invalidEmails[i]), false);
      }
    });
  });

  describe("when the value to validate has valid email values", () => {
    let validEmails = [];
    beforeEach(() => {
      validEmails = ["hola@davidvalin.com", "si@si.com"];
    });

    it("should be valid", () => {
      for (let i = 0; i < validEmails.length-1; i++) {
        assert.equal(emailValidator.isValid(null, validEmails[i]), true);
      }
    });
  });
});

describe("RequiredValidator", () => {
  let requiredValidator = new RequiredValidator();
  describe("when the value is not provided", () => {
    it("should be invalid", () => {
      assert.equal(requiredValidator.isValid(), false);
    });
  });

  describe("when the value is provided", () => {
    it("should be valid", () => {
      assert.equal(requiredValidator.isValid(null, "ac00oOooOLValue"), true);
    });
  });

  it("should validate that the destination value has a value", () => {
    assert.equal(requiredValidator.isValid(null), false);
  });
});

describe("AllowedValueSwitchValidator", () => {
  let allowedValueSwitchValidator = new AllowedValueSwitchValidator({ matches: [
        { from: "open", to: ["scheduled", "canceled", "closed"] }
      ]
  });

  describe("when the value has made a valid switch", () => {
    it("should be valid", () => {
      assert.equal(allowedValueSwitchValidator.isValid("open", "scheduled"), true);
      assert.equal(allowedValueSwitchValidator.isValid("open", "canceled"), true);
      assert.equal(allowedValueSwitchValidator.isValid("open", "closed"), true);
    });
  });

  describe("when the value has made an invalid switch", () => {
    it("should not be valid", () => {
      assert.equal(allowedValueSwitchValidator.isValid(null, "scheduled"), false);
      assert.equal(allowedValueSwitchValidator.isValid("scheduled", "open"), false);
      assert.equal(allowedValueSwitchValidator.isValid("open", "invalid status"), false);
    });
  });
});


describe("DataTypeValidator", () => {
  class Person{};
    
  let dataTypeValidator = new DataTypeValidator({ _id: String, name: String, count: Number, person: {plop: String}});
  describe("with non-existing fields", () => {
    it("should be invalid", () => {
      assert.equal(dataTypeValidator.isValid({}, {iDontExist: 'harmfullData'}), false);
    });
  });

  describe("with existing fields", () => {    
    it("but wrong types, should be invalid", () => {
      assert.equal(dataTypeValidator.isValid({}, {_id: 5}), false);
    });
    it("but wrong object instances, should be invalid", () => {
      assert.equal(dataTypeValidator.isValid({}, {person: {plop: 67}}), false);
    });
    it("and correct types, should be valid", () => {
      var result = dataTypeValidator.isValid({}, {_id: '123455', name: 'plop', count: 75, person: {plop: 'plop'}});
      var message = dataTypeValidator._invalidMessage;
      assert.equal(result, true);
    });
  });
});