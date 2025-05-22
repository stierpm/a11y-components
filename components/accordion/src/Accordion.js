/**
 * @file
 * Components - Accordion
 */

/**
 * Accessible Accordion
 * Functionality for an Accordion or group of Accordions using accessible methods
 * as described by WCAG: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
class A11yAccordion {
  constructor(wrapper) {
    this.expandedClass = 'is-expanded';
    this.wrapper = wrapper;
    this.accordionContent = null;
    this.accordionTrigger = null;
    this.init();
  }

  /**
   * Initializes the accordion component by setting up DOM element references
   * and attaching necessary event listeners for interaction.
   *
   * @return {void} Does not return any value.
   */
  init() {
    this.accordionTrigger = this.wrapper.querySelector('.c-accordion__trigger');
    this.accordionContent = this.wrapper.querySelector('.c-accordion__content');
    this.accordionTrigger.addEventListener('click', this.onClickTrigger);
    this.accordionTrigger.addEventListener('keydown', this.onKeydownTrigger);
  }

  /**
   * Toggles the expanded or collapsed state of a component.
   *
   * This function checks the current state of the component using the `isExpanded` method.
   * If the component is expanded, it will invoke the `collapse` method to collapse the component.
   * Otherwise, it will invoke the `expand` method to expand the component.
   *
   * Designed to be used as an event handler for a click event to trigger UI state changes.
   */
  onClickTrigger = () => {
    if (this.isExpanded()) {
      this.collapse();
    } else {
      this.expand();
    }
  };

  /**
   * Handles the 'keydown' event for an interactive element.
   *
   * This function is triggered when a keydown event occurs and is designed specifically
   * to respond to the 'Enter' or 'Space' keys. If either key is pressed, the default browser
   * behavior is prevented, and the function toggles between collapsing and expanding
   * the associated element based on its current state.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  onKeydownTrigger = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      // Check to see if class exists first.
      if (this.isExpanded()) {
        this.collapse();
      } else {
        this.expand();
      }
    }
  };

  /**
   * Expands the accordion by adding the expanded class to the relevant elements
   * and updating the aria-expanded attribute to indicate an expanded state.
   *
   * @return {void} Does not return a value.
   */
  expand() {
    this.accordionContent.classList.add(this.expandedClass);
    this.accordionTrigger.classList.add(this.expandedClass);
    this.accordionTrigger.setAttribute('aria-expanded', 'true');
  }

  /**
   * Collapses the accordion by removing the expanded class from the accordion content
   * and trigger elements, and updates the aria-expanded attribute to false.
   *
   * @return {void} Does not return a value.
   */
  collapse() {
    this.accordionContent.classList.remove(this.expandedClass);
    this.accordionTrigger.classList.remove(this.expandedClass);
    this.accordionTrigger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Checks whether the accordion section is currently expanded.
   *
   * This function determines the state of the accordion by checking if
   * the trigger element contains a specific CSS class that represents
   * the expanded state of the accordion.
   *
   * @return {boolean} True if the accordion is expanded, otherwise false.
   */
  isExpanded = () => this.accordionTrigger.classList.contains(this.expandedClass);
}

export default A11yAccordion;
