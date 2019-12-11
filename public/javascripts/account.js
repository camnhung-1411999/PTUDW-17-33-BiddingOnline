var time = 3;
$(document).ready(function () {
    $("#favoriteproduct").hide(time);
    $('#mycart').hide(time);
    var infor = document.getElementById('acc_detail');
    infor.addEventListener('click', function () {
        $('#favoriteproduct').hide(time);
        $('#detailinfor').show(time);
        $('#mycart').hide(time);

    });
    var favorite = document.getElementById('acc_favorite');
    favorite.addEventListener('click', function () {
        $("#favoriteproduct").show(time);
        $('#detailinfor').hide(time);
        $('#mycart').hide(time);
    });
    var cart = document.getElementById('acc_cart');
    cart.addEventListener('click', function () {
        $('#mycart').show(time);
        $('#detailinfor').hide(time);
        $('#favoriteproduct').hide(time);

    });

});