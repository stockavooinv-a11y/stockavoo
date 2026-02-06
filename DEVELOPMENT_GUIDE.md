# Stockavoo Development Guide

This guide outlines all design rules, branding guidelines, component patterns, and best practices for developing the Stockavoo inventory management system.

---

## Table of Contents
1. [Brand Colors & Design System](#brand-colors--design-system)
2. [Component Architecture](#component-architecture)
3. [UI/UX Guidelines](#uiux-guidelines)
4. [Code Standards](#code-standards)
5. [Modal Design Patterns](#modal-design-patterns)
6. [Form Guidelines](#form-guidelines)
7. [RBAC Implementation](#rbac-implementation)

---

## Brand Colors & Design System

### Official Brand Colors

#### Primary Colors
- **Deep Purple** (Primary Brand): `#2A1142`
- **Medium Purple**: `#4A1D66`
- **Accent Purple**: `#7C3E8C` - Use for all interactive elements
- **Light Purple**: `#5B2C7A` - Hover states

#### Secondary Colors
- **Gold** (Accent): `#D4AF37`
- **Bright Gold**: `#FFD700`

### Usage Rules

**DO:**
- ✅ Use `#7C3E8C` for all primary buttons, focus states, and interactive elements
- ✅ Use `from-[#4A1D66] to-[#7C3E8C]` gradients for primary UI elements
- ✅ Use `from-[#D4AF37] to-[#FFD700]` gradients for special accents (logo, owner badges)
- ✅ Use `from-[#2A1142] via-[#4A1D66] to-[#2A1142]` for sidebar/navigation
- ✅ Use opacity variants: `/5`, `/10`, `/20`, `/30` for subtle effects

**DON'T:**
- ❌ Never use blue colors (`#3B82F6`, `#2563EB`, `blue-500`, `blue-600`)
- ❌ Never use random purple Tailwind utilities (`purple-500`, `purple-600`)
- ❌ Never use generic Tailwind color classes for brand elements
- ❌ Don't mix hex brand colors with Tailwind utilities

### Color Application Examples

```jsx
// Buttons
<button className="bg-[#7C3E8C] hover:bg-[#5B2C7A]">

// Focus states
<input className="focus:border-[#7C3E8C] focus:ring-2 focus:ring-[#7C3E8C]/20">

// Gradients - Primary
<div className="bg-gradient-to-br from-[#4A1D66] to-[#7C3E8C]">

// Gradients - Gold accent
<div className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700]">

// Shadows
<div className="shadow-lg shadow-[#7C3E8C]/30">
```

---

## Component Architecture

### Reusable Components Location
All reusable components should be in: `/src/components/common/`

### Current Reusable Components
1. **Button** - All button variations
2. **Input** - Form input fields
3. **SearchInput** - Search functionality with icon
4. **Modal** - Base modal for content/forms
5. **ConfirmationModal** - Dialog confirmations
6. **Table** - Data tables with pagination
7. **Toast** - Notification toasts
8. **VerificationBanner** - Email verification banner

### Component Export Pattern
All common components must be exported from `/src/components/common/index.js`:

```javascript
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as SearchInput } from './SearchInput';
// ... etc
```

### Component Import Pattern
Always import from common barrel export:

```javascript
// ✅ Correct
import { Button, Input, Modal } from '../components/common';

// ❌ Wrong
import Button from '../components/common/Button';
import Input from '../components/common/Input';
```

---

## UI/UX Guidelines

### Modal Design Principles

#### Size Guidelines
- **sm** (`max-w-md`) - Simple detail views, confirmations
- **md** (`max-w-2xl`) - Standard forms with multiple fields
- **lg** (`max-w-4xl`) - Complex forms with sections
- **xl** (`max-w-6xl`) - Wide content, tables
- **full** (`max-w-7xl`) - Full-width modals

#### Modal Design Rules
1. **Keep it Simple**: Avoid unnecessary visual elements
2. **No Large Avatars**: Don't use large decorative badges/avatars in modal content
3. **Minimal Backgrounds**: Avoid excessive `bg-slate-50` containers
4. **Clean Sections**: Use simple lists instead of boxed sections
5. **Compact Spacing**: Prefer `space-y-3` or `space-y-4` over larger gaps
6. **Icon Usage**: Small icons (w-4 h-4) next to text, not standalone

#### Good vs Bad Modal Design

**❌ BAD - Too Complex:**
```jsx
<Modal size="lg">
  <div className="p-6 space-y-6">
    {/* Large avatar */}
    <div className="flex justify-center pb-4 border-b">
      <div className="h-20 w-20 bg-gradient-to-br ...">
    </div>

    {/* Boxed sections */}
    <div>
      <h3>Contact Information</h3>
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="bg-white rounded p-3">
          {/* Nested boxes */}
        </div>
      </div>
    </div>
  </div>
</Modal>
```

**✅ GOOD - Simple & Clean:**
```jsx
<Modal size="sm">
  <div className="p-6 space-y-4">
    {/* Simple list with icons */}
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-sm">
        <Phone className="w-4 h-4 text-slate-400" />
        <span>{phone}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <Mail className="w-4 h-4 text-slate-400" />
        <span>{email}</span>
      </div>
    </div>
  </div>
</Modal>
```

### Search Component Guidelines

Always use the reusable `SearchInput` component:

```jsx
// ✅ Correct
<SearchInput
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search users..."
/>

// For full-width search
<SearchInput
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search stores..."
  fullWidth
/>

// ❌ Wrong - Don't recreate search inputs
<div className="relative">
  <Search className="..." />
  <input type="text" ... />
</div>
```

### Table vs Card Grid

**Use Tables For:**
- User management (many columns, detailed data)
- Data that benefits from column sorting
- Desktop-first interfaces

**Use Card Grids For:**
- Store listings (visual, location-based)
- Mobile-first interfaces
- When horizontal scroll is problematic
- 3-5 key data points per item

### Loading States

```jsx
// Spinner with brand color
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3E8C] mx-auto"></div>
```

### Cursor Pointer Rule

**CRITICAL: All clickable elements MUST have `cursor-pointer`**

This includes:
- Buttons (when not using Button component)
- Links
- Cards that open modals
- Action menu items
- Table rows (if clickable)
- Icons that trigger actions
- Tabs
- Custom inputs (select, checkbox, radio)
- Any `onClick` or `onClose` handlers

```jsx
// ✅ Correct - All clickable elements have cursor-pointer
<button className="... cursor-pointer">Click me</button>
<div onClick={handleClick} className="... cursor-pointer">Card</div>
<select className="... cursor-pointer">...</select>
<button onClick={onClose} className="... cursor-pointer">×</button>

// ❌ Wrong - Missing cursor-pointer
<button className="...">Click me</button>
<div onClick={handleClick} className="...">Card</div>
```

**Note**: The reusable `Button` component already includes `cursor-pointer`, so you don't need to add it manually when using `<Button>`.

---

## Code Standards

### File Organization

```
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── SearchInput.jsx
│   │   ├── Modal.jsx
│   │   └── index.js      # Barrel exports
│   ├── AddUserModal.jsx  # Feature-specific modals
│   └── StoreModal.jsx
├── pages/
│   ├── Users.jsx         # Page components
│   ├── Stores.jsx
│   └── dashboard/
│       └── Dashboard.jsx
└── store/
    └── api/
        ├── userApi.js    # RTK Query APIs
        └── storeApi.js
```

### Naming Conventions

- **Components**: PascalCase (e.g., `SearchInput.jsx`)
- **Files**: Same as component name
- **Props**: camelCase (e.g., `isOpen`, `onClose`)
- **Functions**: camelCase (e.g., `handleSubmit`, `formatDate`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ROLE_DESCRIPTIONS`)

### Import Order

```javascript
// 1. React/external libraries
import { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash } from 'lucide-react';

// 2. Store/API
import { useGetUsersQuery } from '../store/api/userApi';

// 3. Components
import { Button, Input, Modal } from '../components/common';
import AddUserModal from '../components/AddUserModal';

// 4. Utils/Helpers
import { getRoleLabel } from '../utils/rbac';

// 5. Contexts
import { useToast } from '../contexts/ToastContext';
```

---

## Form Guidelines

### Always Use Reusable Input Component

```jsx
// ✅ Correct
<Input
  label="Email Address"
  name="email"
  type="email"
  value={formData.email}
  onChange={handleChange}
  error={errors.email}
  placeholder="user@example.com"
  required
/>

// ❌ Wrong - Don't use native inputs
<input type="email" name="email" ... />
```

### Form Structure Pattern

```jsx
<form onSubmit={handleSubmit} className="p-6 space-y-6">
  {/* Section with border */}
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
      Section Title
    </h3>

    <Input ... />
    <Input ... />
  </div>

  {/* Actions - always at bottom with border-top */}
  <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
    <Button variant="secondary" onClick={onClose}>
      Cancel
    </Button>
    <Button variant="primary" type="submit" isLoading={isLoading}>
      Submit
    </Button>
  </div>
</form>
```

### Select & Textarea Guidelines

For now, select and textarea use native elements with consistent styling:

```jsx
// Select
<select
  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all bg-slate-50/50 focus:bg-white focus:border-[#7C3E8C] focus:ring-4 focus:ring-[#7C3E8C]/10 cursor-pointer"
>
  <option>Option 1</option>
</select>

// Textarea
<textarea
  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all bg-slate-50/50 focus:bg-white focus:border-[#7C3E8C] focus:ring-4 focus:ring-[#7C3E8C]/10 resize-none"
  rows="3"
/>
```

---

## Modal Design Patterns

### Standard Modal Usage

```jsx
<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  subtitle="Optional description"
  icon={<Icon className="w-6 h-6" />}
  size="md"
>
  <div className="p-6 space-y-4">
    {/* Content */}
  </div>
</Modal>
```

### Confirmation Modal Usage

```jsx
<ConfirmationModal
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={handleConfirm}
  title="Confirm Action"
  message="Are you sure you want to proceed?"
  confirmText="Delete"
  confirmVariant="danger"
  icon={<AlertCircle className="w-6 h-6" />}
/>
```

### Tab-Based Modal (e.g., StoreModal)

```jsx
const [activeTab, setActiveTab] = useState('single');

<Modal size="lg">
  <div className="p-6">
    {/* Tabs */}
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveTab('single')}
        className={activeTab === 'single'
          ? 'bg-[#7C3E8C] text-white shadow-lg shadow-[#7C3E8C]/30'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }
      >
        Single
      </button>
    </div>

    {/* Tab Content */}
    {activeTab === 'single' && <SingleForm />}
    {activeTab === 'bulk' && <BulkForm />}
  </div>
</Modal>
```

---

## RBAC Implementation

### Role Hierarchy
1. **Owner** - Full access (gold badge)
2. **Manager** - Create/update/read (purple badge)
3. **Staff** - Limited access (gray badge)

### Role Badge Component

```jsx
const getRoleConfig = (role) => {
  const configs = {
    owner: {
      icon: Shield,
      label: 'Owner',
      bgColor: 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]',
      textColor: 'text-[#2A1142]'
    },
    manager: {
      icon: UserCheck,
      label: 'Manager',
      bgColor: 'bg-gradient-to-r from-[#4A1D66] to-[#7C3E8C]',
      textColor: 'text-white'
    },
    staff: {
      icon: Users,
      label: 'Staff',
      bgColor: 'bg-gradient-to-r from-slate-500 to-slate-600',
      textColor: 'text-white'
    }
  };
  return configs[role] || configs.staff;
};
```

### Using RBACGuard

```jsx
import RBACGuard from '../components/RBACGuard';

// Wrap actions that require permissions
<RBACGuard resource="users" action="create">
  <Button onClick={openModal}>Add User</Button>
</RBACGuard>

<RBACGuard resource="stores" action="update">
  <button onClick={handleEdit}>Edit</button>
</RBACGuard>
```

---

## Toast Notifications

### Usage Pattern

```jsx
const toast = useToast();

// Success
toast.success('User created successfully!');

// Error
toast.error(error?.data?.message || 'Failed to create user');

// Warning
toast.warning('Created 5 stores. 2 failed.');

// Info
toast.info('Email verification sent');
```

### Toast appears automatically with:
- Brand-colored icons and accents
- Auto-dismiss after 5 seconds
- Manual close button
- Progress bar animation

---

## Dashboard Guidelines

### Role Display

Always show the user's role in the dashboard header:

```jsx
<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg">
  <div className="flex items-center justify-between">
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {userName}</p>
    </div>

    {/* Role Badge */}
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${roleConfig.bgColor} shadow-lg`}>
      <RoleIcon className={`w-4 h-4 ${roleConfig.textColor}`} />
      <span className={`text-sm font-semibold ${roleConfig.textColor}`}>
        {roleConfig.label}
      </span>
    </div>
  </div>
</header>
```

### Stat Cards

```jsx
<StatCard
  title="Total Products"
  value="124"
  change="+12%"
  trend="up"
  icon={Package}
  color="from-[#4A1D66] to-[#7C3E8C]"  // Brand gradient
/>

<StatCard
  title="Sales Today"
  value="$2,450"
  change="+8%"
  trend="up"
  icon={DollarSign}
  color="from-[#D4AF37] to-[#FFD700]"  // Gold gradient
/>
```

---

## Best Practices Checklist

### Before Creating New Components

- [ ] Check if a reusable component exists in `/components/common/`
- [ ] If similar functionality exists, extend or use existing component
- [ ] If creating new reusable component, add to `/components/common/`
- [ ] Export from `/components/common/index.js`

### Before Styling Elements

- [ ] Use brand hex colors, not Tailwind utilities
- [ ] Focus states use `focus:border-[#7C3E8C] focus:ring-2 focus:ring-[#7C3E8C]/20`
- [ ] Gradients use brand color combinations
- [ ] Interactive elements use `#7C3E8C` for primary actions
- [ ] Cursors are `cursor-pointer` for all clickable elements

### Before Creating Modals

- [ ] Choose appropriate size (sm for simple, md for forms)
- [ ] Keep design simple and clean
- [ ] Avoid large decorative elements
- [ ] Use simple icon + text lists
- [ ] Minimize background boxes and sections
- [ ] Actions at bottom with border-top

### Before Creating Forms

- [ ] Use reusable `Input` component
- [ ] Group related fields in sections with border-bottom headers
- [ ] Actions at bottom: Cancel (secondary) + Submit (primary)
- [ ] Show loading state on submit button
- [ ] Display validation errors inline

---

## Quick Reference

### Common Patterns

```jsx
// Page header with role
<header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b">

// Search bar
<SearchInput value={search} onChange={(e) => setSearch(e.target.value)} />

// Primary button
<Button variant="primary" onClick={action}>
  <Icon className="w-4 h-4" />
  Action
</Button>

// Card grid (stores/products)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Loading spinner
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3E8C]" />

// Empty state
<div className="text-center py-12">
  <Icon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
  <p className="text-slate-600">No items found</p>
</div>
```

---

## Notes for Future Development

1. **Consider creating reusable Select and Textarea components** to match Input component pattern
2. **Create reusable Filter component** for role/status filters (currently duplicated)
3. **Dashboard stat cards** could become a reusable component
4. **Action menu** pattern (three dots) could be extracted to reusable component
5. **Empty states** could use a reusable EmptyState component

---

**Last Updated**: February 2026
**Version**: 1.0
**Project**: Stockavoo Inventory Management System
