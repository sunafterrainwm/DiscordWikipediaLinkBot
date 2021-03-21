const Discord = require( "discord.js" ),
	client = new Discord.Client(),
	conf = require( "./conf/conf.js" ),
	parselink = require( "./lib/parselink.js" ),
	setting = require( "./lib/setting.js" ),
	command = require( "./lib/command.js" );
//	message = require( "./lib/message.js" );

let parseret;

client.login( conf.auth );

client.on( "ready",function () {
	console.log( `[bot.js]Logged in as ${ client.user.tag }.` );
} );

client.on( "message", function ( msg ) {
	var { author, channel, content } = msg,
		{ id } = channel;
	if ( author.tag === client.user.tag ) {
		return;
	}
	console.log( `[bot.js]<${ id }>: Get msg "${ content }" from ${ author.tag }` );
	if ( content.match( /^\// ) ) {
		command( id.toString(), content, channel );
	} else {
		if ( setting.get( id.toString() ) ) {
			if ( setting.get( id.toString(), "statue" ) === "stop" ) {
				console.log( `[bot.js]<${ id }>: statue: stop` );
				return;
			} else if ( setting.get( id.toString(), "statue" ) === "optin" &&
				!new RegExp( setting.get( id.toString(), "RegExp" ) ).exec( content )
			) {
				console.log( `[bot.js]<${ id }>: statue: optin, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: false` );
				return;
			} else if ( setting.get( id.toString(), "statue" ) === "optout" &&
				new RegExp( setting.get( id.toString(), "RegExp" ) ).exec( content )
			) {
				console.log( `[bot.js]<${ id }>: statue: optout, regexp: /${ setting.get( id.toString(), "RegExp" ) }/, match: true` );
				return;
			}
		}
		parseret = parselink( content, setting.get( id.toString(), "articlepath" ) || "https://zh.wikipedia.org/wiki/" );
		if ( parseret.length > 0 ) {
			console.log( `[bot.js]<${ id }>: Parse url:\n${ parseret }` );
			channel.send( parseret );
		}
	}
} );