const setting = require( "../lib/setting.js" ),
	conf = require( "../conf/conf.js" ),
	message = require( "./message.js" ),
	log = new ( require( "./console.js" ) )( "lib/command.js" );

let timeTaken, l, out = [], url;

function tolog ( channelID, logs, command, val, more ) {
	return log.add( channelID, `${ logs }, ${ val ? `setting: ${ command }, value: ${ val }` : `match: ${ command }` }${ more ? `, ${ more }` : "" }` );
}

module.exports = function ( channelID, { createdTimestamp, channel, content }, logs ) {
	l = content.replace( /^\/|^\!/, "" ).split( " " ), out = [];
	switch ( l[ 0 ].toLowerCase() ) {
		case "ping":
			timeTaken = Date.now() - createdTimestamp;
			timeTaken = timeTaken < 0 ? - timeTaken : timeTaken;
			tolog( channelID, logs, "ping", null, `latency: ${ timeTaken }` );
			channel.send( `Pong! This message had a latency of ${ timeTaken }ms.` );
			break;
		case "link":
			url = ( setting.get( channelID, "articlepath" ) || conf.defaultArticlepath ) + l[ 1 ];
			tolog( channelID, logs, "link", null, `out: ${ url }` );
			channel.send( url );
			break;
		case "help":
			tolog( channelID, logs, "help" );
			for ( const key in conf.msg[ "command-help" ] ) {
				out.push( `/${ key } ${ conf.msg[ "command-help" ][ key ] }` );
			}
			channel.send( out.join( "\n" ) );
			break;
		case "start":
			tolog( channelID, logs, "start" );
			setting.set( channelID, "statue", "start" );
			setting.get( channelID, "RegExp" ) ? setting.remove( channelID, "RegExp" ) : null;
			channel.send( message( "command-start" ) );
			break;
		case "stop":
			tolog( channelID, logs, "stop" );
			setting.set( channelID, "statue", "stop" );
			setting.get( channelID, "RegExp" ) ? setting.remove( channelID, "RegExp" ) : null;
			channel.send( message( "command-stop" ) );
			break;
		case "optin":
			logs += ", match: optin";
			if ( l[ 1 ] ) {
				l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
				setting.set( channelID, "statue", "optin" );
				setting.set( channelID, "RegExp", l[ 1 ] );
				tolog( channelID, logs, "optin", `/${ l[ 1 ] }/` );
				channel.send( message( "command-optin-success", `/${ l[ 1 ] }/` ) );
			} else {
				tolog( channelID, logs, "optin", "--error=\"loss argument\"" );
				channel.send( message( "command-optin-error-miss-argument", `/${ l[ 1 ] }/` ) );
			}
			break;
		case "optout":
			logs += ", match: optout";
			if ( l[ 1 ] ) {
				l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
				setting.set( channelID, "statue", "optout" );
				setting.set( channelID, "RegExp", l[ 1 ] );
				tolog( channelID, logs, "optout", `/${ l[ 1 ] }/` );
				channel.send( message( "command-optout-success", `/${ l[ 1 ] }/` ) );
			} else {
				tolog( channelID, logs, "optin", "--error=\"loss argument\"" );
				channel.send( message( "command-optout-error-miss-argument", `/${ l[ 1 ] }/` ) );
			}
			break;
		case "articlepath":
			logs += ", match: articlepath";
			if ( l[ 1 ] ) {
				try {
					l[ 1 ] = new URL( l[ 1 ] );
					if ( l[ 1 ].protocol.match( /http:|https:/ ) ) {
						l[ 1 ] = l[ 1 ].href + ( l[ 1 ].href.match( /\/$/ ) ? "" : "/" );
						setting.set( channelID, "articlepath", l[ 1 ] );
						tolog( channelID, logs, "articlepath", l[ 1 ] );
						channel.send( message( "command-articlepath-success", l[ 1 ] ) );
					} else {
						tolog( channelID, logs, "articlepath", `--error="block origin ${ l[ 1 ].origin }"` );
						channel.send( message( "command-articlepath-error-origin" ) );
					}
				} catch ( e ) {
					try {
						l[ 1 ] = new URL( `http://${ l[ 1 ] }` );
						l[ 1 ] = l[ 1 ].href + ( l[ 1 ].href.match( /\/$/ ) ? "" : "/" );
						setting.set( channelID, "articlepath", l[ 1 ] );
						tolog( channelID, logs, "articlepath", l[ 1 ] );
						channel.send( message( "command-articlepath-success", l[ 1 ] ) );
					} catch ( e ) {
						tolog( channelID, logs, "articlepath", `--error="fail parse url ${ l[ 1 ] }` );
						channel.send( message( "command-articlepath-error-parseerror", l[ 1 ] ) );
					}
				}
			} else {
				tolog( channelID, logs, "articlepath", "--error=\"loss argument\"" );
				channel.send( message( "command-articlepath-error-miss-argument", l[ 1 ] ) );
			}
			break;
		case "conf":
		case "setting":
			tolog( channelID, logs, "setting", null, `get: ${ JSON.stringify( setting.get( channelID ) ) }` );
			channel.send( message( "command-setting",
				setting.get( channelID, "statue" ),
				setting.get( channelID, "RegExp" ) || "$2",
				setting.get( channelID, "articlepath" )
			).replace( setting.get( channelID, "command-setting-regexpremove" ), "" ) );
			break;
	}
}