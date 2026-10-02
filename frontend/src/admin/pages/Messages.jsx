import { useEffect, useState } from "react";
import {
	deleteAdminMessage,
	getAdminMessages,
	markMessageRead,
} from "../services/adminMessageService.js";
import { buildMessageWhatsAppLink } from "../../utils/whatsapp.js";
import "./Messages.css";

const FILTERS = [
	{ label: "Tous", value: undefined },
	{ label: "Non lus", value: false },
	{ label: "Lus", value: true },
];

function emailReplyUrl(message) {
	const subject = encodeURIComponent("Re: Votre message à Daisy Home");
	const body = encodeURIComponent(
		`Bonjour ${message.name},\n\nMerci pour votre message :\n\n${message.message}\n\nCordialement,\nDaisy Home`,
	);
	return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export default function Messages() {
	const [messages, setMessages] = useState([]);
	const [filter, setFilter] = useState(undefined);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [busyMessageId, setBusyMessageId] = useState(null);

	useEffect(() => {
		let active = true;
		setLoading(true);
		setError("");

		getAdminMessages({ isRead: filter, page })
			.then((data) => {
				if (!active) return;
				setMessages(data.items);
				setTotalPages(data.totalPages || 1);
			})
			.catch((requestError) => {
				if (active) setError(requestError.message);
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, [filter, page]);

	async function handleMarkRead(message) {
		setError("");
		setBusyMessageId(message.id);
		try {
			const updated = await markMessageRead(message.id);
			if (filter === false) {
				setMessages((current) => current.filter((item) => item.id !== message.id));
				if (messages.length === 1 && page > 1) setPage((current) => current - 1);
			} else {
				setMessages((current) => current.map((item) => item.id === message.id ? updated : item));
			}
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setBusyMessageId(null);
		}
	}

	async function handleDelete(message) {
		if (!window.confirm("Supprimer ce message ?")) return;

		setError("");
		setBusyMessageId(message.id);
		try {
			await deleteAdminMessage(message.id);
			setMessages((current) => current.filter((item) => item.id !== message.id));
			if (messages.length === 1 && page > 1) setPage((current) => current - 1);
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setBusyMessageId(null);
		}
	}

	return (
		<section className="messages-page">
			<header className="messages-page__header">
				<div>
					<p className="messages-page__eyebrow">Boîte de réception</p>
					<h1>Messages</h1>
				</div>
			</header>

			<div className="messages-page__filters" aria-label="Filtrer les messages">
				{FILTERS.map((option) => (
					<button
						key={option.label}
						type="button"
						aria-pressed={filter === option.value}
						className={filter === option.value ? "is-active" : ""}
						onClick={() => {
							setFilter(option.value);
							setPage(1);
						}}
					>
						{option.label}
					</button>
				))}
			</div>

			{error && <p className="messages-page__error" role="alert">{error}</p>}
			{loading ? (
				<p className="messages-page__state">Chargement des messages...</p>
			) : messages.length === 0 ? (
				<p className="messages-page__empty">Aucun message dans cette sélection.</p>
			) : (
				<>
					<ul className="messages-page__list">
						{messages.map((message) => {
							const whatsappUrl = buildMessageWhatsAppLink(message.phone, message.name, message.message);
							return (
							<li
								key={message.id}
								className={`message-item${message.isRead ? "" : " message-item--unread"}`}
							>
								<header className="message-item__header">
									<div className="message-item__sender">
										<strong>{message.name}</strong>
										<div className="message-item__contacts">
											{message.phone && <a href={`tel:${message.phone}`}>{message.phone}</a>}
											{message.email && <a href={`mailto:${message.email}`}>{message.email}</a>}
										</div>
									</div>
									<time dateTime={message.createdAt}>
										{new Date(message.createdAt).toLocaleString("fr-FR")}
									</time>
								</header>
								<p className="message-item__body">{message.message}</p>
								<footer className="message-item__actions">
									{message.email && (
										<a className="message-item__reply" href={emailReplyUrl(message)}>
											Répondre par email
										</a>
									)}
									{whatsappUrl && (
										<a
											className="message-item__reply"
											href={whatsappUrl}
											target="_blank"
											rel="noreferrer"
										>
											Répondre sur WhatsApp
										</a>
									)}
									{!message.isRead && (
										<button
											type="button"
											disabled={busyMessageId === message.id}
											onClick={() => handleMarkRead(message)}
										>
											Marquer comme lu
										</button>
									)}
									<button
										type="button"
										className="message-item__delete"
										disabled={busyMessageId === message.id}
										onClick={() => handleDelete(message)}
									>
										Supprimer
									</button>
								</footer>
							</li>
							);
						})}
					</ul>
					{totalPages > 1 && (
						<nav className="messages-page__pagination" aria-label="Pagination des messages">
							<button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
								Précédent
							</button>
							<span>Page {page} / {totalPages}</span>
							<button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
								Suivant
							</button>
						</nav>
					)}
				</>
			)}
		</section>
	);
}