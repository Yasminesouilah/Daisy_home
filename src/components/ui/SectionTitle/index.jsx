import { Link } from "react-router-dom";
import { ArrowIcon } from "../Icons";

export default function SectionTitle({ eyebrow, title, children, viewAllTo, align = "left" }) {
	return (
		<div className={`section-title section-title--${align}`}>
			<div>
				<p className="eyebrow">{eyebrow}</p>
				<h2>{title ?? children}</h2>
			</div>
			{viewAllTo && (
				<Link to={viewAllTo} className="section-title__link">
					Voir tout <ArrowIcon width={16} height={16} />
				</Link>
			)}
		</div>
	);
}