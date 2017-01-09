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
    var service,
      article,
      mapDeferred,
      acceptedCities = {
        Toronto: 'Ontario',
        Winnipeg: 'Manitoba',
        Cupertino: 'California'
      };

    init();

    function init() {
      service = serviceDependency;
      article = $('article');
      window.FCHandleMapInit = handleMapInit;
      startLocationCheck();
    }

    //-----

    function handleReverseGeoLocationResponse(results, status) {
      var i,
        j,
        components,
        valid = false,
        current;

      if (status === 'OK') {
        if (results[1]) {
          components = results[1].address_components;
          for (i = 0; i < components.length; i++) {
            current = acceptedCities[components[i].long_name];
            if (current) {
              for (j = 0; j < components.length; j++) {
                if (current === components[j].long_name) {
                  service.setProvince(components[j].short_name);
                  valid = true;
                  break;
                }
              }
              if (valid) {
                break;
              }
            }
          }
          if (valid) {
            article.addClass('geo-valid');
          } else {
            article.addClass('geo-invalid');
          }
        } else {
          setGeoInvalid();
        }
      } else {
        setGeoInvalid();
      }
    }

    function handleMapInit() {
      if (mapDeferred) mapDeferred.resolve();
    }

    function startLocationCheck() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(startReverseGeoLocation, setGeoInvalid);
        mapDeferred = jQuery.Deferred();
        $('body').on('mousedown', setGeoInvalid);
      } else {
        setGeoInvalid();
      }
    }

    function startReverseGeoLocation(position) {
      var geocoder;

      $('body').off('mousedown', setGeoInvalid);
      article.removeClass('geo-invalid');
      mapDeferred.then(function () {
        geocoder = new google.maps.Geocoder;
        geocoder.geocode({
          'location': {
            // Actual:
            lat: position.coords.latitude,
            lng: position.coords.longitude
            // Brampton:
            // lat: 43.6833,
            // lng: -79.7667
            // Winnipeg:
            // lat: 49.8998,
            // lng: -97.1375
          }
        }, handleReverseGeoLocationResponse);
      });
    }

    function setGeoInvalid() {
      $('body').off('mousedown', setGeoInvalid);
      article.addClass('geo-invalid');
    }
  }

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