const guildFirst = require( "../conf/conf.js" ).setting_order === "guildFirst";

module.exports = class DiscordMessage {
	/**
	 *
	 * @param {import("discord.js").Message} $msg
	 * @returns
	 */
	constructor( $msg ) {
		if ( !$msg.channel ) {
			return false;
		}
		this.content = $msg.content;
		this.author = $msg.author;

		this.channel = $msg.channel;
		this.createdTimestamp = $msg.createdTimestamp;

		this.channelId = this.channel.id;
		this.messageId = $msg.id;
		this.settingId = ( guildFirst ? $msg.guild || $msg.channel : $msg.channel ).id;
		this.userid = $msg.author.id;
	}

	get usertag() {
		return this.author.tag;
	}

	get isBot() {
		return this.author.bot;
	}

	isUser( id = "" ) {
		return this.author.id === id;
	}

	/**
	 *
	 * @param {string} $msg
	 * @returns {Promise<true>|Promise<Error>}
	 */
	async reply( $msg ) {
		try {
			this.channel.send( $msg );
			return true;
		} catch ( $e ) {
			console.log( $e );
			return $e;
		}
	}

	PassNewMessage( $msg = "" ) {
		this.content = $msg;
	}
};
