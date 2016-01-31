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
	ratio: function(a, b, c, min) {
		if (a == 0 && b == 0 && c == 0) {
			return {a : 1 / 3, b : 1 / 3, c : 1 / 3};
		}
		var sum = a + b + c
		// var aRatio = (a == 0) ? 0 : a / sum;
		// var bRatio = (b == 0) ? 0 : b / sum;
		// var cRatio = (c == 0) ? 0 : c / sum;
		var aRatio = a / sum;
		var bRatio = b / sum;
		var cRatio = c / sum;

		// if (arguments.length === 1) {
		// 	return [a / a];
		// }
		// else if (arguments.length === 2) {
		// 	return [a / (a + b), b / (a + b)];
		// }
		// else if (arguments.length === 3) {
		// 	return [a / (a + b + c), b / (a + b + c), c / (a + b + c)];
		// }
		// else {
		// 	return [];
		// }
		// console.log('util recieves', a, b, c, aRatio, bRatio, cRatio);
		if (aRatio < min) {
			if (bRatio < min) {
				// console.log(aRatio, bRatio, cRatio);
				var diffA = min - aRatio;
				var diffB = min - bRatio;
				// console.log(cRatio, diffA, diffB);
				cRatio -= diffA + diffB;
				aRatio = min;
				bRatio = min;
			} else if (cRatio < min) {
				var diffA = min - aRatio;
				var diffC = min - cRatio;
				// console.log(aRatio, bRatio, diffA, diffC);
				bRatio -= diffA + diffC;
				// console.log(bRatio);
				aRatio = min;
				cRatio = min;
			} else {
				var diff = min - aRatio;
				if (bRatio - diff / 2 < min) {
					var allowed = bRatio - min;
					var needed = diff - allowed;
					bRatio = min;
					cRatio -= needed;
					aRatio = min;
				} else if (cRatio - diff / 2 < min) {
					var allowed = cRatio - min;
					var needed = diff - allowed;
					cRatio = min;
					bRatio -= needed;
					aRatio = min;
				} else {
					aRatio = min;
					bRatio -= diff / 2;
					cRatio -= diff / 2;
				}
			}
		} else if (bRatio < min) {
			if (cRatio < min) {
				var diffB = min - bRatio;
				var diffC = min - cRatio;
				aRatio -= diffB + diffC;
				bRatio = min;
				cRatio = min;
			} else {
				var diff = min - bRatio;
				if (aRatio - diff / 2 < min) {
					var allowed = aRatio - min;
					var needed = diff - allowed;
					aRatio = min;
					cRatio -= needed;
					bRatio = min;
				} else if (cRatio - diff / 2 < min) {
					var allowed = cRatio - min;
					var needed = diff - allowed;
					cRatio = min;
					aRatio -= needed;
					bRatio = min;
				} else {
					bRatio = min;
					aRatio -= diff / 2;
					cRatio -= diff / 2;
				}
			}
		} else if (cRatio < min) {
			// console.log('case a');
			var diff = min - cRatio;
			if (aRatio - diff / 2 < min) {
				// console.log('case b');
				var allowed = aRatio - min;
				var needed = diff - allowed;
				aRatio = min;
				bRatio -= needed;
				cRatio = min;
			} else if (bRatio - diff / 2 < min) {
				// console.log('case c');
				var allowed = bRatio - min;
				var needed = diff - allowed;
				bRatio = min;
				aRatio -= needed;
				cRatio = min;
			} else {
				// console.log('case d');
				cRatio = min;
				aRatio -= diff / 2;
				cRatio -= diff / 2;
			}
		}
		// console.log('util returns', aRatio, bRatio, cRatio);
		return {a : aRatio, b : bRatio, c : cRatio};
	}
};


module.exports = Utils;