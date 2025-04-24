!function(window, document, undefined) {
  "use strict";
  if (("undefined" == typeof context || "undefined" != typeof context && context == document) && void 0 !== window) {
    const main_nav_template = document.createElement("template");
    main_nav_template.innerHTML = '   \n    <nav class="main-navigation wwu-menu-closed" aria-label="Main">\n      <ul class="ultimenu ultimenu--horizontal ultimenu--htb ultimenu--basic">\n      </ul>\n    </nav>\n  ';
    class WWUMainNav extends HTMLElement {
      constructor() {
        super();
      }
      connectedCallback() {
        let element_exists = this.classList.contains("element-created");
        /* Create the custom element by appending the template */        const items = Array.from(this.children);
        if (!element_exists) {
          this.appendChild(main_nav_template.content.cloneNode(!0)), this.classList.add("element-created");
          const top_menu = this.querySelector(".ultimenu");
          for (const item of items) {
            if ("NAV" != item.tagName) {
              if ("A" == item.tagName) {
                const li = document.createElement("li");
                li.classList.add("ultimenu__item"), item.classList.add("ultimenu__link"), item.href === document.URL && (li.classList.add("is-active-trail"), 
                item.setAttribute("aria-current", "page")), li.append(item), top_menu.append(li);
              }
              if ("WWU-HAS-CHILDREN" == item.tagName) {
                const item_label = item.getAttribute("label"), sub_menus = Array.from(item.children), top_li = document.createElement("li");
                top_li.classList.add("ultimenu__item", "has-ultimenu"), top_li.innerHTML = `\n                <span class="component-icon expand-icon mobile" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg></span>\n                <span class="component-icon expand-icon desktop" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"></path><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path></svg></span>\n                <a href="#" class="ultimenu__link">${item_label}</a>\n\n                <section class="ultimenu__flyout">\n                  <div class="ultimenu__region">\n                  </div>\n                </section>\n              `;
                const ultimenu_region = top_li.querySelector(".ultimenu__region");
                for (const menu of sub_menus) {
                  const sub_menu_items = Array.from(menu.children), menu_label = menu.getAttribute("label"), wrapper = document.createElement("div");
                  wrapper.classList.add("ultimenusub");
                  const menu_list = document.createElement("ul");
                  if (menu_list.classList.add("menu"), menu_label) {
                    const title = document.createElement("h2");
                    title.classList.add("title"), title.innerText = menu_label, menu_list.append(title);
                  }
                  for (const sub_item of sub_menu_items) {
                    const sub_li = document.createElement("sub_li");
                    sub_li.classList.add("menu-item"), sub_li.append(sub_item), sub_item.href === document.URL && (top_li.classList.add("is-active-trail"), 
                    sub_item.setAttribute("aria-current", "page")), menu_list.append(sub_li);
                  }
                  wrapper.append(menu_list), ultimenu_region.append(wrapper);
                }
                top_menu.append(top_li), item.remove();
              }
            }
          }
        }
      }
    }
    window.customElements.get("wwu-main-nav") || window.customElements.define("wwu-main-nav", WWUMainNav);
  }
}(this, this.document);