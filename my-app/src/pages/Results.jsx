import { useEffect, useState } from "react";
import { BarChart3, Medal, ShieldCheck, TrendingUp } from "lucide-react";

import Footer from "../components/vote/Footer";
import ThemedPageShell from "../components/common/ThemedPageShell";
import Navbar from "../components/vote/Navbar";
import { getResults } from "../Api/electionApi";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getResults();
        setResults(data || []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load results. Please check backend connection.");
      } finally {
        setLoading(false);
      }
    }

    fetchResults();

    // Poll for changes every 5 seconds to update automatically
    const interval = setInterval(async () => {
      try {
        const data = await getResults();
        setResults(data || []);
      } catch (err) {
        console.error("Failed to poll results:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalBallots = results.reduce(
    (sum, election) => sum + Number(election.totalVotes || 0),
    0
  );

  return (
    <ThemedPageShell>
      <Navbar />

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
              Public result board
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-normal text-slate-900 dark:text-white">
              Election results
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/50 bg-white/90 px-4 py-3 text-sm font-bold text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200">
            <ShieldCheck className="h-5 w-5 text-emerald-700" />
            Auditable public totals
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-xl font-bold">Loading results...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[40vh] items-center justify-center text-red-500">
            <p className="text-xl font-bold">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <section className="space-y-6">
              {results.length === 0 ? (
                <div className="rounded-lg border border-white/50 bg-white/90 p-8 text-center dark:border-white/10 dark:bg-slate-900/80">
                  <h2 className="text-xl font-bold">No election results available yet.</h2>
                </div>
              ) : (
                results.map((election) => {
                  const sortedCandidates = [...(election.candidates || [])].sort(
                    (a, b) => (b.votes || 0) - (a.votes || 0)
                  );
                  const isReporting = election.status === "ACTIVE" ? "Active" : "Final";

                  return (
                    <article
                      key={election.electionId}
                      className="rounded-lg border border-white/50 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
                    >
                      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-2xl font-black">{election.title}</h2>
                          <p className="mt-2 text-sm font-semibold text-slate-500">
                            Auto-updates every 5 seconds
                          </p>
                        </div>
                        <div className="rounded-lg bg-slate-950 px-4 py-3 text-white">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                            Status
                          </p>
                          <p className="text-2xl font-black">{isReporting}</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-5">
                        {sortedCandidates.map((candidate, index) => {
                          const percent = election.totalVotes > 0
                            ? ((candidate.votes / election.totalVotes) * 100).toFixed(1)
                            : "0.0";
                          const isLeader = index === 0 && candidate.votes > 0;

                          return (
                            <div
                              key={candidate.id}
                              className="rounded-lg border border-white/50 p-4 backdrop-blur dark:border-white/10"
                            >
                              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                      isLeader
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-slate-100 text-slate-600"
                                    }`}
                                  >
                                    {isLeader ? (
                                      <Medal className="h-5 w-5" />
                                    ) : (
                                      <BarChart3 className="h-5 w-5" />
                                    )}
                                  </span>
                                  <div>
                                    <p className="font-black">{candidate.name}</p>
                                    <p className="text-sm font-semibold text-slate-500">
                                      {candidate.party}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-xl font-black">{percent}%</p>
                                  <p className="text-sm font-semibold text-slate-500">
                                    {(candidate.votes || 0).toLocaleString()} votes
                                  </p>
                                </div>
                              </div>

                              <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                  className={`h-full rounded-full ${
                                    isLeader ? "bg-emerald-500" : "bg-slate-400"
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  );
                })
              )}
            </section>

            <aside className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900/80">
                <TrendingUp className="mb-4 h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                <h2 className="text-xl font-black">Result integrity</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                  The board focuses on clear percentages, total ballots, reporting
                  progress, and update timing so voters can understand outcomes
                  quickly.
                </p>
              </div>
              <div className="rounded-lg bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Total ballots
                </p>
                <p className="mt-3 text-4xl font-black">{totalBallots.toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-300">Across active election results</p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </ThemedPageShell>
  );
}
