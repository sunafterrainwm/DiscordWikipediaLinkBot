const conf = require( "../conf/conf" ),
	log = new ( require( "./console" ) )( "parselink" ),
	message = require( "./message" ),
	setting = require( "./setting" ),
	defaultArticlepath = conf.defaultArticlepath,
	$limit = conf.parselimit || null;

/**
 *
 * @param {string} baseurl
 * @returns {RegExpMatchArray|null}
 */
function iszhwp( baseurl ) {
	return baseurl.match( /\/\/zh\.wikipedia\.org\/|\/\/zhwp\.org\// );
}

/**
 *
 * @param {import("./discordmessage")} $msg
 * @param {import("./logs")} logs
 * @returns {Promise<void>}
 */
module.exports = async function ( $msg, logs ) {
	const baseurl = setting.get( $msg.settingId, "articlepath" ) || defaultArticlepath,
		ret = [],
		$zhwp = iszhwp( baseurl );

	/**
	 * @type {RegExpMatchArray}
	 */
	let $m,
		$page = "",
		$section = "",
		$url = "";

	$msg.content.replace( /\[\[([^[\]])+?\]\]|{{([^{}]+?)}}/g, function ( $txt ) {
		if ( $limit && ret.length > $limit ) {
			return "<token>";
		} else if ( $limit && ret.length === $limit ) {
			ret.push( message( "parselink-limit", $limit ) );
			log.add( `Warning: Refusing to parse more then ${ $limit } links.` );
			return "<token>";
		}

		if ( /^\[\[([^|#]+)(?:#([^|]+))?.*?\]\]$/.exec( $txt ) ) {
			$m = $txt.match( /^\[\[([^|#]+)(?:#([^|]+))?.*?\]\]$/ );
			$page = $m[ 1 ].trim();
			if ( $m[ 2 ] ) {
				$section = "#" + $m[ 0 ][ 2 ];
			} else {
				$section = "";
			}
			if ( $page.startsWith( "../" ) ) {
				logs.parseerror = `refused parse link like "../": "${ $page }${ $section }"`;
				console.warn( `[lib/parselink] warning: refused parse link like "../": "${ $page }${ $section }"` );
				ret.push( `[[${ $page }${ $section }]]` );
				return "<token>";
			}
			$url = `${ baseurl }${ $page }${ $section }`;
		} else if ( /^{{ *(?:subst:|safesubst:)?#(exer|if|ifeq|ifexist|ifexpr|switch|time|language|babel|invoke) *:/.exec( $txt ) ) {
			$m = $txt.match( /^{{ *(?:subst:|safesubst:)?#(exer|if|ifeq|ifexist|ifexpr|switch|time|language|babel|invoke) *:/ );
			$url = $zhwp ?
				`${ baseurl }Help:解析器函数#${ $m[ 1 ] }` :
				`https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Extension:ParserFunctions#${ $m[ 1 ] }`;
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:CURRENTYEAR|CURRENTMONTH|CURRENTMONTHNAME|CURRENTMONTHNAMEGEN|" +
			"CURRENTMONTHABBREV|CURRENTDAY|CURRENTDAY2|CURRENTDOW|CURRENTDAYNAME|CURRENTTIME|CURRENTHOUR|CURRENTWEEK|" +
			"CURRENTTIMESTAMP|LOCALYEAR|LOCALMONTH|LOCALMONTHNAME|LOCALMONTHNAMEGEN|LOCALMONTHABBREV|LOCALDAY|LOCALDAY2|" +
			"LOCALDOW|LOCALDAYNAME|LOCALTIME|LOCALHOUR|LOCALWEEK|LOCALTIMESTAMP) .*}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#日期与时间` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Date_and_time";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:SITENAME|SERVER|SERVERNAME|DIRMARK|" +
			"DIRECTIONMARK|SCRIPTPATH|CURRENTVERSION|CONTENTLANGUAGE|CONTENTLANG) .*}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#技术元数据` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Technical_metadata";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:REVISIONID|REVISIONDAY|REVISIONDAY2|REVISIONMONTH|" +
			"REVISIONYEAR|REVISIONTIMESTAMP|REVISIONUSER|PAGESIZE|PROTECTIONLEVEL|DISPLAYTITLE|DEFAULTSORT|DEFAULTSORTKEY|DEFAULTCATEGORYSORT)(:.+?)?}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#技术元数据` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Technical_metadata";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:NUMBEROFPAGES|NUMBEROFARTICLES|NUMBEROFFILES|NUMBEROFEDITS|NUMBEROFVIEWS|" +
			"NUMBEROFUSERS|NUMBEROFADMINS|NUMBEROFACTIVEUSERS|PAGESINCATEGORY|PAGESINCAT|PAGESINCATEGORY|PAGESINCATEGORY|PAGESINCATEGORY|" +
			"PAGESINCATEGORY|NUMBERINGROUP|NUMBERINGROUP|PAGESINNS|PAGESINNAMESPACE)([:|].+?)?}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#统计` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Statistics";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:FULLPAGENAME|PAGENAME|BASEPAGENAME|SUBPAGENAME|SUBJECTPAGENAME|" +
			"TALKPAGENAME|FULLPAGENAMEE|PAGENAMEE|BASEPAGENAMEE|SUBPAGENAMEE|SUBJECTPAGENAMEE|TALKPAGENAMEE)(:.+?)?}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#页面标题` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Page_names";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(?:NAMESPACE|SUBJECTSPACE|ARTICLESPACE|TALKSPACE|NAMESPACEE|" +
			"SUBJECTSPACEE|TALKSPACEE)(:.+?)?}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#命名空间` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Namespaces";
		} else if ( /^{{ *! *}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#其他` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Other";
		} else if ( /^{{ *(localurl|fullurl|filepath|urlencode|anchorencode):.+}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#URL数据` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#URL_data";
		} else if ( /^{{ *(?:subst:|safesubst:)?ns:\d+ *}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#命名空间_2` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Namespaces_2";
		} else if ( new RegExp( "^{{ *(?:subst:|safesubst:)?(lc|lcfirst|uc|ucfirst" +
			"|formatnum|#dateformat|#formatdate|padleft|padright|plural):.+}}$"
		).exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#格式` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Formatting";
		} else if ( /^{{ *(plural|grammar|gender|int)(:.+)?}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#杂项` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Formatting";
		} else if ( /^{{ *(msg|raw|msgnw|subst|safesubst)(:.+)?}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#杂项` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Transclusion_modifiers";
		} else if ( /^{{ *(#language|#special|#tag)(:.+)?}}$/.exec( $txt ) ) {
			$url = $zhwp ?
				`${ baseurl }Help:魔术字#杂项` :
				"https://www.mediawiki.org/wiki/Special:MyLanguage/Help:Magic_words#Miscellaneous";
		} else if ( /^{{ *(?:subst:|safesubst:)?([^|]+)(?:|.+)?}}$/.exec( $txt ) ) {
			$m = $txt.match( /^{{ *(?:subst:|safesubst:)?([^|]+)(?:|.+)?}}$/ );
			$page = $m[ 1 ].trim();
			$url = `${ baseurl }${ $page.startsWith( ":" ) ? $page.replace( /^:/, "" ) : `Template:${ $page }` }`;
		}
		ret.push( $url.replace( /\s/g, "_" ).replace( /\?/g, "%3F" ).replace( /!$/, "%21" ).replace( /:$/, "%3A" ) );
		return "<token>";
	} );

	if ( ret.length > 0 ) {
		setting.updateusingtime( $msg.createdTimestamp, $msg.settingId );
		logs.parse = true;
		logs.parseret = ret.join( "\\n" );
		$msg.reply( ret.join( "\n" ) );
		log.add( logs );
	} else {
		logs.parse = false;
		logs.parseret = ret.join( "\\n" );
		log.add( logs );
	}
};
