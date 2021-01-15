/* Author:  Rustem Memet (rustem@hotmail.co.jp)
 * Version: 1.1.1 (2015/06/11)
 * License: GPL
 */


var BASELEN = 256;

var WDBEG = 0;
var INBEG = 1;
var NOBEG = 2;

var CHEE  = 0x0686;
var GHEE  = 0x063A;
var NGEE  = 0x06AD;
var SHEE  = 0x0634;
var SZEE  = 0x0698;
var LA    = 0xFEFB;
var _LA   = 0xFEFC;
var HAMZA = 0x0626;
var RCQUOTE = 0x2019; 
var RCODQUOTE = 0x201C;
var RCCDQUOTE = 0x201D;

var PRIMe = 233; // 'e 
var PRIME = 201; // 'E 
var COLo  = 246; // :o 
var COLO  = 214; // :O 
var COLu  = 252; // :u 
var COLU  = 220; // :U 

// start and end points for Arabic basic range
var BPAD = 0x0600;
var BMAX = 0x06FF;
var EPAD = 0xFB00; // presentation form region (extented region)
var EMAX = 0xFEFF;
var CPAD = 0x0400; // cyrillic
var CMAX = 0x04FF; // cyrillic

var cm = new Array(BASELEN);
var cmapinv = new Array(BASELEN);
var pform = new Array(BASELEN);

var cyrmap = new Array(BASELEN);
var cyrmapinv = new Array(BASELEN);

var pf2basic = new Array(EMAX-EPAD);

var imode = 0; // input mode, default is Uyghur
var qmode = 0; // quote mode, 0 for opening, 1 for closing

var km = new Array ( 128 ); // keymap

// right and left quotes in Uyghur
var OQUOTE = 0x00AB; // for opening quote (oh quote)
var CQUOTE = 0x00BB; // for closing quote 
var BPAD = 0x0600;

function do_convert(sf,df) {
   var sf = sf; 
   var df = df; 

   var s = document.getElementsByTagName("BODY")[0].innerHTML;
   var str = "";

   if ( sf == df ) {
      set_dest_text(s);
      return;
   }

   str = to_unicode(sf, s);
   str = from_unicode(df, str);
   str = str.replace(/rtl/gi,"ltr");
   str = str.replace(/right/gi,"left");
   str = '<div style="direction:ltr;text-align:justify;">'+str+'</div>'
   document.getElementsByTagName("BODY")[0].innerHTML = str;
}

function to_unicode ( from, str ) {
   if ( from == 'unicode' ) {
      return str;
   } else if ( from == 'uly' ) {
      return uly2uy(str);
   } else if ( from == 'unipf' ) {
      return pf2br(str);
   } else if ( from == 'cyrillic' ) {
      return cyr2uy(str);
   } else if ( from == 'ak' ) {
      return ak2uni(str);
   }
}

function from_unicode ( to, str ) {
   if ( to == 'unicode' ) {
      return str;
   } else if ( to == 'unipf' ) {
      return br2pf(str); 
   } else if ( to == 'uly' ) {
      var s = uy2uly(str);
      s = uly2upper(s);
      return s;
   } else if ( to == 'cyrillic' ) {
      return uy2cyr(str);
   }
}

// make the first letters of sentences upper case
function uly2upper ( s ) {
   var up = true;
   var t, prev, u;

   if ( ! s || s.length == 0 ) {
      return "";
   }

   var arr = new Array( s.length ) ;

   for ( var i = 0; i < s.length ; i++ ) {
      t = s.charAt(i); 
      l = t.toLowerCase(); 
      u = t.toUpperCase(); 

      if ( l != u && up ) { // if character has upper case and upper case is requested
         arr[i] = u; 
         up = false;
      } else { // everything else
         arr[i] = t;

         if ( t == '?' || t == '!' || t == '\n' ) { // mark next letter to be in upper case for sentence ending marks.
            up = true;
         } else if ( t == ' ' && prev == '.' ) {
            up = true;
         }
      }

      prev = t;
   }

   return arr.join('');
}

function set_dest_text ( str ) {
   var d = document.getElementById('dtext');
   var f = document.getElementById('dform');
   var dform = 'text';

   if ( !d ) {
      return;
   }

   if ( f ) {
      dform = f.options[f.selectedIndex].value;
   }

   if ( dform == 'hex' ) {
      d.className = 'nonugbox';
      d.value = getNCR(str, 'hex'); 
   } else if ( dform == 'dec' ) {
      d.className = 'nonugbox';
      d.value = getNCR(str, 'dec'); 
   } else {
      var df = get_dest_value(); 
      if ( df == 'unicode' || df == 'unipf' ) {
         d.className = 'ugbox';
      } else {
         d.className = 'nonugbox';
      }
      d.value = str;
   }
}

function getNCR ( str, type ) {
   var tmp = "" ;
   var i, code, ch ;

   for ( i = 0 ; i < str.length ; i++ ) {
      code = str.charCodeAt(i) ;
      ch   = str.charAt(i) ;
      if ( code > 128 ) {
        if ( type == 'hex' ) {
           tmp += "&#X" + hex_from_dec(code) + ";" ;
        } else {
           tmp += "&#" + code + ";" ;
        }
      } else {
        tmp += ch; 
      }
   }

   return tmp ;
}

function hex_from_dec(num) {
    if (num > 65535) { return ("err!") }

    first = Math.round(num/4096 - 0.5);
    temp1 = num - first * 4096;
    second = Math.round(temp1/256 -0.5);
    temp2 = temp1 - second * 256;
    third = Math.round(temp2/16 - 0.5);
    fourth = temp2 - third * 16;

    return (""+getletter(first)+getletter(second)+getletter(third)+getletter(fourth));
}

function getletter(num) {
  if (num < 10) {
     return num;
  } else {
     if (num == 10) { return "a" }
     if (num == 11) { return "b" }
     if (num == 12) { return "c" }
     if (num == 13) { return "d" }
     if (num == 14) { return "e" }
     if (num == 15) { return "f" }
  }
}

function selchange(src)
{
   var s = document.getElementById(src);
   var d;

   if ( src == 'src' ) {
      d = document.getElementById('stext');
   } else if ( src == 'dest' ) {
      d = document.getElementById('dtext');
      if (d) {
         d.value = "";
      }
   }

   if ( !s || !d ) {
      return;
   }

   var sv = s.options[s.selectedIndex].value;

   if ( sv == 'unicode' || sv == 'unipf' ) {
      d.className = 'ugbox';

      if ( src == 'src' ) {
         imode = 0;
      }
   } else {
      d.className = 'nonugbox';
      if ( src == 'src' ) {
         imode = 1;
      }
   }
}

function get_src_value()
{
   var src = "uly";
   var d = document.getElementById("src");

   if ( d ) {
      src = d.options[d.selectedIndex].value;
   }

   return src;
}

function get_dest_value()
{
   var dest = "unicode";
   var d = document.getElementById("dest");

   if ( d ) {
      dest = d.options[d.selectedIndex].value;
   }

   return dest;
}

function CM(x) {
  return cm[gac(x)]-BPAD;
}

function Syn ( i, b, m, e, bt )
{
   this.iform = i ;
   this.bform = b ;
   this.mform = m ;
   this.eform = e ;
   this.btype = bt ;
}

// returns a char code for a given character
function gac ( ascii )
{
   var str = "" + ascii;
   return str.charCodeAt(0);
}

// returns a string from a given char code
function gas ( code )
{
   return String.fromCharCode(code);
}

var pfinited = 0 ;  // flag for initialization of presentation form

// initialize the charmap and its inverse tables
function pfinit ( )
{
   pfinited = true ;
   var wc; 
   var i;
  
   // zero-out all entries first
   for ( i = 0; i < cm.length; i++ ) {
     cm[i] = 0;
   }
  
   cm[gac('a')] = 0x0627;
   cm[gac('b')] = 0x0628;
   cm[gac('c')] = 0x0643;
   cm[gac('d')] = 0x062F;
   cm[gac('e')] = 0x06D5;
   cm[gac('f')] = 0x0641;
   cm[gac('g')] = 0x06AF;
   cm[gac('h')] = 0x06BE;
   cm[gac('i')] = 0x0649;
   cm[gac('j')] = 0x062C;
   cm[gac('k')] = 0x0643;
   cm[gac('l')] = 0x0644;
   cm[gac('m')] = 0x0645;
   cm[gac('n')] = 0x0646;
   cm[gac('o')] = 0x0648;
   cm[gac('p')] = 0x067E;
   cm[gac('q')] = 0x0642;
   cm[gac('r')] = 0x0631;
   cm[gac('s')] = 0x0633;
   cm[gac('t')] = 0x062A;
   cm[gac('u')] = 0x06C7;
   cm[gac('v')] = 0x06CB;
   cm[gac('w')] = 0x06CB;
   cm[gac('x')] = 0x062E;
   cm[gac('y')] = 0x064A;
   cm[gac('z')] = 0x0632;
  
   cm[PRIMe] = 0x06D0; // 'e
   cm[PRIME] = 0x06D0; // 'E
   cm[COLo]  = 0x06C6; // :o
   cm[COLO]  = 0x06C6; // :O
   cm[COLu]  = 0x06C8; // :u
   cm[COLU]  = 0x06C8; // :U
  
   for ( i = 0; i < cm.length; i++ ) {
     if ( cm[i] != 0 ) {
       var u = gac(gas(i).toUpperCase());
       if ( cm[u] == 0 ) {
         cm[u] = cm[i];
       }
     }
   }
  
   // Uyghur punctuation marks
   cm[gac(';')] = 0x061B;
   cm[gac('?')] = 0x061F;
   cm[gac(',')] = 0x060C;
  
   for ( i = 0 ; i < cmapinv.length ; i++ ) {
      wc = cm[i] ;
      if ( wc != 0 ) {
         cmapinv [ wc - BPAD ] = i ;
      }
   }
  
   // S new_syn ( wchar_t i, wchar_t b, wchar_t m, wchar_t e, begtype bt ) ;
  
   for ( i = 0 ; i < pform.length ; i++ ) {
      pform[i] = null ;
   }
  
   pform[ CM('a') ]    = new Syn ( 0xFE8D, 0xFE8D, 0xFE8D, 0xFE8E, WDBEG ) ;
   pform[ CM('e') ]    = new Syn ( 0xFEE9, 0xFEE9, 0xFEE9, 0xFEEA, WDBEG ) ;
   pform[ CM('b') ]    = new Syn ( 0xFE8F, 0xFE91, 0xFE92, 0xFE90, NOBEG ) ;
   pform[ CM('p') ]    = new Syn ( 0xFB56, 0xFB58, 0xFB59, 0xFB57, NOBEG ) ;
   pform[ CM('t') ]    = new Syn ( 0xFE95, 0xFE97, 0xFE98, 0xFE96, NOBEG ) ;
   pform[ CM('j') ]    = new Syn ( 0xFE9D, 0xFE9F, 0xFEA0, 0xFE9E, NOBEG ) ;
   pform[ CHEE-BPAD ]  = new Syn ( 0xFB7A, 0xFB7C, 0xFB7D, 0xFB7B, NOBEG ) ;
   pform[ CM('x') ]    = new Syn ( 0xFEA5, 0xFEA7, 0xFEA8, 0xFEA6, NOBEG ) ;
   pform[ CM('d') ]    = new Syn ( 0xFEA9, 0xFEA9, 0xFEAA, 0xFEAA, INBEG ) ;
   pform[ CM('r') ]    = new Syn ( 0xFEAD, 0xFEAD, 0xFEAE, 0xFEAE, INBEG ) ;
   pform[ CM('z') ]    = new Syn ( 0xFEAF, 0xFEAF, 0xFEB0, 0xFEB0, INBEG ) ;
   pform[ SZEE-BPAD ]  = new Syn ( 0xFB8A, 0xFB8A, 0xFB8B, 0xFB8B, INBEG ) ;
   pform[ CM('s') ]    = new Syn ( 0xFEB1, 0xFEB3, 0xFEB4, 0xFEB2, NOBEG ) ;
   pform[ SHEE-BPAD ]  = new Syn ( 0xFEB5, 0xFEB7, 0xFEB8, 0xFEB6, NOBEG ) ;
   pform[ GHEE-BPAD ]  = new Syn ( 0xFECD, 0xFECF, 0xFED0, 0xFECE, NOBEG ) ;
   pform[ CM('f') ]    = new Syn ( 0xFED1, 0xFED3, 0xFED4, 0xFED2, NOBEG ) ;
   pform[ CM('q') ]    = new Syn ( 0xFED5, 0xFED7, 0xFED8, 0xFED6, NOBEG ) ;
   pform[ CM('k') ]    = new Syn ( 0xFED9, 0xFEDB, 0xFEDC, 0xFEDA, NOBEG ) ;
   pform[ CM('g') ]    = new Syn ( 0xFB92, 0xFB94, 0xFB95, 0xFB93, NOBEG ) ;
   pform[ NGEE-BPAD ]  = new Syn ( 0xFBD3, 0xFBD5, 0xFBD6, 0xFBD4, NOBEG ) ;
   pform[ CM('l') ]    = new Syn ( 0xFEDD, 0xFEDF, 0xFEE0, 0xFEDE, NOBEG ) ;
   pform[ CM('m') ]    = new Syn ( 0xFEE1, 0xFEE3, 0xFEE4, 0xFEE2, NOBEG ) ;
   pform[ CM('n') ]    = new Syn ( 0xFEE5, 0xFEE7, 0xFEE8, 0xFEE6, NOBEG ) ;
   //pform[ CM('h') ]    = new Syn ( 0xFEEB, 0xFEEB, 0xFEEC, 0xFEEC, NOBEG ) ;
   pform[ CM('h') ]    = new Syn ( 0xFBAA, 0xFBAA, 0xFBAD, 0xFBAD, NOBEG ) ;
   pform[ CM('o') ]    = new Syn ( 0xFEED, 0xFEED, 0xFEEE, 0xFEEE, INBEG ) ;
   pform[ CM('u') ]    = new Syn ( 0xFBD7, 0xFBD7, 0xFBD8, 0xFBD8, INBEG ) ;
   pform[ CM('w') ]    = new Syn ( 0xFBDE, 0xFBDE, 0xFBDF, 0xFBDF, INBEG ) ;
   pform[ CM('i') ]    = new Syn ( 0xFEEF, 0xFBE8, 0xFBE9, 0xFEF0, NOBEG ) ;
   pform[ CM('y') ]    = new Syn ( 0xFEF1, 0xFEF3, 0xFEF4, 0xFEF2, NOBEG ) ;
   pform[ HAMZA-BPAD ] = new Syn ( 0xFE8B, 0xFE8B, 0xFE8C, 0xFB8C, NOBEG ) ;
   pform[ cm[COLo]-BPAD]   = new Syn ( 0xFBD9, 0xFBD9, 0xFBDA, 0xFBDA, INBEG ) ;
   pform[ cm[COLu]-BPAD ]   = new Syn ( 0xFBDB, 0xFBDB, 0xFBDC, 0xFBDC, INBEG ) ;
   pform[ cm[PRIMe]-BPAD ]  = new Syn ( 0xFBE4, 0xFBE6, 0xFBE7, 0xFBE5, NOBEG ) ;

   for ( i = 0; i < pf2basic.length; i++ ) {
      pf2basic[i] = new Array(2);
   }

   var lig;
   // initialize presentation form to basic region mapping
   for (i = 0; i < pform.length; i++) {
      lig = pform[i];
      if (lig != null) {
          pf2basic[lig.iform - EPAD][0] = i + BPAD;
          pf2basic[lig.bform - EPAD][0] = i + BPAD;
          pf2basic[lig.mform - EPAD][0] = i + BPAD;
          pf2basic[lig.eform - EPAD][0] = i + BPAD;
      }
   }

   // the letter 'h' has some other mappings
   pf2basic[0xFEEB - EPAD][0] = cm[gac('h')];
   pf2basic[0xFEEC - EPAD][0] = cm[gac('h')];

   // joint letter LA and _LA
   pf2basic[0xFEFB - EPAD][0] = cm[gac('l')];
   pf2basic[0xFEFB - EPAD][1] = cm[gac('a')];
   pf2basic[0xFEFC - EPAD][0] = cm[gac('l')];
   pf2basic[0xFEFC - EPAD][1] = cm[gac('a')];

   // joint letter AA, AE, EE, II, OO, OE, UU, UE
   // AA, _AA
   pf2basic[0xFBEA - EPAD][0] = HAMZA;
   pf2basic[0xFBEA - EPAD][1] = cm[gac('a')];
   pf2basic[0xFBEB - EPAD][0] = HAMZA;
   pf2basic[0xFBEB - EPAD][1] = cm[gac('a')];

   // AE, _AE
   pf2basic[0xFBEC - EPAD][0] = HAMZA;
   pf2basic[0xFBEC - EPAD][1] = cm[gac('e')];
   pf2basic[0xFBED - EPAD][0] = HAMZA;
   pf2basic[0xFBED - EPAD][1] = cm[gac('e')];

   // EE, _EE, _EE_
   pf2basic[0xFBF6 - EPAD][0] = HAMZA;
   pf2basic[0xFBF6 - EPAD][1] = cm[PRIMe];
   pf2basic[0xFBF7 - EPAD][0] = HAMZA;
   pf2basic[0xFBF7 - EPAD][1] = cm[PRIMe];
   pf2basic[0xFBF8 - EPAD][0] = HAMZA;
   pf2basic[0xFBF8 - EPAD][1] = cm[PRIMe];
   pf2basic[0xFBD1 - EPAD][0] = HAMZA;
   pf2basic[0xFBD1 - EPAD][1] = cm[PRIMe];

   // II, _II, _II_
   pf2basic[0xFBF9 - EPAD][0] = HAMZA;
   pf2basic[0xFBF9 - EPAD][1] = cm[gac('i')];
   pf2basic[0xFBFA - EPAD][0] = HAMZA;
   pf2basic[0xFBFA - EPAD][1] = cm[gac('i')];
   pf2basic[0xFBFB - EPAD][0] = HAMZA;
   pf2basic[0xFBFB - EPAD][1] = cm[gac('i')];

   // OO, _OO
   pf2basic[0xFBEE - EPAD][0] = HAMZA;
   pf2basic[0xFBEE - EPAD][1] = cm[gac('o')];
   pf2basic[0xFBEF - EPAD][0] = HAMZA;
   pf2basic[0xFBEF - EPAD][1] = cm[gac('o')];

   // OE, _OE
   pf2basic[0xFBF2 - EPAD][0] = HAMZA;
   pf2basic[0xFBF2 - EPAD][1] = cm[COLo];
   pf2basic[0xFBF3 - EPAD][0] = HAMZA;
   pf2basic[0xFBF3 - EPAD][1] = cm[COLo];

   // UU, _UU
   pf2basic[0xFBF0 - EPAD][0] = HAMZA;
   pf2basic[0xFBF0 - EPAD][1] = cm[gac('u')];
   pf2basic[0xFBF1 - EPAD][0] = HAMZA;
   pf2basic[0xFBF1 - EPAD][1] = cm[gac('u')];

   // UE, _UE
   pf2basic[0xFBF4 - EPAD][0] = HAMZA;
   pf2basic[0xFBF4 - EPAD][1] = cm[COLu];
   pf2basic[0xFBF5 - EPAD][0] = HAMZA;
   pf2basic[0xFBF5 - EPAD][1] = cm[COLu];

}

var cyrinited = false;
function cyrinit() {
   cyrinited = true;

   var ch;

   // For Cyrillic. This maps between ULY and Cyrillic.
   for ( i = 0 ; i < cyrmap.length ; i++ ) {
       cyrmap[i] = 0 ;
   }

   for ( i = 0 ; i < cyrmapinv.length ; i++ ) {
       cyrmapinv[i] = 0 ;
   }

   cyrmap[gac('А')-CPAD] = cm[gac('a')] ;
   cyrmap[gac('а')-CPAD] = cm[gac('a')] ;
   cyrmap[gac('Б')-CPAD] = cm[gac('b')] ;
   cyrmap[gac('б')-CPAD] = cm[gac('b')] ;
   cyrmap[gac('Д')-CPAD] = cm[gac('d')] ;
   cyrmap[gac('д')-CPAD] = cm[gac('d')] ;
   cyrmap[gac('Ә')-CPAD] = cm[gac('e')] ;
   cyrmap[gac('ә')-CPAD] = cm[gac('e')] ;
   cyrmap[gac('Ф')-CPAD] = cm[gac('f')] ;
   cyrmap[gac('ф')-CPAD] = cm[gac('f')] ;
   cyrmap[gac('Г')-CPAD] = cm[gac('g')] ;
   cyrmap[gac('г')-CPAD] = cm[gac('g')] ;
   cyrmap[gac('Һ')-CPAD] = cm[gac('h')] ;
   cyrmap[gac('һ')-CPAD] = cm[gac('h')] ;
   cyrmap[gac('И')-CPAD] = cm[gac('i')] ;
   cyrmap[gac('и')-CPAD] = cm[gac('i')] ;
   cyrmap[gac('Җ')-CPAD] = cm[gac('j')] ;
   cyrmap[gac('җ')-CPAD] = cm[gac('j')] ;
   cyrmap[gac('К')-CPAD] = cm[gac('k')] ;
   cyrmap[gac('к')-CPAD] = cm[gac('k')] ;
   cyrmap[gac('Л')-CPAD] = cm[gac('l')] ;
   cyrmap[gac('л')-CPAD] = cm[gac('l')] ;
   cyrmap[gac('М')-CPAD] = cm[gac('m')] ;
   cyrmap[gac('м')-CPAD] = cm[gac('m')] ;
   cyrmap[gac('Н')-CPAD] = cm[gac('n')] ;
   cyrmap[gac('н')-CPAD] = cm[gac('n')] ;
   cyrmap[gac('О')-CPAD] = cm[gac('o')] ;
   cyrmap[gac('о')-CPAD] = cm[gac('o')] ;
   cyrmap[gac('П')-CPAD] = cm[gac('p')] ;
   cyrmap[gac('п')-CPAD] = cm[gac('p')] ;
   cyrmap[gac('Қ')-CPAD] = cm[gac('q')] ;
   cyrmap[gac('қ')-CPAD] = cm[gac('q')] ;
   cyrmap[gac('Р')-CPAD] = cm[gac('r')] ;
   cyrmap[gac('р')-CPAD] = cm[gac('r')] ;
   cyrmap[gac('С')-CPAD] = cm[gac('s')] ;
   cyrmap[gac('с')-CPAD] = cm[gac('s')] ;
   cyrmap[gac('Т')-CPAD] = cm[gac('t')] ;
   cyrmap[gac('т')-CPAD] = cm[gac('t')] ;
   cyrmap[gac('У')-CPAD] = cm[gac('u')] ;
   cyrmap[gac('у')-CPAD] = cm[gac('u')] ;
   cyrmap[gac('В')-CPAD] = cm[gac('v')] ;
   cyrmap[gac('в')-CPAD] = cm[gac('v')] ;
   cyrmap[gac('Х')-CPAD] = cm[gac('x')] ;
   cyrmap[gac('х')-CPAD] = cm[gac('x')] ;
   cyrmap[gac('Й')-CPAD] = cm[gac('y')] ;
   cyrmap[gac('й')-CPAD] = cm[gac('y')] ;
   cyrmap[gac('З')-CPAD] = cm[gac('z')] ;
   cyrmap[gac('з')-CPAD] = cm[gac('z')] ;
   cyrmap[gac('е')-CPAD] = cm[PRIMe] ;
   cyrmap[gac('Е')-CPAD] = cm[PRIMe] ;
   cyrmap[gac('Ө')-CPAD] = cm[COLo] ;
   cyrmap[gac('ө')-CPAD] = cm[COLo] ;
   cyrmap[gac('Ү')-CPAD] = cm[COLu] ;
   cyrmap[gac('ү')-CPAD] = cm[COLu] ;
   cyrmap[gac('Ж')-CPAD] = SZEE ;
   cyrmap[gac('ж')-CPAD] = SZEE ;
   cyrmap[gac('Ғ')-CPAD] = GHEE ;
   cyrmap[gac('ғ')-CPAD] = GHEE ;
   cyrmap[gac('Ң')-CPAD] = NGEE ;
   cyrmap[gac('ң')-CPAD] = NGEE ;
   cyrmap[gac('Ч')-CPAD] = CHEE ;
   cyrmap[gac('ч')-CPAD] = CHEE ;
   cyrmap[gac('Ш')-CPAD] = SHEE ;
   cyrmap[gac('ш')-CPAD] = SHEE ;
   
   
   

   // the inverse of cyrmap table, to speed up lookups (without wasting much space)
   for ( i = 0 ; i < cyrmapinv.length ; i++ )
   {
       ch = cyrmap[i] ;
       if ( ch != 0 )
       {
           cyrmapinv[ch - BPAD] = i ;
       }
   }
}

function pf2br ( pfstr ) 
{
   var ch;
   var i, j;

   if ( !pfinited ) {
      pfinit() ;
   }

   var arr = new Array(pfstr.length * 2);

   j = 0;
   for (i = 0; i < pfstr.length; i++)
   {
      ch = pfstr.charCodeAt(i);

      if ( ch >= EPAD && ch < EMAX && pf2basic[ch - EPAD][0] ) {
         arr[j++] = pf2basic[ch - EPAD][0];

         if (pf2basic[ch - EPAD][1]) {
            arr[j++] = pf2basic[ch - EPAD][1];
         }
      } else {
         arr[j++] = ch;
      }
   }

   for ( i = 0; i < j; i++ ) {
      arr[i] = String.fromCharCode(arr[i]);
   }

   return arr.join('');
}

function br2pf ( br )
{
   var wc, pfwc, prevwc, ppfwc ;
   var i, j, n ;
   var syn, tsyn, lsyn ;

   if ( !pfinited ) {
      pfinit() ;
   }

   if ( typeof(br) != 'string' ) {
      return "";
   }

   pfwp = new Array ( br.length );

   lsyn = pform[ CM('l') ] ;   

   bt = WDBEG ;
   j = 0 ;
   for ( i = 0 ; i < br.length ; i++ ) {
      wc  = br.charCodeAt(i) ;
      if ( BPAD <= wc && wc < BMAX ) {
         syn = pform [ wc - BPAD ] ;

         if ( syn != null ) {
            switch ( bt ) {
               case WDBEG:
                  pfwc = syn.iform ;
                  break ;
               case INBEG:
                  pfwc = syn.iform ;
                  break ;
               case NOBEG:
                  pfwc = syn.eform ;
                  break ;
               default:
                  break ;
            }

            /* previous letter does not ask for word-beginning form,
             * and we have to change it to either medial or beginning form,
             * depending on the previous letter's current form.
             */
            //this means the previous letter was a joinable Uyghur letter
            if ( bt != WDBEG ) { 
               tsyn = pform [ prevwc - BPAD ] ;

               // special cases for LA and _LA
               if ( ppfwc == lsyn.iform && wc == cm[gac('a')] ) {
                  pfwp[j-1] = LA ;
                  bt = WDBEG ;
                  continue ;
               } else if ( ppfwc == lsyn.eform && wc == cm[gac('a')] ) {
                  pfwp[j-1] = _LA ;
                  bt = WDBEG ;
                  continue ;
               }

               // update previous character
               if ( ppfwc == tsyn.iform ) {
                  pfwp[j-1] = tsyn.bform ;
               } else if ( ppfwc == tsyn.eform ) {
                  pfwp[j-1] = tsyn.mform ;
               }
            }
            bt = syn.btype ; // we will need this in next round
         } else { // a non-Uyghur char in basic range
            pfwc = wc ;
            bt = WDBEG ;
         }
      } else { // not in basic Arabic range ( 0x0600-0x06FF )
         pfwc = wc ;
         bt = WDBEG ;
      }

      pfwp[j] = pfwc ;
      ppfwc   = pfwc ; // previous presentation form wide character
      prevwc  = wc ;
      j++ ;
   }

   var str = "";
   for ( i = 0; i < j; i++ ) {
      pfwp[i] = gas(pfwp[i]);
   }

   return pfwp.join('') ;
}

function uy2uly ( str ) {
   var i;
   var j = 0;
   var arr = new Array(str.length * 2);
   var pwc = 0;

   if ( !pfinited ) {
      pfinit();
   }

   for ( i = 0; i < str.length; i++ ) {
      wc = str.charCodeAt(i) ;

      if ( wc == HAMZA ) {
         continue ;
      }

      // first handle Uyghur letters that become joint letters in Latin
      if ( wc == CHEE ) {
         arr[j++] = gac('c');
         arr[j] = gac('h');
      } else if ( wc == GHEE ) {
         arr[j++] = gac('g');
         arr[j] = gac('h');
      } else if ( wc == NGEE ) {
         arr[j++] = gac('n');
         arr[j] = gac('g');
      } else if ( wc == SHEE ) {
         arr[j++] = gac('s');
         arr[j] = gac('h');
      } else if ( wc == SZEE ) {
         arr[j] = gac('j');
      } else if ( BPAD <= wc && wc < BMAX && cmapinv[wc-BPAD] != 0 ) {
         // put an apostrophe between two-consecutive vowels
         if ( is_vowel(pwc) && is_vowel(cmapinv[wc-BPAD]) ) {
            arr[j++] = gac("'");
         }

         arr[j] = cmapinv[wc-BPAD] ;
      } else {
         arr[j] = wc ;
      }

      pwc = arr[j];

      j++ ;
   }

   for ( i = 0; i < j; i++ ) {
      arr[i] = String.fromCharCode(arr[i]);
   }

   return arr.join('');
}

function uy2cyr ( uystr ) {
   var i, j;
   var ch;
   var arr = new Array(uystr.length);

   if ( !pfinited ) {
      pfinit() ;
   }
   
   if ( !cyrinited ) {
      cyrinit();
   }

   var str = uystr.replace(new RegExp('يا', 'g'), "я");
   str = str.replace(new RegExp('يۇ', 'g'), "ю");

   j = 0;
   for ( i = 0; i < str.length; i++ ) {
      ch = str.charCodeAt(i);

      if ( ch == HAMZA ) {
          continue;
      }

      if ( BPAD <= ch && ch < (BPAD+cyrmapinv.length) && cyrmapinv[ch-BPAD]) {
          arr[j++] = CPAD + cyrmapinv[ch-BPAD];
      } else {
          if ( ch == cm[gac('?')] ) {
              arr[j++] = gac('?');
          } else if ( ch == cm[gac(',')] ) {
              arr[j++] = gac(',');
          } else if ( ch == cm[gac(';')] ) {
              arr[j++] = gac(';');
          } else if ( ch == OQUOTE || ch == CQUOTE ) {
              arr[j++] = gac('"');
          } else {
              arr[j++] = ch;
          }
      }
   }

   for ( i = 0; i < j; i++ ) {
      arr[i] = String.fromCharCode(arr[i]);
   }

   return arr.join('');
}

function cyr2uy ( str ) 
{
   if ( !cyrinited ) {
      cyrinit();
   }
   
   var changeQuote = false;
   var putHamza = true;
   var openBrack = true;

   var j;
   var arr = new Array(str.length*2);
   var uch;
   var code;

   j = 0;
   for (i = 0; i < str.length; i++) {
      code = str.charCodeAt(i);

      if (code >= CPAD && code < CMAX && (cyrmap[code-CPAD] || code == gac('Я') 
          || code == gac('я') || code == gac('Ю') || code == gac('ю'))) {
         if ( code == gac('Я') || code == gac('я') ) { // YA in Cyrillic
            arr[j++] = cm[gac('y')];
            arr[j++] = cm[gac('a')];
            putHamza = true;
         } else if ( code == gac('Ю') || code == gac('ю') ) { // YU in Cyrillic
            arr[j++] = cm[gac('y')];
            arr[j++] = cm[gac('u')];
         } else {
            uch = cyrmap[code-CPAD];

            if ( is_uy_vowel(uch) ) { // decide if we should put hamza
               if ( putHamza ) {
                  arr[j++] = HAMZA;
               } else {
                  putHamza = true;
               }
            } else {
               putHamza = false;
            }

            arr[j++] = uch;
         }
      } else { // non-cyrillic letters
         if ( code == gac(',') ) {
            arr[j++] = cm[gac(',')];
         } else if ( code == gac('?') ) {
            arr[j++] = cm[gac('?')];
         } else if ( code == gac(';') ) {
            arr[j++] = cm[gac(';')];
         } else if ( code == gac('"') && changeQuote ) {
            if ( openBrack ) {
               arr[j++] = OQUOTE;
               openBrack = false;
            } else {
               arr[j++] = CQUOTE;
               openBrack = true;
            }
         } else if ( code == RCODQUOTE ) { // opening double curly quote
            if ( changeQuote ) {
               arr[j++] = OQUOTE;
            } else {
               arr[j++] = gac('"');
            }
         } else if ( code == RCCDQUOTE ) { // closing double curly quote
            if ( changeQuote ) {
               arr[j++] = OQUOTE;
            } else {
               arr[j++] = gac('"');
            }
         } else {
            arr[j++] = code;
         }

         // check to to see if we should put hamza before next letter
         if ( code < BPAD || code > BMAX || is_uy_vowel(arr[j-1]) ) {
            putHamza = true;
         }
      }
   }

   for ( i = 0; i < j; i++ ) {
      arr[i] = String.fromCharCode(arr[i]);
   }

   return arr.join('');
}

function is_uy_vowel ( ch ) {
   var s = String.fromCharCode(ch);

   if ( s == 'ا' || s == 'ە' || s == 'ى' || s == 'ې' || 
        s == 'و' || s == 'ۇ' || s == 'ۆ' || s == 'ۈ' ) {
      return true;
   }

   return false;
}

function is_vowel ( ch )
{
   if ( ch == gac('a') || ch == gac('A') || ch == gac('e') || ch == gac('E') ||
        ch == PRIMe || ch == PRIME || ch == gac('i') || ch == gac('I') ||
        ch == gac('o') || ch == gac('O') || ch == COLo || ch == COLO ||
        ch == gac('u') || ch == gac('U') || ch == COLu || ch == COLU ) {
      return true ;
   }

   return false ;
}

// returns a char code for a given character
function gac ( ascii )
{
   var str = "" + ascii;
   return str.charCodeAt(0);
}

// returns a string from a given char code
function gas ( code )
{
   return String.fromCharCode(code);
}

var i;
var inited = false;

function bedit_init ( ) {
  var i;
  if ( inited ) {
    return;
  }

  inited = true;

  // zero-out all entries first
  for ( i = 0; i < km.length; i++ ) {
    km[i] = 0;
  }

  // Uyghur Unicode character map
  km[gac('a')] = 0x06BE;
  km[gac('b')] = 0x0628;
  km[gac('c')] = 0x063A;
  km[gac('D')] = 0x0698;
  km[gac('d')] = 0x062F;
  km[gac('e')] = 0x06D0;
  km[gac('F')] = 0x0641;
  km[gac('f')] = 0x0627;
  km[gac('G')] = 0x06AF;
  km[gac('g')] = 0x06D5;
  km[gac('H')] = 0x062E;
  km[gac('h')] = 0x0649;
  km[gac('i')] = 0x06AD;
  km[gac('J')] = 0x062C;
  km[gac('j')] = 0x0642;
  km[gac('K')] = 0x06C6;
  km[gac('k')] = 0x0643;
  km[gac('l')] = 0x0644;
  km[gac('m')] = 0x0645;
  km[gac('n')] = 0x0646;
  km[gac('o')] = 0x0648;
  km[gac('p')] = 0x067E;
  km[gac('q')] = 0x0686;
  km[gac('r')] = 0x0631;
  km[gac('s')] = 0x0633;
  km[gac('T')] = 0x0640; // space filler character
  km[gac('t')] = 0x062A;
  km[gac('u')] = 0x06C7;
  km[gac('v')] = 0x06C8;
  km[gac('w')] = 0x06CB;
  km[gac('x')] = 0x0634;
  km[gac('y')] = 0x064A;
  km[gac('z')] = 0x0632;
  km[gac('/')] = 0x0626;

  for ( i = 0; i < km.length; i++ ) {
    if ( km[i] != 0 ) {
      var u = gac(gas(i).toUpperCase());
      if ( km[u] == 0 ) {
        km[u] = km[i];
      }
    }
  }
  
  // Uyghur punctuation marks
  km[gac(';')] = 0x061B;
  km[gac('?')] = 0x061F;
  km[gac(',')] = 0x060C;
  km[gac('<')] = 0x203A; // for '‹'
  km[gac('>')] = 0x2039; // for '›'
  km[gac('"')] = OQUOTE;

  // adapt parens, brackets, and braces for right-to-left typing
  km[gac('{')] = gac ( '}' );
  km[gac('}')] = gac ( '{' );
  km[gac('[')] = gac ( ']' );
  km[gac(']')] = gac ( '[' );
  km[gac('(')] = gac ( ')' );
  km[gac(')')] = gac ( '(' );

  // special handling of braces ( "{" and "}" ) for quotation in Uyghur
  km[gac('}')] = 0x00AB;
  km[gac('{')] = 0x00BB;

  // zero-out all entries first
  for ( i = 0; i < cm.length; i++ ) {
    cm[i] = 0;
  }

  cm[gac('a')] = 0x0627;
  cm[gac('b')] = 0x0628;
  cm[gac('c')] = 0x0643;
  cm[gac('d')] = 0x062F;
  cm[gac('e')] = 0x06D5;
  cm[gac('f')] = 0x0641;
  cm[gac('g')] = 0x06AF;
  cm[gac('h')] = 0x06BE;
  cm[gac('i')] = 0x0649;
  cm[gac('j')] = 0x062C;
  cm[gac('k')] = 0x0643;
  cm[gac('l')] = 0x0644;
  cm[gac('m')] = 0x0645;
  cm[gac('n')] = 0x0646;
  cm[gac('o')] = 0x0648;
  cm[gac('p')] = 0x067E;
  cm[gac('q')] = 0x0642;
  cm[gac('r')] = 0x0631;
  cm[gac('s')] = 0x0633;
  cm[gac('t')] = 0x062A;
  cm[gac('u')] = 0x06C7;
  cm[gac('v')] = 0x06CB;
  cm[gac('w')] = 0x06CB;
  cm[gac('x')] = 0x062E;
  cm[gac('y')] = 0x064A;
  cm[gac('z')] = 0x0632;

  cm[PRIMe] = 0x06D0; // 'e
  cm[PRIME] = 0x06D0; // 'E
  cm[COLo]  = 0x06C6; // :o
  cm[COLO]  = 0x06C6; // :O
  cm[COLu]  = 0x06C8; // :u
  cm[COLU]  = 0x06C8; // :U

  for ( i = 0; i < cm.length; i++ ) {
    if ( cm[i] != 0 ) {
      var u = gac(gas(i).toUpperCase());
      if ( cm[u] == 0 ) {
        cm[u] = cm[i];
      }
    }
  }

  // Uyghur punctuation marks
  cm[gac(';')] = 0x061B;
  cm[gac('?')] = 0x061F;
  cm[gac(',')] = 0x060C;
}

function ak2uni ( akstr )
{
  var str = akstr;
  var akdif = String.fromCharCode(0x0622, 0x0623, 0x0624, 0x0626, 0x0629, 0x062B, 0x062D, 0x0630, 0x0635, 0x0636, 0x0638, 0x0649, 0x0639, 0x0647, gac('{'), gac('}'));
  var akuni = String.fromCharCode(0x0698, 0x06C6, 0x06CB, 0x06D0, 0x06D5, 0x06AD, 0x0686, 0x06C7, 0x067E, 0x06AF, 0x0626, 0x06C8, 0x0649, 0x06BE, CQUOTE, OQUOTE);

  for(var i = 0; i < akdif.length; i++ ) {
     str = str.replace(new RegExp(akdif.substr(i,1), "g"), akuni.substr(i,1));
  }

  return str;
}

function uly2uy ( ustr )
{
  var str = "";
  var i, cur, prev, next, ch;
  var ccode, ncode;
  var wdbeg = true;

  var bd = '`';  // beginning delimiter
  var ed = '`';  // ending delimiter

  var verbatim = false;

  var uly = ustr;

  // make URLs verbatim
  var regExp = /(\w+[p|s]:\/\/\S*)/gi;
  uly = uly.replace(regExp, bd + "$1" + ed );

  // URLs without ://
  regExp = /([\s|(]+\w+\.\w+\.\w+\S*)/g;
  uly = uly.replace(regExp, bd + "$1" + ed );

  // two-part URLs with well-known suffixes
  regExp = /([\s|(|,|.]+\w+\.(com|net|org|cn)[\s|)|\.|,|.|$])/g;
  uly = uly.replace(regExp, bd + "$1" + ed );

  // email addresses
  regExp = /(\w+@\w+\.\w[\w|\.]*\w)/g;
  uly = uly.replace(regExp, bd + "$1" + ed );

  if ( !inited ) {
    bedit_init();
  }

  for ( i = 0; i < uly.length; i++ ) {
    ch = 0;
    cur    = uly.charAt(i);
    next   = uly.charAt(i+1);
    ccode  = uly.charCodeAt(i);
    ncode  = uly.charCodeAt(i+1);

    if ( verbatim == true ) {
      if ( cur == ed ) { // ending verbatim mode
        verbatim = false;
      } else {
        str += cur; 
      }
      continue;
    }

    if ( cur == bd ) {
      verbatim = true;
      continue;
    }

    if ( cur == '|' && ( prev == 'u' ) && ( next == 'a' || next == 'e' ) ) {
      wdbeg = false;
      continue;
    }

    // add hamza in front of vowels in word-beginning positions
    if ( wdbeg == true ) {
      if ( isvowel(cur) ) {
        str += gas(HAMZA);
      }
    } else {
      if ( cur == '\'' || ccode == RCQUOTE ) {
        if ( isvowel(next) ) {
          wdbeg = false; // don't add another hamza in next round
          str += gas(HAMZA);
          continue;
        } else if ( isalpha(ncode) ) {
          continue;
        }
      }
    }

    // AA, AE, and non-alpha-numeric letters makes word beginning
    if ( isvowel(cur) || !isalpha(ccode) ) {
      wdbeg = true;
    } else { 
      wdbeg = false;
    }

    switch ( cur ) { // handle joint-letters
      case 'c':
      case 'C':
        if ( next == 'h' || next == 'H' ) {
          ch = CHEE;
        }    
        break;
     case 'g':
     case 'G':
       if ( next == 'h' || next == 'H' ) {
         ch = GHEE;
       }
       break;
     case 'n': 
     case 'N': 
       if ( next == 'g' || next == 'G' ) { 
         tmpch = uly.charAt(i+2); 
         if ( tmpch != 'h' && tmpch != 'H' ) {
           ch = NGEE;
         }
       }
       break;
     case 's':
     case 'S':
       if ( next == 'h' || next == 'H' ) {
         ch = SHEE;
       } else if ( next == 'z' || next == 'Z' ) { // ULY does not provide a unique SZEE, we use 'sz' 
         ch = SZEE;
       }
       break;
     default:
       break;
    }

    if ( ch != 0 ) {
      i++; // advance index for joint letters
      str += gas(ch);
    } else if ( ccode < cm.length && cm[ccode] ) {
      str += gas( cm[ccode] ); // no joint letter, but valid ULY
    } else {
      str += gas(ccode); // non-ULY, return whatever is entered
    }

    prev = cur;
  }

  return str;
}

// isvowel -- returns true if ch is a vowel in Uyghur
function isvowel ( ch )
{
  var code = gac ( ch ); 

  if ( ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u' ||
       ch == 'A' || ch == 'E' || ch == 'I' || ch == 'O' || ch == 'U' ) {
   return true;
  }

  if ( code == PRIMe || code == PRIME || code == COLo ||
     code == COLO || code == COLu || code == COLU ) {
   return true;
  } 

  return false;
}

function isalpha ( code )
{
  if ( (gac('A') <= code && code <= gac('Z')) || (gac('a') <= code && code <= gac('z')) ) {
    return true;
  }
  return false;
}

function AttachEvent(obj, evt, fnc, useCapture){
  if (!useCapture) useCapture = false;

  if (obj.addEventListener) {
    obj.removeEventListener(evt, fnc, useCapture);
    obj.addEventListener(evt, fnc, useCapture);
    return true;
  } else if (obj.attachEvent) {
    obj.detachEvent( "on" + evt, fnc);
    return obj.attachEvent( "on" + evt, fnc);
  }
}

// attach event handlers to textareas and textfields
function attachEvents ( )
{    
  if ( typeof(attachAll)=="undefined" || attachAll == null ) {
     attachAll = false;
  }
  if ( typeof(bedit_allow) != "undefined" && bedit_allow && bedit_allow.length != 0 ) {
    allowed_names = bedit_allow.split ( ':' );
  } else {
    allowed_names = new Array();
  }    
  if ( typeof(bedit_deny) != "undefined" && bedit_deny && bedit_deny.length != 0 ) {
    denied_names = bedit_deny.split ( ':' );
  } else {
    denied_names = new Array();;
  }      
     
  var tas = document.getElementsByTagName("TEXTAREA"); // textareas
  var tfs = document.getElementsByTagName("INPUT"); // input fields

  for ( i = 0; i < tas.length; i++ ) {
    if ( shouldAttach(tas[i].name) ) {
      AttachEvent ( tas[i], 'keypress', naddchar, false );
      AttachEvent ( tas[i], 'keydown', proc_kd, false );
    }
  }

  for ( i = 0; i < tfs.length; i++ ) {
    if ( tfs[i].type.toLowerCase() == "text" && shouldAttach(tfs[i].name)) {
      AttachEvent ( tfs[i], 'keypress', naddchar, false );
      AttachEvent ( tfs[i], 'keydown', proc_kd, false );
    }
  }
}

function shouldAttach ( name )
{
  var j;
  if ( attachAll == true ) {
    for ( j = 0; j < denied_names.length; j++ ) {
      if ( name == denied_names[j] ) {
        return false;
      }
    }
    return true;
  } else { // global attach is disabled, only attach those that are specified
    for ( j = 0; j < allowed_names.length; j++ ) {
      if ( name == allowed_names[j] ) {
        return true;
      }
    }
    return false;
  }
}

/* for Mozilla/Opera (taken from dean.edwards.name) */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", bedit_onLoad, false);
}

/* for Internet Explorer */
/*@cc_on @*/
/*@if (@_win32)
  document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
  var script = document.getElementById("__ie_onload");
  script.onreadystatechange = function() {
    if (this.readyState == "complete") {
      bedit_onLoad(); // call the onload handler
    }
  };
/*@end @*/

/* for webkit-based browsers */
if (/WebKit/i.test(navigator.userAgent)) { // sniff
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      bedit_onLoad(); // call the onload handler
    }
  }, 100);
}

// add  new onLoad while keeping the old, if any 
old_onLoad = null;
add_onLoad();

function add_onLoad()
{
  old_onLoad = window.onload;
  window.onload = bedit_onLoad;
}

function bedit_onLoad()
{
  // quit if this function has already been called
  if (arguments.callee.done) return; 
  arguments.callee.done = true;
  // kill the timer
  if (_timer) clearInterval(_timer);

  if( typeof(selchange) != 'undefined' ) {
     selchange('src');
  }

  bedit_init();
  attachEvents();
  if ( old_onLoad ) {
    old_onLoad();
  }
}

function addchar(content, event) 
{
  return naddchar(event);
}

function proc_kd_ctrl_k ( source, ev )
{
  imode = 1 - imode;
  return true; 
}

function proc_kd_ctrl_j ( source, ev )
{
  var t = gsel(source);
  if ( t == "" ) {
     return false;
  } else {
    ins(source, ak2uni(t)); 
    return true;
  }
}

function proc_kd_ctrl_u ( source, ev )
{
  var t = gsel(source);
  if ( t == "" ) {
     return false;
  } else {
    ins(source, uly2uy(t)); 
    return true;
  }
}

function proc_kd_ctrl_t ( source, ev )
{
  if ( source.style.direction == "ltr" ) {
    source.style.direction = "rtl";
  } else {
    source.style.direction = "ltr";
  }
  return true;
}

function proc_kd(event)
{
  var x = false; // should cancel?

  var e = event ? event : window.event;
  var k = e.keyCode ? e.keyCode : e.which;
  var s =  e.srcElement ? e.srcElement : e.target; 

  if ( e.ctrlKey) {
    var f = false;
    for(var az = gac('A'); az <= gac('Z'); az++ ) {
      eval('if ( k == ' + az + ' && typeof proc_kd_ctrl_' + gas(az).toLowerCase() + ' == "function" ) { x = ' +  'proc_kd_ctrl_' + gas(az).toLowerCase(az) + '(s, e); f=true;}'); 
      if(f) break;
    }
  }

  if ( x ) {
    e.cancelBubble = true;
    if(e.preventDefault) e.preventDefault();
    if(e.stopPropagation) e.stopPropagation();
    e.returnValue = false;
    return false;
  }

  return true;
}

function gsel(source)
{
  var s = source;

  if ( document.all ) { 
    return document.selection.createRange().text;
  } else {
    var ss = s.selectionStart;
    var se = s.selectionEnd;
    if ( ss < se ) {
       return s.value.substring (ss, se);
    }
  }

  return "";
}

function ins(source, str)
{
  var s = source;

  if ( document.selection && document.selection.createRange) {
    document.selection.createRange().text = str;
  } else {
    // we cannot modify event.which in Mozilla/FireFox, have to do something more interesting
    var ss  = s.selectionStart;
    var se  = s.selectionEnd;

    // Mozilla/Firefox scrolls to top in textarea after text input, fix it:
    var sTop, sLeft;
    if (s.type == 'textarea' && typeof s.scrollTop != 'undefined') {
      sTop = s.scrollTop;
      sLeft = s.scrollLeft;
    }

    s.value = s.value.substring (0, ss) + str + s.value.substr(se);

    if (typeof sTop != 'undefined') {
      s.scrollTop = sTop;
      s.scrollLeft = sLeft;
    }

    s.setSelectionRange(ss + str.length, ss + str.length );
  }
}

// addchar
function naddchar(event)
{
  var e = event ? event : window.event;
  var k = e.keyCode ? e.keyCode : e.which;
  var s =  e.srcElement ? e.srcElement : e.target; 

  if ( !inited ) {
    bedit_init();
  }

  if ( !e.ctrlKey && !e.metaKey && imode == 0 && k < km.length && km[k] != 0 ) {
    if ( e.keyCode && !e.which ) {
      e.keyCode = km[k];
    } else {
      ins(s, gas(km[k]));

      if(e.preventDefault) e.preventDefault();
      if(e.stopPropagation) e.stopPropagation();
    }

    if ( k == gac('"') ) { // toggle double bracket on '"'
      km[k] = qmode ? OQUOTE : CQUOTE;
      qmode = 1 - qmode;
    }

    if ( ! e.keyCode || e.which ) {
      return false;
    }
  } 

  // cannot cancel keydown event in opera, do it in here for keypress
  if (/opera/i.test(navigator.userAgent) && e.ctrlKey) {
    var x = false;
    for(var az = gac('A'); az <= gac('Z'); az++ ) {
      eval('if(k == ' + az + ' && typeof proc_kd_ctrl_' + gas(az).toLowerCase() + ' == "function" ) { x = true }'); 
      if(x) break;
    }
    if(x) {
      e.preventDefault();
      return false;
    }
  }

  e.returnValue = true;
  return true;
}

do_convert("unicode", "cyrillic");