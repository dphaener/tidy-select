class TidySelect extends HTMLElement {
  readonly element: ShadowRoot
  observer: MutationObserver
  control: HTMLElement
  popover: HTMLElement
  list: HTMLElement
  valueElement: HTMLElement
  valueText: HTMLElement
  selectOptions: Node

  constructor() {
    super();

    this.element = this.attachShadow({mode: 'open'});
  }

  connectedCallback() {
    this.render();
    this.setAttribute('value', '');

    this.observer = new MutationObserver(() => this.reset());
    this.observer.observe(this, {childList: true, subtree: true});

    document.querySelector('html')?.addEventListener('click', this.closeAll);
  }

  render() {
    this.createControl();
    this.element.appendChild(this.control);
    this.applyCss();

    this.popover.addEventListener('click', this.stopPropagation);
    this.control.addEventListener('click', ev => this.toggle(ev));
    this.list.querySelectorAll('li').forEach(selectOption =>
      selectOption.addEventListener('click', ev => this.select(ev))
    );
  }

  reset() {
    this.element.innerHTML = '';
    this.setAttribute('value', '');

    this.render();
  }

  toggle(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();

    this.isOpen() ? this.close() : this.open();
  }

  open() {
    this.closeAll();
    this.control.classList.add('open');
  }

  close() {
    this.control.classList.remove('open');
  }

  closeAll() {
    const allSelects = document.body.querySelectorAll('tidy-select') as NodeListOf<TidySelect>;

    allSelects.forEach(select => select.close());
  }

  isOpen() {
    return this.control.classList.contains('open');
  }

  select(ev: Event) {
    let option;
    const target = ev.currentTarget as HTMLElement;
    const value = target.dataset.value || '';
    const options = this.querySelectorAll('option');

    for (const selectOption of options.entries()) {
      if (selectOption[1].value === value) {
        option = selectOption[1];
        break;
      }
    }

    this.setAttribute('value', value);
    this.dispatchEvent(new InputEvent('change'));
    this.valueText.textContent = option?.textContent || '';

    this.close();
  }

  stopPropagation(ev: Event) {
    ev.stopPropagation();
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
    this.valueText = document.createElement('span');

    this.valueElement.setAttribute('class', 'ts-dropdown');
    this.valueText.textContent = this.placeholder;
    this.valueText.setAttribute('class', 'ts-current-value');

    this.valueElement.appendChild(this.valueText);
  }

  createPopover() {
    this.popover = document.createElement('div');
    this.list = document.createElement('ul');
    this.createChildNodes();

    this.popover.setAttribute('class', 'ts-popover');
    this.list.setAttribute('class', 'ts-options');

    this.list.appendChild(this.selectOptions);
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

      frag.appendChild(item);
    });

    this.selectOptions = frag;
  }

  applyCss() {
    const style = document.createElement('style');
    style.textContent = this.css;

    this.element.appendChild(style);
  }

  get name() {
    return this.getAttribute('name');
  }

  get value() {
    return this.getAttribute('value');
  }

  get placeholder() {
    return this.getAttribute('placeholder') || 'Choose an item...';
  }

  get css() {
    return `
.ts-control {
  position: relative;
  width: 400px;
  background-color: #FFFFFF;
  margin-bottom: 0.75em;
}

.open .ts-dropdown {
  box-shadow: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: gray;
  border-bottom: none;
}

.ts-dropdown {
  border-radius: 6px;
  box-sizing: border-box;

  display: block;
  position: relative;
  padding: 12px 35px 12px 15px;
  width: 100%;
  font-weight: 400;
  border: 1px solid gray;
  border-bottom-color: gray;
  color: $brand-brown;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
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
  border-top: 6px solid gray;
  border-bottom: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.ts-popover {
  box-sizing: border-box;
  box-shadow: 0 2px 3px rgba(0,0,0,0.24);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;

  display: none;
  position: absolute;
  padding: 0;
  top: -1;
  right: 0;
  width: 100%;
  max-height: 400px;
  border: 1px solid gray;
  border-top: none;
  border-bottom-color: gray;
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
  font-size: 13px;
  color: #888;
}`;
  }
}

customElements.define('tidy-select', TidySelect);

export {TidySelect};
