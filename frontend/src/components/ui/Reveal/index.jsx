import { useScrollReveal } from "../../../hooks/useScrollReveal";

export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
	const [ref, visible] = useScrollReveal();
	const classes = ["reveal", `reveal--d${delay}`, visible && "is-visible", className]
		.filter(Boolean)
		.join(" ");

	return (
		<Tag ref={ref} className={classes} {...rest}>
			{children}
		</Tag>
	);
}