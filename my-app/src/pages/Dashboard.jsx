import { useEffect, useState } from "react";// used for managing state and side effects in the Dashboard component
import { useNavigate } from "react-router-dom";// used for navigation between routes in the Dashboard component
import {
  CalendarClock,
  CheckCircle2,
  Info,
  ShieldCheck,
  Users,
} from "lucide-react";

import { useVoteAuth } from "../context/VoteAuthContext";
import { getElections, castVote } from "../Api/electionApi";

import CandidateCard from "../components/vote/CandidateCard";
import ThemedPageShell from "../components/common/ThemedPageShell";
import Footer from "../components/vote/Footer";
import Navbar from "../components/vote/Navbar";
import VoteButton from "../components/vote/VoteButton";

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated } = useVoteAuth();

  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState({});
  const [voted, setVoted] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/vote/login");
      return;
    }

    loadElections();

    // Poll for changes every 5 seconds to update automatically
    const interval = setInterval(() => {
      loadElections();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  async function loadElections() {
    try {
      const data = await getElections();
      setElections(data);
    } catch (error) {
      console.error("Failed to load elections:", error);
    }
  }

  async function handleVote(electionId) {
    if (!selected[electionId]) return;

    setLoading(true);

    try {
      await castVote(electionId, selected[electionId]);

      setVoted((prev) => ({
        ...prev,
        [electionId]: selected[electionId],
      }));

      alert("Your vote has been submitted successfully!");

      loadElections();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to submit your vote."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedPageShell>
      <Navbar />

      <main className="mx-auto min-h-[calc(100vh-148px)] max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-white/50 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                Voter workspace
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-normal text-slate-900 dark:text-white">
                Welcome
              </h1>

              <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                Review active elections, select your preferred candidate, and
                submit one secure ballot per election.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                {
                  icon: ShieldCheck,
                  label: "Identity",
                  value: "Verified",
                },  
                
                {
                  icon: CalendarClock,
                  label: "Status",
                  value: "Online",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/50 bg-white/90 p-5 backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
                  >
                    <Icon className="mb-3 h-5 w-5 text-emerald-700" />

                    <p className="text-sm font-semibold text-slate-500">
                      {item.label}
                    </p>

                    <p className="text-xl font-black">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </aside>

          <section className="space-y-6">
            {elections.length === 0 ? (
              <div className="rounded-lg border border-white/50 bg-white/90 p-8 text-center dark:border-white/10 dark:bg-slate-900/80">
                <h2 className="text-xl font-bold">
                  No elections available.
                </h2>
              </div>
            ) : (
              elections.map((election) => (
                <article
                  key={election.id}
                  className="rounded-lg border border-white/50 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
                >
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {election.status}
                      </div>

                      <h2 className="text-2xl font-black">
                        {election.title}
                      </h2>

                      <p className="mt-2 leading-7 text-slate-600">
                        {election.description}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-950 px-4 py-3 text-white">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                        Ends On
                      </p>

                      <p className="text-lg font-black">
                        {election.endDate}
                      </p>
                    </div>
                  </div>

                  {!voted[election.id] ? (
                    <>
                      <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <Info className="mt-0.5 h-5 w-5 shrink-0" />

                        <p>
                          Choose your preferred candidate carefully. Your vote
                          can only be submitted once.
                        </p>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {election.candidates?.map((candidate) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            selected={
                              selected[election.id] === candidate.id
                            }
                            onSelect={(id) =>
                              setSelected((prev) => ({
                                ...prev,
                                [election.id]: id,
                              }))
                            }
                          />
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-semibold text-slate-500">
                          Ends: {election.endDate}
                        </p>

                        <VoteButton
                          onClick={() => handleVote(election.id)}
                          disabled={!selected[election.id]}
                          loading={loading}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-5">
                      <div className="flex items-center gap-3 text-emerald-800">
                        <CheckCircle2 className="h-6 w-6" />

                        <p className="text-lg font-black">
                          Vote recorded successfully
                        </p>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-emerald-900">
                        Your vote has been securely recorded in the database.
                      </p>
                    </div>
                  )}
                </article>
              ))
            )}
          </section>
        </div>
      </main>

      <Footer />
    </ThemedPageShell>
  );
}