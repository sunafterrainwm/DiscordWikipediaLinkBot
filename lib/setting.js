var path = require( "path" ),
	fs = require( "fs" ),

	// eslint-disable-next-line no-undef
	settingPath = path.normalize( __dirname + "/../conf/setting.json" ),
	setting = fs.readFileSync( settingPath, {
		encoding: "utf-8"
	} );

function getsetting () {
	try {
		if ( !fs.existsSync( settingPath ) ) {
			setting = {};
			fs.writeFileSync( settingPath, "{}" );
			console.log( "[lib/setting.js] warning: setting.json isn't exists, it will be auto create." );
			return "noexist";
		} else {
			setting = JSON.parse( fs.readFileSync( settingPath, {
				encoding: "utf-8"
			} ) );
			return "success"
		}
	} catch ( e ) {
		console.log( "[lib/setting.js] get setting.json error:", e );
		return ["error", e];
	}
}

function get ( $channelID, $key ) {
	getsetting();

	if ( !$channelID ) {
		return setting;
	} else if ( !$key ) {
		return setting[ $channelID ];
	} else {
		if ( !setting[ $channelID ] ) {
			return undefined;
		}
		return setting[ $channelID ][ $key ];
	}
}

function ischange ( oldsetting ) {
	switch ( getsetting() ) {
		case "noexist":
			return false;
		case "success":
			return JSON.stringify( oldsetting ) === JSON.stringify( setting );
		default:
			return false;
	}
	
}

function set ( $channelID, $key, $value ) {
	getsetting();

	if ( setting[ $channelID ] ) {
		setting[ $channelID ][ $key ] = $value;
	} else {
		setting[ $channelID ] = {
			[ $key ]: $value
		};
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting ) );

	return ischange( setting );
}

function remove ( $channelID, $key ) {
	getsetting();

	if ( !setting[ $channelID ] ) {
		return false;
	} else if ( $key ) {
		delete setting[ $channelID ][ $key ];
	} else {
		delete setting[ $channelID ];
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting ) );

	return ischange( setting );
}

module.exports = {
	get,
	set,
	remove
};