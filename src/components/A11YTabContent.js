/**
 * @file
 * Components - Tab Content
 */

export class A11yTabContent {
  constructor(element, options = {}) {
    // Default options
    const defaultOptions = {
      navigationSelector: '.tab-content__navigation',
      groupSelector: '.tab-content__group',
      triggerSelector: '.tab-content__trigger',
      expandedClass: 'is-expanded',
      breakpoint: 768,
    };

    // Merge default options with user-provided options
    this.options = {...defaultOptions, ...options};

    this.element = element;
    this.navigation = this.element.querySelector(this.options.navigationSelector);
    this.groups = this.element.querySelectorAll(this.options.groupSelector);
    this.triggers = this.element.querySelectorAll(this.options.triggerSelector);
    this.mediaQuery = null;
    this.state = null;
    this.init();
  }

  init() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener('click', this.onTriggerClick.bind(this));
      trigger.addEventListener('keydown', this.onTriggerKeydown.bind(this));
    });

    // Device or viewport change listener and on load.
    this.mediaQuery = window.matchMedia(`(min-width: ${this.options.breakpoint}px)`);
    this.mediaQuery.addEventListener('change', this.onMediaQueryChange.bind(this));
    this.onMediaQueryChange();
  }

  onMediaQueryChange() {
    if (this.mediaQuery.matches) {
      this.state = 'desktop';

      this.triggers.forEach((trigger, index) => {
        this.navigation.append(trigger);

        if (index !== 0) {
          this.collapseTrigger(trigger);
          this.groups[index].classList.remove(this.options.expandedClass);
        } else {
          this.expandTrigger(trigger);
          this.groups[0].classList.add(this.options.expandedClass);
        }
      });
    } else {
      this.state = 'mobile';

      this.triggers.forEach((trigger, index) => {
        this.groups[index].prepend(trigger);
        trigger.removeAttribute('tabindex');
      });
    }
  }

  collapseTrigger(element) {
    element.classList.remove(this.options.expandedClass);
    element.setAttribute('aria-selected', 'false');
    element.setAttribute('aria-expanded', 'false');

    if (this.state === 'desktop') {
      element.setAttribute('tabindex', '-1');
    }
  }

  expandTrigger(element) {
    element.classList.add(this.options.expandedClass);
    element.setAttribute('aria-selected', 'true');
    element.setAttribute('aria-expanded', 'true');

    if (this.state === 'desktop') {
      element.removeAttribute('tabindex');
    }
  }

  onTriggerClick(event) {
    const controlledGroup = this.getControlledByID(event.currentTarget);

    if (this.state === 'desktop') {
      if (
        !this.containsExpandedClass(event.currentTarget) &&
        !this.containsExpandedClass(controlledGroup)
      ) {
        this.triggers.forEach((trigger) => {
          this.collapseTrigger(trigger);
        });

        this.groups.forEach((group) => {
          group.classList.remove(this.options.expandedClass);
        });

        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.options.expandedClass);
      }
    }

    if (this.state === 'mobile') {
      if (this.containsExpandedClass(event.currentTarget)) {
        this.collapseTrigger(event.currentTarget);
        controlledGroup.classList.remove(this.options.expandedClass);
      } else {
        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.options.expandedClass);
      }
    }
  }

  onTriggerKeydown(event) {
    const controlledGroup = this.getControlledByID(event.currentTarget);

    if (this.state === 'desktop') {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        if (
          !this.containsExpandedClass(event.currentTarget) &&
          !this.containsExpandedClass(controlledGroup)
        ) {
          this.triggers.forEach((trigger) => {
            this.collapseTrigger(trigger);
          });

          this.groups.forEach((element) => {
            element.classList.remove(this.options.expandedClass);
          });

          this.expandTrigger(event.currentTarget);
          controlledGroup.classList.add(this.options.expandedClass);
        }
      }

      if (event.key === 'ArrowLeft') {
        if (event.currentTarget === this.triggers[0]) {
          setTimeout(() => {
            this.triggers[this.triggers.length - 1].focus();
          }, 1);
        } else {
          setTimeout(() => {
            event.target.previousElementSibling.focus();
          }, 1);
        }
      }

      if (event.key === 'ArrowRight') {
        if (event.currentTarget === this.triggers[this.triggers.length - 1]) {
          setTimeout(() => {
            this.triggers[0].focus();
          });
        } else {
          setTimeout(() => {
            event.target.nextElementSibling.focus();
          }, 1);
        }
      }

      if (event.key === 'Home') {
        setTimeout(() => {
          this.triggers[0].focus();
        }, 1);
      }

      if (event.key === 'End') {
        setTimeout(() => {
          this.triggers[this.triggers.length - 1].focus();
        })
      }
    }

    if (this.state === 'mobile') {
      if (this.containsExpandedClass(event.currentTarget)) {
        this.collapseTrigger(event.currentTarget);
        controlledGroup.classList.remove(this.options.expandedClass);
      } else {
        // Expand accordion.
        this.expandTrigger(event.currentTarget);
        controlledGroup.classList.add(this.options.expandedClass);
      }
    }
  }

  containsExpandedClass(target) {
    return target.classList.contains(this.options.expandedClass);
  }

  getControlledByID(target) {
    const controlID = target.getAttribute('aria-controls');
    return this.element.querySelector(`#${controlID}`);
  }
}
