!function(window, document, undefined) {
  "use strict";
  if (("undefined" == typeof context || "undefined" != typeof context && context == document) && void 0 !== window) {
    const search_template = document.createElement("template");
    search_template.innerHTML = '\n  <button class="toggle-settings" aria-expanded="false" aria-controls="search-menu">\n      <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#e8eaed"><g><path d="M0,0h24v24H0V0z" fill="none" /></g><g><path d="M7,9H2V7h5V9z M7,12H2v2h5V12z M20.59,19l-3.83-3.83C15.96,15.69,15.02,16,14,16c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 c0,1.02-0.31,1.96-0.83,2.75L22,17.59L20.59,19z M17,11c0-1.65-1.35-3-3-3s-3,1.35-3,3s1.35,3,3,3S17,12.65,17,11z M2,19h10v-2H2 V19z" /></g></svg></span>\n      <span class="toggle-text">Search Settings</span>\n  </button>\n\n  <div id="search-menu" class="search-menu black-bg closed">\n      <fieldset class="search-selection">\n          <legend>Search Scope</legend>\n          <div class="radio">\n              <input id="site-search" name="search-select" value="site" type="radio" checked>\n              <label for="site-search">This department or website only</label>\n          </div>\n          \n          <div class="radio">\n              <input id="full-search" name="search-select" value="full" type="radio">\n              <label for="full-search">All Western Washington University websites</label>\n          </div>\n      </fieldset>\n  </div>\n\n  <form class="search-area">\n      <label for="search-box" class="search-label">Search:</label>\n      <input id="search-box" name="q" type="search">\n      <button class="submit-search" type="submit">\n          <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg></span>\n          <span class="toggle-text">Go</span>\n      </button>\n  </form>\n  ';
    class WWUSearch extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        /* Create the custom element by appending the template */
        if (!this.classList.contains("element-created")) {
          this.appendChild(search_template.content.cloneNode(!0)), this.classList.add("element-created"), 
          this.querySelector(".search-area").addEventListener("submit", this.submitSearch.bind(this));
          var subdomain = window.location.hostname.split(".")[0];
          const close_icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', settings_icon = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#e8eaed"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M7,9H2V7h5V9z M7,12H2v2h5V12z M20.59,19l-3.83-3.83C15.96,15.69,15.02,16,14,16c-2.76,0-5-2.24-5-5s2.24-5,5-5s5,2.24,5,5 c0,1.02-0.31,1.96-0.83,2.75L22,17.59L20.59,19z M17,11c0-1.65-1.35-3-3-3s-3,1.35-3,3s1.35,3,3,3S17,12.65,17,11z M2,19h10v-2H2 V19z"/></g></svg>';
          "www" != subdomain && "search" != subdomain || (this.querySelector("#site-search").checked = !1, 
          this.querySelector("#full-search").checked = !0)
          /*------------------------------------------------------------------------------
        Menu Toggling
        ------------------------------------------------------------------------------*/;
          var search_toggle = this.querySelector(".toggle-settings"), settings_menu = this.querySelector(".search-menu");
          /* Close the menu -------------------------------------------------------------*/
          function close_display_settings() {
            document.removeEventListener("mouseup", click_outside), search_toggle.setAttribute("aria-expanded", !1), 
            search_toggle.querySelector(".component-icon").innerHTML = settings_icon, settings_menu.setAttribute("aria-hidden", !0), 
            settings_menu.classList.remove("open"), settings_menu.classList.add("closed");
          }
          function keyboard_close(event) {
            27 == event.keyCode && settings_menu.classList.contains("open") && (close_display_settings(), 
            search_toggle.focus());
          }
          function click_outside(event) {
            var isClickInside = settings_menu.contains(event.target), isClickToggle = search_toggle.contains(event.target);
            !settings_menu.classList.contains("open") || isClickInside || isClickToggle || close_display_settings();
          }
          /* Toggle the menu -----------------------------------------------------------*/          function toggle_settings() {
            return settings_menu.classList.contains("closed") ? (document.addEventListener("mouseup", click_outside), 
            search_toggle.setAttribute("aria-expanded", !0), search_toggle.querySelector(".component-icon").innerHTML = close_icon, 
            settings_menu.removeAttribute("aria-hidden"), settings_menu.classList.remove("closed"), 
            void settings_menu.classList.add("open")) : void close_display_settings();
          }
          /*------------------------------------------------------------------------------
        Initialize settings menu
        ---------------------------------------------------------------------------*/          search_toggle && (search_toggle.addEventListener("click", toggle_settings), 
          search_toggle.addEventListener("keyup", keyboard_close), settings_menu.addEventListener("keyup", keyboard_close));
        }
      }
      submitSearch(event) {
        event.preventDefault();
        var query = this.querySelector("#search-box").value, subdomain = window.location.hostname.split(".")[0];
        this.querySelector("#site-search").checked ? window.location.href = "https://search.wwu.edu/?q=" + encodeURIComponent(query) + " site%3A" + encodeURIComponent(subdomain) + ".wwu.edu" : window.location.href = "https://search.wwu.edu/?q=" + encodeURIComponent(query);
      }
    }
    window.customElements.get("wwu-search") || window.customElements.define("wwu-search", WWUSearch);
  }
}(this, this.document);