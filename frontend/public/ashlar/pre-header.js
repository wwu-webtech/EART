!function(window, document, undefined) {
  "use strict";
  if (("undefined" == typeof context || "undefined" != typeof context && context == document) && void 0 !== window) {
    const pre_header_template = document.createElement("template");
    pre_header_template.innerHTML = '\n  <link rel="stylesheet" href="https://ashlar.blob.core.windows.net/ashlar-theme-files/css/components/search.css" />\n  <link rel="stylesheet" href="https://ashlar.blob.core.windows.net/ashlar-theme-files/css/components/pre-header.css" />\n\n  <a href="#main-content" class="skip-link focusable icon-link">\n      <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg"\n          enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px">\n          <g>\n              <rect fill="none" height="24" width="24" />\n          </g>\n          <g>\n              <g>\n                  <polygon points="18,6.41 16.59,5 12,9.58 7.41,5 6,6.41 12,12.41" />\n                  <polygon points="18,13 16.59,11.59 12,16.17 7.41,11.59 6,13 12,19" />\n              </g>\n          </g>\n      </svg></span>\n      <span class="skip-link-text">Skip to Content </span>\n  </a>\n\n  <button class="toggle-settings" aria-expanded="false" aria-controls="settings-menu">\n      <span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg"\n          enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px">\n          <g>\n              <path d="M0,0h24v24H0V0z" fill="none" />\n              <path\n              d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />\n          </g>\n      </svg></span>\n      <span class="toggle-text">Display Settings</span>\n  </button>\n\n  <div id="settings-menu" class="settings-menu black-bg closed">\n      <div class="menu-container">\n          <fieldset class="theme-selection">\n              <legend>Theme</legend>\n              <div class="radio">\n                  <input id="default-theme" type="radio" name="theme-select" value="default-theme" checked="checked">\n                  <label for="default-theme">Default (System)</label>\n              </div>\n              <div class="radio">\n                  <input id="dark-mode" type="radio" name="theme-select" value="dark-mode">\n                  <label for="dark-mode">Dark</label>\n              </div>\n              <div class="radio">\n                  <input id="light-mode" type="radio" name="theme-select" value="light-mode">\n                  <label for="light-mode">Light</label>\n              </div>\n          </fieldset>\n          \n          <fieldset class="font-selection">\n              <legend>Font</legend>\n              <div class="radio">\n                  <input id="font--default" type="radio" name="font-select" value="font--default" checked="checked">\n                  <label for="font--default">Default</label>\n              </div>\n              <div class="radio">\n                  <input id="font--serif" type="radio" name="font-select" value="font--serif">\n                  <label for="font--serif">Serif</label>\n              </div>\n              <div class="radio">\n                  <input id="font--dyslexia-friendly" type="radio" name="font-select" value="font--dyslexia-friendly">\n                  <label for="font--dyslexia-friendly">Open Dyslexic</label>\n              </div>\n              <div class="radio">\n                  <input id="font--hyperlegible" type="radio" name="font-select" value="font--hyperlegible">\n                  <label for="font--hyperlegible">Hyperlegible</label>\n              </div>\n          </fieldset>\n          \n          \x3c!--fieldset class="language-selection">\n              <legend>Language</legend>\n              <input id="language--english" type="radio" name="font-select" value="language--english" checked="checked">\n              <label for="language--english">English</label>\n              <input id="language--spanish" type="radio" name="font-select" value="language--spanish">\n              <label for="language--spanish">Español</label>\n          </fieldset--\x3e\n      </div>\n      <button class="reset-button"><span class="component-icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg"\n          height="24px" viewBox="0 0 24 24" width="24px">\n          <path d="M0 0h24v24H0z" fill="none" />\n          <path\n          d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />\n      </svg></span> Reset preferences</button>\n  </div>   \n  ';
    class PreHeader extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        /* Create the custom element by appending the template -----------------------*/
        if (!this.classList.contains("element-created")) {
          this.appendChild(pre_header_template.content.cloneNode(!0)), this.classList.add("element-created");
          const close_icon = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', settings_icon = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>', search = document.createElement("wwu-search");
          search.setAttribute("role", "search"), search.setAttribute("aria-label", "Western"), 
          null != this.getAttribute("search-profile") && search.setAttribute("profile", this.getAttribute("search-profile")), 
          this.appendChild(search);
          /*------------------------------------------------------------------------------
        Menu functionality
        ------------------------------------------------------------------------------*/
          var stored_theme, selected_theme, selected_font, display_toggle = this.querySelector(".toggle-settings"), settings_menu = this.querySelector(".settings-menu"), body = document.querySelector("body"), html = document.querySelector("html"), theme_options = this.querySelector(".theme-selection"), system_theme = window.matchMedia("(prefers-color-scheme: dark)"), font_options = this.querySelector(".font-selection"), reset_preferences = this.querySelector(".reset-button");
          /* Close the menu -------------------------------------------------------------*/
          function close_display_settings() {
            document.removeEventListener("mouseup", click_outside), display_toggle.setAttribute("aria-expanded", !1), 
            display_toggle.querySelector(".component-icon").innerHTML = settings_icon, settings_menu.setAttribute("aria-hidden", !0), 
            settings_menu.classList.remove("open"), settings_menu.classList.add("closed");
          }
          function keyboard_close(event) {
            27 == event.keyCode && settings_menu.classList.contains("open") && (close_display_settings(), 
            display_toggle.focus());
          }
          function click_outside(event) {
            var isClickInside = settings_menu.contains(event.target), isClickToggle = display_toggle.contains(event.target);
            !settings_menu.classList.contains("open") || isClickInside || isClickToggle || close_display_settings();
          }
          /* Toggle the menu -----------------------------------------------------------*/          function toggle_settings() {
            return settings_menu.classList.contains("closed") ? (document.addEventListener("mouseup", click_outside), 
            display_toggle.setAttribute("aria-expanded", !0), display_toggle.querySelector(".component-icon").innerHTML = close_icon, 
            settings_menu.removeAttribute("aria-hidden"), settings_menu.classList.remove("closed"), 
            void settings_menu.classList.add("open")) : void close_display_settings();
          }
          /*------------------------------------------------------------------------------
        Theme settings
        ---------------------------------------------------------------------------*/          function set_initial_theme(system_theme) {
            /* Check if there is a preference stored -----------------------------------*/
            if (localStorage.getItem("wwu_preferred_theme")) {
              /* Find the menu option that matches local storage and check it ----------*/
              stored_theme = localStorage.getItem("wwu_preferred_theme");
              var theme_input_select = document.querySelector('input[value="' + String(stored_theme) + '"]');
              return theme_input_select && (theme_input_select.checked = !0), void set_theme(stored_theme);
            }
            /* If there's no preference, set default as the preference ---------------*/
            try {
              localStorage.setItem("wwu_preferred_theme", "default-theme");
            } catch (e) {
              return;
            }
          }
          /* Choose a new theme setting ------------------------------------------------*/          function select_theme() {
            set_theme(selected_theme = document.querySelector('input[name="theme-select"]:checked').value);
            try {
              localStorage.setItem("wwu_preferred_theme", selected_theme);
            } catch (e) {
              return;
            }
          }
          function set_theme(theme) {
            "light-mode" == theme ? 
            /* If light mode is selected, use light mode ---------------------------*/
            html.setAttribute("data-theme", "light") : "dark-mode" == theme || "default-theme" == theme && system_theme.matches ? 
            /* If dark mode is selected, use dark mode -----------------------------*/
            html.setAttribute("data-theme", "dark") : 
            /* Otherwise, use the default (light mode) -----------------------------*/
            html.setAttribute("data-theme", "light");
          }
          /*------------------------------------------------------------------------------
        Font settings
        ---------------------------------------------------------------------------*/
          // Set font in local storage
                    function set_font_preference() {
            if (localStorage.getItem("wwu_preferred_font")) {
              selected_font = localStorage.getItem("wwu_preferred_font");
              var selected_font_input = document.querySelector('input[value="' + String(selected_font) + '"]');
              return selected_font_input && (selected_font_input.checked = !0), void body.classList.add(selected_font);
            }
            try {
              localStorage.setItem("wwu_preferred_font", "font--default");
            } catch (e) {
              return;
            }
          }
          // Choose font from fieldset
                    function select_font() {
            var previous_font = selected_font;
            selected_font = document.querySelector('input[name="font-select"]:checked').value, 
            body.classList.remove(previous_font), body.classList.add(selected_font);
            try {
              localStorage.setItem("wwu_preferred_font", selected_font);
            } catch (e) {
              return;
            }
          }
          function global_reset(event) {
            var current_theme_value = localStorage.getItem("wwu_preferred_theme"), current_font_value = localStorage.getItem("wwu_preferred_font");
            if (event.target == reset_preferences && ("default-theme" !== current_theme_value || "font--default" !== current_font_value)) {
              var theme_default = theme_options.querySelector('input[value="default-theme"]'), font_default = font_options.querySelector('input[value="font--default"]');
              try {
                localStorage.setItem("wwu_preferred_theme", "default-theme"), localStorage.setItem("wwu_preferred_font", "font--default");
              } catch (e) {
                return;
              }
              set_theme("default-theme"), body.classList.add("font--default"), body.classList.remove("font--dyslexia-friendly", "font--hyperlegible", "font--serif"), 
              theme_default.checked = !0, font_default.checked = !0;
            }
          }
          /*------------------------------------------------------------------------------
        Initialize settings menu
        ---------------------------------------------------------------------------*/          display_toggle && (display_toggle.addEventListener("click", toggle_settings), 
          display_toggle.addEventListener("keyup", keyboard_close), settings_menu.addEventListener("keyup", keyboard_close)), 
          theme_options && theme_options.addEventListener("click", select_theme), font_options && font_options.addEventListener("click", select_font), 
          reset_preferences && reset_preferences.addEventListener("click", global_reset), 
          set_initial_theme(), set_font_preference();
        }
      }
    }
    window.customElements.get("wwu-pre-header") || window.customElements.define("wwu-pre-header", PreHeader);
  }
}(this, this.document);