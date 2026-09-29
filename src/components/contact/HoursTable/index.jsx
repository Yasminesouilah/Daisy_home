import { BUSINESS_HOURS } from "../../../config/site";
import "./HoursTable.css";
import "./HoursTable.css";

export default function HoursTable() {
	return (
		<section className="hours-table" aria-label="Horaires d’ouverture">
			<h2>Horaires</h2>
			<ul>
				{BUSINESS_HOURS.map(({ day, hours }) => <li key={day}><span>{day}</span><span>{hours}</span></li>)}
			</ul>
		</section>
	);
}