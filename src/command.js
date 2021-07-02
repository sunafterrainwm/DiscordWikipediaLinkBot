/* eslint-disable no-unused-expressions */
const conf = require( "../conf/conf" ),
	log = new ( require( "./console" ) )( "command" ),
	message = require( "./message" ),
	setting = require( "./setting" ),
	parselink = require( "./parselink" );

class Command {
	/**
	 *
	 * @param {import("./discordmessage")} $msg
	 * @param {import("./logs")} logs
	 * @returns
	 */
	constructor( $msg, logs ) {
		this.msg = $msg;
		this.logs = logs;
	}

	ping() {
		this.logs.command = "ping";
		let timeTaken = Date.now() - this.msg.createdTimestamp;
		timeTaken = timeTaken < 0 ? -timeTaken : timeTaken;
		return `Pong! This message had a latency of ${ timeTaken }ms.`;
	}

	link() {
		this.logs.command = "link";
		this.msg.PassNewMessage( this.msg.content.replace( /^\/link /, "" ) );
		if ( this.msg.content.match( /\[\[([^[\]])+?\]\]|{{([^{}]+?)}}/g ) ) {
			parselink( this.msg, this.logs );
			return null;
		} else {
			return ( setting.get( this.msg.settingId, "articlepath" ) || conf.defaultArticlepath ) + this.msg.content;
		}
	}

	help() {
		this.logs.command = "help";
		const $out = [];
		for ( const key in conf.msg.command.help ) {
			$out.push( `\`/${ key }\` ${ conf.msg.command.help[ key ] }` );
		}
		return $out.join( "\n" );
	}

	start() {
		this.logs.command = "start";
		setting.set( this.msg.settingId, "statue", "start" );
		setting.get( this.msg.settingId, "RegExp" ) ? setting.remove( this.msg.settingId, "RegExp" ) : null;
		return message( "command-start" );
	}

	stop() {
		this.logs.command = "stop";
		setting.set( this.msg.settingId, "statue", "stop" );
		setting.get( this.msg.settingId, "RegExp" ) ? setting.remove( this.msg.settingId, "RegExp" ) : null;
		return message( "command-stop" );
	}

	optin( l = [ "optin" ] ) {
		this.logs.command = "optin";
		if ( l[ 1 ] ) {
			l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
			this.logs.regexp = `/${ l[ 1 ] }/`;
			setting.set( this.msg.settingId, "statue", "optin" );
			setting.set( this.msg.settingId, "RegExp", l[ 1 ] );
			return message( "command-optin-success", `/${ l[ 1 ] }/` );
		} else {
			this.logs.regexpset = null;
			return message( "command-optin-error-miss-argument" );
		}
	}

	optout( l = [ "optout" ] ) {
		this.logs.command = "optout";
		if ( l[ 1 ] ) {
			l[ 1 ] = l[ 1 ].match( /^\/.*\/$/ ) ? l[ 1 ].replace( /^\/(.*)\/$/, "$1" ) : l[ 1 ];
			this.logs.regexp = `/${ l[ 1 ] }/`;
			setting.set( this.msg.settingId, "statue", "optout" );
			setting.set( this.msg.settingId, "RegExp", l[ 1 ] );
			return message( "command-optout-success", `/${ l[ 1 ] }/` );
		} else {
			this.logs.regexpset = null;
			return message( "command-optout-error-miss-argument" );
		}
	}

	articlepath( l = [ "articlepath" ] ) {
		this.logs.command = "articlepath";
		if ( l[ 1 ] ) {
			if ( [ "remove", "kill", "null", "undefined" ].indexOf( l[ 1 ].toLowerCase() ) > -1 ) {
				setting.remove( this.msg.settingId, "articlepath" );
				this.logs.articlepathset = "clear";
				return message( "command-articlepath-clear" );
			}
			try {
				l[ 1 ] = new global.URL( l[ 1 ] );
				if ( l[ 1 ].protocol.match( /http:|https:/ ) ) {
					l[ 1 ] = l[ 1 ].href + ( l[ 1 ].href.match( /\/$/ ) ? "" : "/" );
					setting.set( this.msg.settingId, "articlepath", l[ 1 ] );
					this.logs.articlepathset = l[ 1 ];
					return message( "command-articlepath-success", l[ 1 ] );
				} else {
					this.logs.articlepatherror = `block origin ${ l[ 1 ].origin }`;
					return message( "command-articlepath-error-origin" );
				}
			} catch ( e ) {
				try {
					l[ 1 ] = new global.URL( `http://${ l[ 1 ] }` );
					l[ 1 ] = l[ 1 ].href + ( l[ 1 ].href.match( /\/$/ ) ? "" : "/" );
					setting.set( this.msg.settingId, "articlepath", l[ 1 ] );
					this.logs.articlepathset = l[ 1 ];
					return message( "command-articlepath-success", l[ 1 ] );
				// eslint-disable-next-line no-shadow
				} catch ( e ) {
					this.logs.articlepatherror = `fail parse url ${ l[ 1 ] }`;
					return message( "command-articlepath-error-parseerror", l[ 1 ] );
				}
			}
		} else {
			this.logs.articlepathset = null;
			return message( "command-articlepath-error-miss-argument", l[ 1 ] );
		}
	}

	setting() {
		this.logs.command = "setting";
		this.logs.settings = JSON.stringify( setting.get( this.msg.settingId ) );
		return message( "command-setting-channelid", this.msg.channelId ) +
			message( "command-setting-statue", setting.get( this.msg.settingId, "statue" ) ) +
			( setting.get( this.msg.settingId, "RegExp" ) ? message( "command-setting-regexp", setting.get( this.msg.settingId, "RegExp" ) ) : "" ) +
			message( "command-setting-articlepath", setting.get( this.msg.settingId, "articlepath" ) ) +
			message( "command-setting-help" );
	}
}

/**
 *
 * @param {import("./discordmessage")} $msg
 * @param {import("./logs")} logs
 * @returns
 */
module.exports = function ( $msg, logs ) {
	const $command = new Command( $msg, logs );
	let l = $msg.content.replace( /^\/|^!/, "" ).split( " " ), reply = "";
	switch ( l[ 0 ].toLowerCase() ) {
		case "ping":
			reply = $command.ping();
			break;
		case "link":
			reply = $command.link();
			if ( !reply ) {
				return;
			} else {
				logs.parseret = reply;
			}
			break;
		case "help":
			reply = $command.help();
			break;
		case "start":
			reply = $command.start();
			break;
		case "stop":
			reply = $command.stop();
			break;
		case "optin":
			reply = $command.optin( l );
			break;
		case "optout":
			reply = $command.opout( l );
			break;
		case "articlepath":
			reply = $command.articlepath( l );
			break;
		case "setting":
			reply = $command.setting();
			break;
		case "conf":
			// eslint-disable-next-line camelcase
			$command.logs.command_conf = true;
			if ( !l[ 1 ] ) {
				reply = message( "command-conf-default" );
			} else if ( typeof $command[ l[ 1 ].toLowerCase() ] === "function" ) {
				if ( l[ 1 ].toLowerCase() === "help" ) {
					$command.logs.command = "help";
					const $out = [];
					for ( const key in conf.msg.command.help ) {
						$out.push( `\`/conf ${ key }\` ${ conf.msg.command.help[ key ] }` );
					}
					reply = $out.join( "\n" );
				} else {
					reply = $command[ l[ 1 ].toLowerCase() ]( l.slice( 1 ) );
				}
			} else {
				$command.logs.command = "unknow";
				reply = message( "command-conf-unknow", l[ 1 ].toLowerCase() );
			}
			break;
	}

	log.add( $command.logs );
	if ( reply.length > 0 ) {
		$msg.reply( reply );
	}
};
