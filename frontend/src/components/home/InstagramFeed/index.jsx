import { INSTAGRAM_POSTS } from "../../../data/instagram";
import { SITE } from "../../../config/site";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import { InstagramIcon } from "../../ui/Icons";
import Reveal from "../../ui/Reveal";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function InstagramFeed() {
	return (
		<section className="insta container">
			<Reveal className="insta__head">
				<div>
					<p className="eyebrow">Dans les coulisses</p>
					<h2>Suivez notre univers</h2>
				</div>
				<a href={SITE.instagramUrl} target="_blank" rel="noreferrer">
					<InstagramIcon width={16} height={16} /> @{SITE.instagram}
				</a>
			</Reveal>
			<div className="insta__grid">
				{INSTAGRAM_POSTS.map((post, index) => (
					<Reveal
						as="a"
						key={post.id}
						href={SITE.instagramUrl}
						target="_blank"
						rel="noreferrer"
						delay={index % 4}
						style={{ "--stagger-delay": `${index * 55}ms` }}
						className="insta__item"
						aria-label={`Voir Daisy Home sur Instagram, publication ${post.id}`}
					>
						<img src={post.image} alt="" loading="lazy" onError={onImageError} />
						<span className="insta__overlay" aria-hidden="true">
							<InstagramIcon width={22} height={22} />
							<span>Voir</span>
						</span>
					</Reveal>
				))}
			</div>
		</section>
	);
}
