import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

/**
 * REUSABLE TABLE COMPONENT
 *
 * Modern table component with glassmorphism design.
 *
 * Props:
 * - columns: array - Table column definitions [{ key, label, render, align }]
 * - data: array - Table data
 * - isLoading: boolean - Loading state
 * - error: object - Error object
 * - emptyMessage: string - Message when no data
 * - emptyIcon: ReactNode - Icon for empty state
 * - onRowClick: function - Called when row is clicked
 * - selectable: boolean - Enable row selection with checkboxes
 * - onSelectionChange: function - Called when selection changes
 * - pagination: boolean - Enable pagination (default: true)
 * - pageSize: number - Rows per page (default: 10)
 * - exportable: boolean - Enable export functionality
 * - exportFilename: string - Filename for export (default: 'data')
 */
const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  error = null,
  emptyMessage = 'No data available',
  emptyIcon: EmptyIcon,
  onRowClick,
  selectable = false,
  onSelectionChange,
  pagination = true,
  pageSize = 10,
  exportable = false,
  exportFilename = 'data',
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = paginatedData.map((row) => row.id);
      setSelectedRows(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = columns.filter((col) => col.key !== 'actions').map((col) => col.label);
    const rows = data.map((row) =>
      columns
        .filter((col) => col.key !== 'actions')
        .map((col) => {
          const value = row[col.key];
          return typeof value === 'object' ? JSON.stringify(value) : value;
        })
    );

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-slate-600 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-slate-500 text-sm mt-2">{error.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
        <div className="p-12 text-center">
          {EmptyIcon && (
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
              <EmptyIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
          <p className="text-slate-600 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Table
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 overflow-hidden">
      {/* Export Button */}
      {exportable && data.length > 0 && (
        <div className="px-6 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="text-sm text-slate-600">
            {selectedRows.length > 0 && (
              <span className="font-medium">{selectedRows.length} selected</span>
            )}
          </div>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/50 border-b border-slate-200">
            <tr>
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider ${
                    column.align === 'right' ? 'text-right' : ''
                  } ${column.align === 'center' ? 'text-center' : ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white/50 divide-y divide-slate-100">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => !selectable && onRowClick?.(row)}
                className={`hover:bg-white/80 transition-colors ${
                  onRowClick && !selectable ? 'cursor-pointer' : ''
                } ${selectedRows.includes(row.id) ? 'bg-purple-50/50' : ''}`}
              >
                {selectable && (
                  <td className="px-6 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-purple-600 border-slate-300 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap ${
                      column.align === 'right' ? 'text-right' : ''
                    } ${column.align === 'center' ? 'text-center' : ''}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="text-sm text-slate-600">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Show first, last, current, and adjacent pages
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[2rem] px-3 py-1 text-sm rounded-lg transition-all cursor-pointer ${
                        currentPage === page
                          ? 'bg-purple-600 text-white font-medium'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="text-slate-400">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
