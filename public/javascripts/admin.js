$(document).ready(()=>{
    $('.listbid').show();
    $('.listsell').hide();
    $('.regis').hide();
    $('#lb').click(() => {
        $('.listbid').show();
        $('.listsell').hide();
    })
    $('#ls').click(() => {
        $('.listbid').hide();
        $('.listsell').show();
    })
    $('#regis').click(() => {

        $('.listbid').hide();
        $('.listsell').hide();
        $('.regis').show();
    })
})