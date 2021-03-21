const setting = require( "../lib/setting.js" ),
	message = require( "./message.js" );

function log ( channelID, command, val ) {
	console.log( `[lib/command.js]<${ channelID }>: ${ val ? `setting ${ command } ${ val }` : `match ${ command }` }` );
}

module.exports = function ( channelID, msg, channel ) {
	var l = msg.replace( /^\//, "" ).split( " " ), out = [];
	switch ( l[ 0 ].toLowerCase() ) {
		case "help":
			log( channelID, "help" );
			for ( const key in message( "command-help" ) ) {
				out.push( `/${ key } ${ message( "command-help" )[ key ] }` );
			}
			channel.send( out.join( "\n" ) );
			break;
		case "start":
			log( channelID, "start" );
			setting.set( channelID, "statue", "start" );
			setting.get( channelID, "RegExp" ) ? setting.remove( channelID, "RegExp" ) : null;
			channel.send( message( "command-start" ) );
			break;
		case "stop":
			log( channelID, "stop" );
			setting.set( channelID, "statue", "stop" );
			setting.get( channelID, "RegExp" ) ? setting.remove( channelID, "RegExp" ) : null;
			channel.send( message( "command-stop" ) );
			break;
		case "optin":
			log( channelID, "optin" );
			if ( l[ 1 ] ) {
				l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
				setting.set( channelID, "statue", "optin" );
				setting.set( channelID, "RegExp", l[ 1 ] );
				log( channelID, "optin", `/${ l[ 1 ] }/` );
				channel.send( message( "command-optin-success", `/${ l[ 1 ] }/` ) );
			} else {
				log( channelID, "optin", "--error=\"loss argument\"" );
				channel.send( message( "command-optin-error-miss-argument", `/${ l[ 1 ] }/` ) );
			}
			break;
		case "optout":
			log( channelID, "optout" );
			if ( l[ 1 ] ) {
				l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
				setting.set( channelID, "statue", "optout" );
				setting.set( channelID, "RegExp", l[ 1 ] );
				log( channelID, "optout", `/${ l[ 1 ] }/` );
				channel.send( message( "command-optout-success", `/${ l[ 1 ] }/` ) );
			} else {
				log( channelID, "optin", "--error=\"loss argument\"" );
				channel.send( message( "command-optout-error-miss-argument", `/${ l[ 1 ] }/` ) );
			}
			break;
		case "articlepath":
			log( channelID, "articlepath" );
			if ( l[ 1 ] ) {
				try {
					l[ 1 ] = new URL( l[ 1 ] );
					if ( l[ 1 ].protocol.match( /http:|https:/ ) ) {
						l[ 1 ] = l[ 1 ].href + l[ 1 ].href.match( /\/$/ ) ? "" : "/";
						setting.set( channelID, "articlepath", l[ 1 ] );
						log( channelID, "articlepath", l[ 1 ] );
						channel.send( message( "command-articlepath-success", l[ 1 ] ) );
					} else {
						log( channelID, "articlepath", `--error="block origin ${ l[ 1 ].origin }"` );
						channel.send( message( "command-articlepath-error-origin" ) );
					}
				} catch ( e ) {
					try {
						l[ 1 ] = new URL( `http://${ l[ 1 ] }` );
						l[ 1 ] = l[ 1 ].href + l[ 1 ].href.match( /\/$/ ) ? "" : "/";
						setting.set( channelID, "articlepath", l[ 1 ] );
						log( channelID, "articlepath", l[ 1 ] );
						channel.send( message( "command-articlepath-success", l[ 1 ] ) );
					} catch ( e ) {
						log( channelID, "articlepath", `--error="fail parse url ${ l[ 1 ] }` );
						channel.send( message( "command-articlepath-error-parseerror", l[ 1 ] ) );
					}
				}
			} else {
				log( channelID, "articlepath", "--error=\"loss argument\"" );
				channel.send( message( "command-articlepath-error-miss-argument", l[ 1 ] ) );
			}
			break;
		case "setting":
			log( channelID, "setting" );
			log( channelID, "setting", setting.get( channelID ) );
			channel.send( message( "command-setting",
				setting.get( channelID, "statue" ),
				setting.get( channelID, "RegExp" ) || "$2",
				setting.get( channelID, "articlepath" )
			).replace( setting.get( channelID, "command-setting-regexpremove" ), "" ) );
			break;
	}
}