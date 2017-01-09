(function () {
  'use strict';

  var callRequest,
    geoLocation,
    seeMore,
    theme,
    service,
    video;

  init();

  function init() {
    service = new ServiceModule();

    callRequest = new CallRequestModule(service);
    geoLocation = new GeoLocationModule(service);
    seeMore = new SeeMoreModule();
    theme = new ThemeModule();
    video = new VideoModule(service);
  }

  //-----

  function CallRequestModule(serviceDependency) {
    var service,
      formMarkupSelector = '.call-request-form',
      formSelector = '#callForm',
      callRequestEndpoint = 'assets/data/success.json';
    init();

    function init() {
      service = serviceDependency;
      if ($(".call-request-form").length) {
        setValidation();
      }
    }

    function handleSubmit(event) {
      var form = $(formSelector),
        queryString,
        formData,
        requestData = {},
        i;

      event.preventDefault();
      if (form.valid()) {
        $(formSelector).removeClass('server-error');
        $(formMarkupSelector).addClass('submitting');
        formData = $(formSelector).serializeArray();
        for (i = 0; i < formData.length; i++) {
          requestData[formData[i].name] = formData[i].value;
        }
        requestData['language'] = $('body').attr('data-lang').toUpperCase();
        requestData['province'] = service.getProvince();
        submitCallRequest(requestData);
      }

      return false;
    }

    function setValidation() {
      var form = $(formSelector);

      $.validator.setDefaults({
        debug: true,
        success: "valid"
      });

      $.validator.addMethod("cdnPostal", function(postal, element) {
        return this.optional(element) ||
          postal.match(/[a-zA-Z][0-9][a-zA-Z](-| |)[0-9][a-zA-Z][0-9]/);
      }, "Please specify a valid postal code.");

      form.validate({
        // errorPlacement: function (label, element) {
        //   if (element.attr("name") === "currentClient") {
        //     label.insertBefore(element);
        //   } else {
        //     label.insertAfter(element); // standard behaviour
        //   }
        // },
        rules: {
          phone: {
            required: true,
            phoneUS: true
          },
          postal_code: {
            required: true,
            cdnPostal: true
          },
          firstname: {
            maxlength: 100
          },
          lastname: {
            maxlength: 100
          },
          email: {
            maxlength: 100
          }
        }
      });
      form.on('submit', handleSubmit);
      form.find('.outline-btn.secondary').on('click', function () {
        form.submit();
      });
    }

    function showSuccessModal() {
      $(formMarkupSelector).addClass('success');
    }

    function submitCallRequest(data) {
      $.ajax({
        method: "POST",
        url: callRequestEndpoint,
        data: data
      }).success(function (msg) {
        showSuccessModal();
        $(formMarkupSelector).removeClass('submitting');
      })
        .error(function (msg) {
          $(formSelector).addClass('server-error');
          $(formMarkupSelector).removeClass('submitting');
          ScrollMan.to($('#server-error'));
        });
    }
  }

  function GeoLocationModule(serviceDependency) {
    var acceptedCities = [
    'Toronto',
    'Windsor',
    'Richmond Hill',
    'Dartmouth',
    'Calgary',
    'Edmonton',
    'Victoria',
    'Montreal',
    'Saskatoon',
    'Quebec City',
    'Winnipeg'
    ]
    var $ctaPaneRequest = $('.retirement-cta-pane--request');
    getCoordinates();

    // Get current location
    function getCoordinates() {
      if (!navigator.geolocation){
        return;
      }
      function success(position) {
        // If successful turn that lat and long in to an address
        var response = [];
        $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + ","+ position.coords.longitude +"&key=AIzaSyB-owYhB99ivBbt0oNphrTei2YHN73BvSw", function(data){
          if (data.status === "OK") {
            response = data.results[0].address_components;
            if (isAcceptedCity(response[3].long_name)) {
              $ctaPaneRequest.show();
            }
          }
        });
      }
      function error() {
        console.log('Error with geolocation');
      }
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function isAcceptedCity(city) {
      var result = false;
      for (var i=0; i<acceptedCities.length; i++) {
        if (city === acceptedCities[i]) {
          result = true;
        }
      }
      // console.log('Accepted City =',result);
      return result;
    }
  } // End GeoLocationModule

  function SeeMoreModule() {
    var toExpand,
      expandSection,
      expandScrollDelay = .25,
      expandScrollDuration = 1.5;

    init();

    function init() {
      toExpand = $('.expanded-article-content');
      expandSection = $('.expand-article-toggle');
      expandSection.find('h2').on('click', toggleHandler);
    }

    //-----

    function toggleHandler() {
      $('article.initial-view').removeClass('initial-view');
      toExpand.on('transitionend', transitionEndHandler);
      toExpand.css({ 'max-height': toExpand[0].scrollHeight });
      ScrollMan.to(toExpand, expandScrollDelay, expandScrollDuration);
    }

    function transitionEndHandler() {
      toExpand.off('transitionend');
      expandSection.css({ left: 99999 });
      expandSection.attr('aria-hidden', true);
      window.setTimeout(function () {
        toExpand.css({ 'max-height': toExpand[0].scrollHeight * 100 });
      }, (expandScrollDelay + expandScrollDuration) * 1000);
    }
  }

  function ServiceModule() {
    var modalFadeDelay = 0.80,
      modalFadeDuration = 250,
      province;

    return {
      openModal: openModal,
      setProvince: setProvince,
      getProvince: getProvince
    }

    //-----

    function getProvince() {
      return province;
    }

    function openModal(rendered) {
      rendered.modal({
        fadeDuration: modalFadeDuration,
        fadeDelay: modalFadeDelay
      });
    }

    function setProvince(newProvince) {
      province = newProvince;
    }
  }

  function ThemeModule() {
    init();

    function init() {
      setThemeFromParameter();
    }

    //-----

    function getQueryStringParam(name) {
      var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results == null ? null : results[1] || 0;
    }

    function setThemeFromParameter() {
      var themeID = getQueryStringParam('theme');

      $('body').attr('data-fc-variant-id', themeID ? themeID : 1);
    }
  }

  function VideoModule(serviceDependency) {
    var service,
      videoFile = 'fc-video.html',
      videoMarkupSelector = '.video-container';

    init();

    function init() {
      service = serviceDependency;
      $('.fc-intro .sub > span').on('click', videoHandler);
    }

    //-----

    function videoHandler() {
      var rendered = $(videoMarkupSelector);

      if (rendered.length > 0) {
        service.openModal(rendered);
      } else {
        $.get(videoFile, function (html) {
          $(html).appendTo('body');
          window.brightcove.createExperiences();
          service.openModal($(videoMarkupSelector).css({
            display: 'inline-block'
          }));
        });
      }
    }
  }
})();