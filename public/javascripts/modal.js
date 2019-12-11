// //favorite product
var heart = document.querySelector('.far');

heart.addEventListener('click', function () {
  this.classList.toggle('fas');
}, false);
// end

(function ($) {
  $.fn.niceNumber = function (options) {
      var settings = $.extend({
      autoSize: false,
      autoSizeBuffer: 1,
      buttonDecrement: '-',
      buttonIncrement: "+",
      buttonPosition: 'around'
    }, options);

    return this.each(function () {
      var currentInput = this,
        $currentInput = $(currentInput),
        attrMax = 999,
        attrMin = 0;

      // Handle max and min values
      if (
        typeof $currentInput.attr('max') !== typeof undefined
        && $currentInput.attr('max') !== false
      ) {
        attrMax = parseFloat($currentInput.attr('max'));
      }

      if (
        typeof $currentInput.attr('min') !== typeof undefined
        && $currentInput.attr('min') !== false
      ) {
        attrMin = parseFloat($currentInput.attr('min'));
      }

      // Fix issue with initial value being < min
      if (
        attrMin
        && !currentInput.value
      ) {
        $currentInput.val(attrMin);
      }

      // Generate container
      var $inputContainer = $('<div/>', {
        class: 'nice-number'
      })
        .insertAfter(currentInput);

      // Generate interval (object so it is passed by reference)
      var interval = {};

      // Generate buttons
      var $minusButton = $('<button/>')
        .attr('type', 'button')
        .html(settings.buttonDecrement)
        .on('mousedown mouseup mouseleave', function (event) {
          changeInterval(event.type, interval, function () {
            if (
              attrMin == null
              || attrMin < parseFloat(currentInput.value)
            ) {
              currentInput.value--;
            }
          });

          // Trigger the input event here to avoid event spam
          if (
            event.type == 'mouseup'
            || event.type == 'mouseleave'
          ) {
            $currentInput.trigger('input');
          }
        });

      var $plusButton = $('<button/>')
        .attr('type', 'button')
        .html(settings.buttonIncrement)
        .on('mousedown mouseup mouseleave', function (event) {
          changeInterval(event.type, interval, function () {
            if (
              attrMax == null
              || attrMax > parseFloat(currentInput.value)
            ) {
              currentInput.value++;
            }
          });

          // Trigger the input event here to avoid event spam
          if (
            event.type == 'mouseup'
            || event.type == 'mouseleave'
          ) {
            $currentInput.trigger('input');
          }
        });

      // Append elements
      switch (settings.buttonPosition) {
        case 'left':
          $minusButton.appendTo($inputContainer);
          $plusButton.appendTo($inputContainer);
          $currentInput.appendTo($inputContainer);
          break;
        case 'right':
          $currentInput.appendTo($inputContainer);
          $minusButton.appendTo($inputContainer);
          $plusButton.appendTo($inputContainer);
          break;
        case 'around':
        default:
          $minusButton.appendTo($inputContainer);
          $currentInput.appendTo($inputContainer);
          $plusButton.appendTo($inputContainer);
          break;
      }

      // Nicely size input
      if (settings.autoSize) {
        $currentInput.width(
          $currentInput.val().length + settings.autoSizeBuffer + "ch"
        );
        $currentInput.on('keyup input', function () {
          $currentInput.animate({
            'width': $currentInput.val().length + settings.autoSizeBuffer + "ch"
          }, 200);
        });
      }
    });
  };

  function changeInterval(eventType, interval, callback) {
    if (eventType == "mousedown") {
      interval.timeout = setTimeout(function () {
        interval.actualInterval = setInterval(function () {
          callback();
        }, 100);
      }, 200);
      callback();
    } else {
      if (interval.timeout) {
        clearTimeout(interval.timeout);
      }
      if (interval.actualInterval) {
        clearInterval(interval.actualInterval);
      }
    }
  }
}(jQuery));

$('input#add-to-cart-qty').niceNumber();

$('input#add-to-cart-qty').keydown(function (e) {
  if (e.keyCode == 190 || e.keyCode == 110 || e.keyCode == 69 || e.keyCode == 189 || e.keyCode == 109) {
    e.preventDefault();
  }

  if (isNaN(parseInt(window.getSelection()))) {
    var code = (e.keyCode >= 96) ? e.keyCode - 48 : e.keyCode;
    var keyval = parseInt(String.fromCharCode(code));

    if (!isNaN(keyval)) {
      if ($(this).val() + keyval > parseInt($(this).attr('max'))) {
        e.preventDefault();
      }
    }
  }
});
$('input#add-to-cart-qty').keyup(function (e) {
  if ($(this).val() != '') {
    $(this).val(parseInt($(this).val()));
  }
});
// ------------- //


$('#text').hide();

$('.subscribe-btn').change(function () {
  // use the :checked selector to find any that are checked
  if ($(".subscribe-btn").is(':checked')) {
    $('#text').slideDown();
  } else {
    $('#text').slideUp();
  }
});
$('.subscribe-btn').change(function () {
  // use the :checked selector to find any that are checked
  if ($(".subscribe-btn").is(':checked')) {
    $('#text').slideDown();
  } else {
    $('#text').slideUp();
  }
});

/* Images */
$('.thumbnail').on('click', function () {
  var clicked = $(this);
  var newSelection = clicked.data('big');
  var $img = $('.primary').css("background-image", "url(" + newSelection + ")");
  clicked.parent().find('.thumbnail').removeClass('selected');
  clicked.addClass('selected');
  $('.primary').empty().append($img.hide().fadeIn(500));
  return false;
});




$('button.add-to-cart').on('click', function () {
  var cartBtn = $(this);
  cartBtn.addClass('success').text("Success!").attr('disabled', true);
  setTimeout(function () { cartBtn.removeClass('success').addClass('active').text("Add to Cart").attr('disabled', false); }, 1500);
});


$('#favorite-button').on('click', function () {
  $(this).toggleClass('active');
})

// function changeImg(){
//     var showing = $(this).find("img").attr("src");
//     alert(showing+"");
//   document.getElementById('main-image').src=""+showing;
//  var  mainImg=document.getElementById('main-image');
//alert(mainImg.src);

$('.side-picture').click(function () {
  var showing = $(this).find("img").attr("src");
  document.getElementById('main1-image').src = "" + showing;
  document.getElementById('main2-image').src = "" + showing;
});