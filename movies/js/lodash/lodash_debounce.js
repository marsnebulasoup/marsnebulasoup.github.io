/**
 * @license
 * Lodash (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="debounce"`
 */
;(function(){function t(){}function e(t){return null==t?t===l?m:p:I&&I in Object(t)?n(t):o(t)}function n(t){var e=$.call(t,I),n=t[I];try{t[I]=l;var o=true}catch(t){}var r=_.call(t);return o&&(e?t[I]=n:delete t[I]),r}function o(t){return _.call(t)}function r(t,e,n){function o(e){var n=d,o=j;return d=j=l,h=e,g=t.apply(o,n)}function r(t){return h=t,O=setTimeout(a,e),T?o(t):g}function u(t){var n=t-x,o=t-h,r=e-n;return S?W(r,v-o):r}function f(t){var n=t-x,o=t-h;return x===l||n>=e||n<0||S&&o>=v}function a(){
var t=k();return f(t)?s(t):(O=setTimeout(a,u(t)),l)}function s(t){return O=l,w&&d?o(t):(d=j=l,g)}function p(){O!==l&&clearTimeout(O),h=0,d=x=j=O=l}function y(){return O===l?g:s(k())}function m(){var t=k(),n=f(t);if(d=arguments,j=this,x=t,n){if(O===l)return r(x);if(S)return O=setTimeout(a,e),o(x)}return O===l&&(O=setTimeout(a,e)),g}var d,j,v,g,O,x,h=0,T=false,S=false,w=true;if(typeof t!="function")throw new TypeError(b);return e=c(e)||0,i(n)&&(T=!!n.leading,S="maxWait"in n,v=S?M(c(n.maxWait)||0,e):v,w="trailing"in n?!!n.trailing:w),
m.cancel=p,m.flush=y,m}function i(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function u(t){return null!=t&&typeof t=="object"}function f(t){return typeof t=="symbol"||u(t)&&e(t)==y}function c(t){if(typeof t=="number")return t;if(f(t))return s;if(i(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=i(e)?e+"":e}if(typeof t!="string")return 0===t?t:+t;t=t.replace(d,"");var n=v.test(t);return n||g.test(t)?O(t.slice(2),n?2:8):j.test(t)?s:+t}var l,a="4.17.5",b="Expected a function",s=NaN,p="[object Null]",y="[object Symbol]",m="[object Undefined]",d=/^\s+|\s+$/g,j=/^[-+]0x[0-9a-f]+$/i,v=/^0b[01]+$/i,g=/^0o[0-7]+$/i,O=parseInt,x=typeof global=="object"&&global&&global.Object===Object&&global,h=typeof self=="object"&&self&&self.Object===Object&&self,T=x||h||Function("return this")(),S=typeof exports=="object"&&exports&&!exports.nodeType&&exports,w=S&&typeof module=="object"&&module&&!module.nodeType&&module,N=Object.prototype,$=N.hasOwnProperty,_=N.toString,E=T.Symbol,I=E?E.toStringTag:l,M=Math.max,W=Math.min,k=function(){
return T.Date.now()};t.debounce=r,t.isObject=i,t.isObjectLike=u,t.isSymbol=f,t.now=k,t.toNumber=c,t.VERSION=a,typeof define=="function"&&typeof define.amd=="object"&&define.amd?(T._=t, define(function(){return t})):w?((w.exports=t)._=t,S._=t):T._=t}).call(this);