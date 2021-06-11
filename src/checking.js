module.exports = ( async function () {
	const Discord = require( "discord.js" ),
		client = new Discord.Client(),
		fs = require( "fs" ),
		path = require( "path" ),
		configFile = path.normalize( __dirname + "/../conf/conf" ),
		request = require( "request" ),
		version = require( "../package.json" ).version;

	/**
	 * @type {import("../conf/conf")}
	 */
	let conf;

	class ConfigError extends Error {
		constructor( message ) {
			super( "[lib/confchecking] " + message );
			super.name = "ConfigError";
		}

		static NoDefine( $key ) {
			return new this( `Process ${ configFile } fail, ${ $key } isn't define.` );
		}
	}

	function log( ...$msg ) {
		console.log( "[lib/confchecking]", $msg.join( " " ) );
	}

	log( "Import config file", configFile );

	try {
		conf = require( configFile );
	} catch ( e ) {
		throw new ConfigError( e );
	}

	log( "Checking token..." );
	if ( typeof conf.auth !== "string" || conf.auth.length === 0 ) {
		throw ConfigError.NoDefine( "the token of oauth2" );
	} else {
		await client.login( conf.auth );
		log( `Login success (${ client.user.tag }).` );
	}

	log( "Checking defaultArticlepath..." );
	if ( typeof conf.defaultArticlepath !== "string" || conf.defaultArticlepath.length === 0 ) {
		throw ConfigError.NoDefine( "defaultArticlepath" );
	} else {
		log( `defaultArticlepath is ${ conf.defaultArticlepath }.` );
		await ( function () {
			return new Promise( ( resolve, reject ) => {
				request.head( conf.defaultArticlepath, {
					headers: {
						"User-Agent": `Nodejs-DiscordWikipediaLinkBot/${ version }`
					},
					timeout: 3000
				}, function ( $err, $res ) {
					if ( $err ) {
						reject( $err );
					} else if ( $res.statusCode && [ 200, 301 ].indexOf( $res.statusCode ) > -1 ) {
						resolve( $res );
					} else {
						console.table( $res );
						reject( "fail to parse statue." );
					}
				} );
			} );
		}() )
			.then( function () {
				log( `Connect to ${ conf.defaultArticlepath } success.` );
			}, function ( $err ) {
				throw new ConfigError( "Can't connect to " + conf.defaultArticlepath + ", reason: " + $err );
			} );
	}

	log( "Checking path..." );
	if ( typeof conf.path.setting !== "string" || conf.path.setting.length === 0 ) {
		throw ConfigError.NoDefine( "path of setting.json" );
	} else {
		try {
			if ( !fs.existsSync( path.normalize( __dirname + "/../" + conf.path.setting ) ) ) {
				throw new ConfigError( path.basename( conf.path.setting ) + " doesn't exist" );
			}

			fs.readFileSync( path.normalize( __dirname + "/../" + conf.path.setting ) );
		} catch ( $e ) {
			throw new ConfigError( "Can't read " + path.basename( conf.path.setting ) + ", reason: " + $e );
		}
		log( `setting will log to "${ path.normalize( __dirname + "/../" + conf.path.setting ) }".` );
	}

	if ( typeof conf.path.log !== "string" || conf.path.log.length === 0 ) {
		log( "path of log was no define, it won't write to log." );
	} else {
		try {
			if ( !fs.existsSync( path.normalize( __dirname + "/../" + conf.path.log ) ) ) {
				throw new ConfigError( path.basename( conf.path.log ) + " doesn't exist" );
			}

			fs.readFileSync( path.normalize( __dirname + "/../" + conf.path.log ) );
		} catch ( $e ) {
			throw new ConfigError( `Can't read "${ path.basename( conf.path.log ) }", reason: ${ $e }` );
		}
		log( `log will write to "${ path.normalize( __dirname + "/../" + conf.path.log ) }".` );
	}

	log( "Checking setting-order..." );
	if ( !conf.setting_order || [ "channelFirst", "guildFirst" ].indexOf( conf.setting_order ) === -1 ) {
		throw new ConfigError( `Error: The value of setting-order at "${ configFile }" can't be understood. It only could be 'channelFirst' or 'guildFirst'.` );
	}
	log( `setting-order is ${ conf.setting_order }` );

	log( "Checking done. Now we are try to start the bot......" );

	return { client, conf };
}() );
