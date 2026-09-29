import { MinusIcon, PlusIcon } from "../Icons";
import { MAX_QTY_PER_ITEM } from "../../../config/constants";
import "./QuantitySelector.css";

// size: sm | md
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = MAX_QTY_PER_ITEM,
  size = "md",
}) {
  return (
    <div className={`qty qty--${size}`}>
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <MinusIcon />
      </button>
      <span className="qty__value" aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      >
        <PlusIcon />
      </button>
    </div>
  );
}