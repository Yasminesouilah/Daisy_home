import { Link } from "react-router-dom";
import "./Button.css";

/**
 * variant: primary | dark | outline | ghost
 * size: sm | md | lg
 * Renders a <Link> when `to` is given, an <a> when `href` is given, else a <button>.
 */
export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  icon,
  iconPosition = "right",
  full = false,
  className = "",
  children,
  ...rest
}) {
  const classes = ["btn", `btn--${variant}`, `btn--${size}`, full && "btn--full", className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && iconPosition === "left" && <span className="btn__icon">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && <span className="btn__icon">{icon}</span>}
    </>
  );

  if (to) return <Link to={to} className={classes} {...rest}>{content}</Link>;
  if (href) return <a href={href} className={classes} {...rest}>{content}</a>;
  return <button type="button" className={classes} {...rest}>{content}</button>;
}