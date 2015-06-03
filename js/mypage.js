var Page = Page || {};

Page.preferences = {};

Page.init = (function(options) {

    var $window = $(window);
    var firstSection = $(".section")[1];
    Page.preferences = $.extend({
        windowOffset: $(firstSection).offset().top,
        delay: 1000,
        sections : {
            "home": 0,
            "bio": 1,
            "projects": 2,
            "contact": 3
        }
    }, options);


    // Parallax effect
//    $('.section').each(function(){
//        var $bgobj = $(this); // assigning the object

        $(window).scroll(function() {
            // Scroll the background UP to (negative value of yPos) to get this effect
//            var yPos = -($window.scrollTop() / 10);
//            // Put together our final background position
//            var coords = '50% '+ yPos + 'px';
//            // Move the background
//            $bgobj.css({ backgroundPosition: coords });

            Page.util.setOnScrollActions.apply(this);
        });
//    });

    /* Navigate to desired section on the page. */
    $("#navbar a, .backToTop a, #navigationBtnGroup button").on("click", function() {
        var selector = $(this).attr("href") || $(this).data("link"),
            offset = $(selector).offset().top;

        $('html,body').animate({
            scrollTop: offset
        }, Page.preferences.delay);

        $(this).parent("li").addClass("active").siblings().removeClass("active");
        return false;
    });

    $("#sendBtn").on("click", function(){
        Page.util.sendMail();
    });

//    $(document).on('submit', '#contactForm', function (event) {
//        event.preventDefault();
//    }).on('click', '#sendBtn', function(){
//            Page.util.sendMail();
//    });

    //Page.csrf.enable();
});

Page.csrf = (function() {

    /* Many thanks to Corey Maynard for the following code.
     * Got it from http://coreymaynard.com/blog/performing-ajax-post-requests-in-django/
     **/

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    return {

        enable: function() {
            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                        // Only send the token to relative URLs i.e. locally.
                        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                    }
                }
            });
        }
    }
})();

Page.util = (function() {
    return {
        setOnScrollActions: function() {
            /* Set buttons on home screen and navigation bar (fixed on top) for other sections */
            if ($(this).scrollTop() > (Page.preferences.windowOffset - 200)) {
                $("#navigationBar").show("slow");
                $("#navigationBtnGroup").hide("slow");
                $(".backToTop ").show("slow")
            } else {
                $("#navigationBar").hide("slow");
                $(".backToTop ").hide("slow")
                $("#navigationBtnGroup").show("slow");
            }
            
            /* select current navigation item */
            var sectionNum = parseInt($(window).scrollTop() / $(window).height() + 0.10) + 1;
            $("#navbar :nth-child("+ sectionNum +")").addClass("active").siblings().removeClass("active")
            
            switch (sectionNum) {
                case Page.preferences.sections.contact:
                    $(".leftDiv").addClass("rightMovingDiv");
                    $(".rightDiv").addClass("leftMovingDiv");
                    break;
                case Page.preferences.sections.bio:
                    $(".carouselCustom").show("slow");
            }
            
            return false;
        },
        sendMail: function() {
            var request = {
                name: $("#contactName").val(),
                from: $("#contactMail").val(),
                msg: $("#contactMessage").val()
            }

            $.ajax({
                type : "post",
                url : "php/send.php",
                data: request,
                dataType: "json",
                success : function(response) {
                    console.log(response)
                    if (response.success) {
                        alert("Message sent successfully!");
                        $(".form input[type=text], .form textarea").val("");
                    } else {
                        alert("Message not sent. Please try again.");
                    }
                },
                error: function(e) {
                    alert("Message not sent. Please try again.");
                }
            });
        }
    }
})();