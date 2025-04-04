function t(t,e,i,n){var a,s=arguments.length,o=s<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,i,n);else for(var r=t.length-1;r>=0;r--)(a=t[r])&&(o=(s<3?a(o):s>3?a(e,i,o):a(e,i))||o);return s>3&&o&&Object.defineProperty(e,i,o),o}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;let s=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=a.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(e,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1]),t[0]);return new s(i,t,n)},r=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:_}=Object,p=globalThis,g=p.trustedTypes,m=g?g.emptyScript:"",f=p.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;class x extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&h(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:a}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get(){return n?.call(this)},set(e){const s=n?.call(this);a.call(this,e),this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=_(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const i of n){const n=document.createElement("style"),a=e.litNonce;void 0!==a&&n.setAttribute("nonce",a),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),a="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=n,this[n]=a.fromAttribute(e,t.type),this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){if(i??=this.constructor.getPropertyOptions(t),!(i.hasChanged??$)(this[t],e))return;this.P(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$Em!==t&&(this._$Ej??=new Set).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t)!0!==i.wrapped||this._$AL.has(e)||void 0===this[e]||this.P(e,this[e],i)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(e)):this._$EU()}catch(e){throw t=!1,this._$EU(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&=this._$Ej.forEach((t=>this._$EC(t,this[t]))),this._$EU()}updated(t){}firstUpdated(t){}}x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[v("elementProperties")]=new Map,x[v("finalized")]=new Map,f?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.0.4");const w=globalThis,A=w.trustedTypes,M=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,V="?"+E,k=`<${V}>`,C=document,P=()=>C.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,D="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,T=/>/g,O=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,z=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,W=C.createTreeWalker(C,129);function G(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,n=[];let a,s=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<i;e++){const i=t[e];let r,l,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===R?"!--"===l[1]?o=H:void 0!==l[1]?o=T:void 0!==l[2]?(I.test(l[2])&&(a=RegExp("</"+l[2],"g")),o=O):void 0!==l[3]&&(o=O):o===O?">"===l[0]?(o=a??R,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,r=l[1],o=void 0===l[3]?O:'"'===l[3]?z:L):o===z||o===L?o=O:o===H||o===T?o=R:(o=O,a=void 0);const d=o===O&&t[e+1].startsWith("/>")?" ":"";s+=o===R?i+k:h>=0?(n.push(r),i.slice(0,h)+S+i.slice(h)+E+d):i+E+(-2===h?e:d)}return[G(t,s+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class Y{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let a=0,s=0;const o=t.length-1,r=this.parts,[l,h]=K(t,e);if(this.el=Y.createElement(l,i),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=W.nextNode())&&r.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(S)){const e=h[s++],i=n.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);r.push({type:1,index:a,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),n.removeAttribute(t)}else t.startsWith(E)&&(r.push({type:6,index:a}),n.removeAttribute(t));if(I.test(n.tagName)){const t=n.textContent.split(E),e=t.length-1;if(e>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],P()),W.nextNode(),r.push({type:2,index:++a});n.append(t[e],P())}}}else if(8===n.nodeType)if(n.data===V)r.push({type:2,index:a});else{let t=-1;for(;-1!==(t=n.data.indexOf(E,t+1));)r.push({type:7,index:a}),t+=E.length-1}a++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function X(t,e,i=t,n){if(e===q)return e;let a=void 0!==n?i._$Co?.[n]:i._$Cl;const s=U(e)?void 0:e._$litDirective$;return a?.constructor!==s&&(a?._$AO?.(!1),void 0===s?a=void 0:(a=new s(t),a._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=a:i._$Cl=a),void 0!==a&&(e=X(t,a._$AS(t,e.values),a,n)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??C).importNode(e,!0);W.currentNode=n;let a=W.nextNode(),s=0,o=0,r=i[0];for(;void 0!==r;){if(s===r.index){let e;2===r.type?e=new Z(a,a.nextSibling,this,t):1===r.type?e=new r.ctor(a,r.name,r.strings,this,t):6===r.type&&(e=new nt(a,this,t)),this._$AV.push(e),r=i[++o]}s!==r?.index&&(a=W.nextNode(),s++)}return W.currentNode=C,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),U(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new J(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Y(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const a of t)n===e.length?e.push(i=new Z(this.O(P()),this.O(P()),this,this.options)):i=e[n],i._$AI(a),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,a){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,n){const a=this.strings;let s=!1;if(void 0===a)t=X(this,t,e,0),s=!U(t)||t!==this._$AH&&t!==q,s&&(this._$AH=t);else{const n=t;let o,r;for(t=a[0],o=0;o<a.length-1;o++)r=X(this,n[i+o],e,o),r===q&&(r=this._$AH[o]),s||=!U(r)||r!==this._$AH[o],r===j?t=j:t!==j&&(t+=(r??"")+a[o+1]),this._$AH[o]=r}s&&!n&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class it extends Q{constructor(t,e,i,n,a){super(t,e,i,n,a),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??j)===q)return;const i=this._$AH,n=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,a=t!==j&&(i===j||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Y,Z),(w.litHtmlVersions??=[]).push("3.2.1");let st=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let a=n._$litPart$;if(void 0===a){const t=i?.renderBefore??null;n._$litPart$=a=new Z(e.insertBefore(P(),t),t,void 0,i??{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};st._$litElement$=!0,st.finalized=!0,globalThis.litElementHydrateSupport?.({LitElement:st});const ot=globalThis.litElementPolyfillSupport;ot?.({LitElement:st}),(globalThis.litElementVersions??=[]).push("4.1.1");const rt=t=>(e,i)=>{void 0!==i?i.addInitializer((()=>{customElements.define(t,e)})):customElements.define(t,e)},lt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ht=(t=lt,e,i)=>{const{kind:n,metadata:a}=i;let s=globalThis.litPropertyMetadata.get(a);if(void 0===s&&globalThis.litPropertyMetadata.set(a,s=new Map),s.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const a=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,a,t)},init(e){return void 0!==e&&this.P(n,void 0,t),e}}}if("setter"===n){const{name:n}=i;return function(i){const a=this[n];e.call(this,i),this.requestUpdate(n,a,t)}}throw Error("Unsupported decorator location: "+n)};function ct(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,n?{...t,wrapped:!0}:t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function dt(t){return ct({...t,state:!0,attribute:!1})}var ut,_t;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ut||(ut={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(_t||(_t={}));var pt=["closed","locked","off"],gt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var a=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return a.detail=i,t.dispatchEvent(a),a},mt=function(t){gt(window,"haptic",t)},ft=function(t,e,i,n){if(n||(n={action:"more-info"}),!n.confirmation||n.confirmation.exemptions&&n.confirmation.exemptions.some((function(t){return t.user===e.user.id}))||(mt("warning"),confirm(n.confirmation.text||"Are you sure you want to "+n.action+"?")))switch(n.action){case"more-info":(i.entity||i.camera_image)&&gt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":n.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),gt(window,"location-changed",{replace:i})}(0,n.navigation_path);break;case"url":n.url_path&&window.open(n.url_path);break;case"toggle":i.entity&&(function(t,e){(function(t,e,i){void 0===i&&(i=!0);var n,a=function(t){return t.substr(0,t.indexOf("."))}(e),s="group"===a?"homeassistant":a;switch(a){case"lock":n=i?"unlock":"lock";break;case"cover":n=i?"open_cover":"close_cover";break;default:n=i?"turn_on":"turn_off"}t.callService(s,n,{entity_id:e})})(t,e,pt.includes(t.states[e].state))}(e,i.entity),mt("success"));break;case"call-service":if(!n.service)return void mt("failure");var a=n.service.split(".",2);e.callService(a[0],a[1],n.service_data,n.target),mt("success");break;case"fire-dom-event":gt(t,"ll-custom",n)}};let vt=class extends st{constructor(){super(),this._minValue=0,this._maxValue=100,this._currentValue=null,this._isDraggingMin=!1,this._isDraggingMax=!1,this._tooltipValueMin=null,this._tooltipValueMax=null,this._activeHandle=null,this._handleMove=this._handleMove.bind(this),this._handleUp=this._handleUp.bind(this)}setConfig(t){if(!t.entity_min||!t.entity_max)throw new Error("Configuration Error: You need to define 'entity_min' and 'entity_max'");"input_number"===t.entity_min.split(".")[0]&&"input_number"===t.entity_max.split(".")[0]||console.warn(`Range Slider Card (${t.entity_min}/${t.entity_max}): 'entity_min' and 'entity_max' should ideally be 'input_number' entities for service calls.`),t.show_inputs&&t.read_only&&console.warn(`Range Slider Card (${t.entity_min}/${t.entity_max}): 'show_inputs' is true but 'read_only' is also true. Inputs will not be editable.`),this._config={name:"Range Slider",min:0,max:100,step:1,unit:"",orientation:"horizontal",read_only:!1,show_range:!1,show_inputs:!1,show_tooltips:!1,show_value_marker:!1,read_only_min:t.read_only??!1,read_only_max:t.read_only??!1,read_only_value:t.read_only??!1,tap_action:{action:"more-info"},hold_action:void 0,double_tap_action:void 0,entity_value:void 0,min_entity:void 0,max_entity:void 0,step_entity:void 0,...t},this._error=void 0}updated(t){if(super.updated(t),t.has("hass")&&this.hass){const e=t.get("hass");this._updateStates(e)}}connectedCallback(){super.connectedCallback(),this.hass&&!this._error&&this._config&&this._updateStates()}disconnectedCallback(){super.disconnectedCallback(),this._removeGlobalListeners()}render(){if(!this._config||!this.hass)return B``;if(this._error)return this._renderError(this._error);const t=this._getEffectiveMin(),e=this._getEffectiveMax(),i=this._getEffectiveStep();if(void 0===t||void 0===e||void 0===i||t>=e||i<=0){if(console.error("Range Slider Card: Invalid effective limits or step detected in render.",{min:t,max:e,step:i}),this._validateAndPrepare(!0),this._error)return this._renderError(this._error);if(void 0===t||void 0===e||void 0===i||t>=e||i<=0)return this._renderError("Internal Error: Invalid slider limits or step after validation.")}const n=e-t,a=0===n?0:Math.max(0,Math.min(100,(this._minValue-t)/n*100)),s=0===n?100:Math.max(0,Math.min(100,(this._maxValue-t)/n*100)),o=null!==this._currentValue&&0!==n?Math.max(0,Math.min(100,(this._currentValue-t)/n*100)):null,r=this._config.show_value_marker&&this._config.entity_value&&this._entityValueState&&null!==o&&null!==this._currentValue&&this._currentValue>=this._minValue&&this._currentValue<=this._maxValue,l=this._isDraggingMin&&null!==this._tooltipValueMin?this._tooltipValueMin:this._minValue,h=this._isDraggingMax&&null!==this._tooltipValueMax?this._tooltipValueMax:this._maxValue,c=this._formatValueText(this._minValue),d=this._formatValueText(this._maxValue);return B`
      <ha-card
        .header=${this._config.name}
        @action=${this._handleCardAction}
        .actionHandler=${{hasDoubleClick:!!this._config.double_tap_action,hasHold:!!this._config.hold_action,repeat:this._config.hold_action?.repeat}}
        tabindex="-1"
        aria-label=${`Range Slider: ${this._config.name??"Unnamed"}`}
        class="${"vertical"===this._config.orientation?"vertical":"horizontal"} ${this._config.read_only?"read-only":""}"
      >
        <div class="card-content">
          <div class="slider-container">
            <div class="slider-track" @click=${this._handleTrackClick}>
              <div class="slider-bar" style="${this._getBarStyle(a,s)}"></div>

              ${r?B` <div class="value-marker" style="${this._getMarkerStyle(o)}"></div> `:""}

              <div
                class="slider-handle min-handle ${"min"===this._activeHandle?"active":""}"
                style="${this._getHandleStyle(a)}"
                @mousedown=${this._handleMinDown}
                @touchstart=${this._handleMinDown}
                @keydown=${this._handleKeyDown}
                @focus=${()=>this._handleFocus("min")}
                @blur=${this._handleBlur}
                tabindex=${this._config.read_only||this._config.read_only_min?"-1":"0"}
                role="slider"
                aria-valuemin=${t}
                aria-valuemax=${this._maxValue}
                aria-valuenow=${this._minValue}
                aria-valuetext=${c}
                aria-label="Minimum value"
                aria-disabled=${this._config.read_only||this._config.read_only_min}
                aria-orientation=${this._config.orientation}
              >
                ${this._config.show_tooltips&&(this._isDraggingMin||"min"===this._activeHandle)?B` <span class="tooltip">${this._formatValue(l)}</span> `:""}
              </div>

              <div
                class="slider-handle max-handle ${"max"===this._activeHandle?"active":""}"
                style="${this._getHandleStyle(s)}"
                @mousedown=${this._handleMaxDown}
                @touchstart=${this._handleMaxDown}
                @keydown=${this._handleKeyDown}
                @focus=${()=>this._handleFocus("max")}
                @blur=${this._handleBlur}
                tabindex=${this._config.read_only||this._config.read_only_max?"-1":"0"}
                role="slider"
                aria-valuemin=${this._minValue}
                aria-valuemax=${e}
                aria-valuenow=${this._maxValue}
                aria-valuetext=${d}
                aria-label="Maximum value"
                aria-disabled=${this._config.read_only||this._config.read_only_max}
                aria-orientation=${this._config.orientation}
              >
                ${this._config.show_tooltips&&(this._isDraggingMax||"max"===this._activeHandle)?B` <span class="tooltip">${this._formatValue(h)}</span> `:""}
              </div>
            </div>
          </div>

          <div class="info-row">
            <div class="value-label min-label">
              <span class="label">Min:</span>
              ${this._config.show_inputs?B`
                    <input
                      type="number"
                      .value=${this._formatValue(l)}
                      @change=${t=>this._handleInputChange(t,"min")}
                      .step=${i}
                      .min=${t}
                      .max=${this._maxValue-1*i}
                      aria-label="Minimum value input"
                      class="value-input"
                      ?disabled=${this._config.read_only||this._config.read_only_min}
                    />
                  `:B` <span class="value">${this._formatValue(this._minValue)}${this._config.unit??""}</span> `}
            </div>

            ${this._config.show_range?B`
                  <div class="value-label range-label">
                    <span class="label">Range:</span>
                    <span class="value"
                      >${this._formatValue(this._maxValue-this._minValue)}${this._config.unit??""}</span
                    >
                  </div>
                `:""}

            <div class="value-label max-label">
              <span class="label">Max:</span>
              ${this._config.show_inputs?B`
                    <input
                      type="number"
                      .value=${this._formatValue(h)}
                      @change=${t=>this._handleInputChange(t,"max")}
                      .step=${i}
                      .min=${this._minValue+1*i}
                      .max=${e}
                      aria-label="Maximum value input"
                      class="value-input"
                      ?disabled=${this._config.read_only||this._config.read_only_max}
                    />
                  `:B` <span class="value">${this._formatValue(this._maxValue)}${this._config.unit??""}</span> `}
            </div>
          </div>
        </div>
      </ha-card>
    `}getCardSize(){if(!this._config)return 1;let t="vertical"===this._config.orientation?4:2;return this._config.name&&(t+=.5),this._config.show_inputs&&(t+=.5),Math.max(1,Math.round(t))}_updateStates(t){if(!this.hass||!this._config)return;let e=!1;const i=(i,n)=>{if(!i)return void(void 0!==this[n]&&(this[n]=void 0,e=!0));const a=this.hass.states[i],s=t?.states[i];a===this[n]&&a?.state===s?.state||(this[n]=a,e=!0)};i(this._config.entity_min,"_entityMinState"),i(this._config.entity_max,"_entityMaxState"),i(this._config.entity_value,"_entityValueState"),i(this._config.min_entity,"_minLimitState"),i(this._config.max_entity,"_maxLimitState"),i(this._config.step_entity,"_stepState"),(e||void 0===this._minValue||void 0===this._maxValue)&&(this.requestUpdate(),this._validateAndPrepare(!0))}_validateAndPrepare(t=!1){if(!this.hass||!this._config)return this._error="Card not fully configured yet.",void this.requestUpdate();this._error=void 0;const e=this.hass.states[this._config.entity_min],i=this.hass.states[this._config.entity_max],n=this._config.entity_value?this.hass.states[this._config.entity_value]:void 0,a=this._config.min_entity?this.hass.states[this._config.min_entity]:void 0,s=this._config.max_entity?this.hass.states[this._config.max_entity]:void 0,o=this._config.step_entity?this.hass.states[this._config.step_entity]:void 0;if(!e)return this._error=`Entity not found: ${this._config.entity_min}`,void this.requestUpdate();if(!i)return this._error=`Entity not found: ${this._config.entity_max}`,void this.requestUpdate();this._config.entity_value&&!n&&console.warn(`Range Slider Card: Optional entity ${this._config.entity_value} not found.`),this._config.min_entity&&!a&&console.warn(`Range Slider Card: Optional entity ${this._config.min_entity} not found.`),this._config.max_entity&&!s&&console.warn(`Range Slider Card: Optional entity ${this._config.max_entity} not found.`),this._config.step_entity&&!o&&console.warn(`Range Slider Card: Optional entity ${this._config.step_entity} not found.`);const r=(t,e,i=!0,n=!1)=>{if(!t||!e)return null;const a=t.state;if("unavailable"===a||"unknown"===a){const t=`Invalid state for ${e}: ${a}`;return e===this._config.entity_min||e===this._config.entity_max||e===this._config.min_entity||e===this._config.max_entity||e===this._config.step_entity?void(this._error=t):(console.warn(`Range Slider Card: ${t}. Ignoring value.`),null)}const s=parseFloat(a);if(isNaN(s))return e===this._config.entity_min||e===this._config.entity_max||e===this._config.min_entity||e===this._config.max_entity||e===this._config.step_entity?void(this._error=`Invalid numeric state for ${e}: ${a}`):(console.warn(`Range Slider Card: Invalid numeric state for ${e}: ${a}. Ignoring value.`),null);if(i||0!==s){if(!(n&&s<=0))return s;this._error=`Invalid state for ${e}: must be positive (${s})`}else this._error=`Invalid state for ${e}: must not be zero`},l=r(a,this._config.min_entity)??this._config.min??0,h=r(s,this._config.max_entity)??this._config.max??100;let c=r(o,this._config.step_entity,!1,!0)??this._config.step??1;if(c=c>0?c:1,this._error)return void this.requestUpdate();if(l>=h)return this._error=`Min limit (${l}) must be less than Max limit (${h})`,void this.requestUpdate();const d=r(e,this._config.entity_min),u=r(i,this._config.entity_max),_=r(n,this._config.entity_value);if(void 0===d||void 0===u)return void this.requestUpdate();let p=this._clampAndStep(d,l,h,c),g=this._clampAndStep(u,l,h,c),m=null!==_?this._clampAndStep(_,l,h,c):null;if(p>g&&(console.warn(`Range Slider Card: Corrected invalid state where min (${p}) > max (${g}). Adjusting max.`),g=this._clampAndStep(p+1*c,p+1*c,h,c),p>g&&(p=this._clampAndStep(g-1*c,l,g-1*c,c)),p>g))return this._error=`Internal Error: Cannot resolve min (${p}) > max (${g}). Check limits and step configuration.`,void this.requestUpdate();let f=void 0!==this._error;this._error=void 0,this._isDraggingMin&&!t||this._minValue===p||(this._minValue=p,f=!0),this._isDraggingMax&&!t||this._maxValue===g||(this._maxValue=g,f=!0),this._currentValue!==m&&(this._currentValue=m,f=!0),this._minValue>this._maxValue&&(this._error=`Internal Error: Final check failed - Min value (${this._minValue}) > Max value (${this._maxValue})`,f=!0),f&&this.requestUpdate()}_renderError(t){return B`
      <ha-card class="error-card">
        <hui-warning>${t}</hui-warning>
      </ha-card>
    `}_getEffectiveMin(){const t=this._config?.min_entity?this.hass?.states[this._config.min_entity]:void 0;if(t&&"unavailable"!==t.state&&"unknown"!==t.state){const e=parseFloat(t.state);if(!isNaN(e))return e}return this._config?.min??0}_getEffectiveMax(){const t=this._config?.max_entity?this.hass?.states[this._config.max_entity]:void 0;if(t&&"unavailable"!==t.state&&"unknown"!==t.state){const e=parseFloat(t.state);if(!isNaN(e))return e}return this._config?.max??100}_getEffectiveStep(){let t=this._config?.step??1;const e=this._config?.step_entity?this.hass?.states[this._config.step_entity]:void 0;if(e&&"unavailable"!==e.state&&"unknown"!==e.state){const i=parseFloat(e.state);!isNaN(i)&&i>0&&(t=i)}return t>0?t:1}_clampAndStep(t,e,i,n){if(null==t||isNaN(t)||isNaN(e)||isNaN(i)||isNaN(n)||n<=0)return e;const a=Math.max(e,Math.min(t,i)),s=Math.round((a-e)/n),o=this._getPrecision(n),r=parseFloat((e+s*n).toFixed(o));return Math.max(e,Math.min(r,i))}_getPrecision(t){if(null==t||isNaN(t))return 0;const e=String(t);if(e.includes(".")){if(e.toLowerCase().includes("e"))try{return parseInt(e.split("-")[1],10)||0}catch{return 0}return e.split(".")[1]?.length||0}return 0}_formatValue(t){if(null==t||isNaN(t))return"";const e=this._getEffectiveStep();return t.toFixed(this._getPrecision(e))}_formatValueText(t){if(null==t||isNaN(t))return"";const e=this._config?.unit??"";return`${this._formatValue(t)}${e?` ${e}`:""}`}_calculateValueFromPosition(t,e){const i=this._getEffectiveMin(),n=this._getEffectiveMax(),a=this._getEffectiveStep();let s;if("vertical"===this._config.orientation){const i=e.height,n=Math.max(e.top,Math.min(t,e.bottom));s=0===i?0:Math.max(0,Math.min(1,(e.bottom-n)/i))}else{const i=e.width,n=Math.max(e.left,Math.min(t,e.right));s=0===i?0:Math.max(0,Math.min(1,(n-e.left)/i))}const o=i+s*(n-i);return this._clampAndStep(o,i,n,a)}_setEntityValue(t,e){if(!this.hass||!this._config||!t||null==e||isNaN(e))return;if(this._config.read_only)return;if(t===this._config.entity_min&&this._config.read_only_min)return;if(t===this._config.entity_max&&this._config.read_only_max)return;const i=this.hass.states[t],n=i?parseFloat(i.state):NaN,a=this._getEffectiveStep(),s=this._getPrecision(a),o=parseFloat(e.toFixed(s));isNaN(o)?console.error(`Range Slider Card: Attempted to set invalid value (${e}) for ${t}`):isNaN(n)||n.toFixed(s)!==o.toFixed(s)?(console.debug(`Range Slider Card: Calling input_number.set_value for ${t} with value ${o}`),this.hass.callService("input_number","set_value",{entity_id:t,value:o})):console.debug(`Range Slider Card: Value for ${t} unchanged (${o}), skipping service call.`)}_addGlobalListeners(){window.addEventListener("mousemove",this._handleMove,{passive:!1}),window.addEventListener("mouseup",this._handleUp,{passive:!1}),window.addEventListener("touchmove",this._handleMove,{passive:!1}),window.addEventListener("touchend",this._handleUp,{passive:!1}),window.addEventListener("touchcancel",this._handleUp,{passive:!1})}_removeGlobalListeners(){window.removeEventListener("mousemove",this._handleMove),window.removeEventListener("mouseup",this._handleUp),window.removeEventListener("touchmove",this._handleMove),window.removeEventListener("touchend",this._handleUp),window.removeEventListener("touchcancel",this._handleUp)}_handleFocus(t){this._config?.read_only||(this._activeHandle=t)}_handleBlur(){setTimeout((()=>{this.shadowRoot&&!this.shadowRoot.activeElement?.classList.contains("slider-handle")&&(this._activeHandle=null)}),100)}_handleMinDown(t){this._config?.read_only||this._config?.read_only_min||this._isDraggingMax||t instanceof MouseEvent&&0!==t.button||(t.stopPropagation(),this._isDraggingMin=!0,this._tooltipValueMin=this._minValue,this._addGlobalListeners(),this.shadowRoot?.querySelector(".min-handle")?.focus(),this._activeHandle="min")}_handleMaxDown(t){this._config?.read_only||this._config?.read_only_max||this._isDraggingMin||t instanceof MouseEvent&&0!==t.button||(t.stopPropagation(),this._isDraggingMax=!0,this._tooltipValueMax=this._maxValue,this._addGlobalListeners(),this.shadowRoot?.querySelector(".max-handle")?.focus(),this._activeHandle="max")}_handleMove(t){if(!this._isDraggingMin&&!this._isDraggingMax||!this._config)return;t instanceof TouchEvent&&"vertical"===this._config.orientation&&t.preventDefault();const e=this.shadowRoot?.querySelector(".slider-track");if(!e)return;const i=e.getBoundingClientRect(),n="vertical"===this._config.orientation?t.touches?t.touches[0].clientY:t.clientY:t.touches?t.touches[0].clientX:t.clientX,a=this._calculateValueFromPosition(n,i),s=this._getEffectiveStep(),o=1*s,r=this._minValue,l=this._maxValue;if(this._isDraggingMin){const t=l-o,e=this._clampAndStep(a,this._getEffectiveMin(),t,s);"number"==typeof e&&(this._tooltipValueMin=e)}else if(this._isDraggingMax){const t=r+o,e=this._clampAndStep(a,t,this._getEffectiveMax(),s);"number"==typeof e&&(this._tooltipValueMax=e)}}_handleUp(t){(this._isDraggingMin||this._isDraggingMax)&&this._config&&(t.preventDefault(),t.stopPropagation(),this._isDraggingMin&&null!==this._tooltipValueMin?this._tooltipValueMin!==this._minValue&&(this._minValue=this._tooltipValueMin,this._setEntityValue(this._config.entity_min,this._minValue)):this._isDraggingMax&&null!==this._tooltipValueMax&&this._tooltipValueMax!==this._maxValue&&(this._maxValue=this._tooltipValueMax,this._setEntityValue(this._config.entity_max,this._maxValue)),this._isDraggingMin=!1,this._isDraggingMax=!1,this._tooltipValueMin=null,this._tooltipValueMax=null,this._removeGlobalListeners(),this.requestUpdate())}_handleKeyDown(t){if(!this._config||this._config.read_only||!this._activeHandle)return;const e=this._activeHandle;if("min"===e&&this._config.read_only_min)return;if("max"===e&&this._config.read_only_max)return;const i=this._getEffectiveStep(),n=this._getEffectiveMin(),a=this._getEffectiveMax(),s=1*i,o=this._minValue,r=this._maxValue;let l="min"===e?o:r,h=!1,c=0;switch(t.key){case"ArrowLeft":c="horizontal"===this._config.orientation?-i:0;break;case"ArrowRight":c="horizontal"===this._config.orientation?i:0;break;case"ArrowDown":c="vertical"===this._config.orientation?-i:0;break;case"ArrowUp":c="vertical"===this._config.orientation?i:0;break;case"Home":l="min"===e?n:o+s,h=!0;break;case"End":l="max"===e?a:r-s,h=!0;break;default:return}if((0!==c||h)&&(t.preventDefault(),t.stopPropagation(),0!==c&&(l+=c,h=!0),h)){let t;if("min"===e){const e=r-s;t=this._clampAndStep(l,n,e,i),t!==this._minValue&&(this._minValue=t,this._setEntityValue(this._config.entity_min,t))}else{const e=o+s;t=this._clampAndStep(l,e,a,i),t!==this._maxValue&&(this._maxValue=t,this._setEntityValue(this._config.entity_max,t))}}}_handleTrackClick(t){if(!this._config||this._config.read_only||this._isDraggingMin||this._isDraggingMax)return;if(t.target?.classList.contains("slider-handle"))return;t.stopPropagation();const e=this.shadowRoot?.querySelector(".slider-track");if(!e)return;const i=e.getBoundingClientRect(),n="vertical"===this._config.orientation?t.clientY:t.clientX,a=this._calculateValueFromPosition(n,i),s=this._minValue,o=this._maxValue,r=Math.abs(a-s),l=Math.abs(a-o),h=this._getEffectiveStep(),c=1*h,d=this._getEffectiveMin(),u=this._getEffectiveMax();if(r<=l||a<s){if(this._config.read_only_min)return;const t=o-c,e=this._clampAndStep(a,d,t,h);e!==this._minValue&&(this._minValue=e,this._setEntityValue(this._config.entity_min,e),this.shadowRoot?.querySelector(".min-handle")?.focus())}else{if(this._config.read_only_max)return;const t=s+c,e=this._clampAndStep(a,t,u,h);e!==this._maxValue&&(this._maxValue=e,this._setEntityValue(this._config.entity_max,e),this.shadowRoot?.querySelector(".max-handle")?.focus())}}_handleInputChange(t,e){if(!this._config||this._config.read_only)return;if("min"===e&&this._config.read_only_min)return;if("max"===e&&this._config.read_only_max)return;const i=t.target,n=parseFloat(i.value),a=this._getEffectiveMin(),s=this._getEffectiveMax(),o=this._getEffectiveStep(),r=1*o,l=this._minValue,h=this._maxValue;let c;if(isNaN(n))i.value=this._formatValue("min"===e?l:h);else{if("min"===e){const t=h-r;c=this._clampAndStep(n,a,t,o),c!==this._minValue&&(this._minValue=c,this._setEntityValue(this._config.entity_min,c))}else{const t=l+r;c=this._clampAndStep(n,t,s,o),c!==this._maxValue&&(this._maxValue=c,this._setEntityValue(this._config.entity_max,c))}i.value=this._formatValue(c)}}_handleCardAction(t){!t.composedPath().some((t=>t instanceof HTMLElement&&(t.classList?.contains("slider-handle")||t.classList?.contains("slider-track")||"INPUT"===t.tagName)))&&this.hass&&this._config&&t.detail.action&&(t.stopPropagation(),function(t,e,i,n){var a;"double_tap"===n&&i.double_tap_action?a=i.double_tap_action:"hold"===n&&i.hold_action?a=i.hold_action:"tap"===n&&i.tap_action&&(a=i.tap_action),ft(t,e,i,a)}(this,this.hass,this._config,t.detail.action))}_getBarStyle(t,e){const i=Math.max(0,Math.min(100,t)),n=Math.max(0,Math.min(100,e)),a=Math.max(0,n-i);if("vertical"===this._config?.orientation){return`bottom: ${`${i}%`}; height: ${`${a}%`}; left: 0; right: 0;`}return`left: ${`${i}%`}; width: ${`${a}%`}; top: 0; bottom: 0;`}_getHandleStyle(t){const e=Math.max(0,Math.min(100,t));return"vertical"===this._config?.orientation?`bottom: ${e}%;`:`left: ${e}%;`}_getMarkerStyle(t){if(null===t)return"display: none;";const e=Math.max(0,Math.min(100,t));return"vertical"===this._config?.orientation?`bottom: ${e}%;`:`left: ${e}%;`}static async getConfigElement(){return await Promise.resolve().then((function(){return bt})),document.createElement("range-slider-card-editor")}static getStubConfig(t,e){let i="input_number.min_example",n="input_number.max_example";if(t&&e){const t=e.filter((t=>t.startsWith("input_number.")));t.length>0&&(i=t[0]),t.length>1&&(n=t[1])}return{type:"custom:range-slider-card",entity_min:i,entity_max:n,name:"Range Slider"}}static get styles(){return o`
      :host {
        display: block;
        --range-slider-bar-color: var(--paper-slider-active-color, var(--primary-color));
        --range-slider-track-color: var(--paper-slider-secondary-color, var(--secondary-background-color));
        --range-slider-handle-color: var(--paper-slider-knob-color, var(--primary-color));
        --range-slider-handle-focus-color: var(--paper-slider-knob-color, var(--primary-color));
        --range-slider-handle-active-color: var(--paper-slider-pin-color, var(--primary-color));
        --range-slider-handle-size: 20px;
        --range-slider-track-height: 4px;
        --range-slider-value-marker-color: var(--state-icon-active-color, var(--primary-color));
        --range-slider-value-marker-size: 8px;
        --range-slider-tooltip-background-color: var(--primary-text-color);
        --range-slider-tooltip-text-color: var(--primary-background-color);
        --range-slider-input-border-color: var(--divider-color);
        --range-slider-input-background-color: var(--ha-card-background, var(--card-background-color, white));
        --range-slider-input-text-color: var(--primary-text-color);
        --range-slider-handle-transition: left 0.15s ease-out, bottom 0.15s ease-out;
      }
      ha-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
      }
      .card-content {
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        flex-grow: 1;
        box-sizing: border-box;
      }
      :host(.vertical) .card-content {
        flex-direction: row;
        align-items: center;
      }
      .slider-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: calc(var(--range-slider-handle-size) / 2 + 2px) 0;
        min-height: var(--range-slider-handle-size);
        cursor: pointer;
      }
      :host(.read-only) .slider-container {
        cursor: default;
      }
      :host(.vertical) .slider-container {
        padding: 0 calc(var(--range-slider-handle-size) / 2 + 2px);
        min-width: var(--range-slider-handle-size);
        height: 150px;
        align-self: stretch;
      }
      .slider-track {
        position: relative;
        background-color: var(--range-slider-track-color);
        border-radius: calc(var(--range-slider-track-height) / 2);
        width: 100%;
        height: var(--range-slider-track-height);
      }
      :host(.vertical) .slider-track {
        width: var(--range-slider-track-height);
        height: 100%;
      }
      .slider-bar {
        position: absolute;
        background-color: var(--range-slider-bar-color);
        border-radius: calc(var(--range-slider-track-height) / 2);
        pointer-events: none;
      }
      .slider-handle {
        position: absolute;
        width: var(--range-slider-handle-size);
        height: var(--range-slider-handle-size);
        background-color: var(--range-slider-handle-color);
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        cursor: grab;
        transform: translate(-50%, -50%);
        top: 50%;
        outline: none;
        transition: var(--range-slider-handle-transition);
        z-index: 2;
      }
      :host(.read-only) .slider-handle {
        cursor: default;
        pointer-events: none;
        background-color: var(--disabled-text-color);
      }
      .slider-handle:focus-visible {
        box-shadow: 0 0 0 3px var(--range-slider-handle-focus-color);
      }
      .slider-handle.active {
        background-color: var(--range-slider-handle-active-color);
        box-shadow: 0 0 0 3px var(--range-slider-handle-focus-color);
      }
      .slider-handle:active {
        cursor: grabbing;
        background-color: var(--range-slider-handle-active-color);
      }
      :host(.vertical) .slider-handle {
        left: 50%;
        transform: translate(-50%, 50%);
        top: auto;
      }
      .value-marker {
        position: absolute;
        width: var(--range-slider-value-marker-size);
        height: var(--range-slider-value-marker-size);
        background-color: var(--range-slider-value-marker-color);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        top: 50%;
        pointer-events: none;
        z-index: 1;
        transition: var(--range-slider-handle-transition);
      }
      :host(.vertical) .value-marker {
        left: 50%;
        transform: translate(-50%, 50%);
        top: auto;
      }
      .tooltip {
        position: absolute;
        bottom: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--range-slider-tooltip-background-color);
        color: var(--range-slider-tooltip-text-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10;
      }
      :host(.vertical) .tooltip {
        bottom: auto;
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        gap: 10px;
      }
      :host(.vertical) .info-row {
        flex-direction: column;
        justify-content: center;
        align-items: stretch;
        margin-top: 0;
        margin-left: 16px;
        gap: 8px;
        width: 100px;
      }
      .value-label {
        text-align: center;
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 50px;
      }
      :host(.vertical) .value-label {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        min-width: 0;
      }
      .value-label .label {
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 2px;
        white-space: nowrap;
      }
      :host(.vertical) .value-label .label {
        margin-bottom: 0;
        margin-right: 4px;
      }
      .value-label .value {
        font-weight: bold;
        color: var(--primary-text-color);
      }
      .value-input {
        width: 65px;
        padding: 4px;
        border: 1px solid var(--range-slider-input-border-color);
        border-radius: 4px;
        text-align: center;
        font-size: 0.9em;
        background-color: var(--range-slider-input-background-color);
        color: var(--range-slider-input-text-color);
        box-shadow: none;
        box-sizing: border-box;
        -moz-appearance: textfield;
      }
      .value-input:disabled {
        background-color: var(--disabled-text-color);
        cursor: not-allowed;
      }
      .value-input::-webkit-outer-spin-button,
      .value-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      :host(.vertical) .value-input {
        width: 55px;
      }
      .error-card {
        background-color: var(--error-color);
        color: var(--text-primary-color);
      }
      hui-warning {
        padding: 16px;
        display: block;
        color: inherit;
        text-align: center;
      }
    `}};t([ct({attribute:!1})],vt.prototype,"hass",void 0),t([dt()],vt.prototype,"_config",void 0),t([dt()],vt.prototype,"_entityMinState",void 0),t([dt()],vt.prototype,"_entityMaxState",void 0),t([dt()],vt.prototype,"_entityValueState",void 0),t([dt()],vt.prototype,"_minLimitState",void 0),t([dt()],vt.prototype,"_maxLimitState",void 0),t([dt()],vt.prototype,"_stepState",void 0),t([dt()],vt.prototype,"_minValue",void 0),t([dt()],vt.prototype,"_maxValue",void 0),t([dt()],vt.prototype,"_currentValue",void 0),t([dt()],vt.prototype,"_error",void 0),t([dt()],vt.prototype,"_isDraggingMin",void 0),t([dt()],vt.prototype,"_isDraggingMax",void 0),t([dt()],vt.prototype,"_tooltipValueMin",void 0),t([dt()],vt.prototype,"_tooltipValueMax",void 0),t([dt()],vt.prototype,"_activeHandle",void 0),vt=t([rt("range-slider-card")],vt),window.customCards=window.customCards||[],window.customCards.push({type:"range-slider-card",name:"Range Slider Card",description:"An interactive range slider linked to two input_number entities.",preview:!0,documentationURL:"https://github.com/dbarciela/range-slider-card/"});const yt=["horizontal","vertical"];let $t=class extends st{setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return B``;const t=(t,e=void 0)=>this._config[t]??e;return B`
      <div class="card-config">
        <ha-alert alert-type="info" title="Range Slider Card Config">Configure as opções do seu cartão.</ha-alert>

        <section>
          <h3>Entidades Principais</h3>
          <ha-entity-picker
            .hass=${this.hass}
            .label="Entidade Mínima (Obrigatório)"
                  .value=${t("entity_min")}
                  .configValue=${"entity_min"}
                  .includeDomains=${["input_number"]}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
                  required
                ></ha-entity-picker>
                <ha-entity-picker
                  .hass=${this.hass}
                  .label="Entidade Máxima (Obrigatório)"
                  .value=${t("entity_max")}
                  .configValue=${"entity_max"}
                  .includeDomains=${["input_number"]}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
                  required
                ></ha-entity-picker>
                <ha-entity-picker
                  .hass=${this.hass}
                  .label="Entidade de Valor (Opcional, para marcador)"
                  .value=${t("entity_value")}
                  .configValue=${"entity_value"}
                  .includeDomains=${["sensor","input_number"]}
                  allow-custom-entity
                  @value-changed=${this._valueChanged}
          ></ha-entity-picker>
        </section>

        <section>
          <!-- Removed H3 Title: Título e Unidade -->
          <ha-textfield
            .label="Nome do Cartão (Opcional)"
            .value=${t("name","Range Slider")}
            .configValue=${"name"}
            @input=${this._valueChanged}
          ></ha-textfield>
          <ha-textfield
            .label="Unidade (Opcional, ex: °C, %)"
            .value=${t("unit","")}
            .configValue=${"unit"}
            @input=${this._valueChanged}
          ></ha-textfield>
        </section>

        <section>
          <!-- Removed H3 Title: Limites e Passo da Escala -->
          <div class="side-by-side">
            <ha-textfield
              .label="Mínimo Absoluto"
              type="number"
              .value=${String(t("min",0))}
              .configValue=${"min"}
              @input=${this._valueChanged}
              .disabled=${!!this._config.min_entity}
              title=${this._config.min_entity?"Desativado porque 'Entidade Mín.' está definida":"Valor mínimo da escala"}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Mín. (Substitui Mín. Absoluto)"
              .value=${t("min_entity")}
              .configValue=${"min_entity"}
              .includeDomains=${["sensor","input_number"]}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
          <div class="side-by-side">
            <ha-textfield
              .label="Máximo Absoluto"
              type="number"
              .value=${String(t("max",100))}
              .configValue=${"max"}
              @input=${this._valueChanged}
              .disabled=${!!this._config.max_entity}
              title=${this._config.max_entity?"Desativado porque 'Entidade Máx.' está definida":"Valor máximo da escala"}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Máx. (Substitui Máx. Absoluto)"
              .value=${t("max_entity")}
              .configValue=${"max_entity"}
              .includeDomains=${["sensor","input_number"]}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
          <div class="side-by-side">
            <ha-textfield
              .label="Passo (Step)"
              type="number"
              .value=${String(t("step",1))}
              .configValue=${"step"}
              step="any"
              min="0.000001"
              @input=${this._valueChanged}
              .disabled=${!!this._config.step_entity}
              title=${this._config.step_entity?"Desativado porque 'Entidade Passo' está definida":"Incremento do slider"}
            ></ha-textfield>
            <ha-entity-picker
              .hass=${this.hass}
              .label="Entidade Passo (Substitui Passo)"
              .value=${t("step_entity")}
              .configValue=${"step_entity"}
              .includeDomains=${["sensor","input_number"]}
              allow-custom-entity
              @value-changed=${this._valueChanged}
            ></ha-entity-picker>
          </div>
        </section>

        <section>
          <h3>Aparência e Funcionalidade</h3>
          <ha-select
            .label="Orientação"
            .value=${t("orientation","horizontal")}
            .configValue=${"orientation"}
            @selected=${this._handleSelectChanged}
            @closed=${t=>t.stopPropagation()}
            fixedMenuPosition
            naturalMenuWidth
          >
            ${yt.map((t=>B`<mwc-list-item .value=${t}>${this._capitalize(t)}</mwc-list-item>`))}
          </ha-select>

          <ha-formfield .label=${"Modo Apenas Leitura"}>
            <ha-switch
              .checked=${Boolean(t("read_only",!1))}
              .configValue=${"read_only"}
              @change=${this._valueChanged}
              title=${"Define se todo o slider é apenas leitura"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Apenas Leitura (Mínimo)"}>
            <ha-switch
              .checked=${Boolean(t("read_only_min",t("read_only",!1)))}
              .configValue=${"read_only_min"}
              @change=${this._valueChanged}
              .disabled=${Boolean(t("read_only",!1))}
              title=${"Define se o puxador mínimo é apenas leitura (ignorado se 'Modo Apenas Leitura' global estiver ativo)"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Apenas Leitura (Máximo)"}>
            <ha-switch
              .checked=${Boolean(t("read_only_max",t("read_only",!1)))}
              .configValue=${"read_only_max"}
              @change=${this._valueChanged}
              .disabled=${Boolean(t("read_only",!1))}
              title=${"Define se o puxador máximo é apenas leitura (ignorado se 'Modo Apenas Leitura' global estiver ativo)"}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Mostrar Intervalo (Max - Min)"}>
            <ha-switch
              .checked=${Boolean(t("show_range",!1))}
              .configValue=${"show_range"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Mostrar Inputs Numéricos (Min/Max)"}>
            <ha-switch
              .checked=${Boolean(t("show_inputs",!1))}
              .configValue=${"show_inputs"}
              @change=${this._valueChanged}
              .disabled=${t("read_only",!1)}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Mostrar Tooltips nos Puxadores"}>
            <ha-switch
              .checked=${Boolean(t("show_tooltips",!1))}
              .configValue=${"show_tooltips"}
              @change=${this._valueChanged}
            ></ha-switch>
          </ha-formfield>
          <ha-formfield .label=${"Mostrar Marcador de Valor (Requer 'Entidade de Valor' selecionada)"}>
            <ha-switch
              .checked=${Boolean(t("show_value_marker",!1))}
              .configValue=${"show_value_marker"}
              @change=${this._valueChanged}
              .disabled=${!this._config.entity_value}
            ></ha-switch>
          </ha-formfield>
        </section>

        <section>
          <h3>Interações (Ações)</h3>
          <ha-form-action
            .label=${"Ação ao Tocar (Tap Action)"}
            .hass=${this.hass}
            .config=${t("tap_action",{action:"more-info"})}
            .configValue=${"tap_action"}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
          <ha-form-action
            .label=${"Ação ao Manter Premido (Hold Action)"}
            .hass=${this.hass}
            .config=${t("hold_action")}
            .configValue=${"hold_action"}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
          <ha-form-action
            .label=${"Ação ao Tocar Duas Vezes (Double Tap Action)"}
            .hass=${this.hass}
            .config=${t("double_tap_action")}
            .configValue=${"double_tap_action"}
            @value-changed=${this._valueChanged}
          ></ha-form-action>
        </section>
      </div>
    `}_handleSelectChanged(t){if(!this._config)return;const e=t.currentTarget,i=e.configValue;if(i&&e.value){const t=e.value;this._updateConfig(i,t)}}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e?.configValue;if(!i)return;let n;if("HA-SWITCH"===e.tagName)n=e.checked;else if("HA-FORM-ACTION"===e.tagName)n=t?.detail?.value;else if("number"===e.type){const t=e.value;n=""===t||null==t?void 0:parseFloat(String(t)),isNaN(n)&&(n=void 0)}else n=e.value;this._updateConfig(i,n)}_updateConfig(t,e){if(!this._config)return;const i=this._getDefaultValue(t),n={...this._config};!(""!==e&&null!=e&&e!==i||"entity_min"===t||"entity_max"===t||!1===e&&"boolean"==typeof i)?delete n[t]:n[t]=e,this._config=n,gt(this,"config-changed",{config:this._config})}_getDefaultValue(t){switch(t){case"name":return"Range Slider";case"min":return 0;case"max":return 100;case"step":return 1;case"unit":return"";case"orientation":return"horizontal";case"read_only":case"read_only_min":case"read_only_max":case"read_only_value":case"show_range":case"show_inputs":case"show_tooltips":case"show_value_marker":return!1;case"tap_action":return{action:"more-info"};default:return}}_capitalize(t){return t?t.charAt(0).toUpperCase()+t.slice(1):t}static get styles(){return o`
      .card-config {
        padding: 0 16px 16px 16px;
      }
      section {
        margin-top: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--divider-color);
      }
      section:last-of-type {
        border-bottom: none;
      }
      h3 {
        margin-top: 0;
        margin-bottom: 8px;
        color: var(--primary-text-color);
        font-weight: 500;
        font-size: 1.1em; /* Ligeiramente maior */
      }
      ha-alert {
        display: block;
        margin-bottom: 16px;
        border-radius: var(--ha-card-border-radius, 4px);
      }
      ha-entity-picker,
      ha-textfield,
      ha-select,
      ha-form-action {
        display: block;
        margin-bottom: 12px;
      }
      ha-formfield {
        display: block;
        margin-bottom: 8px;
        padding-left: 8px;
      }
      .side-by-side {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 12px;
      }
      .side-by-side > * {
        margin-bottom: 0;
      }
      ha-textfield[disabled] {
        opacity: 0.7;
      }
      ha-select {
        width: 100%;
      }
      /* Adiciona algum espaçamento antes das secções */
      section + section {
        margin-top: 24px;
      }
    `}};t([ct({attribute:!1})],$t.prototype,"hass",void 0),t([dt()],$t.prototype,"_config",void 0),$t=t([rt("range-slider-card-editor")],$t),customElements.get("range-slider-card-editor")||customElements.define("range-slider-card-editor",$t);var bt=Object.freeze({__proto__:null,get RangeSliderCardEditor(){return $t}});export{vt as RangeSliderCard};
