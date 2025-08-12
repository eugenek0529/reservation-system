import React, { useMemo, useState } from 'react';

export default function NewTypeForm({ initialData, onSubmit, onCancel }) {
  const init = useMemo(() => ({
    name: '',
    description: '',
    pricePerPerson: '',
    isActive: true,
    ...initialData,
  }), [initialData]);

  const [form, setForm] = useState(init);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Name is required';
    if (form.pricePerPerson !== '' && Number(form.pricePerPerson) < 0) e.pricePerPerson = 'Must be ≥ 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit?.({
      name: form.name.trim(),
      description: form.description?.trim() || '',
      isActive: Boolean(form.isActive),
      pricePerPerson: form.pricePerPerson === '' ? null : Number(form.pricePerPerson),
    });
  };

  return (
    <form onSubmit={submit} className="p-4 bg-white border border-gray-200 rounded-xl space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Type name</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Price per person</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.pricePerPerson}
            onChange={(e) => set('pricePerPerson', e.target.value)}
            placeholder="e.g., 150.00"
          />
          {errors.pricePerPerson && <p className="text-xs text-red-600 mt-1">{errors.pricePerPerson}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Optional"
          />
        </div>

        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="isActive"
            type="checkbox"
            className="w-4 h-4"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">Active</label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => onCancel?.()} className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 text-sm rounded-lg bg-gray-900 text-white hover:bg-gray-800">
          Save Type
        </button>
      </div>
    </form>
  );
}
