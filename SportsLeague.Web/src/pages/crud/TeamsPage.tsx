import { EntityCrudPage } from '../../components/EntityCrudPage';
import type { ColumnConfig, FieldConfig } from '../../components/EntityCrudPage';
import { teamsApi } from '../../api/endpoints';
import type { Team } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

const fields: FieldConfig<Team>[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'city', label: 'Ciudad', type: 'text', required: true },
  { name: 'stadium', label: 'Estadio', type: 'text', required: true },
  { name: 'logoUrl', label: 'URL del logo', type: 'text' },
  { name: 'foundedDate', label: 'Fecha de fundación', type: 'date', required: true },
];

const columns: ColumnConfig<Team>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'city', label: 'Ciudad' },
  { key: 'stadium', label: 'Estadio' },
  { key: 'foundedDate', label: 'Fundado', render: (t) => new Date(t.foundedDate).toLocaleDateString() },
];

export function TeamsPage() {
  const { hasRole } = useAuth();

  return (
    <EntityCrudPage<Team>
      title="Equipos"
      description="Equipos participantes en la liga"
      columns={columns}
      fields={fields}
      canManage={hasRole('Admin', 'Manager')}
      emptyValues={{ name: '', city: '', stadium: '', logoUrl: '', foundedDate: '' }}
      toFormValues={(t) => ({ ...t, foundedDate: t.foundedDate?.slice(0, 10) })}
      api={{
        getAll: teamsApi.getAll,
        create: teamsApi.create,
        update: teamsApi.update,
        remove: teamsApi.remove,
      }}
    />
  );
}
