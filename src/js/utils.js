var Utils = {
    containsObject: function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    },
	hypotenuse: function(a, b) {
		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	},
	ratio: function(a, b, c) {
		if (arguments.length === 1) {
			return [a / a];
		}
		else if (arguments.length === 2) {
			return [a / (a + b), b / (a + b)];
		}
		else if (arguments.length === 3) {
			return [a / (a + b + c), b / (a + b + c), c / (a + b + c)];
		}
		else {
			return [];
		}
	}
};


module.exports = Utils;