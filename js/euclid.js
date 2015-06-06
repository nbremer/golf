// CALCULATE EUCLIDEAN DISTANCE //
//Taken (and slightly adjusted to make it work) from https://github.com/compute-io/euclidean-distance

/*
d: current datum.
i: current datum index.
j: array index; e.g., array x has index 0, and array y has index 1.

var x = [ 2, 4, 5, 3, 8, 2 ],
    y = [ 3, 1, 5, -3, 7, 2 ];

var d = euclidean( x, y ); // returns ~6.86

//For object arrays, provide an accessor function for accessing numeric values.
var x, y, d;

x = [
    [1,2],
    [2,4],
    [3,5],
    [4,3],
    [5,8],
    [6,2]
];

y = [
    {'y':3},
    {'y':1},
    {'y':5},
    {'y':-3},
    {'y':7},
    {'y':2}
];

function getValue( d, i, j ) {
    if ( j === 0 ) { return d[ 1 ];}
    return d.y;
}

d = euclidean( x, y, getValue );
*/

/**
* FUNCTION: euclidean( x, y[, accessor] )
*	Computes the Euclidean distance between two arrays.
*
* @param {Number[]|Array} x - input array
* @param {Number[]|Array} y - input array
* @param {Function} [accessor] - accessor function for accessing array values
* @returns {Number|Null} Euclidean distance or null
*/
function euclidean( x, y, clbk ) {
	var len,
		val,
		abs,
		t,
		s,
		r,
		i;
	if ( !$.isArray( x ) ) {
		throw new TypeError( 'euclidean()::invalid input argument. First argument must be an array. Value: `' + x + '`.' );
	}
	if ( !$.isArray( y ) ) {
		throw new TypeError( 'euclidean()::invalid input argument. Second argument must be an array. Value: `' + y + '`.' );
	}
	if ( arguments.length > 2 ) {
		if ( typeof( clbk ) != "function" ) {
			throw new TypeError( 'euclidean()::invalid input argument. Accessor must be a function. Value: `' + clbk + '`.' );
		}
	}
	len = x.length;
	if ( len !== y.length ) {
		throw new Error( 'euclidean()::invalid input arguments. Input arrays must have the same length.' );
	}
	if ( !len ) {
		return null;
	}
	t = 0;
	s = 1;
	if ( clbk ) {
		for ( i = 0; i < len; i++ ) {
			val = clbk( x[ i ], i, 0 ) - clbk( y[ i ], i, 1 );
			abs = Math.abs(val);
			if ( abs > 0 ) {
				if ( abs > t ) {
					r = t / val;
					s = 1 + s*r*r;
					t = abs;
				} else {
					r = val / t;
					s += r*r;
				}
			}
		}
	} else {
		for ( i = 0; i < len; i++ ) {
			val = x[ i ] - y[ i ];
			abs = Math.abs(val);
			if ( abs > 0 ) {
				if ( abs > t ) {
					r = t / val;
					s = 1 + s*r*r;
					t = abs;
				} else {
					r = val / t;
					s += r*r;
				}
			}
		}
	}
	return t * Math.sqrt( s );
} // end FUNCTION euclidean()