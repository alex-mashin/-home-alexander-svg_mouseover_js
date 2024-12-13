// javascript contributed by Jamie Echlin
//
debug = true;

SVGDocument = null;
var svgRoot;


ChartHeight = 150;
ChartWidth  = 250;

XArray = new Array();
YArray = new Array();
Elements = new Array();

MaxX = 0;
MaxY = 0;

ParentGroup = null;
Grandparent = null;
ChartLine = null;

Removed = false;
var viewBox;
var tbox;
var text;

const init = LoadEvent => {
	SVGDocument = LoadEvent.target().getOwnerDocument();
	svgRoot     = SVGDocument.documentElement;
	viewBox     = new ViewBox( svgDocument.documentElement );
}

function DisplayInfo (evt, Text) {

    
    if ( window.SVGDocument == null )
        SVGDocument = evt.target.ownerDocument;

    var data = SVGDocument.createTextNode(Text);

	
	var rect   = evt.currentTarget;
	var CTM    = getTransformToElement(rect);

	var iCTM   = CTM.inverse();
	var trans  = svgRoot.getCurrentTranslate();
	var scale  = svgRoot.getCurrentScale();
	var m      = viewBox.getTM();
	var p1     = svgRoot.createSVGPoint();
	var p2, p3;

	m = m.scale( 1/scale );
	m = m.translate(-trans.x, -trans.y);
	
	p1.x = evt.clientX;
	p1.y = evt.clientY;
	
	p2 = p1.matrixTransform(m);
	p3 = p2.matrixTransform(iCTM);


    tbox = SVGDocument.createElement ( "rect");
    tbox.setAttribute ("style", "fill:blue;stroke:pink;stroke-width:1;fill-opacity:.4;stroke-opacity:0.9");
    text = SVGDocument.createElement ( "text");

    //////////////////////
    //// BOX LOCATION ////
    //////////////////////

    //////// Use the following code to get blue box fixed near window top left.. not as nice as near pointer, but
    //////// not influenced by picture "size" and always visible..  (scg 6/22/04)
    tbox.setAttribute ("x", 10 ); tbox.setAttribute ("y", 10 );
    text.setAttribute ("x", 10 ); text.setAttribute ("y", 24 );

    //////// (Original) uncomment the following code to get blue box near pointer.. but only
    ////////  works if pre-browser size is 6"-10" or so in both dimensions..
    // text.setAttribute ("x", Math.round(p3.x*100) / 100 - 20); text.setAttribute ("y", Math.round(p3.y*100) / 100 - 16);
    // tbox.setAttribute ("x", Math.round(p3.x*100) / 100 - 20); tbox.setAttribute ("y", Math.round(p3.y*100) / 100 - 30);



    ////////////////////////////
    //// BOX WIDTH & HEIGHT ////
    ////////////////////////////
    tbox.setAttribute ("width", 180);
    tbox.setAttribute ("height", 20);


    ////////////////////////////
    //// TEXT ATTRIBUTES  ////
    ////////////////////////////
    text.setAttribute ("font-size", 10);
    text.setAttribute ("fill", "white");
    text.setAttribute ("text-anchor", "start");
    
    tbox.appendChild(text);

    text.appendChild(data);
    SVGDocument.documentElement.appendChild(tbox);
    SVGDocument.documentElement.appendChild(text);
}


/*****
*
*   getTransformToElement
*
*****/
function getTransformToElement(node) {
    // Initialize our node's Current Transformation Matrix
    var CTM = node.getCTM();

    // Work our way bacwards through the ancestor nodes stopping at the
    // SVG Document
    while ( ( node = node.parentNode ) != svgDocument ) {
        // Multiply the new CTM with what we've accumulated so far
        CTM = node.getCTM().multiply(CTM);
    }
    
    return CTM;
}

function RemoveInfo () {
	SVGDocument.documentElement.removeChild (tbox);
	SVGDocument.documentElement.removeChild (text);
}
