var Page = Page || {};

Page.preferences = {};

Page.init = (function(options) {

    Page.preferences = $.extend({
        windowOffset: 0, // set on initHeights function
        delay: 1000,
        sections : {
            "home": 1,
            "bio": 2,
            "projects": 3,
            "contact": 4
        }
    });

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

        $('html,body').animate({ scrollTop: offset }, Page.preferences.delay);
        return false;
    });

    $("#sendBtn").on("click", function(){
        Page.util.sendMail();
    });

//    $(".flip-container").click(function(){
//        $(this).toggleClass("hover").find(".flipper").toggleClass("rotate");
//    });

    $(".btn-group-lg>button").bind("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){ 
        $(this).css({"opacity":0.8});
    });

    $(window).resize(function() {
        Page.util.initHeights();
    });
    Page.util.initHeights();
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
        initHeights: function(){
            var windowHeight = $(window).height();
            $("#home").height(windowHeight);
            $(".section").css({"min-height": windowHeight});
            
            var firstSection = $(".section")[1];
            Page.preferences.windowOffset = $(firstSection).offset().top;
        },
        setOnScrollActions: function() {
            /* Set buttons on home screen and navigation bar (fixed on top) for other sections */
            if ($(this).scrollTop() > (Page.preferences.windowOffset - 200)) {
                $("#navigationBar").show("slow");
                $(".backToTop").show("slow")
            } else {
                $("#navigationBar").hide("slow");
                $(".backToTop").hide("slow")
            }
            
            /* select current navigation item */
            var sectionNum = parseInt($(window).scrollTop() / $(window).height() + 0.10) + 1;
            $("#navbar :nth-child("+ sectionNum +")").addClass("active").siblings().removeClass("active")
            
//            switch (sectionNum) {
//                case Page.preferences.sections.contact:
//                    $(".leftDiv").addClass("rightMovingDiv");
//                    $(".rightDiv").addClass("leftMovingDiv");
//                    break;
//            }
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
                    if (response.success) {
                        $(".form input[type=text], .form textarea").val("");
                        Page.util.showAlert("Message sent successfully!");
                    } else {
                        Page.util.showAlert("Message not sent. Please try again.");
                    }
                },
                error: function(e) {
                    Page.util.showAlert("Message not sent. Please try again.");
                }
            });
        },
        
        showAlert: function(msg) {
            $("#collapseAlert .alert").html(msg);
            $("#collapseAlert").collapse("show");
            setTimeout(function(){
                $("#collapseAlert").collapse("hide");
            },1300);
        }
    }
})();