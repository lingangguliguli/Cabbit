// React concepts: props, lists and keys, event handling, conditional rendering

const RIDE_TYPES = ['All', 'Bike', 'Auto', 'Mini', 'Sedan', 'SUV', 'Premium', 'Electric'];

export default function RideTypeFilter({ activeFilter = 'All', onFilterChange }) {
  return (
    <div className="hide-scrollbar w-full overflow-x-auto pb-2">
      <div className="flex w-max gap-2">
        {RIDE_TYPES.map((type) => {
          const isActive = activeFilter === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onFilterChange(type)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'border-cab-blue bg-cab-blue text-white shadow-blue-sm'
                  : 'border-cab-border bg-cab-surface text-cab-muted hover:border-cab-border-active hover:text-cab-text'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}
