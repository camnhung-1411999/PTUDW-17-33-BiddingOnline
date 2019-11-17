$(document).ready(function () {

    
    $('#burger').click(function () {
        $('#nava').slideToggle();
        $('#searchform').slideUp();
        $('#mega-menu').slideUp();
    });
    
    $('#search-click').click(function () {

        $('#mega-menu').slideUp();
        $('#nava').slideUp();
        $('#searchform').slideToggle();
    });

    $('#search-click-list').click(function () {
        $('#mega-menu').slideUp();
        $('#searchform').slideToggle();
    });

    $('#mega-menu-btn').click(function () {
        $('#searchform').slideUp();
        $('#mega-menu').slideToggle();
    });

    $('#myTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $("#main-image").elevateZoom({
        scrollZoom: true
    });

    $('.side-picture').click(function () {
        
        var showing = $(this).find("img").attr("src");
        $('.side-picture').removeClass('active');
        $(this).addClass('active');
        $('#main-image').fadeOut(function () {
            $(this).attr('src', showing);
            $(this).fadeIn();
            $(this).elevateZoom({
                scrollZoom: true
            });
        });
        //    $('#main-image').attr('src', showing);

    });


    //    var mySwiper = new Swiper('.swiper-container', {
    //        // Optional parameters
    //        direction: 'vertical',
    //        loop: true,
    //
    //        // If we need pagination
    //        pagination: '.swiper-pagination',
    //
    //        // Navigation arrows
    //        nextButton: '.swiper-button-next',
    //        prevButton: '.swiper-button-prev',
    //
    //        // And if we need scrollbar
    //        scrollbar: '.swiper-scrollbar'
    //    });

});
