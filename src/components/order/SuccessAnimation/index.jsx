import "./SuccessAnimation.css";

export default function SuccessAnimation() {
	return (
		<div className="success-anim" aria-hidden="true">
			<svg viewBox="0 0 80 80">
				<circle className="success-anim__circle" cx="40" cy="40" r="36" />
				<path className="success-anim__check" d="M24 41l11 11 21-23" />
			</svg>
		</div>
	);
}
