const Discord = require( "discord.js" ),
	client = new Discord.Client(),
	conf = require( "./conf/conf.js" ),
	parselink = require( "./lib/parselink.js" ),
	setting = require( "./lib/setting.js" ),
	command = require( "./lib/command.js" ),
	log = new ( require( "./lib/console.js" ) )( "bot.js" ),
	message = require( "./lib/message.js" );

if ( !conf["setting-order"] || [ "channelFirst", "guildFirst" ].indexOf( conf["setting-order"] ) === -1 ) {
	class ConfigError extends Error {
		constructor ( msg ) {
			super( msg );
			super.name = "ConfigError";
		}
	}

	throw new ConfigError( "Error: The value of setting-order at \"conf/conf.js\" can't be understood. It only could be 'channelFirst' or 'guildFirst'." );
}

let parseret, logs = "";

client.login( conf.auth );

client.on( "ready",function () {
	log.add( null, `Logged in as ${ client.user.tag }.` );
} );

client.on( "message", function ( msg ) {
	let { author, channel, content, guild } = msg,
		{ id } = conf["setting-order"] = "guildFirst" ? guild || channel : channel;
	if ( author.tag === client.user.tag ) {
		return;
	}
	logs = `from: ${ author.tag }, message: ${ content.replace( /\n/g, "\\n" ) }`;
	if ( content.match( /^\/|^\!/ ) ) {
		command( id.toString(), msg, logs );
	} else {
		if ( setting.get( id.toString() ) ) {
			if ( setting.get( id.toString(), "statue" ) === "stop" ) {
				logs += ", statue: stop";
				log.add( id, logs );
				return;
			} else if ( setting.get( id.toString(), "statue" ) === "optin" ) {
				if ( new RegExp( setting.get( id.toString(), "RegExp" ) ).exec( content ) ) {
					logs += `, statue: optout, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: true`;
				} else {
					logs += `, statue: optout, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: false`;
					log.add( id, logs );
					return;
				}
			} else if ( setting.get( id.toString(), "statue" ) === "optout" ) {
				if ( new RegExp( setting.get( id.toString(), "RegExp" ) ).exec( content ) ) {
					logs += `, statue: optout, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: true`;
					return;
				} else {
					logs += `, statue: optout, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: false`;
				}
			} else {
				logs += ", statue: start"
			}
		} else {
			logs += ", statue: new";
			if (
				setting.set( id.toString(), "statue", "start" ) &&
				setting.set( id.toString(), "articlepath", conf.defaultArticlepath )
			) {
				channel.send( message( "bot-start" ) );
			} else {
				logs += ", error: can't writing setting";
			}
			
			
		}
		parseret = parselink( content, setting.get( id.toString(), "articlepath" ) || conf.defaultArticlepath );
		if ( parseret.length > 0 ) {
			logs += `, parse urls: \n${ parseret }`;
			log.add( id, logs );
			channel.send( parseret );
		} else {
			log.add( id, logs );
		}
	}
} );