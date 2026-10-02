import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../../services/categoryService";
import { resolveImageUrl } from "../../../config/constants";
import { ArrowIcon } from "../../ui/Icons";

const INTERVAL = 1500; // time between slides
const SLIDE_MS = 900;  // must match --slide in the CSS

const onImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = resolveImageUrl(null);
};

export default function CategoryStrip() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        getCategories()
            .then((data) => {
                if (active) setCategories(data);
            })
            .catch(() => {
                if (active) setCategories([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const total = categories.length;

    // The list is doubled so the loop never shows an empty end
    const items = [...categories, ...categories];

    const [step, setStep] = useState(0);
    const [instant, setInstant] = useState(false);
    const [paused, setPaused] = useState(false);

    /* Autoplay */
    useEffect(() => {
        if (paused || total < 2) return;

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduce) return;

        const id = setInterval(
            () => setStep((s) => s + 1),
            INTERVAL
        );

        return () => clearInterval(id);
    }, [paused, total]);

    /* Seamless loop: after reaching the copy, jump back to 0 without animation */
    useEffect(() => {
        if (step !== total || total === 0) return;

        const timeout = setTimeout(() => {
            setInstant(true);
            setStep(0);

            requestAnimationFrame(() =>
                requestAnimationFrame(() => setInstant(false))
            );
        }, SLIDE_MS);

        return () => clearTimeout(timeout);
    }, [step, total]);

    if (loading || total === 0) return null;

    return (
        <section
            id="categories"
            className="category-strip container"
            aria-label="Catégories"
        >
            <div className="category-strip__header">
                <div className="category-strip__heading">
                    <p className="category-strip__eyebrow">
                        Explore
                        <span />
                    </p>

                    <h2 className="category-strip__title">
                        Find your style
                    </h2>
                </div>

                <p className="category-strip__description">
                    Discover pieces that make your space
                    feel uniquely yours.
                </p>
            </div>

            <div
                className="category-carousel"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
            >
                <div
                    className={`category-track${
                        instant ? " category-track--instant" : ""
                    }`}
                    style={{ "--step": step }}
                >
                    {items.map((category, i) => {
                        const isCopy = i >= total;
                        const isActive = i === step;

                        return (
                            <Link
                                key={`${category.slug}-${i}`}
                                to={`/shop?category=${category.slug}`}
                                className={`category-card${
                                    isActive
                                        ? " category-card--active"
                                        : ""
                                }`}
                                aria-hidden={isCopy || undefined}
                                tabIndex={isCopy ? -1 : undefined}
                            >
                                <div className="category-card__frame">
                                    <img
                                        className="category-card__img"
                                        src={resolveImageUrl(category.image)}
                                        alt={category.name}
                                        loading={i < 4 ? "eager" : "lazy"}
                                        onError={onImageError}
                                    />

                                    <span className="category-card__overlay" />

                                    <span className="category-card__name">
                                        {category.name}
                                    </span>

                                    <span className="category-card__arrow" aria-hidden="true">
                                        <ArrowIcon width={18} height={18} />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="category-dots" aria-hidden="true">
                {categories.map((category, i) => (
                    <button
                        key={category.slug}
                        type="button"
                        tabIndex={-1}
                        className={`category-dots__dot${
                            step % total === i
                                ? " category-dots__dot--active"
                                : ""
                        }`}
                        onClick={() => step < total && setStep(i)}
                    />
                ))}
            </div>
        </section>
    );
}