var { get, set, remove } = require( "./setting.js" ),
	program = new (require( "commander" ).Command)(),
	argv = process.argv;

program.version( "1.0.0" );

program.command("get [channelID] [key]")
	.description("")
	.action( ( channelID, key ) => {
		console.log( get( channelID, key ) );
	} );

program.command("set <channelID> <key> <value>")
	.description("")
	.action( ( channelID, key, value ) => {
		console.log( set( channelID, key, value ) );
	} );

program.command("remove <channelID> [key]")
	.description("")
	.action( ( channelID, key ) => {
		console.log( remove( channelID, key ) );
	} );

program.parse( argv );