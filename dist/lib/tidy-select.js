class TidySelect extends HTMLElement {
    constructor() {
        super();
        this.element = this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        setTimeout(() => {
            var _a;
            this.setAttribute('value', '');
            this.render();
            this.observer = new MutationObserver(() => this.reset());
            this.attachMutationObserver();
            this.observer.observe(this, { childList: true, subtree: true });
            (_a = document.querySelector('html')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', this.closeAll);
        }, 0);
    }
    attachMutationObserver() {
        this.observer.observe(this, { childList: true, subtree: true });
    }
    render() {
        this.createInput();
        this.createControl();
        this.element.appendChild(this.control);
        this.setAttribute('tabindex', "0");
        this.applyCss();
        this.popover.addEventListener('click', this.stopPropagation);
        this.control.addEventListener('click', ev => this.toggle(ev));
        this.list.querySelectorAll('li').forEach(selectOption => selectOption.addEventListener('click', ev => this.select(ev)));
    }
    reset() {
        this.observer.disconnect();
        this.element.innerHTML = '';
        this.setAttribute('value', '');
        this.render();
        this.attachMutationObserver();
    }
    toggle(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.isOpen() ? this.close() : this.open();
    }
    open() {
        var _a, _b;
        this.closeAll();
        (_b = (_a = this.control) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.add('open');
    }
    close() {
        var _a, _b;
        (_b = (_a = this.control) === null || _a === void 0 ? void 0 : _a.classList) === null || _b === void 0 ? void 0 : _b.remove('open');
    }
    closeAll() {
        const allSelects = document.body.querySelectorAll('tidy-select');
        allSelects.forEach(select => select.close());
    }
    isOpen() {
        return this.control.classList.contains('open');
    }
    select(ev) {
        const target = ev.currentTarget;
        const value = target.dataset.value || '';
        this.selectFromValue(value);
        this.dispatchEvent(new InputEvent('change'));
        this.dispatchEvent(new InputEvent('blur'));
        this.close();
    }
    selectFromValue(value) {
        if (!value)
            return;
        const option = this.findOption(value);
        this.input.setAttribute('value', value);
        this.setAttribute('value', value);
        this.valueElement.textContent = (option === null || option === void 0 ? void 0 : option.textContent) || '';
        this.selectOptions.forEach(option => {
            if (option.getAttribute('data-value') === value) {
                option.setAttribute('class', 'selected');
            }
            else {
                option.removeAttribute('class');
            }
        });
    }
    findOption(value) {
        let option = null;
        const options = this.querySelectorAll('option');
        options.forEach(selectOption => {
            if (selectOption.value === value) {
                option = selectOption;
                selectOption.setAttribute('tidy-selected', 'tidy-selected');
            }
            else {
                selectOption.removeAttribute('tidy-selected');
            }
        });
        return option;
    }
    stopPropagation(ev) {
        ev.stopPropagation();
    }
    createInput() {
        this.input = document.createElement('input');
        this.input.setAttribute('name', this.name);
        this.input.setAttribute('value', this.value);
        this.input.style.display = 'none';
        this.appendChild(this.input);
    }
    createControl() {
        this.control = document.createElement('div');
        this.control.setAttribute('class', 'ts-control');
        this.createValueElement();
        this.createPopover();
        this.control.appendChild(this.valueElement);
        this.control.appendChild(this.popover);
    }
    createValueElement() {
        this.valueElement = document.createElement('a');
        this.valueElement.setAttribute('class', 'ts-dropdown');
        this.valueElement.textContent = this.placeholder;
    }
    createPopover() {
        this.popover = document.createElement('div');
        this.list = document.createElement('ul');
        const children = this.createChildNodes();
        this.popover.setAttribute('class', 'ts-popover');
        this.list.setAttribute('class', 'ts-options');
        this.list.appendChild(children);
        this.popover.appendChild(this.list);
    }
    createChildNodes() {
        const frag = document.createDocumentFragment();
        const options = this.querySelectorAll('option');
        options.forEach(option => {
            const item = document.createElement('li');
            const title = document.createElement('span');
            title.textContent = option.textContent;
            item.setAttribute('data-value', option.value);
            item.appendChild(title);
            if (option.hasAttribute('data-description')) {
                const desc = document.createElement('span');
                desc.setAttribute('class', 'ts-description');
                desc.textContent = option.getAttribute('data-description');
                item.appendChild(desc);
            }
            if (option.hasAttribute('tidy-selected')) {
                item.setAttribute('class', 'selected');
                this.input.setAttribute('value', option.value);
                this.setAttribute('value', option.value);
                this.valueElement.textContent = option.textContent;
            }
            frag.appendChild(item);
        });
        this.selectOptions = frag.querySelectorAll('li');
        return frag;
    }
    applyCss() {
        const style = document.createElement('style');
        style.textContent = this.css;
        this.element.appendChild(style);
    }
    get name() {
        return this.getAttribute('name') || '';
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    get value() {
        return this.getAttribute('value') || '';
    }
    get placeholder() {
        return this.getAttribute('placeholder') || 'Choose an item...';
    }
    get css() {
        return `
.ts-control {
  position: relative;
  width: var(--width, 400px);
  background-color: #FFFFFF;
}
.open .ts-dropdown {
  box-shadow: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: var(--border-color, gray);
  border-bottom: none;
}
.ts-dropdown {
  border-radius: var(--border-radius, 6px);
  box-sizing: border-box;
  display: block;
  position: relative;
  padding: var(--input-padding, 12px 35px 12px 15px);
  width: 100%;
  font-weight: 400;
  border: 1px solid var(--border-color, gray);
  border-bottom-color: var(--border-color, gray);
  color: var(--color, darkgray);
  font-size: var(--input-font-size, 16px);
  line-height: var(--input-line-height, 16px);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ts-dropdown::after {
  content: "";
  display: block;
  position: absolute;
  margin: -3px 0 0 0;
  top: 50%;
  right: 12px;
  width: 0;
  height: 0;
  border-top: 6px solid var(--arrow-color, gray);
  border-bottom: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.ts-popover {
  box-sizing: border-box;
  box-shadow: 0 2px 3px rgba(0,0,0,0.24);
  border-bottom-left-radius: var(--border-radius, 6px);
  border-bottom-right-radius: var(--border-radius, 6px);
  display: none;
  position: absolute;
  padding: 0;
  top: -1;
  right: 0;
  width: 100%;
  max-height: 400px;
  border: 1px solid var(--border-color, gray);
  border-top: none;
  border-bottom-color: var(--border-color, gray);
  background-color: #fff;
  background-color: rgba(255,255,255,0.95);
  z-index: 1000;
  cursor: auto;
  overflow-y: auto;
}
.open .ts-popover {
  display: block;
}
.ts-options {
  list-style-type: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
}
li {
  padding: 12px 15px;
  border-bottom: 1px solid lightgray;
}
li:hover {
  background-color: #fafafa;
}
li.selected {
  background-color: #fafafa;
}
.ts-title {
  display: block;
  font-size: 14px;
  line-height: 20px;
  color: #444;
}
.ts-description {
  display: block;
  padding-top: 4px;
  font-size: var(--description-font-size, 13px);
  color: #888;
}
.ts-current-value {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  display: inline-block;
}`;
    }
}
if (customElements.get('tidy-select') === undefined) {
    customElements.define('tidy-select', TidySelect);
}
export { TidySelect };
