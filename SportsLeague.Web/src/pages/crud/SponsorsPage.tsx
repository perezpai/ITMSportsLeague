import { EntityCrudPage } from '../../components/EntityCrudPage';
import type { ColumnConfig, FieldConfig } from '../../components/EntityCrudPage';
import { sponsorsApi } from '../../api/endpoints';
import type { Sponsor } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

const categoryLabel: Record<string, string> = {
  Main: 'Principal',
  Gold: 'Oro',
  Silver: 'Plata',
  Bronze: 'Bronce',
};

const fields: FieldConfig<Sponsor>[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true },
  { name: 'contactEmail', label: 'Email de contacto', type: 'email', required: true },
  { name: 'phone', label: 'Teléfono', type: 'text' },
  { name: 'websiteUrl', label: 'Sitio web', type: 'text' },
  {
    name: 'category',
    label: 'Categoría',
    type: 'select',
    required: true,
    options: Object.entries(categoryLabel).map(([value, label]) => ({ value, label })),
  },
];

const columns: ColumnConfig<Sponsor>[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'contactEmail', label: 'Email' },
  { key: 'category', label: 'Categoría', render: (s) => categoryLabel[s.category] ?? s.category },
];

export function SponsorsPage() {
  const { hasRole } = useAuth();

  return (
    <EntityCrudPage<Sponsor>
      title="Patrocinadores"
      description="Marcas y empresas que patrocinan la liga"
      columns={columns}
      fields={fields}
      canManage={hasRole('Admin', 'Manager')}
      emptyValues={{ name: '', contactEmail: '', phone: '', websiteUrl: '', category: '' }}
      api={{
        getAll: sponsorsApi.getAll,
        create: sponsorsApi.create,
        update: sponsorsApi.update,
        remove: sponsorsApi.remove,
      }}
    />
  );
}
