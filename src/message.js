var conf = require( "../conf/conf" ),
	each = require( "./each" ),
	log = new ( require( "./console" ) )( "message" );

// cover from https://github.com/wikimedia/mediawiki/blob/5112b637c8b99a583deaf97ca080825f6afa32ea/resources/src/startup/mediawiki#L135

/**
 * Create an object that can be read from or written to via methods that allow
 * interaction both with single and multiple properties at once.
 *
 * @class Map
 * @constructor
 * @private
 */
class Map {
	constructor() {
		this.values = Object.create( null );
	}

	/**
	 * Get the value of one or more keys.
	 *
	 * If called with no arguments, all values are returned.
	 *
	 * @param {string|string[]} [selection] Key or array of keys to retrieve values for.
	 * @param {Mixed} [fallback=null] Value for keys that don"t exist.
	 * @return {Mixed|object|null} If selection was a string, returns the value,
	 *  If selection was an array, returns an object of key/values.
	 *  If no selection is passed, a new object with all key/values is returned.
	 */
	get( selection, fallback ) {
		var results, i;
		fallback = arguments.length > 1 ? fallback : null;

		if ( Array.isArray( selection ) ) {
			results = {};
			for ( i = 0; i < selection.length; i++ ) {
				if ( typeof selection[ i ] === "string" ) {
					results[ selection[ i ] ] = selection[ i ] in this.values ?
						this.values[ selection[ i ] ] :
						fallback;
				}
			}
			return results;
		}

		if ( typeof selection === "string" ) {
			return selection in this.values ?
				this.values[ selection ] :
				fallback;
		}

		if ( selection === undefined ) {
			results = {};
			for ( i in this.values ) {
				results[ i ] = this.values[ i ];
			}
			return results;
		}

		// Invalid selection key
		return fallback;
	}

	/**
	 * Set one or more key/value pairs.
	 *
	 * @param {string|object} selection Key to set value for, or object mapping keys to values
	 * @param {Mixed} [value] Value to set (optional, only in use when key is a string)
	 * @return {boolean} True on success, false on failure
	 */
	set( selection, value ) {
		var s;
		// Use `arguments.length` because `undefined` is also a valid value.
		if ( arguments.length > 1 ) {
			// Set one key
			if ( typeof selection === "string" ) {
				this.values[ selection ] = value;
				return true;
			}
		} else if ( typeof selection === "object" ) {
			// Set multiple keys
			for ( s in selection ) {
				this.values[ s ] = selection[ s ];
			}
			return true;
		}
		return false;
	}

	/**
	 * Check if a given key exists in the map.
	 *
	 * @param {string} selection Key to check
	 * @return {boolean} True if the key exists
	 */
	exists( selection ) {
		return typeof selection === "string" && selection in this.values;
	}
}

// cover from https://github.com/wikimedia/mediawiki/blob/5112b637c8b99a583deaf97ca080825f6afa32ea/resources/src/mediawiki.base/mediawiki.base

/**
 * Object constructor for messages.
 *
 * Similar to the Message class.
 *
 * @class Message
 * @constructor
 * @private
 *
 * @param {mw.Map} map Message store
 * @param {string} key
 * @param {Array} [parameters]
 */
class Message {
	constructor( map = new Map(), key = "", parameters = [] ) {
		this.map = map;
		this.key = key;
		this.parameters = parameters;
		return this;
	}

	/**
	 * Get parsed contents of the message.
	 *
	 * This function will not be called for nonexistent messages.
	 *
	 * @return {string} Parsed message
	 */
	parser() {
		var text = this.map.get( this.key );
		// eslint-disable-next-line no-use-before-define
		text = format.apply( null, [ text ].concat( this.parameters ) );
		return text;
	}

	/**
	 * Add (does not replace) parameters for `$N` placeholder values.
	 *
	 * @param {string[]} parameters
	 * @return {Message}
	 * @chainable
	 */
	params( parameters ) {
		var i;
		for ( i = 0; i < parameters.length; i++ ) {
			this.parameters.push( parameters[ i ] );
		}
		return this;
	}

	/**
	 * Convert message object to its string form based on current format.
	 *
	 * @return {string} Message as a string in the current form, or `⧼key⧽` if key
	 *  does not exist.
	 */
	toString() {
		if ( !this.exists() ) {
			log.add( `warning: loss msg ${this.key}!` );
			return `⧼${ this.key }⧽`;
		}
		return this.parser();
	}

	exists() {
		return this.map.exists( this.key );
	}
}

function format( formatString = "", ...args ) {
	var parameters = args;
	// eslint-disable-next-line no-use-before-define
	formatString = internalDoTransformFormatForQqx( formatString, parameters );
	return formatString.replace( /\$(\d+)/g, function ( _, match ) {
		var index = parseInt( match, 10 ) - 1;
		return parameters[ index ] !== undefined ? parameters[ index ] : "$" + match;
	} );
}

function internalDoTransformFormatForQqx( formatString = "", parameters = [ "" ] ) {
	var parametersString;
	if ( formatString.indexOf( "$*" ) !== -1 ) {
		parametersString = "";
		if ( parameters.length ) {
			parametersString = ": " + parameters.map( function ( _, i ) {
				return "$" + ( i + 1 );
			} ).join( ", " );
		}
		return formatString.replace( "$*", parametersString );
	}
	return formatString;
}

const MessageMap = new Map();

each( conf.msg, function self( k, v ) {
	if ( typeof v !== "string" ) {
		each( v, function ( vk, vv ) {
			self( k + "-" + vk, vv );
		} );
	} else {
		MessageMap.set( k, v );
	}
} );

module.exports = function msg( key, ...args ) {
	return new Message( MessageMap, key, args ).toString();
};
