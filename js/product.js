var time = 20;

$(document).ready(function () {
    var laptop = document.getElementById('categorylaptop');
    laptop.addEventListener('click', function () {
        $(".tablet").hide(time);
        $(".mobile").hide(time);
        $('.laptop').show(time);

    });
    var all = document.getElementById('categoryall');
    all.addEventListener('click', function () {
        $('.tablet').show(time);
        $('.mobile').show(time);
        $('.laptop').show(time);
    });

    var mobile = document.getElementById('categorymobile');
    mobile.addEventListener('click', function () {
        $('.tablet').hide(time);
        $('.mobile').show(time);
        $('.laptop').hide(time);
    });
    var tablet = document.getElementById('categorytablet');
    tablet.addEventListener('click', function () {
        $('.tablet').show(time);
        $('.mobile').hide(time);
        $('.laptop').hide(time);
    });

});