import React, { useEffect, useState } from "react";
import { ReservationTypeAPI } from "../../api";
import NewTypeForm from "./Forms/NewTypeForm";

function AdminTypesComponent() {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTypes() {
    setLoading(true);
    setError("");
    try {
      const data = await ReservationTypeAPI.listReservationTypes();
      setTypes(data);
    } catch (e) {
      setError(e?.message || "Failed to load types");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTypes();
  }, []);

  async function handleCreateType(form) {
    setSaving(true);
    setError("");
    try {
      await ReservationTypeAPI.createReservationType(form);
      setShowForm(false);
      await loadTypes();
    } catch (e) {
      setError(e?.message || "Failed to create type");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this type?")) return;
    try {
      await ReservationTypeAPI.deleteReservationType(id);
      await loadTypes();
    } catch (e) {
      alert(e?.message || "Delete failed");
    }
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Types</h1>
          <p className="text-sm text-gray-500">Manage reservation types</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-sm text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          New Type
        </button>
      </div>

      {showForm && (
        <div className="p-4 border border-gray-300 rounded-lg mb-4">
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <NewTypeForm
            onSubmit={handleCreateType}
            onCancel={() => setShowForm(false)}
          />
          {saving && <div className="text-xs text-gray-500 mt-2">Saving…</div>}
        </div>
      )}

      <div className="p-4 border border-gray-300 rounded-lg">
        {loading ? (
          <div className="text-sm text-gray-500">Loading…</div>
        ) : types.length === 0 ? (
          <div className="text-sm text-gray-500">No types yet.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {types.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <div className="text-sm text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">
                    {t.isActive ? "Active" : "Inactive"}
                    {t.pricePerPerson != null &&
                      ` • $${Number(t.pricePerPerson).toFixed(2)}`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                    onClick={() => handleDelete(t.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTypesComponent;
