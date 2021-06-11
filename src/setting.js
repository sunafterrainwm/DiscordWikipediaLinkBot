const path = require( "path" ),
	fs = require( "fs" ),
	conf = require( "../conf/conf" ),
	log = new ( require( "./console" ) )( "src/log" ),

	// eslint-disable-next-line no-undef
	settingPath = path.normalize( `${ __dirname }/../${ conf.path.setting }` );

let setting = fs.readFileSync( settingPath, {
	encoding: "utf-8"
} );

/**
 * @returns {"noexist"|"success"|["error", Error]}
 */
function getsetting() {
	try {
		if ( !fs.existsSync( settingPath ) ) {
			setting = {};
			fs.writeFileSync( settingPath, "{}" );

			log.add( "warning: settingon isn't exists, it will be auto create." );
			return "noexist";
		} else {
			setting = JSON.parse( fs.readFileSync( settingPath, {
				encoding: "utf-8"
			} ) );
			return "success";
		}
	} catch ( e ) {
		log.add( "get settingon error: " + e );
		return [ "error", e ];
	}
}

/**
 * @param {string|number} [$id]
 * @param {string} [$key]
 * @returns {Mixed|object|undefined}
 */
function get( $id, $key ) {
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

/**
 * @param {object} oldsetting
 * @returns {boolean}
 */
function ischange( oldsetting ) {
	switch ( getsetting() ) {
		case "noexist":
			return false;
		case "success":
			return JSON.stringify( oldsetting ) === JSON.stringify( setting );
		default:
			return false;
	}

}

/**
 * @param {string|number} $id
 * @param {string} $key
 * @param {Mixed} $value
 * @returns {boolean}
 */
function set( $id, $key, $value ) {
	getsetting();

	if ( setting[ $id ] ) {
		setting[ $id ][ $key ] = $value;
	} else {
		setting[ $id ] = {
			[ $key ]: $value
		};
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting, null, "\t" ) );

	return ischange( setting );
}

/**
 * @param {string|number} $id
 * @param {string} $key
 * @returns {boolean}
 */
function remove( $id, $key ) {
	getsetting();

	if ( !setting[ $id ] ) {
		return false;
	} else if ( $key ) {
		delete setting[ $id ][ $key ];
	} else {
		delete setting[ $id ];
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting, null, "\t" ) );

	return ischange( setting );
}

/**
 * @param {number} $timestamp
 * @param {string|number} [$id]
 * @returns {boolean}
 */
function updateusingtime( $timestamp, $id ) {
	getsetting();

	if ( $id ) {
		setting[ $id ].lastuse = $timestamp;
	} else {
		setting.lastuse = $timestamp;
	}

	fs.writeFileSync( settingPath, JSON.stringify( setting, null, "\t" ) );

	return ischange( setting );
}

module.exports = {
	get,
	set,
	remove,
	updateusingtime
};
