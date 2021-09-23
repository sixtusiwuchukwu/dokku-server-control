const mongoose = require( 'mongoose' );


mongoose.set( 'useFindAndModify' , false );

const options = {
  keepAlive : true ,
  connectTimeoutMS : 30000 ,
  useNewUrlParser : true ,
  useUnifiedTopology : true
};

class db {
  private readonly log: any;
  private dataBaseDefaultSaves: any;
  constructor( log:any , dataBaseDefaultSaves: any ) {
    // if ( !dataBaseDefaultSaves ) {
    //   throw new Error( `dataBaseDefaultSaves undefined in ${ __dirname }` )
    // }
    // this.defaultAdminUser = "admin@cloudbooks.ng";
    this.dataBaseDefaultSaves = dataBaseDefaultSaves;
    this.log = log
  }

  public connect( DB_URL: string ) {
    const log = this.log;
    mongoose.connect( DB_URL , options )
      .then( async () => {
        log.info( `Successfully connected to ${ DB_URL }` );
        // new this.dataBaseDefaultSaves( log , { email : "nwokolawrence6@gmail.com" , phone : "08106720418" } )
      } )
      .catch( ( err:any ) => {
        log.error( `There was a db connection error ${ err }` );
        process.exit( 0 );
      } );
    mongoose.set( 'useCreateIndex' , true );
    mongoose.connection.once( 'disconnected' , () => {
      log.error( `Successfully disconnected from ${ DB_URL }` );
    } );
    process.on( 'SIGINT' , () => {
      mongoose.connection.close( () => {
        log.error( 'dBase connection closed due to app termination' );
        process.exit( 0 );
      } );
    } );
  }
}

export default db;
