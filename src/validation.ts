import {MeteorModel} from './model_entity';

/**
 * Represents a validation rule
 */
export class ValidationRule implements IValidationRule {
  private conditions: Array<Function> = [];
  public value:any
  public params:Object
  private _invalidMessage = "Invalid";

  constructor(params?:any) {
    this.params = params;
    this._invalidMessage = "";
  }

  /**
   * Retrieves the invalid message for the ValidationRule
   */
  public getInvalidMessage() {
    return this._invalidMessage;
  }

  /**
   * Checks if the ValidationRule is valid
   */
  public isValid(value:any): Boolean {
    this.value = value;

    // Reset the invalid message
    this._invalidMessage = '';

    for(let i=0; i < this.conditions.length; i++) {
      if (this.conditions[i]() === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Ads an invalid message to the ValidationRule
   */
  public addInvalidMessage(message:String) {
    this._invalidMessage += message;
  }

  /**
   * Ads a ValidationRuleCondition to the ValidationRule
   */
  public addCondition(condition:Function): void {
    this.conditions.push(condition);
  }

  /**
   * Removes a ValidationRuleCondition from the ValidationRule
   */
  public removeCondition(index): void {
    this.conditions.splice(index, 1);
  }
}

/**
 * ValidationRule implementation
 */
interface IValidationRule {
  validateAttrs: Array<any>
  params: any
  conditions: Array<Function|any>;
  invalidMessage: String;
  addCondition(Function);
  removeCondition(index);

  validate();
}

// ----[ Our validators ]------------------------------------------------------

/**
 * LengthValidator
 */
interface LengthValidatorParams { min: Object, max: integer }
export class LengthValidator extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      let match:Boolean = true;

      if (this.value.length < this.params['min']) {
        match = false;
        this.addInvalidMessage(this.value + " is shorter than " + this.params['min']);
      }
      if (this.value.length > this.params['max']) {
        match = false;
        this.addInvalidMessage(this.value + " is longer than " + this.params['max']);
      }

      return match;
    }
  ]
}

// new StatusValidator({
//   validStatusChanges: [
//     { from: 0, to: [1, 2] },
//
//   ]
// })
//
// class StatusValidator extends ValidationRule {
//   private conditions:Array<Function> = [
//     () => {
//       this.params['']
//     }
//   ]
// }

/**
 * RegExpValidator
 */
export class RegExpValidator extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      let match:Boolean = true;
      if (!this.value.match(this.params['rule'])) {
        match = false;
      }
      return match;
    }
  ]
}

/**
 * EmailValidator
 */
export class EmailValidator extends ValidationRule {
  private conditions:Array<Function> = [
    // Check for email regexp...
    () => {
      let match:Boolean = true;
      const regExpValidator = new RegExpValidator({ rule: /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i });
      if (!regExpValidator.isValid(this.value)) {
        this.addInvalidMessage(this.value + ' is not a valid email address');
        match = false;
      }
      return match;
    }
  ]
}


/**
 * RequiredValidator
 */
export class RequiredValidator extends ValidationRule {
  private conditions:Array<Function> = [
    () => {
      let match:Boolean = true;
      if (!this.value) {
        match = false;
        this.addInvalidMessage("A value is required and was not provided");
      }
      return match;
    }
  ]
}
