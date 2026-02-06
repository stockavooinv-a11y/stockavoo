import { Search } from 'lucide-react';

/**
 * REUSABLE SEARCH INPUT COMPONENT
 *
 * Consistent search input with icon following brand guidelines.
 *
 * Props:
 * - value: string - The search input value
 * - onChange: function - Handler for input changes
 * - placeholder: string - Placeholder text (default: "Search...")
 * - className: string (optional) - Additional CSS classes for the container
 * - fullWidth: boolean - Make input full width (default: false)
 */
const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  fullWidth = false,
}) => {
  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'flex-1 min-w-[200px] max-w-md'} ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-[#7C3E8C] focus:ring-2 focus:ring-[#7C3E8C]/20 transition-all outline-none"
      />
    </div>
  );
};

export default SearchInput;
