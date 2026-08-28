import { useEffect, useMemo, useState } from 'react';
import { EntityCrudPage } from '../../components/EntityCrudPage';
import type { ColumnConfig, FieldConfig } from '../../components/EntityCrudPage';
import { playersApi, teamsApi } from '../../api/endpoints';
import type { Player, Team } from '../../api/types';
import { useAuth } from '../../auth/AuthContext';

const positionLabel: Record<string, string> = {
  Goalkeeper: 'Portero',
  Defender: 'Defensa',
  Midfielder: 'Mediocampista',
  Forward: 'Delantero',
};

const columns: ColumnConfig<Player>[] = [
  { key: 'firstName', label: 'Nombre', render: (p) => `${p.firstName} ${p.lastName}` },
  { key: 'number', label: 'Dorsal' },
  { key: 'position', label: 'Posición', render: (p) => positionLabel[p.position] ?? p.position },
  { key: 'teamName', label: 'Equipo' },
];

export function PlayersPage() {
  const { hasRole } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    teamsApi.getAll().then(setTeams);
  }, []);

  const fields = useMemo<FieldConfig<Player>[]>(
    () => [
      { name: 'firstName', label: 'Nombre', type: 'text', required: true },
      { name: 'lastName', label: 'Apellido', type: 'text', required: true },
      { name: 'birthDate', label: 'Fecha de nacimiento', type: 'date', required: true },
      { name: 'number', label: 'Dorsal', type: 'number', required: true, min: 1, max: 99 },
      {
        name: 'position',
        label: 'Posición',
        type: 'select',
        required: true,
        options: Object.entries(positionLabel).map(([value, label]) => ({ value, label })),
      },
      {
        name: 'teamId',
        label: 'Equipo',
        type: 'select',
        required: true,
        options: teams.map((t) => ({ value: String(t.id), label: t.name })),
      },
    ],
    [teams],
  );

  return (
    <EntityCrudPage<Player>
      title="Jugadores"
      description="Plantilla de jugadores por equipo"
      columns={columns}
      fields={fields}
      canManage={hasRole('Admin', 'Manager')}
      emptyValues={{ firstName: '', lastName: '', birthDate: '', number: '', position: '', teamId: '' }}
      toFormValues={(p) => ({ ...p, birthDate: p.birthDate?.slice(0, 10), teamId: String(p.teamId) })}
      api={{
        getAll: playersApi.getAll,
        create: playersApi.create,
        update: playersApi.update,
        remove: playersApi.remove,
      }}
    />
  );
}
