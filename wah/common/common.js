
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}

function makeStruct(names) {
    names = names.split(' ');
    var count = names.length;

    function constructor() {
      for (var i = 0; i < count; i++) {
        this[names[i]] = arguments[i];
      }
    }
    return constructor;
}

function getFunctionFromString(functionName, context /*, args */) {
    var args = [].slice.call(arguments).splice(2);
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func];
}

function lerp(min, max, f) {
    return ((Number(max) - Number(min))*Number(f)) + Number(min);
}

function smoothLerp(min, max, f) {
    f = t = f*f*f * (f * (6*f - 15) + 10);
    return ((Number(max) - Number(min))*Number(f)) + Number(min);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function isInteger(x) {
        return x % 1 === 0;
}

function roundToAtLeastNDecimalPlaces(value, nDecimalPlaces) {
    if (isInteger(value))
        return parseFloat(Math.round(value * 100) / 100).toFixed(nDecimalPlaces);
    else
        return value;  
}

function roundToMaxNDecimalPlaces(value, maxDecimalPlaces) {
    var numDecimalPlaces = decimalPlaces(value);
    if (numDecimalPlaces > maxDecimalPlaces)
        numDecimalPlaces = maxDecimalPlaces;
    
    var valout = parseFloat(value).toFixed(numDecimalPlaces);
 
    return valout; 
}

function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

function isCordovaApp() {
    var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
        return true;
    } else {
        return false;
    }  
}

function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

function secondsToHMS24(seconds) {
    return moment((seconds * 1000)).format("HH:mm:ss").toUpperCase();  
}

function secondsToHM24(seconds) {
    return moment((seconds * 1000)).format("HH:mm").toUpperCase();   
}

function secondsToHMS12(seconds) {
    return moment((seconds * 1000)).format("h:mm:ss a").toUpperCase();    
}

function secondsToHM12(seconds) {
    return moment((seconds * 1000)).format("h:mm a").toUpperCase();   
}

function isValidHMS24(timeString)
{
    timeString = String(timeString);
    var pattern = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeString.match(pattern))
        return false;
    return true;
}

function isValidHM24(timeString)
{
    timeString = String(timeString);
    var pattern = /^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/;
    if (!timeString.match(pattern))
        return false;
    return true;
}

function isValidHMS12(timeString)
{
    timeString = String(timeString);
    var pattern = /^(0?[1-9]|1[012])(:[0-5]\d)(:[0-5]\d) [APap][mM]$/;
    if (!timeString.match(pattern))
        return false;
    return true;
}

function isValidHM12(timeString)
{
    timeString = String(timeString);
    var pattern = /^(0?[1-9]|1[012])(:[0-5]\d) [APap][mM]$/;
    if (!timeString.match(pattern))
        return false;
    return true;
}

function HMSToSeconds24(str) {
    var p = str.split(':'),
        s = 0, m = 1;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

function HMToSeconds24(str) {
    var p = str.split(':'),
        s = 0, m = 60;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
}

function HMSToSeconds12(str) {
    var p1 = str.split(' ');
    if (p1.length < 2)
        return 0;
    var p2 = p1[0].split(':'),
        s = 0, m = 1;

    var hours=0;
    if (p2.length > 0)
        hours = parseInt(p2[0], 10);
    
    while (p2.length > 0) {
        s += m * parseInt(p2.pop(), 10);
        m *= 60;
    }
    if ((p1[1] === "PM" && hours < 12) || (hours >= 12 && p1[1] === "AM"))
        s += (60*60*12);
    return s;
}

function HMToSeconds12(str) {
    var p1 = str.split(' ');
    if (p1.length < 2)
        return 0;
    var p2 = p1[0].split(':'),
        s = 0, m = 60;
    var hours=0;
    if (p2.length > 0)
        hours = parseInt(p2[0], 10);

    while (p2.length > 0) {
        s += m * parseInt(p2.pop(), 10);
        m *= 60;
    }
    if ((p1[1] === "PM" && hours < 12) || (hours >= 12 && p1[1] === "AM"))
        s += (60*60*12);   
    return s;
}

// Function that forces scroll to top.
function scrollToTop() {
    $('body').css('height', 'auto');
    // Successfully scroll back to top
    $('body').scrollTop(0);
    // Remove javascript added styles
    $('body').css('height', '');
}

function getTextCaretPosition(input, selectionStart, selectionEnd, debug) {
    // Basic parameter validation
    if(!input || !('value' in input)) return input;
    if(typeof selectionStart == "string") selectionStart = parseFloat(selectionStart);
    if(typeof selectionStart != "number" || isNaN(selectionStart)) {
        selectionStart = 0;
    }
    if(selectionStart < 0) selectionStart = 0;
    else selectionStart = Math.min(input.value.length, selectionStart);
    if(typeof selectionEnd == "string") selectionEnd = parseFloat(selectionEnd);
    if(typeof selectionEnd != "number" || isNaN(selectionEnd) || selectionEnd < selectionStart) {
        selectionEnd = selectionStart;
    }
    if (selectionEnd < 0) selectionEnd = 0;
    else selectionEnd = Math.min(input.value.length, selectionEnd);
    
    // If available (thus IE), use the createTextRange method
    if (typeof input.createTextRange == "function") {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveStart('character', selectionStart);
        range.moveEnd('character', selectionEnd - selectionStart);
        return range.getBoundingClientRect();
    }
    // createTextRange is not supported, create a fake text range
    var offset = getInputOffset(),
        topPos = offset.top,
        leftPos = offset.left,
        width = 1000;
        height = getInputCSS('height', true);

        // Styles to simulate a node in an input field
    var cssDefaultStyles = "white-space:pre;padding:0;margin:0;",
        listOfModifiers = ['direction', 'font-family', 'font-size', 'font-size-adjust', 'font-variant', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-align', 'text-indent', 'text-transform', 'word-wrap', 'word-spacing'];

    topPos += getInputCSS('padding-top', true);
    topPos += getInputCSS('border-top-width', true);
    leftPos += getInputCSS('padding-left', true);
    leftPos += getInputCSS('border-left-width', true);
    leftPos += 1; //Seems to be necessary

    for (var i=0; i<listOfModifiers.length; i++) {
        var property = listOfModifiers[i];
        cssDefaultStyles += property + ':' + getInputCSS(property) +';';
    }
    // End of CSS variable checks

    var text = input.value,
        textLen = text.length,
        fakeClone = document.createElement("div");
    if(selectionStart > 0) appendPart(0, selectionStart);
    var fakeRange = appendPart(selectionStart, selectionEnd);
    if(textLen > selectionEnd) appendPart(selectionEnd, textLen);

    // Styles to inherit the font styles of the element
    fakeClone.style.cssText = cssDefaultStyles;    
    // Styles to position the text node at the desired position
    fakeClone.style.position = "absolute";
    fakeClone.style.top = topPos + "px";
    fakeClone.style.left = leftPos + "px";
    fakeClone.style.width = width + "px";
    fakeClone.style.height = height + "px";
    document.body.appendChild(fakeClone);
    var returnValue = fakeRange.getBoundingClientRect(); //Get rect
    if (!debug) fakeClone.parentNode.removeChild(fakeClone); //Remove temp

    var inputWidth = getInputCSS('width', true);
    if (returnValue.right > (inputWidth)) {
        // scroll text box to end if caret is beyond width of input box
        input.scrollLeft = input.scrollWidth;
        return inputWidth;
    }        
    return returnValue.right;

    // Local functions for readability of the previous code
    function appendPart(start, end){
        var span = document.createElement("span");
        span.style.cssText = cssDefaultStyles; //Force styles to prevent unexpected results
        span.textContent = text.substring(start, end);        
        fakeClone.appendChild(span);
        return span;
    }
    // Computing offset position
    function getInputOffset(){
        return {
            top : 0,
            left: 0};
    }
    function getInputCSS(prop, isnumber){
        var val = document.defaultView.getComputedStyle(input, null).getPropertyValue(prop);
        return isnumber ? parseFloat(val) : val;
    }
}

function detectIOS() {
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}
/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
  var ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
  
  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
  
  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
  
  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    var rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

function webglAvailable() {
    try {
        var canvas = document.createElement("canvas");
        return !!
            window.WebGLRenderingContext && 
            (canvas.getContext("webgl") || 
                canvas.getContext("experimental-webgl"));
    } catch(e) { 
        return false;
    } 
}

function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}