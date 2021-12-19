const { ValidationError } = require( 'apollo-server-express' );
import {UserValidator} from "./user/userValidationSchema";

class Validation {
  async userValidation( data: any ) {
    try {
      return await UserValidator.validate( data )
    } catch ( e ) {
      throw new ValidationError( e.message )
    }
  }
}

export default Validation;
