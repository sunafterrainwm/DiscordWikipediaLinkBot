const Discord = require( "discord.js" ),
	client = new Discord.Client(),
	conf = require( "./conf/conf.js" ),
	parselink = require( "./parselink.js" );

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
	parseret = parselink( content, setting.get( id.toString(), "articlepath" ) || "https://zh.wikipedia.org/wiki/" );
	if ( parseret.length > 0 ) {
		console.log( `[bot.js]<${ id }>: Parse url:\n${ parseret }` );
		channel.send( parseret );
	}
} );