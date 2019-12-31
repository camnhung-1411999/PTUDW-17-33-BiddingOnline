$(document).ready(()=>{
    $('.listbid').show();
    $('.listsell').hide();
    $('.regis').hide();
    $('#lb').click(() => {
        $('.listbid').show();
        $('.listsell').hide();
        $('.regis').hide();
    })
    $('#ls').click(() => {
        $('.listbid').hide();
        $('.listsell').show();
        $('.regis').hide();
    })
    $('#regis').click(() => {

        $('.listbid').hide();
        $('.listsell').hide();
        $('.regis').show();
    })
})