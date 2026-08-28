import { EntityCrudPage } from '../../components/EntityCrudPage';
import type { ColumnConfig, FieldConfig } from '../../components/EntityCrudPage';
import { refereesApi } from '../../api/endpoints';
import type { Referee } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

const fields: FieldConfig<Referee>[] = [
  { name: 'firstName', label: 'Nombre', type: 'text', required: true },
  { name: 'lastName', label: 'Apellido', type: 'text', required: true },
  { name: 'nationality', label: 'Nacionalidad', type: 'text', required: true },
];

const columns: ColumnConfig<Referee>[] = [
  { key: 'firstName', label: 'Nombre', render: (r) => `${r.firstName} ${r.lastName}` },
  { key: 'nationality', label: 'Nacionalidad' },
];

export function RefereesPage() {
  const { hasRole } = useAuth();

  return (
    <EntityCrudPage<Referee>
      title="Árbitros"
      description="Árbitros disponibles para dirigir partidos"
      columns={columns}
      fields={fields}
      canManage={hasRole('Admin', 'Manager')}
      emptyValues={{ firstName: '', lastName: '', nationality: '' }}
      api={{
        getAll: refereesApi.getAll,
        create: refereesApi.create,
        update: refereesApi.update,
        remove: refereesApi.remove,
      }}
    />
  );
}
