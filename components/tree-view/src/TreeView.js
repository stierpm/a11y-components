/**
 * @file
 * Base - TreeView
 */

/**
 * A11YTreeViewNavigation
 * A class that implements accessible tree view navigation following WAI-ARIA best practices.
 * Handles keyboard interactions, ARIA attributes, and focus management for hierarchical navigation
 * menus.
 */
class A11YTreeViewNavigation {
  /**
   * Constructs an instance of the class and initializes the tree view structure.
   *
   * @param {Object} node - The DOM node containing the menu structure. Must be of type object.
   * If not an object, the constructor exits without performing any actions.
   * @return {void} This constructor does not return any value.
   */
  constructor(node) {
    if (typeof node !== 'object') {
      return;
    }

    this.treeNode = node.querySelector(':scope > ul');
    this.treeItems = this.treeNode.querySelectorAll('.menu__link');
    this.subMenus = this.treeNode.querySelectorAll('ul:not(.menu--level-1)');
    this.initializeTreeViews();
  }

  /**
   * Initializes the tree views by setting up roles, attributes, and event listeners
   * to enable accessibility and functional behavior for tree navigation.
   *
   * @return {void} This method does not return a value.
   */
  initializeTreeViews() {
    this.treeNode.setAttribute('role', 'tree');
    this.adjustLinkAttributes();
    this.adjustSubMenuAttributes();
    this.attachTriggers();

    this.treeItems.forEach((item) => {
      item.addEventListener('keydown', this.onKeydown.bind(this));
    });
  }

  /**
   * Attaches trigger buttons to tree items that have group nodes and adds click event listeners for
   * trigger buttons. Each trigger button is appended as a child to its corresponding tree item and
   * is styled with the 'menu__link-trigger' class. The event listener is associated with the
   * `A11YTreeViewNavigation.onTriggerClick` handler.
   *
   * @return {void} This method does not return a value.
   */
  attachTriggers() {
    this.treeItems.forEach((item) => {
      const groupNode = A11YTreeViewNavigation.getGroupNode(item);
      const trigger = document.createElement('button');
      trigger.classList.add('menu__link-trigger');
      trigger.innerHTML = 'Open';
      trigger.tabIndex = -1;

      if (groupNode) {
        item.appendChild(trigger);
        trigger.addEventListener('click', A11YTreeViewNavigation.onTriggerClick);
      }
    });
  }

  // ATTRIBUTE MANAGEMENT
  /**
   * Adjusts and sets the necessary ARIA attributes for each tree item in the tree view navigation.
   * The method ensures that tree items are properly structured, have correct roles, and manage
   * their active states.
   * It also handles setting attributes for expandable items with children.
   *
   * @return {void} This method does not return any value.
   */
  adjustLinkAttributes() {
    this.treeItems.forEach((item) => {
      const linkText = item.textContent;
      const linkTextCleaned = A11YTreeViewNavigation.cleanForId(linkText);

      item.setAttribute('aria-role', 'tree-item');
      item.tabIndex = -1;

      if (item.classList.contains('is-active')) {
        item.setAttribute('aria-current', 'page');
        item.setAttribute('tabIndex', 0);
        A11YTreeViewNavigation.updateActiveTree(item);
      }

      if (item.nextElementSibling) {
        item.setAttribute('aria-owns', linkTextCleaned);
        item.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Adjusts the attributes of submenu elements to improve accessibility.
   * It iterates through each submenu, assigning appropriate ARIA roles
   * and IDs based on the cleaned version of their corresponding link text.
   *
   * @return {void} This method does not return a value.
   */
  adjustSubMenuAttributes() {
    this.subMenus.forEach((subMenu) => {
      const subMenuLink = subMenu.previousElementSibling;
      const subMenuLinkText = subMenuLink.textContent;
      const subMenuLinkTextCleaned = A11YTreeViewNavigation.cleanForId(subMenuLinkText);

      subMenu.setAttribute('aria-role', 'group');
      subMenu.setAttribute('id', subMenuLinkTextCleaned);
    });
  }

  /**
   * Handles keydown events for interactive tree navigation, allowing keyboard navigation within a
   * tree component.
   *
   * @param {KeyboardEvent} event The keyboard event triggered on keydown.
   * @return {void} Does not return a value. The method manages navigation and focus behavior for
   * the tree component.
   */
  onKeydown(event) {
    const { currentTarget } = event;
    const { key } = event;
    let flag = false;

    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    switch (key) {
      case ' ':
        flag = true;
        break;

      case 'Up':
      case 'ArrowUp':
        A11YTreeViewNavigation.setFocusToPreviousTreeItem(currentTarget);
        flag = true;
        break;

      case 'Down':
      case 'ArrowDown': {
        // This can all be deprecated once chapters are not split into separate nav elements
        if (
          currentTarget.classList.contains('menu__link--level-2') &&
          currentTarget === currentTarget.closest('ul').querySelector(':scope > li:last-of-type > [aria-role="tree-item"]')
        ) {
          currentTarget.closest('.book-navigation').nextElementSibling?.querySelector('.menu__link--level-1')?.focus();
        } else {
          A11YTreeViewNavigation.setFocusToNextTreeItem(currentTarget);
        }

        flag = true;
        break;
      }

      case 'Right':
      case 'ArrowRight':
        if (A11YTreeViewNavigation.isExpandable(currentTarget)) {
          if (A11YTreeViewNavigation.isExpanded(currentTarget)) {
            A11YTreeViewNavigation.setFocusToNextTreeItem(currentTarget);
          } else {
            A11YTreeViewNavigation.expandTreeItem(currentTarget);
          }
        }

        flag = true;
        break;

      case 'Left':
      case 'ArrowLeft':
        if (A11YTreeViewNavigation.isExpanded(currentTarget)) {
          A11YTreeViewNavigation.collapseTreeItem(currentTarget);
          flag = true;
        } else {
          A11YTreeViewNavigation.setFocusToPreviousTreeItem(currentTarget);
          flag = true;
        }
        break;

      case 'Home':
        A11YTreeViewNavigation.setFocusToTreeItem(this.treeItems[0]);
        flag = true;
        break;

      case 'End': {
        const visibleTreeItems = this.getVisibleTreeItems();
        A11YTreeViewNavigation.setFocusToTreeItem(visibleTreeItems[visibleTreeItems.length - 1]);
        flag = true;
        break;
      }

      default:
        // @TODO incorporate a keystroke letter search focus
        flag = true;
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  // STATIC ATTRIBUTE MANAGEMENT METHODS
  /**
   * Updates the active tree by traversing the parent elements of the given active element,
   * ensuring all menu items in the hierarchy are marked as expanded.
   *
   * @param {HTMLElement} activeElement - The currently active HTML element within the tree.
   * @return {void} This method does not return a value.
   */
  static updateActiveTree(activeElement) {
    let current = activeElement.parentElement;

    while (current) {
      if (current.classList.contains('menu-item')) {
        const parentLink = current.querySelector('a');

        if (parentLink && parentLink.hasAttribute('aria-expanded')) {
          parentLink.setAttribute('aria-expanded', 'true');
        }
      }

      current = current.parentElement;
    }
  }

  // STATIC EVENT METHODS
  /**
   * Handles the click event on a trigger element within a tree view navigation.
   * Expands or collapses the associated tree item based on its current state.
   * Prevents the default action and stops event propagation.
   *
   * @param {Event} event - The click event triggered by the interaction with the tree view trigger
   * element.
   * @return {void}
   */
  static onTriggerClick(event) {
    const { currentTarget } = event;

    if (A11YTreeViewNavigation.isExpanded(currentTarget.parentNode)) {
      A11YTreeViewNavigation.collapseTreeItem(currentTarget.parentNode);
    } else {
      A11YTreeViewNavigation.expandTreeItem(currentTarget.parentNode);
    }

    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * Collapses the specified tree item if it is expandable and currently expanded.
   *
   * @param {HTMLElement} treeItem - The tree item element to collapse.
   * @return {void}
   */
  static collapseTreeItem(treeItem) {
    if (A11YTreeViewNavigation.isExpandable(treeItem) &&
      A11YTreeViewNavigation.isExpanded(treeItem)) {
      treeItem.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Expands the given tree item if it is expandable and not already expanded.
   *
   * @param {HTMLElement} treeItem - The tree item element to be expanded.
   * @return {void} This method does not return a value.
   */
  static expandTreeItem(treeItem) {
    if (A11YTreeViewNavigation.isExpandable(treeItem) &&
      !A11YTreeViewNavigation.isExpanded(treeItem)) {
      treeItem.setAttribute('aria-expanded', 'true');
    }
  }

  /**
   * Sets the keyboard focus to the specified tree item.
   *
   * @param {HTMLElement} treeItem - The tree item element to which focus should be set.
   * @return {void}
   */
  static setFocusToTreeItem(treeItem) {
    treeItem.focus();
  }

  /**
   * Sets focus to the next tree item within an accessible tree view structure.
   *
   * @param {HTMLElement} treeItem The current tree item element to shift focus from.
   * @return {void} This method does not return any value.
   */
  static setFocusToNextTreeItem(treeItem) {
    if (A11YTreeViewNavigation.isExpanded(treeItem) &&
      treeItem.nextElementSibling.querySelectorAll(':scope > li > [aria-role="tree-item"]').length > 0
    ) {
      const subMenuTreeItems = treeItem.nextElementSibling.querySelectorAll(':scope > li > [aria-role="tree-item"]');
      A11YTreeViewNavigation.setFocusToTreeItem(subMenuTreeItems[0]);
    } else if (!A11YTreeViewNavigation.isExpanded(treeItem) &&
      treeItem.parentNode.nextElementSibling
    ) {
      const siblingTreeItem = treeItem.parentNode.nextElementSibling.querySelector('[aria-role="tree-item"]');
      A11YTreeViewNavigation.setFocusToTreeItem(siblingTreeItem);
    } else if (!A11YTreeViewNavigation.isExpanded(treeItem) &&
      !treeItem.parentNode.nextElementSibling &&
      treeItem.closest('ul').parentNode.nextElementSibling
    ) {
      const nextParentGroupItem = treeItem.closest('ul').parentNode.nextElementSibling;
      nextParentGroupItem.querySelector(':scope > [aria-role="tree-item"]')?.focus();
    }
  }

  /**
   * Sets focus to the previous tree item in a tree view structure, navigating through siblings
   * or parent elements as necessary. This method considers both expanded and non-expanded tree
   * items.
   *
   * @param {Element} treeItem - The current tree item element from which navigation should happen.
   * @return {void} Does not return any value. Focus is updated within the tree view structure.
   */
  static setFocusToPreviousTreeItem(treeItem) {
    if (treeItem.parentNode.previousElementSibling &&
      !A11YTreeViewNavigation.isExpanded(treeItem.parentNode.previousElementSibling.querySelector('[aria-role="tree-item"]'))
    ) {
      const siblingTreeItem = treeItem.parentNode.previousElementSibling.querySelector('[aria-role="tree-item"]');
      A11YTreeViewNavigation.setFocusToTreeItem(siblingTreeItem);
    } else if (treeItem.parentNode.previousElementSibling &&
      A11YTreeViewNavigation.isExpanded(treeItem.parentNode.previousElementSibling.querySelector('[aria-role="tree-item"]'))
    ) {
      const prevSiblingGroupItem = treeItem.parentNode.previousElementSibling.querySelector(':scope > ul > li:last-of-type > [aria-role="tree-item"]');
      A11YTreeViewNavigation.setFocusToTreeItem(prevSiblingGroupItem);
    } else if (!treeItem.parentNode.previousElementSibling &&
      treeItem.parentNode.parentNode.previousElementSibling) {
      const parentLink = treeItem.parentNode.parentNode.previousElementSibling;
      A11YTreeViewNavigation.setFocusToTreeItem(parentLink);
    }
  }

  // STATIC UTILITY METHODS
  /**
   * Processes a string to make it suitable for use as an identifier.
   *
   * @param {string} str - The string to be cleaned and processed.
   * @return {string} The cleaned and processed string, transformed to lowercase,
   * without special characters, trimmed, and with spaces replaced by hyphens.
   */
  static cleanForId(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace('open', ''); // Replace open button text with empty string
  }

  /**
   * Retrieves the group node associated with the given tree item.
   *
   * @param {Element} treeItem - The tree item element for which the group node is to be retrieved.
   * @return {Element|null} The group node element if found, or null if no associated group node
   * exists.
   */
  static getGroupNode(treeItem) {
    let groupNode;
    const id = treeItem.getAttribute('aria-owns');

    if (id) {
      groupNode = document.querySelector(`#${id}`);
    }

    return groupNode;
  }

  /**
   * Retrieves all visible tree items from the tree structure.
   *
   * @return {Array} An array of visible tree items.
   */
  getVisibleTreeItems() {
    const items = [];

    this.treeItems.forEach((item) => {
      if (A11YTreeViewNavigation.isVisible(item)) {
        items.push(item);
      }
    });

    return items;
  }

  /**
   * Determines whether a tree item is visible based on its parent's expanded state.
   *
   * @param {HTMLElement} treeItem - The tree item element to check for visibility.
   * @return {boolean} Returns true if the tree item is visible, otherwise false.
   */
  static isVisible(treeItem) {
    const flag = true;
    const parentTreeItem = treeItem.closest('ul').previousElementSibling;

    if (!parentTreeItem || !A11YTreeViewNavigation.isExpanded(parentTreeItem)) {
      return false;
    }

    return flag;
  }

  /**
   * Determines whether a tree item is expandable by checking the presence of the 'aria-expanded'
   * attribute.
   *
   * @param {HTMLElement} treeItem - The tree item element to check.
   * @return {boolean} True if the tree item has the 'aria-expanded' attribute, otherwise false.
   */
  static isExpandable(treeItem) {
    return treeItem.hasAttribute('aria-expanded');
  }

  /**
   * Determines if a tree item is expanded.
   *
   * @param {Element} treeItem - The tree item DOM element to check.
   * @return {boolean} Returns true if the tree item is expanded, otherwise false.
   */
  static isExpanded(treeItem) {
    return treeItem.getAttribute('aria-expanded') === 'true';
  }
}

export default A11YTreeViewNavigation;
