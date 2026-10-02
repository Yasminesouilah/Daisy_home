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

function initials(name = "") {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("") || "?";
}

function relativeTime(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now - date;
	const diffMin = Math.floor(diffMs / 60000);

	if (diffMin < 1) return "À l'instant";
	if (diffMin < 60) return `Il y a ${diffMin} min`;
	const diffH = Math.floor(diffMin / 60);
	if (diffH < 24) return `Il y a ${diffH} h`;
	const diffD = Math.floor(diffH / 24);
	if (diffD < 7) return `Il y a ${diffD} j`;
	return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function Messages() {
	const [messages, setMessages] = useState([]);
	const [filter, setFilter] = useState(undefined);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [busyMessageId, setBusyMessageId] = useState(null);
	const [selectedId, setSelectedId] = useState(null);

	useEffect(() => {
		let active = true;
		setLoading(true);
		setError("");

		getAdminMessages({ isRead: filter, page })
			.then((data) => {
				if (!active) return;
				setMessages(data.items);
				setTotalPages(data.totalPages || 1);
				setSelectedId((current) =>
					current && data.items.some((item) => item.id === current)
						? current
						: data.items[0]?.id ?? null,
				);
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

	const selectedMessage = messages.find((message) => message.id === selectedId) || null;

	function selectMessage(message) {
		setSelectedId(message.id);
		if (!message.isRead) handleMarkRead(message, { silent: true });
	}

	async function handleMarkRead(message, { silent = false } = {}) {
		if (!silent) setError("");
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
			if (!silent) setError(requestError.message);
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
			if (selectedId === message.id) setSelectedId(null);
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
				<div className="messages-inbox">
					{/* ---------- Conversation list ---------- */}
					<ul className="messages-inbox__list">
						{messages.map((message) => (
							<li key={message.id}>
								<button
									type="button"
									className={`inbox-row${message.id === selectedId ? " is-selected" : ""}${!message.isRead ? " is-unread" : ""}`}
									onClick={() => selectMessage(message)}
								>
									<span className="inbox-row__avatar">{initials(message.name)}</span>
									<span className="inbox-row__body">
										<span className="inbox-row__top">
											<strong>{message.name}</strong>
											<span className="inbox-row__time">{relativeTime(message.createdAt)}</span>
										</span>
										<span className="inbox-row__snippet">{message.message}</span>
									</span>
									{!message.isRead && <span className="inbox-row__dot" aria-hidden="true" />}
								</button>
							</li>
						))}
					</ul>

					{/* ---------- Conversation detail ---------- */}
					<div className="messages-inbox__detail">
						{!selectedMessage ? (
							<div className="inbox-empty">
								<p>Sélectionnez un message pour l'afficher</p>
							</div>
						) : (
							<>
								<header className="inbox-detail__header">
									<span className="inbox-row__avatar inbox-row__avatar--lg">
										{initials(selectedMessage.name)}
									</span>
									<div className="inbox-detail__who">
										<strong>{selectedMessage.name}</strong>
										<div className="inbox-detail__contacts">
											{selectedMessage.phone && <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>}
											{selectedMessage.email && <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>}
										</div>
									</div>
									<button
										type="button"
										className="inbox-detail__delete"
										disabled={busyMessageId === selectedMessage.id}
										onClick={() => handleDelete(selectedMessage)}
										aria-label="Supprimer ce message"
									>
										<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
											<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
										</svg>
									</button>
								</header>

								<div className="inbox-detail__thread">
									<div className="chat-bubble">
										<p>{selectedMessage.message}</p>
										<time dateTime={selectedMessage.createdAt}>
											{new Date(selectedMessage.createdAt).toLocaleString("fr-FR")}
										</time>
									</div>
								</div>

								<footer className="inbox-detail__actions">
									{selectedMessage.email && (
										<a className="inbox-detail__action" href={emailReplyUrl(selectedMessage)}>
											<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
												<rect x="3" y="5" width="18" height="14" rx="2" />
												<path d="m3 7 9 6 9-6" />
											</svg>
											Répondre par email
										</a>
									)}
									{selectedMessage.phone && buildMessageWhatsAppLink(selectedMessage.phone, selectedMessage.name, selectedMessage.message) && (
										<a
											className="inbox-detail__action inbox-detail__action--whatsapp"
											href={buildMessageWhatsAppLink(selectedMessage.phone, selectedMessage.name, selectedMessage.message)}
											target="_blank"
											rel="noreferrer"
										>
											<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
												<path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
											</svg>
											Répondre sur WhatsApp
										</a>
									)}
									{!selectedMessage.isRead && (
										<button
											type="button"
											className="inbox-detail__action inbox-detail__action--ghost"
											disabled={busyMessageId === selectedMessage.id}
											onClick={() => handleMarkRead(selectedMessage)}
										>
											Marquer comme lu
										</button>
									)}
								</footer>
							</>
						)}
					</div>
				</div>
			)}

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
		</section>
	);
}