'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SessionCard, type SessionSummary, type MovementDetail } from '@dado-triple/ui/web';

const API_URL =
  process.env.NEXT_PUBLIC_REALTIME_URL ?? 'http://localhost:4000';

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function fetchSessions(): Promise<SessionSummary[]> {
  const res = await fetch(`${API_URL}/api/sessions`);
  if (!res.ok) throw new Error('Error al cargar sesiones');
  return res.json();
}

async function fetchMovements(sessionId: string): Promise<MovementDetail[]> {
  const res = await fetch(`${API_URL}/api/sessions/${sessionId}/movements`);
  if (!res.ok) throw new Error('Error al cargar movimientos');
  return res.json();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistorialPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [movements, setMovements] = useState<Record<string, MovementDetail[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'finished' | 'playing'>('all');

  // Cargar sesiones al montar
  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Expandir/colapsar una sesión y cargar sus movimientos
  const toggleExpand = useCallback(async (sessionId: string) => {
    if (expandedId === sessionId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sessionId);
    if (!movements[sessionId]) {
      try {
        const movs = await fetchMovements(sessionId);
        setMovements((prev) => ({ ...prev, [sessionId]: movs }));
      } catch {
        // Si falla, mostrar vacío
        setMovements((prev) => ({ ...prev, [sessionId]: [] }));
      }
    }
  }, [expandedId, movements]);

  const filtered = sessions.filter((s) =>
    filter === 'all' ? true : s.status === filter,
  );

  return (
    <main className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">
            Historial de Partidas
          </h1>
          <p className="text-slate-400 text-sm">
            Sesiones registradas y detalle de movimientos · IGameSession
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'finished', 'playing'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                filter === f
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'finished' ? 'Finalizadas' : 'En curso'}
            </button>
          ))}

          <span className="ml-auto text-slate-500 text-xs self-center">
            {filtered.length} sesión{filtered.length !== 1 ? 'es' : ''}
          </span>
        </div>

        {/* Estados */}
        {loading && (
          <div className="py-16 text-center text-slate-500 text-sm animate-pulse">
            Cargando sesiones...
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 text-red-400 text-sm text-center">
            {error} — ¿El servidor está corriendo?
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="py-16 text-center text-slate-500 text-sm">
            No hay sesiones que coincidan con el filtro.
          </div>
        )}

        {/* Lista de sesiones */}
        {!loading && !error && (
          <div className="space-y-4">
            {filtered.map((session) => {
              const isExpanded = expandedId === session.id;
              return (
                <div key={session.id} className="rounded-xl overflow-hidden">
                  {/* Botón expandir */}
                  <button
                    onClick={() => toggleExpand(session.id)}
                    className="w-full text-left bg-transparent hover:opacity-90 transition-opacity"
                  >
                    <SessionCard
                      session={session}
                      movements={isExpanded ? movements[session.id] : undefined}
                    />
                  </button>

                  {/* Indicador de expansión */}
                  <div className="bg-[#1e293b] border-x border-b border-slate-700 rounded-b-xl px-6 py-2 flex items-center justify-center">
                    <span className="text-slate-500 text-xs">
                      {isExpanded
                        ? '▲ Ocultar movimientos'
                        : '▼ Ver movimientos'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
