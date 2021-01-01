!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var n in r)("object"==typeof exports?exports:e)[n]=r[n]}}(window,(function(){return function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=8)}([function(e,t,r){"use strict";e.exports=r(4)},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.LocalStream=t.Client=void 0;const n=r(6);t.Client=n.default;const o=r(2);Object.defineProperty(t,"LocalStream",{enumerable:!0,get:function(){return o.LocalStream}})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.makeRemote=t.LocalStream=t.VideoConstraints=void 0;const n=["qvga","vga","shd","hd","fhd","qhd"];t.VideoConstraints={qvga:{resolution:{width:{ideal:320},height:{ideal:180},frameRate:{ideal:15,max:30}},encodings:{maxBitrate:15e4,maxFramerate:15}},vga:{resolution:{width:{ideal:640},height:{ideal:360},frameRate:{ideal:30,max:60}},encodings:{maxBitrate:5e5,maxFramerate:30}},shd:{resolution:{width:{ideal:960},height:{ideal:540},frameRate:{ideal:30,max:60}},encodings:{maxBitrate:12e5,maxFramerate:30}},hd:{resolution:{width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:60}},encodings:{maxBitrate:25e5,maxFramerate:30}},fhd:{resolution:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:60}},encodings:{maxBitrate:4e6,maxFramerate:30}},qhd:{resolution:{width:{ideal:2560},height:{ideal:1440},frameRate:{ideal:30,max:60}},encodings:{maxBitrate:8e6,maxFramerate:30}}};const o={resolution:"hd",codec:"vp8",audio:!0,video:!0,simulcast:!1};class i extends MediaStream{constructor(e,t){super(e),this.constraints=t}static async getUserMedia(e=o){const t=await navigator.mediaDevices.getUserMedia({audio:i.computeAudioConstraints({...o,...e}),video:i.computeVideoConstraints({...o,...e})});return new i(t,{...o,...e})}static async getDisplayMedia(e={codec:"vp8",resolution:"hd",audio:!1,video:!0,simulcast:!1}){const t=await navigator.mediaDevices.getDisplayMedia({video:!0});return new i(t,{...o,...e})}static computeAudioConstraints(e){return e.audio}static computeVideoConstraints(e){return e.video instanceof Object?e.video:e.video&&e.resolution?{...t.VideoConstraints[e.resolution].resolution}:e.video}getTrack(e){let t;return"video"===e?(t=this.getVideoTracks(),t.length>0?this.getVideoTracks()[0]:void 0):(t=this.getAudioTracks(),t.length>0?this.getAudioTracks()[0]:void 0)}async getNewTrack(e){return(await navigator.mediaDevices.getUserMedia({[e]:"video"===e?i.computeVideoConstraints(this.constraints):i.computeAudioConstraints(this.constraints)})).getTracks()[0]}publishTrack(e){if(this.pc)if("video"===e.kind&&this.constraints.simulcast){const r=n.indexOf(this.constraints.resolution),o=[{rid:"f",maxBitrate:t.VideoConstraints[n[r]].encodings.maxBitrate,maxFramerate:t.VideoConstraints[n[r]].encodings.maxFramerate}];r-1>=0&&o.push({rid:"h",scaleResolutionDownBy:2,maxBitrate:t.VideoConstraints[n[r-1]].encodings.maxBitrate,maxFramerate:t.VideoConstraints[n[r-1]].encodings.maxFramerate}),r-2>=0&&o.push({rid:"q",scaleResolutionDownBy:4,maxBitrate:t.VideoConstraints[n[r-2]].encodings.maxBitrate,maxFramerate:t.VideoConstraints[n[r-2]].encodings.maxFramerate});const i=this.pc.addTransceiver(e,{streams:[this],direction:"sendonly",sendEncodings:o});this.setPreferredCodec(i)}else{const r=this.pc.addTransceiver(e,{streams:[this],direction:"sendonly",sendEncodings:"video"===e.kind?[t.VideoConstraints[this.constraints.resolution].encodings]:void 0});"video"===e.kind&&this.setPreferredCodec(r)}}setPreferredCodec(e){if("setCodecPreferences"in e){const t=RTCRtpSender.getCapabilities("video");if(!t)return;const r=t.codecs.find(e=>e.mimeType==="video/"+this.constraints.codec.toUpperCase()||"audio/OPUS"===e.mimeType);r&&e.setCodecPreferences([r])}}updateTrack(e,t){this.addTrack(e),t?(this.removeTrack(t),t.stop(),this.pc&&this.pc.getSenders().forEach(async t=>{var r,n;(null===(r=null==t?void 0:t.track)||void 0===r?void 0:r.kind)===e.kind&&(null===(n=t.track)||void 0===n||n.stop(),t.replaceTrack(e))})):(this.addTrack(e),this.pc&&this.publishTrack(e))}publish(e){this.pc=e,this.getTracks().forEach(this.publishTrack.bind(this))}unpublish(){if(this.pc){const e=this.getTracks();this.pc.getSenders().forEach(t=>{t.track&&e.includes(t.track)&&this.pc.removeTrack(t)})}}async switchDevice(e,t){this.constraints={...this.constraints,[e]:this.constraints[e]instanceof Object?{...this.constraints[e],deviceId:t}:{deviceId:t}};const r=this.getTrack(e),n=await this.getNewTrack(e);this.updateTrack(n,r)}mute(e){const t=this.getTrack(e);t&&t.stop()}async unmute(e){const t=this.getTrack(e),r=await this.getNewTrack(e);this.updateTrack(r,t)}}t.LocalStream=i,t.makeRemote=function(e,t){const r=e;r.audio=!0,r.video="none",r._videoPreMute="high";const n=()=>{const e={streamId:r.id,video:r.video,audio:r.audio};t.api&&("open"!==t.api.readyState?t.api.onopen=()=>{var r;return null===(r=t.api)||void 0===r?void 0:r.send(JSON.stringify(e))}:t.api.send(JSON.stringify(e)))};return r.preferLayer=e=>{r.video=e,n()},r.mute=e=>{"audio"===e?r.audio=!1:"video"===e&&(r._videoPreMute=r.video,r.video="none"),n()},r.unmute=e=>{"audio"===e?r.audio=!0:"video"===e&&(r.video=r._videoPreMute),n()},r}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.IonSFUJSONRPCSignal=void 0;const n=r(7);t.IonSFUJSONRPCSignal=class{constructor(e){this.socket=new WebSocket(e),this.socket.addEventListener("open",()=>{this._onopen&&this._onopen()}),this.socket.addEventListener("error",e=>{this._onerror&&this._onerror(e)}),this.socket.addEventListener("close",e=>{this._onclose&&this._onclose(e)}),this.socket.addEventListener("message",async e=>{const t=JSON.parse(e.data);"offer"===t.method?this.onnegotiate&&this.onnegotiate(t.params):"trickle"===t.method&&this.ontrickle&&this.ontrickle(t.params)})}async call(e,t){const r=n.v4();return this.socket.send(JSON.stringify({method:e,params:t,id:r})),new Promise((e,t)=>{const n=o=>{const i=JSON.parse(o.data);i.id===r&&(i.error?t(i.error):e(i.result),this.socket.removeEventListener("message",n))};this.socket.addEventListener("message",n)})}notify(e,t){this.socket.send(JSON.stringify({method:e,params:t}))}async join(e,t){return this.call("join",{sid:e,offer:t})}trickle(e){this.notify("trickle",e)}async offer(e){return this.call("offer",{desc:e})}answer(e){this.notify("answer",{desc:e})}close(){this.socket.close()}set onopen(e){this.socket.readyState===WebSocket.OPEN&&e(),this._onopen=e}set onerror(e){this._onerror=e}set onclose(e){this._onclose=e}}},function(e,t,r){"use strict";
/** @license React v16.14.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=r(5),o="function"==typeof Symbol&&Symbol.for,i=o?Symbol.for("react.element"):60103,a=o?Symbol.for("react.portal"):60106,s=o?Symbol.for("react.fragment"):60107,c=o?Symbol.for("react.strict_mode"):60108,u=o?Symbol.for("react.profiler"):60114,l=o?Symbol.for("react.provider"):60109,f=o?Symbol.for("react.context"):60110,d=o?Symbol.for("react.forward_ref"):60112,p=o?Symbol.for("react.suspense"):60113,h=o?Symbol.for("react.memo"):60115,y=o?Symbol.for("react.lazy"):60116,v="function"==typeof Symbol&&Symbol.iterator;function b(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var m={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g={};function w(e,t,r){this.props=e,this.context=t,this.refs=g,this.updater=r||m}function S(){}function O(e,t,r){this.props=e,this.context=t,this.refs=g,this.updater=r||m}w.prototype.isReactComponent={},w.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(b(85));this.updater.enqueueSetState(this,e,t,"setState")},w.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},S.prototype=w.prototype;var j=O.prototype=new S;j.constructor=O,n(j,w.prototype),j.isPureReactComponent=!0;var k={current:null},C=Object.prototype.hasOwnProperty,x={key:!0,ref:!0,__self:!0,__source:!0};function P(e,t,r){var n,o={},a=null,s=null;if(null!=t)for(n in void 0!==t.ref&&(s=t.ref),void 0!==t.key&&(a=""+t.key),t)C.call(t,n)&&!x.hasOwnProperty(n)&&(o[n]=t[n]);var c=arguments.length-2;if(1===c)o.children=r;else if(1<c){for(var u=Array(c),l=0;l<c;l++)u[l]=arguments[l+2];o.children=u}if(e&&e.defaultProps)for(n in c=e.defaultProps)void 0===o[n]&&(o[n]=c[n]);return{$$typeof:i,type:e,key:a,ref:s,props:o,_owner:k.current}}function R(e){return"object"==typeof e&&null!==e&&e.$$typeof===i}var E=/\/+/g,_=[];function I(e,t,r,n){if(_.length){var o=_.pop();return o.result=e,o.keyPrefix=t,o.func=r,o.context=n,o.count=0,o}return{result:e,keyPrefix:t,func:r,context:n,count:0}}function T(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>_.length&&_.push(e)}function A(e,t,r){return null==e?0:function e(t,r,n,o){var s=typeof t;"undefined"!==s&&"boolean"!==s||(t=null);var c=!1;if(null===t)c=!0;else switch(s){case"string":case"number":c=!0;break;case"object":switch(t.$$typeof){case i:case a:c=!0}}if(c)return n(o,t,""===r?"."+U(t,0):r),1;if(c=0,r=""===r?".":r+":",Array.isArray(t))for(var u=0;u<t.length;u++){var l=r+U(s=t[u],u);c+=e(s,l,n,o)}else if(null===t||"object"!=typeof t?l=null:l="function"==typeof(l=v&&t[v]||t["@@iterator"])?l:null,"function"==typeof l)for(t=l.call(t),u=0;!(s=t.next()).done;)c+=e(s=s.value,l=r+U(s,u++),n,o);else if("object"===s)throw n=""+t,Error(b(31,"[object Object]"===n?"object with keys {"+Object.keys(t).join(", ")+"}":n,""));return c}(e,"",t,r)}function U(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,(function(e){return t[e]}))}(e.key):t.toString(36)}function M(e,t){e.func.call(e.context,t,e.count++)}function D(e,t,r){var n=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?V(e,n,r,(function(e){return e})):null!=e&&(R(e)&&(e=function(e,t){return{$$typeof:i,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(E,"$&/")+"/")+r)),n.push(e))}function V(e,t,r,n,o){var i="";null!=r&&(i=(""+r).replace(E,"$&/")+"/"),A(e,D,t=I(t,i,n,o)),T(t)}var $={current:null};function L(){var e=$.current;if(null===e)throw Error(b(321));return e}var N={ReactCurrentDispatcher:$,ReactCurrentBatchConfig:{suspense:null},ReactCurrentOwner:k,IsSomeRendererActing:{current:!1},assign:n};t.Children={map:function(e,t,r){if(null==e)return e;var n=[];return V(e,n,null,t,r),n},forEach:function(e,t,r){if(null==e)return e;A(e,M,t=I(null,null,t,r)),T(t)},count:function(e){return A(e,(function(){return null}),null)},toArray:function(e){var t=[];return V(e,t,null,(function(e){return e})),t},only:function(e){if(!R(e))throw Error(b(143));return e}},t.Component=w,t.Fragment=s,t.Profiler=u,t.PureComponent=O,t.StrictMode=c,t.Suspense=p,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=N,t.cloneElement=function(e,t,r){if(null==e)throw Error(b(267,e));var o=n({},e.props),a=e.key,s=e.ref,c=e._owner;if(null!=t){if(void 0!==t.ref&&(s=t.ref,c=k.current),void 0!==t.key&&(a=""+t.key),e.type&&e.type.defaultProps)var u=e.type.defaultProps;for(l in t)C.call(t,l)&&!x.hasOwnProperty(l)&&(o[l]=void 0===t[l]&&void 0!==u?u[l]:t[l])}var l=arguments.length-2;if(1===l)o.children=r;else if(1<l){u=Array(l);for(var f=0;f<l;f++)u[f]=arguments[f+2];o.children=u}return{$$typeof:i,type:e.type,key:a,ref:s,props:o,_owner:c}},t.createContext=function(e,t){return void 0===t&&(t=null),(e={$$typeof:f,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:l,_context:e},e.Consumer=e},t.createElement=P,t.createFactory=function(e){var t=P.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:d,render:e}},t.isValidElement=R,t.lazy=function(e){return{$$typeof:y,_ctor:e,_status:-1,_result:null}},t.memo=function(e,t){return{$$typeof:h,type:e,compare:void 0===t?null:t}},t.useCallback=function(e,t){return L().useCallback(e,t)},t.useContext=function(e,t){return L().useContext(e,t)},t.useDebugValue=function(){},t.useEffect=function(e,t){return L().useEffect(e,t)},t.useImperativeHandle=function(e,t,r){return L().useImperativeHandle(e,t,r)},t.useLayoutEffect=function(e,t){return L().useLayoutEffect(e,t)},t.useMemo=function(e,t){return L().useMemo(e,t)},t.useReducer=function(e,t,r){return L().useReducer(e,t,r)},t.useRef=function(e){return L().useRef(e)},t.useState=function(e){return L().useState(e)},t.version="16.14.0"},function(e,t,r){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var n=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function a(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(e){n[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,t){for(var r,s,c=a(e),u=1;u<arguments.length;u++){for(var l in r=Object(arguments[u]))o.call(r,l)&&(c[l]=r[l]);if(n){s=n(r);for(var f=0;f<s.length;f++)i.call(r,s[f])&&(c[s[f]]=r[s[f]])}}return c}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.Transport=void 0;const n=r(2),o="no active session, join first";var i;!function(e){e[e.pub=0]="pub",e[e.sub=1]="sub"}(i||(i={}));class a{constructor(e,t,r){this.signal=t,this.pc=new RTCPeerConnection(r),this.candidates=[],e===i.pub&&this.pc.createDataChannel("ion-sfu"),this.pc.onicecandidate=({candidate:t})=>{t&&this.signal.trickle({target:e,candidate:t})}}}t.Transport=a;t.default=class{constructor(e,t={codec:"vp8",iceServers:[{urls:["stun:stun.l.google.com:19302","stun:stun1.l.google.com:19302","stun:stun2.l.google.com:19302","stun:stun3.l.google.com:19302","stun:stun4.l.google.com:19302"]}]}){this.signal=e,this.config=t,e.onnegotiate=this.negotiate.bind(this),e.ontrickle=this.trickle.bind(this)}async join(e){this.transports={[i.pub]:new a(i.pub,this.signal,this.config),[i.sub]:new a(i.sub,this.signal,this.config)},this.transports[i.sub].pc.ontrack=e=>{const t=e.streams[0],r=n.makeRemote(t,this.transports[i.sub]);this.ontrack&&this.ontrack(e.track,r)},this.transports[i.sub].pc.ondatachannel=e=>{"ion-sfu"!==e.channel.label?this.ondatachannel&&this.ondatachannel(e):this.transports[i.sub].api=e.channel};const t=await this.transports[i.pub].pc.createOffer();await this.transports[i.pub].pc.setLocalDescription(t);const r=await this.signal.join(e,t);await this.transports[i.pub].pc.setRemoteDescription(r),this.transports[i.pub].candidates.forEach(e=>this.transports[i.pub].pc.addIceCandidate(e)),this.transports[i.pub].pc.onnegotiationneeded=this.onNegotiationNeeded.bind(this)}leave(){this.transports&&(Object.values(this.transports).forEach(e=>e.pc.close()),delete this.transports)}getPubStats(e){if(!this.transports)throw Error(o);return this.transports[i.pub].pc.getStats(e)}getSubStats(e){if(!this.transports)throw Error(o);return this.transports[i.sub].pc.getStats(e)}publish(e){if(!this.transports)throw Error(o);e.publish(this.transports[i.pub].pc)}createDataChannel(e){if(!this.transports)throw Error(o);return this.transports[i.pub].pc.createDataChannel(e)}close(){this.transports&&Object.values(this.transports).forEach(e=>e.pc.close()),this.signal.close()}trickle({candidate:e,target:t}){if(!this.transports)throw Error(o);this.transports[t].pc.remoteDescription?this.transports[t].pc.addIceCandidate(e):this.transports[t].candidates.push(e)}async negotiate(e){if(!this.transports)throw Error(o);try{await this.transports[i.sub].pc.setRemoteDescription(e),this.transports[i.sub].candidates.forEach(e=>this.transports[i.sub].pc.addIceCandidate(e)),this.transports[i.sub].candidates=[];const t=await this.transports[i.sub].pc.createAnswer();await this.transports[i.sub].pc.setLocalDescription(t),this.signal.answer(t)}catch(e){console.error(e)}}async onNegotiationNeeded(){if(!this.transports)throw Error(o);try{const e=await this.transports[i.pub].pc.createOffer();await this.transports[i.pub].pc.setLocalDescription(e);const t=await this.signal.offer(e);await this.transports[i.pub].pc.setRemoteDescription(t)}catch(e){console.error(e)}}}},function(e,t,r){"use strict";r.r(t),r.d(t,"v1",(function(){return y})),r.d(t,"v3",(function(){return C})),r.d(t,"v4",(function(){return x})),r.d(t,"v5",(function(){return E})),r.d(t,"NIL",(function(){return _})),r.d(t,"version",(function(){return I})),r.d(t,"validate",(function(){return s})),r.d(t,"stringify",(function(){return d})),r.d(t,"parse",(function(){return v}));var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto),o=new Uint8Array(16);function i(){if(!n)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return n(o)}var a=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;for(var s=function(e){return"string"==typeof e&&a.test(e)},c=[],u=0;u<256;++u)c.push((u+256).toString(16).substr(1));var l,f,d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=(c[e[t+0]]+c[e[t+1]]+c[e[t+2]]+c[e[t+3]]+"-"+c[e[t+4]]+c[e[t+5]]+"-"+c[e[t+6]]+c[e[t+7]]+"-"+c[e[t+8]]+c[e[t+9]]+"-"+c[e[t+10]]+c[e[t+11]]+c[e[t+12]]+c[e[t+13]]+c[e[t+14]]+c[e[t+15]]).toLowerCase();if(!s(r))throw TypeError("Stringified UUID is invalid");return r},p=0,h=0;var y=function(e,t,r){var n=t&&r||0,o=t||new Array(16),a=(e=e||{}).node||l,s=void 0!==e.clockseq?e.clockseq:f;if(null==a||null==s){var c=e.random||(e.rng||i)();null==a&&(a=l=[1|c[0],c[1],c[2],c[3],c[4],c[5]]),null==s&&(s=f=16383&(c[6]<<8|c[7]))}var u=void 0!==e.msecs?e.msecs:Date.now(),y=void 0!==e.nsecs?e.nsecs:h+1,v=u-p+(y-h)/1e4;if(v<0&&void 0===e.clockseq&&(s=s+1&16383),(v<0||u>p)&&void 0===e.nsecs&&(y=0),y>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=u,h=y,f=s;var b=(1e4*(268435455&(u+=122192928e5))+y)%4294967296;o[n++]=b>>>24&255,o[n++]=b>>>16&255,o[n++]=b>>>8&255,o[n++]=255&b;var m=u/4294967296*1e4&268435455;o[n++]=m>>>8&255,o[n++]=255&m,o[n++]=m>>>24&15|16,o[n++]=m>>>16&255,o[n++]=s>>>8|128,o[n++]=255&s;for(var g=0;g<6;++g)o[n+g]=a[g];return t||d(o)};var v=function(e){if(!s(e))throw TypeError("Invalid UUID");var t,r=new Uint8Array(16);return r[0]=(t=parseInt(e.slice(0,8),16))>>>24,r[1]=t>>>16&255,r[2]=t>>>8&255,r[3]=255&t,r[4]=(t=parseInt(e.slice(9,13),16))>>>8,r[5]=255&t,r[6]=(t=parseInt(e.slice(14,18),16))>>>8,r[7]=255&t,r[8]=(t=parseInt(e.slice(19,23),16))>>>8,r[9]=255&t,r[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,r[11]=t/4294967296&255,r[12]=t>>>24&255,r[13]=t>>>16&255,r[14]=t>>>8&255,r[15]=255&t,r};var b=function(e,t,r){function n(e,n,o,i){if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));for(var t=[],r=0;r<e.length;++r)t.push(e.charCodeAt(r));return t}(e)),"string"==typeof n&&(n=v(n)),16!==n.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var a=new Uint8Array(16+e.length);if(a.set(n),a.set(e,n.length),(a=r(a))[6]=15&a[6]|t,a[8]=63&a[8]|128,o){i=i||0;for(var s=0;s<16;++s)o[i+s]=a[s];return o}return d(a)}try{n.name=e}catch(e){}return n.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",n.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",n};function m(e){return 14+(e+64>>>9<<4)+1}function g(e,t){var r=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(r>>16)<<16|65535&r}function w(e,t,r,n,o,i){return g((a=g(g(t,e),g(n,i)))<<(s=o)|a>>>32-s,r);var a,s}function S(e,t,r,n,o,i,a){return w(t&r|~t&n,e,t,o,i,a)}function O(e,t,r,n,o,i,a){return w(t&n|r&~n,e,t,o,i,a)}function j(e,t,r,n,o,i,a){return w(t^r^n,e,t,o,i,a)}function k(e,t,r,n,o,i,a){return w(r^(t|~n),e,t,o,i,a)}var C=b("v3",48,(function(e){if("string"==typeof e){var t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(var r=0;r<t.length;++r)e[r]=t.charCodeAt(r)}return function(e){for(var t=[],r=32*e.length,n=0;n<r;n+=8){var o=e[n>>5]>>>n%32&255,i=parseInt("0123456789abcdef".charAt(o>>>4&15)+"0123456789abcdef".charAt(15&o),16);t.push(i)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[m(t)-1]=t;for(var r=1732584193,n=-271733879,o=-1732584194,i=271733878,a=0;a<e.length;a+=16){var s=r,c=n,u=o,l=i;r=S(r,n,o,i,e[a],7,-680876936),i=S(i,r,n,o,e[a+1],12,-389564586),o=S(o,i,r,n,e[a+2],17,606105819),n=S(n,o,i,r,e[a+3],22,-1044525330),r=S(r,n,o,i,e[a+4],7,-176418897),i=S(i,r,n,o,e[a+5],12,1200080426),o=S(o,i,r,n,e[a+6],17,-1473231341),n=S(n,o,i,r,e[a+7],22,-45705983),r=S(r,n,o,i,e[a+8],7,1770035416),i=S(i,r,n,o,e[a+9],12,-1958414417),o=S(o,i,r,n,e[a+10],17,-42063),n=S(n,o,i,r,e[a+11],22,-1990404162),r=S(r,n,o,i,e[a+12],7,1804603682),i=S(i,r,n,o,e[a+13],12,-40341101),o=S(o,i,r,n,e[a+14],17,-1502002290),n=S(n,o,i,r,e[a+15],22,1236535329),r=O(r,n,o,i,e[a+1],5,-165796510),i=O(i,r,n,o,e[a+6],9,-1069501632),o=O(o,i,r,n,e[a+11],14,643717713),n=O(n,o,i,r,e[a],20,-373897302),r=O(r,n,o,i,e[a+5],5,-701558691),i=O(i,r,n,o,e[a+10],9,38016083),o=O(o,i,r,n,e[a+15],14,-660478335),n=O(n,o,i,r,e[a+4],20,-405537848),r=O(r,n,o,i,e[a+9],5,568446438),i=O(i,r,n,o,e[a+14],9,-1019803690),o=O(o,i,r,n,e[a+3],14,-187363961),n=O(n,o,i,r,e[a+8],20,1163531501),r=O(r,n,o,i,e[a+13],5,-1444681467),i=O(i,r,n,o,e[a+2],9,-51403784),o=O(o,i,r,n,e[a+7],14,1735328473),n=O(n,o,i,r,e[a+12],20,-1926607734),r=j(r,n,o,i,e[a+5],4,-378558),i=j(i,r,n,o,e[a+8],11,-2022574463),o=j(o,i,r,n,e[a+11],16,1839030562),n=j(n,o,i,r,e[a+14],23,-35309556),r=j(r,n,o,i,e[a+1],4,-1530992060),i=j(i,r,n,o,e[a+4],11,1272893353),o=j(o,i,r,n,e[a+7],16,-155497632),n=j(n,o,i,r,e[a+10],23,-1094730640),r=j(r,n,o,i,e[a+13],4,681279174),i=j(i,r,n,o,e[a],11,-358537222),o=j(o,i,r,n,e[a+3],16,-722521979),n=j(n,o,i,r,e[a+6],23,76029189),r=j(r,n,o,i,e[a+9],4,-640364487),i=j(i,r,n,o,e[a+12],11,-421815835),o=j(o,i,r,n,e[a+15],16,530742520),n=j(n,o,i,r,e[a+2],23,-995338651),r=k(r,n,o,i,e[a],6,-198630844),i=k(i,r,n,o,e[a+7],10,1126891415),o=k(o,i,r,n,e[a+14],15,-1416354905),n=k(n,o,i,r,e[a+5],21,-57434055),r=k(r,n,o,i,e[a+12],6,1700485571),i=k(i,r,n,o,e[a+3],10,-1894986606),o=k(o,i,r,n,e[a+10],15,-1051523),n=k(n,o,i,r,e[a+1],21,-2054922799),r=k(r,n,o,i,e[a+8],6,1873313359),i=k(i,r,n,o,e[a+15],10,-30611744),o=k(o,i,r,n,e[a+6],15,-1560198380),n=k(n,o,i,r,e[a+13],21,1309151649),r=k(r,n,o,i,e[a+4],6,-145523070),i=k(i,r,n,o,e[a+11],10,-1120210379),o=k(o,i,r,n,e[a+2],15,718787259),n=k(n,o,i,r,e[a+9],21,-343485551),r=g(r,s),n=g(n,c),o=g(o,u),i=g(i,l)}return[r,n,o,i]}(function(e){if(0===e.length)return[];for(var t=8*e.length,r=new Uint32Array(m(t)),n=0;n<t;n+=8)r[n>>5]|=(255&e[n/8])<<n%32;return r}(e),8*e.length))}));var x=function(e,t,r){var n=(e=e||{}).random||(e.rng||i)();if(n[6]=15&n[6]|64,n[8]=63&n[8]|128,t){r=r||0;for(var o=0;o<16;++o)t[r+o]=n[o];return t}return d(n)};function P(e,t,r,n){switch(e){case 0:return t&r^~t&n;case 1:return t^r^n;case 2:return t&r^t&n^r&n;case 3:return t^r^n}}function R(e,t){return e<<t|e>>>32-t}var E=b("v5",80,(function(e){var t=[1518500249,1859775393,2400959708,3395469782],r=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){var n=unescape(encodeURIComponent(e));e=[];for(var o=0;o<n.length;++o)e.push(n.charCodeAt(o))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);for(var i=e.length/4+2,a=Math.ceil(i/16),s=new Array(a),c=0;c<a;++c){for(var u=new Uint32Array(16),l=0;l<16;++l)u[l]=e[64*c+4*l]<<24|e[64*c+4*l+1]<<16|e[64*c+4*l+2]<<8|e[64*c+4*l+3];s[c]=u}s[a-1][14]=8*(e.length-1)/Math.pow(2,32),s[a-1][14]=Math.floor(s[a-1][14]),s[a-1][15]=8*(e.length-1)&4294967295;for(var f=0;f<a;++f){for(var d=new Uint32Array(80),p=0;p<16;++p)d[p]=s[f][p];for(var h=16;h<80;++h)d[h]=R(d[h-3]^d[h-8]^d[h-14]^d[h-16],1);for(var y=r[0],v=r[1],b=r[2],m=r[3],g=r[4],w=0;w<80;++w){var S=Math.floor(w/20),O=R(y,5)+P(S,v,b,m)+g+t[S]+d[w]>>>0;g=m,m=b,b=R(v,30)>>>0,v=y,y=O}r[0]=r[0]+y>>>0,r[1]=r[1]+v>>>0,r[2]=r[2]+b>>>0,r[3]=r[3]+m>>>0,r[4]=r[4]+g>>>0}return[r[0]>>24&255,r[0]>>16&255,r[0]>>8&255,255&r[0],r[1]>>24&255,r[1]>>16&255,r[1]>>8&255,255&r[1],r[2]>>24&255,r[2]>>16&255,r[2]>>8&255,255&r[2],r[3]>>24&255,r[3]>>16&255,r[3]>>8&255,255&r[3],r[4]>>24&255,r[4]>>16&255,r[4]>>8&255,255&r[4]]})),_="00000000-0000-0000-0000-000000000000";var I=function(e){if(!s(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}},function(e,t,r){"use strict";r.r(t),r.d(t,"IonProvider",(function(){return g})),r.d(t,"BroadcastProvider",(function(){return k})),r.d(t,"BroadcastControls",(function(){return A})),r.d(t,"BroadcastPreview",(function(){return T})),r.d(t,"VideoView",(function(){return _})),r.d(t,"IonContext",(function(){return s})),r.d(t,"useIon",(function(){return c})),r.d(t,"IonUserMediaContext",(function(){return u})),r.d(t,"useUserMedia",(function(){return l}));var n=r(0),o=r.n(n),i=r(1),a=r(3),s=o.a.createContext(null),c=function(){return o.a.useContext(s)},u=o.a.createContext({constraints:{audio:!0,video:!0},setConstraints:null,getUserMedia:null,localStream:null}),l=function(){return o.a.useContext(u)};function f(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function d(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){f(i,n,o,a,s,"next",e)}function s(e){f(i,n,o,a,s,"throw",e)}a(void 0)}))}}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach((function(t){y(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function y(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function v(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==s.return||s.return()}finally{if(o)throw i}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return b(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return b(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function b(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function m(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var g=function(e){var t,r,n,c,u=e.children,f=m(e,["children"]),p=v(o.a.useState(f.sid),2),y=p[0],b=p[1],g=v(o.a.useState(),2),w=g[0],S=g[1],O=v(o.a.useState(f.signal?f.signal:new a.IonSFUJSONRPCSignal(f.address||"ws://localhost:7000/ws")),2),j=O[0],k=O[1],C=v(o.a.useState(f.config),2),x=C[0],P=C[1],R=v(o.a.useState(),2),E=R[0],_=R[1],I=l().localStream,T=2===Object.keys((null==E?void 0:E.transports)||{}).length,A=T?E.transports[0]:null,U=T?E.transports[1]:null,M=null==A||null===(t=A.pc)||void 0===t?void 0:t.connectionState,D=null==U||null===(r=U.pc)||void 0===r?void 0:r.connectionState,V=null==A||null===(n=A.pc)||void 0===n?void 0:n.signalingState,$=null==U||null===(c=U.pc)||void 0===c?void 0:c.signalingState;function L(){S((function(e){var t=h(h({},e),{},{publisherConnectionState:M,publisherSignalingState:V,subscriberConnectionState:D,subscriberSignalingState:$});return t.publisherConnectionReady="new"===M||"connected"===M,t.publisherSignalingReady="stable"===V,t.publisherReady=t.publisherConnectionReady&&t.publisherSignalingReady,t.subscriberConnectionReady="new"===D||"connected"===D,t.subscriberSignalingReady="stable"===$,t.subscriberReady=t.subscriberConnectionReady&&t.subscriberSignalingReady,t.connectionReady=t.publisherConnectionReady&&t.subscriberConnectionReady,t.signalingReady=t.publisherSignalingReady&&t.subscriberSignalingReady,t.ready=t.publisherReady&&t.subscriberReady,console.log("SetStatus"),t}))}function N(){return(N=d(regeneratorRuntime.mark((function e(t,r){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t){e.next=2;break}return e.abrupt("return");case 2:if(j){e.next=4;break}throw new Error("Cannot call join before signal is set");case 4:B(),r&&(E.ontrack=r),j.onopen=function(){console.info("joining...",t),E.join(t)},b(t),setInterval(L,2500);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function F(){return(F=d(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E.publish(I),e.abrupt("return",I);case 2:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(){y&&(console.info("Ion Close"),E.close())}return o.a.useEffect((function(){if(j){var e=new i.Client(j,x);_(e)}}),[j]),o.a.useEffect(L,[V,V,D,$]),o.a.useEffect((function(){B()}),[]),o.a.createElement(s.Provider,{value:{client:E,sid:y,join:function(e,t){return N.apply(this,arguments)},leave:B,publishUserMedia:function(){return F.apply(this,arguments)},status:w,setClient:_,setSignal:k,setConfig:P}},u)};function w(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function S(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function a(e){w(i,n,o,a,s,"next",e)}function s(e){w(i,n,o,a,s,"throw",e)}a(void 0)}))}}function O(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var r=[],n=!0,o=!1,i=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==s.return||s.return()}finally{if(o)throw i}}return r}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return j(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);"Object"===r&&e.constructor&&(r=e.constructor.name);if("Map"===r||"Set"===r)return Array.from(e);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return j(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function j(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var k=function(e){var t=e.children,r=e.stream,n=e.audio,a=e.video,s=e.resolution,c=e.codec,l=e.simulcast,f=O(o.a.useState({audio:void 0===n||n,video:void 0===a||a,resolution:void 0===s?"hd":s,codec:void 0===c?"vp8":c,simulcast:void 0!==l&&l}),2),d=f[0],p=f[1],h=O(o.a.useState(r),2),y=h[0],v=h[1];function b(){return(b=S(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=2;break}return e.abrupt("return",Object(i.LocalStream)(r,d));case 2:return e.next=4,i.LocalStream.getUserMedia(d);case 4:return t=e.sent,console.log("Attached",d),v(t),e.abrupt("return",t);case 8:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var m={constraints:d,setConstraints:p,getUserMedia:function(){return b.apply(this,arguments)},localStream:y};return o.a.createElement(u.Provider,{value:m},t)};function C(){return(C=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}function x(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?x(Object(r),!0).forEach((function(t){R(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):x(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function R(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function E(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}function _(e){var t=e.stream,r=E(e,["stream"]),n=o.a.useRef();o.a.useEffect((function(){t&&n.current&&setTimeout((function(){n.current.srcObject=t}),500)}),[t]);var i=P(P({},r.style),{},{height:"100%",width:"100%",overflow:"hidden",position:"absolute",objectFit:"cover",bottom:"0",right:"0"});return o.a.createElement("video",C({ref:n,onCanPlay:function(){n.current.play()},autoPlay:!0,playsInline:!0},r,{style:i}))}function I(){return(I=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e}).apply(this,arguments)}var T=function(e){var t=l(),r=t.localStream,n=t.getUserMedia,i=t.constraints;return o.a.useEffect((function(){r||n()}),[r,i]),r?o.a.createElement(_,I({stream:r,muted:!0},e)):o.a.createElement(o.a.Fragment,null,"Requesting video...")},A=function(){return o.a.createElement(o.a.Fragment,null,"Controls")}}])}));