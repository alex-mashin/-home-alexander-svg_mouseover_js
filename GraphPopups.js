// javascript contributed by Jamie Echlin
//
let debug = true;

let svgDocument = null;
let svgRoot;


let ChartHeight = 150;
let ChartWidth  = 250;

let XArray = [];
let YArray = [];
let Elements = [];

let MaxX = 0;
let MaxY = 0;

let ParentGroup = null;
let Grandparent = null;
let ChartLine = null;

let Removed = false;
let viewBox;
let tbox;
let text;

const init = LoadEvent => {
	svgDocument	= LoadEvent.target.ownerDocument;
	svgRoot		= LoadEvent.target;
	viewBox		= new ViewBox( svgRoot );
}

function DisplayInfo( evt, Text ) {
	
	if ( svgDocument === null )
		svgDocument = evt.target.ownerDocument;

	let rect	= evt.currentTarget;
	let CTM		= getTransformToElement( rect );

	let iCTM	= CTM.inverse();
	let trans	= svgRoot.currentTranslate;
	let scale	= svgRoot.currentScale;
	let m		= viewBox.getTM();
	let p1		= svgRoot.createSVGPoint();
	let p2, p3;

	m = m.scale( 1 / scale );
	m = m.translate( -trans.x, -trans.y );
	
	p1.x = evt.clientX;
	p1.y = evt.clientY;
	
	p2 = p1.matrixTransform( m );
	p3 = p2.matrixTransform( iCTM );


	tbox = svgDocument.createElement( 'rect' );
	tbox.setAttribute( 'style', 'fill: blue; stroke: pink; stroke-width: 1; fill-opacity: .4; stroke-opacity: 0.9' );
	text = svgDocument.createElement( 'text' );

	//////////////////////
	//// BOX LOCATION ////
	//////////////////////

	//////// Use the following code to get blue box fixed near window top left.. not as nice as near pointer, but
	//////// not influenced by picture "size" and always visible..  (scg 6/22/04)
	tbox.setAttribute( 'x', 10 );
	tbox.setAttribute( 'y', 10 );
	text.setAttribute( 'x', 10 );
	text.setAttribute( 'y', 24 );

	//////// (Original) uncomment the following code to get blue box near pointer.. but only
	////////  works if pre-browser size is 6"-10" or so in both dimensions..
	// text.setAttribute ("x", Math.round(p3.x*100) / 100 - 20); text.setAttribute ("y", Math.round(p3.y*100) / 100 - 16);
	// tbox.setAttribute ("x", Math.round(p3.x*100) / 100 - 20); tbox.setAttribute ("y", Math.round(p3.y*100) / 100 - 30);



	////////////////////////////
	//// BOX WIDTH & HEIGHT ////
	////////////////////////////
	tbox.setAttribute( 'width', 180 );
	tbox.setAttribute( 'height', 20 );


	////////////////////////////
	//// TEXT ATTRIBUTES    ////
	////////////////////////////
	text.setAttribute( 'font-size', 10 );
	text.setAttribute( 'fill', 'white' );
	text.setAttribute( 'text-anchor', 'start' );
	
	tbox.appendChild( text );

	let data = svgDocument.createTextNode( Text );
	text.appendChild( data );
	svgRoot.documentElement.appendChild( tbox );
}


/*****
*
*   getTransformToElement
*
*****/
function getTransformToElement( node ) {
	// Initialize our node's Current Transformation Matrix
	let CTM = node.getCTM();

	// Work our way backwards through the ancestor nodes stopping at the SVG Document:
	while ( ( node = node.parentNode ).getCTM ) {
		// Multiply the new CTM with what we've accumulated so far:
		CTM = node.getCTM().multiply( CTM );
	}
	
	return CTM;
}

function RemoveInfo () {
	svgRoot.documentElement.removeChild( tbox );
}
