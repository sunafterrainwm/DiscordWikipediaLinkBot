const conf = require( "../conf/conf.js" ),
	message = require( "./message.js" );

module.exports = function ( txt, baseurl ) {
	if ( !baseurl ) {
		return null;
	}
	var ret = [], $m, $page, $section, $prefix, $limit = conf.parselimit;
	txt
		.replace(/\[\[([^[\]])+?]]|{{([^{}]+?)}}/g, function ($txt) {
		if ( $limit && ret.length > $limit ) {
			return "<token>";
		} else if ( $limit && ret.length === $limit ) {
			message( "parselink-limit", $limit )
			return "<token>";
		}
		$m = [
			$txt.match(/^\[\[([^|#]+)(?:#([^|]+))?.*?]]$/),
			$txt.match(/^{{ *#(exer|if|ifeq|ifexist|ifexpr|switch|time|language|babel|invoke) *:/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:CURRENTYEAR|CURRENTMONTH|CURRENTMONTHNAME|CURRENTMONTHNAMEGEN|CURRENTMONTHABBREV|CURRENTDAY|CURRENTDAY2|CURRENTDOW|CURRENTDAYNAME|CURRENTTIME|CURRENTHOUR|CURRENTWEEK|CURRENTTIMESTAMP|LOCALYEAR|LOCALMONTH|LOCALMONTHNAME|LOCALMONTHNAMEGEN|LOCALMONTHABBREV|LOCALDAY|LOCALDAY2|LOCALDOW|LOCALDAYNAME|LOCALTIME|LOCALHOUR|LOCALWEEK|LOCALTIMESTAMP) .*}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:SITENAME|SERVER|SERVERNAME|DIRMARK|DIRECTIONMARK|SCRIPTPATH|CURRENTVERSION|CONTENTLANGUAGE|CONTENTLANG) .*}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:REVISIONID|REVISIONDAY|REVISIONDAY2|REVISIONMONTH|REVISIONYEAR|REVISIONTIMESTAMP|REVISIONUSER|PAGESIZE|PROTECTIONLEVEL|DISPLAYTITLE|DEFAULTSORT|DEFAULTSORTKEY|DEFAULTCATEGORYSORT)(:.+?)?}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:NUMBEROFPAGES|NUMBEROFARTICLES|NUMBEROFFILES|NUMBEROFEDITS|NUMBEROFVIEWS|NUMBEROFUSERS|NUMBEROFADMINS|NUMBEROFACTIVEUSERS|PAGESINCATEGORY|PAGESINCAT|PAGESINCATEGORY|PAGESINCATEGORY|PAGESINCATEGORY|PAGESINCATEGORY|NUMBERINGROUP|NUMBERINGROUP|PAGESINNS|PAGESINNAMESPACE)([:|].+?)?}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:FULLPAGENAME|PAGENAME|BASEPAGENAME|SUBPAGENAME|SUBJECTPAGENAME|TALKPAGENAME|FULLPAGENAMEE|PAGENAMEE|BASEPAGENAMEE|SUBPAGENAMEE|SUBJECTPAGENAMEE|TALKPAGENAMEE)(:.+?)?}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(?:NAMESPACE|SUBJECTSPACE|ARTICLESPACE|TALKSPACE|NAMESPACEE|SUBJECTSPACEE|TALKSPACEE)(:.+?)?}}$/),
			$txt.match(/^{{ *! *}}$/),
			$txt.match(/^{{ *(localurl|fullurl|filepath|urlencode|anchorencode):.+}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?(lc|lcfirst|uc|ucfirst|formatnum|#dateformat|#formatdate|padleft|padright|plural):.+}}$/),
			$txt.match(/^{{ *(int|#special|#tag|gender|PAGEID|noexternallanglinks)(:.+)?}}$/),
			$txt.match(/^{{ *(?:subst:|safesubst:)?([^|]+)(?:|.+)?}}$/)
		];
		if ( $m[ 0 ] ) {
			$prefix = "";
			$page = $m[ 0 ][ 1 ].trim();
			if ( $m[ 0 ][2] ) {
				$section = "#" + $m[ 0 ][2];
			}
			else {
				$section = "";
			}
			if ( $page.startsWith( "../" ) ) {
				console.warn( `[lib/parselink.js] warning: refused parse link like "../": "${ $page }${ $section }"` );
				ret.push( `[[${ $page }${ $section }]]` );
				return;
			}
		}
		else if ( $m[ 1 ] ) {
			$prefix = "";
			$page = "Help:解析器函数";
			$section = "#" + $m[2][ 1 ];
		}
		else if ( $m[2] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#日期与时间";
		}
		else if ( $m[3] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#技术元数据";
		}
		else if ( $m[4] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#技术元数据";
		}
		else if ( $m[5] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#统计";
		}
		else if ( $m[6] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#页面标题";
		}
		else if ( $m[7] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#命名空间";
		}
		else if ( $m[8] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#其他";
		}
		else if ( $m[9] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#URL数据";
		}
		else if ( $m[10] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#格式";
		}
		else if ( $m[11] ) {
			$prefix = "";
			$page = "Help:魔术字";
			$section = "#杂项";
		}
		else if ( $m[12] ) {
			$prefix = "Template:";
			$page = $m[12][ 1 ].trim();
			$section = "";
		}
		else {
			return "<token>";
		}
		ret.push( ( baseurl + $prefix + $page + $section ).replace( /\s/g, "_" ).replace( /:$/, "%3A" ) );
		return "<token>";
	});
	return ret.join("\n");
};