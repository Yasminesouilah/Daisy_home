import { useEffect, useMemo, useState } from "react";
import {
  getAdminDeliveryRates,
  updateAdminDeliveryRate,
} from "../services/adminDeliveryRateService.js";
import "./DeliveryRates.css";

function editableRates(rates) {
  return rates.map((rate) => ({
    ...rate,
    homeFee: String(rate.homeFee),
    officeFee: String(rate.officeFee),
  }));
}

export default function DeliveryRates() {
  const [rates, setRates] = useState([]);
  const [savedRates, setSavedRates] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedCode, setSavedCode] = useState("");
  const [savingCode, setSavingCode] = useState("");

  useEffect(() => {
    let active = true;
    getAdminDeliveryRates()
      .then((data) => {
        if (!active) return;
        setRates(editableRates(data));
        setSavedRates(Object.fromEntries(data.map((rate) => [rate.code, rate])));
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
  }, []);

  const visibleRates = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return rates.filter((rate) =>
      !query || rate.name.toLocaleLowerCase().includes(query) || rate.code.includes(query),
    );
  }, [rates, search]);

  function updateField(code, field, value) {
    setError("");
    setSavedCode("");
    setRates((current) => current.map((rate) =>
      rate.code === code ? { ...rate, [field]: value } : rate,
    ));
  }

  async function saveRate(rate) {
    const homeFee = Number(rate.homeFee);
    const officeFee = Number(rate.officeFee);
    if (
      rate.homeFee.trim() === "" ||
      rate.officeFee.trim() === "" ||
      !Number.isSafeInteger(homeFee) ||
      homeFee < 0 ||
      !Number.isSafeInteger(officeFee) ||
      officeFee < 0
    ) {
      setError("Les deux tarifs doivent être des nombres entiers positifs ou nuls.");
      return;
    }

    setError("");
    setSavedCode("");
    setSavingCode(rate.code);
    try {
      const updated = await updateAdminDeliveryRate(rate.code, { homeFee, officeFee });
      setRates((current) => current.map((item) => item.code === rate.code
        ? { ...updated, homeFee: String(updated.homeFee), officeFee: String(updated.officeFee) }
        : item,
      ));
      setSavedRates((current) => ({ ...current, [rate.code]: updated }));
      setSavedCode(rate.code);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingCode("");
    }
  }

  return (
    <section className="delivery-rates">
      <header className="delivery-rates__header">
        <div>
          <p className="delivery-rates__eyebrow">Configuration boutique</p>
          <h1>Tarifs de livraison</h1>
        </div>
        <label className="delivery-rates__search">
          <span className="delivery-rates__visually-hidden">Rechercher une wilaya</span>
          <input
            type="search"
            placeholder="Rechercher une wilaya"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </header>

      <p className="delivery-rates__note">Les tarifs sont en DA. Les commandes dépassant le seuil de livraison gratuite restent offertes.</p>
      {error && <p className="delivery-rates__error" role="alert">{error}</p>}

      {loading ? (
        <p className="delivery-rates__state">Chargement des tarifs...</p>
      ) : (
        <div className="delivery-rates__table-wrap">
          <table className="delivery-rates__table">
            <thead>
              <tr>
                <th scope="col">Wilaya</th>
                <th scope="col">À domicile (DA)</th>
                <th scope="col">Au bureau (DA)</th>
                <th scope="col"><span className="delivery-rates__visually-hidden">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {visibleRates.map((rate) => {
                const saved = savedRates[rate.code];
                const changed = !saved || Number(rate.homeFee) !== saved.homeFee || Number(rate.officeFee) !== saved.officeFee;
                return (
                  <tr key={rate.code}>
                    <th scope="row">
                      <span className="delivery-rates__code">{rate.code}</span>
                      <span>{rate.name}</span>
                    </th>
                    <td>
                      <label>
                        <span className="delivery-rates__visually-hidden">Tarif domicile pour {rate.name}</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={rate.homeFee}
                          onChange={(event) => updateField(rate.code, "homeFee", event.target.value)}
                        />
                      </label>
                    </td>
                    <td>
                      <label>
                        <span className="delivery-rates__visually-hidden">Tarif bureau pour {rate.name}</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={rate.officeFee}
                          onChange={(event) => updateField(rate.code, "officeFee", event.target.value)}
                        />
                      </label>
                    </td>
                    <td className="delivery-rates__action">
                      <button
                        type="button"
                        disabled={!changed || savingCode !== ""}
                        onClick={() => saveRate(rate)}
                      >
                        {savingCode === rate.code ? "Enregistrement..." : savedCode === rate.code ? "Enregistré" : "Enregistrer"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visibleRates.length === 0 && (
                <tr><td colSpan="4" className="delivery-rates__empty">Aucune wilaya trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}