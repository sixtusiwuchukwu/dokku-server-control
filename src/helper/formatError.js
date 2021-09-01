const { AuthenticationError , UserInputError , ValidationError , ForbiddenError } = require( 'apollo-server-express' );
module.exports = ( log ) => ( err ) => {
  if ( err.originalError instanceof AuthenticationError ) {
    return err;
  }
  if ( err.originalError instanceof UserInputError ) {
    return err;
  }
  if ( err.originalError instanceof ValidationError ) {
    return err;
  }
  if ( err.originalError instanceof ForbiddenError ) {
    return err;
  }
  log.error( `Server Error: ${ JSON.stringify( err , null , 1 ) }` );
  return new Error( 'Internal server error' );
};
