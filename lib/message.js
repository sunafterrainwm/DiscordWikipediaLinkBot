var conf = require( "../conf/conf.js" );

// cover from https://github.com/wikimedia/mediawiki/blob/5112b637c8b99a583deaf97ca080825f6afa32ea/resources/src/mediawiki.base/mediawiki.base.js

function Message( map, key, parameters ) {
	this.format = 'text';
	this.map = map;
	this.key = key;
	this.parameters = parameters === undefined ? [] : parameters;
	return this;
}
	
Message.prototype = {	
	parser: function () {
		var text = this.map[ this.key ];
		text = format.apply( null, [ text ].concat( this.parameters ) );
		return text;
	},

	params: function ( parameters ) {
		var i;
		for ( i = 0; i < parameters.length; i++ ) {
			this.parameters.push( parameters[ i ] );
		}
		return this;
	},

	toString: function () {	
		if ( !this.exists() ) {
			console.log( `[lib/message.js] warning: loss msg ${ this.key }!` );
			return `⧼${ this.key }⧽`;
		}
		return this.parser();
	},

	exists: function () {
		return typeof this.key === 'string' && this.key in this.map;
	}
};

function format ( formatString ) {
	var parameters = Array.prototype.slice.call( arguments, 1 );
	formatString = internalDoTransformFormatForQqx( formatString, parameters );
	return formatString.replace( /\$(\d+)/g, function ( str, match ) {
		var index = parseInt( match, 10 ) - 1;
		return parameters[ index ] !== undefined ? parameters[ index ] : '$' + match;
	} );
}

function internalDoTransformFormatForQqx ( formatString, parameters ) {
	var parametersString;
	if ( formatString.indexOf( '$*' ) !== -1 ) {
		parametersString = '';
		if ( parameters.length ) {
			parametersString = ': ' + parameters.map( function ( _, i ) {
				return '$' + ( i + 1 );
			} ).join( ', ' );
		}
		return formatString.replace( '$*', parametersString );
	}
	return formatString;
}

function msg ( key, ...args ) {
	return new Message( conf.msg, key, args ).toString();
}

module.exports = msg;