"use strict";
(function () {
// Global variables
  let
    userAgent = navigator.userAgent.toLowerCase(),
    isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false;

  // Unsupported browsers
  if (isIE !== false && isIE < 12) {
    console.warn("[Core] detected IE" + isIE + ", load alert");
    var script = document.createElement("script");
    script.src = "./js/support.js";
    document.querySelector("head").appendChild(script);
  }

  let
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isNoviBuilder = false,
    livedemo = false,
    isTouch = "ontouchstart" in window,
    onloadCaptchaCallback,
    c3ChartsArray = [],
    plugins = {
      bootstrapTooltip: $("[data-bs-toggle='tooltip']"),
      bootstrapModalDialog: $('.modal'),
      bootstrapTabs: $(".tabs-custom-init"),
      materialParallax: $(".parallax-container"),
      rdNavbar: $(".rd-navbar"),
      rdMailForm: $(".rd-mailform"),
      rdInputLabel: $(".form-label"),
      regula: $("[data-constraints]"),
      owl: $(".owl-carousel"),
      swiper: $(".swiper-slider"),
      statefulButton: $('.btn-stateful'),
      isotope: $(".isotope"),
      popover: $('[data-bs-toggle="popover"]'),
      viewAnimate: $('.view-animate'),
      radio: $("input[type='radio']"),
      checkbox: $("input[type='checkbox']"),
      customToggle: $("[data-custom-toggle]"),
      pageLoader: $("#page-loader"),
      captcha: $('.recaptcha'),
      fixedHeight: $('[data-fixed-height]'),
      slick: $('.slick-slider'),
      d3Charts: $('.d3-chart'),
      lightGallery: $("[data-lightgallery='group']"),
      lightGalleryItem: $("[data-lightgallery='item']"),
      lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
      mailchimp: $('.mailchimp-mailform'),
      campaignMonitor: $('.campaign-mailform'),
      maps: $(".google-map-container"),
      counter: document.querySelectorAll('.counter')
    };

  // Initialize scripts that require a loaded window
  $window.on('load', function () {

    // Page Loader
    if (plugins.pageLoader) {
      setTimeout(function () {
        plugins.pageLoader.addClass("loaded");
        $window.trigger("resize");
      }, 10);
    }
    // Counter
    if (plugins.counter) {
      for (let i = 0; i < plugins.counter.length; i++) {
        let
          node = plugins.counter[i],
          counter = aCounter({
            node: node,
            duration: node.getAttribute('data-duration') || 1000
          }),
          scrollHandler = (function () {
            if (Util.inViewport(this) && !this.classList.contains('animated-first')) {
              this.counter.run();
              this.classList.add('animated-first');
            }
          }).bind(node),
          blurHandler = (function () {
            this.counter.params.to = parseInt(this.textContent, 10);
            this.counter.run();
          }).bind(node);

        if (isNoviBuilder) {
          node.counter.run();
          node.addEventListener('blur', blurHandler);
        } else {
          scrollHandler();
          window.addEventListener('scroll', scrollHandler);
        }
      }
    }

    // Isotope
    if (plugins.isotope.length) {
      var i, j, isogroup = [];
      for (i = 0; i < plugins.isotope.length; i++) {
        var isotopeItem = plugins.isotope[i],
          filterItems = $(isotopeItem).closest('.isotope-wrap').find('[data-isotope-filter]'),
          iso = new Isotope(isotopeItem, {
            itemSelector: '.isotope-item',
            layoutMode: isotopeItem.getAttribute('data-isotope-layout') ? isotopeItem.getAttribute('data-isotope-layout') : 'masonry',
            filter: '*',
            masonry: {columnWidth: 0.25}
          });

        isogroup.push(iso);
      }

      setTimeout(function () {
        var i;
        for (i = 0; i < isogroup.length; i++) {
          isogroup[i].element.className += " isotope--loaded";
          isogroup[i].layout();
        }
      }, 600);

      var resizeTimout,
        isotopeFilter = $("[data-isotope-filter]");

      isotopeFilter.on("click", function (e) {
        e.preventDefault();
        var filter = $(this);
        clearTimeout(resizeTimout);
        filter.parents(".isotope-filters").find('.active').removeClass("active");
        filter.addClass("active");
        var iso = $('.isotope[data-isotope-group="' + this.getAttribute("data-isotope-group") + '"]');
        iso.isotope({
          itemSelector: '.isotope-item',
          layoutMode: iso.attr('data-isotope-layout') ? iso.attr('data-isotope-layout') : 'masonry',
          filter: this.getAttribute("data-isotope-filter") == '*' ? '*' : '[data-filter*="' + this.getAttribute("data-isotope-filter") + '"]',
          masonry: {columnWidth: 0.25}
        });
      }).eq(0).trigger("click")
    }

    // Material Parallax
    if (plugins.materialParallax.length) {
      if (!isNoviBuilder && !isIE && !isMobile) {
        plugins.materialParallax.parallax();
        setTimeout(function () {
          $window.scroll();
        }, 500);
      }
      else {
        for (var i = 0; i < plugins.materialParallax.length; i++) {
          var parallax = $(plugins.materialParallax[i]),
            imgPath = parallax.data("parallax-img");

          parallax.css({
            "background-image": 'url(' + imgPath + ')',
            "background-size": "cover"
          });
        }
      }
    }
  });
  /**
   * Initialize All Scripts
   */
  $(function () {
    var isNoviBuilder = window.xMode;


    /**
     * @desc Initialize the gallery with set of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).lightGallery({
          thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
          selector: "[data-lightgallery='item']",
          autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
          pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
          addClass: addClass,
          mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
          loop: $(itemsToInit).attr("data-lg-loop") !== "false"
        });
      }
    }

    /**
     * @desc Initialize the gallery with dynamic addition of images
     * @param {object} itemsToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initDynamicLightGallery(itemsToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemsToInit).on("click", function () {
          $(itemsToInit).lightGallery({
            thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
            selector: "[data-lightgallery='item']",
            autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
            pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
            addClass: addClass,
            mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
            loop: $(itemsToInit).attr("data-lg-loop") !== "false",
            dynamic: true,
            dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
          });
        });
      }
    }

    /**
     * @desc Initialize the gallery with one image
     * @param {object} itemToInit - jQuery object
     * @param {string} addClass - additional gallery class
     */
    function initLightGalleryItem(itemToInit, addClass) {
      if (!isNoviBuilder) {
        $(itemToInit).lightGallery({
          selector: "this",
          addClass: addClass,
          counter: false,
          youtubePlayerParams: {
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
            controls: 0
          },
          vimeoPlayerParams: {
            byline: 0,
            portrait: 0
          }
        });
      }
    }

    /**
     * Google map function for getting latitude and longitude
     */
    function getLatLngObject(str, marker, map, callback) {
      var coordinates = {};
      try {
        coordinates = JSON.parse(str);
        callback(new google.maps.LatLng(
          coordinates.lat,
          coordinates.lng
        ), marker, map)
      } catch (e) {
        map.geocoder.geocode({'address': str}, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            callback(new google.maps.LatLng(
              parseFloat(latitude),
              parseFloat(longitude)
            ), marker, map)
          }
        })
      }
    }

    /**
     * makeWaypointScroll
     * @description  init smooth anchor animations
     */
    function makeWaypointScroll(obj) {
      var $this = $(obj);
      if (!isNoviBuilder) {
        $this.on('click', function (e) {
          e.preventDefault();
          $("body, html").stop().animate({
            scrollTop: $($(this).attr('data-custom-scroll-to')).offset().top
          }, 1000, function () {
            $window.trigger("resize");
          });
        });
      }
    }

    /**
     * Wrapper to eliminate json errors
     * @param {string} str - JSON string
     * @returns {object} - parsed or empty object
     */
    function parseJSON(str) {
      try {
        if (str) return JSON.parse(str);
        else return {};
      } catch (error) {
        console.warn(error);
        return {};
      }
    }

    /**
     * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
     * @param {object} swiper - swiper instance
     */
    function setRealPrevious(swiper) {
      let element = swiper.$wrapperEl[0].children[swiper.activeIndex];
      swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
    }

    /**
     * @desc Sets slides background images from attribute 'data-slide-bg'
     * @param {object} swiper - swiper instance
     */
    function setBackgrounds(swiper) {
      let swipersBg = swiper.el.querySelectorAll('[data-slide-bg]');

      for (let i = 0; i < swipersBg.length; i++) {
        let swiperBg = swipersBg[i];
        swiperBg.style.backgroundImage = 'url(' + swiperBg.getAttribute('data-slide-bg') + ')';
      }
    }

    /**
     * @desc Animate captions on active slides
     * @param {object} swiper - swiper instance
     */
    function initCaptionAnimate(swiper) {
      let
        animate = function (caption) {
          return function () {
            let duration;
            if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
            caption.classList.remove('not-animated');
            caption.classList.add(caption.getAttribute('data-caption-animate'));
            caption.classList.add('animated');
          };
        },
        initializeAnimation = function (captions) {
          for (let i = 0; i < captions.length; i++) {
            let caption = captions[i];
            caption.classList.remove('animated');
            caption.classList.remove(caption.getAttribute('data-caption-animate'));
            caption.classList.add('not-animated');
          }
        },
        finalizeAnimation = function (captions) {
          for (let i = 0; i < captions.length; i++) {
            let caption = captions[i];
            if (caption.getAttribute('data-caption-delay')) {
              setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
            } else {
              animate(caption)();
            }
          }
        };

      // Caption parameters
      swiper.params.caption = {
        animationEvent: 'slideChangeTransitionEnd'
      };

      initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
      finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));

      if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
        swiper.on(swiper.params.caption.animationEvent, function () {
          initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
          finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
        });
      } else {
        swiper.on('slideChangeTransitionEnd', function () {
          initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
        });

        swiper.on(swiper.params.caption.animationEvent, function () {
          finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
        });
      }
    }

    // Swiper
    if (plugins.swiper.length) {
      for (let i = 0; i < plugins.swiper.length; i++) {

        let
          node = plugins.swiper[i],
          params = parseJSON(node.getAttribute('data-swiper')),
          defaults = {
            speed: 1000,
            loop: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },
            autoplay: {
              delay: 5000
            }
          },
          xMode = {
            autoplay: false,
            loop: false,
            simulateTouch: false
          };

        params.on = {
          init: function () {
            setBackgrounds(this);
            setRealPrevious(this);
            initCaptionAnimate(this);

            // Real Previous Index must be set recent
            this.on('slideChangeTransitionEnd', function () {
              setRealPrevious(this);
            });
          }
        };

        new Swiper(node, Util.merge(isNoviBuilder ? [defaults, params, xMode] : [defaults, params]));
      }
    }

    /**
     * @desc Initialize owl carousel plugin
     * @param {object} c - carousel jQuery object
     */
    function initOwlCarousel(c) {
      var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
        values = [0, 480, 576, 768, 992, 1200, 1600],
        responsive = {};

      for (var j = 0; j < values.length; j++) {
        responsive[values[j]] = {};
        for (var k = j; k >= -1; k--) {
          if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
            responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
          }
          if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
            responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
          }
          if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
            responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
          }
        }
      }

      // Enable custom pagination
      if (c.attr('data-dots-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customPag = $(carousel.attr("data-dots-custom")),
            active = 0;

          if (carousel.attr('data-active')) {
            active = parseInt(carousel.attr('data-active'), 10);
          }

          carousel.trigger('to.owl.carousel', [active, 300, true]);
          customPag.find("[data-owl-item='" + active + "']").addClass("active");

          customPag.find("[data-owl-item]").on('click', function (e) {
            e.preventDefault();
            carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
          });

          carousel.on("translate.owl.carousel", function (event) {
            customPag.find(".active").removeClass("active");
            customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
          });
        });
      }

      c.on("initialized.owl.carousel", function () {
        initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
      });

      if (c.attr('data-nav-custom')) {
        c.on("initialized.owl.carousel", function (event) {
          var carousel = $(event.currentTarget),
            customNav = $(carousel.attr("data-nav-custom"));

          // Custom Navigation Events
          customNav.find(".owl-arrow-next").click(function (e) {
            e.preventDefault();
            carousel.trigger('next.owl.carousel');
          });
          customNav.find(".owl-arrow-prev").click(function (e) {
            e.preventDefault();
            carousel.trigger('prev.owl.carousel');
          });
        });
      }

      c.owlCarousel({
        autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
        loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
        items: 1,
        center: c.attr("data-center") === "true",
        dotsContainer: c.attr("data-pagination-class") || false,
        navContainer: c.attr("data-navigation-class") || false,
        mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
        nav: c.attr("data-nav") === "true",
        dots: c.attr("data-dots") === "true",
        dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
        animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
        animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
        responsive: responsive,
        navText: c.attr("data-nav-text") ? $.parseJSON(c.attr("data-nav-text")) : [],
        navClass: c.attr("data-nav-class") ? $.parseJSON(c.attr("data-nav-class")) : ['owl-prev', 'owl-next']
      });
    }

    /**
     * isScrolledIntoView
     * @description  check the element whas been scrolled into the view
     */
    function isScrolledIntoView(elem) {
      if (!isNoviBuilder) {
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
      } else {
        return true;
      }
    }

    /**
     * initOnView
     * @description  calls a function when element has been scrolled into the view
     */
    function lazyInit(element, func) {
      var handler = function () {
        if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
          func.call();
          element.addClass('lazy-loaded');
        }
      };

      handler();
      $window.on('scroll', handler);
    }


    /**
     * attachFormValidator
     * @description  attach form validation to elements
     */
    function attachFormValidator(elements) {
      for (var i = 0; i < elements.length; i++) {
        var o = $(elements[i]), v;
        o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
        v = o.parent().find(".form-validation");
        if (v.is(":last-child")) {
          o.addClass("form-control-last-child");
        }
      }

      elements
        .on('input change propertychange blur', function (e) {
          var $this = $(this), results;

          if (e.type != "blur") {
            if (!$this.parent().hasClass("has-error")) {
              return;
            }
          }

          if ($this.parents('.rd-mailform').hasClass('success')) {
            return;
          }

          if ((results = $this.regula('validate')).length) {
            for (i = 0; i < results.length; i++) {
              $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
            }
          } else {
            $this.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        })
        .regula('bind');

      var regularConstraintsMessages = [
        {
          type: regula.Constraint.Required,
          newMessage: "该项是必填的，"
        },
        {
          type: regula.Constraint.Email,
          newMessage: "请输入一个有效的邮箱地址。"
        },
        {
          type: regula.Constraint.Numeric,
          newMessage: "只能输入数字。"
        },
        {
          type: regula.Constraint.Selected,
          newMessage: "请选择一项。"
        }
      ];


      for (var i = 0; i < regularConstraintsMessages.length; i++) {
        var regularConstraint = regularConstraintsMessages[i];

        regula.override({
          constraintType: regularConstraint.type,
          defaultMessage: regularConstraint.newMessage
        });
      }
    }

    /**
     * isValidated
     * @description  check if all elemnts pass validation
     */
    function isValidated(elements, captcha) {
      var results, errors = 0;

      if (elements.length) {
        for (j = 0; j < elements.length; j++) {

          var $input = $(elements[j]);
          if ((results = $input.regula('validate')).length) {
            for (k = 0; k < results.length; k++) {
              errors++;
              $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
            }
          } else {
            $input.siblings(".form-validation").text("").parent().removeClass("has-error")
          }
        }

        if (captcha) {
          if (captcha.length) {
            return validateReCaptcha(captcha) && errors == 0
          }
        }

        return errors == 0;
      }
      return true;
    }

    /**
     * Init Bootstrap tooltip
     * @description  calls a function when need to init bootstrap tooltips
     */
    function initBootstrapTooltip(tooltipPlacement) {
      if (window.innerWidth < 599) {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltip({
          placement: 'bottom'
        });
      } else {
        plugins.bootstrapTooltip.tooltip('destroy');
        plugins.bootstrapTooltip.tooltipPlacement;
        plugins.bootstrapTooltip.tooltip();
      }
    }


    /**
     * Copyright Year
     * @description  Evaluates correct copyright year
     */
    var o = $(".copyright-year");
    if (o.length) {
      o.text(initialDate.getFullYear());
    }


    /**
     * validateReCaptcha
     * @description  validate google reCaptcha
     */
    function validateReCaptcha(captcha) {
      var $captchaToken = captcha.find('.g-recaptcha-response').val();

      if ($captchaToken == '') {
        captcha
          .siblings('.form-validation')
          .html('Please, prove that you are not robot.')
          .addClass('active');
        captcha
          .closest('.form-wrap')
          .addClass('has-error');

        captcha.bind('propertychange', function () {
          var $this = $(this),
            $captchaToken = $this.find('.g-recaptcha-response').val();

          if ($captchaToken != '') {
            $this
              .closest('.form-wrap')
              .removeClass('has-error');
            $this
              .siblings('.form-validation')
              .removeClass('active')
              .html('');
            $this.unbind('propertychange');
          }
        });

        return false;
      }

      return true;
    }

    /**
     * onloadCaptchaCallback
     * @description  init google reCaptcha
     */
    onloadCaptchaCallback = function () {
      for (i = 0; i < plugins.captcha.length; i++) {
        var $capthcaItem = $(plugins.captcha[i]);

        grecaptcha.render(
          $capthcaItem.attr('id'),
          {
            sitekey: $capthcaItem.attr('data-sitekey'),
            size: $capthcaItem.attr('data-size') ? $capthcaItem.attr('data-size') : 'normal',
            theme: $capthcaItem.attr('data-theme') ? $capthcaItem.attr('data-theme') : 'light',
            callback: function (e) {
              $('.recaptcha').trigger('propertychange');
            }
          }
        );
        $capthcaItem.after("<span class='form-validation'></span>");
      }
    };

    /**
     * Google ReCaptcha
     * @description Enables Google ReCaptcha
     */
    if (plugins.captcha.length) {
      $.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
    }

    /**
     * Is Mac os
     * @description  add additional class on html if mac os.
     */
    if (navigator.platform.match(/(Mac)/i)) $html.addClass("mac-os");

    /**
     * IE Polyfills
     * @description  Adds some loosing functionality to IE browsers
     */
    if (isIE) {
      if (isIE === 12) $html.addClass("ie-edge");
      if (isIE === 11) $html.addClass("ie-11");
      if (isIE < 10) $html.addClass("lt-ie-10");
      if (isIE < 11) $html.addClass("ie-10");
    }

    /**
     * Bootstrap Tooltips
     * @description Activate Bootstrap Tooltips
     */
    if (plugins.bootstrapTooltip.length) {
      var tooltipPlacement = plugins.bootstrapTooltip.attr('data-bs-placement');
      initBootstrapTooltip(tooltipPlacement);
      $(window).on('resize orientationchange', function () {
        initBootstrapTooltip(tooltipPlacement);
      })
    }

    /**
     * bootstrapModalDialog
     * @description Stap vioeo in bootstrapModalDialog
     */
    if (plugins.bootstrapModalDialog.length > 0) {
      var i = 0;

      for (i = 0; i < plugins.bootstrapModalDialog.length; i++) {
        var modalItem = $(plugins.bootstrapModalDialog[i]);

        modalItem.on('hidden.bs.modal', $.proxy(function () {
          var activeModal = $(this),
            rdVideoInside = activeModal.find('video'),
            youTubeVideoInside = activeModal.find('iframe');

          if (rdVideoInside.length) {
            rdVideoInside[0].pause();
          }

          if (youTubeVideoInside.length) {
            var videoUrl = youTubeVideoInside.attr('src');

            youTubeVideoInside
              .attr('src', '')
              .attr('src', videoUrl);
          }
        }, modalItem))
      }
    }


    /**
     * Radio
     * @description Add custom styling options for input[type="radio"]
     */
    if (plugins.radio.length) {
      var i;
      for (i = 0; i < plugins.radio.length; i++) {
        var $this = $(plugins.radio[i]);
        $this.addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
      }
    }

    /**
     * Checkbox
     * @description Add custom styling options for input[type="checkbox"]
     */
    if (plugins.checkbox.length) {
      var i;
      for (i = 0; i < plugins.checkbox.length; i++) {
        var $this = $(plugins.checkbox[i]);
        $this.addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
      }
    }

    /**
     * Popovers
     * @description Enables Popovers plugin
     */
    if (plugins.popover.length) {
      if (window.innerWidth < 767) {
        plugins.popover.attr('data-bs-placement', 'bottom');
        plugins.popover.popover();
      } else {
        plugins.popover.popover();
      }
    }

    /**
     * Bootstrap Buttons
     * @description  Enable Bootstrap Buttons plugin
     */
    if (plugins.statefulButton.length) {
      $(plugins.statefulButton).on('click', function () {
        var statefulButtonLoading = $(this).button('loading');

        setTimeout(function () {
          statefulButtonLoading.button('reset')
        }, 2000);
      })
    }

    /**
     * UI To Top
     * @description Enables ToTop Button
     */
    if (isDesktop && !isNoviBuilder) {
      $().UItoTop({
        easingType: 'easeOutQuart',
        containerClass: 'ui-to-top fa fa-angle-up'
      });
    }

    // RD Navbar
    if (plugins.rdNavbar.length) {
      let
        navbar = plugins.rdNavbar,
        aliases = {
          '-': 0,
          '-sm-': 576,
          '-md-': 768,
          '-lg-': 992,
          '-xl-': 1200,
          '-xxl-': 1600
        },
        responsive = {},
        navItems = $('.rd-nav-item');

      for (let i = 0; i < navItems.length; i++) {
        let node = navItems[i];

        if (node.classList.contains('opened')) {
          node.classList.remove('opened')
        }
      }

      for (let alias in aliases) {
        let link = responsive[aliases[alias]] = {};
        if (navbar.attr('data' + alias + 'layout')) link.layout = navbar.attr('data' + alias + 'layout');
        if (navbar.attr('data' + alias + 'device-layout')) link.deviceLayout = navbar.attr('data' + alias + 'device-layout');
        if (navbar.attr('data' + alias + 'hover-on')) link.focusOnHover = navbar.attr('data' + alias + 'hover-on') === 'true';
        if (navbar.attr('data' + alias + 'auto-height')) link.autoHeight = navbar.attr('data' + alias + 'auto-height') === 'true';
        if (navbar.attr('data' + alias + 'stick-up-offset')) link.stickUpOffset = navbar.attr('data' + alias + 'stick-up-offset');
        if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
        if (isNoviBuilder) link.stickUp = false;
        else if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
      }

      plugins.rdNavbar.RDNavbar({
        anchorNav: !isNoviBuilder,
        stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
        responsive: responsive,
        callbacks: {
          onStuck: function () {
            let navbarSearch = this.$element.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
            }
          },
          onDropdownOver: function () {
            return !isNoviBuilder;
          },
          onUnstuck: function () {
            if (this.$clone === null)
              return;

            let navbarSearch = this.$clone.find('.rd-search input');

            if (navbarSearch) {
              navbarSearch.val('').trigger('propertychange');
              navbarSearch.trigger('blur');
            }

          }
        }
      });
    }

    /**
     * ViewPort Universal
     * @description Add class in viewport
     */
    if (plugins.viewAnimate.length) {
      var i;
      for (i = 0; i < plugins.viewAnimate.length; i++) {
        var $view = $(plugins.viewAnimate[i]).not('.active');
        $document.on("scroll", $.proxy(function () {
          if (isScrolledIntoView(this)) {
            this.addClass("active");
          }
        }, $view))
          .trigger("scroll");
      }
    }

    // Owl carousel
    if (plugins.owl.length) {
      for (var i = 0; i < plugins.owl.length; i++) {
        var c = $(plugins.owl[i]);
        plugins.owl[i].owl = c;

        initOwlCarousel(c);
      }
    }

    /**
     * WOW
     * @description Enables Wow animation plugin
     */
    if (isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
      new WOW().init();
    }

    /**
     * Slick carousel
     * @description  Enable Slick carousel plugin
     */
    if (plugins.slick.length) {
      var i;
      for (i = 0; i < plugins.slick.length; i++) {
        var $slickItem = $(plugins.slick[i]);

        $slickItem.slick({
          slidesToScroll: parseInt($slickItem.attr('data-slide-to-scroll')) || 1,
          asNavFor: $slickItem.attr('data-for') || false,
          dots: $slickItem.attr("data-dots") == "true",
          infinite: isNoviBuilder ? false : $slickItem.attr("data-loop") == "true",
          focusOnSelect: true,
          arrows: $slickItem.attr("data-arrows") == "true",
          swipe: $slickItem.attr("data-swipe") == "true",
          autoplay: $slickItem.attr("data-autoplay") == "true",
          centerMode: $slickItem.attr("data-center-mode") == "true",
          centerPadding: $slickItem.attr("data-center-padding") ? $slickItem.attr("data-center-padding") : '0.50',
          mobileFirst: true,
          responsive: [
            {
              breakpoint: 0,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-items')) || 1,
                vertical: $slickItem.attr('data-vertical') == 'true' || false
              }
            },
            {
              breakpoint: 479,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-xs-items')) || 1,
                vertical: $slickItem.attr('data-xs-vertical') == 'true' || false
              }
            },
            {
              breakpoint: 767,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-sm-items')) || 1,
                vertical: $slickItem.attr('data-sm-vertical') == 'true' || false
              }
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-md-items')) || 1,
                vertical: $slickItem.attr('data-md-vertical') == 'true' || false
              }
            },
            {
              breakpoint: 1200,
              settings: {
                slidesToShow: parseInt($slickItem.attr('data-lg-items')) || 1,
                vertical: $slickItem.attr('data-lg-vertical') == 'true' || false
              }
            }
          ]
        })
          .on('afterChange', function (event, slick, currentSlide, nextSlide) {
            var $this = $(this),
              childCarousel = $this.attr('data-child');

            if (childCarousel) {
              $(childCarousel + ' .slick-slide').removeClass('slick-current');
              $(childCarousel + ' .slick-slide').eq(currentSlide).addClass('slick-current');
            }
          });
      }
    }



    /**
     * Bootstrap tabs
     * @description Activate Bootstrap Tabs
     */
    if (plugins.bootstrapTabs.length) {
      var i;
      for (i = 0; i < plugins.bootstrapTabs.length; i++) {
        var bootstrapTabsItem = $(plugins.bootstrapTabs[i]);

        //If have owl carousel inside tab - resize owl carousel on click
        if (bootstrapTabsItem.find('.owl-carousel').length) {
          // init first open tab

          var carouselObj = bootstrapTabsItem.find('.tab-content .tab-pane.active .owl-carousel');

          initOwlCarousel(carouselObj);

          //init owl carousel on tab change
          bootstrapTabsItem.find('.nav-custom a').on('click', $.proxy(function () {
            var $this = $(this);

            $this.find('.owl-carousel').trigger('destroy.owl.carousel').removeClass('owl-loaded');
            $this.find('.owl-carousel').find('.owl-stage-outer').children().unwrap();

            setTimeout(function () {
              var carouselObj = $this.find('.tab-content .tab-pane.active .owl-carousel');

              if (carouselObj.length) {
                for (var j = 0; j < carouselObj.length; j++) {
                  var carouselItem = $(carouselObj[j]);
                  initOwlCarousel(carouselItem);
                }
              }

            }, isNoviBuilder ? 1500 : 300);

          }, bootstrapTabsItem));
        }

        //If have slick carousel inside tab - resize slick carousel on click
        if (bootstrapTabsItem.find('.slick-slider').length) {
          bootstrapTabsItem.find('.nav-tabs > li > a').on('click', $.proxy(function () {

            var $this = $(this);
            var setTimeOutTime = isNoviBuilder ? 1500 : 300;
            setTimeout(function () {
              $this.find('.tab-content .tab-pane.active .slick-slider').slick('setPosition');
            }, setTimeOutTime);
          }, bootstrapTabsItem));
        }
      }
    }


    /**
     * RD Input Label
     * @description Enables RD Input Label Plugin
     */
    if (plugins.rdInputLabel.length) {
      plugins.rdInputLabel.RDInputLabel();
    }

    /**
     * Regula
     * @description Enables Regula plugin
     */
    if (plugins.regula.length) {
      attachFormValidator(plugins.regula);
    }

    // MailChimp Ajax subscription
    if (plugins.mailchimp.length) {
      for (i = 0; i < plugins.mailchimp.length; i++) {
        var $mailchimpItem = $(plugins.mailchimp[i]),
          $email = $mailchimpItem.find('input[type="email"]');

        // Required by MailChimp
        $mailchimpItem.attr('novalidate', 'true');
        $email.attr('name', 'EMAIL');

        $mailchimpItem.on('submit', $.proxy(function ($email, event) {
          event.preventDefault();

          var $this = this;

          var data = {},
            url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
            dataArray = $this.serializeArray(),
            $output = $("#" + $this.attr("data-form-output"));

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.msg).addClass('active');
              $email[0].value = '';
              var $label = $('[for="' + $email.attr('id') + '"]');
              if ($label.length) $label.removeClass('focus not-empty');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function (data) {
              var isNoviBuilder = window.xMode;

              var isValidated = (function () {
                var results, errors = 0;
                var elements = $this.find('[data-constraints]');
                var captcha = null;
                if (elements.length) {
                  for (var j = 0; j < elements.length; j++) {

                    var $input = $(elements[j]);
                    if ((results = $input.regula('validate')).length) {
                      for (var k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                      }
                    } else {
                      $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                    }
                  }

                  if (captcha) {
                    if (captcha.length) {
                      return validateReCaptcha(captcha) && errors === 0
                    }
                  }

                  return errors === 0;
                }
                return true;
              })();

              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated)
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          return false;
        }, $mailchimpItem, $email));
      }
    }

    // Campaign Monitor ajax subscription
    if (plugins.campaignMonitor.length) {
      for (i = 0; i < plugins.campaignMonitor.length; i++) {
        var $campaignItem = $(plugins.campaignMonitor[i]);

        $campaignItem.on('submit', $.proxy(function (e) {
          var data = {},
            url = this.attr('action'),
            dataArray = this.serializeArray(),
            $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
            $this = $(this);

          for (i = 0; i < dataArray.length; i++) {
            data[dataArray[i].name] = dataArray[i].value;
          }

          $.ajax({
            data: data,
            url: url,
            dataType: 'jsonp',
            error: function (resp, text) {
              $output.html('Server error: ' + text);

              setTimeout(function () {
                $output.removeClass("active");
              }, 4000);
            },
            success: function (resp) {
              $output.html(resp.Message).addClass('active');

              setTimeout(function () {
                $output.removeClass("active");
              }, 6000);
            },
            beforeSend: function (data) {
              // Stop request if builder or inputs are invalide
              if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
                return false;

              $output.html('Submitting...').addClass('active');
            }
          });

          // Clear inputs after submit
          var inputs = $this[0].getElementsByTagName('input');
          for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
            var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
            if (label) label.classList.remove('focus', 'not-empty');
          }

          return false;
        }, $campaignItem));
      }
    }

    /**
     * RD Mailform
     */
    if (plugins.rdMailForm.length) {
      var i, j, k,
        msg = {
          'MF000': '发送成功！',
          'MF001': '必填字段未填写！',
          'MF002': '本地环境无法提交表单！',
          'MF003': '请填写有效的邮箱地址！',
          'MF004': '请定义表单类型！',
          'MF254': '邮件服务器配置错误！',
          'MF255': '糟糕，出了点问题！'
        };

      for (i = 0; i < plugins.rdMailForm.length; i++) {
        var $form = $(plugins.rdMailForm[i]),
          formHasCaptcha = false;

        $form.attr('novalidate', 'novalidate').ajaxForm({
          data: {
            "form-type": $form.attr("data-form-type") || "contact",
            "counter": i
          },
          beforeSubmit: function (arr, $form, options) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              inputs = form.find("[data-constraints]"),
              output = $("#" + form.attr("data-form-output")),
              captcha = form.find('.recaptcha'),
              captchaFlag = true;

            output.removeClass("active error success");

            if (isValidated(inputs, captcha)) {

              // veify reCaptcha
              if (captcha.length) {
                var captchaToken = captcha.find('.g-recaptcha-response').val(),
                  captchaMsg = {
                    'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                    'CPT002': 'Something wrong with google reCaptcha'
                  }

                formHasCaptcha = true;

                $.ajax({
                  method: "POST",
                  url: "bat/reCaptcha.php",
                  data: {'g-recaptcha-response': captchaToken},
                  async: false
                })
                  .done(function (responceCode) {
                    if (responceCode != 'CPT000') {
                      if (output.hasClass("snackbars")) {
                        output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                        setTimeout(function () {
                          output.removeClass("active");
                        }, 3500);

                        captchaFlag = false;
                      } else {
                        output.html(captchaMsg[responceCode]);
                      }

                      output.addClass("active");
                    }
                  });
              }

              if (!captchaFlag) {
                return false;
              }

              form.addClass('form-in-process');

              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>发送中…</span></p>');
                output.addClass("active");
              }
            } else {
              return false;
            }
          },
          error: function (result) {
            if (isNoviBuilder)
              return;

            var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
              form = $(plugins.rdMailForm[this.extraData.counter]);

            output.text(msg[result]);
            form.removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }
          },
          success: function (result) {
            if (isNoviBuilder)
              return;

            var form = $(plugins.rdMailForm[this.extraData.counter]),
              output = $("#" + form.attr("data-form-output"));

            form
              .addClass('success')
              .removeClass('form-in-process');

            if (formHasCaptcha) {
              grecaptcha.reset();
            }

            result = result.length === 5 ? result : 'MF255';
            output.text(msg[result]);

            if (result === "MF000") {
              if (output.hasClass("snackbars")) {
                output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active success");
              }
            } else {
              if (output.hasClass("snackbars")) {
                output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
              } else {
                output.addClass("active error");
              }
            }

            form.clearForm();
            form.find('input, textarea').blur();

            setTimeout(function () {
              output.removeClass("active error success");
              form.removeClass('success');
            }, 3500);
          }
        });
      }
    }


    // lightGallery
    if (plugins.lightGallery.length) {
      for (var i = 0; i < plugins.lightGallery.length; i++) {
        initLightGallery(plugins.lightGallery[i]);
      }
    }

    // lightGallery item
    if (plugins.lightGalleryItem.length) {
      // Filter carousel items
      var notCarouselItems = [];

      for (var z = 0; z < plugins.lightGalleryItem.length; z++) {
        if (!$(plugins.lightGalleryItem[z]).parents('.owl-carousel').length &&
          !$(plugins.lightGalleryItem[z]).parents('.swiper-slider').length &&
          !$(plugins.lightGalleryItem[z]).parents('.slick-slider').length) {
          notCarouselItems.push(plugins.lightGalleryItem[z]);
        }
      }

      plugins.lightGalleryItem = notCarouselItems;

      for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
        initLightGalleryItem(plugins.lightGalleryItem[i]);
      }
    }

    // Dynamic lightGallery
    if (plugins.lightDynamicGalleryItem.length) {
      for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
        initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
      }
    }

    /**
     * Custom Toggles
     */
    if (plugins.customToggle.length) {
      var i;

      for (i = 0; i < plugins.customToggle.length; i++) {
        var $this = $(plugins.customToggle[i]);

        $this.on('click', $.proxy(function (event) {
          event.preventDefault();
          var $ctx = $(this);
          $($ctx.attr('data-custom-toggle')).add(this).toggleClass('active');
        }, $this));

        if ($this.attr("data-custom-toggle-hide-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0]
              && $(e.data.attr('data-custom-toggle')).find($(e.target)).length
              && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }

        if ($this.attr("data-custom-toggle-disable-on-blur") === "true") {
          $("body").on("click", $this, function (e) {
            if (e.target !== e.data[0] && $(e.data.attr('data-custom-toggle')).find($(e.target)).length == 0 && e.data.find($(e.target)).length == 0) {
              $(e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
            }
          })
        }
      }
    }

    /**
     * Fixed height
     */
    if (plugins.fixedHeight) {
      for (var i = 0; i < plugins.fixedHeight.length; i++) {
        $(window).on('resize orientationchange', function (object) {
          setFixedHeight(object);
        }(plugins.fixedHeight[i]))
      }

      $window.trigger("resize");
    }

    function setFixedHeight(object) {
      object.style.minHeight = object.offsetHeight + 'px';
    }


    /**
     * D3 Charts
     * @description Enables D3 Charts plugin
     */

    function fillNumbers(n) {
      return Array.apply(null, {length: n}).map(Function.call, Number);
    }

    var d3Charts = [];
    var lineChartObjectData = [18.4, 29.5, 27.0, 21.6, 41.7, 49.6, 23.4, 47.7, 10.6, 10.9, 13.5, 12.2, 12.6, 15.8, 12.7, 14.5, 11.1, 11.3, 12.5],
      lineChartObject = {
        bindto: '#line-chart',
        legend: {
          show: false
        },
        color: {
          pattern: ['#ffe500']
        },
        point: {
          r: 4
        },
        padding: {
          left: 30,
          right: 30,
          top: 0,
          bottom: 0,
        },
        data: {
          x: 'x',
          columns: [
            ['x', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            ['data1'].concat(lineChartObjectData)
          ],
          axes: {
            data1: 'y'
          },
          type: 'area',
          classes: {
            data1: 'stocks-rating-chart',
          }
        },
        grid: {
          x: {
            show: true
          },
          y: {
            show: true
          }
        },
        labels: true,
        axis: {
          x: {

            min: 0,
            max: 20.0,
            tick: {
              values: fillNumbers(21),
              format: function (x) {
                return x;
              },
              outer: false
            },
            padding: {
              left: 0,
              right: 0,
            }
          },
          y: {
            min: 0,
            max: 50.0,
            tick: {
              values: fillNumbers(11).map(x => x * 5),
              format: function (x) {
                return x;
              },
              outer: false
            },
            padding: {
              top: 0,
              bottom: 0
            }
          },
        },
        tooltip: {
          format: {
            name: function (name, ratio, id, index) {
              return '';
            },
            value: function (value, ratio, id, index) {
              var val = Math.round(typeof lineChartObjectData[index - 1] === 'undefined' ? 0 : ((value - lineChartObjectData[index - 1]) / value) * 100)
              return value + "MB" + " (" + (val == 0 ? '' : val > 0 ? '+' : '-') + Math.abs(val) + "%)";
            }
          }
        },
        line: {
          connectNull: true
        }
      };

    var lineChartObjectData2 = [[1, 2, 1.5, 3, 2, 1.6, 2], [2.5, 3.5, 3, 4.5, 3.5, 4.3, 4.8, 5]],
      lineChartObject2 = {
        bindto: '#line-chart-2',
        legend: {
          show: false
        },
        color: {
          pattern: ['#ffe500', '#000']
        },
        point: {
          r: 4
        },
        padding: {
          left: 30,
          right: 30,
          top: 0,
          bottom: 0,
        },
        data: {
          xs: {
            'data1': 'x1',
            'data2': 'x2',
          },
          names: {
            data1: '2016',
            data2: '2017'
          },
          columns: [
            ['x1', 1, 1.5, 3, 4.4, 7, 9, 12],
            ['x2', 1, 1.5, 3, 4.4, 7, 10, 11, 12],
            ['data1'].concat(lineChartObjectData2[0]),
            ['data2'].concat(lineChartObjectData2[1])
          ],
          axes: {
            data1: 'y'
          }
        },
        grid: {
          x: {
            show: true
          },
          y: {
            show: true
          }
        },
        labels: true,
        axis: {
          x: {
            min: 0,
            max: 12.5,
            tick: {
              values: fillNumbers(13),
              format: function (x) {
                return ('0' + x).slice(-2);
              },
              outer: false
            },
            padding: {
              left: 0,
              right: 0,
            }
          },
          y: {
            min: 0,
            max: 6,
            tick: {
              values: fillNumbers(13),
              format: function (x) {
                return x == 0 ? '' : ('0' + x).slice(-2);
              },
              outer: false
            },
            padding: {
              top: 0,
              bottom: 0
            }
          },
        },
        tooltip: {
          format: {
            value: function (value) {
              return value;
            }
          }
        },
        line: {
          connectNull: true
        }
      };

    d3Charts.push(c3.generate(lineChartObject));
    d3Charts.push(c3.generate(lineChartObject2));

  });
}());
