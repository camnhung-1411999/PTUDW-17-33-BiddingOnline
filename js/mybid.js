// $(document).ready(function(){
//     var sign = document.getElementById('signin');
//     var dialogSign = document.getElementById('dialog_sign');
//     // “Update details” button opens the <dialog> modally
//     sign.addEventListener('click', function() {
//         dialogSign.showModal();

//     });
// });

$(document).ready(function () {
    $('#Signin_Signup').click(function () {
        $(location).attr('href', 'signup_in.html');
    });
});