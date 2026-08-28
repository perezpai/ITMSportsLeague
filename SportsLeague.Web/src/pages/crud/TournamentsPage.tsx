import { EntityCrudPage } from '../../components/EntityCrudPage';
import type { ColumnConfig, FieldConfig } from '../../components/EntityCrudPage';
import { tournamentsApi } from '../../api/endpoints';
import type { Tournament } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

const statusLabel: Record<string, string> = {
  Pending: 'Pendiente',
  InProgress: 'En curso',
  Finished: 'Finalizado',
};

const fields: FieldConfig<Tournament>[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'season', label: 'Temporada', type: 'text', required: true },
  { name: 'startDate', label: 'Fecha de inicio', type: 'date', required: true },
  { name: 'endDate', label: 'Fecha de fin', type: 'date', required: true },
];

const columns: ColumnConfig<Tournament>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'season', label: 'Temporada' },
  { key: 'startDate', label: 'Inicio', render: (t) => new Date(t.startDate).toLocaleDateString() },
  { key: 'endDate', label: 'Fin', render: (t) => new Date(t.endDate).toLocaleDateString() },
  { key: 'status', label: 'Estado', render: (t) => statusLabel[t.status] ?? t.status },
];

export function TournamentsPage() {
  const { hasRole } = useAuth();

  return (
    <EntityCrudPage<Tournament>
      title="Torneos"
      description="Torneos y temporadas de la liga"
      columns={columns}
      fields={fields}
      canManage={hasRole('Admin', 'Manager')}
      emptyValues={{ name: '', season: '', startDate: '', endDate: '' }}
      toFormValues={(t) => ({
        ...t,
        startDate: t.startDate?.slice(0, 10),
        endDate: t.endDate?.slice(0, 10),
      })}
      api={{
        getAll: tournamentsApi.getAll,
        create: tournamentsApi.create,
        update: tournamentsApi.update,
        remove: tournamentsApi.remove,
      }}
    />
  );
}
