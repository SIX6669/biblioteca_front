import { useState } from 'react';
import '../../styles/SearchFilter.css';

function SearchFilter({ filters, onFilter }) {
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => ({ 
      ...acc, 
      [filter.field]: filter.type === 'select' ? (filter.options?.[0]?.value || '') : '' 
    }), {})
  );

  const handleChange = (field, value) => {
    const newValues = { ...filterValues, [field]: value };
    setFilterValues(newValues);
    onFilter(newValues);
  };

  const handleClear = () => {
    const clearedValues = filters.reduce((acc, filter) => ({ 
      ...acc, 
      [filter.field]: filter.type === 'select' ? (filter.options?.[0]?.value || '') : '' 
    }), {});
    setFilterValues(clearedValues);
    onFilter(clearedValues);
  };

  const hasActiveFilters = Object.entries(filterValues).some(
    ([key, value]) => {
      const filter = filters.find(f => f.field === key);
      if (filter?.type === 'select') {
        return value !== filter.options?.[0]?.value;
      }
      return value !== '';
    }
  );

  return (
    <div className="search-filter">
      <div className="filter-inputs">
        {filters.map((filter, index) => (
          <div key={index} className="filter-group">
            <label htmlFor={filter.field} className="filter-label">
              {filter.label}
            </label>
            
            {filter.type === 'select' ? (
              <select
                id={filter.field}
                className="filter-input"
                value={filterValues[filter.field]}
                onChange={(e) => handleChange(filter.field, e.target.value)}
              >
                {filter.options?.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={filter.type || 'text'}
                id={filter.field}
                className="filter-input"
                placeholder={filter.placeholder}
                value={filterValues[filter.field]}
                onChange={(e) => handleChange(filter.field, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {hasActiveFilters && (
        <button className="btn-clear-filters" onClick={handleClear}>
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

export default SearchFilter;