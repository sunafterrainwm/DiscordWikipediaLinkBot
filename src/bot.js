/* eslint-disable no-use-before-define */
const command = require( "./command" ),
	DiscordMessage = require( "./discordmessage" ),
	each = require( "./each" ),
	extend = require( "./extend" ),
	log = new ( require( "./console" ) )( "bot" ),
	message = require( "./message" ),
	parselink = require( "./parselink" ),
	setting = require( "./setting" ),
	version = require( "../package.json" ).version;

if ( process.argv && process.argv.indexOf( "-f" ) + process.argv.indexOf( "--force" ) > -2 ) {
	const conf = require( "../conf/conf" ),
		Discord = require( "discord.js" ),
		client = new Discord.Client();

	log.add( "DiscordWikipediaLinkBot version " + version );

	client.login( conf.auth );
	client.on( "ready", function () {
		log.add( `Logged in as ${ client.user.tag }.` );
		main( client, conf );
	} );
} else {
	const checking = require( "./checking" );

	checking.then( function ( { client, conf } ) {
		console.log( "--------\nDiscordWikipediaLinkBot version " + version );

		log.add( `Logged in as ${ client.user.tag }.` );

		main( client, conf );
	} );
}

/**
 *
 * @param {Discord.Client} client
 * @param {import("../conf/conf")} conf
 */
function main( client, conf ) {
	const guildFirst = require( "../conf/conf.js" ).setting_order === "guildFirst";
	/** @type {import("./logs")} */
	let logs = {},
		skipBot,
		enable = false;

	/** @type {{channelId: number|string;statue:"enable"|"disable"}} */
	const EnableLog = [];
	each( conf.enable, function ( k, v ) {
		if ( v ) {
			EnableLog.push( {
				channelId: k === "default" ? "default" : `${ k }`,
				statue: "enable"
			} );
			enable = true;
		} else {
			EnableLog.push( {
				channelId: k === "default" ? "default" : `${ k }`,
				statue: "disable"
			} );
		}
	} );
	console.table( EnableLog );

	if ( !enable ) {
		class ConfigError extends Error {
			constructor( $message ) {
				super( $message );
				super.name = "ConfigError";
			}
		}
		throw new ConfigError( "You did not enable any channel to use this bot !" );
	}

	client.on( "guildMemberAdd", function ( member ) {
		if ( member.id === client.user.tag ) {
			setting.updateusingtime( member.joinedTimestamp );
			if ( guildFirst ) {
				setting.set( member.guild.id, "statue", "start" );
				setting.set( member.guild.id, "articlepath", conf.defaultArticlepath );
			}
			member.guild.systemChannel.send( message( "bot_start" ) );
		}

	} );

	client.on( "message", function ( $msg ) {
		const msg = new DiscordMessage( $msg ),
			content = msg.content;
		if ( msg.isUser( client.user.id ) ) {
			return;
		} else if ( msg.isBot ) {
			skipBot = conf.skipBot[ msg.userid ];
			logs = {
				from: msg.usertag + "(" + msg.userid + ")",
				channelid: msg.channelId,
				settingid: msg.settingId,
				messageid: msg.messageId,
				message: content.replace( /\n/g, "\\n" ),
				bot: true
			};

			if ( typeof skipBot !== "undefined" ) {
				if ( skipBot ) {
					logs.skip = "true-inlist";
					log.add( logs );
					return;
				} else {
					logs.skip = "false-inlist";
				}
			} else if ( conf.skipBot.default ) {
				logs.skip = "true-default";
				log.add( logs );
				return;
			} else {
				logs.skip = "false-default";
			}
		} else {
			logs = {
				from: msg.usertag + "(" + msg.userid + ")",
				channelid: msg.channelId,
				settingid: msg.settingId,
				messageid: msg.messageId,
				message: content.replace( /\n/g, "\\n" ),
				bot: false,
				extend: extend
			};
		}
		setting.updateusingtime( msg.createdTimestamp );
		if ( content.match( /^\/|^!/ ) ) {
			command( msg, logs );
		} else {
			if ( setting.get( msg.settingId ) ) {
				if ( setting.get( msg.id, "statue" ) === "stop" ) {
					logs.extend( {
						statue: "stop"
					} );
					log.add( logs );
					return;
				} else if ( setting.get( msg.settingId, "statue" ) === "optin" ) {
					logs.extend( {
						statue: "optin",
						regexp: `/${ setting.get( msg.settingId, "RegExp" ) }/`,
						match: null
					} );
					if ( new RegExp( setting.get( msg.settingId, "RegExp" ) ).exec( content ) ) {
						logs.match = true;
					} else {
						logs.match = false;
						log.add( logs );
						return;
					}
				} else if ( setting.get( msg.settingId, "statue" ) === "optout" ) {
					logs.extend( {
						statue: "optout",
						regexp: `/${ setting.get( msg.settingId, "RegExp" ) }/`,
						match: null
					} );
					if ( new RegExp( setting.get( msg.settingId, "RegExp" ) ).exec( content ) ) {
						logs.match = true;
						log.add( logs );
						return;
					} else {
						logs.match = false;
					}
				} else {
					logs.statue = "start";
				}
			} else {
				logs.statue = "new";
				if (
					setting.set( msg.settingId, "statue", "start" ) &&
					setting.set( msg.settingId, "articlepath", conf.defaultArticlepath )
				) {
					msg.reply( message( "bot_start" ) ).catch( $e => log.add( $e ) );
				} else {
					log.add( `Warning: Can't writing setting for ${
						msg.channelId === msg.settingId ? "channel" : "guide"
					}${ msg.settingId }.` );
				}
			}

			parselink( msg, logs );
		}
	} );
}
