exports.getRandomPattern = function () {

    var patterns;

    patterns = [
        [ [1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1] ],
        [ [1,0,0,0,1], [0,1,0,1,0], [0,0,0,0,0], [0,1,0,1,0], [1,0,0,0,1] ],
        [ [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1] ]
    ];

    return patterns[ Math.floor(Math.random()* patterns.length) ];
};

exports.countAmountOfNumbersInPattern = function (pattern) {

    var count;

    count = 0;

    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
            if(pattern[i][j] === 1) {
                count++;
            }
        }
    }

    return count;
};