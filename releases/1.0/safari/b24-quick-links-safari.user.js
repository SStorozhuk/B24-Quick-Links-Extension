// ==UserScript==
// @name         Bitrix24 Быстрые ссылки (Safari)
// @namespace    https://github.com/SStorozhuk/B24-Quick-Links-Extension
// @version      1.0.4
// @description  Быстрые ссылки Bitrix24 для порталов OSTEC.
// @match        https://bitrix24.ostec-group.ru/*
// @match        https://bitrix24test.ostec-group.ru/*
// @match        https://bitrix24develop.ostec-group.ru/*
// @match        https://bitrix24.selectica.ru/*
// @match        https://bitrix24test.selectica.ru/*
// @match        https://bitrix24develop.selectica.ru/*
// @run-at       document-end
// @inject-into  content
// @weight       100
// @noframes
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.openInTab
// ==/UserScript==
(function () {
  "use strict";

  const styles = "/* vendor/ui.buttons.bundle.min.css */\n:root{--ui-btn-size-xss:var(--ui-size-lg2);--ui-btn-size-xs:var(--ui-size-xl2);--ui-btn-size-sm:var(--ui-size-3xl);--ui-btn-size-md:var(--ui-size-5xl);--ui-btn-size-lg:var(--ui-size-6xl);--ui-btn-padding:0 20px;--ui-btn-padding-right:20px;--ui-btn-min-width:80px;--ui-btn-height:var(--ui-btn-size-md);--ui-btn-font-size:var(--ui-font-size-xs);--ui-btn-background:#868d95;--ui-btn-background-hover:#5b6573;--ui-btn-background-active:#3b506e;--ui-btn-border-color:#868d95;--ui-btn-border-color-hover:#5b6573;--ui-btn-border-color-active:#3b506e;--ui-btn-border:1px solid var(--ui-btn-border-color);--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-on-primary);--ui-btn-colors-before-bg:var(--ui-color-on-primary);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary);--ui-btn-box-shadow:none;--ui-btn-box-shadow-hover:none;--ui-btn-box-shadow-active:none;--ui-btn-text-shadow:none;--ui-btn-text-shadow-hover:none;--ui-btn-text-shadow-active:none;--ui-btn-margin-left:12px;--ui-btn-radius:var(--ui-border-radius-2xs);--ui-btn-clock-white:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 19 19'%3E%3Cstyle%3E@keyframes arrow-loader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg style='animation:arrow-loader 1s infinite linear;transform-origin:center'%3E%3Cpath fill='none' stroke='%23fff' d='M.5 9.475a8.976 8.976 0 0 1 17.95 0 8.976 8.976 0 0 1-17.95 0Z'/%3E%3Cpath stroke='%23fff' d='M9.5 4v5.5'/%3E%3C/g%3E%3Cpath fill='transparent' stroke='%23fff' d='M15 9.5H9.5' style='animation:arrowLoader 12s infinite linear;transform-origin:center'/%3E%3C/svg%3E\");--ui-btn-clock-black:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 19 19'%3E%3Cstyle%3E@keyframes arrow-loader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg style='animation:arrow-loader 1s infinite linear;transform-origin:center'%3E%3Cpath fill='none' stroke='%23525c69' d='M.5 9.475a8.976 8.976 0 0 1 17.95 0 8.976 8.976 0 0 1-17.95 0Z'/%3E%3Cpath stroke='%23525c69' d='M9.5 4v5.5'/%3E%3C/g%3E%3Cpath stroke='%23525c69' d='M15 9.5H9.5' style='animation:arrowLoader 12s infinite linear;transform-origin:center'/%3E%3C/svg%3E\");--ui-btn-wait-white:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21'%3E%3Cstyle%3E@keyframes waitLoader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg fill='%23fff' style='-moz-transform-origin:50%25;transform-origin:50%25;animation:waitLoader 1s infinite steps(12)'%3E%3Cpath d='M6.434 8.075a1.073 1.073 0 0 1-1.465.378L2.51 7.004a1.075 1.075 0 0 1-.378-1.466 1.073 1.073 0 0 1 1.465-.378l2.46 1.45c.506.298.676.958.377 1.465' opacity='.1'/%3E%3Cpath d='M8.109 6.415a1.073 1.073 0 0 1-1.462-.391L5.219 3.553a1.073 1.073 0 0 1 .39-1.462 1.073 1.073 0 0 1 1.462.391L8.5 4.952c.294.51.118 1.168-.391 1.463' opacity='.2'/%3E%3Cpath d='M10.43 5.792c-.589 0-1.07-.481-1.07-1.07V1.868c0-.589.481-1.07 1.07-1.07.588 0 1.07.481 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.3'/%3E%3Cpath d='M15.32 2.132c.508.3.678.958.379 1.466l-1.45 2.458a1.074 1.074 0 0 1-1.465.378 1.07 1.07 0 0 1-.378-1.464l1.45-2.46a1.074 1.074 0 0 1 1.465-.378' opacity='.4'/%3E%3Cpath d='M18.768 5.61c.295.509.12 1.167-.39 1.461L15.905 8.5a1.07 1.07 0 0 1-1.462-.39 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.462.391' opacity='.5'/%3E%3Cpath d='M20.061 10.43c0 .588-.481 1.07-1.07 1.07h-2.854c-.588 0-1.07-.482-1.07-1.07s.482-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07' opacity='.6'/%3E%3Cpath d='M18.727 15.32a1.074 1.074 0 0 1-1.465.379l-2.459-1.45a1.073 1.073 0 0 1-.378-1.465 1.07 1.07 0 0 1 1.465-.378l2.459 1.45c.507.298.677.957.378 1.465' opacity='.7'/%3E%3Cpath d='M15.25 18.768c-.51.295-1.168.12-1.462-.39l-1.429-2.472a1.073 1.073 0 0 1 .391-1.461 1.073 1.073 0 0 1 1.463.39l1.428 2.471c.294.51.119 1.167-.391 1.462' opacity='.8'/%3E%3Cpath d='M10.43 20.061c-.589 0-1.07-.481-1.07-1.07v-2.854c0-.588.481-1.07 1.07-1.07.588 0 1.07.482 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.9'/%3E%3Cpath d='M8.075 14.425c.507.299.677.958.378 1.465l-1.449 2.46a1.075 1.075 0 0 1-1.466.378 1.073 1.073 0 0 1-.378-1.465l1.45-2.46a1.074 1.074 0 0 1 1.465-.377' opacity='.95'/%3E%3Cpath d='M5.792 10.43c0 .588-.481 1.07-1.07 1.07H1.868c-.589 0-1.07-.482-1.07-1.07s.481-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07m.623 2.32c.294.51.119 1.168-.391 1.462l-2.471 1.429a1.074 1.074 0 0 1-1.463-.391 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.463.391'/%3E%3C/g%3E%3C/svg%3E\");--ui-btn-wait-black:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21'%3E%3Cstyle%3E@keyframes waitLoader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg fill='%23535c69' style='-moz-transform-origin:50%25;transform-origin:50%25;animation:waitLoader 1s infinite steps(12)'%3E%3Cpath d='M6.434 8.075a1.073 1.073 0 0 1-1.465.378L2.51 7.004a1.075 1.075 0 0 1-.378-1.466 1.073 1.073 0 0 1 1.465-.378l2.46 1.45c.506.298.676.958.377 1.465' opacity='.1'/%3E%3Cpath d='M8.109 6.415a1.073 1.073 0 0 1-1.462-.391L5.219 3.553a1.073 1.073 0 0 1 .39-1.462 1.073 1.073 0 0 1 1.462.391L8.5 4.952c.294.51.118 1.168-.391 1.463' opacity='.2'/%3E%3Cpath d='M10.43 5.792c-.589 0-1.07-.481-1.07-1.07V1.868c0-.589.481-1.07 1.07-1.07.588 0 1.07.481 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.3'/%3E%3Cpath d='M15.32 2.132c.508.3.678.958.379 1.466l-1.45 2.458a1.074 1.074 0 0 1-1.465.378 1.07 1.07 0 0 1-.378-1.464l1.45-2.46a1.074 1.074 0 0 1 1.465-.378' opacity='.4'/%3E%3Cpath d='M18.768 5.61c.295.509.12 1.167-.39 1.461L15.905 8.5a1.07 1.07 0 0 1-1.462-.39 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.462.391' opacity='.5'/%3E%3Cpath d='M20.061 10.43c0 .588-.481 1.07-1.07 1.07h-2.854c-.588 0-1.07-.482-1.07-1.07s.482-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07' opacity='.6'/%3E%3Cpath d='M18.727 15.32a1.074 1.074 0 0 1-1.465.379l-2.459-1.45a1.073 1.073 0 0 1-.378-1.465 1.07 1.07 0 0 1 1.465-.378l2.459 1.45c.507.298.677.957.378 1.465' opacity='.7'/%3E%3Cpath d='M15.25 18.768c-.51.295-1.168.12-1.462-.39l-1.429-2.472a1.073 1.073 0 0 1 .391-1.461 1.073 1.073 0 0 1 1.463.39l1.428 2.471c.294.51.119 1.167-.391 1.462' opacity='.8'/%3E%3Cpath d='M10.43 20.061c-.589 0-1.07-.481-1.07-1.07v-2.854c0-.588.481-1.07 1.07-1.07.588 0 1.07.482 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.9'/%3E%3Cpath d='M8.075 14.425c.507.299.677.958.378 1.465l-1.449 2.46a1.075 1.075 0 0 1-1.466.378 1.073 1.073 0 0 1-.378-1.465l1.45-2.46a1.074 1.074 0 0 1 1.465-.377' opacity='.95'/%3E%3Cpath d='M5.792 10.43c0 .588-.481 1.07-1.07 1.07H1.868c-.589 0-1.07-.482-1.07-1.07s.481-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07m.623 2.32c.294.51.119 1.168-.391 1.462l-2.471 1.429a1.074 1.074 0 0 1-1.463-.391 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.463.391'/%3E%3C/g%3E%3C/svg%3E\");--ui-btn-spinner:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' style='-webkit-animation:rotate 2s linear infinite;animation:rotate 2s linear infinite;-webkit-transform-origin:center center;transform-origin:center center' viewBox='25 25 50 50'%3E%3Cstyle%3E@keyframes rotate{to{transform:rotate(360deg)}}@keyframes dash{0%25{stroke-dasharray:1,200;stroke-dashoffset:0}50%25{stroke-dasharray:89,200;stroke-dashoffset:-35px}to{stroke-dasharray:89,200;stroke-dashoffset:-124px}}%3C/style%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke-miterlimit='10' style='stroke:rgba(215,220,223,.74);stroke-width:6;stroke-dasharray:20,200;stroke-dashoffset:0;-webkit-animation:dash 1.5s ease-in-out infinite;animation:dash 1.5s ease-in-out infinite;stroke-linecap:round'/%3E%3C/svg%3E\")}.ui-btn-container{margin:15px 0}.ui-btn-container-center{text-align:center}.ui-btn,.ui-btn-extra,.ui-btn-main,.ui-btn-menu{box-sizing:border-box;margin:0;height:var(--ui-btn-height);border:var(--ui-btn-border);border-color:var(--ui-btn-border-color);background:var(--ui-btn-background);box-shadow:var(--ui-btn-box-shadow);text-shadow:var(--ui-btn-text-shadow);cursor:pointer;transition:background-color .16s linear,color .16s linear,opacity .16s linear,box-shadow .16s linear,border-color .16s linear}.ui-btn-menu.--switcher{cursor:default}.ui-btn,.ui-btn-main{position:relative;display:inline-flex;justify-content:center;align-items:center;padding:var(--ui-btn-padding);color:var(--ui-btn-color);text-align:center;-webkit-text-decoration:var(--ui-text-transform-none);text-decoration:var(--ui-text-transform-none);text-transform:var(--ui-text-transform-uppercase);white-space:nowrap;font-family:var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-size:var(--ui-btn-font-size);font-weight:var(--ui-font-weight-bold);-webkit-user-select:none;user-select:none}.ui-btn,.ui-btn-main,.ui-btn-split{vertical-align:middle;line-height:calc(var(--ui-btn-height) - 2px)}.ui-btn{border-radius:var(--ui-btn-radius)}.ui-btn-min{min-width:var(--ui-btn-min-width)}.ui-btn-split{position:relative;display:inline-flex;align-items:stretch;border-radius:var(--ui-btn-radius)}.ui-btn-main{padding-right:var(--ui-btn-padding-right);border-right:none!important;border-radius:var(--ui-btn-radius) 0 0 var(--ui-btn-radius);max-width:100%;min-width:0}.ui-btn-extra,.ui-btn-menu{position:relative;left:0;top:0;display:flex;flex-direction:row;align-items:center;min-width:var(--ui-btn-height);border-left:none!important;border-radius:0 var(--ui-btn-radius) var(--ui-btn-radius) 0}.ui-btn-extra-hover .ui-btn-extra,.ui-btn-extra:hover,.ui-btn-hover .ui-btn-extra,.ui-btn-hover .ui-btn-main,.ui-btn-hover .ui-btn-menu,.ui-btn-main-hover .ui-btn-main,.ui-btn-main:focus,.ui-btn-main:hover,.ui-btn-menu-hover .ui-btn-menu,.ui-btn-menu:not(.--switcher):hover,.ui-btn.ui-btn-hover,.ui-btn:hover,a.ui-btn:focus{border-color:var(--ui-btn-border-color-hover);background-color:var(--ui-btn-background-hover);box-shadow:var(--ui-btn-box-shadow-hover);color:var(--ui-btn-color-hover);-webkit-text-decoration:var(--ui-text-transform-none);text-decoration:var(--ui-text-transform-none);text-shadow:var(--ui-btn-text-shadow-hover)}.ui-btn-main:focus-visible,.ui-btn-menu:not(.--switcher):focus-visible,.ui-btn:focus-visible{outline-offset:2px;outline-width:2px;outline-color:var(--ui-color-accent-main-link);outline-style:solid}.ui-btn-active .ui-btn-extra,.ui-btn-active .ui-btn-extra:hover,.ui-btn-active .ui-btn-main,.ui-btn-active .ui-btn-main:hover,.ui-btn-active .ui-btn-menu,.ui-btn-active .ui-btn-menu:not(.--switcher):hover,.ui-btn-active.ui-btn,.ui-btn-active.ui-btn:hover,.ui-btn-clock .ui-btn-main,.ui-btn-clock .ui-btn-main:hover,.ui-btn-clock.ui-btn,.ui-btn-clock.ui-btn:hover,.ui-btn-extra-active .ui-btn-extra,.ui-btn-extra-active .ui-btn-extra:hover,.ui-btn-extra:active,.ui-btn-main-active .ui-btn-main,.ui-btn-main-active .ui-btn-main:hover,.ui-btn-main:active,.ui-btn-menu-active .ui-btn-menu,.ui-btn-menu-active .ui-btn-menu:not(.--switcher):hover,.ui-btn-menu:not(.--switcher):active,.ui-btn-wait .ui-btn-main,.ui-btn-wait .ui-btn-main:hover,.ui-btn-wait.ui-btn,.ui-btn-wait.ui-btn:hover,.ui-btn:active{outline:none;border-color:var(--ui-btn-border-color-active);background-color:var(--ui-btn-background-active);box-shadow:var(--ui-btn-box-shadow-active);color:var(--ui-btn-color-active);text-shadow:var(--ui-btn-text-shadow-active)}.ui-btn-extra:after,.ui-btn-menu:after{position:absolute;top:7px;bottom:6px;left:0;width:1px;background-color:var(--ui-btn-colors-after-bg);content:\"\";opacity:var(--ui-btn-opacity-after)}.ui-btn-extra:before,.ui-btn-menu:before{position:absolute;top:50%;left:50%;box-sizing:border-box;margin-top:-2px;margin-left:-4px;width:8px;border:4px solid var(--ui-color-background-transparent);border-top-color:var(--ui-btn-colors-before-bg);background:none;content:\"\";transition:background-color .16s linear,color .16s linear,opacity .16s linear,border-color .16s linear}.ui-btn-menu.--switcher:before{content:none}.ui-btn-split~.ui-btn,.ui-btn-split~.ui-btn-split,.ui-btn-split~.ui-ctl,.ui-btn~.ui-btn,.ui-btn~.ui-btn-split,.ui-btn~.ui-ctl,.ui-ctl~.ui-btn,.ui-ctl~.ui-btn-split,.ui-ctl~.ui-ctl{margin-left:var(--ui-btn-margin-left)}.ui-btn-text{overflow:hidden;max-width:100%;white-space:nowrap;text-overflow:ellipsis;display:block}.ui-btn-md{--ui-btn-padding:0 19px;--ui-btn-padding-right:12px;--ui-btn-min-width:80px;--ui-btn-height:var(--ui-btn-size-md);--ui-btn-font-size:var(--ui-font-size-xs)}.ui-btn-lg{--ui-btn-padding:0 26px;--ui-btn-padding-right:12px;--ui-btn-min-width:90px;--ui-btn-height:var(--ui-btn-size-lg);--ui-btn-font-size:var(--ui-font-size-xs)}.ui-btn-sm{--ui-btn-padding:0 17px;--ui-btn-padding-right:10px;--ui-btn-min-width:70px;--ui-btn-height:var(--ui-btn-size-sm);--ui-btn-font-size:var(--ui-font-size-xs)}.ui-btn-xs{--ui-btn-padding:0 15px;--ui-btn-padding-right:9px;--ui-btn-min-width:66px;--ui-btn-height:var(--ui-btn-size-xs);--ui-btn-font-size:var(--ui-font-size-3xs)}.ui-btn-xss{--ui-btn-padding:0 15px;--ui-btn-padding-right:9px;--ui-btn-min-width:66px;--ui-btn-height:var(--ui-btn-size-xss);--ui-btn-font-size:var(--ui-font-size-3xs)}.ui-btn-split.ui-btn-lg{padding-right:33px}.ui-btn-lg.ui-btn:not(.ui-btn-round),.ui-btn-lg:not(.ui-btn-round) .ui-btn-main{--ui-btn-radius:var(--ui-border-radius-2xs)}.ui-btn-lg .ui-btn-extra,.ui-btn-lg .ui-btn-menu{min-width:34px}.ui-btn-lg:not(.ui-btn-round) .ui-btn-extra,.ui-btn-lg:not(.ui-btn-round) .ui-btn-menu{--ui-btn-radius:var(--ui-border-radius-2xs)}.ui-btn-sm .ui-btn-extra,.ui-btn-sm .ui-btn-menu{min-width:28px}.ui-btn-sm:not(.ui-btn-round) .ui-btn-extra,.ui-btn-sm:not(.ui-btn-round) .ui-btn-menu{--ui-btn-radius:var(--ui-border-radius-2xs)}.ui-btn-lg .ui-btn-extra:before,.ui-btn-lg .ui-btn-menu:before{margin-top:-3px}.ui-btn-lg .ui-btn-extra:after,.ui-btn-lg .ui-btn-menu:after{top:11px;bottom:10px;opacity:.25}.ui-btn-success{--ui-btn-background:#bbed21;--ui-btn-background-hover:#d2f95f;--ui-btn-background-active:#b2e232;--ui-btn-border-color:#bbed21;--ui-btn-border-color-hover:#d2f95f;--ui-btn-border-color-active:#b2e232;--ui-btn-opacity-after:var(--ui-opacity-20);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:var(--ui-color-base-90);--ui-btn-color-active:var(--ui-color-base-90)}.ui-btn-success-light{--ui-btn-background:rgba(223,238,175,var(--ui-opacity-80));--ui-btn-background-hover:#eaf5c5;--ui-btn-background-active:#d3e59a;--ui-btn-border-color:rgba(223,238,175,var(--ui-opacity-80));--ui-btn-border-color-hover:#eaf5c5;--ui-btn-border-color-active:#d3e59a;--ui-btn-opacity-after:var(--ui-opacity-20);--ui-btn-colors-after-bg:var(--ui-color-text-primary);--ui-btn-colors-before-bg:#a3bf63;--ui-btn-color:#668d13;--ui-btn-color-hover:#668d13;--ui-btn-color-active:#668d13}.ui-btn-success-dark{--ui-btn-background:#86a732;--ui-btn-background-hover:#a2bf54;--ui-btn-background-active:#a2bf54;--ui-btn-border-color:#86a732;--ui-btn-border-color-hover:#a2bf54;--ui-btn-border-color-active:#a2bf54;--ui-btn-opacity-after:var(--ui-opacity-20);--ui-btn-colors-after-bg:var(--ui-color-on-primary);--ui-btn-colors-before-bg:#a3bf63;--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-danger{--ui-btn-background:#f1361a;--ui-btn-background-hover:#cc1c00;--ui-btn-background-active:#d24430;--ui-btn-border-color:#f1361a;--ui-btn-border-color-hover:#cc1c00;--ui-btn-border-color-active:#d24430;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-danger-dark{--ui-btn-background:#a21429;--ui-btn-background-hover:#c43d51;--ui-btn-background-active:#851021;--ui-btn-border-color:#a21429;--ui-btn-border-color-hover:#c43d51;--ui-btn-border-color-active:#851021;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-danger-light{--ui-btn-background:rgba(253,202,200,var(--ui-opacity-80));--ui-btn-background-hover:#ffdcdb;--ui-btn-background-active:#f2b6b3;--ui-btn-border-color:rgba(253,202,200,var(--ui-opacity-80));--ui-btn-border-color-hover:#ffdcdb;--ui-btn-border-color-active:#f2b6b3;--ui-btn-opacity-after:var(--ui-opacity-20);--ui-btn-colors-after-bg:var(--ui-color-text-primary);--ui-btn-colors-before-bg:#eb8783;--ui-btn-color:#d7413c;--ui-btn-color-hover:#d7413c;--ui-btn-color-active:#d7413c}.ui-btn-primary{--ui-btn-background:#3bc8f5;--ui-btn-background-hover:#3eddff;--ui-btn-background-active:#12b1e3;--ui-btn-border-color:#3bc8f5;--ui-btn-border-color-hover:#3eddff;--ui-btn-border-color-active:#12b1e3;--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-primary-dark{--ui-btn-background:#399fc2;--ui-btn-background-hover:#37aed4;--ui-btn-background-active:#328ba9;--ui-btn-border-color:#399fc2;--ui-btn-border-color-hover:#37aed4;--ui-btn-border-color-active:#328ba9;--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-secondary{--ui-btn-background:#c5e7f4;--ui-btn-background-hover:#d1eef9;--ui-btn-background-active:#aee0f2;--ui-btn-border-color:#aee0f2;--ui-btn-border-color-hover:#aee0f2;--ui-btn-border-color-active:#aee0f2;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:var(--ui-color-base-90);--ui-btn-color-active:var(--ui-color-base-90)}.ui-btn-secondary-light{--ui-btn-background:rgba(182,237,255,var(--ui-opacity-80));--ui-btn-background-hover:#d1eef9;--ui-btn-background-active:#aee0f2;--ui-btn-border-color:rgba(182,237,255,var(--ui-opacity-80));--ui-btn-border-color-hover:rgba(182,237,255,var(--ui-opacity-80));--ui-btn-border-color-active:rgba(182,237,255,var(--ui-opacity-80));--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:#0aa0d0;--ui-btn-color-hover:#0aa0d0;--ui-btn-color-active:#0aa0d0}.ui-btn-warning-light{--ui-btn-background:rgba(237,218,123,var(--ui-opacity-80));--ui-btn-background-hover:rgba(255,169,0,.65);--ui-btn-background-active:#eba51c;--ui-btn-border-color:rgba(237,218,123,var(--ui-opacity-80));--ui-btn-border-color-hover:rgba(237,218,123,var(--ui-opacity-80));--ui-btn-border-color-active:rgba(237,218,123,var(--ui-opacity-80));--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:#a07f27;--ui-btn-color-hover:#a07f27;--ui-btn-color-active:#a07f27}.ui-btn-link{--ui-btn-background:var(--ui-color-background-transparent);--ui-btn-background-hover:var(--ui-color-background-transparent);--ui-btn-background-active:var(--ui-color-background-transparent);--ui-btn-border-color:var(--ui-color-background-transparent);--ui-btn-border-color-hover:var(--ui-color-background-transparent);--ui-btn-border-color-active:var(--ui-color-background-transparent);--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:#80868e;--ui-btn-color-active:var(--ui-color-base-90)}.ui-btn-light{--ui-btn-background:var(--ui-color-background-transparent);--ui-btn-background-hover:#f6f8f9;--ui-btn-background-active:#d6f1fb;--ui-btn-border-color:var(--ui-color-background-transparent);--ui-btn-border-color-hover:#f6f8f9;--ui-btn-border-color-active:#d6f1fb;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:var(--ui-color-text-primary);--ui-btn-color-active:var(--ui-color-base-solid);--ui-btn-padding:0 6px}.ui-btn-light-border{--ui-btn-background:var(--ui-color-background-transparent);--ui-btn-background-hover:#cfd4d8;--ui-btn-background-active:#dde2e5;--ui-btn-border-color:#c6cdd3;--ui-btn-border-color-hover:#c6cdd3;--ui-btn-border-color-active:#9fa4ab;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:var(--ui-color-base-90);--ui-btn-color-active:var(--ui-color-base-90)}.ui-btn-color-ai{--ui-btn-backgroud-color-ai:#935bec;--ui-btn-backgroud-color-ai-hover:#a977fa;--ui-btn-backgroud-color-ai-active:#8447e4;--ui-btn-background:var(--ui-btn-backgroud-color-ai);--ui-btn-background-hover:var(--ui-btn-backgroud-color-ai-hover);--ui-btn-background-active:var(--ui-btn-backgroud-color-ai-active);--ui-btn-border-color:var(--ui-btn-backgroud-color-ai);--ui-btn-border-color-hover:var(--ui-btn-backgroud-color-ai-hover);--ui-btn-border-color-active:var(--ui-btn-backgroud-color-ai-active);--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-on-primary);--ui-btn-colors-before-bg:var(--ui-color-on-primary);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-base-light{--ui-btn-background:var(--ui-color-base-20);--ui-btn-background-hover:#cfd4d8;--ui-btn-background-active:#dde2e5;--ui-btn-border-color:var(--ui-color-base-20);--ui-btn-border-color-hover:#c6cdd3;--ui-btn-border-color-active:#9fa4ab;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-80);--ui-btn-colors-before-bg:var(--ui-color-base-80);--ui-btn-color:var(--ui-color-base-80);--ui-btn-color-hover:var(--ui-color-base-80);--ui-btn-color-active:var(--ui-color-base-80)}.ui-btn-collab{--ui-btn-background:#19cc45;--ui-btn-background-hover:#6be860;--ui-btn-background-active:#00a94e;--ui-btn-border-color:var(--ui-color-background-transparent);--ui-btn-border-color-hover:var(--ui-color-background-transparent);--ui-btn-border-color-active:var(--ui-color-background-transparent);--ui-btn-color:var(--ui-color-palette-white-base);--ui-btn-color-hover:var(--ui-color-palette-white-base);--ui-btn-color-active:var(--ui-color-palette-white-base)}.ui-btn-primary-curtain{--ui-btn-background:#34b6df;--ui-btn-background-hover:#37aed4;--ui-btn-background-active:#328ba9;--ui-btn-border-color:hsla(0,0%,100%,.8);--ui-btn-border-color-hover:#fff;--ui-btn-border-color-active:#fff;--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.ui-btn-primary-warning{--ui-btn-background:hsla(0,0%,100%,.15);--ui-btn-background-hover:hsla(0,0%,100%,.44);--ui-btn-background-active:hsla(0,0%,100%,.6);--ui-btn-border-color:hsla(0,0%,100%,.44);--ui-btn-border-color-hover:#fff;--ui-btn-border-color-active:#fff;--ui-btn-color:#fff;--ui-btn-color-hover:#fff;--ui-btn-color-active:#fff}.ui-btn-primary-border{--ui-btn-background:var(--ui-color-background-transparent);--ui-btn-background-hover:#cfd4d8;--ui-btn-background-active:#dde2e5;--ui-btn-border-color:var(--ui-color-primary);--ui-btn-border-color-hover:#c6cdd3;--ui-btn-border-color-active:#9fa4ab;--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-base-90);--ui-btn-colors-before-bg:var(--ui-color-base-90);--ui-btn-color:var(--ui-color-base-90);--ui-btn-color-hover:var(--ui-color-base-90);--ui-btn-color-active:var(--ui-color-base-90)}.ui-btn-split.ui-btn-icon-ai .ui-btn-main:before:hover,.ui-btn.ui-btn-icon-ai:before:hover{background-image:url(images/ui-btn-ai-waiting.gif?3)}.ui-btn-split.ui-btn-icon-ai .ui-btn-main:before,.ui-btn.ui-btn-icon-ai:before{content:\"\";width:100%;height:100%;position:absolute;top:0;left:0;background-position:5px;background-repeat:no-repeat;background-size:17px;background-color:transparent;opacity:0;animation:fade-out-animated-icon .5s;animation-fill-mode:both;background-image:none}@keyframes fade-out-animated-icon{0%{opacity:1;transform:translateX(calc(50% - 12px));background-image:url(images/ui-btn-ai-waiting.gif?1)}90%{opacity:0;transform:translateX(0);background-image:url(images/ui-btn-ai-waiting.gif?1)}to{opacity:0;transform:translateX(0);background-image:none}}.ui-btn-split.ui-btn-icon-ai.ui-btn-ai-waiting .ui-btn-main:before,.ui-btn.ui-btn-icon-ai.ui-btn-ai-waiting:before{animation:fade-in-animated-icon .5s both}@keyframes fade-in-animated-icon{0%{left:5px;opacity:1;transform:translateX(0);background-image:url(images/ui-btn-ai-waiting.gif?3)}90%{left:5px;opacity:1;transform:translateX(calc(50% - 17px));background-image:url(images/ui-btn-ai-waiting.gif?3)}to{left:5px;opacity:1;transform:translateX(calc(50% - 17px));background-image:url(images/ui-btn-ai-waiting.gif?3)}}.ui-btn-split.ui-btn-icon-ai.ui-btn-color-ai .ui-btn-main:after,.ui-btn.ui-btn-icon-ai.ui-btn-color-ai:after{animation:fade-in-static-icon .5s forwards}@keyframes fade-in-static-icon{0%{opacity:0;transform:translateX(-50%) translateY(-50%);left:50%}90%{opacity:1;left:5px;transform:translateX(0) translateY(-50%)}to{opacity:1;left:5px;transform:translateX(0) translateY(-50%)}}.ui-btn-split.ui-btn-icon-ai.ui-btn-ai-waiting .ui-btn-main:after,.ui-btn.ui-btn-icon-ai.ui-btn-ai-waiting:after{animation:fade-out-static-icon .5s forwards}@keyframes fade-out-static-icon{0%{opacity:0;left:5px;transform:translateX(0) translateY(-50%)}90%{opacity:0;left:50%;transform:translateX(-50%) translateY(-50%)}to{opacity:0;left:50%;transform:translateX(-50%) translateY(-50%)}}.ui-btn-icon-ai .ui-btn-main .ui-btn-text,.ui-btn-icon-ai .ui-btn-text{transition:opacity .1s ease-in-out;transition-delay:.4s}.ui-btn-ai-waiting .ui-btn-main .ui-btn-text,.ui-btn-ai-waiting .ui-btn-text{transition-delay:0s;opacity:0}.ui-btn-ai-waiting,.ui-btn-ai-waiting .ui-btn-main,.ui-btn-ai-waiting .ui-btn-menu{opacity:.85;pointer-events:none}.ui-btn-link.ui-btn{padding-right:0;padding-left:0}.ui-btn-link .ui-btn-main{padding-left:0}.bitrix24-light-theme .ui-btn-themes.ui-btn-link:not(.--air){--ui-btn-color:#ebebeb;--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.bitrix24-light-theme .ui-btn-themes.ui-btn-light-border:not(.--air),.bitrix24-light-theme .ui-btn-themes.ui-btn-light:not(.--air){--ui-btn-background:rgba(var(--ui-color-on-primary-rgb),.15);--ui-btn-background-hover:rgba(var(--ui-color-on-primary-rgb),var(--ui-opacity-30));--ui-btn-background-active:rgba(var(--ui-color-on-primary-rgb),var(--ui-opacity-40));--ui-btn-colors-after-bg:var(--ui-color-on-primary);--ui-btn-colors-before-bg:var(--ui-color-on-primary);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-color-on-primary);--ui-btn-color-active:var(--ui-color-on-primary)}.bitrix24-light-theme .ui-btn-themes.ui-btn-light-border:not(.--air){--ui-btn-border-color:rgba(var(--ui-color-on-primary-rgb),var(--ui-opacity-40))}.bitrix24-dark-theme .ui-btn-themes.ui-btn-link:not(.--air){--ui-btn-color:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-color-hover:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-color-active:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80))}.bitrix24-dark-theme .ui-btn-themes.ui-btn-light-border:not(.--air),.bitrix24-dark-theme .ui-btn-themes.ui-btn-light:not(.--air){--ui-btn-background:rgba(var(--ui-color-base-solid-rgb),.07);--ui-btn-background-hover:rgba(var(--ui-color-base-solid-rgb),var(--ui-opacity-10));--ui-btn-background-active:rgba(var(--ui-color-base-solid-rgb),.15);--ui-btn-colors-after-bg:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-colors-before-bg:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-color:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-color-hover:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80));--ui-btn-color-active:rgba(var(--ui-color-base-default-rgb),var(--ui-opacity-80))}.bitrix24-dark-theme .ui-btn-themes.ui-btn-light-border:not(.--air){--ui-btn-border-color:rgba(var(--ui-color-base-solid-rgb),.06)}.ui-btn-round{--ui-btn-radius:calc(var(--ui-btn-height)/2)}.ui-btn-no-caps,.ui-btn-no-caps .ui-btn-main{text-transform:none;font-size:calc(var(--ui-btn-font-size) + 2px);font-family:var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-weight:var(--ui-font-weight-semi-bold)}.ui-btn-shadow,.ui-btn-shadow.ui-btn-hover,.ui-btn-shadow:hover{box-shadow:0 1px 2px 0 rgba(var(--ui-color-base-solid-rgb),.18)}.ui-btn-shadow.ui-btn-active,.ui-btn-shadow:active{box-shadow:0 0 1px 0 rgba(var(--ui-color-base-solid-rgb),.18)}.ui-btn-counter{display:inline-block;padding:0 8px;border-radius:var(--ui-border-radius-md);background-color:#f34829;color:var(--ui-color-on-primary);vertical-align:middle;font-family:var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-size:11px;line-height:19px;font-weight:var(--ui-font-weight-regular)}.ui-btn-text+.ui-btn-counter{margin-left:12px}.ui-btn-lg .ui-btn-counter{margin-left:15px}.ui-btn-dropdown .ui-btn-main,.ui-btn.ui-btn-dropdown{padding-right:29px}.ui-btn-dropdown .ui-btn-main:before,.ui-btn.ui-btn-dropdown:before{position:absolute;top:50%;right:13px;display:block;box-sizing:border-box;margin-top:-1.5px;width:8px;height:8px;border-bottom:2px solid;border-left:2px solid;content:\"\";transform:translateY(-50%) rotate(-45deg);border-color:var(--ui-btn-color)}.ui-btn-collapsed.ui-btn-dropdown .ui-btn-main:before,.ui-btn-empty.ui-btn-dropdown .ui-btn-main:before,.ui-btn.ui-btn-collapsed.ui-btn-dropdown:before,.ui-btn.ui-btn-empty.ui-btn-dropdown:before{right:auto;transform:translate(-50%,-50%) rotate(-45deg);left:50%}.ui-btn-collapsed.ui-btn-dropdown[class*=ui-btn-icon-] .ui-btn-main:before,.ui-btn-empty.ui-btn-dropdown[class*=ui-btn-icon-] .ui-btn-main:before,.ui-btn.ui-btn-collapsed.ui-btn-dropdown[class*=ui-btn-icon-]:before,.ui-btn.ui-btn-empty.ui-btn-dropdown[class*=ui-btn-icon-]:before{right:12px;transform:translateY(-50%) rotate(-45deg);left:auto}.ui-btn-disabled .ui-btn-extra,.ui-btn-disabled .ui-btn-extra:active,.ui-btn-disabled .ui-btn-extra:hover,.ui-btn-disabled .ui-btn-main,.ui-btn-disabled .ui-btn-main:active,.ui-btn-disabled .ui-btn-main:hover,.ui-btn-disabled .ui-btn-menu,.ui-btn-disabled .ui-btn-menu:active,.ui-btn-disabled .ui-btn-menu:hover,.ui-btn-extra-disabled .ui-btn-extra,.ui-btn-extra-disabled .ui-btn-extra:active,.ui-btn-extra-disabled .ui-btn-extra:hover,.ui-btn-main-disabled .ui-btn-main,.ui-btn-main-disabled .ui-btn-main:active,.ui-btn-main-disabled .ui-btn-main:hover,.ui-btn-menu-disabled .ui-btn-menu,.ui-btn-menu-disabled .ui-btn-menu:active,.ui-btn-menu-disabled .ui-btn-menu:hover,.ui-btn.ui-btn-disabled,.ui-btn.ui-btn-disabled:active,.ui-btn.ui-btn-disabled:hover,.ui-btn[disabled],.ui-btn[disabled]:active,.ui-btn[disabled]:hover{opacity:var(--ui-opacity-40);cursor:not-allowed;background-color:var(--ui-btn-background);border-color:var(--ui-btn-border-color)}.ui-btn-wait .ui-btn-main,.ui-btn.ui-btn-wait{background-position:50%!important;background-repeat:no-repeat!important;color:transparent!important}.ui-btn-wait .ui-btn-main:after,.ui-btn.ui-btn-wait:after{opacity:0}.ui-btn-wait,.ui-btn-wait.ui-btn-danger,.ui-btn-wait.ui-btn-danger-dark,.ui-btn-wait.ui-btn-default,.ui-btn-wait.ui-btn-primary,.ui-btn-wait.ui-btn-primary-dark,.ui-btn-wait.ui-btn-success-dark{--ui-btn-wait-loader:var(--ui-btn-wait-white)}.ui-btn-wait.ui-btn-light,.ui-btn-wait.ui-btn-light-border,.ui-btn-wait.ui-btn-link,.ui-btn-wait.ui-btn-secondary,.ui-btn-wait.ui-btn-success{--ui-btn-wait-loader:var(--ui-btn-wait-black)}.ui-btn-wait .ui-btn-main,.ui-btn.ui-btn-wait{background-image:var(--ui-btn-wait-loader)}.ui-btn-split.ui-btn-clock .ui-btn-main,.ui-btn.ui-btn-clock{background-position:50%!important;background-repeat:no-repeat!important;color:transparent!important}.ui-btn-split.ui-btn-clock .ui-btn-main:after,.ui-btn.ui-btn-clock:after{opacity:0}.ui-btn-clock,.ui-btn-clock.ui-btn-danger,.ui-btn-clock.ui-btn-danger-dark,.ui-btn-clock.ui-btn-default,.ui-btn-clock.ui-btn-primary,.ui-btn-clock.ui-btn-primary-dark,.ui-btn-clock.ui-btn-success-dark{--ui-btn-clock-loader:var(--ui-btn-clock-white)}.ui-btn-clock.ui-btn-light,.ui-btn-clock.ui-btn-light-border,.ui-btn-clock.ui-btn-link,.ui-btn-clock.ui-btn-secondary,.ui-btn-clock.ui-btn-success{--ui-btn-clock-loader:var(--ui-btn-clock-black)}.ui-btn-clock .ui-btn-main,.ui-btn.ui-btn-clock{background-image:var(--ui-btn-clock-loader)}.ui-btn-split.ui-btn-spinner .ui-btn-main,.ui-btn.ui-btn-spinner{background-position:50%!important;background-repeat:no-repeat!important;color:transparent!important}.ui-btn-split.ui-btn-spinner .ui-btn-main:after,.ui-btn.ui-btn-spinner:after{opacity:0}.ui-btn-spinner,.ui-btn-spinner.ui-btn-danger,.ui-btn-spinner.ui-btn-danger-dark,.ui-btn-spinner.ui-btn-default,.ui-btn-spinner.ui-btn-light,.ui-btn-spinner.ui-btn-light-border,.ui-btn-spinner.ui-btn-link,.ui-btn-spinner.ui-btn-primary,.ui-btn-spinner.ui-btn-primary-dark,.ui-btn-spinner.ui-btn-secondary,.ui-btn-spinner.ui-btn-success,.ui-btn-spinner.ui-btn-success-dark{--ui-btn-clock-loader:var(--ui-btn-spinner)}.ui-btn-spinner .ui-btn-main,.ui-btn.ui-btn-spinner{background-image:var(--ui-btn-spinner)}:root{--ui-link-color:#216bb6;--ui-link-border-color:#216bb6}.ui-link,.ui-link:hover{cursor:pointer;font-family:var(--ui-font-family-primary,var(--ui-font-family-helvetica));font-size:13px;line-height:22px;color:var(--ui-link-color);transition:color .25s linear,border-color .25s linear}.ui-link+.ui-link,.ui-link+script+.ui-link{margin-left:12px}.ui-link,.ui-link-primary{--ui-link-color:#216bb6;--ui-link-border-color:#216bb6}.ui-link-primary:hover,.ui-link:hover{--ui-link-color:#2067b0;--ui-link-border-color:#2067b0}.ui-link-secondary{--ui-link-color:#80868e;--ui-link-border-color:#d8d8d8}.ui-link-dark,.ui-link-secondary:hover{--ui-link-color:#333;--ui-link-border-color:#333}.ui-link-dark:hover{--ui-link-color:#000;--ui-link-border-color:#000}.ui-link-solid{border-bottom:1px solid var(--ui-link-border-color)}.ui-link-dashed{border-bottom:1px dashed var(--ui-link-border-color)}.ui-link-dotted{border-bottom:1px dotted var(--ui-link-border-color)}.ui-button__shimmer{position:absolute;inset:0;z-index:0;border-radius:var(--ui-btn-radius);overflow:hidden;pointer-events:none}.ui-button__shimmer:before{content:\"\";position:absolute;top:0;left:0;height:var(--ui-btn-height);width:110px;transform:translateX(-110px);background:linear-gradient(128deg,hsla(0,0%,100%,0) 34.39%,#fff 48.22%,hsla(0,0%,100%,0) 62.72%);opacity:var(--ui-opacity-40);animation:ui-button-shimmer 4s linear 0s 1,ui-button-shimmer 4s linear 8s 10}.ui-btn-collapsed .ui-button__shimmer:before{animation:ui-button-shimmer 7s linear 0s 1,ui-button-shimmer 7s linear 8s 10}@keyframes ui-button-shimmer{0%{transform:translateX(-110px)}20%{transform:translateX(calc(100% + 110px))}to{transform:translateX(calc(100% + 110px))}}.ui-btn-split.--air,.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air .ui-btn-menu,.ui-btn.--air{--ui-btn-background:#868d95;--ui-btn-background-hover:color-mix(in srgb,var(--ui-btn-background) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--ui-btn-background-active:color-mix(in srgb,var(--ui-btn-background) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-background-gradient:linear-gradient(180deg,var(--ui-btn-background) 0%,var(--ui-btn-background) 100%);--ui-btn-background-gradient-hover:linear-gradient(180deg,var(--ui-btn-background-hover) 0%,var(--ui-btn-background-hover) 100%);--ui-btn-background-gradient-active:linear-gradient(180deg,var(--ui-btn-background-active) 0%,var(--ui-btn-background-active) 100%)}.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air .ui-btn-menu{--ui-btn-background:transparent}.ui-btn-split.--air,.ui-btn.--air{--ui-btn-size-xss:20px;--ui-btn-size-xs:24px;--ui-btn-size-sm:28px;--ui-btn-size-md:34px;--ui-btn-size-lg:38px;--ui-btn-size-xl:46px;--ui-btn-letter-spacing:-0.05;--ui-btn-icon-size:20px;--ui-btn-title-comensation:-1px;--ui-btn-padding:0 var(--ui-btn-padding-right) 0 var(--ui-btn-padding-left);--ui-btn-min-width:80px;--ui-btn-border-color:var(--ui-btn-border-color);--ui-btn-border-color-hover:color-mix(in srgb,var(--ui-btn-border-color) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--ui-btn-border-color-active:color-mix(in srgb,var(--ui-btn-border-color) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-border-width:0px;--ui-btn-border:var(--ui-btn-border-width) solid var(--ui-btn-border-color);--ui-btn-opacity-after:var(--ui-opacity-30);--ui-btn-colors-after-bg:var(--ui-color-on-primary);--ui-btn-colors-before-bg:var(--ui-color-on-primary);--ui-btn-color:var(--ui-color-on-primary);--ui-btn-color-hover:var(--ui-btn-color);--ui-btn-color-active:var(--ui-btn-color);--ui-btn-color-chevron:var(--ui-btn-color);--ui-btn-box-shadow:none;--ui-btn-box-shadow-hover:none;--ui-btn-box-shadow-active:none;--ui-btn-text-shadow:none;--ui-btn-text-shadow-hover:none;--ui-btn-text-shadow-active:none;--ui-btn-margin-left:12px;--ui-btn-clock-white:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 19 19'%3E%3Cstyle%3E@keyframes arrow-loader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg style='animation:arrow-loader 1s infinite linear;transform-origin:center'%3E%3Cpath fill='none' stroke='%23fff' d='M.5 9.475a8.976 8.976 0 0 1 17.95 0 8.976 8.976 0 0 1-17.95 0Z'/%3E%3Cpath stroke='%23fff' d='M9.5 4v5.5'/%3E%3C/g%3E%3Cpath fill='transparent' stroke='%23fff' d='M15 9.5H9.5' style='animation:arrowLoader 12s infinite linear;transform-origin:center'/%3E%3C/svg%3E\");--ui-btn-clock-black:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' viewBox='0 0 19 19'%3E%3Cstyle%3E@keyframes arrow-loader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg style='animation:arrow-loader 1s infinite linear;transform-origin:center'%3E%3Cpath fill='none' stroke='%23525c69' d='M.5 9.475a8.976 8.976 0 0 1 17.95 0 8.976 8.976 0 0 1-17.95 0Z'/%3E%3Cpath stroke='%23525c69' d='M9.5 4v5.5'/%3E%3C/g%3E%3Cpath stroke='%23525c69' d='M15 9.5H9.5' style='animation:arrowLoader 12s infinite linear;transform-origin:center'/%3E%3C/svg%3E\");--ui-btn-wait-white:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21'%3E%3Cstyle%3E@keyframes waitLoader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg fill='%23fff' style='-moz-transform-origin:50%25;transform-origin:50%25;animation:waitLoader 1s infinite steps(12)'%3E%3Cpath d='M6.434 8.075a1.073 1.073 0 0 1-1.465.378L2.51 7.004a1.075 1.075 0 0 1-.378-1.466 1.073 1.073 0 0 1 1.465-.378l2.46 1.45c.506.298.676.958.377 1.465' opacity='.1'/%3E%3Cpath d='M8.109 6.415a1.073 1.073 0 0 1-1.462-.391L5.219 3.553a1.073 1.073 0 0 1 .39-1.462 1.073 1.073 0 0 1 1.462.391L8.5 4.952c.294.51.118 1.168-.391 1.463' opacity='.2'/%3E%3Cpath d='M10.43 5.792c-.589 0-1.07-.481-1.07-1.07V1.868c0-.589.481-1.07 1.07-1.07.588 0 1.07.481 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.3'/%3E%3Cpath d='M15.32 2.132c.508.3.678.958.379 1.466l-1.45 2.458a1.074 1.074 0 0 1-1.465.378 1.07 1.07 0 0 1-.378-1.464l1.45-2.46a1.074 1.074 0 0 1 1.465-.378' opacity='.4'/%3E%3Cpath d='M18.768 5.61c.295.509.12 1.167-.39 1.461L15.905 8.5a1.07 1.07 0 0 1-1.462-.39 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.462.391' opacity='.5'/%3E%3Cpath d='M20.061 10.43c0 .588-.481 1.07-1.07 1.07h-2.854c-.588 0-1.07-.482-1.07-1.07s.482-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07' opacity='.6'/%3E%3Cpath d='M18.727 15.32a1.074 1.074 0 0 1-1.465.379l-2.459-1.45a1.073 1.073 0 0 1-.378-1.465 1.07 1.07 0 0 1 1.465-.378l2.459 1.45c.507.298.677.957.378 1.465' opacity='.7'/%3E%3Cpath d='M15.25 18.768c-.51.295-1.168.12-1.462-.39l-1.429-2.472a1.073 1.073 0 0 1 .391-1.461 1.073 1.073 0 0 1 1.463.39l1.428 2.471c.294.51.119 1.167-.391 1.462' opacity='.8'/%3E%3Cpath d='M10.43 20.061c-.589 0-1.07-.481-1.07-1.07v-2.854c0-.588.481-1.07 1.07-1.07.588 0 1.07.482 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.9'/%3E%3Cpath d='M8.075 14.425c.507.299.677.958.378 1.465l-1.449 2.46a1.075 1.075 0 0 1-1.466.378 1.073 1.073 0 0 1-.378-1.465l1.45-2.46a1.074 1.074 0 0 1 1.465-.377' opacity='.95'/%3E%3Cpath d='M5.792 10.43c0 .588-.481 1.07-1.07 1.07H1.868c-.589 0-1.07-.482-1.07-1.07s.481-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07m.623 2.32c.294.51.119 1.168-.391 1.462l-2.471 1.429a1.074 1.074 0 0 1-1.463-.391 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.463.391'/%3E%3C/g%3E%3C/svg%3E\");--ui-btn-wait-black:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='21' height='21' viewBox='0 0 21 21'%3E%3Cstyle%3E@keyframes waitLoader{0%25{transform:rotate(0deg)}to{transform:rotate(360deg)}}%3C/style%3E%3Cg fill='%23535c69' style='-moz-transform-origin:50%25;transform-origin:50%25;animation:waitLoader 1s infinite steps(12)'%3E%3Cpath d='M6.434 8.075a1.073 1.073 0 0 1-1.465.378L2.51 7.004a1.075 1.075 0 0 1-.378-1.466 1.073 1.073 0 0 1 1.465-.378l2.46 1.45c.506.298.676.958.377 1.465' opacity='.1'/%3E%3Cpath d='M8.109 6.415a1.073 1.073 0 0 1-1.462-.391L5.219 3.553a1.073 1.073 0 0 1 .39-1.462 1.073 1.073 0 0 1 1.462.391L8.5 4.952c.294.51.118 1.168-.391 1.463' opacity='.2'/%3E%3Cpath d='M10.43 5.792c-.589 0-1.07-.481-1.07-1.07V1.868c0-.589.481-1.07 1.07-1.07.588 0 1.07.481 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.3'/%3E%3Cpath d='M15.32 2.132c.508.3.678.958.379 1.466l-1.45 2.458a1.074 1.074 0 0 1-1.465.378 1.07 1.07 0 0 1-.378-1.464l1.45-2.46a1.074 1.074 0 0 1 1.465-.378' opacity='.4'/%3E%3Cpath d='M18.768 5.61c.295.509.12 1.167-.39 1.461L15.905 8.5a1.07 1.07 0 0 1-1.462-.39 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.462.391' opacity='.5'/%3E%3Cpath d='M20.061 10.43c0 .588-.481 1.07-1.07 1.07h-2.854c-.588 0-1.07-.482-1.07-1.07s.482-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07' opacity='.6'/%3E%3Cpath d='M18.727 15.32a1.074 1.074 0 0 1-1.465.379l-2.459-1.45a1.073 1.073 0 0 1-.378-1.465 1.07 1.07 0 0 1 1.465-.378l2.459 1.45c.507.298.677.957.378 1.465' opacity='.7'/%3E%3Cpath d='M15.25 18.768c-.51.295-1.168.12-1.462-.39l-1.429-2.472a1.073 1.073 0 0 1 .391-1.461 1.073 1.073 0 0 1 1.463.39l1.428 2.471c.294.51.119 1.167-.391 1.462' opacity='.8'/%3E%3Cpath d='M10.43 20.061c-.589 0-1.07-.481-1.07-1.07v-2.854c0-.588.481-1.07 1.07-1.07.588 0 1.07.482 1.07 1.07v2.854c0 .589-.482 1.07-1.07 1.07' opacity='.9'/%3E%3Cpath d='M8.075 14.425c.507.299.677.958.378 1.465l-1.449 2.46a1.075 1.075 0 0 1-1.466.378 1.073 1.073 0 0 1-.378-1.465l1.45-2.46a1.074 1.074 0 0 1 1.465-.377' opacity='.95'/%3E%3Cpath d='M5.792 10.43c0 .588-.481 1.07-1.07 1.07H1.868c-.589 0-1.07-.482-1.07-1.07s.481-1.07 1.07-1.07h2.854c.589 0 1.07.481 1.07 1.07m.623 2.32c.294.51.119 1.168-.391 1.462l-2.471 1.429a1.074 1.074 0 0 1-1.463-.391 1.073 1.073 0 0 1 .392-1.462l2.47-1.429a1.073 1.073 0 0 1 1.463.391'/%3E%3C/g%3E%3C/svg%3E\");--ui-btn-spinner:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='19' style='-webkit-animation:rotate 2s linear infinite;animation:rotate 2s linear infinite;-webkit-transform-origin:center center;transform-origin:center center' viewBox='25 25 50 50'%3E%3Cstyle%3E@keyframes rotate{to{transform:rotate(360deg)}}@keyframes dash{0%25{stroke-dasharray:1,200;stroke-dashoffset:0}50%25{stroke-dasharray:89,200;stroke-dashoffset:-35px}to{stroke-dasharray:89,200;stroke-dashoffset:-124px}}%3C/style%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke-miterlimit='10' style='stroke:rgba(215,220,223,.74);stroke-width:6;stroke-dasharray:20,200;stroke-dashoffset:0;-webkit-animation:dash 1.5s ease-in-out infinite;animation:dash 1.5s ease-in-out infinite;stroke-linecap:round'/%3E%3C/svg%3E\")}.ui-btn-split.--wide,.ui-btn.--wide{width:100%}.ui-btn-split.--air,.ui-btn.--air,.ui-btn.--air.--with-left-icon{border:var(--ui-btn-border);border-radius:var(--ui-btn-radius);border-color:var(--ui-btn-border-color);font-family:var(--ui-font-family-primary);color:var(--ui-btn-color);transition-duration:0s;background-position:unset;background:var(--ui-btn-background-gradient),var(--ui-btn-custom-background,none)}.ui-btn.--air.ui-btn-focus,.ui-btn.--air.ui-btn-hover,.ui-btn.--air:focus-visible,.ui-btn.--air:hover{background:var(--ui-btn-background-gradient-hover),var(--ui-btn-custom-background,none);border-color:var(--ui-btn-border-color-hover)}.ui-btn.--air.--remove-left-corners{border-top-left-radius:0;border-bottom-left-radius:0}.ui-btn.--air.--remove-right-corners{border-top-right-radius:0;border-bottom-right-radius:0}.ui-btn-split.--air .ui-btn-main{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;width:100%}.ui-btn-split.--air .ui-btn-menu{flex-shrink:0;border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.ui-btn-split.--air .ui-btn-extra,.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air .ui-btn-menu{border:none;height:auto;transition-duration:0s}.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air[class*=ui-btn-icon-] .ui-btn-main,.ui-btn-split.--air[class*=ui-btn-icon-]:not(.--with-collapsed-icon) .ui-btn-main,.ui-btn.--air,.ui-btn.--air[class*=ui-btn-icon-],.ui-btn.--air[class*=ui-btn-icon-]:not(.--with-collapsed-icon){margin-left:0;font-weight:var(--ui-btn-font-weight);font-size:var(--ui-btn-font-size);padding-left:var(--ui-btn-padding-left);padding-right:var(--ui-btn-padding-right)}.ui-btn-split.--air~.ui-btn-split.--air,.ui-btn-split.--air~.ui-btn.--air,.ui-btn-split.--air~.ui-ctl.--air,.ui-btn.--air~.ui-btn-split.--air,.ui-btn.--air~.ui-btn.--air,.ui-btn.--air~.ui-ctl.--air,.ui-ctl.--air~.ui-btn-split.--air,.ui-ctl.--air~.ui-btn.--air,.ui-ctl.--air~.ui-ctl.--air{margin-left:0}.ui-btn-split.--air .ui-btn-menu:not(.ui-btn-dropdown),.ui-btn-split.--air:not(.ui-btn-dropdown){content:none}.ui-btn-split.--air .ui-btn-extra:focus-visible,.ui-btn-split.--air .ui-btn-extra:hover,.ui-btn-split.--air .ui-btn-main:focus-visible,.ui-btn-split.--air .ui-btn-main:hover,.ui-btn-split.--air .ui-btn-menu:not(.--switcher):focus-visible,.ui-btn-split.--air .ui-btn-menu:not(.--switcher):hover,.ui-btn-split.--air.ui-btn-extra-hover .ui-btn-extra,.ui-btn-split.--air.ui-btn-hover,.ui-btn-split.--air.ui-btn-hover .ui-btn-extra,.ui-btn-split.--air.ui-btn-hover .ui-btn-main,.ui-btn-split.--air.ui-btn-hover .ui-btn-menu,.ui-btn-split.--air.ui-btn-main-hover .ui-btn-main,.ui-btn-split.--air.ui-btn-menu-hover .ui-btn-menu,.ui-btn.--air:focus-visible,.ui-btn.--air:hover{border-color:var(--ui-btn-border-color-hover);background:var(--ui-btn-background-gradient-hover);color:var(--ui-btn-color-hover)}.ui-btn-active.--air .ui-btn-extra:hover,.ui-btn-extra-active.--air .ui-btn-extra:hover,.ui-btn-split.--air .ui-btn-extra:active,.ui-btn-split.--air .ui-btn-main:active,.ui-btn-split.--air .ui-btn-menu:not(.--switcher):active,.ui-btn.--air:active{outline:none;border-color:var(--ui-btn-border-color-active);background:var(--ui-btn-background-gradient-active);color:var(--ui-btn-color-active)}:where(.ui-btn,.ui-btn-main,.ui-btn-menu:not(.--switcher)):focus-visible,html[data-input-modality=keyboard] :where(.ui-btn,.ui-btn-main,.ui-btn-menu:not(.--switcher)):focus:not(:focus-visible){outline-offset:2px;outline-width:2px;outline-color:var(--ui-color-accent-main-link);outline-style:solid}html[data-input-modality=pointer] :where(.ui-btn,.ui-btn-main,.ui-btn-menu:not(.--switcher)):focus-visible{outline:none}.ui-btn-active.--air,.ui-btn-active.--air:hover,.ui-btn-clock.--air,.ui-btn-clock.--air:hover,.ui-btn-wait.--air,.ui-btn-wait.--air:hover{border-color:var(--ui-btn-border-color-active);background:var(--ui-btn-background-gradient-active);color:var(--ui-btn-color-active);opacity:1}.ui-btn-split.--air.ui-btn-xl,.ui-btn-split.--air.ui-btn-xl .ui-btn-main,.ui-btn-split.--air.ui-btn-xl .ui-btn-menu,.ui-btn.--air.ui-btn-xl{--ui-btn-padding-right:23px;--ui-btn-padding-left:23px;--ui-btn-icon-compensation:8px;--ui-btn-radius:var(--ui-border-radius-md);--ui-btn-font-size:var(--ui-font-size-xl);--ui-btn-icon-size:28px;--ui-btn-icon-space:4px;--ui-btn-dropdown-icon-size:22px;--ui-btn-dropdown-icon-inline-space:6px;--ui-btn-dropdown-icon-compensation:6px;--ui-btn-height:var(--ui-btn-size-xl);--ui-btn-wait-icon-size:24px;--ui-btn-split-divider-height:26px;--ui--btn-width-with-only-icon:var(--ui-btn-height);--ui-btn-corner-counter-inline-shift:13px;--ui-btn-counter-inline-space:8px}.ui-btn-split.--air.ui-btn-xl .ui-btn-menu.--switcher{padding-left:14px;padding-right:14px}.ui-btn-split.--air.ui-btn-lg,.ui-btn-split.--air.ui-btn-lg .ui-btn-main,.ui-btn-split.--air.ui-btn-lg .ui-btn-menu,.ui-btn.--air.ui-btn-lg{--ui-btn-padding-right:17px;--ui-btn-padding-left:17px;--ui-btn-icon-compensation:10px;--ui-btn-radius:var(--ui-border-radius-md);--ui-btn-font-size:var(--ui-font-size-lg);--ui-btn-icon-size:28px;--ui-btn-icon-space:4px;--ui-btn-dropdown-icon-size:20px;--ui-btn-dropdown-icon-inline-space:6px;--ui-btn-dropdown-icon-compensation:6px;--ui-btn-height:var(--ui-btn-size-lg);--ui-btn-wait-icon-size:22px;--ui-btn-split-divider-height:22px;--ui-btn-letter-spacing:-0.1px;--ui--btn-width-with-only-icon:var(--ui-btn-height);--ui-btn-corner-counter-inline-shift:12px;--ui-btn-counter-inline-space:8px}.ui-btn-split.--air.ui-btn-lg .ui-btn-menu.--switcher{padding-left:12px;padding-right:12px}.ui-btn-split.--air,.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air .ui-btn-menu,.ui-btn-split.--air.ui-btn-md,.ui-btn-split.--air.ui-btn-md .ui-btn-main,.ui-btn-split.--air.ui-btn-md .ui-btn-menu,.ui-btn.--air,.ui-btn.--air.ui-btn-md{--ui-btn-padding-right:13px;--ui-btn-padding-left:13px;--ui-btn-icon-compensation:6px;--ui-btn-radius:var(--ui-border-radius-md);--ui-btn-font-size:var(--ui-font-size-md);--ui-btn-font-weight:var(--ui-font-weight-medium);--ui-btn-icon-size:24px;--ui-btn-icon-space:2px;--ui-btn-dropdown-icon-size:18px;--ui-btn-dropdown-icon-inline-space:4px;--ui-btn-dropdown-icon-compensation:4px;--ui-btn-height:var(--ui-btn-size-md);--ui-btn-wait-icon-size:20px;--ui-btn-split-divider-height:18px;--ui--btn-width-with-only-icon:var(--ui-btn-height);--ui-btn-corner-counter-inline-shift:13px;--ui-btn-counter-inline-space:6px}.ui-btn-split.--air.ui-btn-md .ui-btn-menu.--switcher{padding-left:10px;padding-right:10px}.ui-btn-split.--air.ui-btn-sm,.ui-btn-split.--air.ui-btn-sm .ui-btn-main,.ui-btn-split.--air.ui-btn-sm .ui-btn-menu,.ui-btn.--air.ui-btn-sm{--ui-btn-padding-right:9px;--ui-btn-padding-left:9px;--ui-btn-icon-compensation:4px;--ui-btn-radius:var(--ui-border-radius-sm);--ui-btn-font-size:var(--ui-font-size-sm);--ui-btn-font-weight:var(--ui-font-weight-normal);--ui-btn-icon-size:20px;--ui-btn-icon-space:4px;--ui-btn-dropdown-icon-size:16px;--ui-btn-dropdown-icon-inline-space:3px;--ui-btn-dropdown-icon-compensation:3px;--ui-btn-height:var(--ui-btn-size-sm);--ui-btn-wait-icon-size:16px;--ui-btn-letter-spacing:-0.15px;--ui-btn-split-divider-height:14px;--ui--btn-width-with-only-icon:34px;--ui-btn-corner-counter-inline-shift:13px;--ui-btn-counter-inline-space:6px}.ui-btn-split.--air.ui-btn-sm .ui-btn-menu.--switcher{padding-left:8px;padding-right:8px}.ui-btn-split.--air.ui-btn-xs,.ui-btn-split.--air.ui-btn-xs .ui-btn-main,.ui-btn-split.--air.ui-btn-xs .ui-btn-menu,.ui-btn.--air.ui-btn-xs{--ui-btn-padding-right:7px;--ui-btn-padding-left:7px;--ui-btn-icon-compensation:2px;--ui-btn-radius:var(--ui-border-radius-xs);--ui-btn-font-size:var(--ui-font-size-xs);--ui-btn-font-weight:var(--ui-font-weight-normal);--ui-btn-icon-size:14px;--ui-btn-icon-space:4px;--ui-btn-dropdown-icon-size:14px;--ui-btn-dropdown-icon-inline-space:4px;--ui-btn-dropdown-icon-compensation:2px;--ui-btn-height:var(--ui-btn-size-xs);--ui-btn-wait-icon-size:14px;--ui-btn-letter-spacing:-0.1px;--ui-btn-split-divider-height:12px;--ui--btn-width-with-only-icon:28px;--ui-btn-corner-counter-inline-shift:11px;--ui-btn-counter-inline-space:6px}.ui-btn-split.--air.ui-btn-xs .ui-btn-menu.--switcher{padding-left:6px;padding-right:6px}.ui-btn-split.--air.ui-btn-xss,.ui-btn-split.--air.ui-btn-xss .ui-btn-main,.ui-btn-split.--air.ui-btn-xss .ui-btn-menu,.ui-btn.--air.ui-btn-xss{--ui-btn-padding-right:7px;--ui-btn-padding-left:8px;--ui-btn-icon-compensation:5px;--ui-btn-radius:5px;--ui-btn-font-size:var(--ui-font-size-4xs);--ui-btn-font-weight:var(--ui-font-weight-normal);--ui-btn-icon-size:14px;--ui-btn-icon-space:4px;--ui-btn-dropdown-icon-size:12px;--ui-btn-dropdown-icon-inline-space:2px;--ui-btn-dropdown-icon-compensation:2px;--ui-btn-height:var(--ui-btn-size-xss);--ui-btn-wait-icon-size:12px;--ui--btn-width-with-only-icon:24px;--ui-btn-corner-counter-inline-shift:10px;--ui-btn-letter-spacing:0.1px;--ui-btn-split-divider-height:10px;--ui-btn-counter-inline-space:6px}.ui-btn-split.--air.ui-btn-xss .ui-btn-menu.--switcher{padding-left:4px;padding-right:4px}.ui-btn-dropdown.--air,.ui-btn-split.--air .ui-btn-main,.ui-btn-split.--air.--with-right-icon[class*=ui-btn-icon-] .ui-btn-main,.ui-btn.--air.--with-right-counter,.ui-btn.--air.--with-right-icon,.ui-btn.--air.--with-right-icon[class*=ui-btn-icon-]{padding-right:calc(var(--ui-btn-padding-right) + 1px)}.ui-btn-split.--air.--with-right-icon:not(.--with-left-icon) .ui-btn-main,.ui-btn-split.ui-btn-lg.--air.--with-right-icon:not(.--with-left-icon) .ui-btn-main,.ui-btn.--air.--with-right-icon:not(.--with-left-icon),.ui-btn.ui-btn-lg.--air.--with-right-icon:not(.--with-left-icon){padding-left:var(--ui-btn-padding-left)}.ui-btn-split.--air.--with-left-counter .ui-btn-main,.ui-btn-split.--air.--with-left-icon .ui-btn-main,.ui-btn-split.--air.--with-left-icon[class*=ui-btn-icon-] .ui-btn-main,.ui-btn.--air.--with-left-counter,.ui-btn.--air.--with-left-icon,.ui-btn.--air.--with-left-icon[class*=ui-btn-icon-],.ui-btn.ui-btn-lg.--air.--with-left-icon{padding-left:calc(var(--ui-btn-padding-left) + 1px)}.ui-btn-split.--air:not(.--with-left-icon):not(.--with-right-icon) .ui-btn-main,.ui-btn.--air:not(.--with-left-icon):not(.--with-right-icon):not(.--with-icon){--ui-btn-icon-compensation:0px}.ui-btn.--air:not(.ui-btn-dropdown){--ui-btn-dropdown-icon-compensation:0px}.ui-btn-split.--air.--with-left-icon[class*=ui-btn-icon-] .ui-btn-main,.ui-btn-split.ui-btn-lg.--air.--with-left-icon[class*=ui-btn-icon-] .ui-btn-main,.ui-btn.--air.--with-icon,.ui-btn.--air.--with-left-icon[class*=ui-btn-icon-],.ui-btn.ui-btn-lg.--air.--with-left-icon[class*=ui-btn-icon-]{padding-left:calc(var(--ui-btn-padding-left) - var(--ui-btn-icon-compensation))}.ui-btn-split.--air.--with-right-icon[class*=ui-btn-icon-] .ui-btn-main,.ui-btn.--air.--with-right-icon[class*=ui-btn-icon-]{padding-right:calc(var(--ui-btn-padding-right) - var(--ui-btn-icon-compensation))}.ui-btn.--air.ui-btn-dropdown{padding-right:calc(var(--ui-btn-padding-right) - var(--ui-btn-dropdown-icon-compensation))}.ui-btn-split.--air,.ui-btn-split.--air.--style-filled,.ui-btn.--air,.ui-btn.--air.--style-filled{--ui-btn-background:var(--ui-color-design-filled-bg);--ui-btn-border-color:var(--ui-color-design-filled-stroke);--ui-btn-border-width:var(--ui-design-filled-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-content-divider)}.ui-btn-split.--air.--style-filled-white,.ui-btn.--air.--style-filled-white{--ui-btn-background:var(--ui-color-design-filled-white-bg);--ui-btn-border-color:var(--ui-color-design-filled-white-stroke);--ui-btn-border-width:var(--ui-design-filled-white-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-white-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-white-content-divider)}.ui-btn-split.--air.--style-tinted,.ui-btn.--air.--style-tinted{--ui-btn-background:var(--ui-color-design-tinted-bg);--ui-btn-border-color:var(--ui-color-design-tinted-stroke);--ui-btn-border-width:var(--ui-design-tinted-stroke-weight);--ui-btn-color:var(--ui-color-design-tinted-content);--ui-btn-split-divider-color:var(--ui-color-design-tinted-content-divider)}.ui-btn-split.--air.--style-tinted-alert,.ui-btn.--air.--style-tinted-alert{--ui-btn-background:var(--ui-color-design-tinted-alert-bg);--ui-btn-border-color:var(--ui-color-design-tinted-alert-stroke);--ui-btn-border-width:var(--ui-design-tinted-alert-stroke-weight);--ui-btn-color:var(--ui-color-design-tinted-alert-content);--ui-btn-split-divider-color:var(--ui-color-design-tinted-alert-content-divider)}.ui-btn-split.--air.--style-tinted-bitrix-gpt,.ui-btn.--air.--style-tinted-bitrix-gpt{--ui-btn-background-gradient:linear-gradient(269.7deg,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-1) 1.77%,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-2) 16.38%,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-3) 50.5%,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-4) 99.23%);--ui-btn-border-color:transparent;--ui-btn-border-width:var(--ui-design-tinted-bitrix-gpt-stroke-weight);--ui-btn-color:var(--ui-color-design-tinted-bitrix-gpt-content-icon);--ui-btn-color-chevron:var(--ui-color-design-tinted-bitrix-gpt-content-chevron);--ui-btn-split-divider-color:var(--ui-color-design-tinted-bitrix-gpt-content-divider);--hover-color-1:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-1) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-2:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-2) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-3:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-3) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-4:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-4) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--active-color-1:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-1) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-2:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-2) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-3:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-3) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-4:color-mix(in srgb,var(--ui-color-design-tinted-bitrix-gpt-bg-gradient-4) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-background-gradient-hover:linear-gradient(269.7deg,var(--hover-color-1) 1.77%,var(--hover-color-2) 16.38%,var(--hover-color-3) 50.5%,var(--hover-color-4) 99.23%);--ui-btn-background-gradient-active:linear-gradient(269.7deg,var(--active-color-1) 1.77%,var(--active-color-2) 16.38%,var(--active-color-3) 50.5%,var(--active-color-4) 99.23%)}.ui-btn-split.--air.--style-tinted-bitrix-gpt .ui-btn-main .ui-btn-text-inner,.ui-btn.--air.--style-tinted-bitrix-gpt .ui-btn-text-inner{background:linear-gradient(263.02deg,var(--ui-color-design-tinted-bitrix-gpt-content-gradient-5) 2.92%,var(--ui-color-design-tinted-bitrix-gpt-content-gradient-4) 25.99%,var(--ui-color-design-tinted-bitrix-gpt-content-gradient-3) 49.07%,var(--ui-color-design-tinted-bitrix-gpt-content-gradient-2) 76.77%,var(--ui-color-design-tinted-bitrix-gpt-content-gradient-1) 86%);background-clip:text;-webkit-background-clip:text;color:transparent}.ui-btn-split.--air.--style-outline-accent-1,.ui-btn.--air.--style-outline-accent-1{--ui-btn-background:var(--ui-color-design-outline-a1-bg);--ui-btn-border-color:var(--ui-color-design-outline-a1-stroke);--ui-btn-border-width:var(--ui-design-outline-a1-stroke-weight);--ui-btn-color:var(--ui-color-design-outline-a1-content);--ui-btn-split-divider-color:var(--ui-color-design-outline-a1-content-divider)}.ui-btn-split.--air.--style-outline-accent-2,.ui-btn.--air.--style-outline-accent-2{--ui-btn-background:var(--ui-color-design-outline-a2-bg);--ui-btn-border-color:var(--ui-color-design-outline-a2-stroke);--ui-btn-border-width:var(--ui-design-outline-a2-stroke-weight);--ui-btn-color:var(--ui-color-design-outline-a2-content);--ui-btn-split-divider-color:var(--ui-color-design-outline-a2-content-divider)}.ui-btn-split.--air.--style-outline,.ui-btn.--air.--style-outline{--ui-btn-background:var(--ui-color-design-outline-bg);--ui-btn-border-color:var(--ui-color-design-outline-stroke);--ui-btn-border-width:var(--ui-design-outline-stroke-weight);--ui-btn-color:var(--ui-color-design-outline-content);--ui-btn-split-divider-color:var(--ui-color-design-outline-content-divider)}.ui-btn-split.--air.--style-outline-bitrix-gpt,.ui-btn.--air.--style-outline-bitrix-gpt{--ui-btn-background:var(--ui-color-design-outline-bitrix-gpt-bg);--ui-btn-background-gradient:linear-gradient(var(--ui-btn-background),var(--ui-btn-background)) padding-box,linear-gradient(263.75deg,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-5) -5.96%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-4) 15.13%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-3) 47.18%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-2) 72.28%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-1) 94.05%) border-box;--ui-btn-border-color:transparent;--ui-btn-border-width:var(--ui-color-design-outline-bitrix-gpt-stroke-weight);--ui-btn-color:var(--ui-color-design-outline-bitrix-gpt-content-icon);--ui-btn-color-chevron:var(--ui-color-design-outline-bitrix-gpt-content-chevron);--ui-btn-split-divider-color:var(--ui-color-design-outline-bitrix-gpt-content-divider);--hover-bg:color-mix(in srgb,var(--ui-btn-background) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--active-bg:color-mix(in srgb,var(--ui-btn-background) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-background-gradient-hover:linear-gradient(var(--hover-bg),var(--hover-bg)) padding-box,linear-gradient(263.75deg,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-5) -5.96%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-4) 15.13%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-3) 47.18%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-2) 72.28%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-1) 94.05%) border-box;--ui-btn-background-gradient-active:linear-gradient(var(--active-bg),var(--active-bg)) padding-box,linear-gradient(263.75deg,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-5) -5.96%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-4) 15.13%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-3) 47.18%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-2) 72.28%,var(--ui-color-design-outline-bitrix-gpt-stroke-gradient-1) 94.05%) border-box}.ui-btn-split.--air.--style-outline-bitrix-gpt .ui-btn-main .ui-btn-text-inner,.ui-btn.--air.--style-outline-bitrix-gpt .ui-btn-text-inner{background:linear-gradient(264.09deg,var(--ui-color-design-outline-bitrix-gpt-content-gradient-5) 1.67%,var(--ui-color-design-outline-bitrix-gpt-content-gradient-4) 21.82%,var(--ui-color-design-outline-bitrix-gpt-content-gradient-3) 52.44%,var(--ui-color-design-outline-bitrix-gpt-content-gradient-2) 76.41%,var(--ui-color-design-outline-bitrix-gpt-content-gradient-1) 97.21%);background-clip:text;-webkit-background-clip:text;color:transparent}.ui-btn-split.--air.--style-outline-no-accent,.ui-btn.--air.--style-outline-no-accent{--ui-btn-background:var(--ui-color-design-outline-na-bg);--ui-btn-border-color:var(--ui-color-design-outline-na-stroke);--ui-btn-border-width:var(--ui-design-outline-na-stroke-weight);--ui-btn-color:var(--ui-color-design-outline-na-content);--ui-btn-split-divider-color:var(--ui-color-design-outline-na-content-divider)}.ui-btn-split.--air.--style-plain-accent,.ui-btn.--air.--style-plain-accent{--ui-btn-background:var(--ui-color-design-plain-a-bg);--ui-btn-border-color:var(--ui-color-design-plain-a-stroke);--ui-btn-border-width:var(--ui-design-plain-a-stroke-weight);--ui-btn-color:var(--ui-color-design-plain-a-content);--ui-btn-split-divider-color:var(--ui-color-design-plain-a-content-divider)}.ui-btn-split.--air.--style-plain,.ui-btn.--air.--style-plain{--ui-btn-background:var(--ui-color-design-plain-bg);--ui-btn-border-color:var(--ui-color-design-plain-stroke);--ui-btn-border-width:var(--ui-design-plain-stroke-weight);--ui-btn-color:var(--ui-color-design-plain-content);--ui-btn-split-divider-color:var(--ui-color-design-plain-content-divider)}.ui-btn-split.--air.--style-plain-no-accent,.ui-btn.--air.--style-plain-no-accent{--ui-btn-background:var(--ui-color-design-plain-na-bg);--ui-btn-border-color:var(--ui-color-design-plain-na-stroke);--ui-btn-border-width:var(--ui-design-plain-na-stroke-weight);--ui-btn-color:var(--ui-color-design-plain-na-content);--ui-btn-split-divider-color:var(--ui-color-design-plain-na-content-divider)}.ui-btn-split.--air.--style-selection,.ui-btn.--air.--style-selection{--ui-btn-background:var(--ui-color-design-selection-bg);--ui-btn-border-color:var(--ui-color-design-selection-stroke);--ui-btn-border-width:var(--ui-design-selection-stroke-weight);--ui-btn-color:var(--ui-color-design-selection-content);--ui-btn-split-divider-color:var(--ui-color-design-selection-content-divider)}.ui-btn-split.--air.--style-filled-copilot,.ui-btn.--air.--style-filled-copilot{--ui-btn-background:var(--ui-color-design-filled-copilot-bg);--ui-btn-border-color:var(--ui-color-design-filled-copilot-stroke);--ui-btn-border-width:var(--ui-design-filled-copilot-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-copilot-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-copilot-content-divider)}.ui-btn-split.--air.--style-filled-success,.ui-btn.--air.--style-filled-success{--ui-btn-background:var(--ui-color-design-filled-success-bg);--ui-btn-border-color:var(--ui-color-design-filled-success-stroke);--ui-btn-border-width:var(--ui-design-filled-success-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-success-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-success-content-divider)}.ui-btn-split.--air.--style-filled-alert,.ui-btn.--air.--style-filled-alert{--ui-btn-background:var(--ui-color-design-filled-alert-bg);--ui-btn-border-color:var(--ui-color-design-filled-alert-stroke);--ui-btn-border-width:var(--ui-design-filled-success-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-alert-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-alert-content-divider)}.ui-btn-split.--air.--style-filled-boost,.ui-btn.--air.--style-filled-boost{--ui-btn-background-gradient:radial-gradient(110.42% 110.42% at -10.42% 31.25%,var(--ui-color-design-filled-boost-bg-gradient-1) 0%,var(--ui-color-design-filled-boost-bg-gradient-2) 58.65%,var(--ui-color-design-filled-boost-bg-gradient-3) 100%);--ui-btn-border-color:var(--ui-color-design-filled-boost-stroke);--ui-btn-border-width:var(--ui-design-filled-boost-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-boost-content);--ui-btn-split-divider-color:var(--ui-color-design-filled-boost-content-divider);--hover-color-1:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-1) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-2:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-2) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-3:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-3) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--active-color-1:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-1) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-2:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-2) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-3:color-mix(in srgb,var(--ui-color-design-filled-boost-bg-gradient-3) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-background-gradient-hover:radial-gradient(110.42% 110.42% at -10.42% 31.25%,var(--hover-color-1) 0%,var(--hover-color-2) 58.65%,var(--hover-color-3) 100%);--ui-btn-background-gradient-active:radial-gradient(110.42% 110.42% at -10.42% 31.25%,var(--active-color-1) 0%,var(--active-color-2) 58.65%,var(--active-color-3) 100%)}.ui-btn-split.--air.--style-filled-bitrix-gpt,.ui-btn.--air.--style-filled-bitrix-gpt{--ui-btn-background-gradient:linear-gradient(263.02deg,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-5) 2.92%,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-4) 25.99%,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-3) 49.07%,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-2) 76.77%,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-1) 86%);--ui-btn-border-color:transparent;--ui-btn-border-width:var(--ui-design-filled-bitrix-gpt-stroke-weight);--ui-btn-color:var(--ui-color-design-filled-bitrix-gpt-content);--ui-btn-color-chevron:var(--ui-color-design-filled-bitrix-gpt-content-chevron);--ui-btn-split-divider-color:var(--ui-color-design-filled-bitrix-gpt-content-divider);--hover-color-1:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-5) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-2:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-4) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-3:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-3) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-4:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-2) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--hover-color-5:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-1) 100%,var(--ui-color-bg-state-hover-default-hex) var(--ui-color-bg-state-hover-default-opacity));--active-color-1:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-5) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-2:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-4) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-3:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-3) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-4:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-2) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--active-color-5:color-mix(in srgb,var(--ui-color-design-filled-bitrix-gpt-bg-gradient-1) 100%,var(--ui-color-bg-state-click-default-hex) var(--ui-color-bg-state-click-default-opacity));--ui-btn-background-gradient-hover:linear-gradient(263.02deg,var(--hover-color-1) 2.92%,var(--hover-color-2) 25.99%,var(--hover-color-3) 49.07%,var(--hover-color-4) 76.77%,var(--hover-color-5) 86%);--ui-btn-background-gradient-active:linear-gradient(263.02deg,var(--active-color-1) 2.92%,var(--active-color-2) 25.99%,var(--active-color-3) 49.07%,var(--active-color-4) 76.77%,var(--active-color-5) 86%)}.ui-btn-split.--air .ui-btn-menu:before{content:\"\";position:relative;left:1px;top:auto;margin:0;padding:0;width:var(--ui-btn-dropdown-icon-size);height:var(--ui-btn-dropdown-icon-size);border:none;-webkit-mask-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' fill-rule='evenodd' d='M5.505 9.505a.7.7 0 0 1 .99 0L12 15.01l5.505-5.505a.7.7 0 0 1 .99.99l-6 6a.7.7 0 0 1-.99 0l-6-6a.7.7 0 0 1 0-.99' clip-rule='evenodd'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' fill-rule='evenodd' d='M5.505 9.505a.7.7 0 0 1 .99 0L12 15.01l5.505-5.505a.7.7 0 0 1 .99.99l-6 6a.7.7 0 0 1-.99 0l-6-6a.7.7 0 0 1 0-.99' clip-rule='evenodd'/%3E%3C/svg%3E\");-webkit-mask-position:center center;mask-position:center center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;background-color:var(--ui-btn-color-chevron)}.ui-btn-split.--air .ui-btn-menu.--switcher:before{content:none}.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock),.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock),.ui-btn.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock),.ui-btn[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock){--ui-btn-background:var(--ui-color-design-disabled-bg);--ui-btn-background-gradient:linear-gradient(180deg,var(--ui-btn-background) 0%,var(--ui-btn-background) 100%);--ui-btn-border-color:var(--ui-color-design-disabled-stroke);--ui-btn-color:var(--ui-color-design-disabled-content)}.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main,.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main:active,.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main:hover,.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu,.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu:active,.ui-btn-split.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu:hover,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main:active,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-main:hover,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu:active,.ui-btn-split[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock) .ui-btn-menu:hover,.ui-btn.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock),.ui-btn.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock):active,.ui-btn.--air.ui-btn-disabled:not(.ui-btn-wait):not(.ui-btn-clock):hover,.ui-btn[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock),.ui-btn[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock):active,.ui-btn[disabled].--air:not(.ui-btn-wait):not(.ui-btn-clock):hover{opacity:1;cursor:not-allowed;background:var(--ui-btn-background-gradient),var(--ui-btn-custom-background,none);border-color:var(--ui-btn-border-color)}.ui-btn-split.--air.ui-btn-collapsed:not(.ui-btn-dropdown) .ui-btn-main:after,.ui-btn-split.--air:not(.ui-btn-dropdown) .ui-btn-main:after,.ui-btn.--air:not(.ui-btn-dropdown):after{display:none}.ui-btn-split.--air.--with-collapsed-icon .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-left-icon .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-right-icon .ui-btn-main .ui-btn-text:after,.ui-btn.--air.--with-collapsed-icon .ui-btn-text:before,.ui-btn.--air.--with-left-icon .ui-btn-text:before,.ui-btn.--air.--with-right-icon .ui-btn-text:after{content:\"\";position:relative;top:0;display:inline-block;width:var(--ui-btn-icon-size);min-width:var(--ui-btn-icon-size);height:var(--ui-btn-icon-size);background-color:var(--ui-btn-color);-webkit-mask-image:var(--ui-btn-icon);mask-image:var(--ui-btn-icon);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center center;mask-position:center center;vertical-align:middle}.ui-btn-split.--air.--with-left-icon .ui-btn-main .ui-btn-text:before,.ui-btn.--air.--with-left-icon .ui-btn-text:before{margin-right:var(--ui-btn-icon-space)}.ui-btn-split.--air.--with-right-icon .ui-btn-main .ui-btn-text:after,.ui-btn.--air.--with-right-icon .ui-btn-text:after{margin-left:var(--ui-btn-icon-space)}.ui-btn-split.--air.--with-collapsed-icon .ui-btn-main .ui-btn-text:before,.ui-btn.--air.--with-collapsed-icon .ui-btn-text:before{display:none}.ui-btn.ui-btn-dropdown.--air:before{content:normal}.ui-btn.ui-btn-dropdown.--air:after{content:\"\";position:relative;display:inline-block;top:auto;left:auto;width:var(--ui-btn-dropdown-icon-size);min-width:var(--ui-btn-dropdown-icon-size);height:var(--ui-btn-dropdown-icon-size);margin-left:var(--ui-btn-dropdown-icon-inline-space);-webkit-mask-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' fill-rule='evenodd' d='M5.505 9.505a.7.7 0 0 1 .99 0L12 15.01l5.505-5.505a.7.7 0 0 1 .99.99l-6 6a.7.7 0 0 1-.99 0l-6-6a.7.7 0 0 1 0-.99' clip-rule='evenodd'/%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23333' fill-rule='evenodd' d='M5.505 9.505a.7.7 0 0 1 .99 0L12 15.01l5.505-5.505a.7.7 0 0 1 .99.99l-6 6a.7.7 0 0 1-.99 0l-6-6a.7.7 0 0 1 0-.99' clip-rule='evenodd'/%3E%3C/svg%3E\");-webkit-mask-position:center center;mask-position:center center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;background:var(--ui-btn-color-chevron);transform:none;transition:none}.ui-btn-dropdown.--with-right-icon.--air:after{margin-left:calc(var(--ui-btn-dropdown-icon-inline-space) - var(--ui-btn-icon-compensation))}.ui-btn-split.--air,.ui-btn.--air{height:var(--ui-btn-height);box-sizing:border-box}.ui-btn-split.--air .ui-btn-main .ui-btn-text,.ui-btn.--air .ui-btn-text{max-width:100%;display:inline-flex;align-items:center;overflow:unset;white-space:unset;text-overflow:unset;letter-spacing:var(--ui-btn-letter-spacing)}.ui-btn-split.--air .ui-btn-main .ui-btn-text-inner,.ui-btn.--air .ui-btn-text-inner{overflow:hidden;max-width:100%;white-space:nowrap;text-overflow:ellipsis;display:inline-block;margin-top:var(--ui-btn-title-comensation)}.ui-btn.--air.ui-btn-dropdown .ui-btn-text{max-width:calc(100% - var(--ui-btn-dropdown-icon-size))}.ui-btn-clock.--air,.ui-btn-clock.--air *,.ui-btn-wait.--air,.ui-btn-wait.--air *{cursor:default}.ui-btn-clock.--air *,.ui-btn-wait.--air *{opacity:0}.ui-btn-clock.--air:before,.ui-btn-wait.--air:before{content:\"\";display:inline-block;position:absolute;top:0;left:0;right:auto;width:100%;height:100%;margin:0;transform:none;background-color:var(--ui-btn-color);-webkit-mask-size:var(--ui-btn-wait-icon-size);mask-size:var(--ui-btn-wait-icon-size);-webkit-mask-position:center center;mask-position:center center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;border:none}.ui-btn-wait.--air:before{-webkit-mask-image:var(--ui-btn-wait-loader);mask-image:var(--ui-btn-wait-loader)}.ui-btn-clock.--air:before{-webkit-mask-image:var(--ui-btn-clock-loader);mask-image:var(--ui-btn-clock-loader)}.ui-btn-split.--air .ui-btn-menu{min-width:var(--ui-btn-height);display:flex;flex-direction:row;align-items:center;justify-content:center;padding:0}.ui-btn-split.--air .ui-btn-menu:after{height:var(--ui-btn-split-divider-height);top:auto;bottom:auto;background:var(--ui-btn-split-divider-color);opacity:1}.ui-btn-split.--air{padding-right:0}.ui-btn-split.--air .ui-btn-menu{position:relative;top:auto;left:auto}.ui-btn-split.--air .ui-btn-main .ui-btn-left-counter,.ui-btn-split.--air .ui-btn-main .ui-btn-right-counter,.ui-btn.--air .ui-btn-left-counter,.ui-btn.--air .ui-btn-right-counter{display:inline-flex;height:var(--ui-btn-height);vertical-align:top}.ui-btn-left-counter{margin-right:var(--ui-btn-counter-inline-space)}.ui-btn-right-counter{margin-left:var(--ui-btn-counter-inline-space)}.ui-btn-split.--air.ui-btn-collapsed .ui-btn-main,.ui-btn.--air.ui-btn-collapsed{--ui-btn-padding-right:0px;--ui-btn-padding-left:0px;width:var(--ui--btn-width-with-only-icon);min-width:var(--ui--btn-width-with-only-icon)}.ui-btn-split.--air.ui-btn-collapsed .ui-btn-main .ui-btn-text,.ui-btn.--air.ui-btn-collapsed .ui-btn-text{font-size:0}.ui-btn.--air.ui-btn-collapsed .ui-btn-left-counter,.ui-btn.--air.ui-btn-collapsed .ui-btn-right-counter{position:absolute;top:3px;margin-left:0;margin-right:0;pointer-events:none}.ui-btn.--air.ui-btn-collapsed .ui-btn-left-counter{transform:translate(-100%,-50%);left:var(--ui-btn-corner-counter-inline-shift)}.ui-btn.--air.ui-btn-collapsed .ui-btn-right-counter{transform:translate(100%,-50%);right:var(--ui-btn-corner-counter-inline-shift)}.ui-btn-split.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-left-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-right-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:after,.ui-btn.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-text:before,.ui-btn.--air.--with-icon.ui-btn-collapsed,.ui-btn.--air.--with-left-icon.ui-btn-collapsed .ui-btn-text:before,.ui-btn.--air.--with-right-icon.ui-btn-collapsed .ui-btn-text:after{--ui-btn-icon-space:0px}.ui-btn-split.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:before,.ui-btn.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-text:before{display:inline-block}.ui-btn-split.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-left-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:before,.ui-btn-split.--air.--with-right-icon.ui-btn-collapsed .ui-btn-main .ui-btn-text:after,.ui-btn.--air.--with-collapsed-icon.ui-btn-collapsed .ui-btn-text:before,.ui-btn.--air.--with-left-icon.ui-btn-collapsed .ui-btn-text:before,.ui-btn.--air.--with-right-icon.ui-btn-collapsed .ui-btn-text:after{top:0}.ui-btn-left-counter-inner{display:inline-flex}.ui-btn .ui-icon-set,.ui-btn-split .ui-icon-set{--ui-icon-set__icon-size:var(--ui-btn-icon-size);--ui-icon-set__icon-color:var(--ui-btn-color);margin-right:var(--ui-btn-icon-space);transition:none}.ui-btn-ai-waiting .ui-icon-set,.ui-btn-clock .ui-icon-set,.ui-btn-wait .ui-icon-set{opacity:0}\n\n/* vendor/ui.forms.min.css */\n:root{--ui-field-size-lg:var(--ui-size-6xl);--ui-field-size-md:var(--ui-size-5xl);--ui-field-size-sm:var(--ui-size-3xl);--ui-field-size-xs:var(--ui-size-xl2);--ui-field-color-success:#9dcf00;--ui-field-color-danger:#ff5752;--ui-field-color-primary:#66afe9;--ui-field-color-focused:#2fc6f6;--ui-field-color-link:#0b66c3;--ui-field-color-warning:#ff5752;--ui-field-color-orange:#ffa900;--ui-field-color-disabled:hsla(0,0%,96%,.656);--ui-field-color-disabled-secondary:rgba(198,205,211,.372);--ui-field-color-light-gray:#fdfdfd;--ui-field-color-border-default:198,205,211;--ui-field-color-gray-37:rgba(198,205,211,.37);--ui-field-color-gray-17:rgba(82,92,105,.17);--ui-field-color-gray-06:rgba(82,92,105,.06);--ui-field-color-white-50:hsla(0,0%,100%,.5);--ui-field-color-white-44:hsla(0,0%,100%,.44);--ui-field-color-white-14:hsla(0,0%,100%,.14);--ui-field-size:var(--ui-field-size-md);--ui-field-border-radius:var(--ui-border-radius-3xs);--ui-field-spacing:12px}.ui-ctl{position:relative;display:flex;flex-direction:column;max-width:100%;width:320px;align-items:flex-start;justify-content:center;min-height:var(--ui-field-size)}.ui-ctl,.ui-ctl-element{box-sizing:border-box;vertical-align:middle}.ui-ctl-element{z-index:1;display:block;overflow:hidden;margin:0;padding:0 11px;width:100%;height:var(--ui-field-size);outline:none;border:1px solid rgb(var(--ui-field-color-border-default));border-radius:var(--ui-border-radius-2xs);background-color:var(--ui-color-palette-white-base);color:var(--ui-color-palette-black-base);text-align:left;text-overflow:ellipsis;white-space:nowrap;font:400 14px var(--ui-font-family-primary,var(--ui-font-family-helvetica));transition:border .3s ease,background-color .3s ease,color .3s ease,padding .3s ease;flex:1;appearance:none}.ui-ctl-element.--error,.ui-tag-selector-outer-container.--error{border-color:var(--ui-field-color-danger)}.ui-ctl-element::placeholder{color:var(--ui-color-palette-gray-40)}div.ui-ctl-element{line-height:calc(var(--ui-field-size) - 2px)}.ui-ctl-element:active,.ui-ctl-element:focus,.ui-ctl-element:hover{border-color:var(--ui-field-color-primary);color:#535c69}.ui-ctl-element:active,.ui-ctl-element:focus{outline:none}.ui-ctl+.ui-ctl{margin-left:var(--ui-field-spacing)}.bx-ios input.ui-ctl-element,.bx-ios input.ui-ctl-element:active,.bx-ios input.ui-ctl-element:hover{background-image:linear-gradient(transparent,transparent)}.ui-ctl-spacing-right .ui-ctl{margin-right:var(--ui-field-spacing);margin-left:0}.ui-ctl-spacing-right .ui-ctl:last-child{margin-right:0}.ui-ctl-spacing-left .ui-ctl{margin-left:var(--ui-field-spacing);margin-right:0}.ui-ctl-spacing-left .ui-ctl:first-child{margin-left:0}.ui-ctl-inline{display:inline-flex!important;width:auto}.ui-ctl-inline+.ui-ctl-inline{margin-left:10px}.ui-ctl-block{display:flex!important}.ui-ctl-custom{width:auto}.ui-ctl-no-border .ui-ctl-element{border-color:var(--ui-color-background-transparent)!important;background-color:var(--ui-color-background-transparent)!important}.ui-ctl-underline .ui-ctl-element{border-top-color:var(--ui-color-background-transparent)!important;border-right-color:var(--ui-color-background-transparent)!important;border-left-color:var(--ui-color-background-transparent)!important;border-radius:0!important;background-color:var(--ui-color-background-transparent)!important}.ui-ctl-no-padding .ui-ctl-element{padding-right:0!important;padding-left:0!important}.ui-entity-editor-content-block .feed-add-post{border:1px solid #bbc4cd;border-radius:var(--ui-field-border-radius);overflow:hidden}.ui-ctl-round .ui-ctl-element{padding-right:calc(var(--ui-field-size)/2);padding-left:calc(var(--ui-field-size)/2);border-radius:calc(var(--ui-field-size)/2)}.ui-ctl-md{--ui-field-size:var(--ui-field-size-md)}.ui-ctl-lg{--ui-field-size:var(--ui-field-size-lg)}.ui-ctl-sm{--ui-field-size:var(--ui-field-size-sm)}.ui-ctl-xs{--ui-field-size:var(--ui-field-size-xs)}.ui-ctl-w100{max-width:100%!important;width:100%!important}.ui-ctl+.ui-ctl.ui-ctl-w100{--ui-field-spacing:0}.ui-ctl-w75{max-width:75%!important;width:75%!important}.ui-ctl-w50{max-width:50%!important;width:50%!important}.ui-ctl-w33{max-width:33.33%!important;width:33.33%!important}.ui-ctl-w25{max-width:25%!important;width:25%!important}.ui-ctl-w10{max-width:10%!important;width:10%!important}.ui-ctl-wa{max-width:none;width:auto}.ui-ctl-wd{max-width:320px;width:320px}.ui-ctl-active .ui-ctl-element,.ui-ctl-element:focus,.ui-ctl-element:hover,.ui-ctl-hover .ui-ctl-element,.ui-ctl-hover .ui-ctl-element:focus,.ui-ctl-hover .ui-ctl-element:hover{border-color:var(--ui-field-color-primary)}.ui-ctl-focused .ui-ctl-element,.ui-ctl-focused .ui-ctl-element:focus,.ui-ctl-focused .ui-ctl-element:hover{border-color:var(--ui-field-color-focused)}.ui-ctl-success .ui-ctl-element,.ui-ctl-success .ui-ctl-element:focus,.ui-ctl-success .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-success{border-color:var(--ui-field-color-success)}.ui-ctl-warning .ui-ctl-element,.ui-ctl-warning .ui-ctl-element:focus,.ui-ctl-warning .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-warning{border-color:var(--ui-field-color-warning)}.ui-ctl-orange .ui-ctl-element,.ui-ctl-orange .ui-ctl-element:focus,.ui-ctl-orange .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-orange{border-color:var(--ui-field-color-orange)}.ui-ctl-link .ui-ctl-element,.ui-ctl-link .ui-ctl-element:focus,.ui-ctl-link .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-link{border-color:var(--ui-field-color-link);border-style:dashed}.ui-ctl-white-special-round .ui-ctl-element,.ui-ctl-white-special-round .ui-ctl-element:focus,.ui-ctl-white-special-round .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-white-special-round{border-color:var(--ui-color-palette-white-base);border-radius:var(--ui-border-radius-3xl)}.ui-ctl-default-light .ui-ctl-element,.ui-ctl-default-light .ui-ctl-element:focus,.ui-ctl-default-light .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-default-light{border-color:rgba(var(--ui-field-color-border-default),var(--ui-opacity-70));background-color:rgba(var(--ui-color-palette-white-base-rgb),var(--ui-opacity-70))}.ui-ctl-white .ui-ctl-element,.ui-ctl-white .ui-ctl-element:focus,.ui-ctl-white .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-white{border-color:var(--ui-color-palette-white-base);background-color:var(--ui-color-palette-white-base)}.ui-ctl-transp .ui-ctl-element,.ui-ctl-transp .ui-ctl-element:focus,.ui-ctl-transp .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-transp{border-color:rgb(var(--ui-field-color-border-default));background-color:rgba(var(--ui-color-palette-white-base-rgb),var(--ui-opacity-50))}.ui-ctl-transp-white .ui-ctl-element,.ui-ctl-transp-white .ui-ctl-element:focus,.ui-ctl-transp-white .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-transp-white{border-color:rgba(var(--ui-color-palette-white-base-rgb),.44);background-color:rgba(var(--ui-color-palette-white-base-rgb),.143824);color:rgba(var(--ui-color-palette-white-base-rgb),1)}.ui-ctl-transp-white .ui-ctl-element::placeholder{color:rgba(var(--ui-color-palette-white-base-rgb),var(--ui-opacity-50))}.ui-ctl-transp-gray .ui-ctl-element,.ui-ctl-transp-gray .ui-ctl-element:focus,.ui-ctl-transp-gray .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-transp-gray{border-color:rgba(var(--ui-color-palette-gray-90-rgb),.17223);background-color:rgba(var(--ui-color-palette-gray-90-rgb),.0560806)}.ui-ctl-transp-white-borderless .ui-ctl-element,.ui-ctl-transp-white-borderless .ui-ctl-element:focus,.ui-ctl-transp-white-borderless .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-transp-white-borderless{border:none;background-color:rgba(var(--ui-color-palette-white-base-rgb),.143824);color:rgba(var(--ui-color-palette-white-base-rgb),1)}.ui-ctl-transp-white-borderless .ui-ctl-element::placeholder{color:rgba(var(--ui-color-palette-white-base-rgb),var(--ui-opacity-50))}.ui-ctl-disabled .ui-ctl-element,.ui-ctl-disabled .ui-ctl-element:focus,.ui-ctl-disabled .ui-ctl-element:hover,.ui-ctl-element[disabled=disabled],.ui-ctl-element[disabled=disabled]:active,.ui-ctl-element[disabled=disabled]:hover,.ui-ctl-element[disabled],.ui-ctl-element[disabled]:active,.ui-ctl-element[disabled]:hover,.ui-ctl-inactive .ui-ctl-element,.ui-ctl-inactive .ui-ctl-element:focus,.ui-ctl-inactive .ui-ctl-element:hover,.ui-ctl.ui-ctl__combined-input.ui-ctl-disabled,.ui-ctl.ui-ctl__combined-input.ui-ctl-inactive{border-color:var(--ui-field-color-disabled-secondary);background-color:var(--ui-field-color-disabled);color:#a9adb2;resize:none!important;cursor:not-allowed}.ui-ctl-inactive .ui-ctl-element,.ui-ctl-inactive .ui-ctl-element:focus,.ui-ctl-inactive .ui-ctl-element:hover{border-color:var(--ui-color-overlay-base);background-color:rgba(var(--ui-field-color-border-default),var(--ui-opacity-50))}.ui-ctl-after,.ui-ctl-before,.ui-ctl-ext-after,.ui-ctl-ext-before,.ui-ctl-icon{position:absolute;top:1px;z-index:10;display:block;border:none;background-color:var(--ui-color-background-transparent);width:var(--ui-field-size);height:calc(var(--ui-field-size) - 2px)}.ui-ctl-before{left:1px}.ui-ctl-ext-before-icon.ui-ctl-before-icon .ui-ctl-ext-before{left:var(--ui-field-size)}.ui-ctl-after,.ui-ctl-ext-after{right:-2px}.ui-ctl-ext-after-icon.ui-ctl-after-icon .ui-ctl-after{right:var(--ui-field-size)}.ui-ctl-before-icon .ui-ctl-element,.ui-ctl-ext-before-icon{padding-left:var(--ui-field-size)!important}.ui-ctl-after-icon .ui-ctl-element,.ui-ctl-ext-after-icon{padding-right:var(--ui-field-size)!important}.bx-firefox .ui-ctl-after-icon .ui-ctl-element{padding-right:calc(var(--ui-field-size) - 5px)!important}.ui-ctl.ui-ctl__combined-input{flex-direction:row;align-items:center;padding:0 5px;border:1px solid rgb(var(--ui-field-color-border-default));border-radius:var(--ui-border-radius-3xs);transition:border .3s ease}.ui-ctl.ui-ctl__combined-input:hover{border-color:var(--ui-field-color-primary)}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon{position:static;padding:0;width:26px;background-repeat:no-repeat;background-position:50%}.ui-ctl.ui-ctl__combined-input .ui-ctl-element{order:0;padding:0 4px;height:calc(var(--ui-field-size) - 2px);border:none;border-radius:var(--ui-border-radius-none)}.ui-ctl.ui-ctl__combined-input .ui-ctl-before{order:-1}.ui-ctl.ui-ctl__combined-input .ui-ctl-after{order:1}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-after,.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-before{position:relative;display:flex;align-items:center;width:auto}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-before{padding-right:3px;margin-right:3px}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-after:before,.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-before:after{content:\"\";position:absolute;top:50%;right:0;width:1px;height:18px;background-color:var(--ui-color-palette-gray-20);transform:translateY(-50%);z-index:10}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-after:before{left:0;right:auto}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon__set.ui-ctl-after{padding-left:3px;margin-left:3px}.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl-before[class*=ui-ctl-icon-],.ui-ctl-ext-after[class*=ui-ctl-icon-],.ui-ctl-ext-before[class*=ui-ctl-icon-]{background-position:50%;background-size:16px auto;background-repeat:no-repeat;transition:opacity .25s linear;pointer-events:none}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon,.ui-ctl.ui-ctl__combined-input.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl.ui-ctl__combined-input.ui-ctl-before[class*=ui-ctl-icon-],.ui-ctl.ui-ctl__combined-input.ui-ctl-ext-after[class*=ui-ctl-icon-],.ui-ctl.ui-ctl__combined-input.ui-ctl-ext-before[class*=ui-ctl-icon-]{pointer-events:auto}@keyframes ui-ctl-show-icon{0%{opacity:0}to{opacity:.78}}.ui-ctl .ui-ctl-icon-clear.ui-ctl-after[class*=ui-ctl-icon-]:hover,.ui-ctl.ui-ctl__combined-input .ui-ctl-icon.ui-ctl-icon-clear:hover{opacity:1}.ui-ctl-icon-btn,a.ui-ctl-after,a.ui-ctl-before,a.ui-ctl-ext-after,a.ui-ctl-ext-before,button.ui-ctl-after,button.ui-ctl-before,button.ui-ctl-ext-after,button.ui-ctl-ext-before{outline:none!important;cursor:pointer;pointer-events:auto!important}button.ui-ctl-after:active,button.ui-ctl-before:active{background-color:#e0e5ea}.ui-ctl-icon-dots{background-image:url(/bitrix/js/ui/forms/images/dots.svg)}.ui-ctl-icon-calendar{background-image:url(/bitrix/js/ui/forms/images/calendar.svg)}.ui-ctl-icon-calendar-dot{background-image:url(/bitrix/js/ui/forms/images/calendar-dot.svg)}.ui-ctl-icon-clock{background-image:url(/bitrix/js/ui/forms/images/clock.svg)}.ui-ctl.ui-ctl__combined-input .ui-ctl-icon.ui-ctl-icon-clock{background-size:16px auto}.ui-ctl-icon-search{background-image:url(/bitrix/js/ui/forms/images/search.svg)}.ui-ctl-icon-phone{background-image:url(/bitrix/js/ui/forms/images/phone.svg)}.ui-ctl-icon-mail{background-image:url(/bitrix/js/ui/forms/images/mail.svg)}.ui-ctl-icon-chain{background-image:url(/bitrix/js/ui/forms/images/chain.svg)}.ui-ctl-icon-unchain{background-image:url(/bitrix/js/ui/forms/images/unchain.svg)}.ui-ctl-icon-change{background-image:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2215%22%20height%3D%2218%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M9.928%205.836H1.073V4.415h8.855V.895l4.24%204.241-4.24%204.24v-3.54zm-4.91%206.692h8.886v1.42H5.018v3.52l-4.24-4.24%204.24-4.24v3.54z%22%20fill%3D%22%23525C69%22%20fill-rule%3D%22evenodd%22/%3E%3C/svg%3E\")}.ui-ctl-icon-forward{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2213%22%20height%3D%2213%22%3E%3Cpath%20fill%3D%22%23525C69%22%20fill-rule%3D%22evenodd%22%20opacity%3D%221%22%20d%3D%22M4.89%201.551l3.962%203.961H.383v1.977h8.469L4.89%2011.45l1.398%201.398L12.636%206.5%206.288.153z%22/%3E%3C/svg%3E)}.ui-ctl-icon-arrow-down{background-image:url(/bitrix/js/ui/forms/images/arrow-down.svg);background-size:14px auto}.ui-ctl-icon-close-special{background-image:url(/bitrix/js/ui/forms/images/close-special.svg)}.ui-ctl-icon-location{background-image:url(/bitrix/js/ui/forms/images/location.svg)}.ui-ctl-icon-forward.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl-icon-forward.ui-ctl-before[class*=ui-ctl-icon-]{background-size:14px auto;opacity:.56}.ui-ctl-icon-angle{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='26' height='26'%3E%3Cg fill='%23828B95'%3E%3Cpath d='m7.071 10.858 1.414-1.414 5.657 5.656-1.414 1.414z'/%3E%3Cpath d='m16.97 9.444 1.415 1.414-5.657 5.657-1.414-1.415z'/%3E%3C/g%3E%3C/svg%3E\")}.ui-ctl-icon-angle.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl-icon-angle.ui-ctl-before[class*=ui-ctl-icon-]{background-size:26px auto}.ui-ctl-icon-crm-dynamic.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl-icon-crm-dynamic.ui-ctl-before[class*=ui-ctl-icon-]{background-size:18px auto}.ui-ctl-icon-crm-dynamic{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Ccircle cx='9' cy='9' r='9' fill='%2380868E' opacity='.7'/%3E%3Cpath fill='%23FFF' d='M10.989 7.778a.32.32 0 0 1 .378.171l.313.657a.02.02 0 0 0 .021.013c.34-.012.671.039.983.146l.49-.548a.32.32 0 0 1 .413-.057l.368.233a.32.32 0 0 1 .124.397l-.283.67a.02.02 0 0 0 .004.025q.22.234.382.518l.733-.084a.32.32 0 0 1 .346.23l.12.42a.32.32 0 0 1-.17.379l-.654.311a.02.02 0 0 0-.013.021 2.7 2.7 0 0 1-.091.799.02.02 0 0 0 .008.024l.58.461a.32.32 0 0 1 .082.408l-.212.381a.32.32 0 0 1-.388.147l-.7-.248a.02.02 0 0 0-.025.006q-.271.29-.624.496a.02.02 0 0 0-.011.022l.082.722a.32.32 0 0 1-.23.346l-.42.12a.32.32 0 0 1-.378-.17l-.32-.67a2.7 2.7 0 0 1-.955-.131.02.02 0 0 0-.024.006l-.488.545a.32.32 0 0 1-.412.057l-.368-.234a.32.32 0 0 1-.124-.396l.282-.667a.02.02 0 0 0-.005-.025 2.7 2.7 0 0 1-.393-.525.02.02 0 0 0-.022-.011l-.727.083a.32.32 0 0 1-.346-.23l-.12-.42a.32.32 0 0 1 .171-.38l.66-.314a.02.02 0 0 0 .013-.02q-.012-.41.092-.797a.02.02 0 0 0-.008-.024l-.559-.444a.32.32 0 0 1-.082-.408l.212-.381a.32.32 0 0 1 .389-.147l.671.238q.014.004.024-.006a2.8 2.8 0 0 1 .632-.504.02.02 0 0 0 .011-.022l-.082-.723a.32.32 0 0 1 .23-.345zm1.608-4.803c.522 0 .946.423.946.945v3.112a4.3 4.3 0 0 0-.945-.284V3.92H4.972v10.05h2.633q.293.516.696.946H4.973a.946.946 0 0 1-.945-.946V3.92c0-.522.423-.945.945-.945zm.638 8.313a1.45 1.45 0 0 0-2.142-1.187c-.446.237-.787.852-.752 1.356a1.45 1.45 0 0 0 2.142 1.187c.495-.263.791-.797.752-1.356M9.62 7.23c-.48.248-.913.574-1.283.96h-.054a.473.473 0 0 1-.473-.473v-.014c0-.262.212-.473.473-.473zm-2.756 0a.473.473 0 1 1 0 .945h-.28a.473.473 0 1 1 0-.945zm4.064-1.891c.26 0 .472.211.472.472v.015a.473.473 0 0 1-.472.473H8.283a.473.473 0 0 1-.473-.473v-.015c0-.26.212-.472.473-.472zm-4.064 0a.473.473 0 1 1 0 .945h-.28a.473.473 0 1 1 0-.945z'/%3E%3C/g%3E%3C/svg%3E\")}.ui-ctl-icon-search.ui-ctl-before[class*=ui-ctl-icon-]{opacity:var(--ui-opacity-50)}.ui-ctl-icon-crm-contact{background-size:16px auto;background-image:url(/bitrix/js/ui/forms/images/crm-contact.svg)}.ui-ctl-icon-crm-lead{background-image:url(/bitrix/js/ui/forms/images/crm-lead.svg)}.ui-ctl-icon-crm-deal{background-image:url(/bitrix/js/ui/forms/images/crm-deal.svg)}.ui-ctl-icon-crm-company{background:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Ccircle%20cx%3D%229%22%20cy%3D%229%22%20r%3D%229%22%20fill%3D%22%2380868E%22%20opacity%3D%22.7%22/%3E%3Cg%20fill%3D%22%23FFF%22%20fill-rule%3D%22nonzero%22%3E%3Cpath%20d%3D%22M11.575%207.291V4.04a.5.5%200%200%200-.5-.5H5.189a.5.5%200%200%200-.5.5v9.656a.5.5%200%200%200%20.504.5l8.107-.068a.5.5%200%200%200%20.496-.5V7.791a.5.5%200%200%200-.5-.5h-1.721zm-1.262%205.493h-.938v-1.741h-2.67v1.741h-.937V4.813h4.612l-.067%207.971zm2.411-.335h-1.34v-1.34h1.34v1.34zm0-2.612h-1.34v-1.34h1.34v1.34z%22/%3E%3Cpath%20d%3D%22M6.906%205.818h2.437v1.339H6.906zM6.906%208.43h2.457v1.34H6.906z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E) no-repeat}.ui-ctl-icon-loader{background-image:url(/bitrix/js/ui/forms/images/loader.svg)}.ui-ctl-icon-clear{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12'%3E%3Cpath fill='%23525C69' fill-rule='evenodd' d='M11.279 1.78 7.343 5.716l3.936 3.936L9.65 11.28 5.716 7.342 1.781 11.28.153 9.65 4.09 5.715.153 1.781 1.781.153l3.935 3.935L9.651.153z'/%3E%3C/svg%3E\")}.ui-ctl-icon-clear.ui-ctl-after[class*=ui-ctl-icon-],.ui-ctl-icon-clear.ui-ctl-before[class*=ui-ctl-icon-],.ui-ctl.ui-ctl__combined-input .ui-ctl-icon.ui-ctl-icon-clear{background-size:10px auto;opacity:var(--ui-opacity-50);cursor:pointer}.ui-ctl-icon-border:after{content:\"\";position:absolute;top:50%;transform:translateY(-50%);right:8px;width:1px;height:18px;background:#edeef2}.ui-ctl-row{flex-direction:row;align-items:center}.ui-ctl-row+.ui-ctl-row{margin-top:12px}.ui-ctl-column{flex-direction:column;align-content:flex-start}.ui-ctl-label-text{padding:0 0 7px;font:var(--ui-font-size-sm)/17px var(--ui-font-family-primary,var(--ui-font-family-helvetica));font-size:var(--ui-font-size-md);color:var(--ui-color-base-90)}.ui-ctl-label-text-error{color:var(--ui-color-text-alert)}.ui-ctl-row .ui-ctl-label-text{padding:0 10px}.ui-ctl-multiple-select{height:auto}.ui-ctl-multiple-select .ui-ctl-element{overflow-y:auto;padding:0}.ui-ctl-multiple-select .ui-ctl-element option{padding:0 11px;height:18.5px;transition:all .25s linear}.ui-ctl-multiple-select{min-height:calc(var(--ui-field-size)*3);height:calc(var(--ui-field-size)*3)}.ui-ctl-multiple-select select.ui-ctl-element{min-height:calc(var(--ui-field-size)*3 - 2px);height:calc(var(--ui-field-size)*3 - 2px)}.ui-ctl-finer{height:auto}.ui-ctl-finer div.ui-ctl-element{display:flex;padding-right:30px;padding-left:0;height:auto;flex-wrap:wrap}.ui-ctl-option-selected{position:relative;z-index:2;display:inline-block;margin:3px 0 3px 3px;padding:0 30px 0 9px;height:calc(var(--ui-field-size) - 8px);border-radius:var(--ui-border-radius-3xs);background:var(--ui-color-tag-1);vertical-align:middle;font:var(--ui-font-size-lg)/calc(var(--ui-field-size) - 8px) var(--ui-font-family-primary,var(--ui-font-family-helvetica));transition:background .2s}.ui-ctl-textarea{display:block;max-width:100%;max-height:100%;width:491px;height:auto}.ui-ctl-textarea.ui-ctl-sm{width:292px}.ui-ctl-textarea textarea.ui-ctl-element,.ui-ctl>div.ui-ctl-element[contenteditable]{display:block;overflow:auto;padding-top:6px;padding-bottom:6px;min-width:0;max-width:100%;max-height:100%;width:100%;height:auto;white-space:normal;line-height:normal;flex:auto}.ui-ctl-no-resize textarea.ui-ctl-element{resize:none}.ui-ctl-resize-y textarea.ui-ctl-element{resize:vertical}.ui-ctl-resize-x textarea.ui-ctl-element{resize:horizontal}.ui-ctl-textarea{min-height:calc(var(--ui-field-size)*3);height:calc(var(--ui-field-size)*3)}.ui-ctl-textarea textarea.ui-ctl-element{height:calc(var(--ui-field-size)*3.5 - 2px);white-space:pre-wrap}.ui-ctl-textarea.ui-ctl-sm textarea.ui-ctl-element{min-height:calc(var(--ui-field-size)*3 - 2px);height:calc(var(--ui-field-size)*3 - 2px)}.ui-ctl-date,.ui-ctl-datetime,.ui-ctl-time{--icon-width-after:11px;--icon-width-before:11px}.ui-ctl-date.ui-ctl-after-icon,.ui-ctl-datetime.ui-ctl-after-icon,.ui-ctl-time.ui-ctl-after-icon{--icon-width-after:var(--ui-field-size)}.ui-ctl-date.ui-ctl-before-icon,.ui-ctl-datetime.ui-ctl-before-icon,.ui-ctl-time.ui-ctl-before-icon{--icon-width-before:var(--ui-field-size)}.ui-ctl-datetime{max-width:calc(125px + var(--icon-width-before) + var(--icon-width-after));width:calc(125px + var(--icon-width-before) + var(--icon-width-after))}.ui-ctl-date{max-width:calc(80px + var(--icon-width-before) + var(--icon-width-after));width:calc(80px + var(--icon-width-before) + var(--icon-width-after))}.ui-ctl-date div.ui-ctl-element{padding-top:10px;line-height:normal}.ui-ctl-time{max-width:calc(45px + var(--icon-width-before) + var(--icon-width-after));width:calc(45px + var(--icon-width-before) + var(--icon-width-after))}.ui-ctl-time div.ui-ctl-element{padding-top:10px}.ui-ctl-file-link{display:inline-flex;width:auto;height:auto}.ui-ctl-file-link .ui-ctl-element{display:none}.ui-ctl-file-link .ui-ctl-label-text{display:inline;margin:0;padding:0;outline:none;border:none;border-bottom:1px dashed;color:#7a818a;vertical-align:middle;text-decoration:none;text-shadow:none;white-space:nowrap;font:var(--ui-font-size-sm) var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-weight:var(--ui-font-weight-regular);cursor:pointer;transition:color .2s,border-color .2s;-webkit-font-smoothing:antialiased}.ui-ctl-file-link .ui-ctl-label-text:hover{border-bottom-color:var(--ui-color-background-transparent);color:#535c69}.ui-ctl-file-btn{display:inline-flex;width:auto;height:var(--ui-field-size-md)}.ui-ctl-file-btn .ui-ctl-element{display:none}.ui-ctl-file-btn .ui-ctl-label-text{display:inline-block;margin:0;padding:0 18px;outline:none;border:none;border-radius:var(--ui-field-border-radius);background:#ecedef;box-shadow:0 0 0 1px rgb(var(--ui-field-color-border-default)) inset;color:#7a818a;vertical-align:middle;text-decoration:none;text-transform:uppercase;text-shadow:none;white-space:nowrap;font:var(--ui-font-size-xs) var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-weight:var(--ui-font-weight-bold);line-height:calc(var(--ui-field-size) - 2px);cursor:pointer;transition:background-color .2s,color .2s;-webkit-font-smoothing:antialiased}.ui-ctl-file-btn .ui-ctl-label-text:hover{background:#cfd4d8;color:#535c69}.ui-ctl-file-btn .ui-ctl-label-text:active{background:#868d95;box-shadow:none!important;color:var(--ui-color-on-primary)}.ui-ctl-file-drop{display:inline-flex;width:640px;height:300px;border:2px dashed rgb(var(--ui-field-color-border-default));border-radius:2px;background:#ecedef;cursor:pointer;transition:background-color .2s;align-items:center;justify-content:center}.ui-ctl-file-drop .ui-ctl-element{display:none}.ui-ctl-file-drop .ui-ctl-label-text{margin:0;padding:0;outline:none;border:none;vertical-align:middle}.ui-ctl-file-drop .ui-ctl-label-text small,.ui-ctl-file-drop .ui-ctl-label-text span{display:block;color:#7a818a;text-align:center;text-decoration:none;text-transform:var(--ui-text-transform-uppercase);text-shadow:none;white-space:nowrap;font:var(--ui-font-size-xs) var(--ui-font-family-secondary,var(--ui-font-family-open-sans));font-weight:var(--ui-font-weight-bold);transition:color .2s linear;-webkit-font-smoothing:antialiased}.ui-ctl-file-drop .ui-ctl-label-text small{padding-top:10px;text-transform:var(--ui-text-transform-none);font-size:var(--ui-font-size-xs)}.ui-ctl-file-drop:hover{background:#cfd4d8;color:#535c69}.ui-ctl-file-drop:active{background:#868d95;box-shadow:none!important;color:var(--ui-color-primary-alt)}.ui-ctl-checkbox{flex-direction:row;margin-bottom:7px;align-items:center;justify-content:flex-start}.ui-ctl-checkbox .ui-ctl-element{display:inline;margin:0 8px 0 0;padding:0;width:auto;height:auto;appearance:checkbox;flex:none;transition:none}.ui-ctl-checkbox .ui-ctl-label-text{padding-bottom:0}.ui-ctl-checkbox-selector{padding:0;width:auto;flex-direction:row;margin-bottom:7px;display:inline-flex;align-items:stretch;justify-content:flex-start;cursor:pointer;min-height:var(--ui-field-size);min-width:var(--ui-field-size)}.ui-ctl-checkbox-selector .ui-ctl-inner{background-color:var(--ui-color-background-primary);padding:7px;width:100%;height:var(--ui-field-size);min-width:var(--ui-field-size);border:1px solid var(--ui-field-color-disabled);border-radius:var(--ui-border-radius-3xs);display:flex;align-items:center;transition:.17s;justify-content:flex-start;position:relative;box-sizing:border-box}.ui-ctl-checkbox-selector .ui-ctl-element:checked+.ui-ctl-inner,.ui-ctl-checkbox-selector .ui-ctl-inner:hover,.ui-ctl-checkbox-selector.selected .ui-ctl-element+.ui-ctl-inner{border-color:var(--ui-field-color-focused)}.ui-ctl-checkbox-selector .ui-ctl-inner:before{content:\"\";display:block;border:1px solid var(--ui-color-primary-alt);border-bottom:none;border-left:none;position:absolute;right:-1px;top:-1px;width:0;height:0;transition:all .18s linear}.ui-ctl-checkbox-selector .ui-ctl-element:checked+.ui-ctl-inner:before,.ui-ctl-checkbox-selector.selected .ui-ctl-element+.ui-ctl-inner:before{width:6px;height:6px}.ui-ctl-checkbox-selector .ui-ctl-inner:after{content:\"\";display:block;border:1px solid var(--ui-field-color-focused);border-top:none;border-right:none;position:absolute;right:-2px;top:-1px;width:0;height:0;transition:.18s;transform:rotate(-45deg);opacity:0;box-sizing:border-box}.ui-ctl-checkbox-selector .ui-ctl-element:checked+.ui-ctl-inner:after,.ui-ctl-checkbox-selector.selected .ui-ctl-element+.ui-ctl-inner:after{width:5px;height:3px;opacity:1}.ui-ctl-checkbox-selector .ui-ctl-element{display:none}.ui-ctl-checkbox-selector .ui-ctl-label-img{display:block;background-position:50%;background-size:cover;width:22px;height:22px;min-width:22px;min-height:22px;box-sizing:border-box}.ui-ctl-checkbox-selector .ui-ctl-label-text{text-overflow:ellipsis;overflow:hidden;color:var(--ui-color-base-default);padding:0 7px}.ui-ctl-checkbox-selector .ui-ctl-label-img+.ui-ctl-label-text{padding-left:7px}.ui-ctl-radio{flex-direction:row;margin-bottom:7px;align-items:center;justify-content:flex-start}.ui-ctl-radio .ui-ctl-element{display:inline;margin:0 5px 2px 0;padding:0;width:auto;height:auto;appearance:radio;flex:none;transition:none}.ui-ctl-radio .ui-ctl-label-text{padding-bottom:0}.ui-ctl-radio-selector{padding:0;width:auto;flex-direction:row;margin-bottom:7px;display:inline-flex;align-items:stretch;justify-content:flex-start;cursor:pointer;min-height:var(--ui-field-size-sm);min-width:var(--ui-field-size-sm)}.ui-ctl-radio-selector .ui-ctl-inner{background-color:#fff;padding:7px 6px;width:100%;border:1px solid var(--ui-field-color-disabled);border-radius:var(--ui-border-radius-3xs);height:var(--ui-field-size-sm);min-width:var(--ui-field-size-sm);display:flex;align-items:center;transition:.17s;justify-content:center;position:relative;box-sizing:border-box}.ui-ctl-radio-selector .ui-ctl-element:checked+.ui-ctl-inner,.ui-ctl-radio-selector .ui-ctl-inner:hover,.ui-ctl-radio-selector.selected .ui-ctl-element+.ui-ctl-inner{border-color:var(--ui-field-color-focused)}.ui-ctl-radio-selector .ui-ctl-inner:before{content:\"\";display:block;border-radius:var(--ui-border-radius-circle);background-color:var(--ui-field-color-focused);border-bottom:none;border-left:none;position:absolute;right:0;top:0;width:0;height:0;transition:.18s}.ui-ctl-radio-selector .ui-ctl-element:checked+.ui-ctl-inner:before,.ui-ctl-radio-selector.selected .ui-ctl-element+.ui-ctl-inner:before{width:11px;height:11px;right:-3px;top:-3px}.ui-ctl-radio-selector .ui-ctl-inner:after{content:\"\";display:block;border:1.5px solid var(--ui-color-on-primary);border-top:none;border-right:none;position:absolute;right:0;top:0;width:0;height:0;transition:.18s;transform:rotate(-45deg);opacity:0;box-sizing:border-box}.ui-ctl-radio-selector .ui-ctl-element:checked+.ui-ctl-inner:after,.ui-ctl-radio-selector.selected .ui-ctl-element+.ui-ctl-inner:after{width:5px;height:3px;opacity:1}.ui-ctl-radio-selector .ui-ctl-element{display:none}.ui-ctl-radio-selector .ui-ctl-label-img{display:block;background-position:50%;background-size:cover;width:21px;height:20px;min-width:20px;min-height:20px;box-sizing:border-box}.ui-ctl-radio-selector .ui-ctl-label-text{text-overflow:ellipsis;overflow:hidden;color:var(--ui-color-base-90);padding:0 2px 1px;font-size:13px;white-space:nowrap;max-width:300px}.ui-ctl-radio-selector .ui-ctl-label-img+.ui-ctl-label-text{padding-left:7px}.ui-ctl-tag{position:absolute;right:12px;top:-6px;background-color:var(--ui-color-palette-blue-50);color:var(--ui-color-on-primary-alt);font:var(--ui-font-weight-bold) 7px/13px var(--ui-font-family-primary,var(--ui-font-family-helvetica));vertical-align:middle;text-align:center;padding:0 6px;height:13px;border-radius:6.5px;z-index:10;pointer-events:none;text-transform:var(--ui-text-transform-uppercase)}.ui-ctl-tag.--tag_light-blue{background-color:var(--ui-color-palette-blue-30);color:var(--ui-color-palette-gray-90)}.ui-ctl-tag.--tag_light{background-color:#fdfdfd;color:var(--ui-color-palette-gray-50)}.ui-ctl-ext-before-icon .ui-ctl-tag{right:50px}.ui-ctl-popup{position:absolute;top:-36px;right:0;background:#ff5752;padding:0 20px;border-radius:var(--ui-border-radius-2xs);color:var(--ui-color-primary-alt);z-index:2;font:var(--ui-font-size-sm)/31px var(--ui-font-family-primary,var(--ui-font-family-helvetica));transition:.2s;box-sizing:border-box;max-width:100%}.ui-ctl-popup-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:100%;display:block}.ui-ctl-popup:after{content:\"\";position:absolute;bottom:-16px;left:50%;transform:translateX(-50%);border:8px solid var(--ui-color-background-transparent);border-top-color:var(--ui-color-text-alert)}.ui-ctl-popup-show{opacity:1;transform:translateY(0)}.ui-ctl-popup-hide{opacity:0;transform:translateY(-30%)}.ui-ctl-container{position:relative;display:inline-flex;flex-direction:column}.ui-ctl-top{display:flex;justify-content:space-between;margin-bottom:6px}.ui-ctl-bottom,.ui-ctl-title{font:var(--ui-font-size-sm) var(--ui-font-family-primary,var(--ui-font-family-helvetica));color:var(--ui-color-palette-gray-50)}.ui-ctl-control{margin-right:12px}.ui-ctl-control:last-child{margin-right:0}.ui-ctl-control.--ui-ctl__link{color:var(--ui-color-link-primary-base);border-bottom:1px dashed rgba(var(--ui-color-link-primary-base-rgb),var(--ui-opacity-40))}.ui-ctl-control.--ui-ctl__link-gray{border-bottom:1px dashed rgba(var(--ui-color-palette-gray-70-rgb),var(--ui-opacity-40));color:var(--ui-color-palette-gray-70)}.ui-ctl-bottom{margin-top:6px;font-style:italic}.ui-ctl-success .ui-ctl-bottom{font-style:normal;color:var(--ui-field-color-success)}.ui-ctl-warning .ui-ctl-bottom{font-style:normal;color:var(--ui-field-color-warning)}.ui-ctl__entity{text-align:center}.ui-ctl__combined-input .ui-ctl__entity:first-child{margin:0 19px 0 7px}.ui-ctl__entity_value{position:relative;margin-right:4px;cursor:pointer}.ui-ctl__control{display:flex;flex-direction:column;align-items:center;justify-content:center;margin-left:auto;width:26px;text-align:center}.ui-ctl__control_item{display:inline-flex;border:none;cursor:pointer}.ui-ctl__control.--arrow .ui-ctl__control_item{width:26px;height:15px;border:none;background:var(--ui-color-background-transparent) url(/bitrix/js/ui/forms/images/arrow-down.svg) center no-repeat;transition:opacity .3s;transform:rotate(180deg)}.ui-ctl__control.--arrow .ui-ctl__control_item+.ui-ctl__control_item{transform:rotate(0deg)}.ui-ctl__control.--arrow .ui-ctl__control_item:hover{opacity:var(--ui-opacity-40)}.ui-ctl-sm .ui-ctl__control.--arrow{height:22px}.ui-ctl__entity_value.--ui-ctl__link-gray{border-bottom:1px dashed rgba(var(--ui-color-palette-gray-50-rgb),var(--ui-opacity-40));color:var(--ui-color-palette-gray-50);cursor:pointer}.ui-ctl__entity_value.--arrow:after{content:\"\";position:absolute;display:block;top:2px;right:-14px;width:12px;height:15px;background:var(--ui-color-background-transparent) url(/bitrix/js/ui/forms/images/arrow-down.svg) center no-repeat;opacity:.5}.ui-ctl__alert{display:none;position:absolute;top:-17px;right:0;padding:6px 16px;border-radius:var(--ui-border-radius-3xs);color:var(--ui-color-palette-white-base)}.ui-ctl__alert:before{content:\"\";position:absolute;left:50%;bottom:-11px;width:0;height:0;border-style:solid;border-width:11px 11.5px 0;transform:translateX(-50%)}.ui-ctl-warning .ui-ctl__alert{display:block;background-color:var(--ui-color-palette-red-50)}.ui-ctl-warning .ui-ctl__alert:before{border-color:var(--ui-color-palette-red-50) var(--ui-color-background-transparent) var(--ui-color-background-transparent) var(--ui-color-background-transparent)}\n\n/* vendor/ui.counter.min.css */\n:root{--ui-counter-current-size:16px;--ui-counter-size-md:16px;--ui-counter-size-lg:19px;--ui-counter-current-bg-color:#f54819;--ui-counter-bg-color-gray:#a8adb4;--ui-counter-bg-color-success:#9dcf00;--ui-counter-bg-color-primary:#2fc6f6;--ui-counter-bg-color-danger:#f54819;--ui-counter-bg-color-light:#fff;--ui-counter-bg-color-dark:rgba(255,255,255,.19)}.ui-counter{display:inline-flex;align-items:center;padding:0;border-radius:calc(var(--ui-counter-current-size) / 2);background-color:var(--ui-counter-current-bg-color);overflow:hidden;position:relative;height:var(--ui-counter-current-size)}.ui-counter-inner{text-align:center;position:relative;color:#fff;vertical-align:middle;min-width:21px;box-sizing:border-box;padding:0 7px;font:bold 11px/var(--ui-counter-current-size) \"Open Sans\",\"Helvetica Neue\",Helvetica,Arial,sans-serif}.ui-counter-gray{--ui-counter-current-bg-color:var(--ui-counter-bg-color-gray)}.ui-counter-primary{--ui-counter-current-bg-color:var(--ui-counter-bg-color-primary)}.ui-counter-danger{--ui-counter-current-bg-color:var(--ui-counter-bg-color-danger)}.ui-counter-success{--ui-counter-current-bg-color:var(--ui-counter-bg-color-success)}.ui-counter-light{box-shadow:inset 0 0 0 1px rgba(168,173,180,.5);--ui-counter-current-bg-color:var(--ui-counter-bg-color-light)}.ui-counter-light .ui-counter-inner{color:#535c69 !important}.ui-counter-dark{--ui-counter-current-bg-color:var(--ui-counter-bg-color-dark);box-shadow:inset 0 0 0 1px rgba(255,255,255,.21)}.ui-counter-md{--ui-counter-current-size:var(--ui-counter-size-md)}.ui-counter-lg{--ui-counter-current-size:var(--ui-counter-size-lg)}.ui-counter-plus,.ui-counter-minus{animation-duration:500ms;animation-iteration-count:1}.ui-counter-plus{animation-name:uiCounterPlus}.ui-counter-minus{animation-name:uiCounterMinus}@keyframes uiCounterPlus{0,100%{top:0;opacity:1}45%{top:var(--ui-counter-current-size);opacity:1}50%{opacity:0}55%{top:calc(var(--ui-counter-current-size) * -1);opacity:1}}@keyframes uiCounterMinus{0,100%{top:0;opacity:1}45%{top:calc(var(--ui-counter-current-size) * -1);opacity:1}50%{opacity:0}55%{top:var(--ui-counter-current-size);opacity:1}}\n\n/* vendor/ui.label.bundle.min.css */\n:root{--ui-label-height:var(--ui-size-lg);--ui-label-background-color:#c2c5ca;--ui-label-background-color-hover:var(--ui-label-background-color);--ui-label-color:var(--ui-color-palette-white-base-rgb);--ui-label-link-dashed-color:hsla(0,0%,100%,.51);--ui-label-font-weight:var(--ui-font-weight-bold);--ui-label-font:var(--ui-font-family-secondary,var(--ui-font-family-open-sans))}.ui-label{display:inline-flex;align-items:center;background-color:transparent;padding:0 8px;margin-right:10px;height:var(--ui-label-height);border-radius:calc(var(--ui-label-height)/2);border:1px solid var(--ui-label-background-color);box-sizing:border-box}.ui-label,.ui-label-inner{max-width:100%;transition:all .25s linear}.ui-label-inner{font:var(--ui-font-size-5xs)/var(--ui-font-size-5xs) var(--ui-label-font);font-weight:var(--ui-label-font-weight);color:rgba(var(--ui-label-color),1);white-space:nowrap;text-overflow:ellipsis}.ui-label span.ui-label-inner{overflow:hidden!important;margin:unset!important;font-family:var(--ui-label-font)!important;line-height:normal!important}.ui-label-link:hover,a.ui-label:hover{background-color:var(--ui-label-background-color-hover);cursor:pointer}.ui-label-link .ui-label-inner,a.ui-label .ui-label-inner{border-bottom:1px dashed transparent}.ui-label-link:hover .ui-label-inner,a.ui-label:hover .ui-label-inner{border-bottom:1px dashed var(--ui-label-link-dashed-color)}.ui-label.ui-label-fill{background-color:var(--ui-label-background-color);border-color:transparent!important}.ui-label:not(.ui-label-fill){--ui-label-link-dashed-color:rgba(51,51,51,.4);--ui-label-color:var(--ui-color-base-90-rgb)}.ui-label-link:not(.ui-label-fill):hover,a.ui-label:not(.ui-label-fill):hover{--ui-label-background-color-hover:#f5f5f5;border-color:var(--ui-label-background-color)}.ui-label-default{--ui-label-background-color-hover:var(--ui-color-base-20);--ui-label-background-color:var(--ui-color-base-15);--ui-label-color:var(--ui-color-base-80-rgb)}.ui-label-danger{--ui-label-background-color:var(--ui-color-palette-red-25);--ui-label-background-color-hover:var(--ui-color-palette-red-40);--ui-label-color:var(--ui-color-palette-red-80-rgb)}.ui-label-success{--ui-label-background-color:var(--ui-color-palette-green-30);--ui-label-background-color-hover:var(--ui-color-palette-green-40);--ui-label-color:var(--ui-color-palette-green-80-rgb)}.ui-label-warning{--ui-label-background-color:var(--ui-color-palette-orange-50);--ui-label-background-color-hover:var(--ui-color-palette-orange-60)}.ui-label-primary{--ui-label-background-color-hover:var(--ui-color-palette-blue-40);--ui-label-background-color:var(--ui-color-palette-blue-25);--ui-label-color:var(--ui-color-palette-blue-70-rgb)}.ui-label-secondary{--ui-label-background-color:var(--ui-color-accent-aqua);--ui-label-background-color-hover:var(--ui-color-accent-aqua)}.ui-label-lightgreen{--ui-label-background-color:var(--ui-color-palette-green-30);--ui-label-background-color-hover:var(--ui-color-palette-green-40);--ui-label-color:var(--ui-color-palette-green-80-rgb)}.ui-label-lightblue{--ui-label-background-color-hover:var(--ui-color-palette-blue-40);--ui-label-background-color:var(--ui-color-palette-blue-25);--ui-label-color:var(--ui-color-palette-blue-70-rgb)}.ui-label-orange{--ui-label-background-color:var(--ui-color-palette-orange-25);--ui-label-background-color-hover:var(--ui-color-palette-orange-40);--ui-label-color:var(--ui-color-palette-orange-80-rgb)}.ui-label-lightorange{--ui-label-background-color:rgba(255,169,0,.37);--ui-label-background-color-hover:rgba(255,169,0,.37);--ui-label-color:var(--ui-color-palette-orange-80-rgb)}.ui-label-lightred{--ui-label-background-color:rgba(255,87,82,.17);--ui-label-background-color-hover:rgba(255,87,82,.17);--ui-label-color:var(--ui-color-palette-red-80-rgb)}.ui-label-yellow{--ui-label-background-color:var(--ui-color-accent-yellow);--ui-label-color:var(--ui-color-palette-orange-80-rgb)}.ui-label-lightyellow{--ui-label-background-color:rgba(242,228,28,.42);--ui-label-background-color-hover:rgba(242,228,28,.42);--ui-label-color:var(--ui-color-palette-orange-90-rgb)}.ui-label-lavender{--ui-label-background-color:#e7d8fa;--ui-label-background-color-hover:#e7d8fa;--ui-label-color:142,82,236}.ui-label-copilot-light{--ui-label-background-color:var(--ui-color-copilot-secondary,#b095dc);--ui-label-background-color-hover:var(--ui-color-copilot-secondary,#b095dc);--ui-label-color:var(--ui-color-on-primary-rgb)}.ui-label-copilot-light-reverse{--ui-label-background-color:var(--ui-color-background-primary);--ui-label-background-color-hover:var(--ui-color-background-primary)}.ui-label-copilot-light-reverse,.ui-label-copilot-light-reverse:not(.ui-label-fill){--ui-label-color:var(--ui-color-copilot-primary-rgb)}.ui-label-light{--ui-label-background-color:var(--ui-color-base-15,#e6e7e9);--ui-label-background-color-hover:hsla(215,7%,68%,.91);--ui-label-color:var(--ui-color-base-80-rgb);--ui-label-link-dashed-color:var(--ui-color-base-80,#6a737f)}.ui-label-tag-light{--ui-label-background-color:#eaebed;--ui-label-background-color-hover:#dcdee1;--ui-label-color:var(--ui-color-palette-gray-90-rgb);--ui-label-font-weight:var(--ui-label-font-weight,400)}.ui-label-tag-secondary{--ui-label-background-color:#bcedfc;--ui-label-background-color-hover:#bcedfc;--ui-label-color:var(--ui-color-palette-black-base-rgb);--ui-label-font-weight:var(--ui-label-font-weight,400)}.ui-label-lg{--ui-label-height:25px}.ui-label-md{--ui-label-height:var(--ui-size-lg)}.ui-label-sm{--ui-label-height:18px}.ui-label-xs{--ui-label-height:14px}.ui-label-xs .ui-label-inner{font-size:var(--ui-font-size-6xs);line-height:var(--ui-font-line-height-sm);font-weight:var(--ui-font-weight-bold)}.ui-label-status{display:inline-flex;justify-content:center;align-items:center;position:relative;width:12px;height:12px;margin:0 5px 0 -2px}.ui-label-status .main-ui-loader{margin-top:-1px}.bx-win .ui-label-status .main-ui-loader{margin-top:-3px}.ui-label-status.--icon{border-radius:100%;background:rgba(var(--ui-label-color),.1)}.ui-label-status:empty{display:none}.ui-label-status .main-ui-loader-svg-circle{stroke-width:4;stroke:rgba(var(--ui-label-color),1)}.ui-label-status .ui-icon-set{--ui-icon-set__icon-color:rgba(var(--ui-label-color),1)}.ui-label-icon{display:block;width:21px;height:100%;margin-right:-6px;opacity:.7;cursor:pointer;transition:.1s;background:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%2210%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7.787%201L5%203.787%202.213%201%201%202.213%203.787%205%201%207.787%202.213%209%205%206.213%207.787%209%209%207.787%206.213%205%209%202.213%22%20fill%3D%22%23757c87%22/%3E%3C/svg%3E\") 50% no-repeat}.ui-label-fill .ui-label-icon{background-image:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%2210%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7.787%201L5%203.787%202.213%201%201%202.213%203.787%205%201%207.787%202.213%209%205%206.213%207.787%209%209%207.787%206.213%205%209%202.213%22%20fill%3D%22%23fff%22/%3E%3C/svg%3E\")}.ui-label-fill.ui-label-light .ui-label-icon,.ui-label-fill.ui-label-lightblue .ui-label-icon,.ui-label-fill.ui-label-lightgreen .ui-label-icon{background-image:url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%2210%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M7.787%201L5%203.787%202.213%201%201%202.213%203.787%205%201%207.787%202.213%209%205%206.213%207.787%209%209%207.787%206.213%205%209%202.213%22%20fill%3D%22%23757c87%22/%3E%3C/svg%3E\")}.ui-label-icon:hover{transition:none;opacity:1}\n\n/* vendor/ui.alerts.min.css */\n.ui-alert{position:relative;display:flex;box-sizing:border-box;margin-bottom:10px;padding:16px 34px 16px 18px;width:100%;border-radius:2px;background-color:#e7e8ea;color:#464a4e;vertical-align:middle;font:14px/17px \"Helvetica Neue\",Helvetica,Arial,sans-serif;opacity:1;transition:250ms linear all}.ui-alert-inline{display:inline-flex;width:auto}.ui-alert-text-center{justify-content:center}.ui-alert-md{padding:16px 34px 16px 18px;font-size:14px;line-height:17px}.ui-alert-xs{padding:8px 34px 8px 18px;font-size:13px;line-height:18px}.ui-alert-close-btn{position:absolute;top:15px;right:10px;display:inline-block;width:20px;height:20px;opacity:.4;cursor:pointer;transition:180ms opacity linear}.ui-alert-xs .ui-alert-close-btn{top:7px}.ui-alert-close-btn:hover{opacity:.7}.ui-alert-close-btn:active{opacity:1}.ui-alert-close-btn:after,.ui-alert-close-btn:before{position:absolute;top:50%;left:50%;display:block;background:#333;content:'';transform:translate(-50%,-50%) rotate(45deg)}.ui-alert-close-btn:after{width:2px;height:8px}.ui-alert-close-btn:before{width:8px;height:2px}.ui-alert-default{background-color:#e7e8ea;color:#464a4e}.ui-alert-default .ui-alert-close-btn:after,.ui-alert-default .ui-alert-close-btn:before{background-color:#333}.ui-alert-success{background-color:#eaf7d7;color:#719100}.ui-alert-success .ui-alert-close-btn:after,.ui-alert-success .ui-alert-close-btn:before{background-color:#719100}.ui-alert-danger{background-color:#fae5e8;color:#d0021b}.ui-alert-danger .ui-alert-close-btn:after,.ui-alert-danger .ui-alert-close-btn:before{background-color:#d0021b}.ui-alert-warning{background-color:#f8f4bc;color:#91711e}.ui-alert-warning .ui-alert-close-btn:after,.ui-alert-warning .ui-alert-close-btn:before{background-color:#af9245}.ui-alert-primary{background-color:#e1f3f9;color:#1e8ec2}.ui-alert-primary .ui-alert-close-btn:after,.ui-alert-primary .ui-alert-close-btn:before{background-color:#1e8ec2}.ui-alert-icon-warning:before{display:inline-block;margin-right:10px;min-width:16px;width:16px;height:16px;background:no-repeat center url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-394%2C%20-981%29%22%20fill%3D%22%23464a4e%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M402%2C997%20C397.581722%2C997%20394%2C993.418278%20394%2C989%20C394%2C984.581722%20397.581722%2C981%20402%2C981%20C406.418278%2C981%20410%2C984.581722%20410%2C989%20C410%2C993.418278%20406.418278%2C997%20402%2C997%20Z%20M400.728834%2C984.591068%20L400.728834%2C988.82483%20C400.728834%2C989.453606%20401.221589%2C989.956627%20401.837534%2C989.956627%20L401.988098%2C989.956627%20C402.604042%2C989.956627%20403.096798%2C989.453606%20403.096798%2C988.82483%20L403.096798%2C984.591068%20C403.096798%2C983.962291%20402.604042%2C983.45927%20401.988098%2C983.45927%20L401.837534%2C983.45927%20C401.221589%2C983.45927%20400.728834%2C983.962291%20400.728834%2C984.591068%20Z%20M403.3158%2C992.807081%20C403.3158%2C992.024603%20402.686168%2C991.381854%20401.91966%2C991.381854%20C401.153151%2C991.381854%20400.523519%2C992.024603%20400.523519%2C992.807081%20C400.523519%2C993.589558%20401.153151%2C994.232308%20401.91966%2C994.232308%20C402.686168%2C994.232308%20403.3158%2C993.589558%20403.3158%2C992.807081%20Z%22/%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E);content:'';vertical-align:middle}.ui-alert-success.ui-alert-icon-warning:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-394%2C%20-981%29%22%20fill%3D%22%23719100%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M402%2C997%20C397.581722%2C997%20394%2C993.418278%20394%2C989%20C394%2C984.581722%20397.581722%2C981%20402%2C981%20C406.418278%2C981%20410%2C984.581722%20410%2C989%20C410%2C993.418278%20406.418278%2C997%20402%2C997%20Z%20M400.728834%2C984.591068%20L400.728834%2C988.82483%20C400.728834%2C989.453606%20401.221589%2C989.956627%20401.837534%2C989.956627%20L401.988098%2C989.956627%20C402.604042%2C989.956627%20403.096798%2C989.453606%20403.096798%2C988.82483%20L403.096798%2C984.591068%20C403.096798%2C983.962291%20402.604042%2C983.45927%20401.988098%2C983.45927%20L401.837534%2C983.45927%20C401.221589%2C983.45927%20400.728834%2C983.962291%20400.728834%2C984.591068%20Z%20M403.3158%2C992.807081%20C403.3158%2C992.024603%20402.686168%2C991.381854%20401.91966%2C991.381854%20C401.153151%2C991.381854%20400.523519%2C992.024603%20400.523519%2C992.807081%20C400.523519%2C993.589558%20401.153151%2C994.232308%20401.91966%2C994.232308%20C402.686168%2C994.232308%20403.3158%2C993.589558%20403.3158%2C992.807081%20Z%22/%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-danger.ui-alert-icon-warning:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-394%2C%20-981%29%22%20fill%3D%22%23d0021b%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M402%2C997%20C397.581722%2C997%20394%2C993.418278%20394%2C989%20C394%2C984.581722%20397.581722%2C981%20402%2C981%20C406.418278%2C981%20410%2C984.581722%20410%2C989%20C410%2C993.418278%20406.418278%2C997%20402%2C997%20Z%20M400.728834%2C984.591068%20L400.728834%2C988.82483%20C400.728834%2C989.453606%20401.221589%2C989.956627%20401.837534%2C989.956627%20L401.988098%2C989.956627%20C402.604042%2C989.956627%20403.096798%2C989.453606%20403.096798%2C988.82483%20L403.096798%2C984.591068%20C403.096798%2C983.962291%20402.604042%2C983.45927%20401.988098%2C983.45927%20L401.837534%2C983.45927%20C401.221589%2C983.45927%20400.728834%2C983.962291%20400.728834%2C984.591068%20Z%20M403.3158%2C992.807081%20C403.3158%2C992.024603%20402.686168%2C991.381854%20401.91966%2C991.381854%20C401.153151%2C991.381854%20400.523519%2C992.024603%20400.523519%2C992.807081%20C400.523519%2C993.589558%20401.153151%2C994.232308%20401.91966%2C994.232308%20C402.686168%2C994.232308%20403.3158%2C993.589558%20403.3158%2C992.807081%20Z%22/%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-warning.ui-alert-icon-warning:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-394%2C%20-981%29%22%20fill%3D%22%2391711e%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M402%2C997%20C397.581722%2C997%20394%2C993.418278%20394%2C989%20C394%2C984.581722%20397.581722%2C981%20402%2C981%20C406.418278%2C981%20410%2C984.581722%20410%2C989%20C410%2C993.418278%20406.418278%2C997%20402%2C997%20Z%20M400.728834%2C984.591068%20L400.728834%2C988.82483%20C400.728834%2C989.453606%20401.221589%2C989.956627%20401.837534%2C989.956627%20L401.988098%2C989.956627%20C402.604042%2C989.956627%20403.096798%2C989.453606%20403.096798%2C988.82483%20L403.096798%2C984.591068%20C403.096798%2C983.962291%20402.604042%2C983.45927%20401.988098%2C983.45927%20L401.837534%2C983.45927%20C401.221589%2C983.45927%20400.728834%2C983.962291%20400.728834%2C984.591068%20Z%20M403.3158%2C992.807081%20C403.3158%2C992.024603%20402.686168%2C991.381854%20401.91966%2C991.381854%20C401.153151%2C991.381854%20400.523519%2C992.024603%20400.523519%2C992.807081%20C400.523519%2C993.589558%20401.153151%2C994.232308%20401.91966%2C994.232308%20C402.686168%2C994.232308%20403.3158%2C993.589558%20403.3158%2C992.807081%20Z%22/%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-primary.ui-alert-icon-warning:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2216px%22%20height%3D%2216px%22%20viewBox%3D%220%200%2016%2016%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20transform%3D%22translate%28-394%2C%20-981%29%22%20fill%3D%22%231e8ec2%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M402%2C997%20C397.581722%2C997%20394%2C993.418278%20394%2C989%20C394%2C984.581722%20397.581722%2C981%20402%2C981%20C406.418278%2C981%20410%2C984.581722%20410%2C989%20C410%2C993.418278%20406.418278%2C997%20402%2C997%20Z%20M400.728834%2C984.591068%20L400.728834%2C988.82483%20C400.728834%2C989.453606%20401.221589%2C989.956627%20401.837534%2C989.956627%20L401.988098%2C989.956627%20C402.604042%2C989.956627%20403.096798%2C989.453606%20403.096798%2C988.82483%20L403.096798%2C984.591068%20C403.096798%2C983.962291%20402.604042%2C983.45927%20401.988098%2C983.45927%20L401.837534%2C983.45927%20C401.221589%2C983.45927%20400.728834%2C983.962291%20400.728834%2C984.591068%20Z%20M403.3158%2C992.807081%20C403.3158%2C992.024603%20402.686168%2C991.381854%20401.91966%2C991.381854%20C401.153151%2C991.381854%20400.523519%2C992.024603%20400.523519%2C992.807081%20C400.523519%2C993.589558%20401.153151%2C994.232308%20401.91966%2C994.232308%20C402.686168%2C994.232308%20403.3158%2C993.589558%20403.3158%2C992.807081%20Z%22/%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-icon-danger:before{display:inline-block;margin-right:10px;min-width:16px;width:16px;height:16px;background:no-repeat center url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2224px%22%20height%3D%2221px%22%20viewBox%3D%220%200%2024%2021%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-322%2C%20-879%29%22%20fill%3D%22%23464a4e%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M345.546728%2C896.908333%20L335.587544%2C879.975%20C334.820197%2C878.675%20332.991625%2C878.675%20332.240605%2C879.975%20L322.281421%2C896.908333%20C321.497748%2C898.241667%20322.444687%2C899.925%20323.963054%2C899.925%20L343.881421%2C899.925%20C345.383462%2C899.925%20346.330401%2C898.241667%20345.546728%2C896.908333%20Z%20M332.485503%2C885.875%20C332.485503%2C885.125%20333.073258%2C884.525%20333.807952%2C884.525%20L333.987544%2C884.525%20C334.722238%2C884.525%20335.309993%2C885.125%20335.309993%2C885.875%20L335.309993%2C890.925%20C335.309993%2C891.675%20334.722238%2C892.275%20333.987544%2C892.275%20L333.807952%2C892.275%20C333.073258%2C892.275%20332.485503%2C891.675%20332.485503%2C890.925%20L332.485503%2C885.875%20Z%20M335.571217%2C895.675%20C335.571217%2C896.608333%20334.820197%2C897.375%20333.905911%2C897.375%20C332.991625%2C897.375%20332.240605%2C896.608333%20332.240605%2C895.675%20C332.240605%2C894.741667%20332.991625%2C893.975%20333.905911%2C893.975%20C334.820197%2C893.975%20335.571217%2C894.741667%20335.571217%2C895.675%20Z%22/%3E%0A%20%20%20%20%20%20%3C/g%3E%0A%3C/svg%3E);background-size:contain;content:'';vertical-align:middle}.ui-alert-success.ui-alert-icon-danger:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2224px%22%20height%3D%2221px%22%20viewBox%3D%220%200%2024%2021%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-322%2C%20-879%29%22%20fill%3D%22%23719100%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M345.546728%2C896.908333%20L335.587544%2C879.975%20C334.820197%2C878.675%20332.991625%2C878.675%20332.240605%2C879.975%20L322.281421%2C896.908333%20C321.497748%2C898.241667%20322.444687%2C899.925%20323.963054%2C899.925%20L343.881421%2C899.925%20C345.383462%2C899.925%20346.330401%2C898.241667%20345.546728%2C896.908333%20Z%20M332.485503%2C885.875%20C332.485503%2C885.125%20333.073258%2C884.525%20333.807952%2C884.525%20L333.987544%2C884.525%20C334.722238%2C884.525%20335.309993%2C885.125%20335.309993%2C885.875%20L335.309993%2C890.925%20C335.309993%2C891.675%20334.722238%2C892.275%20333.987544%2C892.275%20L333.807952%2C892.275%20C333.073258%2C892.275%20332.485503%2C891.675%20332.485503%2C890.925%20L332.485503%2C885.875%20Z%20M335.571217%2C895.675%20C335.571217%2C896.608333%20334.820197%2C897.375%20333.905911%2C897.375%20C332.991625%2C897.375%20332.240605%2C896.608333%20332.240605%2C895.675%20C332.240605%2C894.741667%20332.991625%2C893.975%20333.905911%2C893.975%20C334.820197%2C893.975%20335.571217%2C894.741667%20335.571217%2C895.675%20Z%22/%3E%0A%20%20%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-danger.ui-alert-icon-danger:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2224px%22%20height%3D%2221px%22%20viewBox%3D%220%200%2024%2021%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-322%2C%20-879%29%22%20fill%3D%22%23d0021b%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M345.546728%2C896.908333%20L335.587544%2C879.975%20C334.820197%2C878.675%20332.991625%2C878.675%20332.240605%2C879.975%20L322.281421%2C896.908333%20C321.497748%2C898.241667%20322.444687%2C899.925%20323.963054%2C899.925%20L343.881421%2C899.925%20C345.383462%2C899.925%20346.330401%2C898.241667%20345.546728%2C896.908333%20Z%20M332.485503%2C885.875%20C332.485503%2C885.125%20333.073258%2C884.525%20333.807952%2C884.525%20L333.987544%2C884.525%20C334.722238%2C884.525%20335.309993%2C885.125%20335.309993%2C885.875%20L335.309993%2C890.925%20C335.309993%2C891.675%20334.722238%2C892.275%20333.987544%2C892.275%20L333.807952%2C892.275%20C333.073258%2C892.275%20332.485503%2C891.675%20332.485503%2C890.925%20L332.485503%2C885.875%20Z%20M335.571217%2C895.675%20C335.571217%2C896.608333%20334.820197%2C897.375%20333.905911%2C897.375%20C332.991625%2C897.375%20332.240605%2C896.608333%20332.240605%2C895.675%20C332.240605%2C894.741667%20332.991625%2C893.975%20333.905911%2C893.975%20C334.820197%2C893.975%20335.571217%2C894.741667%20335.571217%2C895.675%20Z%22/%3E%0A%20%20%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-warning.ui-alert-icon-danger:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2224px%22%20height%3D%2221px%22%20viewBox%3D%220%200%2024%2021%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-322%2C%20-879%29%22%20fill%3D%22%2391711e%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M345.546728%2C896.908333%20L335.587544%2C879.975%20C334.820197%2C878.675%20332.991625%2C878.675%20332.240605%2C879.975%20L322.281421%2C896.908333%20C321.497748%2C898.241667%20322.444687%2C899.925%20323.963054%2C899.925%20L343.881421%2C899.925%20C345.383462%2C899.925%20346.330401%2C898.241667%20345.546728%2C896.908333%20Z%20M332.485503%2C885.875%20C332.485503%2C885.125%20333.073258%2C884.525%20333.807952%2C884.525%20L333.987544%2C884.525%20C334.722238%2C884.525%20335.309993%2C885.125%20335.309993%2C885.875%20L335.309993%2C890.925%20C335.309993%2C891.675%20334.722238%2C892.275%20333.987544%2C892.275%20L333.807952%2C892.275%20C333.073258%2C892.275%20332.485503%2C891.675%20332.485503%2C890.925%20L332.485503%2C885.875%20Z%20M335.571217%2C895.675%20C335.571217%2C896.608333%20334.820197%2C897.375%20333.905911%2C897.375%20C332.991625%2C897.375%20332.240605%2C896.608333%20332.240605%2C895.675%20C332.240605%2C894.741667%20332.991625%2C893.975%20333.905911%2C893.975%20C334.820197%2C893.975%20335.571217%2C894.741667%20335.571217%2C895.675%20Z%22/%3E%0A%20%20%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-primary.ui-alert-icon-danger:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2224px%22%20height%3D%2221px%22%20viewBox%3D%220%200%2024%2021%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-322%2C%20-879%29%22%20fill%3D%22%231e8ec2%22%20fill-rule%3D%22evenodd%22%3E%0A%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M345.546728%2C896.908333%20L335.587544%2C879.975%20C334.820197%2C878.675%20332.991625%2C878.675%20332.240605%2C879.975%20L322.281421%2C896.908333%20C321.497748%2C898.241667%20322.444687%2C899.925%20323.963054%2C899.925%20L343.881421%2C899.925%20C345.383462%2C899.925%20346.330401%2C898.241667%20345.546728%2C896.908333%20Z%20M332.485503%2C885.875%20C332.485503%2C885.125%20333.073258%2C884.525%20333.807952%2C884.525%20L333.987544%2C884.525%20C334.722238%2C884.525%20335.309993%2C885.125%20335.309993%2C885.875%20L335.309993%2C890.925%20C335.309993%2C891.675%20334.722238%2C892.275%20333.987544%2C892.275%20L333.807952%2C892.275%20C333.073258%2C892.275%20332.485503%2C891.675%20332.485503%2C890.925%20L332.485503%2C885.875%20Z%20M335.571217%2C895.675%20C335.571217%2C896.608333%20334.820197%2C897.375%20333.905911%2C897.375%20C332.991625%2C897.375%20332.240605%2C896.608333%20332.240605%2C895.675%20C332.240605%2C894.741667%20332.991625%2C893.975%20333.905911%2C893.975%20C334.820197%2C893.975%20335.571217%2C894.741667%20335.571217%2C895.675%20Z%22/%3E%0A%20%20%20%20%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-icon-info:before{display:inline-block;margin-right:10px;min-width:18px;width:18px;height:18px;background:no-repeat center url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%2018%2018%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%3Cg%20fill%3D%22%23464a4e%22%20fill-rule%3D%22evenodd%22%20%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M10.3309378%2C13%20L10.3309378%2C8.00284091%20L8%2C8.00284091%20L8%2C14%20L10%2C14%20L11%2C14%20L11%2C13%20L10.3309378%2C13%20Z%20M9%2C18%20C4.02943725%2C18%200%2C13.9705627%200%2C9%20C0%2C4.02943725%204.02943725%2C0%209%2C0%20C13.9705627%2C0%2018%2C4.02943725%2018%2C9%20C18%2C13.9705627%2013.9705627%2C18%209%2C18%20Z%20M9%2C6.41976706%20C9.7768545%2C6.41976706%2010.4066195%2C5.79000206%2010.4066195%2C5.01314755%20C10.4066195%2C4.23629305%209.7768545%2C3.60652804%209%2C3.60652804%20C8.2231455%2C3.60652804%207.59338049%2C4.23629305%207.59338049%2C5.01314755%20C7.59338049%2C5.79000206%208.2231455%2C6.41976706%209%2C6.41976706%20Z%20M7%2C13%20L7%2C14%20L8%2C14%20L8%2C13%20L7%2C13%20Z%20M7%2C7.95619799%20L7%2C8.95619799%20L8%2C8.95619799%20L8%2C7.95619799%20L7%2C7.95619799%20Z%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E);content:'';vertical-align:middle}.ui-alert-success.ui-alert-icon-info:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%2018%2018%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%3Cg%20fill%3D%22%23719100%22%20fill-rule%3D%22evenodd%22%20%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M10.3309378%2C13%20L10.3309378%2C8.00284091%20L8%2C8.00284091%20L8%2C14%20L10%2C14%20L11%2C14%20L11%2C13%20L10.3309378%2C13%20Z%20M9%2C18%20C4.02943725%2C18%200%2C13.9705627%200%2C9%20C0%2C4.02943725%204.02943725%2C0%209%2C0%20C13.9705627%2C0%2018%2C4.02943725%2018%2C9%20C18%2C13.9705627%2013.9705627%2C18%209%2C18%20Z%20M9%2C6.41976706%20C9.7768545%2C6.41976706%2010.4066195%2C5.79000206%2010.4066195%2C5.01314755%20C10.4066195%2C4.23629305%209.7768545%2C3.60652804%209%2C3.60652804%20C8.2231455%2C3.60652804%207.59338049%2C4.23629305%207.59338049%2C5.01314755%20C7.59338049%2C5.79000206%208.2231455%2C6.41976706%209%2C6.41976706%20Z%20M7%2C13%20L7%2C14%20L8%2C14%20L8%2C13%20L7%2C13%20Z%20M7%2C7.95619799%20L7%2C8.95619799%20L8%2C8.95619799%20L8%2C7.95619799%20L7%2C7.95619799%20Z%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-danger.ui-alert-icon-info:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%2018%2018%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%3Cg%20fill%3D%22%23d0021b%22%20fill-rule%3D%22evenodd%22%20%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M10.3309378%2C13%20L10.3309378%2C8.00284091%20L8%2C8.00284091%20L8%2C14%20L10%2C14%20L11%2C14%20L11%2C13%20L10.3309378%2C13%20Z%20M9%2C18%20C4.02943725%2C18%200%2C13.9705627%200%2C9%20C0%2C4.02943725%204.02943725%2C0%209%2C0%20C13.9705627%2C0%2018%2C4.02943725%2018%2C9%20C18%2C13.9705627%2013.9705627%2C18%209%2C18%20Z%20M9%2C6.41976706%20C9.7768545%2C6.41976706%2010.4066195%2C5.79000206%2010.4066195%2C5.01314755%20C10.4066195%2C4.23629305%209.7768545%2C3.60652804%209%2C3.60652804%20C8.2231455%2C3.60652804%207.59338049%2C4.23629305%207.59338049%2C5.01314755%20C7.59338049%2C5.79000206%208.2231455%2C6.41976706%209%2C6.41976706%20Z%20M7%2C13%20L7%2C14%20L8%2C14%20L8%2C13%20L7%2C13%20Z%20M7%2C7.95619799%20L7%2C8.95619799%20L8%2C8.95619799%20L8%2C7.95619799%20L7%2C7.95619799%20Z%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-warning.ui-alert-icon-info:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%2018%2018%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%3Cg%20fill%3D%22%2391711e%22%20fill-rule%3D%22evenodd%22%20%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M10.3309378%2C13%20L10.3309378%2C8.00284091%20L8%2C8.00284091%20L8%2C14%20L10%2C14%20L11%2C14%20L11%2C13%20L10.3309378%2C13%20Z%20M9%2C18%20C4.02943725%2C18%200%2C13.9705627%200%2C9%20C0%2C4.02943725%204.02943725%2C0%209%2C0%20C13.9705627%2C0%2018%2C4.02943725%2018%2C9%20C18%2C13.9705627%2013.9705627%2C18%209%2C18%20Z%20M9%2C6.41976706%20C9.7768545%2C6.41976706%2010.4066195%2C5.79000206%2010.4066195%2C5.01314755%20C10.4066195%2C4.23629305%209.7768545%2C3.60652804%209%2C3.60652804%20C8.2231455%2C3.60652804%207.59338049%2C4.23629305%207.59338049%2C5.01314755%20C7.59338049%2C5.79000206%208.2231455%2C6.41976706%209%2C6.41976706%20Z%20M7%2C13%20L7%2C14%20L8%2C14%20L8%2C13%20L7%2C13%20Z%20M7%2C7.95619799%20L7%2C8.95619799%20L8%2C8.95619799%20L8%2C7.95619799%20L7%2C7.95619799%20Z%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E)}.ui-alert-primary.ui-alert-icon-info:before{background-image:url(data:image/svg+xml;charset=US-ASCII,%0A%3Csvg%20width%3D%2218px%22%20height%3D%2218px%22%20viewBox%3D%220%200%2018%2018%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%3Cg%20fill%3D%22%231e8ec2%22%20fill-rule%3D%22evenodd%22%20%3E%0A%20%20%20%20%20%20%3Cpath%20d%3D%22M10.3309378%2C13%20L10.3309378%2C8.00284091%20L8%2C8.00284091%20L8%2C14%20L10%2C14%20L11%2C14%20L11%2C13%20L10.3309378%2C13%20Z%20M9%2C18%20C4.02943725%2C18%200%2C13.9705627%200%2C9%20C0%2C4.02943725%204.02943725%2C0%209%2C0%20C13.9705627%2C0%2018%2C4.02943725%2018%2C9%20C18%2C13.9705627%2013.9705627%2C18%209%2C18%20Z%20M9%2C6.41976706%20C9.7768545%2C6.41976706%2010.4066195%2C5.79000206%2010.4066195%2C5.01314755%20C10.4066195%2C4.23629305%209.7768545%2C3.60652804%209%2C3.60652804%20C8.2231455%2C3.60652804%207.59338049%2C4.23629305%207.59338049%2C5.01314755%20C7.59338049%2C5.79000206%208.2231455%2C6.41976706%209%2C6.41976706%20Z%20M7%2C13%20L7%2C14%20L8%2C14%20L8%2C13%20L7%2C13%20Z%20M7%2C7.95619799%20L7%2C8.95619799%20L8%2C8.95619799%20L8%2C7.95619799%20L7%2C7.95619799%20Z%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E)}\n\n/* styles.css */\n:root {\n  /* Базовая темная палитра расширения. Светлая тема переопределяется ниже в .b24ql-modal. */\n  --b24ql-bg: #1f242d;\n  --b24ql-panel: #222832;\n  --b24ql-panel-2: #2a313b;\n  --b24ql-border: rgba(255, 255, 255, 0.12);\n  --b24ql-border-strong: rgba(255, 255, 255, 0.22);\n  --b24ql-text: #f2f5f8;\n  --b24ql-muted: #9aa5b1;\n  --b24ql-accent: #16b8d8;\n  --b24ql-accent-soft: rgba(22, 184, 216, 0.18);\n  --b24ql-shadow: 0 22px 70px rgba(0, 0, 0, 0.42);\n  --b24ql-overlay: rgba(12, 16, 22, 0.64);\n  --b24ql-suboverlay: rgba(12, 16, 22, 0.52);\n  --b24ql-section-bg: rgba(31, 36, 45, 0.72);\n  --b24ql-control: #aab4bf;\n  --b24ql-control-hover: #ffffff;\n  --b24ql-control-hover-bg: rgba(255, 255, 255, 0.08);\n  --b24ql-badge: #c6d0da;\n  --b24ql-badge-bg: rgba(255, 255, 255, 0.08);\n}\n\n.b24ql-page-locked {\n  /* Блокирует прокрутку страницы Bitrix24, пока открыто окно быстрых ссылок. */\n  overflow: hidden !important;\n}\n\n.b24ql-menu-button,\n.b24ql-menu-button *,\n.b24ql-modal,\n.b24ql-modal * {\n  box-sizing: border-box;\n  font-family: system-ui, -apple-system, \"system-ui\", \"Segoe UI\", Roboto, Ubuntu, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  letter-spacing: 0;\n}\n\n/* Пункт \"Быстрые ссылки\" внутри левого меню Bitrix24. */\n.b24ql-menu-item {\n  position: relative;\n  display: flex;\n  width: calc(100% - 14px);\n  height: 38px;\n  min-height: 38px;\n  margin: 4px 0 0 14px;\n  padding: 0;\n  border-radius: 10px;\n  background: transparent;\n  color: var(--b24ql-menu-color, inherit);\n  overflow: visible;\n  list-style: none;\n  user-select: none;\n}\n\n.b24ql-menu-item-native-parent {\n  width: 100%;\n  margin-left: 0;\n}\n\n.b24ql-menu-item[draggable=\"true\"] {\n  cursor: grab;\n}\n\n.b24ql-menu-item-dragging {\n  opacity: 0.62;\n}\n\n.b24ql-menu-button {\n  border: 0;\n  cursor: pointer;\n  align-items: center;\n  justify-content: flex-start;\n  gap: 0;\n  color: var(--b24ql-menu-color, inherit);\n  background: transparent;\n  box-shadow: none;\n  user-select: none;\n  -webkit-appearance: none;\n  appearance: none;\n  text-align: left;\n  transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease;\n}\n\n.b24ql-menu-button:hover {\n  background: rgba(255, 255, 255, 0.14);\n  box-shadow: none;\n}\n\n.b24ql-menu-button:active {\n  transform: translateY(1px);\n}\n\n.b24ql-menu-button-inline {\n  display: flex;\n  flex: 1 1 0%;\n  width: 100%;\n  height: 38px;\n  min-width: 38px;\n  min-height: 38px;\n  padding: 6px;\n  border-radius: 10px;\n  color: inherit;\n  font-size: 15px;\n  font-weight: 400;\n  line-height: 18px;\n  white-space: nowrap;\n  cursor: grab;\n}\n\n.b24ql-menu-button-inline:active {\n  cursor: grabbing;\n}\n\n.b24ql-menu-icon-box {\n  display: flex !important;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  min-width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: transparent;\n}\n\n.b24ql-menu-button-icon {\n  display: grid !important;\n  width: 20px;\n  min-width: 20px;\n  gap: 3px;\n  background: transparent;\n}\n\n.b24ql-menu-button-inline .b24ql-menu-button-icon {\n  width: 20px;\n  min-width: 20px;\n  gap: 3px;\n}\n\n.b24ql-menu-button-icon span {\n  display: block !important;\n  width: 20px;\n  height: 3px;\n  border-radius: 99px;\n  background: currentColor;\n}\n\n.b24ql-menu-button-inline .b24ql-menu-button-icon span {\n  width: 20px;\n  height: 3px;\n}\n\n.b24ql-menu-button-text {\n  display: block;\n  position: relative;\n  flex: 0 1 auto;\n  max-width: 155px;\n  height: 20px;\n  margin: 0 0 0 9px;\n  padding: 0;\n  color: var(--b24ql-menu-color, inherit);\n  font-size: 15px;\n  font-weight: 400;\n  line-height: 20px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.menu-collapsed-mode .b24ql-menu-button-text,\n.menu-items-block-collapsed .b24ql-menu-button-text,\n.menu-items-view-mode-collapsed .b24ql-menu-button-text {\n  display: none;\n}\n\n/* Основное модальное окно и переменные темной темы. */\n.b24ql-modal {\n  --b24ql-bg: #1f242d;\n  --b24ql-panel: #222832;\n  --b24ql-panel-2: #2a313b;\n  --b24ql-border: rgba(255, 255, 255, 0.12);\n  --b24ql-border-strong: rgba(255, 255, 255, 0.22);\n  --b24ql-text: #f2f5f8;\n  --b24ql-muted: #9aa5b1;\n  --b24ql-accent: #16b8d8;\n  --b24ql-accent-soft: rgba(22, 184, 216, 0.18);\n  --b24ql-shadow: 0 22px 70px rgba(0, 0, 0, 0.42);\n  --b24ql-overlay: rgba(12, 16, 22, 0.64);\n  --b24ql-suboverlay: rgba(12, 16, 22, 0.52);\n  --b24ql-section-bg: rgba(31, 36, 45, 0.72);\n  --b24ql-control: #aab4bf;\n  --b24ql-control-hover: #ffffff;\n  --b24ql-control-hover-bg: rgba(255, 255, 255, 0.08);\n  --b24ql-badge: #c6d0da;\n  --b24ql-badge-bg: rgba(255, 255, 255, 0.08);\n  position: fixed;\n  inset: 0;\n  z-index: 2147483647;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 34px;\n  color: var(--b24ql-text);\n  color-scheme: dark;\n  background: var(--b24ql-overlay);\n  backdrop-filter: blur(3px);\n}\n\n/* Светлая тема: включается кнопкой в окне или автоматически по теме браузера. */\n.b24ql-modal[data-b24ql-effective-theme=\"light\"] {\n  --b24ql-bg: #ffffff;\n  --b24ql-panel: #f7f9fc;\n  --b24ql-panel-2: #eef3f7;\n  --b24ql-border: rgba(39, 52, 69, 0.14);\n  --b24ql-border-strong: rgba(39, 52, 69, 0.24);\n  --b24ql-text: #1f2933;\n  --b24ql-muted: #687583;\n  --b24ql-accent-soft: rgba(22, 184, 216, 0.13);\n  --b24ql-shadow: 0 24px 72px rgba(31, 42, 53, 0.22);\n  --b24ql-overlay: rgba(236, 241, 246, 0.72);\n  --b24ql-suboverlay: rgba(236, 241, 246, 0.55);\n  --b24ql-section-bg: rgba(247, 249, 252, 0.82);\n  --b24ql-control: #687583;\n  --b24ql-control-hover: #1f2933;\n  --b24ql-control-hover-bg: rgba(31, 41, 51, 0.08);\n  --b24ql-badge: #5f6d7b;\n  --b24ql-badge-bg: rgba(31, 41, 51, 0.08);\n  color-scheme: light;\n}\n\n.b24ql-hidden {\n  display: none !important;\n}\n\n/* Каркас окна: ширина, высота, фон и шапка. */\n.b24ql-panel {\n  position: relative;\n  z-index: 0;\n  width: min(1040px, calc(100vw - 48px));\n  max-height: min(720px, calc(100vh - 48px));\n  overflow: hidden;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 10px;\n  background: var(--b24ql-bg);\n  box-shadow: var(--b24ql-shadow);\n}\n\n.b24ql-header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 22px;\n  padding: 22px 24px 18px;\n  border-bottom: 1px solid var(--b24ql-border);\n}\n\n.b24ql-header h2 {\n  margin: 0 0 5px;\n  color: var(--b24ql-text);\n  font-size: 19px;\n  font-weight: 750;\n  line-height: 1.2;\n}\n\n.b24ql-header p {\n  margin: 0;\n  color: var(--b24ql-muted);\n  font-size: 13px;\n  line-height: 1.35;\n}\n\n.b24ql-title-wrap {\n  min-width: 0;\n}\n\n/* Кнопки в шапке: настройки и закрытие окна. */\n.b24ql-header-actions {\n  display: flex;\n  flex: 0 0 auto;\n  align-items: center;\n  gap: 4px;\n}\n\n.b24ql-close,\n.b24ql-settings-open {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: 0;\n  width: 32px;\n  height: 32px;\n  padding: 0;\n  border-radius: 8px;\n  color: var(--b24ql-control);\n  background: transparent;\n  cursor: pointer;\n  transition: color 0.16s ease, background 0.16s ease;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-close {\n  line-height: 0;\n}\n\n.b24ql-close:hover,\n.b24ql-close:focus,\n.b24ql-settings-open:hover,\n.b24ql-settings-open:focus {\n  color: var(--b24ql-control-hover);\n  outline: none;\n  background: var(--b24ql-control-hover-bg);\n}\n\n.b24ql-close-icon,\n.b24ql-settings-open-icon {\n  display: block;\n  width: 20px;\n  height: 20px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.b24ql-close-icon {\n  width: 22px;\n  height: 22px;\n}\n\n/* Вложенное окно для групп кнопок CRM и окно настроек. */\n.b24ql-submodal,\n.b24ql-settings-modal {\n  position: absolute;\n  inset: 0;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 34px;\n  background: var(--b24ql-suboverlay);\n  backdrop-filter: blur(2px);\n}\n\n/* Небольшой диалог для ввода ID перед открытием шаблонной ссылки. */\n.b24ql-template-modal {\n  position: absolute;\n  inset: 0;\n  z-index: 20;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 24px;\n  background: rgba(9, 14, 21, 0.58);\n  backdrop-filter: blur(2px);\n}\n\n.b24ql-template-panel {\n  width: min(460px, calc(100vw - 48px));\n  overflow: hidden;\n  border: 1px solid var(--b24ql-border-strong);\n  border-radius: 10px;\n  background: var(--b24ql-bg);\n  box-shadow: var(--b24ql-shadow);\n}\n\n.b24ql-template-header {\n  display: flex;\n  min-height: 64px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 14px 18px;\n  border-bottom: 1px solid var(--b24ql-border);\n  background: var(--b24ql-panel);\n}\n\n.b24ql-template-header h2 {\n  min-width: 0;\n  margin: 0;\n  color: var(--b24ql-text);\n  font-size: 17px;\n  font-weight: 750;\n  line-height: 1.25;\n}\n\n.b24ql-template-form {\n  display: grid;\n  gap: 16px;\n  padding: 18px;\n}\n\n.b24ql-template-fields {\n  display: grid;\n  gap: 12px;\n}\n\n.b24ql-template-field {\n  display: grid;\n  gap: 7px;\n  color: var(--b24ql-text);\n  font-size: 13px;\n  font-weight: 700;\n}\n\n.b24ql-template-input {\n  width: 100%;\n  height: 42px;\n  padding: 0 12px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  outline: none;\n  color: var(--b24ql-text);\n  background: var(--b24ql-panel-2);\n  font-size: 15px;\n  font-weight: 650;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-template-input:focus {\n  border-color: rgba(22, 184, 216, 0.68);\n  box-shadow: 0 0 0 3px var(--b24ql-accent-soft);\n}\n\n.b24ql-template-input-invalid {\n  border-color: #e65b67;\n}\n\n.b24ql-template-error {\n  color: #e65b67;\n  font-size: 12px;\n  font-weight: 650;\n  line-height: 1.35;\n}\n\n.b24ql-template-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n}\n\n/* Команды в диалогах: основное действие акцентное, вспомогательное с контуром. */\n.b24ql-modal .b24ql-ui-action {\n  max-width: 100%;\n}\n\n.b24ql-modal .b24ql-ui-action.ui-btn-light-border {\n  --ui-btn-background: transparent;\n  --ui-btn-background-hover: rgba(255, 255, 255, 0.1);\n  --ui-btn-background-active: rgba(255, 255, 255, 0.16);\n  --ui-btn-border-color: rgba(255, 255, 255, 0.38);\n  --ui-btn-border-color-hover: rgba(255, 255, 255, 0.56);\n  --ui-btn-border-color-active: rgba(255, 255, 255, 0.65);\n  --ui-btn-color: #e7eef6;\n  --ui-btn-color-hover: #ffffff;\n  --ui-btn-color-active: #ffffff;\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"light\"] .b24ql-ui-action.ui-btn-light-border {\n  --ui-btn-background-hover: rgba(31, 41, 51, 0.08);\n  --ui-btn-background-active: rgba(31, 41, 51, 0.13);\n  --ui-btn-border-color: #b9c4cf;\n  --ui-btn-border-color-hover: #7c8d9c;\n  --ui-btn-border-color-active: #687583;\n  --ui-btn-color: #344251;\n  --ui-btn-color-hover: #1f2933;\n  --ui-btn-color-active: #1f2933;\n}\n\n.b24ql-ui-button-host {\n  display: inline-flex;\n  align-items: center;\n}\n\n.b24ql-subpanel {\n  width: min(920px, calc(100vw - 72px));\n  max-height: min(520px, calc(100vh - 72px));\n}\n\n.b24ql-settings-panel {\n  display: flex;\n  flex-direction: column;\n  width: min(920px, calc(100vw - 72px));\n  height: min(560px, calc(100vh - 72px));\n  max-height: min(560px, calc(100vh - 72px));\n}\n\n.b24ql-subheader {\n  align-items: center;\n}\n\n.b24ql-subactions {\n  display: flex;\n  flex: 0 0 auto;\n  align-items: center;\n  gap: 4px;\n}\n\n.b24ql-subcontent {\n  max-height: calc(min(520px, 100vh - 72px) - 84px);\n}\n\n.b24ql-content.b24ql-settings-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  max-height: none;\n  overflow: auto;\n}\n\n.b24ql-settings-editor-active .b24ql-content.b24ql-settings-content {\n  overflow: hidden;\n  padding: 0;\n  background: var(--b24ql-panel);\n}\n\n.b24ql-settings-view {\n  display: grid;\n  gap: 10px;\n  min-height: 0;\n}\n\n.b24ql-settings-row {\n  display: flex;\n  min-height: 50px;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 9px 12px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  background: var(--b24ql-section-bg);\n}\n\n.b24ql-settings-row-title {\n  min-width: 0;\n  color: var(--b24ql-text);\n  font-size: 14px;\n  font-weight: 700;\n  line-height: 1.25;\n}\n\n.b24ql-choice-group {\n  display: inline-flex;\n  flex: 0 0 auto;\n  gap: 2px;\n  padding: 2px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  background: var(--b24ql-panel-2);\n}\n\n.b24ql-choice {\n  display: inline-flex;\n  min-height: 28px;\n  align-items: center;\n  justify-content: center;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  color: var(--b24ql-control);\n  background: transparent;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 700;\n  line-height: 1.15;\n  white-space: nowrap;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: color 0.16s ease, background 0.16s ease, border-color 0.16s ease;\n}\n\n.b24ql-choice {\n  min-width: 54px;\n  padding: 0 10px;\n}\n\n.b24ql-choice:hover,\n.b24ql-choice:focus {\n  color: var(--b24ql-control-hover);\n  outline: none;\n  background: var(--b24ql-control-hover-bg);\n}\n\n.b24ql-choice-active {\n  color: var(--b24ql-text);\n  border-color: rgba(22, 184, 216, 0.44);\n  background: var(--b24ql-accent-soft);\n}\n\n/* Подтверждение действий внутри расширения вместо нестабильного системного confirm в Firefox. */\n.b24ql-confirm-modal {\n  position: absolute;\n  inset: 0;\n  z-index: 40;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 20px;\n  background: rgba(9, 14, 21, 0.56);\n}\n\n.b24ql-confirm-panel {\n  width: min(420px, 100%);\n  padding: 22px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  color: var(--b24ql-text);\n  background: var(--b24ql-panel);\n  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.32);\n}\n\n.b24ql-confirm-message {\n  margin: 0;\n  color: var(--b24ql-text);\n  font-size: 15px;\n  font-weight: 650;\n  line-height: 1.45;\n}\n\n.b24ql-confirm-actions {\n  display: flex;\n  justify-content: flex-end;\n  gap: 8px;\n  margin-top: 20px;\n}\n\n.b24ql-settings-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n\n.b24ql-links-editor-toolbar {\n  padding: 18px 24px 6px;\n  background: var(--b24ql-panel);\n}\n\n.b24ql-settings-toolbar h3 {\n  margin: 0;\n  color: var(--b24ql-text);\n  font-size: 15px;\n  font-weight: 740;\n  line-height: 1.2;\n}\n\n.b24ql-settings-list {\n  display: grid;\n  gap: 8px;\n}\n\n.b24ql-links-editor-actions {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n  padding: 0 24px 14px;\n  border-bottom: 1px solid var(--b24ql-border);\n  background: var(--b24ql-panel);\n}\n\n.b24ql-links-editor-actions .b24ql-ui-action.ui-btn-sm {\n  --ui-btn-padding: 0 9px;\n  --ui-btn-min-width: 0px;\n}\n\n.b24ql-editor-notice {\n  flex: 1 0 100%;\n  padding-top: 2px;\n  color: var(--b24ql-control);\n  font-size: 12px;\n  font-weight: 650;\n  line-height: 1.35;\n}\n\n.b24ql-editor-notice-error {\n  color: #e65b67;\n}\n\n.b24ql-import-input {\n  display: none !important;\n}\n\n.b24ql-links-editor-list {\n  display: grid;\n  gap: 8px;\n  min-height: 0;\n  overflow: auto;\n  padding: 10px 24px 24px;\n  background: var(--b24ql-bg);\n}\n\n.b24ql-links-editor-view {\n  gap: 0;\n  grid-template-rows: auto auto minmax(0, 1fr);\n  height: 100%;\n  background: var(--b24ql-bg);\n}\n\n.b24ql-editor-row {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto;\n  gap: 10px;\n  align-items: center;\n  padding: 10px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  background: var(--b24ql-section-bg);\n}\n\n.b24ql-editor-fields {\n  display: grid;\n  grid-template-columns: minmax(150px, 0.8fr) minmax(220px, 1.2fr);\n  gap: 8px;\n  min-width: 0;\n}\n\n.b24ql-editor-fields .b24ql-editor-input:only-child {\n  grid-column: 1 / -1;\n}\n\n.b24ql-editor-keywords {\n  grid-column: 1 / -1;\n}\n\n.b24ql-editor-input {\n  width: 100%;\n  min-width: 0;\n  height: 34px;\n  padding: 0 10px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 7px;\n  outline: none;\n  color: var(--b24ql-text);\n  background: var(--b24ql-panel-2);\n  font-size: 13px;\n  font-weight: 650;\n  line-height: 34px;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-editor-input:focus {\n  border-color: rgba(22, 184, 216, 0.68);\n  box-shadow: 0 0 0 3px var(--b24ql-accent-soft);\n}\n\n.b24ql-editor-meta {\n  display: inline-flex;\n  min-width: 0;\n  height: 34px;\n  align-items: center;\n  padding: 0 10px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 7px;\n  color: var(--b24ql-muted);\n  background: var(--b24ql-panel-2);\n  font-size: 12px;\n  font-weight: 650;\n  line-height: 1.2;\n}\n\n.b24ql-editor-row-actions {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: flex-end;\n  gap: 6px;\n}\n\n/* Поиск по основному окну и вложенным разделам. */\n.b24ql-search {\n  position: relative;\n  display: flex;\n  min-height: 42px;\n  align-items: center;\n  gap: 9px;\n  padding: 0 10px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 8px;\n  background: var(--b24ql-panel-2);\n}\n\n.b24ql-search:focus-within {\n  border-color: rgba(22, 184, 216, 0.68);\n  box-shadow: 0 0 0 3px var(--b24ql-accent-soft);\n}\n\n.b24ql-search-icon {\n  display: inline-flex;\n  flex: 0 0 auto;\n  width: 18px;\n  height: 18px;\n  color: var(--b24ql-muted);\n}\n\n.b24ql-search-icon svg {\n  display: block;\n  width: 18px;\n  height: 18px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.b24ql-search-input {\n  flex: 1 1 auto;\n  min-width: 0;\n  height: 40px;\n  border: 0;\n  outline: none;\n  color: var(--b24ql-text);\n  background: transparent;\n  font-size: 14px;\n  font-weight: 550;\n  line-height: 40px;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-search-input::placeholder {\n  color: var(--b24ql-muted);\n  opacity: 1;\n}\n\n.b24ql-search-input::-webkit-search-cancel-button,\n.b24ql-search-input::-webkit-search-decoration {\n  display: none;\n}\n\n.b24ql-search-clear {\n  display: inline-flex;\n  flex: 0 0 auto;\n  width: 26px;\n  height: 26px;\n  align-items: center;\n  justify-content: center;\n  border: 0;\n  border-radius: 6px;\n  color: var(--b24ql-control);\n  background: transparent;\n  cursor: pointer;\n  font-size: 22px;\n  line-height: 1;\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-search-clear:hover,\n.b24ql-search-clear:focus {\n  color: var(--b24ql-control-hover);\n  outline: none;\n  background: var(--b24ql-control-hover-bg);\n}\n\n/* Блоки быстрых ссылок и сетка кнопок. */\n.b24ql-content {\n  display: grid;\n  gap: 18px;\n  max-height: calc(min(720px, 100vh - 48px) - 84px);\n  overflow: auto;\n  padding: 18px 24px 24px;\n}\n\n.b24ql-section {\n  border: 1px solid var(--b24ql-border);\n  border-radius: 10px;\n  background: var(--b24ql-section-bg);\n}\n\n.b24ql-section-heading {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  min-height: 42px;\n  padding: 0 12px;\n}\n\n.b24ql-section-heading h3 {\n  flex: 0 1 auto;\n  min-width: 0;\n  margin: 0;\n  color: var(--b24ql-text);\n  font-size: 14px;\n  font-weight: 720;\n  line-height: 1.2;\n}\n\n.b24ql-section-dot {\n  width: 9px;\n  height: 9px;\n  border-radius: 50%;\n  background: var(--b24ql-accent);\n  box-shadow: 0 0 12px rgba(22, 184, 216, 0.95);\n}\n\n.b24ql-section-open-all,\n.b24ql-section-toggle {\n  display: inline-flex;\n  flex: 0 0 auto;\n  width: 24px;\n  height: 24px;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: 6px;\n  color: var(--b24ql-control);\n  background: transparent;\n  cursor: pointer;\n  transition: color 0.16s ease, background 0.16s ease;\n}\n\n.b24ql-section-open-all:hover,\n.b24ql-section-open-all:focus,\n.b24ql-section-toggle:hover,\n.b24ql-section-toggle:focus {\n  color: var(--b24ql-control-hover);\n  outline: none;\n  background: var(--b24ql-control-hover-bg);\n}\n\n.b24ql-section-open-all-icon {\n  display: block;\n  width: 17px;\n  height: 17px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.2;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.b24ql-section-toggle-icon {\n  display: block;\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 6px solid currentColor;\n  transition: transform 0.16s ease;\n}\n\n.b24ql-section-collapsed .b24ql-section-toggle-icon {\n  transform: rotate(-90deg);\n}\n\n.b24ql-section-count {\n  display: inline-flex;\n  margin-left: auto;\n  min-width: 24px;\n  height: 18px;\n  align-items: center;\n  justify-content: center;\n  border-radius: 9px;\n  color: var(--b24ql-badge);\n  background: var(--b24ql-badge-bg);\n  font-size: 11px;\n  font-weight: 650;\n}\n\n.b24ql-link-grid {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 8px;\n  padding: 0 12px 12px;\n}\n\n.b24ql-subcontent .b24ql-link-grid {\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n}\n\n.b24ql-section-collapsed .b24ql-link-grid {\n  display: none;\n}\n\n.b24ql-section-search-open .b24ql-link-grid {\n  display: grid;\n}\n\n.b24ql-section[hidden],\n.b24ql-link-shell[hidden],\n.b24ql-link[hidden] {\n  display: none !important;\n}\n\n.b24ql-search-results.b24ql-hidden {\n  display: none !important;\n}\n\n.b24ql-link {\n  display: flex;\n  width: 100%;\n  min-height: 44px;\n  align-items: center;\n  padding: 9px 42px 9px 12px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  color: var(--b24ql-text) !important;\n  background: var(--b24ql-panel-2);\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 650;\n  line-height: 1.25;\n  text-align: left;\n  text-decoration: none !important;\n  overflow-wrap: anywhere;\n  -webkit-appearance: none;\n  appearance: none;\n  transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease;\n}\n\n.b24ql-link-shell {\n  position: relative;\n  min-width: 0;\n}\n\n.b24ql-favorite-toggle {\n  position: absolute;\n  z-index: 2;\n  top: 50%;\n  right: 8px;\n  display: inline-flex;\n  width: 26px;\n  height: 26px;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  border: 0;\n  border-radius: 6px;\n  color: var(--b24ql-muted);\n  background: transparent;\n  cursor: pointer;\n  opacity: 0.54;\n  transform: translateY(-50%);\n  -webkit-appearance: none;\n  appearance: none;\n}\n\n.b24ql-favorite-toggle svg {\n  width: 17px;\n  height: 17px;\n  fill: transparent;\n  stroke: currentColor;\n  stroke-width: 1.8;\n  stroke-linejoin: round;\n}\n\n.b24ql-link-shell:hover .b24ql-favorite-toggle,\n.b24ql-link-shell:focus-within .b24ql-favorite-toggle,\n.b24ql-favorite-toggle.b24ql-favorite-active {\n  opacity: 1;\n}\n\n.b24ql-favorite-toggle:hover,\n.b24ql-favorite-toggle:focus {\n  color: var(--b24ql-accent);\n  outline: none;\n  background: var(--b24ql-control-hover-bg);\n}\n\n.b24ql-favorite-toggle.b24ql-favorite-active {\n  color: var(--b24ql-accent);\n}\n\n.b24ql-favorite-toggle.b24ql-favorite-active svg {\n  fill: currentColor;\n}\n\n.b24ql-link-text {\n  display: grid;\n  min-width: 0;\n  gap: 2px;\n}\n\n.b24ql-link-group {\n  justify-content: space-between;\n  gap: 10px;\n}\n\n.b24ql-link-group .b24ql-link-arrow,\n.b24ql-link-template .b24ql-link-arrow {\n  margin-right: 2px;\n}\n\n.b24ql-link-label {\n  display: block;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.b24ql-link-meta {\n  display: block;\n  min-width: 0;\n  color: var(--b24ql-muted);\n  font-size: 11px;\n  font-weight: 600;\n  line-height: 1.2;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.b24ql-link-search-result {\n  min-height: 50px;\n}\n\n.b24ql-link-arrow {\n  flex: 0 0 auto;\n  color: var(--b24ql-muted);\n  font-size: 22px;\n  font-weight: 400;\n  line-height: 1;\n}\n\n.b24ql-link:hover,\n.b24ql-link:focus,\n.b24ql-link-search-selected {\n  border-color: rgba(22, 184, 216, 0.55);\n  outline: none;\n  background: linear-gradient(0deg, var(--b24ql-accent-soft), var(--b24ql-accent-soft)), var(--b24ql-panel-2);\n}\n\n.b24ql-link-active {\n  border-color: rgba(22, 184, 216, 0.82);\n  background: linear-gradient(0deg, var(--b24ql-accent-soft), var(--b24ql-accent-soft)), var(--b24ql-panel-2);\n  box-shadow: inset 3px 0 0 var(--b24ql-accent);\n}\n\n.b24ql-link-active::after {\n  content: \"\";\n  flex: 0 0 auto;\n  width: 7px;\n  height: 7px;\n  margin-left: auto;\n  border-radius: 50%;\n  background: var(--b24ql-accent);\n  box-shadow: 0 0 10px rgba(22, 184, 216, 0.9);\n}\n\n.b24ql-link-group.b24ql-link-active::after {\n  display: none;\n}\n\n.b24ql-link-group.b24ql-link-active .b24ql-link-arrow {\n  color: var(--b24ql-accent);\n}\n\n.b24ql-link:active {\n  transform: translateY(1px);\n}\n\n.b24ql-empty {\n  display: flex;\n  min-height: 54px;\n  align-items: center;\n  justify-content: center;\n  border: 1px dashed var(--b24ql-border);\n  border-radius: 8px;\n  color: var(--b24ql-muted);\n  font-size: 14px;\n  font-weight: 600;\n}\n\n/* Адаптация сетки под узкие экраны. */\n@media (max-width: 860px) {\n  .b24ql-link-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n\n@media (max-width: 560px) {\n  .b24ql-modal {\n    align-items: stretch;\n    padding: 12px;\n  }\n\n  .b24ql-panel {\n    width: 100%;\n    max-height: calc(100vh - 24px);\n  }\n\n  .b24ql-header {\n    padding: 18px 16px 14px;\n  }\n\n  .b24ql-submodal,\n  .b24ql-settings-modal,\n  .b24ql-template-modal {\n    padding: 12px;\n  }\n\n  .b24ql-template-panel {\n    width: 100%;\n  }\n\n  .b24ql-subpanel,\n  .b24ql-settings-panel {\n    width: 100%;\n    height: calc(100vh - 24px);\n    max-height: calc(100vh - 24px);\n  }\n\n  .b24ql-content {\n    max-height: calc(100vh - 112px);\n    padding: 14px 16px 16px;\n  }\n\n  .b24ql-link-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .b24ql-settings-row {\n    align-items: stretch;\n    flex-direction: column;\n    gap: 9px;\n  }\n\n  .b24ql-choice-group {\n    width: 100%;\n  }\n\n  .b24ql-choice {\n    flex: 1 1 0;\n  }\n\n  .b24ql-editor-row {\n    grid-template-columns: 1fr;\n  }\n\n  .b24ql-editor-fields {\n    grid-template-columns: 1fr;\n  }\n\n  .b24ql-editor-row-actions {\n    justify-content: flex-start;\n  }\n}\n\n\n/* bxui-skin.css */\n/* BX.UI controls use locally bundled ui.buttons/forms/counter/label/alerts assets.\n   Layout and interaction remain scoped to this extension's modal. */\n.b24ql-modal {\n  --b24ql-accent: #2fc6f6;\n  --b24ql-accent-soft: rgba(47, 198, 246, .15);\n  --b24ql-panel-2: #2b323b;\n  --b24ql-section-bg: #252b34;\n  --ui-field-size: 40px;\n  font-family: var(--ui-font-family-primary, \"Helvetica Neue\", Arial, sans-serif);\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"light\"] {\n  --b24ql-panel-2: #f5f8fa;\n  --b24ql-section-bg: #fff;\n}\n\n.b24ql-modal .ui-btn {\n  margin-left: 0;\n  font-family: inherit;\n  letter-spacing: 0;\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"dark\"] .b24ql-ui-action.ui-btn-light-border,\n.b24ql-modal[data-b24ql-effective-theme=\"dark\"] .b24ql-choice.ui-btn,\n.b24ql-modal[data-b24ql-effective-theme=\"dark\"] .b24ql-editor-small-button.ui-btn-light-border {\n  color: #e7eef6 !important;\n}\n\n.b24ql-modal .b24ql-close.ui-btn,\n.b24ql-modal .b24ql-settings-open.ui-btn,\n.b24ql-modal .b24ql-section-toggle.ui-btn,\n.b24ql-modal .b24ql-section-open-all.ui-btn,\n.b24ql-modal .b24ql-favorite-toggle.ui-btn {\n  --ui-btn-min-width: 0px;\n  --ui-btn-padding: 0;\n  min-width: 0;\n  flex-shrink: 0;\n  border-color: transparent;\n  background: transparent;\n  color: var(--b24ql-control);\n}\n\n.b24ql-modal .b24ql-close.ui-btn:hover,\n.b24ql-modal .b24ql-settings-open.ui-btn:hover,\n.b24ql-modal .b24ql-section-toggle.ui-btn:hover,\n.b24ql-modal .b24ql-section-open-all.ui-btn:hover,\n.b24ql-modal .b24ql-favorite-toggle.ui-btn:hover {\n  border-color: transparent;\n  background: var(--b24ql-control-hover-bg);\n  color: var(--b24ql-control-hover);\n}\n\n.b24ql-modal .b24ql-choice.ui-btn {\n  --ui-btn-min-width: 0px;\n  --ui-btn-padding: 0 10px;\n  height: 30px;\n  min-height: 30px;\n  min-width: 54px;\n  border-radius: 4px;\n  border-color: transparent;\n  background: transparent;\n  color: var(--b24ql-muted);\n  font-size: 12px;\n  text-transform: none;\n}\n\n.b24ql-modal .b24ql-choice.ui-btn.b24ql-choice-active {\n  border-color: var(--b24ql-accent);\n  background: var(--b24ql-accent-soft);\n  color: var(--b24ql-text);\n}\n\n.b24ql-modal .b24ql-search.ui-ctl {\n  display: block;\n  width: 100%;\n  min-height: 40px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  box-shadow: none;\n  --ui-field-size: 42px;\n}\n\n.b24ql-modal .b24ql-search-input.ui-ctl-element {\n  width: 100%;\n  height: 42px;\n  padding-left: 42px !important;\n  padding-right: 40px !important;\n  border: 1px solid var(--b24ql-border-strong);\n  border-radius: 5px;\n  background: var(--b24ql-panel-2);\n  color: var(--b24ql-text);\n  font: 400 14px var(--ui-font-family-primary, \"Helvetica Neue\", Arial, sans-serif);\n  line-height: 40px;\n}\n\n.b24ql-modal .b24ql-search-input.ui-ctl-element:focus,\n.b24ql-modal .b24ql-editor-input.ui-ctl-element:focus,\n.b24ql-modal .b24ql-template-input.ui-ctl-element:focus {\n  border-color: var(--b24ql-accent);\n  box-shadow: 0 0 0 2px var(--b24ql-accent-soft);\n}\n\n.b24ql-modal .b24ql-search-icon.ui-ctl-before {\n  position: absolute;\n  top: 1px;\n  left: 1px;\n  width: 40px;\n  height: 40px;\n  background-image: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDE1IDE1Ij48cGF0aCBmaWxsPSIjNTM1QzY4IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xLjMzIDUuNWMwLTIuMzA0IDEuODY2LTQuMTcgNC4xNy00LjE3UzkuNjcgMy4xOTUgOS42NyA1LjVjMCAyLjMwNS0xLjg2NSA0LjE3LTQuMTcgNC4xNy0yLjMwNSAwLTQuMTctMS44NjUtNC4xNy00LjE3bTEyLjUyOCA2Ljk0NGwtMy44MTYtMy44MTctLjAxNC0uMDA4QzEwLjY0IDcuNzMgMTEgNi42NiAxMSA1LjUgMTEgMi40NjIgOC41MzcgMCA1LjUgMFMwIDIuNDYyIDAgNS41IDIuNDYzIDExIDUuNSAxMWMxLjE1OCAwIDIuMjMyLS4zNiAzLjExOC0uOTcyLjAwNC4wMDQuMDA1LjAxLjAxLjAxNGwzLjgxNiAzLjgxN2MuMzcyLjM3Ljk4Mi4zNyAxLjM1NCAwbC4wNi0uMDYzYy4zNzItLjM3Mi4zNzItLjk4MiAwLTEuMzU0Ii8+PC9zdmc+\");\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 15px 15px;\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"dark\"] .b24ql-search-icon.ui-ctl-before {\n  filter: brightness(0) invert(.72);\n}\n\n.b24ql-modal .b24ql-search-clear.ui-ctl-after {\n  position: absolute;\n  top: 1px;\n  right: 1px;\n  width: 40px;\n  height: 40px;\n  min-width: 0;\n  background-position: center;\n  background-repeat: no-repeat;\n  font-size: 0;\n}\n\n.b24ql-modal .b24ql-editor-control.ui-ctl,\n.b24ql-modal .b24ql-template-control.ui-ctl {\n  width: 100%;\n  min-width: 0;\n}\n\n.b24ql-modal .b24ql-editor-control.ui-ctl:only-child {\n  grid-column: 1 / -1;\n}\n\n.b24ql-modal .b24ql-editor-input.ui-ctl-element,\n.b24ql-modal .b24ql-template-input.ui-ctl-element {\n  border: 1px solid var(--b24ql-border-strong);\n  border-radius: 5px;\n  background: var(--b24ql-panel-2);\n  color: var(--b24ql-text);\n  font-weight: 400;\n}\n\n.b24ql-modal .b24ql-editor-input.ui-ctl-element {\n  height: 34px;\n  min-height: 34px;\n  font-size: 13px;\n}\n\n.b24ql-modal .b24ql-template-input.ui-ctl-element {\n  height: 42px;\n  font-size: 14px;\n}\n\n.b24ql-modal .b24ql-link.ui-btn {\n  --ui-btn-min-width: 0px;\n  --ui-btn-padding: 9px 42px 9px 12px;\n  height: auto;\n  min-height: 44px;\n  border: 1px solid transparent;\n  border-radius: 5px;\n  background: var(--b24ql-panel-2);\n  color: var(--b24ql-text) !important;\n  font-size: 14px;\n  font-weight: 600;\n  line-height: 1.25;\n  justify-content: flex-start;\n  text-align: left;\n  text-transform: none;\n  white-space: normal;\n}\n\n.b24ql-modal .b24ql-link.ui-btn:hover,\n.b24ql-modal .b24ql-link.ui-btn:focus,\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-search-selected {\n  border-color: var(--b24ql-accent);\n  background: var(--b24ql-accent-soft);\n}\n\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-active {\n  border-color: var(--b24ql-accent);\n  background: var(--b24ql-accent-soft);\n}\n\n.b24ql-modal .b24ql-section-count.ui-counter {\n  min-width: 23px;\n  height: 18px;\n  border-radius: 9px;\n  background: var(--b24ql-badge-bg);\n  box-shadow: none;\n}\n\n.b24ql-modal .b24ql-section-count .ui-counter-inner {\n  min-width: 23px;\n  padding: 0 5px;\n  color: var(--b24ql-badge) !important;\n  font: 600 11px/18px var(--ui-font-family-primary, \"Helvetica Neue\", Arial, sans-serif);\n}\n\n.b24ql-modal .b24ql-link-meta.ui-label,\n.b24ql-modal .b24ql-editor-meta.ui-label {\n  display: inline-flex;\n  width: fit-content;\n  max-width: 100%;\n  height: auto;\n  min-height: 18px;\n  border: 0;\n  border-radius: 3px;\n  background: var(--b24ql-badge-bg);\n  color: var(--b24ql-muted);\n}\n\n.b24ql-modal .b24ql-link-meta .ui-label-inner,\n.b24ql-modal .b24ql-editor-meta .ui-label-inner {\n  overflow: hidden;\n  padding: 1px 5px;\n  color: inherit;\n  font-size: 10px;\n  font-weight: 600;\n  line-height: 15px;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.b24ql-modal .b24ql-empty.ui-alert,\n.b24ql-modal .b24ql-template-error.ui-alert,\n.b24ql-modal .b24ql-editor-notice.ui-alert {\n  border: 1px solid var(--b24ql-border);\n  border-radius: 5px;\n  background: var(--b24ql-panel-2);\n  color: var(--b24ql-muted);\n}\n\n.b24ql-modal .b24ql-template-error.ui-alert,\n.b24ql-modal .b24ql-editor-notice.ui-alert-danger {\n  border-color: #d95762;\n  color: #e36d76;\n}\n\n.b24ql-modal .b24ql-editor-notice.ui-alert {\n  flex: 1 0 100%;\n  padding: 8px 10px;\n}\n\n.b24ql-modal .b24ql-section,\n.b24ql-modal .b24ql-settings-row,\n.b24ql-modal .b24ql-editor-row {\n  border-radius: 6px;\n}\n\n/* Keep the portal-style slider surface while opening the extension panel from below. */\n.b24ql-modal {\n  align-items: stretch;\n  justify-content: flex-end;\n  padding: 0;\n  background: rgba(6, 36, 79, .68);\n  backdrop-filter: none;\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"light\"] {\n  --b24ql-bg: #f5f8fb;\n  --b24ql-panel: #fff;\n  --b24ql-panel-2: #fff;\n  --b24ql-section-bg: #fff;\n  --b24ql-border: #dce3ea;\n  --b24ql-border-strong: #cbd5df;\n  --b24ql-text: #333b46;\n  --b24ql-muted: #838b96;\n  --b24ql-link-bg: #fff;\n}\n\n.b24ql-modal[data-b24ql-effective-theme=\"dark\"] {\n  --b24ql-bg: #222832;\n  --b24ql-panel: #2a313b;\n  --b24ql-panel-2: #2a313b;\n  --b24ql-section-bg: #2a313b;\n  --b24ql-border: #424a55;\n  --b24ql-border-strong: #596371;\n  --b24ql-link-bg: #2a313b;\n}\n\n.b24ql-modal .b24ql-panel {\n  display: flex;\n  flex-direction: column;\n  width: min(960px, calc(100vw - 48px));\n  height: 100%;\n  max-height: 100%;\n  border: 0;\n  border-radius: 0;\n  background: var(--b24ql-bg);\n  box-shadow: -12px 0 32px rgba(0, 0, 0, .2);\n}\n\n.b24ql-modal .b24ql-header {\n  flex: 0 0 auto;\n  min-height: 72px;\n  align-items: center;\n  padding: 18px 24px;\n  border-bottom: 1px solid var(--b24ql-border);\n  background: var(--b24ql-bg);\n}\n\n.b24ql-modal .b24ql-header h2 {\n  margin: 0;\n  font-size: 20px;\n  font-weight: 600;\n}\n\n.b24ql-modal .b24ql-header p {\n  display: none;\n}\n\n.b24ql-modal .b24ql-content {\n  flex: 1 1 auto;\n  min-height: 0;\n  max-height: none;\n  gap: 14px;\n  padding: 20px 24px 24px;\n  background: var(--b24ql-bg);\n}\n\n.b24ql-modal .b24ql-main-content {\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n\n.b24ql-modal .b24ql-submodal,\n.b24ql-modal .b24ql-settings-modal {\n  align-items: stretch;\n  justify-content: flex-end;\n  padding: 0;\n  background: rgba(6, 36, 79, .58);\n  backdrop-filter: none;\n}\n\n.b24ql-modal .b24ql-subpanel {\n  width: min(840px, calc(100vw - 76px));\n}\n\n.b24ql-modal .b24ql-settings-panel {\n  width: min(840px, calc(100vw - 76px));\n  height: 100%;\n  max-height: 100%;\n}\n\n.b24ql-modal .b24ql-subcontent {\n  max-height: none;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n\n.b24ql-modal .b24ql-template-modal {\n  backdrop-filter: none;\n}\n\n.b24ql-modal .b24ql-section {\n  border-color: var(--b24ql-border);\n  background: var(--b24ql-section-bg);\n}\n\n.b24ql-modal .b24ql-section-heading {\n  min-height: 44px;\n  padding: 0 14px;\n}\n\n.b24ql-modal .b24ql-section-heading h3 {\n  font-weight: 600;\n}\n\n.b24ql-modal .b24ql-section-dot {\n  display: none;\n}\n\n.b24ql-modal .b24ql-link-grid {\n  gap: 7px;\n  padding: 0 14px 14px;\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n\n.b24ql-modal .b24ql-favorite-toggle.ui-btn {\n  position: absolute;\n  top: 50%;\n  right: 8px;\n  width: 26px;\n  height: 26px;\n  min-height: 26px;\n  transform: translateY(-50%);\n}\n\n.b24ql-modal .b24ql-link.ui-btn {\n  min-height: 40px;\n  border: 1px solid var(--b24ql-border);\n  border-radius: 5px;\n  background: var(--b24ql-link-bg);\n  font-weight: 500;\n}\n\n.b24ql-modal .b24ql-link.ui-btn:hover,\n.b24ql-modal .b24ql-link.ui-btn:focus,\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-search-selected,\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-active {\n  border-color: #2fc6f6;\n  background: var(--b24ql-accent-soft);\n}\n\n.b24ql-modal .b24ql-link-active::after,\n.b24ql-modal .b24ql-link:active {\n  box-shadow: none;\n  transform: none;\n}\n\n.b24ql-modal .b24ql-editor-row,\n.b24ql-modal .b24ql-settings-row {\n  border-color: var(--b24ql-border);\n  background: var(--b24ql-section-bg);\n}\n\n.b24ql-modal .b24ql-settings-view:not(.b24ql-links-editor-view) {\n  align-content: start;\n  grid-auto-rows: max-content;\n}\n\n.b24ql-modal .b24ql-links-editor-list {\n  align-content: start;\n  grid-auto-rows: max-content;\n  background: var(--b24ql-bg);\n}\n\n@media (max-width: 700px) {\n  .b24ql-modal .b24ql-panel,\n  .b24ql-modal .b24ql-subpanel,\n  .b24ql-modal .b24ql-settings-panel {\n    width: 100vw;\n  }\n\n  .b24ql-modal .b24ql-content {\n    padding: 14px 16px 20px;\n  }\n}\n\n/* All extension surfaces rise from below while staying docked to the right. */\n@keyframes b24ql-slide-up {\n  from { transform: translateY(100vh); }\n  to { transform: translateY(0); }\n}\n\n.b24ql-modal {\n  --b24ql-accent: #2fc6f6;\n  align-items: stretch;\n  justify-content: flex-end;\n  padding: 0;\n  font-family: var(--ui-font-family-primary, \"Open Sans\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 400;\n}\n\n.b24ql-modal .b24ql-submodal,\n.b24ql-modal .b24ql-settings-modal {\n  align-items: stretch;\n  justify-content: flex-end;\n  padding: 0;\n}\n\n.b24ql-modal .b24ql-panel {\n  width: min(1020px, calc(100vw - 68px));\n  height: calc(100vh - 8px);\n  max-height: none;\n  margin: 8px 0 0;\n  overflow: visible;\n  border-radius: 14px 14px 0 0;\n  animation: b24ql-slide-up 260ms cubic-bezier(.2,.7,.2,1) both;\n}\n\n.b24ql-modal .b24ql-subpanel,\n.b24ql-modal .b24ql-settings-panel {\n  width: min(900px, calc(100vw - 96px));\n}\n\n.b24ql-modal .b24ql-header {\n  position: relative;\n  min-height: 76px;\n  border-radius: 14px 14px 0 0;\n}\n\n.b24ql-modal .b24ql-header h2 {\n  font-size: 22px;\n  font-weight: 500;\n}\n\n.b24ql-modal .b24ql-header-actions,\n.b24ql-modal .b24ql-subactions {\n  position: absolute;\n  top: 18px;\n  left: 0;\n  z-index: 3;\n  display: flex;\n  width: 44px;\n  align-items: stretch;\n  flex-direction: column;\n  gap: 7px;\n  transform: translateX(-100%);\n}\n\n.b24ql-modal .b24ql-header-actions > .ui-btn,\n.b24ql-modal .b24ql-subactions > .ui-btn {\n  margin-left: 0 !important;\n}\n\n.b24ql-modal .b24ql-header-actions .ui-btn,\n.b24ql-modal .b24ql-subactions .ui-btn,\n.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,\n.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {\n  width: 44px;\n  height: 36px;\n  min-width: 44px;\n  min-height: 36px;\n  border: 0;\n  border-radius: 9px 0 0 9px;\n  color: #fff;\n  background: #1ba9e5;\n}\n\n.b24ql-modal .b24ql-header-actions .ui-btn:hover,\n.b24ql-modal .b24ql-subactions .ui-btn:hover,\n.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn:hover,\n.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn:hover {\n  color: #fff;\n  background: #168fc7;\n}\n\n.b24ql-modal .b24ql-header-actions svg,\n.b24ql-modal .b24ql-subactions svg,\n.b24ql-modal .b24ql-template-header .b24ql-close svg,\n.b24ql-modal .b24ql-confirm-header .b24ql-close svg {\n  width: 18px;\n  height: 18px;\n}\n\n.b24ql-modal:has(> .b24ql-submodal:not(.b24ql-hidden)) > .b24ql-panel .b24ql-header-actions,\n.b24ql-modal:has(> .b24ql-settings-modal:not(.b24ql-hidden)) > .b24ql-panel .b24ql-header-actions,\n.b24ql-modal:has(> .b24ql-template-modal:not(.b24ql-hidden)) > .b24ql-panel .b24ql-header-actions,\n.b24ql-modal:has(> .b24ql-confirm-modal) > .b24ql-panel .b24ql-header-actions,\n.b24ql-modal:has(> .b24ql-template-modal:not(.b24ql-hidden)) .b24ql-subactions,\n.b24ql-modal:has(> .b24ql-confirm-modal) .b24ql-subactions,\n.b24ql-modal:has(> .b24ql-confirm-modal) .b24ql-template-header .b24ql-close {\n  visibility: hidden;\n}\n\n.b24ql-modal .b24ql-section-heading h3,\n.b24ql-modal .b24ql-settings-row-title {\n  font-size: 15px;\n  font-weight: 600;\n}\n\n.b24ql-modal .b24ql-link.ui-btn {\n  min-height: 46px;\n  border-color: var(--b24ql-accent);\n  font-size: 15px;\n  font-weight: 400;\n}\n\n.b24ql-modal .b24ql-ui-action.ui-btn-light-border:not(:disabled),\n.b24ql-modal .b24ql-editor-small-button.ui-btn-light-border:not(:disabled) {\n  border-color: var(--b24ql-accent);\n}\n\n.b24ql-modal .b24ql-ui-action.ui-btn-light-border:not(:disabled):hover,\n.b24ql-modal .b24ql-editor-small-button.ui-btn-light-border:not(:disabled):hover {\n  background: var(--b24ql-accent-soft);\n}\n\n.b24ql-modal .b24ql-links-editor-actions {\n  justify-content: space-between;\n  gap: 10px 16px;\n  padding-top: 12px;\n}\n\n.b24ql-modal .b24ql-editor-actions-tools,\n.b24ql-modal .b24ql-editor-actions-commit {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: 6px;\n}\n\n.b24ql-modal .b24ql-editor-actions-commit {\n  margin-left: auto;\n}\n\n.b24ql-modal .b24ql-editor-row {\n  grid-template-columns: minmax(0, 1fr);\n  gap: 10px;\n  padding: 12px;\n}\n\n.b24ql-modal .b24ql-editor-fields {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  align-items: center;\n}\n\n.b24ql-modal .b24ql-editor-row-actions {\n  justify-content: flex-end;\n  padding-top: 10px;\n  border-top: 1px solid var(--b24ql-border);\n}\n\n.b24ql-modal .b24ql-editor-input.ui-ctl-element {\n  font-family: inherit;\n  font-size: 14px;\n  font-weight: 400;\n}\n\n/* Real radio controls for theme and native-style switches for binary settings. */\n.b24ql-modal .b24ql-radio-group {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 18px;\n  margin: 0;\n  padding: 0;\n  border: 0;\n}\n\n.b24ql-modal .b24ql-radio-option,\n.b24ql-modal .b24ql-switch-option {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  color: var(--b24ql-text);\n  cursor: pointer;\n  font-size: 14px;\n  font-weight: 400;\n  white-space: nowrap;\n}\n\n.b24ql-modal .b24ql-radio-option input {\n  position: relative;\n  width: 18px;\n  height: 18px;\n  margin: 0;\n  border: 2px solid var(--b24ql-border-strong);\n  border-radius: 50%;\n  background: var(--b24ql-panel);\n  cursor: pointer;\n  appearance: none;\n}\n\n.b24ql-modal .b24ql-radio-option input:checked {\n  border-color: var(--b24ql-accent);\n}\n\n.b24ql-modal .b24ql-radio-option input:checked::after {\n  position: absolute;\n  inset: 4px;\n  border-radius: 50%;\n  background: var(--b24ql-accent);\n  content: \"\";\n}\n\n.b24ql-modal .b24ql-radio-option input:focus-visible,\n.b24ql-modal .b24ql-switch-option input:focus-visible + .b24ql-switch-track {\n  outline: 2px solid var(--b24ql-accent);\n  outline-offset: 2px;\n}\n\n.b24ql-modal .b24ql-switch-option {\n  position: relative;\n}\n\n.b24ql-modal .b24ql-switch-option input {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  opacity: 0;\n}\n\n.b24ql-modal .b24ql-switch-track {\n  position: relative;\n  width: 54px;\n  height: 22px;\n  border-radius: 12px;\n  background: #d8dee5;\n  transition: background 150ms ease;\n}\n\n.b24ql-modal .b24ql-switch-track::before {\n  position: absolute;\n  top: 5px;\n  left: 19px;\n  color: #8b98a6;\n  content: \"ВЫКЛ\";\n  font-size: 8px;\n  line-height: 12px;\n}\n\n.b24ql-modal .b24ql-switch-track::after {\n  position: absolute;\n  top: 3px;\n  left: 3px;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background: #fff;\n  content: \"\";\n  transition: transform 150ms ease;\n}\n\n.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track {\n  background: #1ba9e5;\n}\n\n.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::before {\n  left: 8px;\n  color: #fff;\n  content: \"ВКЛ\";\n}\n\n.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::after {\n  transform: translateX(32px);\n}\n\n.b24ql-modal .b24ql-switch-caption {\n  min-width: 90px;\n  color: var(--b24ql-muted);\n  font-size: 13px;\n}\n\n.b24ql-modal .b24ql-template-modal,\n.b24ql-modal .b24ql-confirm-modal {\n  align-items: stretch;\n  justify-content: flex-end;\n  padding: 0;\n  background: rgba(6, 36, 79, .58);\n  backdrop-filter: none;\n}\n\n.b24ql-modal .b24ql-template-panel,\n.b24ql-modal .b24ql-confirm-panel {\n  position: relative;\n  width: min(500px, calc(100vw - 96px));\n  height: calc(100vh - 8px);\n  max-height: none;\n  margin: 8px 0 0;\n  padding: 0;\n  overflow: visible;\n  border: 0;\n  border-radius: 14px 14px 0 0;\n  background: var(--b24ql-bg);\n  animation: b24ql-slide-up 260ms cubic-bezier(.2,.7,.2,1) both;\n}\n\n.b24ql-modal .b24ql-template-header,\n.b24ql-modal .b24ql-confirm-header {\n  position: relative;\n  min-height: 76px;\n  padding: 24px;\n  border-bottom: 1px solid var(--b24ql-border);\n  border-radius: 14px 14px 0 0;\n  background: var(--b24ql-bg);\n}\n\n.b24ql-modal .b24ql-template-header h2,\n.b24ql-modal .b24ql-confirm-header h2 {\n  margin: 0;\n  color: var(--b24ql-text);\n  font-size: 22px;\n  font-weight: 500;\n}\n\n.b24ql-modal .b24ql-template-header .b24ql-close,\n.b24ql-modal .b24ql-confirm-header .b24ql-close {\n  position: absolute;\n  top: 18px;\n  left: -44px;\n}\n\n.b24ql-modal .b24ql-template-form {\n  align-content: start;\n  overflow: auto;\n  padding: 24px;\n}\n\n.b24ql-modal .b24ql-confirm-message {\n  padding: 24px 24px 0;\n}\n\n.b24ql-modal .b24ql-confirm-actions {\n  padding: 0 24px;\n}\n\n@media (max-width: 700px) {\n  .b24ql-modal .b24ql-panel,\n  .b24ql-modal .b24ql-subpanel,\n  .b24ql-modal .b24ql-settings-panel,\n  .b24ql-modal .b24ql-template-panel,\n  .b24ql-modal .b24ql-confirm-panel {\n    width: 100vw;\n    height: 100vh;\n    margin: 0;\n    border-radius: 0;\n  }\n\n  .b24ql-modal .b24ql-header-actions,\n  .b24ql-modal .b24ql-subactions {\n    top: 18px;\n    right: 16px;\n    left: auto;\n    width: auto;\n    align-items: center;\n    flex-direction: row;\n    transform: none;\n  }\n\n  .b24ql-modal .b24ql-template-header .b24ql-close,\n  .b24ql-modal .b24ql-confirm-header .b24ql-close {\n    position: static;\n  }\n\n  .b24ql-modal .b24ql-header-actions .ui-btn,\n  .b24ql-modal .b24ql-subactions .ui-btn,\n  .b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,\n  .b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {\n    width: 36px;\n    min-width: 36px;\n    border-radius: 6px;\n  }\n\n  .b24ql-modal .b24ql-editor-fields {\n    grid-template-columns: minmax(0, 1fr);\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .b24ql-modal .b24ql-panel,\n  .b24ql-modal .b24ql-template-panel,\n  .b24ql-modal .b24ql-confirm-panel {\n    animation-duration: 1ms;\n  }\n}\n\n\n/* safari-userscripts-overrides */\n\n.b24ql-modal .b24ql-link.ui-btn {\n  box-sizing: border-box !important;\n  position: relative !important;\n  display: flex !important;\n  width: 100% !important;\n  height: auto !important;\n  min-height: 46px !important;\n  margin: 0 !important;\n  padding: 9px 42px 9px 12px !important;\n  border: 1px solid var(--b24ql-accent) !important;\n  border-radius: 5px !important;\n  background: var(--b24ql-link-bg) !important;\n  color: var(--b24ql-text) !important;\n  font: 400 15px/1.25 var(--ui-font-family-primary, \"Helvetica Neue\", Arial, sans-serif) !important;\n  justify-content: flex-start !important;\n  text-align: left !important;\n  text-transform: none !important;\n  white-space: normal !important;\n}\n\n.b24ql-modal .b24ql-link.ui-btn:hover,\n.b24ql-modal .b24ql-link.ui-btn:focus,\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-search-selected,\n.b24ql-modal .b24ql-link.ui-btn.b24ql-link-active {\n  border-color: var(--b24ql-accent) !important;\n  background: var(--b24ql-accent-soft) !important;\n}\n\n.b24ql-modal button.b24ql-close.ui-btn,\n.b24ql-modal button.b24ql-settings-open.ui-btn,\n.b24ql-modal button.b24ql-section-toggle.ui-btn,\n.b24ql-modal button.b24ql-section-open-all.ui-btn,\n.b24ql-modal button.b24ql-favorite-toggle.ui-btn {\n  box-sizing: border-box !important;\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  text-align: center !important;\n  text-transform: none !important;\n  flex-shrink: 0 !important;\n}\n\n.b24ql-modal button.b24ql-close.ui-btn::before,\n.b24ql-modal button.b24ql-close.ui-btn::after,\n.b24ql-modal button.b24ql-settings-open.ui-btn::before,\n.b24ql-modal button.b24ql-settings-open.ui-btn::after,\n.b24ql-modal button.b24ql-section-toggle.ui-btn::before,\n.b24ql-modal button.b24ql-section-toggle.ui-btn::after,\n.b24ql-modal button.b24ql-section-open-all.ui-btn::before,\n.b24ql-modal button.b24ql-section-open-all.ui-btn::after,\n.b24ql-modal button.b24ql-favorite-toggle.ui-btn::before,\n.b24ql-modal button.b24ql-favorite-toggle.ui-btn::after {\n  content: none !important;\n  display: none !important;\n}\n\n.b24ql-modal .b24ql-header-actions,\n.b24ql-modal .b24ql-subactions {\n  position: absolute !important;\n  top: 18px !important;\n  right: auto !important;\n  left: 0 !important;\n  z-index: 3 !important;\n  display: flex !important;\n  width: 44px !important;\n  align-items: stretch !important;\n  flex-direction: column !important;\n  gap: 7px !important;\n  transform: translateX(-100%) !important;\n}\n\n.b24ql-modal .b24ql-header-actions .ui-btn,\n.b24ql-modal .b24ql-subactions .ui-btn,\n.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,\n.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {\n  width: 44px !important;\n  min-width: 44px !important;\n  max-width: 44px !important;\n  height: 36px !important;\n  min-height: 36px !important;\n  max-height: 36px !important;\n  border: 0 !important;\n  border-radius: 9px 0 0 9px !important;\n  background: #1ba9e5 !important;\n  color: #fff !important;\n  line-height: 36px !important;\n}\n\n.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,\n.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {\n  position: absolute !important;\n  top: 18px !important;\n  right: auto !important;\n  bottom: auto !important;\n  left: -44px !important;\n}\n\n.b24ql-modal .b24ql-template-panel,\n.b24ql-modal .b24ql-template-form,\n.b24ql-modal .b24ql-template-fields,\n.b24ql-modal .b24ql-template-field,\n.b24ql-modal .b24ql-template-input,\n.b24ql-modal .b24ql-template-actions {\n  box-sizing: border-box !important;\n  min-width: 0 !important;\n}\n\n.b24ql-modal .b24ql-template-form {\n  width: 100% !important;\n  padding: 24px !important;\n}\n\n.b24ql-modal .b24ql-template-fields,\n.b24ql-modal .b24ql-template-field,\n.b24ql-modal .b24ql-template-input,\n.b24ql-modal .b24ql-template-actions {\n  width: 100% !important;\n}\n\n.b24ql-modal .b24ql-template-actions {\n  flex-wrap: wrap !important;\n}\n\n.b24ql-modal .b24ql-switch-track {\n  box-sizing: border-box !important;\n  display: inline-block !important;\n  width: 54px !important;\n  min-width: 54px !important;\n  max-width: 54px !important;\n  height: 22px !important;\n  min-height: 22px !important;\n  max-height: 22px !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  border-radius: 12px !important;\n  line-height: normal !important;\n  flex: 0 0 54px !important;\n}\n\n.b24ql-modal label.b24ql-switch-option > .b24ql-switch-track::before {\n  box-sizing: border-box !important;\n  display: block !important;\n  top: 5px !important;\n  left: 19px !important;\n  width: auto !important;\n  height: 12px !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  font-family: var(--ui-font-family-primary, \"Helvetica Neue\", Arial, sans-serif) !important;\n  font-size: 8px !important;\n  font-style: normal !important;\n  font-weight: 400 !important;\n  line-height: 12px !important;\n  letter-spacing: 0 !important;\n  text-transform: none !important;\n  transform: none !important;\n}\n\n.b24ql-modal label.b24ql-switch-option > .b24ql-switch-track::after {\n  box-sizing: border-box !important;\n  display: block !important;\n  top: 3px !important;\n  left: 3px !important;\n  width: 16px !important;\n  height: 16px !important;\n  margin: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n}\n\n.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::before {\n  left: 8px !important;\n}\n\n.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::after {\n  transform: translateX(32px) !important;\n}\n\n.b24ql-modal .b24ql-header-actions .ui-btn:hover,\n.b24ql-modal .b24ql-subactions .ui-btn:hover,\n.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn:hover,\n.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn:hover {\n  background: #168fc7 !important;\n  color: #fff !important;\n}\n\n.b24ql-modal .b24ql-header-actions svg,\n.b24ql-modal .b24ql-subactions svg,\n.b24ql-modal .b24ql-template-header .b24ql-close svg,\n.b24ql-modal .b24ql-confirm-header .b24ql-close svg {\n  display: block !important;\n  width: 18px !important;\n  min-width: 18px !important;\n  max-width: 18px !important;\n  height: 18px !important;\n  min-height: 18px !important;\n  max-height: 18px !important;\n  flex: 0 0 18px !important;\n}\n\n.b24ql-modal button.b24ql-section-toggle.ui-btn,\n.b24ql-modal button.b24ql-section-open-all.ui-btn {\n  width: 24px !important;\n  min-width: 24px !important;\n  max-width: 24px !important;\n  height: 24px !important;\n  min-height: 24px !important;\n  max-height: 24px !important;\n  border: 0 !important;\n  border-radius: 6px !important;\n  background: transparent !important;\n  color: var(--b24ql-control) !important;\n  line-height: 24px !important;\n}\n\n/* Safari loads Bitrix button styles after the userscript. Keep disabled\n * section actions hidden even though their base button rule uses !important. */\n.b24ql-modal button.b24ql-section-open-all.ui-btn.b24ql-hidden {\n  display: none !important;\n}\n\n.b24ql-modal .b24ql-section-open-all-icon {\n  display: block !important;\n  width: 17px !important;\n  min-width: 17px !important;\n  max-width: 17px !important;\n  height: 17px !important;\n  min-height: 17px !important;\n  max-height: 17px !important;\n  flex: 0 0 17px !important;\n}\n\n.b24ql-modal .b24ql-section-toggle-icon {\n  display: block !important;\n  width: 0 !important;\n  min-width: 0 !important;\n  max-width: 0 !important;\n  height: 0 !important;\n  min-height: 0 !important;\n  max-height: 0 !important;\n  border-right: 5px solid transparent !important;\n  border-bottom: 0 !important;\n  border-left: 5px solid transparent !important;\n  border-top: 6px solid currentColor !important;\n  background: transparent !important;\n}\n\n.b24ql-modal button.b24ql-favorite-toggle.ui-btn {\n  position: absolute !important;\n  z-index: 2 !important;\n  top: 50% !important;\n  right: 8px !important;\n  bottom: auto !important;\n  left: auto !important;\n  width: 26px !important;\n  min-width: 26px !important;\n  max-width: 26px !important;\n  height: 26px !important;\n  min-height: 26px !important;\n  max-height: 26px !important;\n  border: 0 !important;\n  border-radius: 6px !important;\n  background: transparent !important;\n  color: var(--b24ql-muted) !important;\n  line-height: 26px !important;\n  transform: translateY(-50%) !important;\n}\n\n.b24ql-modal button.b24ql-favorite-toggle.ui-btn.b24ql-favorite-active {\n  color: var(--b24ql-accent) !important;\n}\n\n.b24ql-modal .b24ql-favorite-toggle.ui-btn svg {\n  display: block !important;\n  width: 17px !important;\n  min-width: 17px !important;\n  max-width: 17px !important;\n  height: 17px !important;\n  min-height: 17px !important;\n  max-height: 17px !important;\n  flex: 0 0 17px !important;\n}\n\n@media (max-width: 700px) {\n  .b24ql-modal .b24ql-header-actions,\n  .b24ql-modal .b24ql-subactions {\n    top: 18px !important;\n    right: 16px !important;\n    left: auto !important;\n    width: auto !important;\n    align-items: center !important;\n    flex-direction: row !important;\n    transform: none !important;\n  }\n\n  .b24ql-modal .b24ql-template-header .b24ql-close,\n  .b24ql-modal .b24ql-confirm-header .b24ql-close {\n    position: static !important;\n  }\n\n  .b24ql-modal .b24ql-header-actions .ui-btn,\n  .b24ql-modal .b24ql-subactions .ui-btn,\n  .b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,\n  .b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {\n    width: 36px !important;\n    min-width: 36px !important;\n    max-width: 36px !important;\n    border-radius: 6px !important;\n  }\n}\n";
  Promise.resolve(GM.addStyle(styles)).catch(function (error) {
    console.warn("B24 Quick Links: styles could not be added.", error);
  });

  function normalizeKeys(keys) {
    if (Array.isArray(keys)) {
      return keys;
    }
    if (typeof keys === "string") {
      return [keys];
    }
    if (keys && typeof keys === "object") {
      return Object.keys(keys);
    }
    return [];
  }

  const userscriptsChrome = {
    storage: {
      local: {
        get: function (keys, callback) {
          const defaults = keys && !Array.isArray(keys) && typeof keys === "object" ? keys : {};
          Promise.all(normalizeKeys(keys).map(async function (key) {
            return [key, await GM.getValue(key, defaults[key])];
          })).then(function (entries) {
            const values = {};
            entries.forEach(function (entry) {
              if (entry[1] !== undefined) {
                values[entry[0]] = entry[1];
              }
            });
            callback(values);
          }).catch(function (error) {
            console.warn("B24 Quick Links: storage read failed.", error);
            callback({});
          });
        },
        set: function (values, callback) {
          Promise.all(Object.keys(values || {}).map(function (key) {
            return GM.setValue(key, values[key]);
          })).then(function () {
            if (typeof callback === "function") {
              callback();
            }
          }).catch(function (error) {
            console.warn("B24 Quick Links: storage write failed.", error);
            if (typeof callback === "function") {
              callback();
            }
          });
        }
      }
    },
    runtime: {
      sendMessage: function (message, callback) {
        const task = (async function () {
          if (!message || (message.type !== "b24ql-open-tab" && message.type !== "b24ql-open-tabs")) {
            return { ok: false, count: 0 };
          }

          const urls = message.type === "b24ql-open-tabs" ? message.urls : [message.url];
          let opened = 0;
          for (const url of urls || []) {
            if (typeof url !== "string" || !url.toLowerCase().startsWith("https://")) {
              continue;
            }
            try {
              await GM.openInTab(url, message.type === "b24ql-open-tabs");
              opened += 1;
            } catch (error) {
              return { ok: false, count: opened };
            }
          }
          return { ok: opened > 0, count: opened };
        })();

        task.then(function (result) {
          if (typeof callback === "function") {
            callback(result);
          }
        }).catch(function (error) {
          console.warn("B24 Quick Links: tab opening failed.", error);
          if (typeof callback === "function") {
            callback({ ok: false, count: 0 });
          }
        });
      }
    }
  };

  const chrome = userscriptsChrome;

  const __B24QL_SAFARI_RUNTIME__ = true;
  globalThis.B24QL_RUNTIME_OPTIONS = Object.freeze({
    destroyModalOnClose: true,
    leanLayoutWatcher: true
  });
  console.info("B24 Quick Links: Safari runtime 1.0.4 enabled");

(function (root) {
  "use strict";

  /*
   * Файл настроек расширения.
   *
   * Здесь хранятся стартовые порталы, блоки, кнопки и свернутые по умолчанию разделы.
   * Обычные правки ссылок можно делать в интерфейсе расширения:
   * шестеренка -> Редактор ссылок.
   *
   * Правки из интерфейса сохраняются в браузере пользователя и не меняют этот файл.
   * Этот файл нужен как базовый шаблон для новой установки или сброса пользовательских
   * данных браузера.
   *
   * Рабочая логика расширения лежит в content.js и background.js; туда обычно
   * нужно лезть только при изменении поведения кнопки, окна или перетаскивания.
   */

  /*
   * Порталы Bitrix24, на которых должно работать расширение.
   * Если добавляете новый портал:
   * 1. Добавьте домен в portalHosts.
   * 2. Добавьте такой же URL-шаблон в manifest.json -> content_scripts -> matches.
   * 3. Пересоберите ZIP-архив расширения.
   */
  const portalHosts = [
    "bitrix24.ostec-group.ru",
    "bitrix24test.ostec-group.ru",
    "bitrix24develop.ostec-group.ru",
    "bitrix24.selectica.ru",
    "bitrix24test.selectica.ru",
    "bitrix24develop.selectica.ru"
  ];

  /*
   * Базовый портал для хранения ссылок ниже.
   * При клике расширение автоматически заменит этот домен на текущий портал:
   * prod -> prod, test -> test, develop -> develop.
   */
  const defaultPortalHost = "bitrix24.ostec-group.ru";

  /*
   * Разделы, которые при первом открытии окна будут свернуты.
   * true = свернут по умолчанию.
   * Название должно совпадать с title нужного блока в sections.
   * Пользователь может переопределить это через шестеренку -> Состояние блоков.
   */
  const defaultCollapsedSections = {
    "Настройка CRM": true,
    "Сотрудники": true,
    "Локальные приложения": true
  };

  /*
   * Блоки, где при первом запуске показывается кнопка "открыть весь блок".
   * true = показывать кнопку по умолчанию.
   * Пользователь может переопределить это через шестеренку в окне расширения.
   */
  const defaultOpenAllSections = {};

  /*
   * Вложенное окно CRM -> Сделки.
   * Чтобы переименовать кнопку, меняйте title.
   * Чтобы изменить адрес, меняйте url.
   */
  const dealLinks = [
    {
      title: "Продажи",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/0/"
    },
    {
      title: "Реализация",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/1/"
    },
    {
      title: "Закупки",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/2/"
    },
    {
      title: "Консолидаторы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/12/"
    },
    {
      title: "Сервис ЗИП",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/4/"
    },
    {
      title: "Сервис Работы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/5/"
    },
    {
      title: "Обучение и консалтинг",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/14/"
    },
    {
      title: "Неком. расходы/доходы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/7/"
    }
  ];

  /* Вложенное окно CRM -> Клиенты. */
  const clientLinks = [
    {
      title: "Контакт",
      keywords: ["Контакты", "клиент", "физлицо"],
      url: "https://bitrix24.ostec-group.ru/crm/contact/list/"
    },
    {
      title: "Компания",
      keywords: ["Компании", "клиент", "контрагент", "юрлицо"],
      url: "https://bitrix24.ostec-group.ru/crm/company/list/"
    }
  ];

  /* Вложенное окно CRM -> Смарт-процессы. */
  const smartProcessLinks = [
    {
      title: "Отгрузки",
      url: "https://bitrix24.ostec-group.ru/crm/type/162/list/category/0/"
    },
    {
      title: "Оборудование",
      url: "https://bitrix24.ostec-group.ru/crm/type/142/list/category/0/"
    },
    {
      title: "Сервис Деск",
      url: "https://bitrix24.ostec-group.ru/crm/type/188/list/category/0/"
    },
    {
      title: "Задания инженерам",
      url: "https://bitrix24.ostec-group.ru/crm/type/163/list/category/0/"
    },
    {
      title: "Договоры",
      url: "https://bitrix24.ostec-group.ru/crm/type/167/list/category/0/"
    },
    {
      title: "Конкурсы",
      url: "https://bitrix24.ostec-group.ru/crm/type/146/list/category/0/"
    },
    {
      title: "Обеспечения",
      url: "https://bitrix24.ostec-group.ru/crm/type/144/list/category/0/"
    },
    {
      title: "Мероприятия",
      url: "https://bitrix24.ostec-group.ru/crm/type/189/list/category/0/"
    },
    {
      title: "Траки",
      url: "https://bitrix24.ostec-group.ru/crm/type/180/kanban/category/0/"
    },
    {
      title: "Грузовые места",
      url: "https://bitrix24.ostec-group.ru/crm/type/190/list/category/0/"
    },
    {
      title: "Шаблоны конфигураций",
      url: "https://bitrix24.ostec-group.ru/crm/type/172/list/category/0/"
    },
    {
      title: "Конфигурации",
      url: "https://bitrix24.ostec-group.ru/crm/type/165/list/category/0/"
    },
    {
      title: "Разрешительные документы",
      url: "https://bitrix24.ostec-group.ru/crm/type/1036/kanban/category/0/"
    },
    {
      title: "Реализация проектов",
      url: "https://bitrix24.ostec-group.ru/crm/type/1040/kanban/category/0/"
    },
    {
      title: "Управление качеством",
      url: "https://bitrix24.ostec-group.ru/crm/type/1050/list/category/0/"
    },
    {
      title: "Внутренняя документация",
      url: "https://bitrix24.ostec-group.ru/crm/type/1056/list/category/0/"
    },
    {
      title: "Файлы",
      url: "https://bitrix24.ostec-group.ru/crm/type/159/list/category/0/"
    },
    {
      title: "Кадровые документы",
      url: "https://bitrix24.ostec-group.ru/crm/type/186/list/category/0/"
    },
    {
      title: "Обученные лица",
      url: "https://bitrix24.ostec-group.ru/crm/type/181/list/category/0/"
    },
    {
      title: "Пользователи МП",
      url: "https://bitrix24.ostec-group.ru/crm/type/151/kanban/category/0/"
    },
    {
      title: "Горыныч",
      url: "https://bitrix24.ostec-group.ru/crm/type/1062/kanban/category/0/"
    }
  ];

  /*
   * Шаблонные переходы запрашивают ID и подставляют его вместо {id}.
   * У смарт-процессов тип берется из уже настроенных ссылок выше, поэтому
   * пользователь выбирает процесс по названию и вводит только ID элемента.
   */
  function createIdTemplate(title, url, fieldLabel, keywords) {
    return {
      title: title,
      keywords: keywords || [],
      template: {
        url: url,
        fields: [
          {
            key: "id",
            label: fieldLabel,
            placeholder: "Например, 1254",
            inputMode: "numeric"
          }
        ]
      }
    };
  }

  const smartProcessTemplateLinks = smartProcessLinks.map(function (link) {
    const typeMatch = link.url.match(/\/crm\/type\/(\d+)\//);
    return createIdTemplate(
      link.title,
      "https://bitrix24.ostec-group.ru/crm/type/" + typeMatch[1] + "/details/{id}/",
      "ID элемента «" + link.title + "»",
      ["смарт-процесс", "элемент", "по ID"]
    );
  });

  const quickOpenLinks = [
    createIdTemplate(
      "Сделка",
      "https://bitrix24.ostec-group.ru/crm/deal/details/{id}/",
      "ID сделки",
      ["сделки", "CRM", "по ID"]
    ),
    createIdTemplate(
      "Счет",
      "https://bitrix24.ostec-group.ru/crm/type/31/details/{id}/",
      "ID счета",
      ["счета", "CRM", "по ID"]
    ),
    createIdTemplate(
      "Задача",
      "https://bitrix24.ostec-group.ru/company/personal/user/0/tasks/task/view/{id}/",
      "ID задачи",
      ["задачи", "проекты", "по ID"]
    ),
    {
      title: "Смарт-процессы",
      keywords: ["смарт", "SPA", "по ID"],
      links: smartProcessTemplateLinks
    }
  ];

  /*
   * Основные блоки окна "Быстрые ссылки".
   *
   * Простой пункт:
   *   { title: "Название кнопки", url: "https://..." }
   *
   * Пункт с вложенным окном:
   *   { title: "Название кнопки", links: массивСсылок }
   *
   * Порядок элементов в массиве = порядок кнопок в интерфейсе.
   * Сетка сейчас раскладывает кнопки по 4 в строку.
   */
  const sections = [
    {
      title: "Открыть по ID",
      links: quickOpenLinks
    },
    {
      title: "Проекты",
      links: [
        {
          title: "ОТС НПП",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/1023/tasks/"
        },
        {
          title: "Техподдержка Б24",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/972/tasks/"
        },
        {
          title: "Цифровизация БП",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/16/tasks/"
        },
        {
          title: "B24.Update",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/218/tasks/"
        }
      ]
    },
    {
      title: "CRM",
      links: [
        {
          title: "Лиды",
          url: "https://bitrix24.ostec-group.ru/crm/lead/kanban/"
        },
        {
          title: "Сделки",
          keywords: ["сделка", "воронки", "продажи"],
          links: dealLinks
        },
        {
          title: "Клиенты",
          keywords: ["контакты", "компании", "контрагенты"],
          links: clientLinks
        },
        {
          title: "Смарт-процессы",
          keywords: ["смарт", "SPA", "динамические сущности"],
          links: smartProcessLinks
        },
        {
          title: "Счета",
          url: "https://bitrix24.ostec-group.ru/crm/type/31/kanban/category/2/"
        },
        {
          title: "Предложения",
          url: "https://bitrix24.ostec-group.ru/crm/quote/kanban/"
        },
        {
          title: "CRM-формы",
          url: "https://bitrix24.ostec-group.ru/crm/webform/"
        },
        {
          title: "Каталог товаров",
          url: "https://bitrix24.ostec-group.ru/crm/catalog/"
        }
      ]
    },
    {
      title: "Настройка CRM",
      links: [
        {
          title: "Настройка CRM",
          url: "https://bitrix24.ostec-group.ru/crm/configs/"
        },
        {
          title: "ПД CRM",
          url: "https://bitrix24.ostec-group.ru/crm/perms/all/"
        },
        {
          title: "ПД Каталог товаров",
          url: "https://bitrix24.ostec-group.ru/shop/settings/permissions/"
        },
        {
          title: "ПД к документам CRM",
          url: "https://bitrix24.ostec-group.ru/bitrix/components/bitrix/documentgenerator.settings.perms/slider.php"
        },
        {
          title: "БП CRM",
          url: "https://bitrix24.ostec-group.ru/crm/configs/bp/"
        },
        {
          title: "БП Лента",
          url: "https://bitrix24.ostec-group.ru/bizproc/processes/"
        },
        {
          title: "Разработчикам",
          url: "https://bitrix24.ostec-group.ru/devops/"
        }
      ]
    },
    {
      title: "Сотрудники",
      links: [
        {
          title: "Сотрудники",
          url: "https://bitrix24.ostec-group.ru/company/"
        },
        {
          title: "Структура компании",
          url: "https://bitrix24.ostec-group.ru/hr/structure/"
        },
        {
          title: "График отсутствий",
          url: "https://bitrix24.ostec-group.ru/timeman/"
        },
        {
          title: "Видеоконференции",
          url: "https://bitrix24.ostec-group.ru/conference/"
        }
      ]
    },
    {
      title: "Локальные приложения",
      links: [
        {
          title: "Поездки и расходы",
          url: "https://bitrix24.ostec-group.ru/absences/work/"
        },
        {
          title: "Реестр отпусков",
          url: "https://bitrix24.ostec-group.ru/services/lists/99/view/0/"
        },
        {
          title: "Отчеты",
          url: "https://bitrix24.ostec-group.ru/marketplace/app/53/"
        },
        {
          title: "Финансы",
          url: "https://bitrix24.ostec-group.ru/finance/"
        }
      ]
    }
  ];

  const exportedSettings = {
    portalHosts: portalHosts,
    defaultPortalHost: defaultPortalHost,
    defaultCollapsedSections: defaultCollapsedSections,
    defaultOpenAllSections: defaultOpenAllSections,
    sections: sections
  };

  /* Firefox может разделять globalThis и window в контексте расширения. */
  root.B24QL_SETTINGS = exportedSettings;
  if (typeof window !== "undefined") {
    window.B24QL_SETTINGS = exportedSettings;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);


(function () {
  "use strict";

  if (window.__b24QuickLinksInstalled) {
    return;
  }
  window.__b24QuickLinksInstalled = true;

  /* Постоянные идентификаторы и ключи хранилища для кнопки, окон и сохраненных настроек. */
  const BUTTON_ID = "b24ql-menu-button";
  const MENU_ITEM_ID = "b24ql-menu-item";
  const MODAL_ID = "b24ql-modal";
  const SUBMODAL_ID = "b24ql-submodal";
  const SETTINGS_MODAL_ID = "b24ql-settings-modal";
  const CONFIRM_MODAL_ID = "b24ql-confirm-modal";
  const SEARCH_INPUT_ID = "b24ql-search";
  const SUBSEARCH_INPUT_ID = "b24ql-subsearch";
  const STORAGE_KEY = "b24ql-menu-position";
  const COLLAPSED_SECTIONS_KEY = "b24ql-collapsed-sections";
  const THEME_KEY = "b24ql-theme-v2";
  const FAVORITE_LINKS_KEY = "b24ql-favorite-links-v1";
  const OPEN_ALL_SECTIONS_KEY = "b24ql-open-all-sections-v1";
  const CUSTOM_SECTIONS_KEY = "b24ql-custom-sections-v1";
  const CONFIG_SCHEMA_KEY = "b24ql-config-schema-v1";
  const CONFIG_SCHEMA_VERSION = 4;
  const TEMPLATE_MODAL_ID = "b24ql-template-modal";
  const POSITION_SCHEMA_VERSION = 5;
  const LEFT_MENU_SELECTORS = [
    "#left-menu .menu-items",
    ".menu-items",
    "#left-menu-list",
    "#bx_left_menu_menu_container",
    "[data-role='left-menu']",
    ".menu-items-block",
    ".menu-items-body-inner",
    ".intranet-left-menu",
    ".bitrix24-left-menu"
  ];
  const LEFT_MENU_SELECTOR = LEFT_MENU_SELECTORS.join(",");
  const PERSISTENT_STORAGE_KEYS = [
    STORAGE_KEY,
    COLLAPSED_SECTIONS_KEY,
    THEME_KEY,
    FAVORITE_LINKS_KEY,
    OPEN_ALL_SECTIONS_KEY,
    CUSTOM_SECTIONS_KEY,
    CONFIG_SCHEMA_KEY
  ];

  /* Настройки ссылок, порталов и свернутых блоков берутся из settings.js. */
  const settings = (typeof globalThis !== "undefined" && globalThis.B24QL_SETTINGS)
    || window.B24QL_SETTINGS
    || {};
  const runtimeOptions = (typeof globalThis !== "undefined" && globalThis.B24QL_RUNTIME_OPTIONS)
    || {};
  const isSafariUserscriptRuntime = typeof __B24QL_SAFARI_RUNTIME__ !== "undefined"
    && __B24QL_SAFARI_RUNTIME__ === true;
  const PORTAL_HOSTS = Array.isArray(settings.portalHosts) ? settings.portalHosts : [];
  const PRODUCTION_PORTAL_HOST = settings.defaultPortalHost || PORTAL_HOSTS[0] || window.location.hostname;
  const DEFAULT_COLLAPSED_SECTIONS = settings.defaultCollapsedSections || {};
  const DEFAULT_OPEN_ALL_SECTIONS = settings.defaultOpenAllSections || {};
  const DEFAULT_SECTIONS = Array.isArray(settings.sections) ? cloneJson(settings.sections) : [];
  const extensionApi = getExtensionApi();
  const extensionStorage = extensionApi && extensionApi.storage && extensionApi.storage.local
    ? extensionApi.storage.local
    : null;
  const usesPromiseStorage = typeof browser !== "undefined" && extensionApi === browser;
  const storageCache = readLegacyStorageSnapshot();
  const dirtyStorageKeys = new Set();
  let sections = readSectionsConfig();

  /* Текущее состояние интерфейса: перетаскивание, тема, свернутые блоки и "открыть все". */
  const dragReadyMenus = new WeakSet();
  let isDraggingQuickLink = false;
  let suppressNextButtonClick = false;
  let themePreference = readThemePreference();
  let linksEditorMode = "blocks";
  let linksEditorSectionIndex = null;
  let linksEditorPath = [];
  let linksEditorDraftSections = null;
  let linksEditorDraftCollapsedSections = null;
  let linksEditorDraftOpenAllSections = null;
  let linksEditorDraftFavoriteLinkIds = null;
  let linksEditorDirty = false;
  let linksEditorNoticeTimer = null;
  let subModalStack = [];
  let favoriteLinkIds = readFavoriteLinkIds();
  let templateOpenInNewTab = false;
  let searchOptionCounter = 0;
  const searchSelectionIndexes = new WeakMap();
  const browserThemeQuery = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  const collapsedSections = readCollapsedSections();
  const sessionCollapsedSections = Object.assign({}, collapsedSections);
  const openAllSections = readOpenAllSections();

  /* Сохранение состояния окна: свернутые блоки, тема, редактор ссылок и кнопки "открыть все". */
  function cloneJson(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return [];
    }
  }

  function getExtensionApi() {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return chrome;
    }

    if (typeof browser !== "undefined" && browser.storage) {
      return browser;
    }

    return null;
  }

  function readLegacyStorageSnapshot() {
    const snapshot = {};
    PERSISTENT_STORAGE_KEYS.forEach(function (key) {
      const value = readLegacyStorageValue(key);
      if (value !== undefined) {
        snapshot[key] = value;
      }
    });
    return snapshot;
  }

  function readLegacyStorageValue(key) {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue === null) {
        return undefined;
      }

      if (key === THEME_KEY) {
        return rawValue;
      }

      return JSON.parse(rawValue);
    } catch (error) {
      return undefined;
    }
  }

  function writeLegacyStorageValue(key, value) {
    try {
      window.localStorage.setItem(key, key === THEME_KEY ? String(value) : JSON.stringify(value));
    } catch (error) {
      // Если storage расширения недоступен, состояние работает только до перезагрузки страницы.
    }
  }

  function hasStoredValue(key) {
    return Object.prototype.hasOwnProperty.call(storageCache, key);
  }

  function getStoredValue(key) {
    return hasStoredValue(key) ? storageCache[key] : undefined;
  }

  function setStoredValue(key, value) {
    storageCache[key] = value;
    dirtyStorageKeys.add(key);

    if (!extensionStorage) {
      writeLegacyStorageValue(key, value);
      return;
    }

    try {
      const payload = {};
      payload[key] = value;
      const result = usesPromiseStorage
        ? extensionStorage.set(payload)
        : extensionStorage.set(payload, function () {});
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          writeLegacyStorageValue(key, value);
        });
      }
    } catch (error) {
      writeLegacyStorageValue(key, value);
    }
  }

  function loadExtensionStorage() {
    if (!extensionStorage) {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      const finish = function (items) {
        applyLoadedStorage(items || {});
        resolve();
      };

      try {
        if (usesPromiseStorage) {
          extensionStorage.get(PERSISTENT_STORAGE_KEYS).then(finish, function () { resolve(); });
          return;
        }

        extensionStorage.get(PERSISTENT_STORAGE_KEYS, finish);
      } catch (error) {
        resolve();
      }
    });
  }

  function applyLoadedStorage(items) {
    const migrationPayload = {};

    PERSISTENT_STORAGE_KEYS.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(items, key)) {
        if (!dirtyStorageKeys.has(key)) {
          storageCache[key] = items[key];
        }
        return;
      }

      if (hasStoredValue(key)) {
        migrationPayload[key] = storageCache[key];
      }
    });

    if (Object.keys(migrationPayload).length > 0) {
      try {
        if (usesPromiseStorage) {
          extensionStorage.set(migrationPayload).catch(function () {});
        } else {
          extensionStorage.set(migrationPayload, function () {});
        }
      } catch (error) {
        // Миграция не критична: данные уже есть в кэше текущей страницы.
      }
    }

    migrateStoredConfiguration();
    applyStoredState();
  }

  function applyStoredState() {
    sections = readSectionsConfig();
    replaceObjectContents(collapsedSections, readCollapsedSections());
    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    replaceObjectContents(openAllSections, readOpenAllSections());
    favoriteLinkIds = readFavoriteLinkIds();
    themePreference = readThemePreference();
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      applyModalTheme(modal);
      refreshMainContent();
      refreshSettingsLists();
    }

    mountButton(true);
  }

  function replaceObjectContents(target, source) {
    Object.keys(target).forEach(function (key) {
      delete target[key];
    });
    Object.assign(target, source);
  }

  function readSectionsConfig() {
    try {
      const savedSections = getStoredValue(CUSTOM_SECTIONS_KEY);
      if (savedSections === undefined) {
        return sanitizeSections(DEFAULT_SECTIONS);
      }

      return sanitizeSections(savedSections);
    } catch (error) {
      return sanitizeSections(DEFAULT_SECTIONS);
    }
  }

  function saveSectionsConfig() {
    setStoredValue(CUSTOM_SECTIONS_KEY, sanitizeSections(sections));
  }

  function sanitizeSections(value) {
    const source = Array.isArray(value) ? value : DEFAULT_SECTIONS;

    return source.map(function (section) {
      if (!section || typeof section.title !== "string" || !Array.isArray(section.links)) {
        return null;
      }

      const title = section.title.trim();
      if (!title) {
        return null;
      }

      return {
        title: title,
        links: sanitizeLinks(section.links, [title])
      };
    }).filter(Boolean);
  }

  function sanitizeLinks(links, parentPath) {
    if (!Array.isArray(links)) {
      return [];
    }

    return links.map(function (link) {
      if (!link || typeof link.title !== "string") {
        return null;
      }

      const title = link.title.trim();
      if (!title) {
        return null;
      }

      const path = (parentPath || []).concat(title);
      const destinationSeed = typeof link.url === "string"
        ? link.url.trim()
        : (link.template && typeof link.template.url === "string" ? link.template.url.trim() : "group");
      const common = {
        id: getSanitizedLinkId(link.id, path.join("/") + "|" + destinationSeed),
        title: title
      };
      const keywords = sanitizeKeywords(link.keywords);
      if (keywords.length > 0) {
        common.keywords = keywords;
      }

      if (Array.isArray(link.links)) {
        common.links = sanitizeLinks(link.links, path);
        return common;
      }

      const template = sanitizeLinkTemplate(link.template);
      if (template) {
        common.template = template;
        return common;
      }

      if (typeof link.url === "string" && link.url.trim()) {
        common.url = link.url.trim();
        return common;
      }

      return null;
    }).filter(Boolean);
  }

  function sanitizeKeywords(value) {
    const source = Array.isArray(value)
      ? value
      : (typeof value === "string" ? value.split(",") : []);
    const seen = new Set();

    return source.map(function (keyword) {
      return String(keyword || "").replace(/\s+/g, " ").trim();
    }).filter(function (keyword) {
      const normalized = normalizeSearchValue(keyword);
      if (!normalized || seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  function sanitizeLinkTemplate(value) {
    if (!value || typeof value !== "object" || typeof value.url !== "string" || !value.url.trim()) {
      return null;
    }

    const fields = Array.isArray(value.fields) ? value.fields.map(function (field) {
      if (!field || typeof field.key !== "string" || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.key)) {
        return null;
      }

      const label = typeof field.label === "string" && field.label.trim()
        ? field.label.replace(/\s+/g, " ").trim()
        : field.key;
      return {
        key: field.key,
        label: label,
        placeholder: typeof field.placeholder === "string" ? field.placeholder.trim() : "",
        inputMode: field.inputMode === "text" ? "text" : "numeric"
      };
    }).filter(Boolean) : [];

    if (fields.length === 0) {
      return null;
    }

    return {
      url: value.url.trim(),
      fields: fields
    };
  }

  function getSanitizedLinkId(value, seed) {
    if (typeof value === "string" && /^[a-zA-Z0-9_-]{6,80}$/.test(value)) {
      return value;
    }

    return "b24ql-" + hashString(seed);
  }

  function createLinkId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "b24ql-" + window.crypto.randomUUID();
    }

    return "b24ql-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function hashString(value) {
    let hash = 2166136261;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  /* Однократное добавление новых системных шаблонов в ранее сохраненную структуру. */
  function migrateStoredConfiguration() {
    const storedVersion = Number(getStoredValue(CONFIG_SCHEMA_KEY)) || 0;
    if (storedVersion >= CONFIG_SCHEMA_VERSION) {
      return;
    }

    const savedSections = getStoredValue(CUSTOM_SECTIONS_KEY);
    if (Array.isArray(savedSections)) {
      const migratedSections = sanitizeSections(savedSections);
      if (storedVersion < 4) {
        addMissingDefaultTemplateLinks(migratedSections);
      }
      mergeDefaultLinkMetadata(migratedSections);
      setStoredValue(CUSTOM_SECTIONS_KEY, migratedSections);
    }

    /* До версии 3 ручное раскрытие ошибочно сохранялось как настройка по умолчанию. */
    if (storedVersion < 3) {
      const savedCollapsedSections = getStoredValue(COLLAPSED_SECTIONS_KEY);
      const migratedCollapsedSections = savedCollapsedSections &&
        typeof savedCollapsedSections === "object" &&
        !Array.isArray(savedCollapsedSections)
        ? Object.assign({}, savedCollapsedSections)
        : {};

      Object.keys(DEFAULT_COLLAPSED_SECTIONS).forEach(function (sectionTitle) {
        if (DEFAULT_COLLAPSED_SECTIONS[sectionTitle] === true) {
          migratedCollapsedSections[sectionTitle] = true;
        }
      });
      setStoredValue(COLLAPSED_SECTIONS_KEY, migratedCollapsedSections);
    }

    setStoredValue(CONFIG_SCHEMA_KEY, CONFIG_SCHEMA_VERSION);
  }

  function containsTemplateLinks(sectionList) {
    return (sectionList || []).some(function (section) {
      return section && Array.isArray(section.links) && section.links.some(linkContainsTemplate);
    });
  }

  function addMissingDefaultTemplateLinks(targetSections) {
    const defaultTemplateSection = sanitizeSections(DEFAULT_SECTIONS).find(function (section) {
      return containsTemplateLinks([section]);
    });
    if (!defaultTemplateSection) {
      return;
    }

    const targetSection = targetSections.find(function (section) {
      return normalizeSearchValue(section.title) === normalizeSearchValue(defaultTemplateSection.title);
    });
    if (!targetSection) {
      targetSections.unshift(defaultTemplateSection);
      return;
    }

    defaultTemplateSection.links.forEach(function (defaultLink) {
      const exists = targetSection.links.some(function (link) {
        return link.id === defaultLink.id ||
          normalizeSearchValue(link.title) === normalizeSearchValue(defaultLink.title);
      });
      if (!exists) {
        targetSection.links.push(defaultLink);
      }
    });
  }

  function linkContainsTemplate(link) {
    if (!link) {
      return false;
    }
    if (link.template) {
      return true;
    }
    return Array.isArray(link.links) && link.links.some(linkContainsTemplate);
  }

  function linkContainsOnlyTemplates(link) {
    if (!link) {
      return false;
    }
    if (link.template) {
      return true;
    }
    return Array.isArray(link.links) &&
      link.links.length > 0 &&
      link.links.every(linkContainsOnlyTemplates);
  }

  function mergeDefaultLinkMetadata(targetSections) {
    const defaultLinksById = new Map();
    sanitizeSections(DEFAULT_SECTIONS).forEach(function (section) {
      indexLinksById(section.links, defaultLinksById);
    });
    targetSections.forEach(function (section) {
      mergeLinkMetadataInList(section.links, defaultLinksById);
    });
  }

  function indexLinksById(links, result) {
    links.forEach(function (link) {
      result.set(link.id, link);
      if (Array.isArray(link.links)) {
        indexLinksById(link.links, result);
      }
    });
  }

  function mergeLinkMetadataInList(links, defaultsById) {
    links.forEach(function (link) {
      const defaultLink = defaultsById.get(link.id);
      if ((!link.keywords || link.keywords.length === 0) && defaultLink && defaultLink.keywords) {
        link.keywords = defaultLink.keywords.slice();
      }
      if (Array.isArray(link.links)) {
        mergeLinkMetadataInList(link.links, defaultsById);
      }
    });
  }

  function readCollapsedSections() {
    try {
      const parsed = getStoredValue(COLLAPSED_SECTIONS_KEY);
      const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      return Object.assign({}, DEFAULT_COLLAPSED_SECTIONS, saved);
    } catch (error) {
      return Object.assign({}, DEFAULT_COLLAPSED_SECTIONS);
    }
  }

  function readOpenAllSections() {
    try {
      const parsed = getStoredValue(OPEN_ALL_SECTIONS_KEY);
      const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      return Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS, saved);
    } catch (error) {
      return Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS);
    }
  }

  function saveOpenAllSections() {
    setStoredValue(OPEN_ALL_SECTIONS_KEY, Object.assign({}, openAllSections));
  }

  function saveCollapsedSections() {
    setStoredValue(COLLAPSED_SECTIONS_KEY, Object.assign({}, collapsedSections));
  }

  function readThemePreference() {
    try {
      const savedTheme = getStoredValue(THEME_KEY);
      return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "auto";
    } catch (error) {
      return "auto";
    }
  }

  function saveThemePreference() {
    setStoredValue(THEME_KEY, themePreference);
  }

  /* Определение активной темы: авто, светлая или темная. */
  function getBrowserTheme() {
    return browserThemeQuery && browserThemeQuery.matches ? "light" : "dark";
  }

  function getEffectiveTheme() {
    return themePreference === "auto" ? getBrowserTheme() : themePreference;
  }

  function updateThemeControls(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-theme-choice")).forEach(function (input) {
      input.checked = input.value === themePreference;
    });
  }

  function applyModalTheme(modal) {
    const targetModal = modal || document.getElementById(MODAL_ID);
    if (!targetModal) {
      return;
    }

    targetModal.dataset.b24qlTheme = themePreference;
    targetModal.dataset.b24qlEffectiveTheme = getEffectiveTheme();

    updateThemeControls(targetModal);
  }

  function setThemePreference(theme) {
    themePreference = theme === "dark" || theme === "light" ? theme : "auto";
    saveThemePreference();
    applyModalTheme();
  }

  /* Подмена домена в ссылках под текущий портал: prod, test или develop. */
  function getCurrentPortalHost() {
    return PORTAL_HOSTS.includes(window.location.hostname)
      ? window.location.hostname
      : PRODUCTION_PORTAL_HOST;
  }

  function getPortalUrl(url) {
    try {
      const targetUrl = new URL(url);
      if (targetUrl.hostname === PRODUCTION_PORTAL_HOST || PORTAL_HOSTS.includes(targetUrl.hostname)) {
        targetUrl.protocol = "https:";
        targetUrl.hostname = getCurrentPortalHost();
      }
      return targetUrl.href;
    } catch (error) {
      return url;
    }
  }

  /* Поиск и определение активной ссылки относительно текущей страницы. */
  function normalizeSearchValue(value) {
    return String(value || "").toLocaleLowerCase("ru-RU").replace(/\s+/g, " ").trim();
  }

  function getLinkSearchText(link) {
    const nestedText = Array.isArray(link.links)
      ? link.links.map(getLinkSearchText).join(" ")
      : "";
    const keywords = Array.isArray(link.keywords) ? link.keywords.join(" ") : "";
    const templateText = link.template
      ? [link.template.url].concat(link.template.fields.map(function (field) {
        return field.label;
      })).join(" ")
      : "";

    return normalizeSearchValue([link.title, link.url, keywords, templateText, nestedText].filter(Boolean).join(" "));
  }

  function linkMatchesSearch(link, query) {
    return !query || getLinkMatchScore(link, query, "") > 0;
  }

  function getLinkMatchScore(link, query, pathText) {
    const queries = getSearchQueryVariants(query);
    const title = normalizeSearchValue(link.title);
    const keywords = normalizeSearchValue(Array.isArray(link.keywords) ? link.keywords.join(" ") : "");
    const searchText = normalizeSearchValue([getLinkSearchText(link), pathText].filter(Boolean).join(" "));
    let bestScore = 0;

    queries.forEach(function (candidate) {
      if (!candidate) {
        return;
      }
      if (title === candidate) {
        bestScore = Math.max(bestScore, 1000);
      } else if (title.startsWith(candidate)) {
        bestScore = Math.max(bestScore, 900);
      } else if (title.includes(candidate)) {
        bestScore = Math.max(bestScore, 820);
      }
      if (keywords.includes(candidate)) {
        bestScore = Math.max(bestScore, 780);
      }
      if (searchText.includes(candidate)) {
        bestScore = Math.max(bestScore, 700);
      }

      const tokens = candidate.split(" ").filter(Boolean);
      if (tokens.length > 1 && tokens.every(function (token) {
        return searchText.includes(token);
      })) {
        bestScore = Math.max(bestScore, 650);
      }

      if (candidate.length >= 4 && isFuzzySearchMatch(title, candidate)) {
        bestScore = Math.max(bestScore, 420);
      }
    });

    return bestScore;
  }

  function getSearchQueryVariants(value) {
    const query = normalizeSearchValue(value);
    const variants = [query];
    const converted = convertKeyboardLayout(query);
    if (converted && converted !== query) {
      variants.push(converted);
    }
    return variants;
  }

  function convertKeyboardLayout(value) {
    const english = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
    const russian = "йцукенгшщзхъфывапролджэячсмитьбюё";
    return String(value || "").split("").map(function (character) {
      const englishIndex = english.indexOf(character);
      if (englishIndex >= 0) {
        return russian[englishIndex];
      }
      const russianIndex = russian.indexOf(character);
      return russianIndex >= 0 ? english[russianIndex] : character;
    }).join("");
  }

  function isFuzzySearchMatch(title, query) {
    const titleWords = title.split(/[^a-zа-яё0-9]+/i).filter(Boolean);
    const queryWords = query.split(/[^a-zа-яё0-9]+/i).filter(Boolean);
    if (queryWords.length === 0) {
      return false;
    }

    return queryWords.every(function (queryWord) {
      const allowedDistance = queryWord.length >= 8 ? 2 : 1;
      return titleWords.some(function (titleWord) {
        return Math.abs(titleWord.length - queryWord.length) <= allowedDistance &&
          getEditDistance(titleWord, queryWord, allowedDistance) <= allowedDistance;
      });
    });
  }

  function getEditDistance(left, right, stopAfter) {
    let previous = Array.from({ length: right.length + 1 }, function (_, index) {
      return index;
    });
    let previousPrevious = null;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = [leftIndex];
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const substitution = previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
        current[rightIndex] = Math.min(
          previous[rightIndex] + 1,
          current[rightIndex - 1] + 1,
          substitution
        );
        if (previousPrevious && leftIndex > 1 && rightIndex > 1 &&
          left[leftIndex - 1] === right[rightIndex - 2] &&
          left[leftIndex - 2] === right[rightIndex - 1]) {
          current[rightIndex] = Math.min(current[rightIndex], previousPrevious[rightIndex - 2] + 1);
        }
      }
      previousPrevious = previous;
      previous = current;
    }
    return Math.min(previous[right.length], stopAfter + 1);
  }

  function getComparableUrl(url) {
    try {
      const targetUrl = new URL(getPortalUrl(url), window.location.href);
      const path = targetUrl.pathname.replace(/\/+$/, "") || "/";
      return targetUrl.origin + path;
    } catch (error) {
      return "";
    }
  }

  function isCurrentPageUrl(url) {
    return getComparableUrl(url) === getComparableUrl(window.location.href);
  }

  function isGroupCurrentPage(group) {
    return Array.isArray(group.links) && group.links.some(function (link) {
      return Array.isArray(link.links) ? isGroupCurrentPage(link) : isCurrentPageUrl(link.url);
    });
  }

  /* Создание пункта "Быстрые ссылки" в стиле левого меню Bitrix24. */
  function createButton() {
    const button = document.createElement("a");
    button.id = BUTTON_ID;
    button.className = "b24ql-menu-button menu-item-link";
    button.href = "#";
    button.setAttribute("role", "button");
    button.draggable = false;
    button.title = "Быстрые ссылки";
    button.setAttribute("aria-label", "Открыть быстрые ссылки");
    button.innerHTML = [
      '<span class="menu-item-icon-box b24ql-menu-icon-box" aria-hidden="true">',
      '<span class="b24ql-menu-button-icon">',
      '<span></span><span></span><span></span>',
      "</span>",
      "</span>",
      '<span class="menu-item-link-text b24ql-menu-button-text">Быстрые ссылки</span>'
    ].join("");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      if (suppressNextButtonClick) {
        event.stopPropagation();
        suppressNextButtonClick = false;
        return;
      }
      openModal();
    });
    return button;
  }

  /* Поиск реального контейнера левого меню, даже если Bitrix24 поменял DOM после загрузки. */
  function findLeftMenuContainer() {
    const candidates = [];

    for (const selector of LEFT_MENU_SELECTORS) {
      const elements = Array.from(document.querySelectorAll(selector));
      for (const element of elements) {
        if (isVisibleLeftMenu(element)) {
          candidates.push({
            element: element,
            score: getLeftMenuScore(element)
          });
        }
      }
    }

    candidates.sort(function (a, b) {
      return b.score - a.score;
    });

    return candidates.length > 0 ? candidates[0].element : null;
  }

  function isVisibleLeftMenu(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width >= 30 &&
      rect.width <= 340 &&
      rect.height >= 160 &&
      rect.left <= 320 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function getLeftMenuScore(element) {
    const className = typeof element.className === "string" ? element.className : "";
    let score = 0;

    if (element.tagName.toLowerCase() === "ul") {
      score += 40;
    }
    if (className.split(/\s+/).includes("menu-items")) {
      score += 60;
    }
    if (element.querySelectorAll(":scope > li").length > 0) {
      score += 35;
    }
    if (className.includes("menu-items-body-inner") || className.includes("menu-items-block")) {
      score -= 25;
    }

    return score;
  }

  /* Встраивание кнопки только в реальное левое меню портала Bitrix24. */
  function mountButton(forcePositionRestore) {
    if (!document.body) {
      return;
    }

    const leftMenu = findLeftMenuContainer();
    if (!leftMenu) {
      unmountButtonUntilMenuExists();
      return;
    }

    let button = document.getElementById(BUTTON_ID);
    if (!button) {
      button = createButton();
    }

    let menuItem = ensureMenuItemElement();

    const currentContainer = getCurrentMenuContainer(leftMenu, menuItem);
    const needsPositionRestore = forcePositionRestore || !currentContainer;
    if (!currentContainer) {
      leftMenu.appendChild(menuItem);
    }
    if (button.parentElement !== menuItem) {
      menuItem.appendChild(button);
    }

    menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(menuItem.parentElement));
    setupMenuItemDrag(menuItem);
    setupMenuDropTargets(leftMenu);
    if (needsPositionRestore) {
      restoreMenuPosition(leftMenu, menuItem);
    }

    button.classList.add("b24ql-menu-button-inline");
    syncMenuItemColor(leftMenu, menuItem);
  }

  function unmountButtonUntilMenuExists() {
    const button = document.getElementById(BUTTON_ID);
    const menuItem = document.getElementById(MENU_ITEM_ID);

    if (button) {
      button.remove();
    }
    if (menuItem) {
      menuItem.remove();
    }
    closeModal(true);
  }

  function ensureMenuItemElement() {
    let menuItem = document.getElementById(MENU_ITEM_ID);

    if (!menuItem || menuItem.tagName.toLowerCase() !== "li") {
      const replacement = document.createElement("li");
      replacement.id = MENU_ITEM_ID;
      replacement.className = "menu-item-block b24ql-menu-item";

      if (menuItem) {
        while (menuItem.firstChild) {
          replacement.appendChild(menuItem.firstChild);
        }
        menuItem.replaceWith(replacement);
      }

      menuItem = replacement;
    }

    const expectedClassName = "menu-item-block b24ql-menu-item";
    if (menuItem.className !== expectedClassName) {
      menuItem.className = expectedClassName;
    }
    return menuItem;
  }

  function isNativeBitrixMenuList(element) {
    if (!element) {
      return false;
    }

    const className = typeof element.className === "string" ? element.className : "";
    return element.tagName.toLowerCase() === "ul" && className.split(/\s+/).includes("menu-items");
  }

  function getCurrentMenuContainer(leftMenu, menuItem) {
    const parent = menuItem.parentElement;
    if (!parent) {
      return null;
    }

    if (parent === leftMenu) {
      return leftMenu;
    }

    return leftMenu.contains(parent) && isMenuContainerElement(parent, leftMenu) ? parent : null;
  }

  /* Перетаскивание пункта меню и сохранение его позиции. */
  function setupMenuItemDrag(menuItem) {
    if (menuItem.dataset.b24qlDragReady === "true") {
      return;
    }

    menuItem.dataset.b24qlDragReady = "true";
    menuItem.draggable = true;
    menuItem.title = "Перетащите, чтобы изменить положение в меню";

    menuItem.addEventListener("dragstart", function (event) {
      const leftMenu = menuItem.parentElement;
      if (!leftMenu) {
        return;
      }

      isDraggingQuickLink = true;
      suppressNextButtonClick = true;
      menuItem.classList.add("b24ql-menu-item-dragging");
      document.documentElement.classList.add("b24ql-menu-is-dragging");

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", MENU_ITEM_ID);
      }
    });

    menuItem.addEventListener("dragend", function () {
      isDraggingQuickLink = false;
      menuItem.classList.remove("b24ql-menu-item-dragging");
      document.documentElement.classList.remove("b24ql-menu-is-dragging");
      saveMenuPosition(menuItem);

      window.setTimeout(function () {
        suppressNextButtonClick = false;
      }, 80);
    });
  }

  /* Подготовка областей, куда можно перетащить пункт, включая группу "Совместная работа". */
  function setupMenuDropTargets(leftMenu) {
    findMenuDropContainers(leftMenu).forEach(setupMenuDropTarget);
  }

  function setupMenuDropTarget(container) {
    if (dragReadyMenus.has(container)) {
      return;
    }

    dragReadyMenus.add(container);

    container.addEventListener("dragover", function (event) {
      if (!isDraggingQuickLink) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }

      const menuItem = document.getElementById(MENU_ITEM_ID);
      if (!menuItem) {
        return;
      }

      const groupTarget = getGroupDropTarget(container, event.target);
      const targetContainer = groupTarget ? groupTarget.container : container;

      if (menuItem.parentElement !== targetContainer) {
        targetContainer.appendChild(menuItem);
      }

      menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(targetContainer));
      syncMenuItemColor(leftMenu, menuItem);

      if (groupTarget && groupTarget.afterElement && groupTarget.afterElement.parentElement === targetContainer) {
        targetContainer.insertBefore(menuItem, groupTarget.afterElement.nextElementSibling);
        return;
      }

      const nextElement = getDragAfterElement(targetContainer, event.clientY);
      if (nextElement) {
        targetContainer.insertBefore(menuItem, nextElement);
      } else {
        targetContainer.appendChild(menuItem);
      }
    });

    container.addEventListener("drop", function (event) {
      if (!isDraggingQuickLink) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const menuItem = document.getElementById(MENU_ITEM_ID);
      if (menuItem) {
        saveMenuPosition(menuItem);
        syncMenuItemColor(leftMenu, menuItem);
      }
    });
  }

  function syncMenuItemColor(leftMenu, menuItem) {
    if (!leftMenu || !menuItem) {
      return;
    }

    const color = getDominantMenuTextColor(leftMenu);
    if (!color) {
      menuItem.style.removeProperty("--b24ql-menu-color");
      return;
    }

    if (menuItem.style.getPropertyValue("--b24ql-menu-color") !== color) {
      menuItem.style.setProperty("--b24ql-menu-color", color);
    }
  }

  function getDominantMenuTextColor(leftMenu) {
    const colors = new Map();

    Array.from(leftMenu.querySelectorAll(".menu-item-link-text, .menu-item-text, .menu-item-icon, .menu-item-icon-box")).forEach(function (element) {
      if (element.closest("#" + MENU_ITEM_ID) || !isVisibleMenuColorSource(element)) {
        return;
      }

      const color = window.getComputedStyle(element).color;
      if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
        return;
      }

      colors.set(color, (colors.get(color) || 0) + 1);
    });

    return Array.from(colors.entries()).sort(function (a, b) {
      return b[1] - a[1];
    })[0]?.[0] || "";
  }

  function isVisibleMenuColorSource(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || "1") > 0.2
    );
  }

  function findMenuDropContainers(leftMenu) {
    const containers = [leftMenu];
    const selectors = [
      "ul.menu-items",
      "ul",
      "ol",
      "[role='list']",
      ".menu-item-group-items",
      ".menu-item-group-list",
      ".menu-item-group-content",
      ".menu-item-group-more-ul",
      ".menu-items-group",
      ".menu-items-group-list",
      ".menu-group-items",
      "[data-role='menu-items']",
      "[data-role='menu-group-items']"
    ];

    Array.from(leftMenu.querySelectorAll(selectors.join(","))).forEach(function (element) {
      if (element !== leftMenu && isMenuDropContainer(element, leftMenu) && !containers.includes(element)) {
        containers.push(element);
      }
    });

    findTeamworkGroupElements(leftMenu).forEach(function (groupElement) {
      const nestedContainer = findNestedMenuContainer(groupElement);
      if (nestedContainer && isMenuContainerElement(nestedContainer, leftMenu) && !containers.includes(nestedContainer)) {
        containers.push(nestedContainer);
      }
    });

    return containers;
  }

  function isMenuDropContainer(element, leftMenu) {
    if (!element || element === document.documentElement || element === document.body) {
      return false;
    }
    if (element === leftMenu) {
      return true;
    }
    if (!leftMenu.contains(element)) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.height >= 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.position !== "fixed"
    );
  }

  function isMenuContainerElement(element, leftMenu) {
    if (!element || element === document.documentElement || element === document.body) {
      return false;
    }
    if (element === leftMenu) {
      return true;
    }
    if (!leftMenu.contains(element)) {
      return false;
    }

    return (
      element.matches("ul, ol, [role='list'], .menu-items, .menu-item-group-items, .menu-item-group-list, .menu-item-group-content, .menu-item-group-more-ul, .menu-items-group, .menu-items-group-list, .menu-group-items, [data-role='menu-items'], [data-role='menu-group-items']") ||
      Boolean(element.querySelector(":scope > li, :scope > .menu-item-block, :scope > .menu-item-link"))
    );
  }

  function getGroupDropTarget(container, eventTarget) {
    if (!(eventTarget instanceof Element)) {
      return null;
    }

    const groupElement = getTeamworkGroupElementFromTarget(eventTarget, container);

    if (!groupElement || groupElement.id === MENU_ITEM_ID || !container.contains(groupElement)) {
      return null;
    }

    const nestedContainer = findNestedMenuContainer(groupElement);
    if (nestedContainer && isMenuContainerElement(nestedContainer, container)) {
      return {
        container: nestedContainer,
        afterElement: null
      };
    }

    if (groupElement.parentElement === container) {
      return {
        container: container,
        afterElement: groupElement
      };
    }

    return null;
  }

  function getTeamworkGroupElementFromTarget(eventTarget, boundary) {
    let element = eventTarget;

    while (element && element !== boundary) {
      if (isTeamworkGroupElement(element)) {
        return element;
      }

      element = element.parentElement;
    }

    return boundary && isTeamworkGroupElement(boundary) ? boundary : null;
  }

  /* Распознавание группировки Bitrix24 "Совместная работа" и ее внутреннего списка. */
  function findTeamworkGroupElements(leftMenu) {
    return Array.from(leftMenu.querySelectorAll("*")).filter(function (element) {
      return isTeamworkGroupElement(element);
    });
  }

  function isTeamworkGroupElement(element) {
    if (!element || element.id === MENU_ITEM_ID) {
      return false;
    }

    const className = typeof element.className === "string" ? element.className : "";
    const text = normalizeMenuText(element);

    return (
      element.id === "bx_left_menu_menu_teamwork" ||
      element.id === "bx_left_menu_menu_teamwork_parent" ||
      className.includes("menu-teamwork") ||
      (className.includes("menu-item-group") && className.includes("menu-item-block")) ||
      className.includes("menu-item-group-more") ||
      element.getAttribute("data-id") === "menu_teamwork" ||
      element.getAttribute("data-menu-id") === "menu_teamwork" ||
      text === "Совместная работа" ||
      (text.includes("Совместная работа") && text.length <= 80)
    );
  }

  function findNestedMenuContainer(groupElement) {
    const selectors = [
      "ul.menu-items",
      "ul",
      "ol",
      "[role='list']",
      ".menu-item-group-items",
      ".menu-item-group-list",
      ".menu-item-group-content",
      ".menu-item-group-more-ul",
      ".menu-items-group",
      ".menu-items-group-list",
      ".menu-group-items",
      "[data-role='menu-items']",
      "[data-role='menu-group-items']"
    ];

    let candidate = groupElement;

    while (candidate && candidate !== document.body) {
      const childContainer = candidate.querySelector(selectors.join(","));
      if (childContainer) {
        return childContainer;
      }

      let sibling = candidate.nextElementSibling;
      while (sibling) {
        if (sibling.matches(selectors.join(",")) || isLikelyMenuItemsContainer(sibling)) {
          return sibling;
        }

        const nestedSiblingContainer = sibling.querySelector(selectors.join(","));
        if (nestedSiblingContainer) {
          return nestedSiblingContainer;
        }

        if (isPositionableMenuChild(sibling)) {
          break;
        }

        sibling = sibling.nextElementSibling;
      }

      candidate = candidate.parentElement;
    }

    return null;
  }

  function isLikelyMenuItemsContainer(element) {
    return Boolean(element.querySelector(":scope > li, :scope > .menu-item-block, :scope > .menu-item-link"));
  }

  function getDragAfterElement(container, pointerY) {
    const children = Array.from(container.children).filter(function (child) {
      return child.id !== MENU_ITEM_ID && isPositionableMenuChild(child);
    });

    return children.reduce(
      function (closest, child) {
        const rect = child.getBoundingClientRect();
        const offset = pointerY - rect.top - rect.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return {
            offset: offset,
            element: child
          };
        }

        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: null
      }
    ).element;
  }

  function isPositionableMenuChild(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.position !== "fixed"
    );
  }

  function normalizeMenuText(element) {
    return (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* Сохранение и восстановление позиции кнопки внутри левого меню. */
  function saveMenuPosition(menuItem) {
    const container = menuItem.parentElement;
    const leftMenu = findLeftMenuContainer();
    if (!container || !leftMenu || (container !== leftMenu && !leftMenu.contains(container))) {
      return;
    }

    const children = Array.from(container.children).filter(isPositionableMenuChild);
    const index = children.indexOf(menuItem);
    if (index < 0) {
      return;
    }

    setStoredValue(STORAGE_KEY, {
      version: POSITION_SCHEMA_VERSION,
      index: index,
      containerPath: getElementPath(leftMenu, container),
      userMoved: true
    });
  }

  function restoreMenuPosition(leftMenu, menuItem) {
    const savedPosition = getStoredValue(STORAGE_KEY);

    if (
      !savedPosition ||
      savedPosition.version !== POSITION_SCHEMA_VERSION ||
      savedPosition.userMoved !== true ||
      !Number.isInteger(savedPosition.index)
    ) {
      restoreDefaultMenuPosition(leftMenu, menuItem);
      return;
    }

    const targetContainer = getSavedMenuContainer(leftMenu, savedPosition) || leftMenu;
    const siblings = Array.from(targetContainer.children).filter(function (child) {
      return child.id !== MENU_ITEM_ID && isPositionableMenuChild(child);
    });
    const index = Math.max(0, Math.min(savedPosition.index, siblings.length));
    const nextElement = siblings[index];

    if (nextElement) {
      targetContainer.insertBefore(menuItem, nextElement);
    } else {
      targetContainer.appendChild(menuItem);
    }

    menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(targetContainer));
  }

  function getSavedMenuContainer(leftMenu, savedPosition) {
    if (!Array.isArray(savedPosition.containerPath) || savedPosition.containerPath.length === 0) {
      return leftMenu;
    }

    const savedContainer = getElementByPath(leftMenu, savedPosition.containerPath);
    return savedContainer && isMenuContainerElement(savedContainer, leftMenu) ? savedContainer : leftMenu;
  }

  function getElementPath(root, element) {
    const path = [];
    let current = element;

    while (current && current !== root) {
      const parent = current.parentElement;
      if (!parent) {
        return [];
      }

      path.unshift(Array.from(parent.children).indexOf(current));
      current = parent;
    }

    return current === root ? path : [];
  }

  function getElementByPath(root, path) {
    let current = root;

    for (const index of path) {
      if (!Number.isInteger(index) || index < 0 || !current.children[index]) {
        return null;
      }

      current = current.children[index];
    }

    return current;
  }

  function restoreDefaultMenuPosition(leftMenu, menuItem) {
    const children = Array.from(leftMenu.children);
    const teamworkGroup = children.find(function (child) {
      const className = typeof child.className === "string" ? child.className : "";

      return (
        child.id === "bx_left_menu_menu_teamwork" ||
        child.id === "bx_left_menu_menu_teamwork_parent" ||
        className.includes("menu-teamwork") ||
        className.includes("menu-item-group-more")
      );
    });

    if (teamworkGroup && teamworkGroup.parentElement === leftMenu) {
      leftMenu.insertBefore(menuItem, teamworkGroup.nextElementSibling);
      return;
    }

    const defaultPreviousItem = children.find(function (child) {
      const className = typeof child.className === "string" ? child.className : "";
      const text = (child.innerText || child.textContent || "").replace(/\s+/g, " ").trim();

      return className.includes("menu-tasks") || text.includes("Задачи и Проекты");
    });

    if (defaultPreviousItem && defaultPreviousItem.parentElement === leftMenu) {
      leftMenu.insertBefore(menuItem, defaultPreviousItem.nextElementSibling);
      return;
    }

    leftMenu.appendChild(menuItem);
  }

  /* Основное окно со списком блоков быстрых ссылок. */
  function createModal() {
    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "b24ql-modal b24ql-hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "b24ql-title");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel";

    const header = document.createElement("header");
    header.className = "b24ql-header";
    header.innerHTML = [
      '<div class="b24ql-title-wrap">',
      '<h2 id="b24ql-title">Быстрые ссылки</h2>',
      "<p>Переход к часто используемым разделам Bitrix24</p>",
      "</div>"
    ].join("");

    const actions = document.createElement("div");
    actions.className = "b24ql-header-actions";

    const settingsButton = createSettingsButton();

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeModal();
    });

    actions.appendChild(closeButton);
    actions.appendChild(settingsButton);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-main-content";
    renderMainContent(content);

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    overlay.appendChild(panel);
    overlay.appendChild(createSubModal());
    overlay.appendChild(createTemplateModal());
    overlay.appendChild(createSettingsModal());
    applyModalTheme(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    });

    return overlay;
  }

  function renderMainContent(content) {
    content.replaceChildren();
    content.dataset.b24qlSearchActive = "false";
    content.appendChild(createSearchBox(SEARCH_INPUT_ID, "Поиск по быстрым ссылкам", applyMainSearch));
    content.appendChild(createFavoritesSection());
    content.appendChild(createSearchResultsSection());

    sections.forEach(function (section, index) {
      content.appendChild(createSection(section, index));
    });

    const empty = document.createElement("div");
    empty.className = "b24ql-empty ui-alert ui-alert-default b24ql-hidden";
    const emptyMessage = document.createElement("span");
    emptyMessage.className = "ui-alert-message";
    emptyMessage.textContent = "Ничего не найдено";
    empty.appendChild(emptyMessage);
    content.appendChild(empty);
  }

  function refreshMainContent() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    const searchValue = getMainSearchValue();
    const content = modal.querySelector(".b24ql-main-content");
    if (!content) {
      return;
    }

    renderMainContent(content);
    setSearchInputValue(document.getElementById(SEARCH_INPUT_ID), searchValue);
    renderFavoritesSection();
    refreshActiveLinks(modal);
    updateOpenAllButtons(modal);
    applyMainSearch(searchValue);
  }

  function refreshSettingsLists() {
    renderCollapsedSectionsSettingsList();
    renderOpenAllSettingsList();
    renderLinksEditor();
  }

  function createSettingsButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "b24ql-settings-open ui-btn ui-btn-light-border ui-btn-xs";
    button.setAttribute("aria-label", "Открыть настройки");
    button.title = "Настройки";
    button.innerHTML = [
      '<svg class="b24ql-settings-open-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<circle cx="12" cy="12" r="3"></circle>',
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6V20a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1H4a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.34.46.71.6 1H20a2 2 0 1 1 0 4h-.09c-.14.29-.34.66-.51 1z"></path>',
      "</svg>"
    ].join("");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openSettingsModal();
    });
    return button;
  }

  /* Окно настроек: тема окна и включение кнопки "открыть весь блок". */
  function createSettingsModal() {
    const settingsModal = document.createElement("div");
    settingsModal.id = SETTINGS_MODAL_ID;
    settingsModal.className = "b24ql-settings-modal b24ql-hidden";
    settingsModal.setAttribute("role", "dialog");
    settingsModal.setAttribute("aria-labelledby", "b24ql-settings-title");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel b24ql-settings-panel";

    const header = document.createElement("header");
    header.className = "b24ql-header b24ql-subheader";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "b24ql-settings-title";
    title.textContent = "Настройки";
    titleWrap.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "b24ql-subactions";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть настройки");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeSettingsModal();
    });

    actions.appendChild(closeButton);
    header.appendChild(titleWrap);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-settings-content";

    const mainView = document.createElement("div");
    mainView.className = "b24ql-settings-view b24ql-settings-main-view";
    mainView.appendChild(createThemeSettingsRow());
    mainView.appendChild(createCollapsedSectionsSettingsRow());
    mainView.appendChild(createOpenAllSettingsRow());
    mainView.appendChild(createLinksEditorSettingsRow());

    const openAllView = document.createElement("div");
    openAllView.className = "b24ql-settings-view b24ql-open-all-view b24ql-hidden";

    const toolbar = document.createElement("div");
    toolbar.className = "b24ql-settings-toolbar";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Назад";
    styleUiAction(backButton, "outline", "sm");
    backButton.addEventListener("click", showSettingsMainView);

    const toolbarTitle = document.createElement("h3");
    toolbarTitle.textContent = "Открыть весь блок";

    toolbar.appendChild(backButton);
    toolbar.appendChild(toolbarTitle);

    const list = document.createElement("div");
    list.id = "b24ql-open-all-settings-list";
    list.className = "b24ql-settings-list";

    openAllView.appendChild(toolbar);
    openAllView.appendChild(list);

    const collapsedView = document.createElement("div");
    collapsedView.className = "b24ql-settings-view b24ql-collapsed-sections-view b24ql-hidden";

    const collapsedToolbar = document.createElement("div");
    collapsedToolbar.className = "b24ql-settings-toolbar";

    const collapsedBackButton = document.createElement("button");
    collapsedBackButton.type = "button";
    collapsedBackButton.textContent = "Назад";
    styleUiAction(collapsedBackButton, "outline", "sm");
    collapsedBackButton.addEventListener("click", showSettingsMainView);

    const collapsedToolbarTitle = document.createElement("h3");
    collapsedToolbarTitle.textContent = "Состояние блоков";

    collapsedToolbar.appendChild(collapsedBackButton);
    collapsedToolbar.appendChild(collapsedToolbarTitle);

    const collapsedList = document.createElement("div");
    collapsedList.id = "b24ql-collapsed-sections-settings-list";
    collapsedList.className = "b24ql-settings-list";

    collapsedView.appendChild(collapsedToolbar);
    collapsedView.appendChild(collapsedList);

    const linkEditorView = document.createElement("div");
    linkEditorView.className = "b24ql-settings-view b24ql-links-editor-view b24ql-hidden";

    const editorToolbar = document.createElement("div");
    editorToolbar.className = "b24ql-settings-toolbar b24ql-links-editor-toolbar";

    const editorBackButton = document.createElement("button");
    editorBackButton.type = "button";
    editorBackButton.textContent = "Назад";
    styleUiAction(editorBackButton, "outline", "sm");
    editorBackButton.addEventListener("click", handleLinksEditorBack);

    const editorTitle = document.createElement("h3");
    editorTitle.id = "b24ql-links-editor-title";
    editorTitle.textContent = "Редактор ссылок";

    editorToolbar.appendChild(editorBackButton);
    editorToolbar.appendChild(editorTitle);

    const editorActions = document.createElement("div");
    editorActions.className = "b24ql-links-editor-actions";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.id = "b24ql-links-editor-add";
    addButton.textContent = "Добавить блок";
    styleUiAction(addButton, "outline", "sm");
    addButton.addEventListener("click", handleLinksEditorAdd);

    const addGroupButton = document.createElement("button");
    addGroupButton.type = "button";
    addGroupButton.id = "b24ql-links-editor-add-group";
    addGroupButton.textContent = "Добавить вложенное окно";
    styleUiAction(addGroupButton, "outline", "sm");
    addGroupButton.addEventListener("click", handleLinksEditorAddGroup);

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.textContent = "Экспорт JSON";
    styleUiAction(exportButton, "outline", "sm");
    exportButton.addEventListener("click", exportLinksSettingsJson);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "b24ql-links-editor-save";
    saveButton.textContent = "Сохранить";
    styleUiAction(saveButton, "primary", "sm");
    saveButton.addEventListener("click", saveLinksEditorDraft);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "b24ql-links-editor-cancel";
    cancelButton.textContent = "Отмена";
    styleUiAction(cancelButton, "outline", "sm");
    cancelButton.addEventListener("click", cancelLinksEditorDraft);

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Импорт JSON";
    styleUiAction(importButton, "outline", "sm");

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "Сбросить к файлу";
    styleUiAction(resetButton, "outline", "sm");
    resetButton.addEventListener("click", resetLinksEditorDraftToSettingsFile);

    const importInput = document.createElement("input");
    importInput.id = "b24ql-settings-import";
    importInput.className = "b24ql-import-input";
    importInput.type = "file";
    importInput.accept = "application/json,.json";
    importInput.addEventListener("change", importLinksSettingsJson);
    importButton.addEventListener("click", function () {
      // Обнуление позволяет повторно выбрать тот же файл после отмененного импорта.
      importInput.value = "";
      importInput.click();
    });

    const importStatus = document.createElement("div");
    importStatus.id = "b24ql-links-editor-notice";
    importStatus.className = "b24ql-editor-notice ui-alert ui-alert-default b24ql-hidden";
    importStatus.setAttribute("role", "status");
    const importMessage = document.createElement("span");
    importMessage.className = "ui-alert-message";
    importStatus.appendChild(importMessage);

    const editorTools = document.createElement("div");
    editorTools.className = "b24ql-editor-actions-tools";
    editorTools.append(addButton, addGroupButton, importButton, exportButton, resetButton);

    const editorCommit = document.createElement("div");
    editorCommit.className = "b24ql-editor-actions-commit";
    editorCommit.append(saveButton, cancelButton);

    editorActions.append(editorTools, editorCommit);
    editorActions.appendChild(importInput);
    editorActions.appendChild(importStatus);

    const editorList = document.createElement("div");
    editorList.id = "b24ql-links-editor-list";
    editorList.className = "b24ql-links-editor-list";

    linkEditorView.appendChild(editorToolbar);
    linkEditorView.appendChild(editorActions);
    linkEditorView.appendChild(editorList);
    content.appendChild(mainView);
    content.appendChild(openAllView);
    content.appendChild(collapsedView);
    content.appendChild(linkEditorView);

    settingsModal.addEventListener("click", function (event) {
      if (event.target === settingsModal) {
        closeSettingsModal();
      }
    });

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    settingsModal.appendChild(panel);
    return settingsModal;
  }

  function createThemeSettingsRow() {
    const row = createSettingsRow("Тема");
    const group = document.createElement("fieldset");
    group.className = "b24ql-radio-group";
    group.setAttribute("aria-label", "Тема расширения");

    [
      { title: "Авто", value: "auto" },
      { title: "Светлая", value: "light" },
      { title: "Темная", value: "dark" }
    ].forEach(function (theme) {
      const label = document.createElement("label");
      label.className = "b24ql-radio-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "b24ql-theme";
      input.value = theme.value;
      input.className = "b24ql-theme-choice";
      input.checked = theme.value === themePreference;
      input.addEventListener("change", function () {
        if (input.checked) {
          setThemePreference(theme.value);
        }
      });
      const text = document.createElement("span");
      text.textContent = theme.title;
      label.append(input, text);
      group.appendChild(label);
    });

    row.appendChild(group);
    return row;
  }

  function createOpenAllSettingsRow() {
    const row = createSettingsRow("Открыть весь блок");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Настроить";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openOpenAllSettingsView);

    row.appendChild(button);
    return row;
  }

  function createCollapsedSectionsSettingsRow() {
    const row = createSettingsRow("Состояние блоков");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Настроить";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openCollapsedSectionsSettingsView);

    row.appendChild(button);
    return row;
  }

  function createLinksEditorSettingsRow() {
    const row = createSettingsRow("Редактор ссылок");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Редактировать";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openLinksEditorView);

    row.appendChild(button);
    return row;
  }

  function createSettingsRow(titleText) {
    const row = document.createElement("div");
    row.className = "b24ql-settings-row";

    const title = document.createElement("span");
    title.className = "b24ql-settings-row-title";
    title.textContent = titleText;

    row.appendChild(title);
    return row;
  }

  function createSettingsSwitch(checked, labelText, caption, onChange) {
    const label = document.createElement("label");
    label.className = "b24ql-switch-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    input.setAttribute("aria-label", labelText);
    input.checked = checked;
    input.addEventListener("change", function () {
      onChange(input.checked);
    });
    const track = document.createElement("span");
    track.className = "b24ql-switch-track";
    track.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className = "b24ql-switch-caption";
    text.textContent = caption;
    label.append(input, track, text);
    return label;
  }

  function styleUiAction(button, variant, size) {
    button.className = "b24ql-ui-action ui-btn ui-btn-" + size +
      " ui-btn-no-caps ui-btn-" + (variant === "primary" ? "primary" : variant === "danger" ? "danger" : "light-border");
    const text = document.createElement("span");
    text.className = "ui-btn-text";
    const inner = document.createElement("span");
    inner.className = "ui-btn-text-inner";
    inner.textContent = button.textContent;
    text.appendChild(inner);
    button.replaceChildren(text);
  }

  function setUiActionText(button, value) {
    const inner = button.querySelector(".ui-btn-text-inner");
    if (inner) {
      inner.textContent = value;
    } else {
      button.textContent = value;
    }
  }

  /* Собственное подтверждение работает одинаково во всех браузерах и не зависит от window.confirm. */
  function requestConfirmation(message) {
    return new Promise(function (resolve) {
      const modal = ensureModal();
      const previousDialog = document.getElementById(CONFIRM_MODAL_ID);
      if (previousDialog) {
        previousDialog.remove();
      }

      const overlay = document.createElement("div");
      overlay.id = CONFIRM_MODAL_ID;
      overlay.className = "b24ql-confirm-modal";
      overlay.setAttribute("role", "alertdialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "b24ql-confirm-message");

      const panel = document.createElement("div");
      panel.className = "b24ql-confirm-panel";

      const text = document.createElement("p");
      text.id = "b24ql-confirm-message";
      text.className = "b24ql-confirm-message";
      text.textContent = message;

      const actions = document.createElement("div");
      actions.className = "b24ql-confirm-actions";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Отмена";
      styleUiAction(cancelButton, "outline", "md");

      const confirmButton = document.createElement("button");
      confirmButton.type = "button";
      confirmButton.textContent = "Продолжить";
      styleUiAction(confirmButton, "primary", "md");

      let completed = false;
      const finish = function (confirmed) {
        if (completed) {
          return;
        }

        completed = true;
        document.removeEventListener("keydown", handleKeyDown, true);
        overlay.remove();
        resolve(confirmed);
      };

      const header = document.createElement("header");
      header.className = "b24ql-confirm-header";
      const title = document.createElement("h2");
      title.textContent = "Подтверждение";
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
      closeButton.setAttribute("aria-label", "Закрыть без изменений");
      closeButton.innerHTML = '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>';
      closeButton.addEventListener("click", function () { finish(false); });
      header.append(title, closeButton);

      const handleKeyDown = function (event) {
        if (event.key !== "Escape") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
        finish(false);
      };

      cancelButton.addEventListener("click", function () {
        finish(false);
      });
      confirmButton.addEventListener("click", function () {
        finish(true);
      });
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          finish(false);
        }
      });

      actions.appendChild(cancelButton);
      actions.appendChild(confirmButton);
      panel.appendChild(header);
      panel.appendChild(text);
      panel.appendChild(actions);
      overlay.appendChild(panel);
      modal.appendChild(overlay);
      document.addEventListener("keydown", handleKeyDown, true);
      confirmButton.focus();
    });
  }

  function openSettingsModal() {
    const modal = ensureModal();
    const settingsModal = modal.querySelector("#" + SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    showSettingsMainView();
    renderCollapsedSectionsSettingsList();
    renderOpenAllSettingsList();
    renderLinksEditor();
    updateThemeControls(settingsModal);
    settingsModal.classList.remove("b24ql-hidden");
  }

  async function closeSettingsModal(forceClose) {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (settingsModal) {
      const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
      const isEditorVisible = linkEditorView && !linkEditorView.classList.contains("b24ql-hidden");
      if (!forceClose && linksEditorDirty && isEditorVisible &&
        !await requestConfirmation("В редакторе есть несохраненные изменения. Закрыть без сохранения?")) {
        return false;
      }

      if (linksEditorDirty) {
        resetLinksEditorDraft();
      }

      settingsModal.classList.add("b24ql-hidden");
      showSettingsMainView();
    }

    return true;
  }

  function isSettingsModalOpen() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    return Boolean(settingsModal && !settingsModal.classList.contains("b24ql-hidden"));
  }

  function showSettingsMainView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.remove("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
  }

  function openOpenAllSettingsView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.remove("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
    renderOpenAllSettingsList();
  }

  function openCollapsedSectionsSettingsView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.remove("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
    renderCollapsedSectionsSettingsList();
  }

  function openLinksEditorView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.add("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.remove("b24ql-hidden");
    }

    resetLinksEditorDraft();
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    renderLinksEditor();
  }

  function renderCollapsedSectionsSettingsList() {
    const list = document.getElementById("b24ql-collapsed-sections-settings-list");
    if (!list) {
      return;
    }

    list.replaceChildren();
    sections.map(function (section) {
      return section.title;
    }).forEach(function (sectionTitle) {
      const row = createSettingsRow(sectionTitle);
      row.classList.add("b24ql-collapsed-sections-settings-row");
      row.appendChild(createCollapsedSectionChoiceGroup(sectionTitle));
      list.appendChild(row);
    });
  }

  function createCollapsedSectionChoiceGroup(sectionTitle) {
    return createSettingsSwitch(
      isSectionCollapsed(sectionTitle),
      "Свернут по умолчанию: " + sectionTitle,
      "Свернут",
      function (checked) { setSectionCollapsed(sectionTitle, checked); }
    );
  }

  function isSectionCollapsed(sectionTitle) {
    return collapsedSections[sectionTitle] === true;
  }

  function setSectionCollapsed(sectionTitle, collapsed) {
    setSectionCollapsedState(sectionTitle, collapsed);
    sessionCollapsedSections[sectionTitle] = collapsed;
    saveCollapsedSections();
    refreshMainContent();
    renderCollapsedSectionsSettingsList();
  }

  function renderOpenAllSettingsList() {
    const list = document.getElementById("b24ql-open-all-settings-list");
    if (!list) {
      return;
    }

    list.replaceChildren();
    sections.filter(function (section) {
      return collectDirectLinks(section.links, []).length > 0;
    }).forEach(function (section) {
      const row = createSettingsRow(section.title);
      row.classList.add("b24ql-open-all-settings-row");
      row.appendChild(createOpenAllChoiceGroup(section.title));
      list.appendChild(row);
    });
  }

  function createOpenAllChoiceGroup(sectionTitle) {
    return createSettingsSwitch(
      isOpenAllEnabled(sectionTitle),
      "Открыть весь блок: " + sectionTitle,
      "Открыть всё",
      function (checked) { setOpenAllEnabled(sectionTitle, checked); }
    );
  }

  /* Редактор ссылок работает с черновиком: изменения применяются только по кнопке "Сохранить". */
  function resetLinksEditorDraft() {
    linksEditorDraftSections = cloneJson(sections);
    linksEditorDraftCollapsedSections = Object.assign({}, collapsedSections);
    linksEditorDraftOpenAllSections = Object.assign({}, openAllSections);
    linksEditorDraftFavoriteLinkIds = favoriteLinkIds.slice();
    linksEditorDirty = false;
    updateLinksEditorSaveState();
  }

  function ensureLinksEditorDraft() {
    if (!linksEditorDraftSections) {
      resetLinksEditorDraft();
    }
  }

  function getEditorSections() {
    ensureLinksEditorDraft();
    return linksEditorDraftSections;
  }

  function markLinksEditorDirty() {
    linksEditorDirty = true;
    updateLinksEditorSaveState();
  }

  function updateLinksEditorSaveState() {
    const saveButton = document.getElementById("b24ql-links-editor-save");
    const cancelButton = document.getElementById("b24ql-links-editor-cancel");
    if (saveButton) {
      saveButton.disabled = !linksEditorDirty;
    }
    if (cancelButton) {
      cancelButton.disabled = !linksEditorDirty;
    }
  }

  function saveLinksEditorDraft() {
    ensureLinksEditorDraft();
    sections = sanitizeSections(linksEditorDraftSections);
    replaceObjectContents(
      collapsedSections,
      getBooleanSettingsForSections(
        linksEditorDraftCollapsedSections,
        DEFAULT_COLLAPSED_SECTIONS
      )
    );
    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    replaceObjectContents(
      openAllSections,
      getBooleanSettingsForSections(linksEditorDraftOpenAllSections, DEFAULT_OPEN_ALL_SECTIONS)
    );
    favoriteLinkIds = (linksEditorDraftFavoriteLinkIds || []).filter(function (id) {
      return Boolean(findLinkEntryById(id));
    });

    saveSectionsConfig();
    saveCollapsedSections();
    saveOpenAllSections();
    saveFavoriteLinkIds();
    resetLinksEditorDraft();
    refreshMainContent();
    refreshSettingsLists();
  }

  async function cancelLinksEditorDraft() {
    if (linksEditorDirty && !await requestConfirmation("Отменить изменения в редакторе ссылок?")) {
      return;
    }

    resetLinksEditorDraft();
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    renderLinksEditor();
  }

  async function resetLinksEditorDraftToSettingsFile() {
    if (!await requestConfirmation("Сбросить редактор к структуре из settings.js? Несохраненные изменения будут заменены.")) {
      return;
    }

    linksEditorDraftSections = cloneJson(DEFAULT_SECTIONS);
    linksEditorDraftCollapsedSections = Object.assign({}, DEFAULT_COLLAPSED_SECTIONS);
    linksEditorDraftOpenAllSections = Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS);
    linksEditorDraftFavoriteLinkIds = [];
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function getBooleanSettingsForSections(source, defaultMap, extraSectionTitles) {
    const result = {};
    const sourceMap = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    const sectionTitles = getEditorSections().map(function (section) {
      return section.title;
    }).concat(Array.isArray(extraSectionTitles) ? extraSectionTitles : []);

    sectionTitles.forEach(function (sectionTitle) {
      const value = sourceMap[sectionTitle];
      if (typeof value === "boolean" && (value === true || defaultMap[sectionTitle])) {
        result[sectionTitle] = value;
      }
    });

    return result;
  }

  function moveDraftSectionState(oldTitle, newTitle) {
    if (oldTitle === newTitle) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(linksEditorDraftOpenAllSections, oldTitle)) {
      linksEditorDraftOpenAllSections[newTitle] = linksEditorDraftOpenAllSections[oldTitle];
      delete linksEditorDraftOpenAllSections[oldTitle];
    }

    if (Object.prototype.hasOwnProperty.call(linksEditorDraftCollapsedSections, oldTitle)) {
      linksEditorDraftCollapsedSections[newTitle] = linksEditorDraftCollapsedSections[oldTitle];
      delete linksEditorDraftCollapsedSections[oldTitle];
    }
  }

  function deleteDraftSectionState(sectionTitle) {
    delete linksEditorDraftOpenAllSections[sectionTitle];
    delete linksEditorDraftCollapsedSections[sectionTitle];
  }

  function renderLinksEditor() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    ensureLinksEditorDraft();
    const title = settingsModal.querySelector("#b24ql-links-editor-title");
    const addButton = settingsModal.querySelector("#b24ql-links-editor-add");
    const addGroupButton = settingsModal.querySelector("#b24ql-links-editor-add-group");
    const list = settingsModal.querySelector("#b24ql-links-editor-list");
    const context = getLinksEditorContext();
    if (!title || !addButton || !addGroupButton || !list || !context) {
      return;
    }

    title.textContent = context.title;
    addButton.textContent = context.type === "blocks" ? "Добавить блок" : "Добавить кнопку";
    addGroupButton.classList.toggle("b24ql-hidden", context.type === "blocks");
    list.replaceChildren();

    if (context.type === "blocks") {
      if (context.list.length === 0) {
        list.appendChild(createEditorEmpty("Блоков пока нет"));
        updateLinksEditorSaveState();
        return;
      }

      context.list.forEach(function (section, index) {
        list.appendChild(createEditorBlockRow(section, index));
      });
      updateLinksEditorSaveState();
      return;
    }

    if (context.list.length === 0) {
      list.appendChild(createEditorEmpty("Кнопок пока нет"));
      updateLinksEditorSaveState();
      return;
    }

    context.list.forEach(function (link, index) {
      list.appendChild(createEditorLinkRow(link, index, context.list));
    });
    updateLinksEditorSaveState();
  }

  function getLinksEditorContext() {
    const editorSections = getEditorSections();
    if (linksEditorMode === "blocks") {
      return {
        type: "blocks",
        title: "Редактор ссылок",
        list: editorSections
      };
    }

    const section = editorSections[linksEditorSectionIndex];
    if (!section) {
      linksEditorMode = "blocks";
      linksEditorSectionIndex = null;
      linksEditorPath = [];
      return getLinksEditorContext();
    }

    let currentTitle = section.title;
    let currentList = section.links;
    for (const linkIndex of linksEditorPath) {
      const group = currentList[linkIndex];
      if (!group || !Array.isArray(group.links)) {
        linksEditorPath = [];
        currentTitle = section.title;
        currentList = section.links;
        break;
      }

      currentTitle = group.title;
      currentList = group.links;
    }

    return {
      type: "links",
      title: "Кнопки: " + currentTitle,
      list: currentList,
      section: section
    };
  }

  function createEditorBlockRow(section, index) {
    const row = createEditorRow();
    const fields = document.createElement("div");
    fields.className = "b24ql-editor-fields";

    const titleInput = createEditorInput("Название блока", section.title);
    titleInput.addEventListener("change", function () {
      const oldTitle = section.title;
      const newTitle = getInputValue(titleInput, oldTitle);
      if (newTitle === oldTitle) {
        return;
      }

      section.title = newTitle;
      moveDraftSectionState(oldTitle, newTitle);
      markLinksEditorDirty();
      renderLinksEditor();
    });

    fields.appendChild(titleInput.parentElement);

    const actions = createEditorActions();
    actions.appendChild(createEditorSmallButton("Настроить", function () {
      linksEditorMode = "links";
      linksEditorSectionIndex = index;
      linksEditorPath = [];
      renderLinksEditor();
    }));
    actions.appendChild(createMoveButton("Вверх", getEditorSections(), index, -1));
    actions.appendChild(createMoveButton("Вниз", getEditorSections(), index, 1));
    actions.appendChild(createEditorSmallButton("Удалить", async function () {
      if (!await requestConfirmation("Удалить блок \"" + section.title + "\"?")) {
        return;
      }

      deleteDraftSectionState(section.title);
      getEditorSections().splice(index, 1);
      markLinksEditorDirty();
      renderLinksEditor();
    }, "b24ql-editor-danger"));

    row.appendChild(fields);
    row.appendChild(actions);
    return row;
  }

  function createEditorLinkRow(link, index, list) {
    const row = createEditorRow();
    const fields = document.createElement("div");
    fields.className = "b24ql-editor-fields";

    const titleInput = createEditorInput("Название кнопки", link.title);
    titleInput.addEventListener("change", function () {
      link.title = getInputValue(titleInput, link.title);
      markLinksEditorDirty();
    });
    fields.appendChild(titleInput.parentElement);

    if (Array.isArray(link.links)) {
      const nestedLabel = document.createElement("span");
      nestedLabel.className = "b24ql-editor-meta ui-label ui-label-light ui-label-sm";
      const nestedText = document.createElement("span");
      nestedText.className = "ui-label-inner";
      nestedText.textContent = "Вложенное окно";
      nestedLabel.appendChild(nestedText);
      fields.appendChild(nestedLabel);
    } else if (link.template) {
      const urlInput = createEditorInput("Шаблон ссылки", link.template.url || "");
      urlInput.addEventListener("change", function () {
        link.template.url = getInputValue(urlInput, link.template.url);
        markLinksEditorDirty();
      });
      fields.appendChild(urlInput.parentElement);
    } else {
      const urlInput = createEditorInput("Ссылка", link.url || "");
      urlInput.addEventListener("change", function () {
        link.url = getInputValue(urlInput, link.url || "https://" + PRODUCTION_PORTAL_HOST + "/");
        markLinksEditorDirty();
      });
      fields.appendChild(urlInput.parentElement);
    }

    const keywordsInput = createEditorInput("Ключевые слова через запятую", (link.keywords || []).join(", "));
    keywordsInput.parentElement.classList.add("b24ql-editor-keywords");
    keywordsInput.addEventListener("change", function () {
      link.keywords = sanitizeKeywords(keywordsInput.value);
      keywordsInput.value = link.keywords.join(", ");
      markLinksEditorDirty();
    });
    fields.appendChild(keywordsInput.parentElement);

    const actions = createEditorActions();
    if (Array.isArray(link.links)) {
      actions.appendChild(createEditorSmallButton("Открыть", function () {
        linksEditorPath = linksEditorPath.concat(index);
        renderLinksEditor();
      }));
    } else {
      actions.appendChild(createEditorSmallButton("Сделать окном", async function () {
        if (!await requestConfirmation("Заменить ссылку \"" + link.title + "\" на вложенное окно?")) {
          return;
        }

        delete link.url;
        delete link.template;
        link.links = [];
        markLinksEditorDirty();
        renderLinksEditor();
      }));
    }
    actions.appendChild(createMoveButton("Вверх", list, index, -1));
    actions.appendChild(createMoveButton("Вниз", list, index, 1));
    actions.appendChild(createEditorSmallButton("Удалить", async function () {
      if (!await requestConfirmation("Удалить кнопку \"" + link.title + "\"?")) {
        return;
      }

      list.splice(index, 1);
      markLinksEditorDirty();
      renderLinksEditor();
    }, "b24ql-editor-danger"));

    row.appendChild(fields);
    row.appendChild(actions);
    return row;
  }

  function createEditorRow() {
    const row = document.createElement("div");
    row.className = "b24ql-editor-row";
    return row;
  }

  function createEditorActions() {
    const actions = document.createElement("div");
    actions.className = "b24ql-editor-row-actions";
    return actions;
  }

  function createEditorInput(label, value) {
    const input = document.createElement("input");
    input.className = "b24ql-editor-input ui-ctl-element";
    input.type = "text";
    input.value = value || "";
    input.placeholder = label;
    input.setAttribute("aria-label", label);
    const control = document.createElement("div");
    control.className = "b24ql-editor-control ui-ctl ui-ctl-textbox ui-ctl-w100 ui-ctl-sm";
    control.appendChild(input);
    return input;
  }

  function createEditorSmallButton(text, onClick, extraClassName) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    styleUiAction(button, extraClassName === "b24ql-editor-danger" ? "danger" : "outline", "sm");
    button.classList.add("b24ql-editor-small-button");
    if (extraClassName) {
      button.classList.add(extraClassName);
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      onClick(event);
    });
    return button;
  }

  function createMoveButton(text, list, index, direction) {
    const button = createEditorSmallButton(text, function () {
      moveEditorItem(list, index, index + direction);
    });
    const targetIndex = index + direction;
    button.disabled = targetIndex < 0 || targetIndex >= list.length;
    return button;
  }

  function createEditorEmpty(text) {
    const empty = document.createElement("div");
    empty.className = "b24ql-empty ui-alert ui-alert-default";
    const message = document.createElement("span");
    message.className = "ui-alert-message";
    message.textContent = text;
    empty.appendChild(message);
    return empty;
  }

  function getInputValue(input, fallback) {
    const value = input.value.replace(/\s+/g, " ").trim();
    if (value) {
      input.value = value;
      return value;
    }

    input.value = fallback;
    return fallback;
  }

  function moveEditorItem(list, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) {
      return;
    }

    const movedItems = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, movedItems[0]);
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function handleLinksEditorAdd() {
    const context = getLinksEditorContext();
    if (!context) {
      return;
    }

    if (context.type === "blocks") {
      getEditorSections().push({
        title: getUniqueSectionTitle("Новый блок"),
        links: []
      });
      markLinksEditorDirty();
      renderLinksEditor();
      return;
    }

    context.list.push({
      id: createLinkId(),
      title: "Новая кнопка",
      url: "https://" + PRODUCTION_PORTAL_HOST + "/"
    });
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function handleLinksEditorAddGroup() {
    const context = getLinksEditorContext();
    if (!context || context.type !== "links") {
      return;
    }

    context.list.push({
      id: createLinkId(),
      title: getUniqueLinkTitle("Новое окно", context.list),
      links: []
    });
    markLinksEditorDirty();
    renderLinksEditor();
  }

  async function handleLinksEditorBack() {
    if (linksEditorMode === "blocks") {
      if (linksEditorDirty && !await requestConfirmation("В редакторе есть несохраненные изменения. Выйти без сохранения?")) {
        return;
      }
      resetLinksEditorDraft();
      showSettingsMainView();
      return;
    }

    if (linksEditorPath.length > 0) {
      linksEditorPath = linksEditorPath.slice(0, -1);
      renderLinksEditor();
      return;
    }

    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    renderLinksEditor();
  }

  function getUniqueSectionTitle(baseTitle) {
    const existingTitles = new Set(getEditorSections().map(function (section) {
      return normalizeSearchValue(section.title);
    }));
    let title = baseTitle;
    let counter = 2;

    while (existingTitles.has(normalizeSearchValue(title))) {
      title = baseTitle + " " + counter;
      counter += 1;
    }

    return title;
  }

  function getUniqueLinkTitle(baseTitle, list) {
    const existingTitles = new Set(list.map(function (link) {
      return normalizeSearchValue(link.title);
    }));
    let title = baseTitle;
    let counter = 2;

    while (existingTitles.has(normalizeSearchValue(title))) {
      title = baseTitle + " " + counter;
      counter += 1;
    }

    return title;
  }

  function exportLinksSettingsJson() {
    const exportSections = linksEditorDraftSections || sections;
    const payload = {
      version: CONFIG_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      portalHosts: PORTAL_HOSTS,
      defaultPortalHost: PRODUCTION_PORTAL_HOST,
      collapsedSections: getCurrentCollapsedSectionsExport(),
      openAllSections: getCurrentOpenAllSectionsExport(),
      favoriteLinkIds: (linksEditorDraftFavoriteLinkIds || favoriteLinkIds).slice(),
      sections: sanitizeSections(exportSections)
    };
    const fileName = "b24-quick-links-settings-" + new Date().toISOString().slice(0, 10) + ".json";
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function importLinksSettingsJson(event) {
    const input = event.target;
    const file = input && input.files ? input.files[0] : null;
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async function () {
      try {
        const payload = JSON.parse(String(reader.result || ""));
        if (await importLinksSettingsPayload(payload)) {
          showLinksEditorNotice("Настройки загружены в черновик. Нажмите \"Сохранить\", чтобы применить их.");
        }
      } catch (error) {
        showLinksEditorNotice("Не удалось импортировать JSON: " + error.message, true);
      } finally {
        input.value = "";
      }
    });
    reader.addEventListener("error", function () {
      showLinksEditorNotice("Не удалось прочитать файл", true);
      input.value = "";
    });
    reader.readAsText(file);
  }

  function showLinksEditorNotice(message, isError) {
    const notice = document.getElementById("b24ql-links-editor-notice");
    if (!notice) {
      return;
    }

    if (linksEditorNoticeTimer) {
      window.clearTimeout(linksEditorNoticeTimer);
    }

    notice.querySelector(".ui-alert-message").textContent = message;
    notice.classList.toggle("b24ql-editor-notice-error", Boolean(isError));
    notice.classList.toggle("ui-alert-danger", Boolean(isError));
    notice.classList.toggle("ui-alert-default", !isError);
    notice.classList.remove("b24ql-hidden");
    linksEditorNoticeTimer = window.setTimeout(function () {
      notice.classList.add("b24ql-hidden");
      linksEditorNoticeTimer = null;
    }, 6000);
  }

  async function importLinksSettingsPayload(payload) {
    const rawSections = Array.isArray(payload) ? payload : payload && payload.sections;
    if (!Array.isArray(rawSections)) {
      throw new Error("в файле нет массива sections");
    }

    const importedSections = sanitizeSections(rawSections);
    const importedVersion = payload && !Array.isArray(payload) ? Number(payload.version) || 0 : 0;
    if (importedVersion < CONFIG_SCHEMA_VERSION) {
      addMissingDefaultTemplateLinks(importedSections);
      mergeDefaultLinkMetadata(importedSections);
    }
    if (importedSections.length === 0) {
      throw new Error("в файле нет подходящих блоков");
    }

    if (!await requestConfirmation("Импорт заменит текущий черновик редактора ссылок. Продолжить?")) {
      return false;
    }

    linksEditorDraftSections = importedSections;
    linksEditorDraftCollapsedSections = getImportedBooleanSettings(
      payload && payload.collapsedSections,
      DEFAULT_COLLAPSED_SECTIONS,
      importedSections
    );
    linksEditorDraftOpenAllSections = getImportedBooleanSettings(
      payload && payload.openAllSections,
      DEFAULT_OPEN_ALL_SECTIONS,
      importedSections
    );
    const importedLinkIds = collectLinkIds(importedSections, new Set());
    linksEditorDraftFavoriteLinkIds = Array.isArray(payload && payload.favoriteLinkIds)
      ? payload.favoriteLinkIds.filter(function (id) {
        return typeof id === "string" && importedLinkIds.has(id);
      })
      : [];
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    markLinksEditorDirty();
    renderLinksEditor();
    return true;
  }

  function collectLinkIds(sectionList, result) {
    (sectionList || []).forEach(function (section) {
      collectLinkIdsFromList(section.links || [], result);
    });
    return result;
  }

  function collectLinkIdsFromList(links, result) {
    links.forEach(function (link) {
      if (link.id) {
        result.add(link.id);
      }
      if (Array.isArray(link.links)) {
        collectLinkIdsFromList(link.links, result);
      }
    });
  }

  function getImportedBooleanSettings(importedMap, defaultMap, targetSections) {
    const source = importedMap && typeof importedMap === "object" && !Array.isArray(importedMap)
      ? importedMap
      : {};
    const result = {};

    targetSections.forEach(function (section) {
      if (Object.prototype.hasOwnProperty.call(source, section.title) && typeof source[section.title] === "boolean") {
        if (source[section.title] === true || defaultMap[section.title]) {
          result[section.title] = source[section.title] === true;
        }
        return;
      }

      if (defaultMap[section.title]) {
        result[section.title] = true;
      }
    });

    return result;
  }

  function getCurrentCollapsedSectionsExport() {
    const result = {};
    const exportSections = linksEditorDraftSections || sections;
    const exportCollapsedSections = linksEditorDraftCollapsedSections || collapsedSections;
    exportSections.forEach(function (section) {
      result[section.title] = exportCollapsedSections[section.title] === true;
    });
    return result;
  }

  function getCurrentOpenAllSectionsExport() {
    const result = {};
    const exportSections = linksEditorDraftSections || sections;
    const exportOpenAllSections = linksEditorDraftOpenAllSections || openAllSections;
    exportSections.forEach(function (section) {
      result[section.title] = exportOpenAllSections[section.title] === true;
    });
    return result;
  }

  function createSearchBox(inputId, placeholder, onInput) {
    const wrap = document.createElement("div");
    wrap.className = "b24ql-search ui-ctl ui-ctl-textbox ui-ctl-w100 ui-ctl-before-icon ui-ctl-after-icon";

    const icon = document.createElement("span");
    icon.className = "b24ql-search-icon ui-ctl-before ui-ctl-icon-search";
    icon.setAttribute("aria-hidden", "true");

    const input = document.createElement("input");
    input.id = inputId;
    input.className = "b24ql-search-input ui-ctl-element";
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = placeholder;
    input.setAttribute("aria-label", placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "b24ql-search-clear ui-ctl-after ui-ctl-icon-clear b24ql-hidden";
    clearButton.setAttribute("aria-label", "Очистить поиск");

    input.addEventListener("input", function () {
      clearButton.classList.toggle("b24ql-hidden", input.value.length === 0);
      onInput(input.value);
    });
    input.addEventListener("keydown", function (event) {
      handleSearchInputKeydown(event, input);
    });

    clearButton.addEventListener("click", function () {
      input.value = "";
      clearButton.classList.add("b24ql-hidden");
      onInput("");
      input.focus();
    });

    wrap.appendChild(icon);
    wrap.appendChild(input);
    wrap.appendChild(clearButton);
    return wrap;
  }

  function createCounter(value) {
    const count = document.createElement("span");
    count.className = "b24ql-section-count ui-counter ui-counter-light";
    const inner = document.createElement("span");
    inner.className = "ui-counter-inner";
    inner.textContent = String(value);
    count.appendChild(inner);
    return count;
  }

  function setCounterValue(count, value) {
    const inner = count.querySelector(".ui-counter-inner");
    if (inner) {
      inner.textContent = String(value);
    }
  }

  function createFavoritesSection() {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-favorites-section b24ql-hidden";

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = "Избранное";

    const count = createCounter(0);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-favorites-grid";

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(count);
    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);
    return sectionNode;
  }

  function createSearchResultsSection() {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-search-results b24ql-hidden";

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = "Результаты поиска";

    const count = createCounter(0);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-search-results-grid";

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(count);
    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);

    return sectionNode;
  }

  /* Кнопка "открыть весь блок" появляется только у включенных в настройках разделов. */
  function createOpenAllButton(section) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "b24ql-section-open-all ui-btn ui-btn-xs ui-btn-light-border";
    button.dataset.sectionTitle = section.title;
    button.dataset.openAllAvailable = collectDirectLinks(section.links, []).length > 0 ? "true" : "false";
    button.title = "Открыть все ссылки блока";
    button.setAttribute("aria-label", "Открыть все ссылки блока " + section.title);
    button.innerHTML = [
      '<svg class="b24ql-section-open-all-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M5 7h7M5 12h7M5 17h7"></path>',
      '<path d="M15 7l4 5-4 5"></path>',
      "</svg>"
    ].join("");
    button.classList.toggle(
      "b24ql-hidden",
      button.dataset.openAllAvailable !== "true" || !isOpenAllEnabled(section.title)
    );
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openAllLinksInSection(section);
    });
    return button;
  }

  function isOpenAllEnabled(sectionTitle) {
    return openAllSections[sectionTitle] === true;
  }

  function setOpenAllEnabled(sectionTitle, enabled) {
    if (enabled) {
      openAllSections[sectionTitle] = true;
    } else if (DEFAULT_OPEN_ALL_SECTIONS[sectionTitle]) {
      openAllSections[sectionTitle] = false;
    } else {
      delete openAllSections[sectionTitle];
    }

    saveOpenAllSections();
    updateOpenAllButtons();
    renderOpenAllSettingsList();
  }

  function updateOpenAllButtons(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-section-open-all")).forEach(function (button) {
      button.classList.toggle(
        "b24ql-hidden",
        button.dataset.openAllAvailable !== "true" || !isOpenAllEnabled(button.dataset.sectionTitle)
      );
    });
  }

  function collectDirectLinks(links, result) {
    links.forEach(function (link) {
      if (Array.isArray(link.links)) {
        collectDirectLinks(link.links, result);
        return;
      }

      if (link.url) {
        result.push(link);
      }
    });

    return result;
  }

  function openAllLinksInSection(section) {
    const urls = collectDirectLinks(section.links, []).map(function (link) {
      return getPortalUrl(link.url);
    });
    const browserRuntime = typeof browser !== "undefined" && browser.runtime &&
      typeof browser.runtime.sendMessage === "function"
      ? browser.runtime
      : null;
    const chromeRuntime = typeof chrome !== "undefined" && chrome.runtime &&
      typeof chrome.runtime.sendMessage === "function"
      ? chrome.runtime
      : null;
    const runtimeApi = browserRuntime || chromeRuntime;
    if (runtimeApi) {
      const message = { type: "b24ql-open-tabs", urls: urls };
      let handled = false;
      const finish = function (response) {
        if (handled) {
          return;
        }
        handled = true;
        const opened = response && Number.isInteger(response.count) ? response.count : 0;
        if (!response || response.ok !== true) {
          urls.slice(opened).forEach(function (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          });
        }
      };
      try {
        const result = browserRuntime
          ? runtimeApi.sendMessage(message)
          : runtimeApi.sendMessage(message, finish);
        if (result && typeof result.then === "function") {
          result.then(finish, function () { finish(null); });
        }
      } catch (error) {
        finish(null);
      }
    } else {
      urls.forEach(function (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
    closeModal();
  }

  /* Блок внутри основного окна: заголовок, счетчик, сворачивание и сетка кнопок. */
  function createSection(section, index) {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-source-section";
    sectionNode.dataset.totalCount = String(section.links.length);
    sectionNode.dataset.sectionTitle = section.title;
    sectionNode.dataset.sectionIndex = String(index);
    if (sessionCollapsedSections[section.title]) {
      sectionNode.classList.add("b24ql-section-collapsed");
    }

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = section.title;

    const openAllButton = createOpenAllButton(section);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "b24ql-section-toggle ui-btn ui-btn-xs ui-btn-light-border";
    toggleButton.innerHTML = '<span class="b24ql-section-toggle-icon" aria-hidden="true"></span>';

    const count = createCounter(section.links.length);

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(openAllButton);
    heading.appendChild(toggleButton);
    heading.appendChild(count);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-section-links-" + index;
    toggleButton.setAttribute("aria-controls", grid.id);
    updateSectionToggle(toggleButton, section.title, sessionCollapsedSections[section.title]);
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleSection(sectionNode, toggleButton, section.title);
    });

    section.links.forEach(function (link) {
      grid.appendChild(createLinkItem(link));
    });

    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);
    return sectionNode;
  }

  function createLinkMeta(text) {
    const meta = document.createElement("span");
    meta.className = "b24ql-link-meta ui-label ui-label-light ui-label-xs";
    const inner = document.createElement("span");
    inner.className = "ui-label-inner";
    inner.textContent = text;
    meta.appendChild(inner);
    return meta;
  }

  /* Обычная ссылка или кнопка, которая открывает вложенное окно. */
  function createLinkItem(link, metaText) {
    if (Array.isArray(link.links)) {
      const isTemplateGroup = linkContainsOnlyTemplates(link);
      const item = document.createElement("button");
      item.type = "button";
      item.className = "b24ql-link b24ql-link-group ui-btn ui-btn-light ui-btn-no-caps" +
        (isTemplateGroup ? " b24ql-link-template-group" : "") +
        (metaText ? " b24ql-link-search-result" : "");
      item.setAttribute("aria-haspopup", "dialog");
      item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
      item.__b24qlLink = link;

      const textWrap = document.createElement("span");
      textWrap.className = "b24ql-link-text";

      const label = document.createElement("span");
      label.className = "b24ql-link-label";
      label.textContent = link.title;
      textWrap.appendChild(label);

      if (metaText) {
        textWrap.appendChild(createLinkMeta(metaText));
      }

      item.appendChild(textWrap);
      if (!isTemplateGroup) {
        const arrow = document.createElement("span");
        arrow.className = "b24ql-link-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "›";
        item.appendChild(arrow);
      }
      updateGroupActiveState(item, link);
      item.addEventListener("click", function () {
        openLinkGroup(link);
      });
      addMiddleClickHandlers(item, function () {
        openLinkGroup(link);
      });
      item.__b24qlActivate = function () {
        openLinkGroup(link);
      };
      return wrapLinkItem(item, link);
    }

    if (link.template) {
      return createTemplateLink(link, metaText);
    }

    return createDirectLink(link, metaText);
  }

  function createDirectLink(link, metaText) {
    const item = document.createElement("a");
    const targetUrl = getPortalUrl(link.url);
    item.href = targetUrl;
    item.className = "b24ql-link ui-btn ui-btn-light ui-btn-no-caps" +
      (metaText ? " b24ql-link-search-result" : "");
    item.dataset.url = targetUrl;
    item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
    item.__b24qlLink = link;

    const textWrap = document.createElement("span");
    textWrap.className = "b24ql-link-text";

    const label = document.createElement("span");
    label.className = "b24ql-link-label";
    label.textContent = link.title;
    textWrap.appendChild(label);

    if (metaText) {
      textWrap.appendChild(createLinkMeta(metaText));
    }

    item.appendChild(textWrap);

    updateDirectActiveState(item, targetUrl);
    item.addEventListener("click", function (event) {
      const opensInCurrentTab = event.button === 0 &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

      if (opensInCurrentTab) {
        event.preventDefault();
      }
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      if (opensInCurrentTab) {
        navigateDirectLinkInCurrentTab(targetUrl);
      }
    }, true);

    item.addEventListener("auxclick", function (event) {
      if (event.button !== 1) {
        return;
      }

      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
    }, true);
    item.__b24qlActivate = function (openInNewTab) {
      if (openInNewTab) {
        openLinkInNewTab(targetUrl);
      } else {
        navigateDirectLinkInCurrentTab(targetUrl);
      }
    };
    return wrapLinkItem(item, link);
  }

  function createTemplateLink(link, metaText) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "b24ql-link b24ql-link-template ui-btn ui-btn-light ui-btn-no-caps" +
      (metaText ? " b24ql-link-search-result" : "");
    item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
    item.__b24qlLink = link;

    const textWrap = document.createElement("span");
    textWrap.className = "b24ql-link-text";

    const label = document.createElement("span");
    label.className = "b24ql-link-label";
    label.textContent = link.title;
    textWrap.appendChild(label);

    if (metaText) {
      textWrap.appendChild(createLinkMeta(metaText));
    }

    item.appendChild(textWrap);
    item.addEventListener("click", function () {
      openTemplateModal(link, true);
    });
    addMiddleClickHandlers(item, function () {
      openTemplateModal(link, true);
    });
    item.__b24qlActivate = function () {
      openTemplateModal(link, true);
    };
    return wrapLinkItem(item, link);
  }

  function wrapLinkItem(item, link) {
    const shell = document.createElement("div");
    shell.className = "b24ql-link-shell";
    searchOptionCounter += 1;
    item.id = "b24ql-search-option-" + searchOptionCounter;
    item.setAttribute("role", "option");
    shell.appendChild(item);

    if (!link || !link.id) {
      return shell;
    }

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "b24ql-favorite-toggle ui-btn ui-btn-xs ui-btn-light-border";
    favoriteButton.dataset.favoriteId = link.id;
    favoriteButton.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9L12 3Z"></path>',
      "</svg>"
    ].join("");
    favoriteButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavoriteLink(link);
    });
    shell.appendChild(favoriteButton);
    updateFavoriteButtons(shell);
    return shell;
  }

  function addMiddleClickHandlers(item, onMiddleClick) {
    item.addEventListener("mousedown", function (event) {
      if (event.button === 1) {
        stopLinkEvent(event);
      }
    }, true);

    item.addEventListener("auxclick", function (event) {
      if (event.button !== 1) {
        return;
      }

      stopLinkEvent(event);
      onMiddleClick();
    }, true);
  }

  function stopLinkEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  }

  function updateDirectActiveState(item, targetUrl) {
    const isActive = isCurrentPageUrl(targetUrl);
    item.classList.toggle("b24ql-link-active", isActive);
    item.classList.toggle("b24ql-link-current", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "page");
      item.title = "Текущая страница";
    } else {
      item.removeAttribute("aria-current");
      item.removeAttribute("title");
    }
  }

  function updateGroupActiveState(item, group) {
    const isActive = isGroupCurrentPage(group);
    item.classList.toggle("b24ql-link-active", isActive);
    item.classList.toggle("b24ql-link-current-group", isActive);
    item.title = isActive ? "Текущая страница находится внутри этого раздела" : "";
  }

  function refreshActiveLinks(root) {
    const scope = root || document;

    Array.from(scope.querySelectorAll(".b24ql-link[data-url]")).forEach(function (item) {
      updateDirectActiveState(item, item.dataset.url);
    });

    Array.from(scope.querySelectorAll(".b24ql-link-group")).forEach(function (item) {
      if (item.__b24qlLink) {
        updateGroupActiveState(item, item.__b24qlLink);
      }
    });
  }

  /* Избранные ссылки и окна хранятся по устойчивым идентификаторам кнопок. */
  function readFavoriteLinkIds() {
    const stored = getStoredValue(FAVORITE_LINKS_KEY);
    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.filter(function (id, index) {
      return typeof id === "string" && id && stored.indexOf(id) === index;
    });
  }

  function saveFavoriteLinkIds() {
    setStoredValue(FAVORITE_LINKS_KEY, favoriteLinkIds.slice());
  }

  function isFavoriteLink(link) {
    return Boolean(link && link.id && favoriteLinkIds.includes(link.id));
  }

  function toggleFavoriteLink(link) {
    if (!link || !link.id) {
      return;
    }

    const index = favoriteLinkIds.indexOf(link.id);
    if (index >= 0) {
      favoriteLinkIds.splice(index, 1);
    } else {
      favoriteLinkIds.push(link.id);
    }

    saveFavoriteLinkIds();
    updateFavoriteButtons();
    renderFavoritesSection();
  }

  function updateFavoriteButtons(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-favorite-toggle")).forEach(function (button) {
      const isFavorite = favoriteLinkIds.includes(button.dataset.favoriteId || "");
      button.classList.toggle("b24ql-favorite-active", isFavorite);
      button.setAttribute("aria-pressed", String(isFavorite));
      button.setAttribute("aria-label", isFavorite ? "Убрать из избранного" : "Добавить в избранное");
      button.title = isFavorite ? "Убрать из избранного" : "Добавить в избранное";
    });
  }

  function findLinkEntryById(linkId) {
    for (const section of sections) {
      const result = findLinkEntryInList(section.links, linkId, [section.title]);
      if (result) {
        return result;
      }
    }
    return null;
  }

  function findLinkEntryInList(links, linkId, path) {
    for (const link of links) {
      if (link.id === linkId) {
        return { link: link, path: path };
      }
      if (Array.isArray(link.links)) {
        const nested = findLinkEntryInList(link.links, linkId, path.concat(link.title));
        if (nested) {
          return nested;
        }
      }
    }
    return null;
  }

  function renderFavoritesSection() {
    const section = document.querySelector(".b24ql-favorites-section");
    if (!section) {
      return;
    }

    const grid = section.querySelector("#b24ql-favorites-grid");
    const count = section.querySelector(".b24ql-section-count");
    const entries = favoriteLinkIds.map(findLinkEntryById).filter(Boolean);

    if (grid) {
      grid.replaceChildren();
      entries.forEach(function (entry) {
        grid.appendChild(createLinkItem(entry.link, entry.path.join(" / ")));
      });
    }
    if (count) {
      setCounterValue(count, entries.length);
    }

    section.classList.toggle("b24ql-hidden", entries.length === 0);
    refreshActiveLinks(section);
    updateFavoriteButtons(section);
  }

  function setSearchInputValue(input, value) {
    if (!input) {
      return;
    }

    input.value = value;
    const clearButton = input.parentElement
      ? input.parentElement.querySelector(".b24ql-search-clear")
      : null;
    if (clearButton) {
      clearButton.classList.toggle("b24ql-hidden", input.value.length === 0);
    }
  }

  function getMainSearchValue() {
    const input = document.getElementById(SEARCH_INPUT_ID);
    return input ? input.value : "";
  }

  function focusMainSearch() {
    const input = document.getElementById(SEARCH_INPUT_ID);
    if (input) {
      input.focus();
      input.select();
    }
  }

  function clearSearchInput(input) {
    setSearchInputValue(input, "");
    if (input && input.id === SEARCH_INPUT_ID) {
      applyMainSearch("");
    } else {
      applySubSearch("");
    }
  }

  function handleSearchInputKeydown(event, input) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const options = getSearchOptions(input);
      if (options.length === 0) {
        return;
      }
      event.preventDefault();
      const currentIndex = searchSelectionIndexes.has(input)
        ? searchSelectionIndexes.get(input)
        : 0;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setSearchSelection(input, currentIndex + direction, true);
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const options = getSearchOptions(input);
    if (options.length === 0) {
      return;
    }
    event.preventDefault();
    const selectedIndex = searchSelectionIndexes.has(input)
      ? searchSelectionIndexes.get(input)
      : 0;
    const selected = options[Math.max(0, Math.min(selectedIndex, options.length - 1))];
    if (selected && typeof selected.__b24qlActivate === "function") {
      selected.__b24qlActivate(Boolean(event.metaKey || event.ctrlKey));
    }
  }

  function getSearchOptions(input) {
    let container = null;
    if (input && input.id === SEARCH_INPUT_ID) {
      container = document.getElementById("b24ql-search-results-grid");
    } else {
      container = document.getElementById("b24ql-subgrid");
    }
    if (!container) {
      return [];
    }

    return Array.from(container.querySelectorAll(".b24ql-link")).filter(function (item) {
      const shell = item.parentElement;
      return !item.hidden && !(shell && shell.hidden);
    });
  }

  function resetSearchSelection(input) {
    const options = getSearchOptions(input);
    searchSelectionIndexes.set(input, 0);
    options.forEach(function (item, index) {
      item.classList.toggle("b24ql-link-search-selected", index === 0);
    });
    if (options[0]) {
      input.setAttribute("aria-activedescendant", options[0].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function setSearchSelection(input, requestedIndex, scrollIntoView) {
    const options = getSearchOptions(input);
    if (options.length === 0) {
      resetSearchSelection(input);
      return;
    }

    const index = (requestedIndex + options.length) % options.length;
    searchSelectionIndexes.set(input, index);
    options.forEach(function (item, optionIndex) {
      item.classList.toggle("b24ql-link-search-selected", optionIndex === index);
    });
    input.setAttribute("aria-activedescendant", options[index].id);
    if (scrollIntoView && typeof options[index].scrollIntoView === "function") {
      options[index].scrollIntoView({ block: "nearest" });
    }
  }

  /* Во время поиска исходные кнопки удаляются из DOM, чтобы не держать второй
   * скрытый набор элементов и обработчиков рядом с результатами поиска. */
  function clearMainSourceLinks(modal) {
    Array.from(modal.querySelectorAll(".b24ql-source-section .b24ql-link-grid")).forEach(function (grid) {
      grid.replaceChildren();
    });

    const favoritesGrid = modal.querySelector("#b24ql-favorites-grid");
    if (favoritesGrid) {
      favoritesGrid.replaceChildren();
    }
  }

  function restoreMainSourceLinks(modal) {
    Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
      const sectionIndex = Number(sectionNode.dataset.sectionIndex);
      const section = Number.isInteger(sectionIndex) ? sections[sectionIndex] : null;
      const grid = sectionNode.querySelector(".b24ql-link-grid");
      if (!section || !grid) {
        return;
      }

      grid.replaceChildren();
      section.links.forEach(function (link) {
        grid.appendChild(createLinkItem(link));
      });
    });
  }

  function applyMainSearch(value) {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    const query = normalizeSearchValue(value);
    const searchResults = modal.querySelector(".b24ql-search-results");
    const searchResultsGrid = modal.querySelector("#b24ql-search-results-grid");
    const searchResultsCount = searchResults ? searchResults.querySelector(".b24ql-section-count") : null;
    const favoritesSection = modal.querySelector(".b24ql-favorites-section");
    const empty = modal.querySelector(".b24ql-empty");
    const mainContent = modal.querySelector(".b24ql-main-content");

    if (query) {
      if (mainContent && mainContent.dataset.b24qlSearchActive !== "true") {
        clearMainSourceLinks(modal);
        mainContent.dataset.b24qlSearchActive = "true";
      }
      const results = getFlatSearchResults(query);

      Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
        sectionNode.hidden = true;
      });
      if (favoritesSection) {
        favoritesSection.classList.add("b24ql-hidden");
      }

      if (searchResultsGrid) {
        searchResultsGrid.replaceChildren();
        results.forEach(function (result) {
          searchResultsGrid.appendChild(createLinkItem(result.link, result.path.join(" / ")));
        });
      }
      if (searchResultsCount) {
        setCounterValue(searchResultsCount, results.length);
      }
      if (searchResults) {
        searchResults.classList.toggle("b24ql-hidden", results.length === 0);
      }
      if (empty) {
        empty.classList.toggle("b24ql-hidden", results.length > 0);
      }
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      if (searchInput) {
        resetSearchSelection(searchInput);
      }
      return;
    }

    if (searchResultsGrid) {
      searchResultsGrid.replaceChildren();
    }
    if (searchResultsCount) {
      setCounterValue(searchResultsCount, 0);
    }
    if (searchResults) {
      searchResults.classList.add("b24ql-hidden");
    }
    if (empty) {
      empty.classList.add("b24ql-hidden");
    }
    if (mainContent && mainContent.dataset.b24qlSearchActive === "true") {
      restoreMainSourceLinks(modal);
      mainContent.dataset.b24qlSearchActive = "false";
    }
    renderFavoritesSection();

    Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
      const grid = sectionNode.querySelector(".b24ql-link-grid");
      const count = sectionNode.querySelector(".b24ql-section-count");
      if (!grid) {
        return;
      }

      const items = Array.from(grid.querySelectorAll(".b24ql-link"));
      items.forEach(function (item) {
        item.hidden = false;
        if (item.parentElement && item.parentElement.classList.contains("b24ql-link-shell")) {
          item.parentElement.hidden = false;
        }
      });

      sectionNode.hidden = false;
      sectionNode.classList.remove("b24ql-section-search-open");
      if (count) {
        setCounterValue(count, sectionNode.dataset.totalCount);
      }
    });
    const searchInput = document.getElementById(SEARCH_INPUT_ID);
    if (searchInput) {
      searchSelectionIndexes.delete(searchInput);
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function getFlatSearchResults(query) {
    const results = [];
    const seen = new Set();

    sections.forEach(function (section) {
      collectFlatSearchResults(section.links, [section.title], query, results, seen);
    });

    return results.sort(function (left, right) {
      return right.score - left.score || left.link.title.localeCompare(right.link.title, "ru");
    });
  }

  function collectFlatSearchResults(links, path, query, results, seen) {
    links.forEach(function (link) {
      if (Array.isArray(link.links)) {
        collectFlatSearchResults(link.links, path.concat(link.title), query, results, seen);
        return;
      }

      const score = getLinkMatchScore(link, query, path.join(" "));
      if (score <= 0) {
        return;
      }

      const resultKey = [link.id || getComparableUrl(link.url), link.title, path.join("/")].join("|");
      if (seen.has(resultKey)) {
        return;
      }

      seen.add(resultKey);
      results.push({
        link: link,
        path: path,
        score: score
      });
    });
  }

  function applySubSearch(value) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      return;
    }

    const query = normalizeSearchValue(value);
    const grid = subModal.querySelector("#b24ql-subgrid");
    const empty = subModal.querySelector(".b24ql-subempty");
    if (!grid) {
      return;
    }

    let totalVisible = 0;
    const rankedItems = Array.from(grid.querySelectorAll(".b24ql-link")).map(function (item) {
      const score = !query ? 1 : getLinkMatchScore(item.__b24qlLink || {}, query, "");
      return {
        item: item,
        shell: item.parentElement,
        score: score,
        order: Number(item.parentElement && item.parentElement.dataset.searchOrder) || 0
      };
    });

    rankedItems.sort(function (left, right) {
      return query ? right.score - left.score || left.order - right.order : left.order - right.order;
    }).forEach(function (entry) {
      const item = entry.item;
      const isVisible = entry.score > 0;
      item.hidden = !isVisible;
      if (entry.shell && entry.shell.classList.contains("b24ql-link-shell")) {
        entry.shell.hidden = !isVisible;
        grid.appendChild(entry.shell);
      }
      if (isVisible) {
        totalVisible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("b24ql-hidden", !query || totalVisible > 0);
    }
    const searchInput = subModal.querySelector("#" + SUBSEARCH_INPUT_ID);
    if (searchInput) {
      resetSearchSelection(searchInput);
    }
  }

  /* Обычный клик закрывает окно и обходит внутреннюю SPA-навигацию Bitrix24. */
  async function navigateDirectLinkInCurrentTab(url) {
    await closeModal(true);
    window.location.assign(getPortalUrl(url));
  }

  /* Открытие ссылок через background.js, чтобы новая вкладка создавалась надежно. */
  function openLinkInNewTab(url) {
    const targetUrl = getPortalUrl(url);
    const message = {
      type: "b24ql-open-tab",
      url: targetUrl
    };

    if (typeof browser !== "undefined" && browser.runtime &&
        typeof browser.runtime.sendMessage === "function") {
      sendRuntimeMessage(browser.runtime, message, targetUrl, true);
      return;
    }

    if (typeof chrome !== "undefined" && chrome.runtime &&
        typeof chrome.runtime.sendMessage === "function") {
      sendRuntimeMessage(chrome.runtime, message, targetUrl);
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  function sendRuntimeMessage(runtimeApi, message, fallbackUrl, promiseOnly) {
    let handled = false;
    const fallbackTimer = window.setTimeout(function () {
      if (!handled) {
        handled = true;
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    }, 600);

    const finish = function (response) {
      if (handled) {
        return;
      }

      handled = true;
      window.clearTimeout(fallbackTimer);

      if (!response || response.ok !== true) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    };

    try {
      const result = promiseOnly ? runtimeApi.sendMessage(message) : runtimeApi.sendMessage(message, finish);
      if (result && typeof result.then === "function") {
        result.then(finish, function () {
          finish(null);
        });
      } else if (promiseOnly) {
        finish(null);
      }
    } catch (error) {
      finish(null);
    }
  }

  /* Диалог подстановки ID в шаблонную ссылку. */
  function createTemplateModal() {
    const overlay = document.createElement("div");
    overlay.id = TEMPLATE_MODAL_ID;
    overlay.className = "b24ql-template-modal b24ql-hidden";

    const panel = document.createElement("div");
    panel.className = "b24ql-template-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "b24ql-template-title");

    const header = document.createElement("header");
    header.className = "b24ql-template-header";

    const title = document.createElement("h2");
    title.id = "b24ql-template-title";
    title.textContent = "Открыть по ID";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", closeTemplateModal);

    header.appendChild(title);
    header.appendChild(closeButton);

    const form = document.createElement("form");
    form.className = "b24ql-template-form";
    form.addEventListener("submit", handleTemplateSubmit);

    const fields = document.createElement("div");
    fields.className = "b24ql-template-fields";

    const error = document.createElement("div");
    error.className = "b24ql-template-error ui-alert ui-alert-danger b24ql-hidden";
    error.setAttribute("role", "alert");
    const errorMessage = document.createElement("span");
    errorMessage.className = "ui-alert-message";
    error.appendChild(errorMessage);

    const actions = document.createElement("div");
    actions.className = "b24ql-template-actions";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Отмена";
    styleUiAction(cancelButton, "outline", "md");
    cancelButton.addEventListener("click", closeTemplateModal);

    const openButton = document.createElement("button");
    openButton.type = "submit";
    openButton.id = "b24ql-template-open";
    openButton.textContent = "Открыть";
    styleUiAction(openButton, "primary", "md");

    const uiButtonHost = document.createElement("span");
    uiButtonHost.id = "b24ql-ui-button-host";
    uiButtonHost.className = "b24ql-ui-button-host b24ql-hidden";

    actions.appendChild(cancelButton);
    actions.appendChild(openButton);
    actions.appendChild(uiButtonHost);
    form.appendChild(fields);
    form.appendChild(error);
    form.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(form);
    overlay.appendChild(panel);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeTemplateModal();
      }
    });
    return overlay;
  }

  function openTemplateModal(link, openInNewTab) {
    if (!link || !link.template) {
      return;
    }

    const modal = ensureModal();
    const overlay = modal.querySelector("#" + TEMPLATE_MODAL_ID);
    if (!overlay) {
      return;
    }

    templateOpenInNewTab = Boolean(openInNewTab);
    overlay.__b24qlLink = link;
    const title = overlay.querySelector("#b24ql-template-title");
    const fields = overlay.querySelector(".b24ql-template-fields");
    const error = overlay.querySelector(".b24ql-template-error");
    const openButton = overlay.querySelector("#b24ql-template-open");
    const uiButtonHost = overlay.querySelector("#b24ql-ui-button-host");
    if (title) {
      title.textContent = link.title;
    }
    if (error) {
      error.querySelector(".ui-alert-message").textContent = "";
      error.classList.add("b24ql-hidden");
    }
    if (openButton) {
      setUiActionText(openButton, openInNewTab ? "Открыть в новой вкладке" : "Открыть");
    }
    if (uiButtonHost) {
      uiButtonHost.dataset.active = "true";
      uiButtonHost.dataset.text = openInNewTab ? "Открыть в новой вкладке" : "Открыть";
    }
    if (fields) {
      fields.replaceChildren();
      link.template.fields.forEach(function (field) {
        const fieldWrap = document.createElement("label");
        fieldWrap.className = "b24ql-template-field";

        const fieldLabel = document.createElement("span");
        fieldLabel.textContent = field.label;

        const input = document.createElement("input");
        input.className = "b24ql-template-input ui-ctl-element";
        input.type = "text";
        input.inputMode = field.inputMode || "numeric";
        input.autocomplete = "off";
        input.placeholder = field.placeholder || "";
        input.dataset.templateKey = field.key;
        input.dataset.inputMode = field.inputMode || "numeric";
        input.setAttribute("aria-label", field.label);

        fieldWrap.appendChild(fieldLabel);
        const control = document.createElement("div");
        control.className = "b24ql-template-control ui-ctl ui-ctl-textbox ui-ctl-w100";
        control.appendChild(input);
        fieldWrap.appendChild(control);
        fields.appendChild(fieldWrap);
      });
    }

    overlay.classList.remove("b24ql-hidden");
    document.dispatchEvent(new Event("b24ql-ui-render"));
    const firstInput = overlay.querySelector(".b24ql-template-input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeTemplateModal() {
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    if (!overlay) {
      return;
    }
    const uiButtonHost = overlay.querySelector("#b24ql-ui-button-host");
    if (uiButtonHost) {
      uiButtonHost.dataset.active = "false";
      document.dispatchEvent(new Event("b24ql-ui-dispose"));
    }
    overlay.classList.add("b24ql-hidden");
    overlay.__b24qlLink = null;
    templateOpenInNewTab = false;
  }

  function isTemplateModalOpen() {
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    return Boolean(overlay && !overlay.classList.contains("b24ql-hidden"));
  }

  function handleTemplateSubmit(event) {
    event.preventDefault();
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    const link = overlay && overlay.__b24qlLink;
    if (!overlay || !link || !link.template) {
      return;
    }

    const values = {};
    let invalidInput = null;
    Array.from(overlay.querySelectorAll(".b24ql-template-input")).forEach(function (input) {
      const value = input.value.trim();
      const isNumeric = input.dataset.inputMode !== "text";
      if (!value || (isNumeric && !/^[1-9]\d*$/.test(value))) {
        invalidInput = invalidInput || input;
        input.classList.add("b24ql-template-input-invalid");
        input.classList.add("--error");
      } else {
        input.classList.remove("b24ql-template-input-invalid");
        input.classList.remove("--error");
        values[input.dataset.templateKey] = value;
      }
    });

    const error = overlay.querySelector(".b24ql-template-error");
    if (invalidInput) {
      if (error) {
        error.querySelector(".ui-alert-message").textContent = "Введите корректный ID: целое число больше нуля";
        error.classList.remove("b24ql-hidden");
      }
      invalidInput.focus();
      return;
    }

    let targetUrl = link.template.url;
    Object.keys(values).forEach(function (key) {
      targetUrl = targetUrl.replace(new RegExp("\\{" + key + "\\}", "g"), encodeURIComponent(values[key]));
    });
    if (/\{[a-zA-Z][a-zA-Z0-9_]*\}/.test(targetUrl)) {
      if (error) {
        error.querySelector(".ui-alert-message").textContent = "В шаблоне ссылки осталось незаполненное поле";
        error.classList.remove("b24ql-hidden");
      }
      return;
    }

    const openInNewTab = templateOpenInNewTab;
    closeTemplateModal();
    if (openInNewTab) {
      openLinkInNewTab(targetUrl);
    } else {
      navigateDirectLinkInCurrentTab(targetUrl);
    }
  }

  /* Вложенное окно для групп ссылок: поддерживает переходы на несколько уровней внутрь. */
  function createSubModal() {
    const subModal = document.createElement("div");
    subModal.id = SUBMODAL_ID;
    subModal.className = "b24ql-submodal b24ql-hidden";
    subModal.setAttribute("role", "dialog");
    subModal.setAttribute("aria-labelledby", "b24ql-subtitle");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel b24ql-subpanel";

    const header = document.createElement("header");
    header.className = "b24ql-header b24ql-subheader";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "b24ql-subtitle";
    title.textContent = "";
    titleWrap.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "b24ql-subactions";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Вернуться назад");
    closeButton.title = "Вернуться";
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeSubModal();
    });

    actions.appendChild(closeButton);
    header.appendChild(titleWrap);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-subcontent";

    content.appendChild(createSearchBox(SUBSEARCH_INPUT_ID, "Поиск в разделе", applySubSearch));

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-subgrid";
    content.appendChild(grid);

    const empty = document.createElement("div");
    empty.className = "b24ql-empty b24ql-subempty ui-alert ui-alert-default b24ql-hidden";
    const emptyMessage = document.createElement("span");
    emptyMessage.className = "ui-alert-message";
    emptyMessage.textContent = "В этом разделе ничего не найдено";
    empty.appendChild(emptyMessage);
    content.appendChild(empty);

    subModal.addEventListener("click", function (event) {
      if (event.target === subModal) {
        closeSubModal();
      }
    });

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    subModal.appendChild(panel);
    return subModal;
  }

  function openLinkGroup(group) {
    if (!Array.isArray(group.links)) {
      return;
    }

    const subModal = document.getElementById(SUBMODAL_ID);
    const sourceSearchInput = subModal && !subModal.classList.contains("b24ql-hidden")
      ? subModal.querySelector("#" + SUBSEARCH_INPUT_ID)
      : document.getElementById(SEARCH_INPUT_ID);
    const sourceSearchValue = sourceSearchInput ? sourceSearchInput.value : "";

    if (subModal && !subModal.classList.contains("b24ql-hidden") && subModalStack.length > 0) {
      subModalStack.push(group);
    } else {
      subModalStack = [group];
    }

    renderLinkGroup(group, sourceSearchValue);
  }

  function renderLinkGroup(group, sourceSearchValue) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      return;
    }

    const title = subModal.querySelector("#b24ql-subtitle");
    const grid = subModal.querySelector("#b24ql-subgrid");
    if (!title || !grid) {
      return;
    }

    title.textContent = group.title;
    grid.replaceChildren();

    group.links.forEach(function (link, index) {
      const shell = createLinkItem(link);
      shell.dataset.searchOrder = String(index);
      grid.appendChild(shell);
    });

    const sourceQuery = normalizeSearchValue(sourceSearchValue || "");
    const shouldCarrySearch = Boolean(sourceQuery) &&
      !normalizeSearchValue(group.title).includes(sourceQuery) &&
      group.links.some(function (link) {
        return linkMatchesSearch(link, sourceQuery);
      });
    const searchInput = subModal.querySelector("#" + SUBSEARCH_INPUT_ID);
    setSearchInputValue(searchInput, shouldCarrySearch ? sourceSearchValue : "");
    refreshActiveLinks(subModal);
    applySubSearch(searchInput ? searchInput.value : "");

    subModal.classList.remove("b24ql-hidden");
  }

  function closeSubModal(forceClose) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      subModalStack = [];
      return;
    }

    if (!forceClose && subModalStack.length > 1 && !subModal.classList.contains("b24ql-hidden")) {
      subModalStack.pop();
      renderLinkGroup(subModalStack[subModalStack.length - 1], "");
      return;
    }

    subModalStack = [];
    subModal.classList.add("b24ql-hidden");
  }

  /* Сворачивание и разворачивание блоков основного окна. */
  function toggleSection(sectionNode, toggleButton, sectionTitle) {
    const collapsed = !sectionNode.classList.contains("b24ql-section-collapsed");
    sessionCollapsedSections[sectionTitle] = collapsed;
    sectionNode.classList.toggle("b24ql-section-collapsed", collapsed);
    updateSectionToggle(toggleButton, sectionTitle, collapsed);
  }

  function setSectionCollapsedState(sectionTitle, collapsed) {
    if (collapsed) {
      collapsedSections[sectionTitle] = true;
    } else if (DEFAULT_COLLAPSED_SECTIONS[sectionTitle]) {
      collapsedSections[sectionTitle] = false;
    } else {
      delete collapsedSections[sectionTitle];
    }
  }

  function updateSectionToggle(toggleButton, sectionTitle, collapsed) {
    toggleButton.setAttribute("aria-expanded", String(!collapsed));
    toggleButton.setAttribute(
      "aria-label",
      (collapsed ? "Развернуть блок " : "Свернуть блок ") + sectionTitle
    );
    toggleButton.title = collapsed ? "Развернуть" : "Свернуть";
  }

  function ensureModal() {
    let modal = document.getElementById(MODAL_ID);
    if (!modal) {
      modal = createModal();
      document.body.appendChild(modal);
    }
    return modal;
  }

  /* Открытие, закрытие и отслеживание изменений DOM Bitrix24 после внутренних перерисовок. */
  function openModal() {
    if (!findLeftMenuContainer()) {
      unmountButtonUntilMenuExists();
      return;
    }

    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    const modal = ensureModal();
    refreshMainContent();
    applyModalTheme(modal);
    renderFavoritesSection();
    refreshActiveLinks(modal);
    updateOpenAllButtons(modal);
    applyMainSearch(getMainSearchValue());
    modal.classList.remove("b24ql-hidden");
    document.documentElement.classList.add("b24ql-page-locked");
  }

  async function closeModal(forceClose) {
    const settingsClosed = await closeSettingsModal(forceClose);
    if (!settingsClosed) {
      return;
    }

    closeTemplateModal();
    closeSubModal(true);
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      if (runtimeOptions.destroyModalOnClose || isSafariUserscriptRuntime) {
        if (linksEditorNoticeTimer !== null) {
          window.clearTimeout(linksEditorNoticeTimer);
          linksEditorNoticeTimer = null;
        }
        modal.remove();
      } else {
        modal.classList.add("b24ql-hidden");
      }
    }
    document.documentElement.classList.remove("b24ql-page-locked");
  }

  function watchBitrixLayout() {
    if (runtimeOptions.leanLayoutWatcher || isSafariUserscriptRuntime) {
      watchBitrixLayoutLean();
      return;
    }

    let mountScheduled = false;
    let colorSyncScheduled = false;
    const observedThemeTargets = new WeakSet();

    const layoutObserver = new MutationObserver(function (mutations) {
      if (mountScheduled || !mutations.some(isRelevantLayoutMutation)) {
        return;
      }
      mountScheduled = true;
      window.requestAnimationFrame(function () {
        mountScheduled = false;
        mountButton();
        observeThemeTarget(document.body);
      });
    });

    const themeObserver = new MutationObserver(function (mutations) {
      if (colorSyncScheduled || !mutations.some(isPortalThemeMutation)) {
        return;
      }
      colorSyncScheduled = true;
      window.requestAnimationFrame(function () {
        colorSyncScheduled = false;
        const leftMenu = findLeftMenuContainer();
        const menuItem = document.getElementById(MENU_ITEM_ID);
        if (leftMenu && menuItem) {
          syncMenuItemColor(leftMenu, menuItem);
        }
      });
    });

    function observeThemeTarget(target) {
      if (!target || observedThemeTargets.has(target)) {
        return;
      }
      observedThemeTargets.add(target);
      themeObserver.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class", "style", "data-theme"]
      });
    }

    layoutObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    observeThemeTarget(document.documentElement);
    observeThemeTarget(document.body);
  }

  function watchBitrixLayoutLean() {
    let mountScheduled = false;
    let colorSyncScheduled = false;
    let observedMenuRoot = null;
    let menuObserver = null;
    let healthCheckTimer = null;
    const observedThemeTargets = new WeakSet();

    const themeObserver = new MutationObserver(function (mutations) {
      if (colorSyncScheduled || !mutations.some(isPortalThemeMutation)) {
        return;
      }
      colorSyncScheduled = true;
      window.requestAnimationFrame(function () {
        colorSyncScheduled = false;
        const leftMenu = findLeftMenuContainer();
        const menuItem = document.getElementById(MENU_ITEM_ID);
        if (leftMenu && menuItem) {
          syncMenuItemColor(leftMenu, menuItem);
        }
      });
    });

    function observeThemeTarget(target) {
      if (!target || observedThemeTargets.has(target)) {
        return;
      }
      observedThemeTargets.add(target);
      themeObserver.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class", "style", "data-theme"]
      });
    }

    function getMenuObserverRoot(leftMenu) {
      return leftMenu && (leftMenu.closest("#left-menu") || leftMenu);
    }

    function observeMenu(leftMenu) {
      const nextRoot = getMenuObserverRoot(leftMenu);
      if (nextRoot === observedMenuRoot) {
        return;
      }
      if (menuObserver) {
        menuObserver.disconnect();
      }
      observedMenuRoot = nextRoot;
      if (!nextRoot) {
        return;
      }
      menuObserver = new MutationObserver(function (mutations) {
        if (mutations.some(isRelevantLayoutMutation)) {
          scheduleMount();
        }
      });
      menuObserver.observe(nextRoot, {
        childList: true,
        subtree: true
      });
    }

    function mountAndObserve() {
      mountScheduled = false;
      mountButton();
      observeMenu(findLeftMenuContainer());
      observeThemeTarget(document.body);
    }

    function scheduleMount() {
      if (mountScheduled) {
        return;
      }
      mountScheduled = true;
      window.requestAnimationFrame(mountAndObserve);
    }

    function checkMenuHealth() {
      if (document.hidden) {
        return;
      }
      const menuItem = document.getElementById(MENU_ITEM_ID);
      const leftMenu = menuItem && menuItem.parentElement;
      if (!menuItem || !menuItem.isConnected || !leftMenu || !leftMenu.matches(LEFT_MENU_SELECTOR)) {
        scheduleMount();
        return;
      }
      observeMenu(leftMenu);
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        scheduleMount();
      }
    }

    function cleanup() {
      if (menuObserver) {
        menuObserver.disconnect();
      }
      themeObserver.disconnect();
      if (healthCheckTimer !== null) {
        window.clearInterval(healthCheckTimer);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    observeThemeTarget(document.documentElement);
    observeThemeTarget(document.body);
    observeMenu(findLeftMenuContainer());
    healthCheckTimer = window.setInterval(checkMenuHealth, 5000);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", cleanup, { once: true });
  }

  function isPortalThemeMutation(mutation) {
    if (mutation.type !== "attributes") {
      return false;
    }
    if (mutation.attributeName !== "class") {
      return true;
    }

    return getPortalClassName(mutation.target.className) !== getPortalClassName(mutation.oldValue);
  }

  function getPortalClassName(value) {
    return String(value || "")
      .split(/\s+/)
      .filter(function (className) {
        return className && !className.startsWith("b24ql-");
      })
      .sort()
      .join(" ");
  }

  function isRelevantLayoutMutation(mutation) {
    if (mutation.type !== "childList") {
      return false;
    }

    const menuItem = document.getElementById(MENU_ITEM_ID);
    const target = mutation.target instanceof Element
      ? mutation.target
      : mutation.target.parentElement;

    if (!target || isExtensionUiNode(target) || target === menuItem || menuItem?.contains(target)) {
      return false;
    }
    if (target.closest(LEFT_MENU_SELECTOR)) {
      return true;
    }

    return Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes)).some(function (node) {
      if (!(node instanceof Element) || isExtensionUiNode(node) || node === menuItem) {
        return false;
      }
      return node.matches(LEFT_MENU_SELECTOR) || Boolean(node.querySelector(LEFT_MENU_SELECTOR));
    });
  }

  function isExtensionUiNode(node) {
    return Boolean(node && typeof node.closest === "function" && node.closest("#" + MODAL_ID));
  }

  document.addEventListener("keydown", function (event) {
    const isSearchShortcut = (event.metaKey || event.ctrlKey) &&
      (event.code === "KeyK" || event.key.toLocaleLowerCase("ru-RU") === "k");

    if (isSearchShortcut) {
      event.preventDefault();
      openModal();
      focusMainSearch();
      return;
    }

    if (event.key === "Escape") {
      if (event.target && event.target.classList && event.target.classList.contains("b24ql-search-input") && event.target.value) {
        event.preventDefault();
        clearSearchInput(event.target);
        return;
      }

      if (isTemplateModalOpen()) {
        event.preventDefault();
        closeTemplateModal();
        return;
      }

      if (isSettingsModalOpen()) {
        event.preventDefault();
        closeSettingsModal();
        return;
      }

      closeModal();
    }
  });

  if (browserThemeQuery) {
    const handleBrowserThemeChange = function () {
      if (themePreference === "auto") {
        applyModalTheme();
      }
    };

    if (typeof browserThemeQuery.addEventListener === "function") {
      browserThemeQuery.addEventListener("change", handleBrowserThemeChange);
    } else if (typeof browserThemeQuery.addListener === "function") {
      browserThemeQuery.addListener(handleBrowserThemeChange);
    }
  }

  async function initialize() {
    if (extensionStorage) {
      await loadExtensionStorage();
    } else {
      migrateStoredConfiguration();
      applyStoredState();
    }
    mountButton();
    watchBitrixLayout();
  }

  initialize().catch(function (error) {
    console.error("B24 Quick Links: initialization failed", error);
  });
})();

})();
