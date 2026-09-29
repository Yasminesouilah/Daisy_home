import "./VariantPicker.css";

export default function VariantPicker({ variants, selected, onSelect }) {
  if (!variants?.length) return null;

  return (
    <div className="variant-picker">
      {variants.map((group) => (
        <fieldset key={group.label} className="variant-picker__group">
          <legend className="variant-picker__label">{group.label}</legend>
          <div className="variant-picker__options">
            {group.options.map((option) => (
              <button key={option} type="button" className={`variant-picker__option ${selected === option ? "is-active" : ""}`} onClick={() => onSelect(option)} aria-pressed={selected === option}>
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}