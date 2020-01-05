//$("#output").val($("#output").data('role'));

$('#editControls a').click(function (e) {
    switch ($(this).data('role')) {
        case 'h1':
        case 'h2':
        case 'p':
            document.execCommand('formatBlock', false, $(this).data('role'));
            break;
        default:
            document.execCommand($(this).data('role'), false, null);
            break;
    }
    update_output();
})

$('#editor').bind('blur keyup paste copy cut mouseup', function (e) {
    update_output();
})

function update_output() {
    $('#output').val($('#editor').html());
}