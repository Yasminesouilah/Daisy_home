import { useEffect, useState } from "react";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import "./ProductGallery.css";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function ProductGallery({ images, image, name }) {
	const list = images?.length ? images : image ? [image] : [PLACEHOLDER_IMAGE];
	const [active, setActive] = useState(0);

	useEffect(() => setActive(0), [list[0]]);

	return (
		<div className="gallery">
			<div className="gallery__main">
				<img src={list[active] ?? PLACEHOLDER_IMAGE} alt={name} onError={onImageError} />
			</div>
			{list.length > 1 && (
				<div className="gallery__thumbs" aria-label="Images du produit">
					{list.map((source, index) => (
						<button key={`${source}-${index}`} type="button" className={`gallery__thumb ${index === active ? "is-active" : ""}`} onClick={() => setActive(index)} aria-label={`Afficher l’image ${index + 1}`} aria-pressed={index === active}>
							<img src={source} alt="" onError={onImageError} />
						</button>
					))}
				</div>
			)}
		</div>
	);
}