import React, { useState, useEffect } from "react";
import Input from "@/component/ui/Input";

interface EscrowFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: "date" | "amount" | "deadline";
  sortOrder: "asc" | "desc";
  onSortChange: (
    field: "date" | "amount" | "deadline",
    order: "asc" | "desc",
  ) => void;

  minAmount?: string;
  maxAmount?: string;
  onAmountChange: (min: string, max: string) => void;
  fromDate?: string;
  toDate?: string;
  onDateChange: (from: string, to: string) => void;
}

const EscrowFilters: React.FC<EscrowFiltersProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  minAmount = "",
  maxAmount = "",
  onAmountChange,
  fromDate = "",
  toDate = "",
  onDateChange,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange, searchQuery]);

  return (
    <div className="space-y-6 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
      {/* Search and Sort Row - Keep existing grid logic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ... existing Input and Sort Selects ... */}
      </div>

      {/* Advanced Filters Row: Amount and Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        {/* Amount Range - Refactored for Mobile Stacking */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Amount Range
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full rounded-lg border-gray-300 p-2 border bg-white text-gray-900"
              value={minAmount}
              onChange={(e) => onAmountChange(e.target.value, maxAmount)}
            />
            <span className="hidden sm:block text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full rounded-lg border-gray-300 p-2 border bg-white text-gray-900"
              value={maxAmount}
              onChange={(e) => onAmountChange(minAmount, e.target.value)}
            />
          </div>
        </div>

        {/* Date Range - Refactored for Mobile Stacking */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Date Range
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="w-full">
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 p-2 border bg-white text-gray-900"
                value={fromDate}
                onChange={(e) => onDateChange(e.target.value, toDate)}
              />
            </div>
            <span className="text-gray-400 text-center sm:block">to</span>
            <div className="w-full">
              <input
                type="date"
                className="w-full rounded-lg border-gray-300 p-2 border bg-white text-gray-900"
                value={toDate}
                onChange={(e) => onDateChange(fromDate, e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowFilters;
