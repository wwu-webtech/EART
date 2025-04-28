!function(window, document, undefined) {
  "use strict";
  if (("undefined" == typeof context || "undefined" != typeof context && context == document) && void 0 !== window) {
    const header_template = document.createElement("template");
    header_template.innerHTML = '\n    <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Sans+Extra+Condensed:wght@300;400&family=Fira+Sans:ital,wght@0,300;0,400;0,600;0,700;0,900;1,300;1,400&family=Montserrat:wght@700;900&family=PT+Serif:wght@400;700&display=swap" rel="stylesheet" />\n    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />\n    <link rel="stylesheet" href="https://ashlar.blob.core.windows.net/ashlar-theme-files/css/normalize.css" />\n    <link rel="stylesheet" href="https://ashlar.blob.core.windows.net/ashlar-theme-files/css/ashlar-base.css" />\n    <link rel="stylesheet" href="https://ashlar.blob.core.windows.net/ashlar-theme-files/css/components/wwu-header.css" />\n\n    <button class="small toggle-menu" aria-expanded="false">\n        <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></span>\n        <span class="toggle-text">Menu</span>\n    </button>\n    \n    <nav class="wwu-menu wwu-menu-closed" aria-label="Western Quick Links">\n        <a class="small icon-link apply-quick-link" href="https://admissions.wwu.edu/apply">\n            <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" fill-rule="evenodd"/><g fill-rule="evenodd"><path d="M9 17l3-2.94c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-3-3zm2-5c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4"/><path d="M15.47 20.5L12 17l1.4-1.41 2.07 2.08 5.13-5.17 1.4 1.41z"/></g></svg></span>\n            Apply\n        </a>\n        \n        <a class="small icon-link give-quick-link" href="https://alumniq.wwu.edu/giving/make-a-gift">\n            <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg></span>\n            Give\n        </a>\n        \n        <a class="small icon-link report-bias-quick-link" href="https://equity.wwu.edu/sebrt/report-bias-incident">\n            <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/></svg></span>\n            Report Bias\n        </a>\n        \n        <a class="small icon-link my-western-link" href="https://mywestern.wwu.edu">\n            <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2c-4.97 0-9 4.03-9 9 0 4.17 2.84 7.67 6.69 8.69L12 22l2.31-2.31C18.16 18.67 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.3c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg></span>\n            myWestern\n        </a>\n        \n        <a class="small icon-link jobs-link" href="https://www.wwu.edu/workatwestern">\n            <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0zm10 5h4v2h-4zm0 0h4v2h-4z" fill="none"/><path d="M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z"/></svg></span>\n            Jobs\n        </a>\n    </nav>\n    \n    <div class="site-info wwu-menu-open">\n        <div class="western-logo">\n            <a class="wwu-home-link" href="https://www.wwu.edu">\n                <wwu-logo></wwu-logo>\n            </a>\n        </div>\n        \n        <div class="site-name">\n            <a href="/" class="home-link"></a>\n        </div>\n        \n        <div class="western-header-region">\n        </div>\n    </div>\n    ';
    class WWUHeader extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        /* Create the custom element by appending the template */
        if (!this.classList.contains("element-created")) {
          let site_name, site_name_link, region_content;
          this.appendChild(header_template.content.cloneNode(!0)), this.classList.add("element-created"), 
          null != this.getAttribute("sitename") && (site_name = this.getAttribute("sitename"), 
          this.querySelector(".home-link").innerText = site_name), null != this.getAttribute("sitename-link") && (site_name_link = this.getAttribute("sitename-link"), 
          this.querySelector(".home-link").setAttribute("href", site_name_link)), null != this.getAttribute("regioncontent") && (region_content = this.getAttribute("regioncontent"), 
          this.querySelector(".western-header-region").innerHTML = region_content)
          /*------------------------------------------------------------------------------
          Mobile menu functionality
          --------------------------------------------------------------------------*/;
          const menu_toggle = this.querySelector(".toggle-menu"), menu_icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>', close_icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', site_content = [ this.querySelector(".site-info"), document.querySelector(".page-content") ], mobile_menu = [ this.querySelector(".wwu-menu") ];
          function close_menu() {
            menu_toggle.setAttribute("aria-expanded", !1), menu_toggle.querySelector(".component-icon").innerHTML = menu_icon, 
            menu_toggle.querySelector(".toggle-text").innerHTML = "Menu", site_content.forEach((function(item) {
              item && (item.classList.remove("wwu-menu-closed"), item.classList.add("wwu-menu-open"));
            })), mobile_menu.forEach((function(item) {
              item && (item.classList.remove("wwu-menu-open"), item.classList.add("wwu-menu-closed"));
            }));
          }
          function toggle_menu() {
            return "Menu" == menu_toggle.querySelector(".toggle-text").innerHTML ? (menu_toggle.setAttribute("aria-expanded", !0), 
            menu_toggle.querySelector(".component-icon").innerHTML = close_icon, menu_toggle.querySelector(".toggle-text").innerHTML = "Close", 
            site_content.forEach((function(item) {
              item && (item.classList.remove("wwu-menu-open"), item.classList.add("wwu-menu-closed"));
            })), void mobile_menu.forEach((function(item) {
              item && (item.classList.remove("wwu-menu-closed"), item.classList.add("wwu-menu-open"));
            }))) : void close_menu();
          }
          function waitForElm(selector) {
            return new Promise((resolve => {
              if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
              }
              const observer = new MutationObserver((mutations => {
                document.querySelector(selector) && (resolve(document.querySelector(selector)), 
                observer.disconnect());
              }));
              observer.observe(document.body, {
                childList: !0,
                subtree: !0
              });
            }));
          }
          waitForElm(".main-navigation").then((elm => {
            mobile_menu[1] = document.querySelector(".main-navigation");
          })), 
          // Non-Drupal Applications
          null == document.querySelector(".is-ultimenu") && waitForElm(".nav-primary").then((elm => {
            mobile_menu[2] = document.querySelector(".nav-primary");
 // Wordpress
                    })), close_menu(), menu_toggle.addEventListener("click", toggle_menu);
        }
      }
    }
    window.customElements.get("wwu-header") || window.customElements.define("wwu-header", WWUHeader);
  }
}(this, this.document);