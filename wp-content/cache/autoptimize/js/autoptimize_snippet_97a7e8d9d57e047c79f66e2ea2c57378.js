(()=>{"use strict";var __webpack_modules__=({"./src/extensions/forms/contact-form-7/app/src/contact-form-7.ts":
/*!***********************************************************************!*\
  !*** ./src/extensions/forms/contact-form-7/app/src/contact-form-7.ts ***!
  \***********************************************************************/
((__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__);__webpack_require__.d(__webpack_exports__,{"default":()=>(ContactForm7)});var _staticsnap_frontend__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! @staticsnap/frontend */
"@staticsnap/frontend");var _staticsnap_frontend__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(_staticsnap_frontend__WEBPACK_IMPORTED_MODULE_0__);var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(
/*! @wordpress/i18n */
"@wordpress/i18n");var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);class ContactForm7 extends _staticsnap_frontend__WEBPACK_IMPORTED_MODULE_0__.FormBase{extensionMessagesClasses={error:'failed',field_error:'failed',invalid_error:'failed',success:'sent'};constructor(){super('[data-static-snap-type="form"][data-static-snap-form-type="contact-form-7"]');}
onSubmit(_e,form,_submitData,responseData){const settings=this.getFormSettings(responseData);this.setMessage(form,responseData.type==='item'&&responseData?.data?.saved?'success':'error',settings);}
onError(_e,form,_error){this.setMessage(form,'error',{messages:{error:(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('An error occurred, please try again later.','static-snap'),invalid:'',required:'',success:''}});}
setMessage(form,type,settings){const matchTypeToMessage={error:settings?.messages?.error,field_error:settings?.messages?.required,invalid_error:settings?.messages?.invalid,success:settings?.messages?.success};const noticeElement=this.getNoticeElement(form);const message=matchTypeToMessage[type]||(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('An error occurred, please try again later.','static-snap');noticeElement.textContent=message;const messageClass=this.extensionMessagesClasses[type];Object.values(this.extensionMessagesClasses).forEach(messageClass=>{form.classList.remove(messageClass);});form.classList.remove('init');form.classList.add(messageClass);}
getNoticeElement(form){let noticeElement=form.querySelector(' .wpcf7-response-output');if(!noticeElement){noticeElement=document.createElement('div');noticeElement.classList.add('wpcf7-response-output');form.appendChild(noticeElement);}
return noticeElement;}}}),"@staticsnap/frontend":
/*!********************************************!*\
  !*** external "StaticSnapFrontendClasses" ***!
  \********************************************/
((module)=>{module.exports=StaticSnapFrontendClasses;}),"@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
((module)=>{module.exports=window["wp"]["i18n"];})});var __webpack_module_cache__={};function __webpack_require__(moduleId){var cachedModule=__webpack_module_cache__[moduleId];if(cachedModule!==undefined){return cachedModule.exports;}
var module=__webpack_module_cache__[moduleId]={exports:{}};__webpack_modules__[moduleId](module,module.exports,__webpack_require__);return module.exports;}
(()=>{__webpack_require__.n=(module)=>{var getter=module&&module.__esModule?()=>(module['default']):()=>(module);__webpack_require__.d(getter,{a:getter});return getter;};})();(()=>{__webpack_require__.d=(exports,definition)=>{for(var key in definition){if(__webpack_require__.o(definition,key)&&!__webpack_require__.o(exports,key)){Object.defineProperty(exports,key,{enumerable:true,get:definition[key]});}}};})();(()=>{__webpack_require__.o=(obj,prop)=>(Object.prototype.hasOwnProperty.call(obj,prop))})();(()=>{__webpack_require__.r=(exports)=>{if(typeof Symbol!=='undefined'&&Symbol.toStringTag){Object.defineProperty(exports,Symbol.toStringTag,{value:'Module'});}
Object.defineProperty(exports,'__esModule',{value:true});};})();var __webpack_exports__={};(()=>{
/*!*************************************************************!*\
  !*** ./src/extensions/forms/contact-form-7/app/src/init.ts ***!
  \*************************************************************/
__webpack_require__.r(__webpack_exports__);var _contact_form_7__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(
/*! ./contact-form-7 */
"./src/extensions/forms/contact-form-7/app/src/contact-form-7.ts");new _contact_form_7__WEBPACK_IMPORTED_MODULE_0__["default"]();})();})();