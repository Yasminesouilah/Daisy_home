import { TESTIMONIALS } from "../../../data/testimonials";
import Reveal from "../../ui/Reveal";
import SectionTitle from "../../ui/SectionTitle";

export default function Testimonials() {
	return (
		<section className="testimonials">
			<div className="testimonials__inner container">
				<SectionTitle eyebrow="Témoignages" title="Ce que nos clientes en disent" align="center" />
				<div className="testimonials__grid">
					{TESTIMONIALS.map((testimonial, index) => (
						<Reveal as="article" key={testimonial.id} delay={index} className="testimonial">
							<div className="testimonial__head">
								<span className="testimonial__avatar" aria-hidden="true">{testimonial.name.charAt(0)}</span>
								<div><strong>{testimonial.name}</strong><span>{testimonial.location}</span></div>
							</div>
							<p className="testimonial__stars" aria-label={`${testimonial.rating} étoiles sur 5`}>{"★".repeat(testimonial.rating)}</p>
							<blockquote>“{testimonial.text}”</blockquote>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

