// SCROLL MANAGER
var ScrollMan = (function () {
    function ScrollMan() {
    }
    ScrollMan.to = function (e, d, t) {
        if (d === void 0) { d = 0; }
        if (t === void 0) { t = 0.25; }
        var el;
        var typ = typeof e;
        el = (typ === 'string') ? $(e) : e;
        if (el) {
            var ny = el.offset().top;
            TweenLite.to(window, t, { delay: d, scrollTo: { y: ny }, autoKill:false });
        }
    };
    ScrollMan.toNextElementFrom = function (el, d, t) {
        if (d === void 0) { d = 0; }
        if (t === void 0) { t = 0.25; }
        var ny = $(el.nextElementSibling).offset().top;
        TweenLite.to(window, t, { delay: d, scrollTo: { y: ny }, autoKill:false });
    };
    ScrollMan.toTop = function (d, t) {
        if (d === void 0) { d = 0; }
        if (t === void 0) { t = 0.25; }
        TweenLite.to(window, t, { delay: d, scrollTo: { y: 0 }, autoKill:false });
    };
    return ScrollMan;
})();


// More_Slides
$(function(){

//?q=complete+financial+planning
   /* var url = window.location.href;

    if (url.indexOf('utm_campaign=2016SummerCont') > -1) {
        $('.intro-summer').show();
        loadSummer16();
    } else {
        $('.intro').show();
        initMoreModule()
    }

    function loadSummer16(){
        initMoreModule()
    }

 var url = window.location.href;

        if (url.indexOf('utm_hats') > -1) {
            document.body.setAttribute('data-background-id', 'bg1');
        } 

    */

    if ($('body').hasClass('homeFall2016')) {

        var url = window.location.href;
        if (url.indexOf('Tvspot') > -1 || url.indexOf('30Tvspot') > -1 || url.indexOf('content=Hats') > -1 ) {
            document.body.setAttribute('data-background-id', 'bg0');
        } 
        
        else if (url.indexOf('FamilyCutOut') > -1) {
            document.body.setAttribute('data-background-id', 'bg1');
        } 

        else if (url.indexOf('MoneyPlant') > -1 || url.indexOf('FlyingPaper') > -1) {
            document.body.setAttribute('data-background-id', 'bg2');
        } 

        else {
            document.body.setAttribute('data-background-id', 'bg'+Math.floor(Math.random()*3)); 
        }


        initMoreModule();

    }

    function initMoreModule() {
        var lang = $('body').attr("data-lang"),
            langAjax;

        if(lang === 'fr') {
            langAjax = '/external/app/tribal/data/SiteData-fr.json';
        } else {
            langAjax = '/external/app/tribal/data/SiteData-en.json';
        }

        $.ajax(langAjax)
            .done(function(data) {
                var getData = JSON.parse(data);

                availableItemsArr(getData.more);
        });
    }

    function availableItemsArr(data) {

        var arrayStorage = JSON.parse(localStorage.getItem("savedItems")),
            availableArr = [];        
        // build available array
        //console.log('test',data.slides.length)
        //console.log('test',data.length)
        if (arrayStorage != null && arrayStorage.length < data.slides.length - 6) {

            for (var i = 0; i < data.slides.length; i++) {
                if ( arrayStorage.indexOf(i) === -1) {
                   availableArr.push(i);
                }         
            }
        } else {
            for (var j = 0; j < data.slides.length; j++) {
                availableArr.push(j);
            }
            arrayStorage = [];
        }
        createFrontSlideList(data,arrayStorage,availableArr);
    }    
   
    function createFrontSlideList(data, arrayStorage, availableArr) {
        var slideNumber = null,
            arrayFront = [];

        for (var i = 0; i < 2; i++) {
            slideNumber = availableArr[randomNumber(availableArr.length)];
            arrayStorage.push(slideNumber);
            arrayFront.push(slideNumber);
            var test = availableArr.indexOf(slideNumber);
            availableArr.splice(test, 1);
        }
        localStorage.setItem("savedItems", JSON.stringify(arrayStorage));

        createSlideList(data, arrayFront, availableArr);
    }

    function createSlideList(data, arrayFront, availableArr) {

        var array = arrayFront,
            slideNumber = null;

        for (var i = 0; i < 6; i++) {
            slideNumber = availableArr[randomNumber(availableArr.length)];
            array.push(slideNumber);
            var test = availableArr.indexOf(slideNumber)
            availableArr.splice(test, 1);
        }
        outputMoreList(data,array)
    }
	
	function replacemorespace(tipanswer) {
			var key = tipanswer.replace(/\s+/g,"_");
			return	key;
		}

    function outputMoreList(data,slideList){

        var htmlCode = null;
        for (i = 0; i < slideList.length; i++){
            htmlCode = htmlCode + '<div class="carousel-slides" id="slide '+data.slides[slideList[i]].slideId+'">';
            htmlCode = htmlCode + '<div class="slide-image"><a href="'+data.slides[slideList[i]].link+'" onclick="igTrack.inline(this)" data-tracking-category="Consumer Engagement" data-tracking-label="MoreCarousel_Click_'+replacemorespace(data.slides[slideList[i]].title)+'_EventPage:Home_page"><img src="'+data.slides[slideList[i]].img+'" alt=""></a></div>';
            htmlCode = htmlCode + '<div class="slide-content"><h2><a onclick="igTrack.inline(this)" data-tracking-category="Consumer Engagement" data-tracking-label="MoreCarousel_Click_'+replacemorespace(data.slides[slideList[i]].title)+'_EventPage:Home_page" href="'+data.slides[slideList[i]].link+'">'+data.slides[slideList[i]].title+'</a></h2><div class="excerpt"><p>'+data.slides[slideList[i]].excerpt+'</p></div><a href="'+data.slides[slideList[i]].link+'" class="cta underline-link">'+data.slides[slideList[i]].cta+'</a></div></div>';
        }

        $( htmlCode ).prependTo( ".js-homepage-carousel" );
        
        moreHome();
    }

    function randomNumber(toNumber) {
        return Math.floor(Math.random() * toNumber);
    }
  // randomize the slides and then call slick
  // $('.js-homepage-carousel').shuffleTheSlides('.carousel-slides');

  // Load carousel
  function moreHome(){
      console.log('slick');
    $('.js-homepage-carousel').slick({
    prevArrow: '<span type="button" class="carousel-prev"><img src="/external/app/tribal/images/Arrow-MainArticle-Carousel-Green-L.svg" onclick="igTrack.inline(this)" data-tracking-action="Scroll" data-tracking-category="Consumer Engagement" data-tracking-label="MoreCarousel_Scroll_Trending_Advice_&_Stories_carousel_EventPage:Home_Page"></span>',
    nextArrow: '<span type="button" class="carousel-next"><img src="/external/app/tribal/images/Arrow-MainArticle-Carousel-Green-R.svg" onclick="igTrack.inline(this)" data-tracking-action="Scroll" data-tracking-category="Consumer Engagement" data-tracking-label="MoreCarousel_Scroll_Trending_Advice_&_Stories_carousel_EventPage:Home_Page"></span>',
    speed: 1200,
    dots: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    infinite: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true
        }
      }
    ]
  });
  }
  
});



// TRACKING
var igTrack = (function(){
    
    var trackingID  = null;
    var DEFAULT = ['send', 'event'];
    var EVENTS = {
        'SCROLL_MORE':      ['Engage', 'Click'],
        'SEARCH':           ['Engage', 'Search'],
        'GET_STARTED':      ['Engage', 'Click'],
        'TIP_DISMISS':      ['Engage', 'Click'],
        'QUIZ_SUMMARY_CTA': ['Engage', 'Click'],
        'QUIZ_START':       ['Engage', 'Click', 'OS_Quiz_Start'],
        'QUIZ_PROGRESS':    ['Engage', 'Click'],
        'QUIZ_ANSWER':      ['Engage', 'Expand'],
        'QUIZ_COMPLETED':    ['Engage', 'View'],
        'AREA_EXPAND':      ['Engage', 'Expand'],
        'REPORT_PRINT_DL':  ['Consider', 'DownloadReport', 'DownloadReport'],
        'REPORT_VIEW':      ['Consider', 'View', 'ViewReport'],
        'ADVISOR_SEARCH':   ['Convert', 'Search'],
        'VIDEO_PLAY':      ['Engage', 'Play'],
    };

    var TRACK = function(eventID) {

        var eventArgs = null;

        if (EVENTS[eventID]) {
            var questionNum;
            var args = [].slice.call(arguments);
            eventArgs = DEFAULT.concat(EVENTS[eventID]);

            switch (eventID) {
                case 'SEARCH' :
                    eventArgs = eventArgs.concat(
                        'Search_Query?'+args[1]
                    );
                    break;

                case 'QUIZ_SUMMARY_CTA' :
                    eventArgs = eventArgs.concat(args[1]);
                    break;

                case 'QUIZ_PROGRESS' :
                    eventArgs = eventArgs.concat(
                        'Q{{QNUM}}_Answer'
                            .replace(/{{QNUM}}/g, args[1])
                    );
                    break;

                case 'QUIZ_ANSWER' :
                    eventArgs = eventArgs.concat(
                        'Q{{QNUM}}_Answer_{{A}}'
                            .replace(/{{QNUM}}/g, args[1])
                            .replace(/{{A}}/g, ['A', 'B', 'C', 'D', 'E'][args[2]])
                    );
                    break;

                case 'AREA_EXPAND' :
                    var areaId = args[1].split('-');
                    areaId.forEach(function(part, ix, arr){
                        arr[ix] = part.charAt(0).toUpperCase() + part.slice(1);
                    });
                    areaId = areaId.join('_');

                    eventArgs = eventArgs.concat(
                        'Expand_{{areaId}}'
                            .replace(/{{areaId}}/g, areaId)
                            .replace('-', '_')
                    );
                    break;

                case 'ADVISOR_SEARCH' :
                    eventArgs = eventArgs.concat(
                        "ConnectToAdvisor_{{type}}?{{q}}"
                            .replace(/{{type}}/g, args[1])
                            .replace(/{{q}}/g, args[2])
                    );
                    break;

                case 'QUIZ_START' :
                    eventArgs = eventArgs.concat(args.slice(1));
                    break;

                case 'REPORT_VIEW' :
                    eventArgs = eventArgs.concat(args.slice(1));
                    break;

                case 'REPORT_PRINT_DL' :
                    eventArgs = eventArgs.concat(args.slice(1));
                    break;

                case 'QUIZ_COMPLETED' :
                    eventArgs = eventArgs.concat(args.slice(1));
                    break;

                default :
                    eventArgs = eventArgs.concat(args.slice(1));
                    break;
            }
            
        }
       
        if (window['ga'] && eventArgs) {
            console.log('click',eventArgs)
            TRACK.doGA(eventArgs);
        }
    };


    TRACK.doGA = function(args) {
        ga.apply(ga, args);
    };
    // TRACK.init = function(id) {
    //     trackingID = id;
    //     //ga init
    // };


    TRACK.inline = function(element){
  
        var eventArgs = DEFAULT.concat(
            element.getAttribute('data-tracking-category') || 'Engage',
            element.getAttribute('data-tracking-action') || 'Click'
        );

        var label = element.getAttribute('data-tracking-label');
        if (label) {
            eventArgs = eventArgs.concat(label);
        }

        if (window['ga']) {
            TRACK.doGA(eventArgs);
        }
    };

    return TRACK;

})();


// SEARCH BOX
$('.searchbox button').click(function(e){

    var $parent = $(this).closest('.searchbox');
    var $input = $parent.find('.inputText');

    if (!$parent.hasClass('open')) {

        e.preventDefault();
        $input.attr('placeholder', $input.attr('data-placeholder-default'));
        $parent.addClass('open');
        if (!$.browser.msie) { $parent.find('.inputText').focus(); }

    } else {

        if ($input.val() === ''){
            e.preventDefault();
            $input.attr('placeholder', $input.attr('data-placeholder-empty-msg'));
        } else {
            igTrack('SEARCH', $input.val());
        }
    }
});

$(document).on('click', function(e) {
    $('.searchbox.open').each(function(){
        if (!$.contains(this, e.target)) {
            $(this).removeClass('open');
        }
    });
});


// FOUNDATION INIT
$(document).foundation({
    accordion: {
        multi_expand: true,
        callback: function (accordion) {

            var isAreasAcc = $.contains($('.areas.section')[0], accordion[0]);
            if (isAreasAcc && $(accordion).hasClass('active')) {
                var areaId = $(accordion).closest('.area').attr('data-areaId');
                igTrack('AREA_EXPAND', areaId);
            }
        }
    }
});

if (
    ($.browser.msie === true) &&
    (parseInt($.browser.version) === 9)
) {
    document.body.className += ' ie9';
}




var player,
    APIModules,
    videoPlayer,
    experienceModule;

function onTemplateLoad(experienceID) {
  player = brightcove.api.getExperience(experienceID);
  APIModules = brightcove.api.modules.APIModules;
}

function onTemplateReady(evt) {

    $('.video-spinner-container').hide();
    $('.js-video-play').show();
    $('.js-video-play-btn').on('click',function(){
    
        event.preventDefault ? event.preventDefault() : (event.returnValue = false);
        $('.js-video-play').hide();
        videoPlayer = player.getModule(APIModules.VIDEO_PLAYER);
        experienceModule = player.getModule(APIModules.EXPERIENCE);
        igTrack('VIDEO_PLAY', 'Retirement_Video');
        videoPlayer.play();
  })

    $( window ).on( "orientationchange", function( event ) {
        var resizeWidth = $(".BrightcoveExperience").width(),
        resizeHeight = $(".BrightcoveExperience").height();
        if (experienceModule.experience.type == "html"){
            experienceModule.setSize(resizeWidth, resizeHeight)
        }
    });
}

$('.search-clsBtn').on('click',function(){
    $('search-input').val("");

})
//Code below is breaking mobile nav, don't know why
$('a.nav-link').on('touchend', function() { 
	console.log('XXXX',$(this).attr('class'));
	var linkTest = $(this).attr('class');

	if (linkTest.indexOf('has-subnav')) {
		var link = $(this).attr('href');   
    	window.open(link,'_parent'); // opens in new window as requested 
    	 return false; // prevent anchor click  		
	}
    

    
});

if ($('html').attr('lang') == 'fr') {
	
	$('.accordion--subnav').css({
      "margin-left": 0,
      "width": "100%"
    })
	//$('#panel1b ul.accordion--subnav li:last-child a').attr('href','https://bvi.bnc.ca/index/investorsgroup/indexfr.html')
} else {
	$('.accordion--subnav').css({
      "margin-left": 0,
      "width": "100%"
    })
	//$('#panel1b ul.accordion--subnav li:last-child a').attr('href','https://bvi.bnc.ca/index/investorsgroup/indexen.html')
}

   