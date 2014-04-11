module.exports = function () {

    for(var i = 1; i <= 75; i++) {
        this.push(i);
    }
};

module.exports.prototype = [];

module.exports.prototype.shuffle = function (seed) {

    var temp, j;

    for(var i = 0; i < this.length; i++) {

        // Select a "random" position.
        j = (seed % (i+1) + i) % this.length;

        // Swap the current element with the "random" one.
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
};