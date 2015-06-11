var Page = Page || {};

Page.preferences = {};

Page.init = (function() {

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
        if (Page.util.isFormValidated()) {
            Page.util.sendMail();
        } else {
            Page.util.showAlert("Please fill missing fields.");
        }
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
});

Page.util = (function() {
    return {
        initHeights: function(){
            var windowHeight = $(window).height();
            $("#home").height(windowHeight);
            $(".section").css({"min-height": windowHeight});

            $("body").show();
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
        },
        isFormValidated: function() {
            var isValidated = true;
            $(".form input, .form textarea").each(function(index,field){
                if ($(field).val().length == 0) {
                    isValidated = false;
                }
            });
            return isValidated;
        }
    }
})();