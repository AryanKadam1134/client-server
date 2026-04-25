# Theme System Documentation

## Overview
Your project now has a comprehensive, professional theme system with both **Light Mode** and **Dark Mode** that are fully consistent throughout the application.

## Color Palette

### Light Mode
- **Primary Background**: `#ffffff` (pure white)
- **Secondary Background**: `#f8f9fa` (very light gray)
- **Tertiary Background**: `#f0f1f3` (light gray)
- **Hover State**: `#e8eaed` (subtle hover gray)
- **Primary Text**: `#1a1a1a` (near-black)
- **Secondary Text**: `#4a4a4a` (medium gray)
- **Tertiary Text**: `#6b7280` (light gray)
- **Borders**: `#e5e7eb` (light gray)

### Dark Mode (Subtle & Eye-Friendly)
- **Primary Background**: `#0f0f0f` (warm, almost black)
- **Secondary Background**: `#1a1a1a` (slightly lighter)
- **Tertiary Background**: `#242424` (for surfaces/cards)
- **Hover State**: `#2d2d2d` (subtle hover)
- **Primary Text**: `#f5f5f5` (soft white)
- **Secondary Text**: `#d4d4d4` (light gray)
- **Tertiary Text**: `#9ca3af` (muted gray)
- **Borders**: `#2d2d2d` to `#404040` (subtle dark borders)

## Input Component Styling

### Input States (Light Mode)
- **Normal**: White background with gray border
- **Focused**: Light gray background with blue ring
- **Error**: Red border (2px)
- **Disabled**: Light gray background, reduced opacity

### Input States (Dark Mode)
- **Normal**: `#1a1a1a` background with subtle dark border
- **Focused**: `#262626` background with blue ring
- **Error**: Lighter red border for better visibility
- **Disabled**: Same as focused, reduced opacity

## Tailwind Color Tokens

All components use these Tailwind extend colors for consistency:

```
light-bg-primary, light-bg-secondary, light-bg-tertiary, light-bg-hover
light-text-primary, light-text-secondary, light-text-tertiary
light-border-primary, light-border-secondary
light-input-* (bg, bgFocus, border, text, placeholder, error)

dark-bg-primary, dark-bg-secondary, dark-bg-tertiary, dark-bg-hover
dark-text-primary, dark-text-secondary, dark-text-tertiary
dark-border-primary, dark-border-secondary
dark-input-* (bg, bgFocus, border, text, placeholder, error)
```

## Components Updated

### Core Components
- ✅ **Header**: Theme-aware with proper text and border colors
- ✅ **SideBar**: Active states, hover states, logout button styling
- ✅ **DashboardLayout**: Background colors updated
- ✅ **Table**: Header, body, loading, and empty states

### UI Components
- ✅ **CustomInput**: Full UX design with error/focus/normal states
- ✅ **CustomTextArea**: Uses input styling
- ✅ **CustomSelect**: Dropdown menu with theme colors
- ✅ **CustomMultiSelect**: Chips and dropdown styling
- ✅ **CustomDatePicker**: Uses input styling
- ✅ **CustomRadioButtons**: Theme-aware with accent colors
- ✅ **CustomCheckbox**: Theme-aware checkboxes
- ✅ **FieldError**: Red error messages with dark mode support
- ✅ **DeleteButton**: Red buttons with proper contrast
- ✅ **EditButton**: Green buttons with proper contrast
- ✅ **DragDropUpload**: Border, text, icon colors all themed

### Pages
- ✅ **Authentication**: Full theme support with proper contrast
- ✅ **Dashboard**: Image upload, resume upload sections themed

## Usage in Components

### Using Theme Colors in New Components

```jsx
// For text
<p className="text-light-text-primary dark:text-dark-text-primary">
  Content
</p>

// For backgrounds
<div className="bg-light-bg-primary dark:bg-dark-bg-primary">
  Content
</div>

// For borders
<div className="border border-light-border-primary dark:border-dark-border-primary">
  Content
</div>

// For inputs - use the getInputClass utility
import { inputClass } from "../../utils/getInputClass";
<input className={inputClass(error)} />
```

## Key Design Decisions

1. **Subtlety**: Dark mode uses warm neutrals (#0f0f0f base) instead of pure black for reduced eye strain
2. **Consistency**: All text colors follow the same hierarchy (primary/secondary/tertiary) in both modes
3. **Input UX**: Input styling is carefully designed to differentiate states:
   - Normal: Subtle border
   - Focused: Slightly brighter background with blue ring
   - Error: Clear red border (2px)
   - Disabled: Same as focused but with reduced opacity
4. **Contrast**: All text meets WCAG contrast requirements in both modes
5. **No Harsh Transitions**: Smooth transitions between hover/focus states

## Theme Toggle

The theme is managed by the `ThemeContext` in `src/context/ThemeContext.jsx`:
- Persists to localStorage
- Respects system preference on first load
- Toggle available in Header component

## Future Customization

If you want to adjust colors:
1. Edit `tailwind.config.js`
2. Update the `colors.light` and `colors.dark` objects
3. All components will automatically use the new palette

Example:
```js
light: {
  bg: {
    primary: "#yourcolor",
    // ...
  }
}
```

---

**Version**: 1.0
**Last Updated**: 2026-04-25
