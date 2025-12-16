import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

const FilterSection = ({ title, options, value, onChange }) => (
  <div className="space-y-3">
    <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            onClick={() => onChange(active ? '' : option)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              active ? 'border-accent text-accent bg-accent/10' : 'border-surface text-slate-300 hover:border-accent'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  </div>
);

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const update = (key) => (value) => onFilterChange({ ...filters, [key]: value });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-full border border-surface text-sm"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>

      <aside
        className={`fixed md:static inset-0 md:inset-auto z-40 md:z-auto bg-background/95 md:bg-transparent transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="w-72 max-w-full h-full md:h-auto p-5 space-y-6 bg-surface/90 md:bg-transparent border-r border-surface shadow-card backdrop-blur">
          <div className="flex items-center justify-between md:hidden">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-accent">
              Close
            </button>
          </div>
          <FilterSection
            title="Bag Type"
            options={['Handbag', 'Backpack', 'Tote', 'Duffle', 'Messenger']}
            value={filters.category}
            onChange={update('category')}
          />
          <FilterSection
            title="Material"
            options={['Leather', 'Canvas', 'Nylon', 'Vegan Leather']}
            value={filters.material}
            onChange={update('material')}
          />
          <FilterSection
            title="Color"
            options={['Black', 'Brown', 'Navy', 'Beige', 'Olive']}
            value={filters.color}
            onChange={update('color')}
          />
        </div>
      </aside>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 md:hidden" />}
    </>
  );
};

export default FilterSidebar;

