const fs = require( "fs" ),
	conf = require( "../conf/conf.js" );

module.exports = class log {
	constructor ( file ) {
		this.prefix = file;
	}

	static get TimeStamp () {
		var now = new Date();
		function s ( q ) {
			return q < 10 ? `0${ q }` : `${ q }`;
		}
		return `${ now.getFullYear() }/${ s( now.getUTCMonth() + 1 ) }/${ s( now.getUTCDate() ) } ${ s( now.getUTCHours() ) }:${ s( now.getUTCMinutes() ) } (UTC)`
	}

	add ( $id, ...messages ) {
		let message = `[${ log.TimeStamp }][${ this.prefix }]`;
		if ( $id ) {
			message += ` <${ $id }>`
		}
		console.log( message, messages.join( " " ) );
		message += " " + messages.join( " " ) + "\n";
		if ( !conf.log ) {
			return;
		}
		fs.appendFile( `./${ conf.log }`, message, function ( error ) {
			if ( error ) {
				console.error( "[" + log.TimeStamp + "][lib/console.js] fail to write to log/run.log, reason: ", error );
			}
		} )
	}
}