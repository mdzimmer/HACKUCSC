var Utils = {
    containsObject: function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }foo
	/*
	hypotenuse: function(a, b) {
		return Math.sqrt(Math.pow(a, 2), Math.pow(b, 2));
	}
	*/
};

module.exports = Utils;