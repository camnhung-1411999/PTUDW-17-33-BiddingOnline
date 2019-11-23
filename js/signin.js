

function SignIn() {
    $(location).attr('href', 'index.html');

}

$(document).ready(function () {
    $("#btnSignin").click(SignIn);
    
});

// if (temp.x == 1) {
//     $("#Signin_Signup").text("Nguyễn Hoàng Mẫn");
// }