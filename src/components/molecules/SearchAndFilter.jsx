import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const SearchAndFilter = ({ onSearch, onFilter, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: "",
    category: "",
    dueDate: ""
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({ priority: "", category: "", dueDate: "" });
    onFilter({ priority: "", category: "", dueDate: "" });
    setIsFilterOpen(false);
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== "");

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <ApperIcon
            name="Search"
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-3 text-base"
          />
        </div>

        <Button
          variant={hasActiveFilters ? "accent" : "secondary"}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-4 py-3"
        >
          <ApperIcon name="Filter" size={18} />
          {hasActiveFilters && (
            <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full">
              {Object.values(filters).filter(f => f !== "").length}
            </span>
          )}
        </Button>
      </div>

      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.Id} value={category.Id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <select
                value={filters.dueDate}
                onChange={(e) => handleFilterChange("dueDate", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="overdue">Overdue</option>
                <option value="no-date">No due date</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setIsFilterOpen(false)}>
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchAndFilter;