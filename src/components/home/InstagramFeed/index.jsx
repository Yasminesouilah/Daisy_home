import { INSTAGRAM_POSTS } from "../../../data/instagram";
import { SITE } from "../../../config/site";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import { InstagramIcon } from "../../ui/Icons";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function InstagramFeed() {
	return (
		<section className="insta container">
			<div className="insta__head">
				<h2>Suivez notre univers</h2>
				<a href={SITE.instagramUrl} target="_blank" rel="noreferrer">
					<InstagramIcon width={16} height={16} /> @{SITE.instagram}
				</a>
			</div>
			<div className="insta__grid">
				{INSTAGRAM_POSTS.map((post) => (
					<a key={post.id} href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="insta__item" aria-label={`Voir Daisy Home sur Instagram, publication ${post.id}`}>
						<img src={post.image} alt="" loading="lazy" onError={onImageError} />
					</a>
				))}
			</div>
		</section>
	);
}
