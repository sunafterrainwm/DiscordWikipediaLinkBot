const path = require( "path" ),
	fs = require( "fs" ),
	conf = require( "../conf/conf.js" ),
	log = new ( require( "./console.js" ) )( "lib/log.js" ),

	// eslint-disable-next-line no-undef
	settingPath = path.normalize( `${ __dirname }/../${ conf.path.setting }` );

let setting = fs.readFileSync( settingPath, {
	encoding: "utf-8"
} );

function getsetting () {
	try {
		if ( !fs.existsSync( settingPath ) ) {
			setting = {};
			fs.writeFileSync( settingPath, "{}" );

			log.add( "warning: setting.json isn't exists, it will be auto create." );
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

function get ( $id, $key ) {
	getsetting();

	if ( !$id ) {
		return setting;
	} else if ( !$key ) {
		return setting[ $id ];
	} else {
		if ( !setting[ $id ] ) {
			return undefined;
		}
		return setting[ $id ][ $key ];
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

function set ( $id, $key, $value ) {
	getsetting();

	if ( setting[ $id ] ) {
		setting[ $id ][ $key ] = $value;
	} else {
		setting[ $id ] = {
			[ $key ]: $value
		};
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting ) );

	return ischange( setting );
}

function remove ( $id, $key ) {
	getsetting();

	if ( !setting[ $id ] ) {
		return false;
	} else if ( $key ) {
		delete setting[ $id ][ $key ];
	} else {
		delete setting[ $id ];
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting ) );

	return ischange( setting );
}

module.exports = {
	get,
	set,
	remove
};