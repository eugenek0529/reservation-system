/** UI -> backend (camelCase -> snake_case) */
export function toBackend(payload) {
  return {
    name: payload.name,
    description: payload.description ?? null,
    is_active: Boolean(payload.isActive),
    price_per_person: payload.pricePerPerson ?? null,
  };
}

/** backend -> UI (snake_case -> camelCase) */
export function fromBackend(row = {}) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    isActive: !!row.is_active,
    pricePerPerson: row.price_per_person ?? null,
    createdAt: row.created_at,
  };
}
