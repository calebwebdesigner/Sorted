// styles
import styles from './ProjectFilter.module.css';

const filterList = ['all', 'assigned to me', 'design', 'development', 'marketing', 'sales'];

export default function ProjectFilter({ currentFilter, changeFilter }) {
  // run changeFilter (is passed in from Dashboard.js)
  const handleClick = newFilter => {
    changeFilter(newFilter);
  };

  return (
    <div className={styles.projectFilter}>
      <nav>
        <p>Filter:</p>

        {/* will reiterate over all the buttons whenever the filter changes, reapplying the appropriate class to each button (active or '') */}
        {filterList.map(filter => (
          <button key={filter} onClick={() => handleClick(filter)} className={currentFilter === filter ? 'active' : ''}>
            {filter}
          </button>
        ))}
      </nav>
    </div>
  );
}
