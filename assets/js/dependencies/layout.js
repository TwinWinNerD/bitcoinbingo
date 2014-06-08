var historyElements = [];

function getBallColor(num) {
    switch (num) {
        case 61:
        case 62:
        case 63:
        case 64:
        case 65:
        case 66:
        case 67:
        case 68:
        case 69:
        case 70:
        case 71:
        case 72:
        case 73:
        case 74:
        case 75:
            return 5;
        case 46:
        case 47:
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
        case 58:
        case 59:
        case 60:
            return 4;
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
        case 38:
        case 39:
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 45:
            return 3;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 22:
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29:
        case 30:
            return 2;
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            return 1;
    }
}

function ChangeLatestBall(num) {
    if ($('#latest-ball').hasClass('ball-middle')) {
        $('#latest-ball').toggleClass('ball-end');
        setTimeout(function () {
            RollInHistoryBall(parseInt($('#latest-ball').text(), 10));
            $('#latest-ball').attr("class", "ball-start");
            setTimeout(function () {
                $('#latest-ball').text(num);
                var current_ball_color = getBallColor(num);
                $('#latest-ball').css('background-image', 'url(img/bingo-balls/' + current_ball_color + '.png)');
                $('#latest-ball').toggleClass('ball-middle');
            }, 600);
        }, 600);
    }
    else {
        $('#latest-ball').text(num);
        var current_ball_color = getBallColor(num);
        $('#latest-ball').css('background-image', 'url(img/bingo-balls/' + current_ball_color + '.png)');
        $('#latest-ball').toggleClass('ball-middle');
    }
}

function RollInHistoryBall(num) {
    historyElements.push(num);
    $("#ball-history").append("<div class='small-ball' id='sball" + num + "'>" + num + "</div>");
    $('#sball' + num).css('background-image', 'url(img/bingo-balls/' + getBallColor(num) + '.png)');
    setTimeout(function () {
        $('#sball' + num).toggleClass('small-ball-rollin');
        setTimeout(function () {
            if (historyElements.length > 10) {
                var remove = historyElements.shift();
                $('#sball' + remove).toggleClass('small-ball-rollout');
                setTimeout(function () {
                    $('#sball' + remove).remove();
                }, 1500);
            }
        }, 3000);
    }, 500);
}

function satoshiToBits(satoshi) {
    return satoshi / 100;
}