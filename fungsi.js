(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);
!function(a){a.fn.menuify=function(){return this.each(function(){var $t=a(this),b=$t.find('.LinkList ul > li').children('a'),c=b.length;for(var i=0;i<c;i++){var d=b.eq(i),h=d.text();if(h.charAt(0)!=='_'){var e=b.eq(i+1),j=e.text();if(j.charAt(0)==='_'){var m=d.parent();m.append('<ul class="sub-menu m-sub"/>');}}if(h.charAt(0)==='_'){d.text(h.replace('_',''));d.parent().appendTo(m.children('.sub-menu'));}}for(var i=0;i<c;i++){var f=b.eq(i),k=f.text();if(k.charAt(0)!=='_'){var g=b.eq(i+1),l=g.text();if(l.charAt(0)==='_'){var n=f.parent();n.append('<ul class="sub-menu2 m-sub"/>');}}if(k.charAt(0)==='_'){f.text(k.replace('_',''));f.parent().appendTo(n.children('.sub-menu2'));}}$t.find('.LinkList ul li ul').parent('li').addClass('has-sub');});}}(jQuery);
!function(a){a.fn.tabify=function(b){b=jQuery.extend({onHover:false,animated:true,transition:'fadeInUp'},b);return this.each(function(){var e=a(this),c=e.children('[tab-ify]'),d=0,n='tab-animated',k='tab-active';if(b.onHover==true){var event='mouseenter'}else{var event='click'}e.prepend('<ul class="select-tab"></ul>');c.each(function(){if(b.animated==true){a(this).addClass(n)}e.find('.select-tab').append('<li><a href="javascript:;">'+a(this).attr('tab-ify')+'</a></li>')}).eq(d).addClass(k).addClass('tab-'+b.transition);e.find('.select-tab a').on(event,function(){var f=a(this).parent().index();a(this).closest('.select-tab').find('.active').removeClass('active');a(this).parent().addClass('active');c.removeClass(k).removeClass('tab-'+b.transition).eq(f).addClass(k).addClass('tab-'+b.transition);return false}).eq(d).parent().addClass('active')})}}(jQuery);
(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);
! function (_0x974dx2) {
    _0x974dx2.fn.lazyify = function () {
        return this.each(function () {
            var _0x974dx3 = _0x974dx2(this),
                _0x974dx4 = _0x974dx3.attr("data-image"),
                _0x974dx5 = Math.round(_0x974dx3.width()),
                _0x974dx6 = Math.round(_0x974dx3.height()),
                _0x974dx7 = "/w" + _0x974dx5 + "-h" + _0x974dx6 + "-p-k-no-nu",
                _0x974dx8 = "";
            if (_0x974dx4.match("s72-c")) {
                _0x974dx8 = _0x974dx4.replace("/s72-c", _0x974dx7)
            } else {
                if (_0x974dx4.match("w72-h")) {
                    _0x974dx8 = _0x974dx4.replace("/w72-h72-p-k-no-nu", _0x974dx7)
                } else {
                    _0x974dx8 = _0x974dx4
                }
            };
            _0x974dx2(window).on("load resize scroll", _0x974dx9);

            function _0x974dx9() {
                var _0x974dxa = _0x974dx2(window).height(),
                    _0x974dxb = _0x974dx2(window).scrollTop(),
                    _0x974dxc = _0x974dx3.offset().top;
                if (_0x974dxb + _0x974dxa > _0x974dxc) {
                    var _0x974dxd = new Image();
                    _0x974dxd.onload = function () {
                        _0x974dx3.attr("style", "background-image:url\(" + this.src + "\)").addClass("lazy-ify")
                    }, _0x974dxd.src = _0x974dx8
                }
            }
            _0x974dx9()
        })
    }
}(jQuery);
$("#gmag-free-main-menu").menuify();
$("#gmag-free-main-menu .widget").addClass("show-menu");
$(".search-toggle").on("click", function () {
    $("body").toggleClass("search-active")
});
$(".blog-posts-title a.more,.related-title a.more").each(function () {
    var _0x974dxe = $(this),
        _0x974dxf = viewAllText;
    if (_0x974dxf != "") {
        _0x974dxe.text(_0x974dxf)
    }
});
$(".follow-by-email-text").each(function () {
    var _0x974dxe = $(this),
        _0x974dx10 = followByEmailText;
    if (_0x974dx10 != "") {
        _0x974dxe.text(_0x974dx10)
    }
});
$("#sidebar-tabs").tabify();
$(".post-body strike").each(function () {
    var _0x974dxe = $(this),
        _0x974dx11 = _0x974dxe.text().trim();
    if (_0x974dx11 == "\$ads=\{1\}") {
        _0x974dxe.replaceWith('<div id="gmag-free-new-before-ad"/>')
    };
    if (_0x974dx11 == "\$ads=\{2\}") {
        _0x974dxe.replaceWith('<div id="gmag-free-new-after-ad"/>')
    }
});
$("#gmag-free-new-before-ad").each(function () {
    var _0x974dxe = $(this);
    if (_0x974dxe.length) {
        $("#before-ad").appendTo(_0x974dxe)
    }
});
$("#gmag-free-new-after-ad").each(function () {
    var _0x974dxe = $(this);
    if (_0x974dxe.length) {
        $("#after-ad").appendTo(_0x974dxe)
    }
});
$("#gmag-free-main-before-ad .widget").each(function () {
    var _0x974dxe = $(this);
    if (_0x974dxe.length) {
        _0x974dxe.appendTo($("#before-ad"))
    }
});
$("#gmag-free-main-after-ad .widget").each(function () {
    var _0x974dxe = $(this);
    if (_0x974dxe.length) {
        _0x974dxe.appendTo($("#after-ad"))
    }
});
$(".avatar-image-container img").attr("src", function (_0x974dx12, _0x974dx13) {
    _0x974dx13 = _0x974dx13.replace("//resources.blogblog.com/img/blank.gif", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg");
    _0x974dx13 = _0x974dx13.replace("//img1.blogblog.com/img/blank.gif", "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/s35-r/avatar.jpg");
    return _0x974dx13
});
$(".post-body a").each(function () {
    var _0x974dx12 = $(this),
        _0x974dx14 = _0x974dx12.text().trim(),
        _0x974dx15 = _0x974dx14.split("/"),
        _0x974dx16 = _0x974dx15[0],
        _0x974dx17 = _0x974dx15[1],
        _0x974dx18 = _0x974dx15.pop();
    if (_0x974dx14.match("button")) {
        _0x974dx12.addClass("button").text(_0x974dx16);
        if (_0x974dx17 != "button") {
            _0x974dx12.addClass(_0x974dx17)
        };
        if (_0x974dx18 != "button") {
            _0x974dx12.addClass("colored-button").css({
                'background-color': _0x974dx18
            })
        }
    }
});
$(".post-body strike").each(function () {
    var _0x974dx12 = $(this),
        _0x974dx14 = _0x974dx12.text().trim(),
        _0x974dx19 = _0x974dx12.html();
    if (_0x974dx14.match("contact-form")) {
        _0x974dx12.replaceWith('<div class="contact-form"/>');
        $(".contact-form").append($("#ContactForm1"))
    };
    if (_0x974dx14.match("alert-success")) {
        _0x974dx12.replaceWith('<div class="alert-message alert-success short-b">' + _0x974dx19 + "</div>")
    };
    if (_0x974dx14.match("alert-info")) {
        _0x974dx12.replaceWith('<div class="alert-message alert-info short-b">' + _0x974dx19 + "</div>")
    };
    if (_0x974dx14.match("alert-warning")) {
        _0x974dx12.replaceWith('<div class="alert-message alert-warning short-b">' + _0x974dx19 + "</div>")
    };
    if (_0x974dx14.match("alert-error")) {
        _0x974dx12.replaceWith('<div class="alert-message alert-error short-b">' + _0x974dx19 + "</div>")
    };
    if (_0x974dx14.match("left-sidebar")) {
        _0x974dx12.replaceWith("<style>.item #main-wrapper\{float:right\}.item #sidebar-wrapper\{float:left\}</style>")
    };
    if (_0x974dx14.match("right-sidebar")) {
        _0x974dx12.replaceWith("<style>.item #main-wrapper\{float:left\}.item #sidebar-wrapper\{float:right\}</style>")
    };
    if (_0x974dx14.match("full-width")) {
        _0x974dx12.replaceWith("<style>.item #main-wrapper\{width:100%\}.item #sidebar-wrapper\{display:none\}</style>")
    };
    if (_0x974dx14.match("code-box")) {
        _0x974dx12.replaceWith('<pre class="code-box short-b">' + _0x974dx19 + "</pre>")
    };
    var _0x974dx1a = $(".post-body .short-b").find("b");
    _0x974dx1a.each(function () {
        var _0x974dx1b = $(this),
            _0x974dxe = _0x974dx1b.text().trim();
        if (_0x974dxe.match("alert-success") || _0x974dxe.match("alert-info") || _0x974dxe.match("alert-warning") || _0x974dxe.match("alert-error") || _0x974dxe.match("code-box")) {
            _0x974dx1b.replaceWith("")
        }
    })
});
$(".gmag-free-share-links .window-ify,.entry-share .window-ify").on("click", function () {
    var _0x974dx12 = $(this),
        _0x974dx1c = _0x974dx12.data("url"),
        _0x974dx1d = _0x974dx12.data("width"),
        _0x974dx1e = _0x974dx12.data("height"),
        _0x974dx1f = window.screen.width,
        _0x974dx20 = window.screen.height,
        _0x974dx21 = Math.round(_0x974dx1f / 2 - _0x974dx1d / 2),
        _0x974dx22 = Math.round(_0x974dx20 / 2 - _0x974dx1e / 2),
        _0x974dx23 = window.open(_0x974dx1c, "_blank", "scrollbars=yes,resizable=yes,toolbar=no,location=yes,width=" + _0x974dx1d + ",height=" + _0x974dx1e + ",left=" + _0x974dx21 + ",top=" + _0x974dx22);
    _0x974dx23.focus()
});
$(".gmag-free-share-links").each(function () {
    var _0x974dxe = $(this),
        _0x974dx1b = _0x974dxe.find(".show-hid a");
    _0x974dx1b.on("click", function () {
        _0x974dxe.toggleClass("show-hidden")
    })
});
$(".about-author .author-description span a").each(function () {
    var _0x974dx12 = $(this),
        _0x974dx24 = _0x974dx12.text().trim(),
        _0x974dx1c = _0x974dx12.attr("href");
    _0x974dx12.replaceWith('<li class="' + _0x974dx24 + '"><a href="' + _0x974dx1c + '" title="' + _0x974dx24 + '" target="_blank"/></li>');
    $(".description-links").append($(".author-description span li"));
    $(".description-links").addClass("show")
});

function msgError() {
    return '<span class="no-posts"><b>Error:</b> No Results Found</span>'
}

function beforeLoader() {
    return '<div class="loader"/>'
}

function getFeedUrl(_0x974dx14, _0x974dx28, _0x974dx29) {
    var _0x974dx2a = "";
    switch (_0x974dx29) {
    case "recent":
        _0x974dx2a = "/feeds/posts/summary\?alt=json&max-results=" + _0x974dx28;
        break;
    case "comments":
        if (_0x974dx14 == "list") {
            _0x974dx2a = "/feeds/comments/summary\?alt=json&max-results=" + _0x974dx28
        } else {
            _0x974dx2a = "/feeds/posts/summary/-/" + _0x974dx29 + "\?alt=json&max-results=" + _0x974dx28
        };
        break;
    default:
        _0x974dx2a = "/feeds/posts/summary/-/" + _0x974dx29 + "\?alt=json&max-results=" + _0x974dx28;
        break
    };
    return _0x974dx2a
}

function getPostLink(_0x974dx2c, _0x974dx13) {
    for (var _0x974dx2d = 0; _0x974dx2d < _0x974dx2c[_0x974dx13].link.length; _0x974dx2d++) {
        if (_0x974dx2c[_0x974dx13].link[_0x974dx2d].rel == "alternate") {
            var _0x974dx2e = _0x974dx2c[_0x974dx13].link[_0x974dx2d].href;
            break
        }
    };
    return _0x974dx2e
}

function getPostTitle(_0x974dx2c, _0x974dx13) {
    var _0x974dxd = _0x974dx2c[_0x974dx13].title["\$t"];
    return _0x974dxd
}

function getPostImage(_0x974dx2c, _0x974dx13) {
    if ("media\$thumbnail" in _0x974dx2c[_0x974dx13]) {
        var _0x974dx31 = _0x974dx2c[_0x974dx13]["media\$thumbnail"].url;
        if (_0x974dx31.match("img.youtube.com")) {
            _0x974dx31 = _0x974dx31.replace("/default.", "/0.")
        };
        var _0x974dx8 = _0x974dx31
    } else {
        _0x974dx8 = "https://4.bp.blogspot.com/-eALXtf-Ljts/WrQYAbzcPUI/AAAAAAAABjY/vptx-N2H46oFbiCqbSe2JgVSlHhyl0MwQCK4BGAYYCw/s72-c/nth-ify.png"
    };
    return _0x974dx8
}

function getPostAuthor(_0x974dx2c, _0x974dx13) {
    var _0x974dxd = _0x974dx2c[_0x974dx13].author[0].name["\$t"],
        _0x974dx33 = messages.postAuthorLabel,
        _0x974dx34 = "";
    if (_0x974dx33 != "") {
        _0x974dx34 = '<span class="by">' + _0x974dx33 + "</span>"
    } else {
        _0x974dx34 = ""
    };
    if (messages.postAuthor == "true") {
        var _0x974dx35 = '<span class="entry-author">' + _0x974dx34 + '<span class="author">' + _0x974dxd + "</span></span>"
    } else {
        var _0x974dx35 = ""
    };
    return _0x974dx35
}

function getPostDate(_0x974dx2c, _0x974dx13) {
    var _0x974dx37 = _0x974dx2c[_0x974dx13].published["\$t"],
        _0x974dx38 = _0x974dx37.substring(0, 4),
        _0x974dx39 = _0x974dx37.substring(5, 7),
        _0x974dx3a = _0x974dx37.substring(8, 10),
        _0x974dx3b = monthFormat[parseInt(_0x974dx39, 10) - 1] + " " + _0x974dx3a + ", " + _0x974dx38;
    if (messages.postDate == "true") {
        var _0x974dx35 = '<span class="entry-time"><time class="published" datetime="' + _0x974dx37 + '">' + _0x974dx3b + "</time></span>"
    } else {
        _0x974dx35 = ""
    };
    return _0x974dx35
}

function getPostMeta(_0x974dx3d, _0x974dx3e) {
    if (messages.postAuthor == "true" && messages.postDate == "true") {
        var _0x974dx3f = '<div class="entry-meta m-1">' + _0x974dx3d + _0x974dx3e + "</div>"
    } else {
        if (messages.postAuthor == "true") {
            _0x974dx3f = '<div class="entry-meta m-2">' + _0x974dx3d + "</div>"
        } else {
            if (messages.postDate == "true") {
                _0x974dx3f = '<div class="entry-meta m-2">' + _0x974dx3e + "</div>"
            } else {
                _0x974dx3f = ""
            }
        }
    };
    if (messages.postDate == "true") {
        var _0x974dx40 = '<div class="entry-meta m-2">' + _0x974dx3e + "</div>"
    } else {
        _0x974dx40 = ""
    };
    var _0x974dx35 = [_0x974dx3f, _0x974dx40];
    return _0x974dx35
}

function getPostLabel(_0x974dx2c, _0x974dx13) {
    if (_0x974dx2c[_0x974dx13].category != undefined) {
        var _0x974dx42 = _0x974dx2c[_0x974dx13].category[0].term,
            _0x974dx35 = '<span class="entry-category">' + _0x974dx42 + "</span>"
    } else {
        _0x974dx35 = ""
    };
    return _0x974dx35
}

function getPostComments(_0x974dx2c, _0x974dx13, _0x974dx2e) {
    var _0x974dxd = _0x974dx2c[_0x974dx13].author[0].name["\$t"],
        _0x974dx34 = _0x974dx2c[_0x974dx13].author[0]["gd\$image"].src.replace("/s113", "/w55-h55-p-k-no-nu"),
        _0x974dx3b = _0x974dx2c[_0x974dx13].title["\$t"];
    if (_0x974dx34.match("//img1.blogblog.com/img/blank.gif") || _0x974dx34.match("//img1.blogblog.com/img/b16-rounded.gif")) {
        var _0x974dx8 = "//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/w55-h55-p-k-no-nu/avatar.jpg"
    } else {
        var _0x974dx8 = _0x974dx34
    };
    var _0x974dx35 = '<article class="custom-item item-' + _0x974dx13 + '"><a class="entry-image-link cmm-avatar" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx8 + '"/></a><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dxd + '</a></h2><p class="cmm-snippet excerpt">' + _0x974dx3b + "</p></article>";
    return _0x974dx35
}

function getCustomStyle(_0x974dx14, _0x974dx29, _0x974dx18, _0x974dx45) {
    _0x974dx45 = _0x974dx29.replace(" ", "-");
    if (_0x974dx18 != false) {
        if (_0x974dx14 == "featured") {
            var _0x974dx35 = ".id-" + _0x974dx14 + "-" + _0x974dx45 + " .entry-category\{background-color:" + _0x974dx18 + ";color:#fff\}.id-" + _0x974dx14 + "-" + _0x974dx45 + " .loader:after\{border-color:" + _0x974dx18 + ";border-right-color:rgba\(155,155,155,0.2\)\}"
        } else {
            _0x974dx35 = ".id-" + _0x974dx14 + "-" + _0x974dx45 + " .entry-category\{background-color:" + _0x974dx18 + ";color:#fff\}.id-" + _0x974dx14 + "-" + _0x974dx45 + " .title-wrap > h3,.id-" + _0x974dx14 + "-" + _0x974dx45 + " .title-wrap > a.more:hover,.id-" + _0x974dx14 + "-" + _0x974dx45 + " .entry-header:not\(.entry-info\) .entry-title a:hover,.id-" + _0x974dx14 + "-" + _0x974dx45 + " .entry-header:not\(.entry-info\) .entry-meta span.author\{color:" + _0x974dx18 + "\}.id-" + _0x974dx14 + "-" + _0x974dx45 + " .loader:after\{border-color:" + _0x974dx18 + ";border-right-color:rgba\(155,155,155,0.2\)\}"
        }
    } else {
        _0x974dx35 = ""
    };
    return _0x974dx35
}

function getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx18) {
    switch (_0x974dx14) {
    case "msimple":
        ;
    case "featured1":
        ;
    case "block1":
        ;
    case "col-left":
        ;
    case "col-right":
        ;
    case "grid1":
        ;
    case "grid2":
        ;
    case "videos":
        ;
    case "gallery":
        ;
    case "list":
        ;
    case "related":
        if (_0x974dx29 == false) {
            _0x974dx29 = "geterror404"
        };
        var _0x974dx2a = getFeedUrl(_0x974dx14, _0x974dx28, _0x974dx29);
        $.ajax({
            url: _0x974dx2a,
            type: "GET",
            dataType: "json",
            cache: true,
            beforeSend: function (_0x974dx47) {
                var _0x974dx48 = getCustomStyle(_0x974dx14, _0x974dx29, _0x974dx18),
                    _0x974dx45 = _0x974dx29.replace(" ", "-");
                switch (_0x974dx14) {
                case "featured1":
                    ;
                case "featured2":
                    ;
                case "featured3":
                    $("#page-skin-2").prepend(_0x974dx48);
                    _0x974dx12.html(beforeLoader()).parent().addClass("type-" + _0x974dx14 + " id-" + _0x974dx14 + "-" + _0x974dx45 + " show-ify");
                    break;
                case "block1":
                    ;
                case "grid1":
                    ;
                case "grid2":
                    ;
                case "videos":
                    ;
                case "gallery":
                    $("#page-skin-2").prepend(_0x974dx48);
                    _0x974dx12.html(beforeLoader()).parent().addClass("type-" + _0x974dx14 + " id-" + _0x974dx14 + "-" + _0x974dx45 + " show-ify");
                    break;
                case "col-left":
                    ;
                case "col-right":
                    $("#page-skin-2").prepend(_0x974dx48);
                    _0x974dx12.html(beforeLoader()).parent().addClass("type-" + _0x974dx14 + " block-column id-" + _0x974dx14 + "-" + _0x974dx45 + " show-ify");
                    break;
                case "list":
                    _0x974dx12.html(beforeLoader());
                    break;
                case "related":
                    _0x974dx12.html(beforeLoader()).parent().addClass("show-ify");
                    break
                }
            },
            success: function (_0x974dx47) {
                var _0x974dx19 = "";
                switch (_0x974dx14) {
                case "msimple":
                    ;
                case "megatabs":
                    _0x974dx19 = '<ul class="mega-widget">';
                    break;
                case "featured1":
                    ;
                case "featured2":
                    ;
                case "featured3":
                    _0x974dx19 = '<div class="featured-posts ' + _0x974dx14 + '">';
                    break;
                case "block1":
                    _0x974dx19 = '<div class="content-block-1">';
                    break;
                case "col-left":
                    ;
                case "col-right":
                    _0x974dx19 = '<div class="column-block">';
                    break;
                case "grid1":
                    _0x974dx19 = '<div class="grid-block-1 total-' + _0x974dx28 + '">';
                    break;
                case "grid2":
                    _0x974dx19 = '<div class="grid-block-2">';
                    break;
                case "videos":
                    _0x974dx19 = '<div class="videos-block total-' + _0x974dx28 + '">';
                    break;
                case "gallery":
                    _0x974dx19 = '<div class="gallery-block total-' + _0x974dx28 + '">';
                    break;
                case "list":
                    _0x974dx19 = '<div class="custom-widget">';
                    break;
                case "related":
                    _0x974dx19 = '<div class="related-posts total-' + _0x974dx28 + '">';
                    break
                };
                var _0x974dx49 = _0x974dx47.feed.entry;
                if (_0x974dx49 != undefined) {
                    for (var _0x974dx13 = 0, _0x974dx2c = _0x974dx49; _0x974dx13 < _0x974dx2c.length; _0x974dx13++) {
                        var _0x974dx2e = getPostLink(_0x974dx2c, _0x974dx13),
                            _0x974dx4a = getPostTitle(_0x974dx2c, _0x974dx13, _0x974dx2e),
                            _0x974dx4b = getPostImage(_0x974dx2c, _0x974dx13, _0x974dx2e),
                            _0x974dx3d = getPostAuthor(_0x974dx2c, _0x974dx13),
                            _0x974dx3e = getPostDate(_0x974dx2c, _0x974dx13),
                            _0x974dx4c = getPostMeta(_0x974dx3d, _0x974dx3e),
                            _0x974dx42 = getPostLabel(_0x974dx2c, _0x974dx13);
                        var _0x974dx4d = "";
                        switch (_0x974dx14) {
                        case "msimple":
                            ;
                        case "megatabs":
                            _0x974dx4d += '<article class="mega-item"><div class="mega-content"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                            break;
                        case "featured1":
                            ;
                        case "featured2":
                            ;
                        case "featured3":
                            switch (_0x974dx13) {
                            case 0:
                                _0x974dx4d += '<article class="featured-item item-' + _0x974dx13 + '"><div class="featured-item-inner"><a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a>' + _0x974dx42 + '<div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + '</div></div></article><div class="featured-scroll">';
                                break;
                            default:
                                _0x974dx4d += '<article class="featured-item item-' + _0x974dx13 + '"><div class="featured-item-inner"><a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a>' + _0x974dx42 + '<div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></div></article>";
                                break
                            };
                            break;
                        case "block1":
                            switch (_0x974dx13) {
                            case 0:
                                _0x974dx4d += '<article class="block-item item-' + _0x974dx13 + '"><div class="block-inner">' + _0x974dx42 + '<a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + "</div></div></article>";
                                break;
                            default:
                                _0x974dx4d += '<article class="block-item item-' + _0x974dx13 + '"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                                break
                            };
                            break;
                        case "col-left":
                            ;
                        case "col-right":
                            switch (_0x974dx13) {
                            case 0:
                                _0x974dx4d += '<article class="column-item item-' + _0x974dx13 + '"><div class="column-inner">' + _0x974dx42 + '<a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + "</div></div></article>";
                                break;
                            default:
                                _0x974dx4d += '<article class="column-item item-' + _0x974dx13 + '"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                                break
                            };
                            break;
                        case "grid1":
                            _0x974dx4d += '<article class="grid-item item-' + _0x974dx13 + '"><div class="entry-image"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a></div><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                            break;
                        case "grid2":
                            _0x974dx4d += '<article class="grid-item item-' + _0x974dx13 + '"><div class="entry-image">' + _0x974dx42 + '<a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a></div><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + "</div></article>";
                            break;
                        case "videos":
                            switch (_0x974dx13) {
                            case 0:
                                _0x974dx4d += '<article class="videos-item item-' + _0x974dx13 + '"><div class="videos-inner">' + _0x974dx42 + '<a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/><span class="video-icon"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + "</div></div></article>";
                                break;
                            default:
                                _0x974dx4d += '<article class="videos-item item-' + _0x974dx13 + '"><div class="videos-inner"><a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/><span class="video-icon"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2></div></div></article>";
                                break
                            };
                            break;
                        case "gallery":
                            switch (_0x974dx13) {
                            case 0:
                                _0x974dx4d += '<article class="gallery-item item-' + _0x974dx13 + '"><div class="gallery-inner">' + _0x974dx42 + '<a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/><span class="gallery-icon"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[0] + "</div></div></article>";
                                break;
                            default:
                                _0x974dx4d += '<article class="gallery-item item-' + _0x974dx13 + '"><div class="gallery-inner"><a class="entry-image-link before-mask" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/><span class="gallery-icon"/></a><div class="entry-header entry-info"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2></div></div></article>";
                                break
                            };
                            break;
                        case "list":
                            switch (_0x974dx29) {
                            case "comments":
                                var _0x974dx35 = getPostComments(_0x974dx2c, _0x974dx13, _0x974dx2e);
                                _0x974dx4d += _0x974dx35;
                                break;
                            default:
                                _0x974dx4d += '<article class="custom-item item-' + _0x974dx13 + '"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                                break
                            };
                            break;
                        case "related":
                            _0x974dx4d += '<article class="related-item post item-' + _0x974dx13 + '"><div class="entry-image"><a class="entry-image-link" href="' + _0x974dx2e + '"><span class="entry-thumb" data-image="' + _0x974dx4b + '"/></a></div><div class="entry-header"><h2 class="entry-title"><a href="' + _0x974dx2e + '">' + _0x974dx4a + "</a></h2>" + _0x974dx4c[1] + "</div></article>";
                            break
                        };
                        _0x974dx19 += _0x974dx4d
                    }
                } else {
                    switch (_0x974dx14) {
                    case "msimple":
                        ;
                    case "megatabs":
                        _0x974dx19 = '<ul class="mega-widget">' + msgError() + "</ul>";
                        break;
                    default:
                        _0x974dx19 = msgError();
                        break
                    }
                };
                switch (_0x974dx14) {
                case "msimple":
                    _0x974dx19 += "</ul>";
                    _0x974dx12.append(_0x974dx19).addClass("msimple");
                    _0x974dx12.find("a:first").attr("href", function (_0x974dx12, _0x974dx4e) {
                        switch (_0x974dx29) {
                        case "recent":
                            _0x974dx4e = _0x974dx4e.replace(_0x974dx4e, "/search");
                            break;
                        default:
                            _0x974dx4e = _0x974dx4e.replace(_0x974dx4e, "/search/label/" + _0x974dx29);
                            break
                        };
                        return _0x974dx4e
                    });
                    break;
                case "featured1":
                    ;
                case "featured2":
                    ;
                case "featured3":
                    _0x974dx19 += "</div></div>";
                    _0x974dx12.html(_0x974dx19);
                    break;
                case "block1":
                    ;
                case "grid1":
                    ;
                case "grid2":
                    ;
                case "col-left":
                    ;
                case "col-right":
                    ;
                case "videos":
                    ;
                case "gallery":
                    _0x974dx19 += "</div>";
                    _0x974dx12.html(_0x974dx19);
                    break;
                default:
                    _0x974dx19 += "</div>";
                    _0x974dx12.html(_0x974dx19);
                    break
                };
                _0x974dx12.find("span.entry-thumb").lazyify()
            },
            error: function () {
                switch (_0x974dx14) {
                case "msimple":
                    ;
                case "megatabs":
                    _0x974dx12.append("<ul>" + msgError() + "</ul>");
                    break;
                default:
                    _0x974dx12.html(msgError());
                    break
                }
            }
        })
    }
}

function ajaxMega(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50) {
    if (_0x974dx50.match("getmega")) {
        if (_0x974dx14 == "msimple") {
            return getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29)
        } else {
            _0x974dx12.append('<ul class="mega-widget">' + msgError() + "</ul>")
        }
    }
}

function ajaxFeatured(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50, _0x974dx18) {
    if (_0x974dx50.match("getfeatured")) {
        if (_0x974dx14 == "featured1") {
            return getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx18)
        } else {
            _0x974dx12.html(beforeLoader()).parent().addClass("show-ify");
            setTimeout(function () {
                _0x974dx12.html(msgError())
            }, 500)
        }
    }
}

function ajaxBlock(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50, _0x974dx18) {
    if (_0x974dx50.match("getblock")) {
        if (_0x974dx14 == "block1" || _0x974dx14 == "col-left" || _0x974dx14 == "col-right" || _0x974dx14 == "grid1" || _0x974dx14 == "grid2" || _0x974dx14 == "videos" || _0x974dx14 == "gallery") {
            var _0x974dx53 = viewAllText,
                _0x974dx54 = "";
            if (_0x974dx53 != "") {
                _0x974dx54 = _0x974dx53
            } else {
                _0x974dx54 = messages.viewAll
            };
            _0x974dx12.parent().find(".widget-title").append('<a class="more" href="/search/label/' + _0x974dx29 + '">' + _0x974dx54 + "</a>");
            return getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx18)
        } else {
            _0x974dx12.html(msgError()).parent().addClass("show-ify")
        }
    }
}

function ajaxWidget(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50) {
    if (_0x974dx50.match("getwidget")) {
        if (_0x974dx14 == "list") {
            return getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29)
        } else {
            _0x974dx12.html(msgError())
        }
    }
}

function ajaxRelated(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50) {
    if (_0x974dx50.match("getrelated")) {
        return getAjax(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29)
    }
}

function shortCodeIfy(_0x974dx2, _0x974dx33, _0x974dx37) {
    var _0x974dx38 = _0x974dx2.split("\$"),
        _0x974dx34 = /[^{\}]+(?=})/g;
    for (var _0x974dx13 = 0; _0x974dx13 < _0x974dx38.length; _0x974dx13++) {
        var _0x974dx39 = _0x974dx38[_0x974dx13].split("=");
        if (_0x974dx39[0].trim() == _0x974dx33) {
            _0x974dx37 = _0x974dx39[1];
            if (_0x974dx37.match(_0x974dx34) != null) {
                return String(_0x974dx37.match(_0x974dx34)).trim()
            } else {
                return false
            }
        }
    };
    return false
}
$("#gmag-free-main-menu li").each(function (_0x974dx14, _0x974dx29) {
    var _0x974dx58 = $(this),
        _0x974dx12 = _0x974dx58,
        _0x974dx59 = _0x974dx58.find("a"),
        _0x974dx16 = _0x974dx59.attr("href").trim(),
        _0x974dx50 = _0x974dx16.toLowerCase();
    _0x974dx14 = shortCodeIfy(_0x974dx16, "type");
    _0x974dx29 = shortCodeIfy(_0x974dx16, "label");
    if (_0x974dx50.match("getmega")) {
        _0x974dx12.addClass("has-sub mega-menu")
    };
    ajaxMega(_0x974dx12, _0x974dx14, 5, _0x974dx29, _0x974dx50)
});
$("#featured .HTML .widget-content").each(function (_0x974dx14, _0x974dx28, _0x974dx29, _0x974dx18) {
    var _0x974dx12 = $(this),
        _0x974dx16 = _0x974dx12.text().trim(),
        _0x974dx50 = _0x974dx16.toLowerCase();
    _0x974dx14 = shortCodeIfy(_0x974dx16, "type");
    _0x974dx29 = shortCodeIfy(_0x974dx16, "label");
    _0x974dx18 = shortCodeIfy(_0x974dx16, "color");
    switch (_0x974dx14) {
    case "featured2":
        _0x974dx28 = 4;
        break;
    case "featured3":
        _0x974dx28 = 5;
        break;
    default:
        _0x974dx28 = 3;
        break
    };
    ajaxFeatured(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50, _0x974dx18)
});
$(".gmag-free-content-blocks .HTML .widget-content").each(function (_0x974dx14, _0x974dx28, _0x974dx29, _0x974dx18) {
    var _0x974dx12 = $(this),
        _0x974dx16 = _0x974dx12.text().trim(),
        _0x974dx50 = _0x974dx16.toLowerCase();
    _0x974dx14 = shortCodeIfy(_0x974dx16, "type");
    _0x974dx28 = shortCodeIfy(_0x974dx16, "results");
    _0x974dx29 = shortCodeIfy(_0x974dx16, "label");
    _0x974dx18 = shortCodeIfy(_0x974dx16, "color");
    ajaxBlock(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50, _0x974dx18)
});
$(".gmag-free-widget-ready .HTML .widget-content").each(function (_0x974dx14, _0x974dx28, _0x974dx29) {
    var _0x974dx12 = $(this),
        _0x974dx16 = _0x974dx12.text().trim(),
        _0x974dx50 = _0x974dx16.toLowerCase();
    _0x974dx14 = shortCodeIfy(_0x974dx16, "type");
    _0x974dx28 = shortCodeIfy(_0x974dx16, "results");
    _0x974dx29 = shortCodeIfy(_0x974dx16, "label");
    ajaxWidget(_0x974dx12, _0x974dx14, _0x974dx28, _0x974dx29, _0x974dx50)
});
$(".gmag-free-related-content").each(function () {
    var _0x974dx12 = $(this),
        _0x974dx29 = _0x974dx12.find(".related-tag").attr("data-label"),
        _0x974dx28 = relatedPostsNum;
    ajaxRelated(_0x974dx12, "related", _0x974dx28, _0x974dx29, "getrelated")
});
$(".gmag-free-blog-post-comments").each(function () {
    var _0x974dx12 = $(this),
        _0x974dx5a = "blogger";
    switch (_0x974dx5a) {
    case "blogger":
        ;
    case "facebook":
        ;
    case "disqus":
        _0x974dx12.addClass("comments-system-blogger").show();
        $(".entry-meta .entry-comments-link").addClass("show");
        break;
    case "hide":
        _0x974dx12.hide();
        break;
    default:
        _0x974dx12.addClass("comments-system-blogger").show();
        $(".entry-meta .entry-comments-link").addClass("show");
        break
    };
    var _0x974dx5b = _0x974dx12.find(".comments .toplevel-thread > ol > .comment .comment-actions .comment-reply"),
        _0x974dx5c = _0x974dx12.find(".comments .toplevel-thread > #top-continue");
    _0x974dx5b.on("click", function () {
        _0x974dx5c.show()
    });
    _0x974dx5c.on("click", function () {
        _0x974dx5c.hide()
    })
});
$(function () {
    $(".index-post .entry-image-link .entry-thumb, .PopularPosts .entry-image-link .entry-thumb, .FeaturedPost .entry-image-link .entry-thumb,.about-author .author-avatar").lazyify();
    $(".mobile-logo").each(function () {
        var _0x974dxe = $(this),
            _0x974dx5d = $("#main-logo .header-widget a").clone();
        _0x974dx5d.find("#h1-tag").remove();
        _0x974dx5d.appendTo(_0x974dxe)
    });
    $("#gmag-free-mobile-menu").each(function () {
        var _0x974dxe = $(this),
            _0x974dx5e = $("#gmag-free-main-menu-nav").clone();
        _0x974dx5e.attr("id", "main-mobile-nav");
        _0x974dx5e.find(".mega-widget, .mega-tab").remove();
        _0x974dx5e.find("li.mega-tabs .complex-tabs").each(function () {
            var _0x974dx5f = $(this);
            _0x974dx5f.replaceWith(_0x974dx5f.find("> ul.select-tab").attr("class", "sub-menu m-sub"))
        });
        _0x974dx5e.find(".mega-menu:not\(.mega-tabs\) > a").each(function (_0x974dx5d, _0x974dx60) {
            var _0x974dx61 = $(this),
                _0x974dx62 = _0x974dx61.attr("href").trim(),
                _0x974dx5e = _0x974dx62.toLowerCase();
            if (_0x974dx5e.match("getmega")) {
                _0x974dx5d = shortCodeIfy(_0x974dx62, "label");
                _0x974dx5d == "recent" ? _0x974dx60 = "/search" : _0x974dx60 = "/search/label/" + _0x974dx5d;
                _0x974dx61.attr("href", _0x974dx60)
            }
        });
        _0x974dx5e.find(".mega-tabs ul li > a").each(function () {
            var _0x974dx61 = $(this),
                _0x974dx5d = _0x974dx61.text().trim();
            _0x974dx61.attr("href", "/search/label/" + _0x974dx5d)
        });
        _0x974dx5e.appendTo(_0x974dxe);
        $(".show-gmag-free-mobile-menu, .hide-gmag-free-mobile-menu, .overlay").on("click", function () {
            $("body").toggleClass("nav-active")
        });
        $(".gmag-free-mobile-menu .has-sub").append('<div class="submenu-toggle"/>');
        $(".gmag-free-mobile-menu .mega-menu").find(".submenu-toggle").remove();
        $(".gmag-free-mobile-menu .mega-tabs").append('<div class="submenu-toggle"/>');
        $(".gmag-free-mobile-menu ul li .submenu-toggle").on("click", function (_0x974dx12) {
            if ($(this).parent().hasClass("has-sub")) {
                _0x974dx12.preventDefault();
                if (!$(this).parent().hasClass("show")) {
                    $(this).parent().addClass("show").children(".m-sub").slideToggle(170)
                } else {
                    $(this).parent().removeClass("show").find("> .m-sub").slideToggle(170)
                }
            }
        })
    });
    $(".social-mobile").each(function () {
        var _0x974dxe = $(this),
            _0x974dx5d = $("#main-navbar-social ul.social").clone();
        _0x974dx5d.appendTo(_0x974dxe)
    });
    $("a#kelasmat").attr("href", "https://www.kelasmat.com/").text("Kelasmat").attr("style", "visibility:visible!important;opacity:1!important;position:relative!important;z-index:1!important;font-size:13px!important;color:#dbdbdb!important;");
    setInterval(function () {
        if (!$("a#kelasmat:visible").length) {
            window.location.href = "https://www.kelasmat.com/"
        }
    }, 1000);
    $("#gmag-free-header-wrapper .headerify").each(function () {
        var _0x974dx12 = $(this);
        if (fixedMenu == true) {
            if (_0x974dx12.length > 0) {
                var _0x974dx3 = $(document).scrollTop(),
                    _0x974dx63 = _0x974dx12.offset().top,
                    _0x974dx64 = _0x974dx12.height(),
                    _0x974dx3b = (_0x974dx63 + _0x974dx64);
                $(window).scroll(function () {
                    var _0x974dxd = $(document).scrollTop(),
                        _0x974dx39 = $("#footer-wrapper").offset().top,
                        _0x974dx3a = (_0x974dx39 - _0x974dx64);
                    if (_0x974dxd < _0x974dx3a) {
                        if (_0x974dxd > _0x974dx3b) {
                            _0x974dx12.addClass("is-fixed")
                        } else {
                            if (_0x974dxd <= 0) {
                                _0x974dx12.removeClass("is-fixed")
                            }
                        };
                        if (_0x974dxd > _0x974dx3) {
                            _0x974dx12.removeClass("show")
                        } else {
                            _0x974dx12.addClass("show")
                        };
                        _0x974dx3 = $(document).scrollTop()
                    }
                })
            }
        }
    });
    $("#main-wrapper,#sidebar-wrapper").each(function () {
        if (fixedSidebar == true) {
            if (fixedMenu == true) {
                var _0x974dx65 = 75
            } else {
                _0x974dx65 = 25
            };
            $(this).theiaStickySidebar({
                additionalMarginTop: _0x974dx65,
                additionalMarginBottom: 25
            })
        }
    });
    $("#post-body iframe").each(function () {
        var _0x974dxe = $(this),
            _0x974dx11 = _0x974dxe.attr("src");
        if (_0x974dx11.match("www.youtube.com")) {
            _0x974dxe.wrap('<div class="responsive-video-wrap"/>')
        }
    });
    $("p.comment-content").each(function () {
        var _0x974dxe = $(this);
        _0x974dxe.replaceText(/(https:\/\/\S+(\.png|\.jpeg|\.jpg|\.gif))/g, '<img src="\$1"/>');
        _0x974dxe.replaceText(/(?:https:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:watch\?v=)?(.+)/g, '<div class="responsive-video-wrap"><iframe id="youtube" width="100%" height="358" src="https://www.youtube.com/embed/\$1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>')
    });
    $("#gmag-free-load-more-link").each(function () {
        var _0x974dx12 = $(this),
            _0x974dx66 = _0x974dx12.data("load");
        if (_0x974dx66) {
            $("#gmag-free-load-more-link").show()
        };
        $("#gmag-free-load-more-link").on("click", function (_0x974dx2) {
            $("#gmag-free-load-more-link").hide();
            $.ajax({
                url: _0x974dx66,
                success: function (_0x974dx47) {
                    var _0x974dx67 = $(_0x974dx47).find(".blog-posts");
                    _0x974dx67.find(".index-post").addClass("post-animated post-fadeInUp");
                    $(".blog-posts").append(_0x974dx67.html());
                    _0x974dx66 = $(_0x974dx47).find("#gmag-free-load-more-link").data("load");
                    if (_0x974dx66) {
                        $("#gmag-free-load-more-link").show()
                    } else {
                        $("#gmag-free-load-more-link").hide();
                        $("#blog-pager .no-more").addClass("show")
                    };
                    $(".index-post .entry-image-link .entry-thumb").lazyify()
                },
                beforeSend: function () {
                    $("#blog-pager .loading").show()
                },
                complete: function () {
                    $("#blog-pager .loading").hide()
                }
            });
            _0x974dx2.preventDefault()
        })
    });
    $(".back-top").each(function () {
        var _0x974dxe = $(this);
        $(window).on("scroll", function () {
            $(this).scrollTop() >= 100 ? _0x974dxe.fadeIn(250) : _0x974dxe.fadeOut(250);
            _0x974dxe.offset().top >= $("#footer-wrapper").offset().top - 32 ? _0x974dxe.addClass("on-footer") : _0x974dxe.removeClass("on-footer")
        }), _0x974dxe.click(function () {
            $("html, body").animate({
                scrollTop: 0
            }, 500)
        })
    })
})
