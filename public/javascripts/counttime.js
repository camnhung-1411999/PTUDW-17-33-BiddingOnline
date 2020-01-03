var x = setInterval(function () {

    var time = $('.temp');
    var settime = $('.settime');
    for (var i = 0; i < time.length; i++) {
        var distance = parseInt($(time[i]).text());

        var days = Math.floor(distance / (60 * 60 * 24));
        var hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
        var minutes = Math.floor((distance % (60 * 60)) / (60));
        var seconds = Math.floor((distance % (60)));

        if (days < 10) {
            days = "0" + days;
        }
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (days != '00') {
            $(settime[i]).text(days + "days");
        } else {
            $(settime[i]).text(hours + ":" + minutes + ":" + seconds);
        }
        // $(settime[i]).text(days + ":" + hours + ":" + minutes + ":" + seconds);
        $(time[i]).text(distance - 1 + '');
        if (distance < 0) {
            // clearInterval(x);
            $(settime[i]).text("EXPIRED");
        }
    }

}, 1000);