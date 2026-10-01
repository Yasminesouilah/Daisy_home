import { useEffect, useState } from "react";
import Button from "../../ui/Button/Button";
import { ArrowIcon } from "../../ui/Icons";

const HERO_IMAGES = [
    {
        src: "/images/hero/hero.png",
        alt: "Décoration intérieure chaleureuse Daisy Home",
    },
    {
        src: "/images/hero/hero2.png",
        alt: "Collection décoration intérieure Daisy Home",
    },
];

export default function Hero() {
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImage((current) => (current + 1) % HERO_IMAGES.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="hero" aria-labelledby="hero-title">

            {/* =================================================
                HERO IMAGES
            ================================================= */}

            <div className="hero__image">

                {HERO_IMAGES.map((image, index) => (
                    <img
                        key={image.src}
                        className={`hero__image-layer ${
                            index === activeImage
                                ? "hero__image-layer--active"
                                : ""
                        }`}
                        src={image.src}
                        alt={index === activeImage ? image.alt : ""}
                        aria-hidden={index !== activeImage}
                        fetchPriority={index === 0 ? "high" : "auto"}
                        decoding="async"
                    />
                ))}

            </div>


            {/* =================================================
                HERO CONTENT
            ================================================= */}

            <div className="hero__content">
                <div className="hero__copy">

                    <p className="hero__eyebrow">
                        Daisy Home
                    </p>

                    <h1 id="hero-title">
                        <span>Make your space</span>
                        <span>feel like home.</span>
                    </h1>

                    <p className="hero__text">
                        Beautiful home decor, thoughtful details and
                        everyday essentials — all in one place.
                    </p>

                    <div className="hero__actions">

                        <Button
                            to="/shop"
                            size="lg"
                            className="hero__cta hero__cta--solid"
                            icon={<ArrowIcon />}
                        >
                            Shop Now
                        </Button>

                        <Button
                            to="/shop"
                            size="lg"
                            variant="outline"
                            className="hero__cta"
                        >
                            Explore Collection
                        </Button>

                    </div>

                </div>
            </div>


            {/* =================================================
                SLIDE INDICATORS
            ================================================= */}

            <div
                className="hero__indicators"
                aria-label="Hero images"
            >
                {HERO_IMAGES.map((image, index) => (
                    <button
                        key={image.src}
                        type="button"
                        className={`hero__indicator ${
                            index === activeImage
                                ? "hero__indicator--active"
                                : ""
                        }`}
                        aria-label={`Show hero image ${index + 1}`}
                        aria-current={
                            index === activeImage
                                ? "true"
                                : undefined
                        }
                        onClick={() => setActiveImage(index)}
                    />
                ))}
            </div>

        </section>
    );
}