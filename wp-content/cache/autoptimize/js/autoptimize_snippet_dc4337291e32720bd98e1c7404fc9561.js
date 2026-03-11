(()=>{"use strict";var __webpack_modules__=({"./src/frontend/app/src/constants.ts":
/*!*******************************************!*\
  !*** ./src/frontend/app/src/constants.ts ***!
  \*******************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{Events:()=>(Events),"default":()=>(__WEBPACK_DEFAULT_EXPORT__)});const Constants={defaultSearchInputSelector:'input[name="s"], input[name="q"]',defaultSearchResultsSelector:'.static-snap-search-results'};const Events={FORM_SUBMITTED_EVENT:'@staticsnap/form/submitted',FORM_SUBMIT_ERROR_EVENT:'@staticsnap/form/submit-error'};const __WEBPACK_DEFAULT_EXPORT__=(Constants);}),"./src/frontend/app/src/form/form-base.ts":
/*!************************************************!*\
  !*** ./src/frontend/app/src/form/form-base.ts ***!
  \************************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(FormBase)});var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! @wordpress/i18n */
"@wordpress/i18n");var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);var _constants__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! ../constants */
"./src/frontend/app/src/constants.ts");class FormBase{forms=null;selector='[data-static-snap-type="form"]';submitButtonSelector='[type="submit"]';constructor(selector){if(selector){this.selector=selector;}
if(['powcaptcha','recaptcha'].includes(StaticSnapFrontendConfig.captcha_type)){if(StaticSnapFrontendConfig.captcha_type==='recaptcha'){this.loadGoogleRecaptcha();}else if(StaticSnapFrontendConfig.captcha_type==='powcaptcha'){this.loadPowCaptcha();}}
this.bindEvents();}
getFormSettings=responseData=>{const defaultSettings={messages:{error:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An error occurred while submitting the form','static-snap'),invalid:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please enter a valid value.','static-snap'),required:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This field is required.','static-snap'),success:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The form was sent successfully.','static-snap')}};if(!responseData.type||responseData.type!=='item'){return defaultSettings;}
return{...defaultSettings,...responseData.data.websiteForm?.website_form_settings};};getNoticeMessageSettings=form=>{const defaultMessageSettings={error_message:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('An error occurred while submitting the form','static-snap'),invalid_message:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Please enter a valid value.','static-snap'),required_field_message:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('This field is required.','static-snap'),success_message:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('The form was sent successfully.','static-snap'),type:'message'};const messageSettings=form.dataset?.staticSnapFormNoticeSettings;if(!messageSettings){return defaultMessageSettings;}
try{return{...defaultMessageSettings,...JSON.parse(messageSettings)};}catch(_e){return defaultMessageSettings;}};getNoticeMessageOrRedirect=(form,type)=>{const messageSettings=this.getNoticeMessageSettings(form);if(messageSettings.type==='redirect'&&type==='success'&&messageSettings.redirect_url){}
const messageMap={error:messageSettings.error_message,field_error:messageSettings.required_field_message,invalid_error:messageSettings.invalid_message,success:messageSettings.success_message};return messageMap[type]||'';};loadPowCaptcha=()=>{const script=document.createElement('script');script.src='https://js.powcaptcha.com/widget.js';script.async=true;script.defer=true;script.type='module';document.head.appendChild(script);};loadGoogleRecaptcha=()=>{const script=document.createElement('script');script.src=`https://www.google.com/recaptcha/api.js?render=${StaticSnapFrontendConfig.captcha_site_key}`;script.async=true;script.defer=true;document.head.appendChild(script);};getForms=()=>{return document.querySelectorAll(this.selector);};unbindSubmitEvents=form=>{setTimeout(()=>{jQuery(form).off('submit');},500);};bindEvents=()=>{this.forms=this.getForms();this.forms.forEach(form=>{if(form.getAttribute('data-static-snap-initialized')==='true'){return;}
this.unbindSubmitEvents(form);if(StaticSnapFrontendConfig.captcha_type==='powcaptcha'){const powcaptchaWidget=document.createElement('powcaptcha-widget');powcaptchaWidget.setAttribute('data-app-id',StaticSnapFrontendConfig.captcha_site_key);powcaptchaWidget.setAttribute('data-invisible','true');form.appendChild(powcaptchaWidget);this.bindPowCaptchaEvents(form,powcaptchaWidget);}
form.addEventListener('submit',e=>this.submit(e,form));form.setAttribute('data-static-snap-initialized','true');});};bindPowCaptchaEvents=(form,powcaptchaWidget)=>{let signalsReady=false;let haveError=false;const timeoutMs=5000;powcaptchaWidget.addEventListener('@powcaptcha/widget/error',function(){if(haveError){return;}
haveError=true;console.error('Please check your PowCaptcha configuration.');});setTimeout(()=>{signalsReady=true;},timeoutMs);async function resolveIfSignalsAreReady(){try{if(!signalsReady||powcaptchaWidget.isLoading()||powcaptchaWidget.isValidated()||haveError){return;}
await powcaptchaWidget.execute();}catch(e){console.error('PowCaptcha execution failed:',e);haveError=true;}}
const fields=form.querySelectorAll('input, textarea, select');fields.forEach(field=>{field.addEventListener('focus',resolveIfSignalsAreReady);field.addEventListener('keydown',resolveIfSignalsAreReady);});};beforeSubmit=form=>{const isFormValid=form.checkValidity();if(!isFormValid){form.reportValidity();}
return isFormValid;};submit=async(event,form)=>{event.preventDefault();if(!this.beforeSubmit(form)){return;}
form.querySelector(this.submitButtonSelector)?.setAttribute('disabled','disabled');const submitFormDataWithCaptcha=async()=>{try{let token='';if(StaticSnapFrontendConfig.captcha_type==='powcaptcha'){const powcaptchaWidget=form.querySelector('powcaptcha-widget');token=(await powcaptchaWidget?.execute())||'';}else if(StaticSnapFrontendConfig.captcha_type==='recaptcha'){token=await grecaptcha.execute(StaticSnapFrontendConfig.captcha_site_key,{action:'submit'});}
const formData=new FormData(form);const submitData=Object.fromEntries(formData);const response=await fetch(form.action,{body:JSON.stringify(submitData),headers:{'Captcha-Response':token,'Content-Type':'application/json'},method:'POST'});const responseCode=response.status;const data=await response.json();form.querySelector(this.submitButtonSelector)?.removeAttribute('disabled');if(responseCode===200){form.reset();document.dispatchEvent(new CustomEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.Events.FORM_SUBMITTED_EVENT,{detail:{data,form,submitData}}));this.onSubmit(event,form,submitData,data);}else{console.error('Error:',data);document.dispatchEvent(new CustomEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.Events.FORM_SUBMIT_ERROR_EVENT,{detail:{data,form}}));this.onError(event,form,data);}}catch(e){const error=e;document.dispatchEvent(new CustomEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.Events.FORM_SUBMIT_ERROR_EVENT,{detail:{error,form}}));this.onError(event,form,error);}};try{if(StaticSnapFrontendConfig.captcha_type==='recaptcha'){await grecaptcha.ready(submitFormDataWithCaptcha);}else{await submitFormDataWithCaptcha();}}catch(e){console.error(e);}};}}),"./src/frontend/app/src/frontend.ts":
/*!******************************************!*\
  !*** ./src/frontend/app/src/frontend.ts ***!
  \******************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(Frontend)});var _modules_search__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! ./modules/search */
"./src/frontend/app/src/modules/search.ts");var _search_fuse_search__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! ./search/fuse-search */
"./src/frontend/app/src/search/fuse-search.ts");class Frontend{constructor(){this.Search=new _modules_search__WEBPACK_IMPORTED_MODULE_0__["default"](this);this.Search.addModule(new _search_fuse_search__WEBPACK_IMPORTED_MODULE_1__["default"](this));}
config(){const defaultConfig={has_translations:false,is_admin_bar_showing:false,is_static:false,locale:null,options:{search:{frontend_settings:{},settings:{},type:'fuse-js'}},search_index_url:'/search.json'};if(typeof window.StaticSnapFrontendConfig!=='undefined'){for(const key in window.StaticSnapFrontendConfig){const keyIndex=key;if(window.StaticSnapFrontendConfig[keyIndex]==='true'){window.StaticSnapFrontendConfig[keyIndex]=true;}else if(window.StaticSnapFrontendConfig[keyIndex]==='false'){window.StaticSnapFrontendConfig[keyIndex]=false;}}
return{...defaultConfig,...window.StaticSnapFrontendConfig};}
return defaultConfig;}}}),"./src/frontend/app/src/modules/search.ts":
/*!************************************************!*\
  !*** ./src/frontend/app/src/modules/search.ts ***!
  \************************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(Search)});var _constants__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! ../constants */
"./src/frontend/app/src/constants.ts");var _search_search_box__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! ../search/search-box */
"./src/frontend/app/src/search/search-box.ts");class Search{modules=[];constructor(frontend){this.frontend=frontend;const frontendSearchSettings=frontend.config().options?.search?.frontend_settings;this.searchBox=new _search_search_box__WEBPACK_IMPORTED_MODULE_1__["default"](this,frontendSearchSettings?.search_selector||_constants__WEBPACK_IMPORTED_MODULE_0__["default"].defaultSearchInputSelector,frontendSearchSettings?.search_results_selector||_constants__WEBPACK_IMPORTED_MODULE_0__["default"].defaultSearchResultsSelector);}
addModule(module){this.modules.push(module);}
getSearchModule(){const search=this.frontend.config().options.search;const searchModuleType=search?.type||'fuse-js';const searchModule=this.modules.filter(module=>module.getType()===searchModuleType)[0];if(!searchModule){throw new Error(`Search module ${searchModuleType} not found`);}
return searchModule;}
async search(query){return this.getSearchModule().search(query);}
async renderResults(target,results){this.getSearchModule().renderResults(target,results);}
getSearchBox(){return this.searchBox;}}}),"./src/frontend/app/src/search/fuse-search.ts":
/*!****************************************************!*\
  !*** ./src/frontend/app/src/search/fuse-search.ts ***!
  \****************************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(FuseSearch)});var fuse_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! fuse.js */
"./node_modules/fuse.js/dist/fuse.mjs");var mustache__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! mustache */
"./node_modules/mustache/mustache.mjs");class FuseSearch{constructor(frontend){this.frontend=frontend;}
getType(){return'fuse-js';}
fuse=null;searchData=[];searchIndex=null;fuse_options={distance:100,findAllMatches:true,ignoreFieldNorm:false,ignoreLocation:true,includeScore:true,keys:['title','content','excerpt','language'],shouldSort:true,threshold:0.55,useExtendedSearch:true};async search(query){const locale=this.frontend.config().locale||null;const has_translations=this.frontend.config().has_translations||false;const fuse=await this.getFuse();const extendedQuery={$and:[{$or:[{title:query},{content:query},{excerpt:query}]}]};if(locale&&has_translations){extendedQuery.$and?.push({language:`=${locale}`});}
const results=fuse.search(extendedQuery);return results;}
getOptions(){const config=this.frontend.config().options.search?.settings||{};Object.keys(config).forEach(key=>{if(key.startsWith('fuse_')){const option=key.replace('fuse_','');const value=config[key];this.fuse_options[option]=value;}});return this.fuse_options;}
async getFuse(){await this.getSearchIndex();this.fuse=new fuse_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.searchData,this.fuse_options,this.searchIndex);return this.fuse;}
async getSearchIndex(force=false){if(this.searchIndex&&!force){return this.searchIndex;}
const response=await fetch(this.frontend.config().search_index_url);this.searchData=await response.json();this.getOptions();this.searchIndex=await fuse_js__WEBPACK_IMPORTED_MODULE_1__["default"].createIndex(this.fuse_options.keys,this.searchData);return this.searchIndex;}
renderResults(target,results){const template=document.getElementById('static-snap-search-result-template')?.innerHTML;if(!template){return;}
const rendered=mustache__WEBPACK_IMPORTED_MODULE_0__["default"];const html=results.map(result=>{return'<li>'+rendered.render(template,result.item)+'</li>';}).join('');target.innerHTML='<ol>'+html+'</ol>';}}}),"./src/frontend/app/src/search/search-box.ts":
/*!***************************************************!*\
  !*** ./src/frontend/app/src/search/search-box.ts ***!
  \***************************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(SearchBox)});var _constants__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! ../constants */
"./src/frontend/app/src/constants.ts");class SearchBox{elements=null;constructor(searchModule,selector=_constants__WEBPACK_IMPORTED_MODULE_0__["default"].defaultSearchInputSelector,searchResultsSelector=_constants__WEBPACK_IMPORTED_MODULE_0__["default"].defaultSearchResultsSelector){this.selector=selector;this.searchResultsSelector=searchResultsSelector;this.searchModule=searchModule;document.addEventListener('DOMContentLoaded',this.initDomEvents.bind(this));}
initDomEvents=()=>{this.elements=document.querySelectorAll(this.selector);this.bindEvents();};getElements=()=>{if(!this.elements){return[];}
return Array.from(this.elements).filter(element=>!element.closest('#wpadminbar'));};bindEvents=()=>{const elements=this.getElements();elements&&elements.forEach(element=>{if(element.getAttribute('name')==='s'){element.setAttribute('name','q');}
const searchParams=new URLSearchParams(window.location.search);const query=searchParams.get('q');element.addEventListener('input',this.onSearch);if(query){element.setAttribute('value',query);element.value=query;const event=new Event('input');element.dispatchEvent(event);}
element.closest('form')?.addEventListener('submit',event=>{event.preventDefault();});window.addEventListener('popstate',this.onPopState);});};onPopState=_event=>{const searchParams=new URLSearchParams(window.location.search);const query=searchParams.get('q');if(query){this.getElements().forEach(element=>{element.setAttribute('value',query);element.value=query;const event=new Event('input');element.blur();element.dispatchEvent(event);});}};onSearch=async event=>{const target=event.target;if(event.isTrusted){const searchParams=new URLSearchParams(window.location.search);searchParams.set('q',target.value);window.history.pushState({q:target.value},'',`${window.location.pathname}?${searchParams.toString()}`);}
let renderTarget=target.closest('search')?.querySelector(this.searchResultsSelector)||target.closest('form')?.querySelector(this.searchResultsSelector)||target.closest('div')?.querySelector(this.searchResultsSelector);if(!renderTarget){renderTarget=document.createElement('div');renderTarget.className='static-snap-search-results';const parentSearch=target.closest('search')||target.closest('form')||target.closest('div');if(parentSearch){parentSearch.appendChild(renderTarget);}else{console.error('No suitable parent found to append search results');return;}}
const results=await this.searchModule.search(target.value);this.searchModule.renderResults(renderTarget,results);};}}),"@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
((module)=>{module.exports=window["wp"]["i18n"];}),"./node_modules/fuse.js/dist/fuse.mjs":
/*!********************************************!*\
  !*** ./node_modules/fuse.js/dist/fuse.mjs ***!
  \********************************************/
((__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(Fuse)});function isArray(value){return!Array.isArray?getTag(value)==='[object Array]':Array.isArray(value)}
const INFINITY=1/0;function baseToString(value){if(typeof value=='string'){return value}
let result=value+'';return result=='0'&&1/value==-INFINITY?'-0':result}
function toString(value){return value==null?'':baseToString(value)}
function isString(value){return typeof value==='string'}
function isNumber(value){return typeof value==='number'}
function isBoolean(value){return(value===true||value===false||(isObjectLike(value)&&getTag(value)=='[object Boolean]'))}
function isObject(value){return typeof value==='object'}
function isObjectLike(value){return isObject(value)&&value!==null}
function isDefined(value){return value!==undefined&&value!==null}
function isBlank(value){return!value.trim().length}
function getTag(value){return value==null?value===undefined?'[object Undefined]':'[object Null]':Object.prototype.toString.call(value)}
const EXTENDED_SEARCH_UNAVAILABLE='Extended search is not available';const INCORRECT_INDEX_TYPE="Incorrect 'index' type";const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY=(key)=>`Invalid value for key ${key}`;const PATTERN_LENGTH_TOO_LARGE=(max)=>`Pattern length exceeds max of ${max}.`;const MISSING_KEY_PROPERTY=(name)=>`Missing ${name} property in key`;const INVALID_KEY_WEIGHT_VALUE=(key)=>`Property 'weight' in key '${key}' must be a positive integer`;const hasOwn=Object.prototype.hasOwnProperty;class KeyStore{constructor(keys){this._keys=[];this._keyMap={};let totalWeight=0;keys.forEach((key)=>{let obj=createKey(key);this._keys.push(obj);this._keyMap[obj.id]=obj;totalWeight+=obj.weight;});this._keys.forEach((key)=>{key.weight/=totalWeight;});}
get(keyId){return this._keyMap[keyId]}
keys(){return this._keys}
toJSON(){return JSON.stringify(this._keys)}}
function createKey(key){let path=null;let id=null;let src=null;let weight=1;let getFn=null;if(isString(key)||isArray(key)){src=key;path=createKeyPath(key);id=createKeyId(key);}else{if(!hasOwn.call(key,'name')){throw new Error(MISSING_KEY_PROPERTY('name'))}
const name=key.name;src=name;if(hasOwn.call(key,'weight')){weight=key.weight;if(weight<=0){throw new Error(INVALID_KEY_WEIGHT_VALUE(name))}}
path=createKeyPath(name);id=createKeyId(name);getFn=key.getFn;}
return{path,id,weight,src,getFn}}
function createKeyPath(key){return isArray(key)?key:key.split('.')}
function createKeyId(key){return isArray(key)?key.join('.'):key}
function get(obj,path){let list=[];let arr=false;const deepGet=(obj,path,index)=>{if(!isDefined(obj)){return}
if(!path[index]){list.push(obj);}else{let key=path[index];const value=obj[key];if(!isDefined(value)){return}
if(index===path.length-1&&(isString(value)||isNumber(value)||isBoolean(value))){list.push(toString(value));}else if(isArray(value)){arr=true;for(let i=0,len=value.length;i<len;i+=1){deepGet(value[i],path,index+1);}}else if(path.length){deepGet(value,path,index+1);}}};deepGet(obj,isString(path)?path.split('.'):path,0);return arr?list:list[0]}
const MatchOptions={includeMatches:false,findAllMatches:false,minMatchCharLength:1};const BasicOptions={isCaseSensitive:false,includeScore:false,keys:[],shouldSort:true,sortFn:(a,b)=>a.score===b.score?(a.idx<b.idx?-1:1):a.score<b.score?-1:1};const FuzzyOptions={location:0,threshold:0.6,distance:100};const AdvancedOptions={useExtendedSearch:false,getFn:get,ignoreLocation:false,ignoreFieldNorm:false,fieldNormWeight:1};var Config={...BasicOptions,...MatchOptions,...FuzzyOptions,...AdvancedOptions};const SPACE=/[^ ]+/g;function norm(weight=1,mantissa=3){const cache=new Map();const m=Math.pow(10,mantissa);return{get(value){const numTokens=value.match(SPACE).length;if(cache.has(numTokens)){return cache.get(numTokens)}
const norm=1/Math.pow(numTokens,0.5*weight);const n=parseFloat(Math.round(norm*m)/m);cache.set(numTokens,n);return n},clear(){cache.clear();}}}
class FuseIndex{constructor({getFn=Config.getFn,fieldNormWeight=Config.fieldNormWeight}={}){this.norm=norm(fieldNormWeight,3);this.getFn=getFn;this.isCreated=false;this.setIndexRecords();}
setSources(docs=[]){this.docs=docs;}
setIndexRecords(records=[]){this.records=records;}
setKeys(keys=[]){this.keys=keys;this._keysMap={};keys.forEach((key,idx)=>{this._keysMap[key.id]=idx;});}
create(){if(this.isCreated||!this.docs.length){return}
this.isCreated=true;if(isString(this.docs[0])){this.docs.forEach((doc,docIndex)=>{this._addString(doc,docIndex);});}else{this.docs.forEach((doc,docIndex)=>{this._addObject(doc,docIndex);});}
this.norm.clear();}
add(doc){const idx=this.size();if(isString(doc)){this._addString(doc,idx);}else{this._addObject(doc,idx);}}
removeAt(idx){this.records.splice(idx,1);for(let i=idx,len=this.size();i<len;i+=1){this.records[i].i-=1;}}
getValueForItemAtKeyId(item,keyId){return item[this._keysMap[keyId]]}
size(){return this.records.length}
_addString(doc,docIndex){if(!isDefined(doc)||isBlank(doc)){return}
let record={v:doc,i:docIndex,n:this.norm.get(doc)};this.records.push(record);}
_addObject(doc,docIndex){let record={i:docIndex,$:{}};this.keys.forEach((key,keyIndex)=>{let value=key.getFn?key.getFn(doc):this.getFn(doc,key.path);if(!isDefined(value)){return}
if(isArray(value)){let subRecords=[];const stack=[{nestedArrIndex:-1,value}];while(stack.length){const{nestedArrIndex,value}=stack.pop();if(!isDefined(value)){continue}
if(isString(value)&&!isBlank(value)){let subRecord={v:value,i:nestedArrIndex,n:this.norm.get(value)};subRecords.push(subRecord);}else if(isArray(value)){value.forEach((item,k)=>{stack.push({nestedArrIndex:k,value:item});});}else;}
record.$[keyIndex]=subRecords;}else if(isString(value)&&!isBlank(value)){let subRecord={v:value,n:this.norm.get(value)};record.$[keyIndex]=subRecord;}});this.records.push(record);}
toJSON(){return{keys:this.keys,records:this.records}}}
function createIndex(keys,docs,{getFn=Config.getFn,fieldNormWeight=Config.fieldNormWeight}={}){const myIndex=new FuseIndex({getFn,fieldNormWeight});myIndex.setKeys(keys.map(createKey));myIndex.setSources(docs);myIndex.create();return myIndex}
function parseIndex(data,{getFn=Config.getFn,fieldNormWeight=Config.fieldNormWeight}={}){const{keys,records}=data;const myIndex=new FuseIndex({getFn,fieldNormWeight});myIndex.setKeys(keys);myIndex.setIndexRecords(records);return myIndex}
function computeScore$1(pattern,{errors=0,currentLocation=0,expectedLocation=0,distance=Config.distance,ignoreLocation=Config.ignoreLocation}={}){const accuracy=errors/pattern.length;if(ignoreLocation){return accuracy}
const proximity=Math.abs(expectedLocation-currentLocation);if(!distance){return proximity?1.0:accuracy}
return accuracy+proximity/distance}
function convertMaskToIndices(matchmask=[],minMatchCharLength=Config.minMatchCharLength){let indices=[];let start=-1;let end=-1;let i=0;for(let len=matchmask.length;i<len;i+=1){let match=matchmask[i];if(match&&start===-1){start=i;}else if(!match&&start!==-1){end=i-1;if(end-start+1>=minMatchCharLength){indices.push([start,end]);}
start=-1;}}
if(matchmask[i-1]&&i-start>=minMatchCharLength){indices.push([start,i-1]);}
return indices}
const MAX_BITS=32;function search(text,pattern,patternAlphabet,{location=Config.location,distance=Config.distance,threshold=Config.threshold,findAllMatches=Config.findAllMatches,minMatchCharLength=Config.minMatchCharLength,includeMatches=Config.includeMatches,ignoreLocation=Config.ignoreLocation}={}){if(pattern.length>MAX_BITS){throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))}
const patternLen=pattern.length;const textLen=text.length;const expectedLocation=Math.max(0,Math.min(location,textLen));let currentThreshold=threshold;let bestLocation=expectedLocation;const computeMatches=minMatchCharLength>1||includeMatches;const matchMask=computeMatches?Array(textLen):[];let index;while((index=text.indexOf(pattern,bestLocation))>-1){let score=computeScore$1(pattern,{currentLocation:index,expectedLocation,distance,ignoreLocation});currentThreshold=Math.min(score,currentThreshold);bestLocation=index+patternLen;if(computeMatches){let i=0;while(i<patternLen){matchMask[index+i]=1;i+=1;}}}
bestLocation=-1;let lastBitArr=[];let finalScore=1;let binMax=patternLen+textLen;const mask=1<<(patternLen-1);for(let i=0;i<patternLen;i+=1){let binMin=0;let binMid=binMax;while(binMin<binMid){const score=computeScore$1(pattern,{errors:i,currentLocation:expectedLocation+binMid,expectedLocation,distance,ignoreLocation});if(score<=currentThreshold){binMin=binMid;}else{binMax=binMid;}
binMid=Math.floor((binMax-binMin)/2+binMin);}
binMax=binMid;let start=Math.max(1,expectedLocation-binMid+1);let finish=findAllMatches?textLen:Math.min(expectedLocation+binMid,textLen)+patternLen;let bitArr=Array(finish+2);bitArr[finish+1]=(1<<i)-1;for(let j=finish;j>=start;j-=1){let currentLocation=j-1;let charMatch=patternAlphabet[text.charAt(currentLocation)];if(computeMatches){matchMask[currentLocation]=+!!charMatch;}
bitArr[j]=((bitArr[j+1]<<1)|1)&charMatch;if(i){bitArr[j]|=((lastBitArr[j+1]|lastBitArr[j])<<1)|1|lastBitArr[j+1];}
if(bitArr[j]&mask){finalScore=computeScore$1(pattern,{errors:i,currentLocation,expectedLocation,distance,ignoreLocation});if(finalScore<=currentThreshold){currentThreshold=finalScore;bestLocation=currentLocation;if(bestLocation<=expectedLocation){break}
start=Math.max(1,2*expectedLocation-bestLocation);}}}
const score=computeScore$1(pattern,{errors:i+1,currentLocation:expectedLocation,expectedLocation,distance,ignoreLocation});if(score>currentThreshold){break}
lastBitArr=bitArr;}
const result={isMatch:bestLocation>=0,score:Math.max(0.001,finalScore)};if(computeMatches){const indices=convertMaskToIndices(matchMask,minMatchCharLength);if(!indices.length){result.isMatch=false;}else if(includeMatches){result.indices=indices;}}
return result}
function createPatternAlphabet(pattern){let mask={};for(let i=0,len=pattern.length;i<len;i+=1){const char=pattern.charAt(i);mask[char]=(mask[char]||0)|(1<<(len-i-1));}
return mask}
class BitapSearch{constructor(pattern,{location=Config.location,threshold=Config.threshold,distance=Config.distance,includeMatches=Config.includeMatches,findAllMatches=Config.findAllMatches,minMatchCharLength=Config.minMatchCharLength,isCaseSensitive=Config.isCaseSensitive,ignoreLocation=Config.ignoreLocation}={}){this.options={location,threshold,distance,includeMatches,findAllMatches,minMatchCharLength,isCaseSensitive,ignoreLocation};this.pattern=isCaseSensitive?pattern:pattern.toLowerCase();this.chunks=[];if(!this.pattern.length){return}
const addChunk=(pattern,startIndex)=>{this.chunks.push({pattern,alphabet:createPatternAlphabet(pattern),startIndex});};const len=this.pattern.length;if(len>MAX_BITS){let i=0;const remainder=len%MAX_BITS;const end=len-remainder;while(i<end){addChunk(this.pattern.substr(i,MAX_BITS),i);i+=MAX_BITS;}
if(remainder){const startIndex=len-MAX_BITS;addChunk(this.pattern.substr(startIndex),startIndex);}}else{addChunk(this.pattern,0);}}
searchIn(text){const{isCaseSensitive,includeMatches}=this.options;if(!isCaseSensitive){text=text.toLowerCase();}
if(this.pattern===text){let result={isMatch:true,score:0};if(includeMatches){result.indices=[[0,text.length-1]];}
return result}
const{location,distance,threshold,findAllMatches,minMatchCharLength,ignoreLocation}=this.options;let allIndices=[];let totalScore=0;let hasMatches=false;this.chunks.forEach(({pattern,alphabet,startIndex})=>{const{isMatch,score,indices}=search(text,pattern,alphabet,{location:location+startIndex,distance,threshold,findAllMatches,minMatchCharLength,includeMatches,ignoreLocation});if(isMatch){hasMatches=true;}
totalScore+=score;if(isMatch&&indices){allIndices=[...allIndices,...indices];}});let result={isMatch:hasMatches,score:hasMatches?totalScore/this.chunks.length:1};if(hasMatches&&includeMatches){result.indices=allIndices;}
return result}}
class BaseMatch{constructor(pattern){this.pattern=pattern;}
static isMultiMatch(pattern){return getMatch(pattern,this.multiRegex)}
static isSingleMatch(pattern){return getMatch(pattern,this.singleRegex)}
search(){}}
function getMatch(pattern,exp){const matches=pattern.match(exp);return matches?matches[1]:null}
class ExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'exact'}
static get multiRegex(){return/^="(.*)"$/}
static get singleRegex(){return/^=(.*)$/}
search(text){const isMatch=text===this.pattern;return{isMatch,score:isMatch?0:1,indices:[0,this.pattern.length-1]}}}
class InverseExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'inverse-exact'}
static get multiRegex(){return/^!"(.*)"$/}
static get singleRegex(){return/^!(.*)$/}
search(text){const index=text.indexOf(this.pattern);const isMatch=index===-1;return{isMatch,score:isMatch?0:1,indices:[0,text.length-1]}}}
class PrefixExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'prefix-exact'}
static get multiRegex(){return/^\^"(.*)"$/}
static get singleRegex(){return/^\^(.*)$/}
search(text){const isMatch=text.startsWith(this.pattern);return{isMatch,score:isMatch?0:1,indices:[0,this.pattern.length-1]}}}
class InversePrefixExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'inverse-prefix-exact'}
static get multiRegex(){return/^!\^"(.*)"$/}
static get singleRegex(){return/^!\^(.*)$/}
search(text){const isMatch=!text.startsWith(this.pattern);return{isMatch,score:isMatch?0:1,indices:[0,text.length-1]}}}
class SuffixExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'suffix-exact'}
static get multiRegex(){return/^"(.*)"\$$/}
static get singleRegex(){return/^(.*)\$$/}
search(text){const isMatch=text.endsWith(this.pattern);return{isMatch,score:isMatch?0:1,indices:[text.length-this.pattern.length,text.length-1]}}}
class InverseSuffixExactMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'inverse-suffix-exact'}
static get multiRegex(){return/^!"(.*)"\$$/}
static get singleRegex(){return/^!(.*)\$$/}
search(text){const isMatch=!text.endsWith(this.pattern);return{isMatch,score:isMatch?0:1,indices:[0,text.length-1]}}}
class FuzzyMatch extends BaseMatch{constructor(pattern,{location=Config.location,threshold=Config.threshold,distance=Config.distance,includeMatches=Config.includeMatches,findAllMatches=Config.findAllMatches,minMatchCharLength=Config.minMatchCharLength,isCaseSensitive=Config.isCaseSensitive,ignoreLocation=Config.ignoreLocation}={}){super(pattern);this._bitapSearch=new BitapSearch(pattern,{location,threshold,distance,includeMatches,findAllMatches,minMatchCharLength,isCaseSensitive,ignoreLocation});}
static get type(){return'fuzzy'}
static get multiRegex(){return/^"(.*)"$/}
static get singleRegex(){return/^(.*)$/}
search(text){return this._bitapSearch.searchIn(text)}}
class IncludeMatch extends BaseMatch{constructor(pattern){super(pattern);}
static get type(){return'include'}
static get multiRegex(){return/^'"(.*)"$/}
static get singleRegex(){return/^'(.*)$/}
search(text){let location=0;let index;const indices=[];const patternLen=this.pattern.length;while((index=text.indexOf(this.pattern,location))>-1){location=index+patternLen;indices.push([index,location-1]);}
const isMatch=!!indices.length;return{isMatch,score:isMatch?0:1,indices}}}
const searchers=[ExactMatch,IncludeMatch,PrefixExactMatch,InversePrefixExactMatch,InverseSuffixExactMatch,SuffixExactMatch,InverseExactMatch,FuzzyMatch];const searchersLen=searchers.length;const SPACE_RE=/ +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;const OR_TOKEN='|';function parseQuery(pattern,options={}){return pattern.split(OR_TOKEN).map((item)=>{let query=item.trim().split(SPACE_RE).filter((item)=>item&&!!item.trim());let results=[];for(let i=0,len=query.length;i<len;i+=1){const queryItem=query[i];let found=false;let idx=-1;while(!found&&++idx<searchersLen){const searcher=searchers[idx];let token=searcher.isMultiMatch(queryItem);if(token){results.push(new searcher(token,options));found=true;}}
if(found){continue}
idx=-1;while(++idx<searchersLen){const searcher=searchers[idx];let token=searcher.isSingleMatch(queryItem);if(token){results.push(new searcher(token,options));break}}}
return results})}
const MultiMatchSet=new Set([FuzzyMatch.type,IncludeMatch.type]);class ExtendedSearch{constructor(pattern,{isCaseSensitive=Config.isCaseSensitive,includeMatches=Config.includeMatches,minMatchCharLength=Config.minMatchCharLength,ignoreLocation=Config.ignoreLocation,findAllMatches=Config.findAllMatches,location=Config.location,threshold=Config.threshold,distance=Config.distance}={}){this.query=null;this.options={isCaseSensitive,includeMatches,minMatchCharLength,findAllMatches,ignoreLocation,location,threshold,distance};this.pattern=isCaseSensitive?pattern:pattern.toLowerCase();this.query=parseQuery(this.pattern,this.options);}
static condition(_,options){return options.useExtendedSearch}
searchIn(text){const query=this.query;if(!query){return{isMatch:false,score:1}}
const{includeMatches,isCaseSensitive}=this.options;text=isCaseSensitive?text:text.toLowerCase();let numMatches=0;let allIndices=[];let totalScore=0;for(let i=0,qLen=query.length;i<qLen;i+=1){const searchers=query[i];allIndices.length=0;numMatches=0;for(let j=0,pLen=searchers.length;j<pLen;j+=1){const searcher=searchers[j];const{isMatch,indices,score}=searcher.search(text);if(isMatch){numMatches+=1;totalScore+=score;if(includeMatches){const type=searcher.constructor.type;if(MultiMatchSet.has(type)){allIndices=[...allIndices,...indices];}else{allIndices.push(indices);}}}else{totalScore=0;numMatches=0;allIndices.length=0;break}}
if(numMatches){let result={isMatch:true,score:totalScore/numMatches};if(includeMatches){result.indices=allIndices;}
return result}}
return{isMatch:false,score:1}}}
const registeredSearchers=[];function register(...args){registeredSearchers.push(...args);}
function createSearcher(pattern,options){for(let i=0,len=registeredSearchers.length;i<len;i+=1){let searcherClass=registeredSearchers[i];if(searcherClass.condition(pattern,options)){return new searcherClass(pattern,options)}}
return new BitapSearch(pattern,options)}
const LogicalOperator={AND:'$and',OR:'$or'};const KeyType={PATH:'$path',PATTERN:'$val'};const isExpression=(query)=>!!(query[LogicalOperator.AND]||query[LogicalOperator.OR]);const isPath=(query)=>!!query[KeyType.PATH];const isLeaf=(query)=>!isArray(query)&&isObject(query)&&!isExpression(query);const convertToExplicit=(query)=>({[LogicalOperator.AND]:Object.keys(query).map((key)=>({[key]:query[key]}))});function parse(query,options,{auto=true}={}){const next=(query)=>{let keys=Object.keys(query);const isQueryPath=isPath(query);if(!isQueryPath&&keys.length>1&&!isExpression(query)){return next(convertToExplicit(query))}
if(isLeaf(query)){const key=isQueryPath?query[KeyType.PATH]:keys[0];const pattern=isQueryPath?query[KeyType.PATTERN]:query[key];if(!isString(pattern)){throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))}
const obj={keyId:createKeyId(key),pattern};if(auto){obj.searcher=createSearcher(pattern,options);}
return obj}
let node={children:[],operator:keys[0]};keys.forEach((key)=>{const value=query[key];if(isArray(value)){value.forEach((item)=>{node.children.push(next(item));});}});return node};if(!isExpression(query)){query=convertToExplicit(query);}
return next(query)}
function computeScore(results,{ignoreFieldNorm=Config.ignoreFieldNorm}){results.forEach((result)=>{let totalScore=1;result.matches.forEach(({key,norm,score})=>{const weight=key?key.weight:null;totalScore*=Math.pow(score===0&&weight?Number.EPSILON:score,(weight||1)*(ignoreFieldNorm?1:norm));});result.score=totalScore;});}
function transformMatches(result,data){const matches=result.matches;data.matches=[];if(!isDefined(matches)){return}
matches.forEach((match)=>{if(!isDefined(match.indices)||!match.indices.length){return}
const{indices,value}=match;let obj={indices,value};if(match.key){obj.key=match.key.src;}
if(match.idx>-1){obj.refIndex=match.idx;}
data.matches.push(obj);});}
function transformScore(result,data){data.score=result.score;}
function format(results,docs,{includeMatches=Config.includeMatches,includeScore=Config.includeScore}={}){const transformers=[];if(includeMatches)transformers.push(transformMatches);if(includeScore)transformers.push(transformScore);return results.map((result)=>{const{idx}=result;const data={item:docs[idx],refIndex:idx};if(transformers.length){transformers.forEach((transformer)=>{transformer(result,data);});}
return data})}
class Fuse{constructor(docs,options={},index){this.options={...Config,...options};if(this.options.useExtendedSearch&&!true){}
this._keyStore=new KeyStore(this.options.keys);this.setCollection(docs,index);}
setCollection(docs,index){this._docs=docs;if(index&&!(index instanceof FuseIndex)){throw new Error(INCORRECT_INDEX_TYPE)}
this._myIndex=index||createIndex(this.options.keys,this._docs,{getFn:this.options.getFn,fieldNormWeight:this.options.fieldNormWeight});}
add(doc){if(!isDefined(doc)){return}
this._docs.push(doc);this._myIndex.add(doc);}
remove(predicate=()=>false){const results=[];for(let i=0,len=this._docs.length;i<len;i+=1){const doc=this._docs[i];if(predicate(doc,i)){this.removeAt(i);i-=1;len-=1;results.push(doc);}}
return results}
removeAt(idx){this._docs.splice(idx,1);this._myIndex.removeAt(idx);}
getIndex(){return this._myIndex}
search(query,{limit=-1}={}){const{includeMatches,includeScore,shouldSort,sortFn,ignoreFieldNorm}=this.options;let results=isString(query)?isString(this._docs[0])?this._searchStringList(query):this._searchObjectList(query):this._searchLogical(query);computeScore(results,{ignoreFieldNorm});if(shouldSort){results.sort(sortFn);}
if(isNumber(limit)&&limit>-1){results=results.slice(0,limit);}
return format(results,this._docs,{includeMatches,includeScore})}
_searchStringList(query){const searcher=createSearcher(query,this.options);const{records}=this._myIndex;const results=[];records.forEach(({v:text,i:idx,n:norm})=>{if(!isDefined(text)){return}
const{isMatch,score,indices}=searcher.searchIn(text);if(isMatch){results.push({item:text,idx,matches:[{score,value:text,norm,indices}]});}});return results}
_searchLogical(query){const expression=parse(query,this.options);const evaluate=(node,item,idx)=>{if(!node.children){const{keyId,searcher}=node;const matches=this._findMatches({key:this._keyStore.get(keyId),value:this._myIndex.getValueForItemAtKeyId(item,keyId),searcher});if(matches&&matches.length){return[{idx,item,matches}]}
return[]}
const res=[];for(let i=0,len=node.children.length;i<len;i+=1){const child=node.children[i];const result=evaluate(child,item,idx);if(result.length){res.push(...result);}else if(node.operator===LogicalOperator.AND){return[]}}
return res};const records=this._myIndex.records;const resultMap={};const results=[];records.forEach(({$:item,i:idx})=>{if(isDefined(item)){let expResults=evaluate(expression,item,idx);if(expResults.length){if(!resultMap[idx]){resultMap[idx]={idx,item,matches:[]};results.push(resultMap[idx]);}
expResults.forEach(({matches})=>{resultMap[idx].matches.push(...matches);});}}});return results}
_searchObjectList(query){const searcher=createSearcher(query,this.options);const{keys,records}=this._myIndex;const results=[];records.forEach(({$:item,i:idx})=>{if(!isDefined(item)){return}
let matches=[];keys.forEach((key,keyIndex)=>{matches.push(...this._findMatches({key,value:item[keyIndex],searcher}));});if(matches.length){results.push({idx,item,matches});}});return results}
_findMatches({key,value,searcher}){if(!isDefined(value)){return[]}
let matches=[];if(isArray(value)){value.forEach(({v:text,i:idx,n:norm})=>{if(!isDefined(text)){return}
const{isMatch,score,indices}=searcher.searchIn(text);if(isMatch){matches.push({score,key,value:text,idx,norm,indices});}});}else{const{v:text,n:norm}=value;const{isMatch,score,indices}=searcher.searchIn(text);if(isMatch){matches.push({score,key,value:text,norm,indices});}}
return matches}}
Fuse.version='7.0.0';Fuse.createIndex=createIndex;Fuse.parseIndex=parseIndex;Fuse.config=Config;{Fuse.parseQuery=parse;}
{register(ExtendedSearch);}}),"./node_modules/mustache/mustache.mjs":
/*!********************************************!*\
  !*** ./node_modules/mustache/mustache.mjs ***!
  \********************************************/
((__unused_webpack___webpack_module__,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(__WEBPACK_DEFAULT_EXPORT__)});
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */
var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==='[object Array]';};function isFunction(object){return typeof object==='function';}
function typeStr(obj){return isArray(obj)?'array':typeof obj;}
function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,'\\$&');}
function hasProperty(obj,propName){return obj!=null&&typeof obj==='object'&&(propName in obj);}
function primitiveHasOwnProperty(primitive,propName){return(primitive!=null&&typeof primitive!=='object'&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName));}
var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string);}
var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string);}
var entityMap={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s];});}
var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)
return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation='';var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)
delete tokens[spaces.pop()];}else{spaces=[];}
hasTag=false;nonSpace=false;}
var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==='string')
tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)
throw new Error('Invalid tags: '+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+'\\s*');closingTagRe=new RegExp('\\s*'+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp('\\s*'+escapeRegExp('}'+tagsToCompile[1]));}
compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr;}else{nonSpace=true;lineHasNonSpace=true;indentation+=' ';}
tokens.push(['text',chr,start,start+1]);start+=1;if(chr==='\n'){stripSpace();indentation='';tagIndex=0;lineHasNonSpace=false;}}}
if(!scanner.scan(openingTagRe))
break;hasTag=true;type=scanner.scan(tagRe)||'name';scanner.scan(whiteRe);if(type==='='){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe);}else if(type==='{'){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type='&';}else{value=scanner.scanUntil(closingTagRe);}
if(!scanner.scan(closingTagRe))
throw new Error('Unclosed tag at '+scanner.pos);if(type=='>'){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace];}else{token=[type,value,start,scanner.pos];}
tagIndex++;tokens.push(token);if(type==='#'||type==='^'){sections.push(token);}else if(type==='/'){openSection=sections.pop();if(!openSection)
throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)
throw new Error('Unclosed section "'+openSection[1]+'" at '+start);}else if(type==='name'||type==='{'||type==='&'){nonSpace=true;}else if(type==='='){compileTags(value);}}
stripSpace();openSection=sections.pop();if(openSection)
throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens));}
function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==='text'&&lastToken&&lastToken[0]==='text'){lastToken[1]+=token[1];lastToken[3]=token[3];}else{squashedTokens.push(token);lastToken=token;}}}
return squashedTokens;}
function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case'#':case'^':collector.push(token);sections.push(token);collector=token[4]=[];break;case'/':section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token);}}
return nestedTokens;}
function Scanner(string){this.string=string;this.tail=string;this.pos=0;}
Scanner.prototype.eos=function eos(){return this.tail==='';};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)
return'';var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string;};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail='';break;case 0:match='';break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index);}
this.pos+=match.length;return match;};function Context(view,parentContext){this.view=view;this.cache={'.':this.view};this.parent=parentContext;}
Context.prototype.push=function push(view){return new Context(view,this);};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name];}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf('.')>0){intermediateValue=context.view;names=name.split('.');index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)
lookupHit=(hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]));intermediateValue=intermediateValue[names[index++]];}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name);}
if(lookupHit){value=intermediateValue;break;}
context=context.parent;}
cache[name]=value;}
if(isFunction(value))
value=value.call(this.view);return value;};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value;},get:function get(key){return this._cache[key];},clear:function clear(){this._cache={};}};}
Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=='undefined'){this.templateCache.clear();}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+':'+(tags||mustache.tags).join(':');var isCacheEnabled=typeof cache!=='undefined';var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens);}
return tokens;};Writer.prototype.render=function render(template,view,partials,config){var tags=this.getConfigTags(config);var tokens=this.parse(template,tags);var context=(view instanceof Context)?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,config);};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,config){var buffer='';var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==='#')value=this.renderSection(token,context,partials,originalTemplate,config);else if(symbol==='^')value=this.renderInverted(token,context,partials,originalTemplate,config);else if(symbol==='>')value=this.renderPartial(token,context,partials,config);else if(symbol==='&')value=this.unescapedValue(token,context);else if(symbol==='name')value=this.escapedValue(token,context,config);else if(symbol==='text')value=this.rawValue(token);if(value!==undefined)
buffer+=value;}
return buffer;};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate,config){var self=this;var buffer='';var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials,config);}
if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate,config);}}else if(typeof value==='object'||typeof value==='string'||typeof value==='number'){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate,config);}else if(isFunction(value)){if(typeof originalTemplate!=='string')
throw new Error('Cannot use higher-order sections without the original template');value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)
buffer+=value;}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate,config);}
return buffer;};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate,config){var value=context.lookup(token[1]);if(!value||(isArray(value)&&value.length===0))
return this.renderTokens(token[4],context,partials,originalTemplate,config);};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,'');var partialByNl=partial.split('\n');for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i];}}
return partialByNl.join('\n');};Writer.prototype.renderPartial=function renderPartial(token,context,partials,config){if(!partials)return;var tags=this.getConfigTags(config);var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace);}
var tokens=this.parse(indentedValue,tags);return this.renderTokens(tokens,context,partials,indentedValue,config);}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)
return value;};Writer.prototype.escapedValue=function escapedValue(token,context,config){var escape=this.getConfigEscape(config)||mustache.escape;var value=context.lookup(token[1]);if(value!=null)
return(typeof value==='number'&&escape===mustache.escape)?String(value):escape(value);};Writer.prototype.rawValue=function rawValue(token){return token[1];};Writer.prototype.getConfigTags=function getConfigTags(config){if(isArray(config)){return config;}
else if(config&&typeof config==='object'){return config.tags;}
else{return undefined;}};Writer.prototype.getConfigEscape=function getConfigEscape(config){if(config&&typeof config==='object'&&!isArray(config)){return config.escape;}
else{return undefined;}};var mustache={name:'mustache.js',version:'4.2.0',tags:['{{','}}'],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache;},get templateCache(){return defaultWriter.templateCache;}};var defaultWriter=new Writer();mustache.clearCache=function clearCache(){return defaultWriter.clearCache();};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags);};mustache.render=function render(template,view,partials,config){if(typeof template!=='string'){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+'argument for mustache#render(template, view, partials)');}
return defaultWriter.render(template,view,partials,config);};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;const __WEBPACK_DEFAULT_EXPORT__=(mustache);})});var __webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(cachedModule!==undefined){return cachedModule.exports;}
var module=__webpack_module_cache__[moduleId]={exports:{}};__webpack_modules__[moduleId](module,module.exports,__webpack_require__);return module.exports;}
(()=>{__webpack_require__.n=(module)=>{var getter=module&&module.__esModule?()=>(module['default']):()=>(module);__webpack_require__.d(getter,{a:getter});return getter;};})();(()=>{__webpack_require__.d=(exports,definition)=>{for(var key in definition){if(__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)){Object.defineProperty(exports,key,{enumerable:true,get:definition[key]});}}};})();(()=>{__webpack_require__.o=(obj,prop)=>(Object.prototype.hasOwnProperty.call(obj,prop))})();(()=>{__webpack_require__.r=(exports)=>{if(typeof Symbol!=='undefined'&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});}
Object.defineProperty(exports,'__esModule',{value:true});};})();var __webpack_exports__={};(()=>{
/*!***************************************!*\
  !*** ./src/frontend/app/src/start.ts ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);var _form_form_base__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! ./form/form-base */
"./src/frontend/app/src/form/form-base.ts");var _frontend__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! ./frontend */
"./src/frontend/app/src/frontend.ts");var _constants__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(
/*! ./constants */
"./src/frontend/app/src/constants.ts");window.StaticSnapFrontend=new _frontend__WEBPACK_IMPORTED_MODULE_1__["default"]();window.StaticSnapFrontendClasses={FormBase:_form_form_base__WEBPACK_IMPORTED_MODULE_0__["default"],Constants:_constants__WEBPACK_IMPORTED_MODULE_2__["default"]};})();})();