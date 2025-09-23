# JavaScript A11Y Components

[![npm version](https://badge.fury.io/js/%40stierpm%2Fa11y-components.svg)](https://badge.fury.io/js/%40stierpm%2Fa11y-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A collection of front-end JavaScript libraries that adhere ceremoniously with WCAG guidelines. This package provides accessible, keyboard-navigable UI components including accordions and tab content with full ARIA support and responsive design capabilities.

## 🏷️ Keywords

`accessibility`, `a11y`, `accordion`, `wcag`, `frontend`, `javascript`

## 🐛 Issues & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/stierpm/a11y-components/issues) on GitHub.

## 👤 Author

**Philip Stier**

---
01. [Installation](#installation)
02. [Accordion](#accordion)
03. [Tab Content](#tab-content)
---

## Installation

`npm install @stierpm/a11y-components`

## Accordion

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design
- 🎨 Customizable styling
- 🔄 Toggle state management

### Basic Usage

**HTML**

```
<div class="accordion">
    <h3 class="accordion__heading">
        <button id="accordion-trigger-01" class="accordion__trigger" aria-expanded="false" aria-controls="accordion-section-01>
            Accordion Section
        </button>
    </h3>

    <div id="accordion-section-01" class="accordion__content" role="region" aria-labelledby="accordion-trigger-01">
        <p>This is the accordion content.</p>
    </div>
</div>
```

**JavaScript**

```
import { A11yAccordion } from '@stierpm/a11y-components';

document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.accordion').forEach(accordion => {
        new A11yAccordion(accordion, {options});
    });
});

```

### Options

| Option | Type | Default                                | Description |
|--------|------|----------------------------------------|-------------|
| `triggerSelector` | string | `'.accordion__trigger[aria-controls]'` | CSS selector for accordion trigger buttons |
| `contentSelector` | string | `'.accordion__content'`                | CSS selector for accordion content panels |
| `expandedClass` | string | `'is-expanded'`                        | CSS class applied to expanded trigger buttons |

### Required HTML Attributes

- `aria-expanded` on trigger button (automatically managed by the component)
- `aria-controls` on trigger button (must match content panel's ID)
- `id` on content panel (must match trigger's aria-controls value)
- `aria-labelledby` on content panel (must match trigger button's ID)
- `role="region"` on content panel

### Keyboard Support

- `Enter` or `Space`: Toggle accordion section
- Mouse click: Toggle accordion section

## Tab Content

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design
- 🎨 Customizable styling
- 🔄 Tab state management

### Basic Usage

**HTML**

```
<div class="tab-content">
  <div role="tablist" class="tab-content__navigation"></div>

  <div id="tab-content-01"
       class="tab-content__group is-expanded"
       role="tabpanel"
       aria-labelledby="tab-tab-content-01">
    <button type="button"
            id="tab-tab-content-01"
            class="tab-content__trigger is-expanded"
            role="tab"
            aria-haspopup="true"
            aria-selected="true"
            aria-expanded="true"
            aria-controls="tab-content-01">
      Tab 01
    </button>

    <div class="tab-content__content">
      <p>Text content goes here - Tab 01</p>
    </div>
  </div>
</div>
```

**JavaScript**

```
import { A11yTabContent } from '@stierpm/a11y-components';

document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.tab-content').forEach(tabContent => {
        new A11yTabContent(tabContent);
    });
});
```

### Options

| Option               | Type    | Default                      | Description                                         |
|----------------------|---------|------------------------------|-----------------------------------------------------|
| `navigationSelector` | string  | `'.tab-content__navigation'` | CSS selector for desktop navigation                 |
| `groupSelector`      | string  | `'.tab-content__group'`      | CSS selector for tab groups                         |
| `triggerSelector`      | string  | `'.tab-content__trigger'`    | CSS selector for tab buttons                        |
| `expandedClass`    | string  | `is-expanded`                | CSS selector for showing expanded groups            |
| `breakpoint`        | integer | `768`                        | Media breakpoint at which tabs switch to accordions |

### Required HTML Attributes

- `role="tablist"` on tab container
- `role="tab"` on each tab button
- `role="tabpanel"` on each content panel
- `aria-selected` on tab buttons (automatically managed by the component)
- `aria-controls` on tab buttons (must match panel's ID)
- `id` on content panels (must match tab's aria-controls value)
- `aria-labelledby` on content panels (must match tab button's ID)
- `tabindex` on tab buttons (automatically managed by the component)

### Keyboard Support

- `Arrow Left/Right`: Navigate between tabs
- `Home`: Move to first tab
- `End`: Move to last tab
- `Enter` or `Space`: Activate focused tab
- Mouse click: Activate tab
