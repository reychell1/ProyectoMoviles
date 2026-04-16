import type { Metadata } from 'next';
import { LeaderboardTable, type LeaderboardEntry } from '@dado-triple/ui/web';

export const metadata: Metadata = {
  title: 'Dashboard de Jugadores — Dado Triple',
  description: 'Tabla de posiciones global y dinámica de Dado Triple',
};

// Revalidar cada 30 segundos para mantener datos frescos
export const revalidate = 30;

const API_URL =
  process.env.SERVER_API_URL ??
  process.env.NEXT_PUBLIC_REALTIME_URL ??
  'http://localhost:4000';

async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json() as Promise<LeaderboardEntry[]>;
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const players = await getLeaderboard();

  return (
    <main className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Dashboard de Jugadores
          </h1>
          <p className="text-slate-400 text-sm">
            Tabla de posiciones global · se actualiza cada 30 s
          </p>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <SummaryCard
            label="Total jugadores"
            value={players.length}
            color="text-blue-400"
          />
          <SummaryCard
            label="Puntuación más alta"
            value={players[0]?.totalScore ?? 0}
            suffix=" pts"
            color="text-amber-400"
          />
          <SummaryCard
            label="Líder actual"
            value={players[0]?.username ?? '—'}
            color="text-emerald-400"
            isText
          />
        </div>

        {/* Tabla de posiciones */}
        <section className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              Clasificación Global
            </h2>
          </div>

          <div className="p-4">
            {players.length === 0 ? (
              <EmptyState message="Aún no hay jugadores registrados." />
            ) : (
              <LeaderboardTable entries={players} />
            )}
          </div>
        </section>

      </div>
    </main>
  );
}

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  suffix = '',
  color,
  isText = false,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-[#1e293b] border border-slate-700 rounded-xl p-5">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className={`font-bold ${color} ${isText ? 'text-xl truncate' : 'text-3xl'}`}>
        {value}{suffix}
      </p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-slate-500 text-sm">{message}</div>
  );
}
