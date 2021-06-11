#!/usr/bin/env node
var { get, set, remove } = require( "./setting" ),
	program = new ( require( "commander" ).Command )(),
	argv = process.argv;

program.version( "1.0.0" );

program.command( "get [channelID] [key]" )
	.description( "" )
	.action(
		/**
		 * @param {string} [channelID]
		 * @param {string} [key]
		 */
		( channelID, key ) => {
			console.log( get( channelID, key ) );
		}
	);

program.command( "set <channelID> <key> <value>" )
	.description( "" )
	.action(
		/**
		 * @param {string} channelID
		 * @param {string} key
		 * @param {string} value
		 */
		( channelID, key, value ) => {
			if ( isNaN( +channelID ) ) {
				throw new Error( "channelID must be a number" );
			} else if ( key === "lastuse" ) {
				throw new Error( "You can't set timestamp of lastuse!" );
			}
			console.log( set( channelID, key, value ) );
		}
	);

program.command( "remove <channelID> [key]" )
	.description( "" )
	.action(
		/**
		 * @param {string} channelID
		 * @param {string} [key]
		 */
		( channelID, key ) => {
			if ( isNaN( +channelID ) && channelID !== "lastuse" ) {
				throw new Error( "channelID must be a number" );
			} else if ( key === "lastuse" ) {
				throw new Error( "You can't remove timestamp of lastuse!" );
			}
			console.log( remove( channelID, key ) );
		}
	);

program.parse( argv );
