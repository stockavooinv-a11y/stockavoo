# Stockavoo Brand Guidelines

## Official Brand Colors

### Primary Colors
- **Deep Purple** (Primary Brand): `#2A1142` - Main dark purple
- **Medium Purple**: `#4A1D66` - Gradient middle
- **Accent Purple**: `#7C3E8C` - Interactive elements (links, buttons, focus states)
- **Light Purple**: `#5B2C7A` - Hover states

### Secondary Colors
- **Gold** (Accent): `#D4AF37` - Primary gold accent
- **Bright Gold**: `#FFD700` - Logo gradient end

### Usage Rules

**DO:**
- Use `#7C3E8C` for all primary buttons
- Use `#2A1142` to `#4A1D66` gradients for sidebar and hero sections
- Use `#D4AF37` for logo backgrounds and special accents
- Use `#7C3E8C` for links, focus rings, and active states

**DON'T:**
- Use blue (#3B82F6, #2563EB) - NOT part of brand
- Use random purples (purple-500, purple-600) - use our specific purples
- Mix purple and blue together
- Use purple for errors (use red) or success (use green)

### Tailwind Config

Add these to `tailwind.config.js`:

```javascript
colors: {
  brand: {
    'purple-dark': '#2A1142',
    'purple-mid': '#4A1D66',
    'purple': '#7C3E8C',
    'purple-light': '#5B2C7A',
    'gold': '#D4AF37',
    'gold-bright': '#FFD700',
  }
}
```

## Component-Specific Colors

### Buttons
- Primary: `bg-[#7C3E8C] hover:bg-[#5B2C7A]`
- Secondary: `bg-slate-100 hover:bg-slate-200`

### Focus States
- All inputs: `focus:ring-[#7C3E8C]`
- Checkbox/Radio: `text-[#7C3E8C]`

### Links
- Default: `text-[#7C3E8C]`
- Hover: `hover:text-[#5B2C7A]`

### Sidebar
- Background: `bg-gradient-to-b from-[#2A1142] via-[#4A1D66] to-[#2A1142]`
- Logo Badge: `bg-gradient-to-br from-[#D4AF37] to-[#FFD700]`

### Cards/Modals
- Background: `bg-white` with optional `border border-slate-200`
- Hover: `hover:border-[#7C3E8C]/30` for interactive cards

## Logo Usage
- Primary logo icon color: `#2A1142` (on gold background)
- Logo background: Gradient from `#D4AF37` to `#FFD700`
- Logo shape: Rounded square/rectangle with Package icon
