import {ValidationRule} from "../../src/validation";

export class SampleValidationRuleFixture extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      return true;
    }
  ]
}


export class SampleValidationRuleFixture2 extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      return true;
    },
    () => {
      return false;
    }
  ]
}
