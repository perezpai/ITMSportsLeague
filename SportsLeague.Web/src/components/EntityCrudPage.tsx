import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { toApiError } from '../api/client';
import type { ApiError } from '../api/client';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig<T> {
  name: keyof T & string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'email';
  required?: boolean;
  options?: FieldOption[];
  step?: string;
  min?: number;
  max?: number;
}

export interface ColumnConfig<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

export interface EntityApi<T> {
  getAll: () => Promise<T[]>;
  create: (data: Record<string, unknown>) => Promise<unknown>;
  update: (id: number, data: Record<string, unknown>) => Promise<unknown>;
  remove: (id: number) => Promise<unknown>;
}

interface Props<T extends { id: number }> {
  title: string;
  description?: string;
  columns: ColumnConfig<T>[];
  fields: FieldConfig<T>[];
  api: EntityApi<T>;
  canManage: boolean;
  emptyValues: Record<string, unknown>;
  toFormValues?: (row: T) => Record<string, unknown>;
  extraActions?: (row: T) => ReactNode;
  extraToolbar?: ReactNode;
}

export function EntityCrudPage<T extends { id: number }>({
  title,
  description,
  columns,
  fields,
  api,
  canManage,
  emptyValues,
  toFormValues,
  extraActions,
  extraToolbar,
}: Props<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>(emptyValues);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    setError(null);
    api
      .getAll()
      .then(setRows)
      .catch((err) => setError(toApiError(err).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormValues(emptyValues);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (row: T) => {
    setEditing(row);
    setFormValues(toFormValues ? toFormValues(row) : (row as unknown as Record<string, unknown>));
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await api.update(editing.id, formValues);
      } else {
        await api.create(formValues);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError((err as ApiError).message ?? toApiError(err).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: T) => {
    if (!confirm(`¿Eliminar este registro? Esta acción no se puede deshacer.`)) return;
    try {
      await api.remove(row.id);
      load();
    } catch (err) {
      alert(toApiError(err).message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {extraToolbar}
          {canManage && (
            <button className="btn" onClick={openCreate}>
              + Nuevo
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading-state">Cargando…</div>
        ) : error ? (
          <div className="card-pad">
            <div className="alert alert-error">{error}</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="empty-state">No hay registros todavía.</div>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                {canManage && <th></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                    </td>
                  ))}
                  {canManage && (
                    <td>
                      <div className="table-actions">
                        {extraActions?.(row)}
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(row)}>
                          Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar' : 'Nuevo'} {title.replace(/s$/, '')}</h2>
            </div>
            <form onSubmit={handleSubmit}>
              {formError && <div className="alert alert-error">{formError}</div>}
              <div className="form-grid">
                {fields.map((field) => (
                  <div className="field" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        required={field.required}
                        value={String(formValues[field.name] ?? '')}
                        onChange={(e) => setFormValues((v) => ({ ...v, [field.name]: e.target.value }))}
                      >
                        <option value="" disabled>
                          Selecciona…
                        </option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        required={field.required}
                        rows={3}
                        value={String(formValues[field.name] ?? '')}
                        onChange={(e) => setFormValues((v) => ({ ...v, [field.name]: e.target.value }))}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        step={field.step}
                        min={field.min}
                        max={field.max}
                        required={field.required}
                        value={String(formValues[field.name] ?? '')}
                        onChange={(e) =>
                          setFormValues((v) => ({
                            ...v,
                            [field.name]: field.type === 'number' ? e.target.valueAsNumber : e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn" disabled={saving}>
                  {saving ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
