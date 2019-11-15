// (function (){
//     var sign = document.getElementById('singin');
//     var dialogSign = document.getElementById('dialog_sign');
  
//     // “Update details” button opens the <dialog> modally
//     sign.addEventListener('click', function() {
//       dialogSign.showModal();
//     });
// })();
$(document).ready(function() {
  $('a.login-window').click(function() {
      //lấy giá trị thuộc tính href - chính là phần tử "#login-box"
      var loginBox = $(this).attr('href');

      //cho hiện hộp đăng nhập trong 300ms
      $(loginBox).fadeIn(300);

      // thêm phần tử id="over" vào sau body
      $('body').append('<div id="over">');
      $('#over').fadeIn(300);

      return false;
});

// khi click đóng hộp thoại
$(document).on('click', "a.close, #over", function() {
     $('#over, .login').fadeOut(300 , function() {
         $('#over').remove();
     });
    return false;
});
});