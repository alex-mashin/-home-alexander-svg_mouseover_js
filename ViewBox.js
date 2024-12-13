/*****
*
*   ViewBox.js
*
*   copyright 2002, Kevin Lindsey
*	© 2024 Alexander Mashin
*
*****/

ViewBox.VERSION = '1.1';


/*****
*
*   constructor
*
*****/
function ViewBox( svgNode ) {
	if ( svgNode ) {
		this.init( svgNode );
	}
}

/*****
*
*   init
*
*****/
ViewBox.prototype.init = function( svgNode ) {
	var viewBox = svgNode.getAttributeNS( null, 'viewBox' );
	
	/* NOTE: Need to put an SVGResize event handler on the svgNode to keep
		these values in sync with the window size or should add additional
		logic (probably a flag) to getTM() so it will know to use the window
		dimensions instead of this object's width and height properties */
	[ this.x, this.y, this.width, this.height ] = viewBox
		? viewBox.split( /\s*,\s*|\s+/ ).map( parseFloat )
		: [ 0, 0, window.innerWidth, window.innerHeight ];
	
	this.setPAR( svgNode.getAttributeNS( null, 'preserveAspectRatio' ) );
};

/*****
*
*   getMatrix
*
*****/
ViewBox.prototype.getMatrix = function( matrix, size, windowSize, ratio, align ) {
	let trans = 0;
	let diff  = windowSize * ratio - size;
	if ( align === 'Mid' ) {
		trans = -diff / 2;
	} else if ( align === 'Max' ) {
		trans = -diff;
	}
	return matrix.translate( trans, 0 ).scale( ratio );
}

/*****
*
*   getTM
*
*****/
ViewBox.prototype.getTM = function() {
	let matrix = svgRoot.createSVGMatrix().translate( this.x, this.y );
	
	let windowWidth  = parseFloat( svgRoot.getAttributeNS( null, 'width' )	|| window.innerWidth );
	let windowHeight = parseFloat( svgRoot.getAttributeNS( null, 'height' )	|| window.innerHeight );
	var x_ratio = this.width	/ windowWidth;
	var y_ratio = this.height	/ windowHeight;

	if ( this.alignX === 'none' ) {
		return matrix.scaleNonUniform( x_ratio, y_ratio );
	}
	if ( x_ratio < y_ratio && this.meetOrSlice === 'meet'
	  || x_ratio > y_ratio && this.meetOrSlice === 'slice') {
		return this.getMatrix( matrix, this.width, windowWidth, y_ratio, this.alignX );
	}
	if ( x_ratio > y_ratio && this.meetOrSlice === 'meet'
	  || x_ratio < y_ratio && this.meetOrSlice === 'slice' ) {
		return this.getMatrix( matrix, this.height, windowHeight, x_ratio, this.alignY );
	}
	return matrix.scale( x_ratio );
}

/*****
*
*   get/set methods
*
*****/

/*****
*
*   setPAR
*
*****/
ViewBox.prototype.setPAR = function( PAR ) {
	// NOTE: This function needs to use default values when encountering
	// unrecognized values
	if ( PAR ) {
		let params = PAR.split(/\s+/)[0];
		let align  = params[0];

		if ( align === 'none' ) {
			this.alignX = this.alignY = 'none';
		} else {
			this.alignX = align.substring( 1, 4 );
			this.alignY = align.substring( 5, 9 );
		}
		this.meetOrSlice = params[1] ?? 'meet';
	} else {
		this.align  = 'xMidYMid';
		this.alignX = this.alignY = 'Mid';
		this.meetOrSlice = 'meet';
	}
};

