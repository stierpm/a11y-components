# Front End A11Y Tools

A collection of front-end JavaScript libraries that adhere ceremoniously with WCAG guidelines.

---
01. [Accordion](#accordion)
---

## Accordion

### Features

- 🌟 Fully accessible implementation
- ⌨️ Keyboard navigation support
- 📱 Responsive design
- 🎨 Customizable styling
- 🔄 Toggle state management

### Installation

`npm install @stierpm/a11y-components`

### Basic Usage

**HTML**

```
<div class="c-accordion">
    <h3 class="c-accordion__heading">
        <button id="accordion-trigger-01" class="c-accordion__trigger" aria-expanded="false" aria-controls="accordion-section-01>
            Accordion Section
        </button>
    </h3>

    <div id="accordion-section-01" class="c-accordion__content" role="region" aria-labelledby="accordion-trigger-01">
        <p>This is the accordion content.</p>
    </div>
</div>
```

**JavaScript**

```
import { A11yAccordion } from '@stierpm/a11y-components';

document.addEventListener('DOMContentLoaded', function() { 
    document.querySelectorAll('.accordion').forEach(accordion => {
        new A11yAccordion(accordion);
    });
});

```
or custom configuration
```
import { A11yAccordion } from '@stierpm/a11y-components';

// Custom options
const accordion = new A11yAccordion(element, {
    triggerSelector: '.my-custom-trigger[aria-controls]',
    expandedClass: 'my-expanded-state'
});

```

### Required HTML Attributes

- `aria-expanded` on trigger button (automatically managed by the component)
- `aria-controls` on trigger button (must match content panel's ID)
- `id` on content panel (must match trigger's aria-controls value)
- `aria-labelledby` on content panel (must match trigger button's ID)
- `role="region"` on content panel

### Keyboard Support

- `Enter` or `Space`: Toggle accordion section
- Mouse click: Toggle accordion section
