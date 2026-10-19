import { useMemo, useState, useEffect } from "react";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  Plus,
  Trophy,
  UserRound,
  UsersRound,
  Vote,
} from "lucide-react";

import Navbar from "../components/vote/Navbar";
import Footer from "../components/vote/Footer";
import ThemedPageShell from "../components/common/ThemedPageShell";
import { useTheme } from "../context/ThemeContext";

import AdminSidebar from "../components/admin/AdminSidebar";
import ElectionForm from "../components/admin/ElectionForm";
import CandidateForm from "../components/admin/CandidateForm";
import ElectionTable from "../components/admin/ElectionTable";
import UserTable from "../components/admin/UserTable";
import ConfirmModal from "../components/admin/ConfirmModal";

import { getElections, createElection, toggleElection, getCandidatesByElection, createCandidate, getResults, getAdminStats, getAllUsers, createUser, deleteUser, deleteElection } from "../Api/electionApi";

const pageTitles = {
  dashboard: {
    title: "Admin Dashboard",
    desc: "Live summary from elections, candidates, voters, and results.",
  },
  elections: {
    title: "Election Management",
    desc: "Create voting rounds and open or close each election.",
  },
  candidates: {
    title: "Candidate Management",
    desc: "Register candidates and assign them to the correct election.",
  },
  users: {
    title: "User Management",
    desc: "Manage voters, administrators .",
  },
  results: {
    title: "Results Center",
    desc: "Review votes, leaders, and election reporting status.",
  },
  settings: {
    title: "Admin Settings",
    desc: "Change your admin password.",
  },
};

export default function Admin() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showElectionForm, setShowElectionForm] = useState(false);
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: "", id: null });
  const { darkMode } = useTheme();
  const theme = darkMode ? "dark" : "light";
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [settingsMessage, setSettingsMessage] = useState("");

  // API State
  const [elections, setElections] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalElections: 0, totalVotes: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "Voter" });
  const [userError, setUserError] = useState("");

  // Load data from backend
  const loadData = async (showLoadingSpinner = true) => {
    try {
      if (showLoadingSpinner) setLoading(true);
      setError(null);
      
      const [electionsData, statsData, usersData] = await Promise.all([
        getElections(),
        getAdminStats(),
        getAllUsers().catch(err => {
          console.error("Failed to load users:", err);
          return [];
        }),
      ]);

      setElections(electionsData || []);
      setStats(statsData || { totalElections: 0, totalVotes: 0 });
      setUsers(usersData || []);

      // Load candidates for all elections
      if (electionsData && electionsData.length > 0) {
        const candidatesData = await Promise.all(
          electionsData.map((election) =>
            getCandidatesByElection(election.id)
              .catch(() => []) // Handle errors gracefully
          )
        );
        const allCandidates = candidatesData.flat();
        setCandidates(allCandidates || []);
      } else {
        setCandidates([]);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
      setError("Failed to load data. Please refresh or contact support.");
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    loadData(true);

    // Poll for updates every 5 seconds to keep admin data synchronized
    const interval = setInterval(() => {
      loadData(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isLight = theme === "light";
  const activeCopy = pageTitles[currentPage];

  const computedStats = useMemo(() => {
    const totalVotes = candidates.reduce(
      (sum, candidate) => sum + Number(candidate.voteCount || 0),
      0
    );
    const activeElections = elections.filter(
      (election) => election.status === "ACTIVE"
    ).length;
    const voters = users.filter((user) => user.role?.toUpperCase() === "VOTER" || user.role === "Voter").length;
    const topCandidate = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))[0];

    return { totalVotes, activeElections, voters, topCandidate };
  }, [candidates, elections, users]);

  const chartItems = [
    { label: "Elections",  value: elections.length,  color: "bg-blue-500"    },
    { label: "Candidates", value: candidates.length, color: "bg-emerald-500" },
    { label: "Voters",     value: computedStats.voters,      color: "bg-violet-500"  },
    { label: "Votes",      value: computedStats.totalVotes,  color: "bg-amber-400"   },
  ];
  const maxChartValue = Math.max(...chartItems.map((i) => i.value), 1);

  const navigateAdmin = (page) => {
    setCurrentPage(page);
    setShowElectionForm(false);
    setShowCandidateForm(false);
    setShowUserForm(false);
    setUserError("");
    setSettingsMessage("");
  };

  const handleAddCandidate = () => {
    setCurrentPage("candidates");
    setShowCandidateForm(true);
    setShowElectionForm(false);
    setShowUserForm(false);
  };

  const handleCreateElection = async (election) => {
    try {
      const newElection = await createElection(election);
      setElections((current) => [newElection, ...current]);
      setShowElectionForm(false);
      setCurrentPage("elections");
    } catch (err) {
      console.error("Failed to create election:", err);
      alert("Failed to create election. Please try again.");
    }
  };

  const handleSaveCandidate = async (candidate) => {
    try {
      const newCandidate = await createCandidate(candidate);
      setCandidates((current) => [newCandidate, ...current]);
      setShowCandidateForm(false);
      setCurrentPage("candidates");
    } catch (err) {
      console.error("Failed to save candidate:", err);
      alert("Failed to save candidate. Please try again.");
    }
  };

  const handleToggleElection = async (id) => {
    try {
      const updatedElection = await toggleElection(id);
      setElections((current) =>
        current.map((item) =>
          item.id === id ? updatedElection : item
        )
      );
    } catch (err) {
      console.error("Failed to toggle election:", err);
      alert("Failed to toggle election. Please try again.");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || newUser.password.length < 12) {
      setUserError("Enter a name, email, and password of at least 12 characters.");
      return;
    }
    try {
      setUserError("");
      const created = await createUser(newUser);
      setUsers((current) => [created, ...current]);
      setNewUser({ name: "", email: "","password": "", "role": "Voter" });
      setShowUserForm(false);
      setCurrentPage("users");
    } catch (err) {
      console.error("Failed to add user:", err);
      setUserError(err.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  const handleRequestDelete = (type, id) => {
    setConfirmDelete({ open: true, type, id });
  };

  const handleConfirmDelete = async () => {
    if (confirmDelete.type === "user") {
      try {
        await deleteUser(confirmDelete.id);
        setUsers((current) =>
          current.filter((user) => user.id !== confirmDelete.id)
        );
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert(err.response?.data?.message || "Failed to delete user. Please try again.");
      }
    }
    if (confirmDelete.type === "election") {
      try {
        await deleteElection(confirmDelete.id);
        await loadData(false);
      } catch (err) {
        console.error("Failed to delete election:", err);
        alert(err.response?.data?.message || "Failed to delete election. Please try again.");
      }
    }
    if (confirmDelete.type === "candidate") {
      setCandidates((current) =>
        current.filter((item) => item.id !== confirmDelete.id)
      );
    }
    setConfirmDelete({ open: false, type: "", id: null });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setSettingsMessage("");

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setSettingsMessage("Please fill all password fields.");
      return;
    }
    if (passwordForm.next.length < 6) {
      setSettingsMessage("New password must be at least 6 characters.");
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setSettingsMessage("New password and confirmation do not match.");
      return;
    }

    setPasswordForm({ current: "", next: "", confirm: "" });
    setSettingsMessage("Password updated for this admin preview.");
  };

  // ── Theme classes ──────────────────────────────────────────
  const pageShell = "";

  const panelClass = isLight
    ? "border-slate-200 bg-white shadow-xl shadow-slate-200/60"
    : "border-white/10 bg-slate-950/80 shadow-[0_40px_120px_rgba(15,23,42,0.35)]";

  const cardClass = isLight
    ? "border-slate-200 bg-white text-slate-950"
    : "border-white/10 bg-slate-900/80 text-white";

  const mutedText = isLight ? "text-slate-500" : "text-slate-400";

  const inputClass = isLight
    ? "rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-blue-500"
    : "rounded-lg border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500";

  return (
    <ThemedPageShell>
      <div className={`min-h-screen ${pageShell}`}>
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)]">
        <AdminSidebar
          currentPage={currentPage}
          setCurrentPage={navigateAdmin}
          theme={theme}
        />

        <main className="flex-1 p-6 lg:p-10">
          <div className={`rounded-[2rem] border p-6 backdrop-blur-xl lg:p-8 ${panelClass}`}>

            {/* ── Page header ── */}
            <header className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-blue-400">
                  VoteSecure Admin
                </p>
                <h1 className="text-4xl font-black tracking-normal">
                  {activeCopy.title}
                </h1>
                <p className={`mt-2 text-lg ${mutedText}`}>{activeCopy.desc}</p>
              </div>

              <div className={`rounded-2xl border px-5 py-4 text-sm ${cardClass}`}>
                <p className="font-semibold">
                  Active elections: {computedStats.activeElections}
                </p>
                <p className={mutedText}>
                  Total counted votes: {computedStats.totalVotes}
                </p>
              </div>
            </header>

            {/* ── Dashboard ── */}
            {currentPage === "dashboard" && (
              <DashboardPanel
                cardClass={cardClass}
                mutedText={mutedText}
                elections={elections}
                candidates={candidates}
                users={users}
                stats={computedStats}
                chartItems={chartItems}
                maxChartValue={maxChartValue}
              />
            )}

            {/* ── Elections ── */}
            {currentPage === "elections" && (
              <section>
                <SectionTop
                  title="Elections"
                  desc="Create elections and toggle whether voting is active or closed."
                  buttonLabel={showElectionForm ? "Close Form" : "New Election"}
                  onClick={() => {
                    setShowElectionForm((v) => !v);
                    setShowCandidateForm(false);
                    setShowUserForm(false);
                  }}
                />
                {showElectionForm && (
                  <ElectionForm onCreate={handleCreateElection} />
                )}
                <div className="mt-6">
                  <ElectionTable
                    elections={elections}
                    onToggle={handleToggleElection}
                    onDelete={(id) => handleRequestDelete("election", id)}
                  />
                </div>
              </section>
            )}

            {/* ── Candidates ── */}
            {currentPage === "candidates" && (
              <section>
                <SectionTop
                  title="Candidates"
                  desc="Add candidate profiles and connect them to an election."
                  buttonLabel={showCandidateForm ? "Close Form" : "Add Candidate"}
                  onClick={() => {
                    if (showCandidateForm) {
                      setShowCandidateForm(false);
                    } else {
                      handleAddCandidate();
                    }
                  }}
                />

                <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                  {showCandidateForm && (
                    <div>
                      {elections.length ? (
                        <CandidateForm
                          onSave={handleSaveCandidate}
                          elections={elections}
                        />
                      ) : (
                        <EmptyCard text="Create an election first to assign candidates correctly." />
                      )}
                    </div>
                  )}

                  <div
                    className={`rounded-3xl border p-6 ${cardClass} ${
                      showCandidateForm ? "" : "xl:col-span-2"
                    }`}
                  >
                    <h3 className="mb-4 text-xl font-bold">Candidate roster</h3>
                    <div className="grid gap-4 lg:grid-cols-2">
                      {candidates.map((candidate) => (
                        <article
                          key={candidate.id}
                          className="rounded-2xl border border-white/10 bg-slate-950/20 p-5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={mutedText}>
                                {candidate.role} /{" "}
                                {candidate.party || "Independent"}
                              </p>
                              <h4 className="mt-1 text-xl font-black">
                                {candidate.name}
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                handleRequestDelete("candidate", candidate.id)
                              }
                              className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-400 hover:bg-rose-500/20"
                            >
                              Remove
                            </button>
                          </div>
                          <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
                            {candidate.bio}
                          </p>
                          <p className="mt-4 text-sm font-bold text-blue-400">
                            {candidate.election}
                          </p>
                          <p className="mt-2 text-sm font-semibold">
                            Votes: {candidate.voteCount}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Users ── */}
            {currentPage === "users" && (
              <section>
                <SectionTop
                  title="Users"
                  desc="Add users, assign roles, and remove outdated records."
                  buttonLabel={showUserForm ? "Close Form" : "Add User"}
                  onClick={() => setShowUserForm((v) => !v)}
                />

                {showUserForm && (
                  <form
                    onSubmit={handleAddUser}
                    className={`mt-6 rounded-3xl border p-6 ${cardClass}`}
                  >
                    <div className="grid gap-4 md:grid-cols-4">
                      <input
                        placeholder="Name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="Email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        className={inputClass}
                      />
                      <input
                        placeholder="Password (12+ characters)"
                        type="password"
                        minLength={12}
                        maxLength={72}
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className={inputClass}
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        }
                        className={inputClass}
                      >
                        <option value="Voter">Voter</option>
                        <option value="Administrator">Administrator</option>
                        <option value="Observer">Observer</option>
                      </select>
                    </div>
                    {userError && (
                      <p className="mt-4 text-rose-400">{userError}</p>
                    )}
                    <button
                      type="submit"
                      className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
                    >
                      Save User
                    </button>
                  </form>
                )}

                <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.45fr]">
                  <UserTable users={users} />
                  <div className={`rounded-3xl border p-6 ${cardClass}`}>
                    <h3 className="text-xl font-bold">User actions</h3>
                    <div className="mt-4 space-y-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-950/20 p-3"
                        >
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className={`text-sm ${mutedText}`}>{user.role}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRequestDelete("user", user.id)
                            }
                            className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm font-bold text-rose-400 hover:bg-rose-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Results ── */}
            {currentPage === "results" && (
              <ResultsPanel
                cardClass={cardClass}
                mutedText={mutedText}
                elections={elections}
                candidates={candidates}
                totalVotes={computedStats.totalVotes}
              />
            )}

            {/* ── Settings ── */}
            {currentPage === "settings" && (
              <SettingsPanel
                cardClass={cardClass}
                inputClass={inputClass}
                mutedText={mutedText}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                settingsMessage={settingsMessage}
                onSubmit={handleChangePassword}
              />
            )}
          </div>
        </main>
      </div>

      <Footer />

      <ConfirmModal
        open={confirmDelete.open}
        title="Confirm delete"
        message="This action will permanently remove the selected record. Proceed?"
        onConfirm={handleConfirmDelete}
        onCancel={() =>
          setConfirmDelete({ open: false, type: "", id: null })
        }
      />
      </div>
    </ThemedPageShell>
  );
}

// ════════════════════════════════════════════════════
//  DASHBOARD PANEL
// ════════════════════════════════════════════════════
function DashboardPanel({
  cardClass,
  mutedText,
  elections,
  candidates,
  users,
  stats,
  chartItems,
  maxChartValue,
}) {
  const cards = [
    { title: "Elections",   value: elections.length,  icon: Vote,       color: "text-blue-400"    },
    { title: "Candidates",  value: candidates.length, icon: UserRound,  color: "text-emerald-400" },
    { title: "Voters",      value: stats.voters,      icon: UsersRound, color: "text-violet-400"  },
    { title: "Total votes", value: stats.totalVotes,  icon: Trophy,     color: "text-amber-300"   },
  ];

  return (
    <section className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`rounded-3xl border p-6 ${cardClass}`}>
              <Icon className={`mb-5 h-8 w-8 ${card.color}`} />
              <p className={mutedText}>{card.title}</p>
              <p className="mt-2 text-4xl font-black">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className={`rounded-3xl border p-6 ${cardClass}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">Data bar chart</h2>
              <p className={mutedText}>
                Dashboard values gathered from all admin pages.
              </p>
            </div>
            <BarChart3 className="h-7 w-7 text-blue-400" />
          </div>

          <div className="flex h-72 items-end gap-5 rounded-3xl bg-slate-950/20 p-5">
            {chartItems.map((item) => {
              const height = Math.max(
                (item.value / maxChartValue) * 100,
                item.value ? 12 : 4
              );
              return (
                <div
                  key={item.label}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="text-sm font-bold">{item.value}</div>
                  <div className="flex h-full w-full items-end">
                    <div
                      className={`w-full rounded-t-2xl ${item.color} shadow-lg`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className={`text-center text-xs font-semibold ${mutedText}`}>
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`rounded-3xl border p-6 ${cardClass}`}>
          <h2 className="text-2xl font-black">Latest overview</h2>
          <div className="mt-5 space-y-4">
            <InfoRow
              label="Next election closing"
              value={elections[0]?.endDate || "N/A"}
              icon={CalendarDays}
            />
            <InfoRow
              label="Top candidate"
              value={stats.topCandidate?.name || "None"}
              icon={Trophy}
            />
            <InfoRow
              label="Registered users"
              value={users.length}
              icon={UsersRound}
            />
            <InfoRow
              label="Active elections"
              value={stats.activeElections}
              icon={CheckCircle2}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════
//  RESULTS PANEL
// ════════════════════════════════════════════════════
function ResultsPanel({ cardClass, mutedText, elections, candidates, totalVotes }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className={`rounded-3xl border p-6 ${cardClass}`}>
        <Trophy className="mb-5 h-9 w-9 text-amber-300" />
        <h2 className="text-2xl font-black">Election totals</h2>
        <p className={`mt-2 leading-7 ${mutedText}`}>
          Results are gathered from candidate vote counts and election records.
        </p>
        <div className="mt-6 grid gap-3">
          <InfoRow label="Total votes"        value={totalVotes}          icon={BarChart3}  />
          <InfoRow label="Elections tracked"  value={elections.length}    icon={Vote}       />
          <InfoRow label="Candidates tracked" value={candidates.length}   icon={UserRound}  />
        </div>
      </div>

      <div className={`rounded-3xl border p-6 ${cardClass}`}>
        <h2 className="mb-5 text-2xl font-black">Candidate result board</h2>
        <div className="space-y-4">
          {candidates.map((candidate) => {
            const percent = totalVotes
              ? ((candidate.voteCount / totalVotes) * 100).toFixed(1)
              : "0.0";
            return (
              <div key={candidate.id} className="rounded-2xl bg-slate-950/20 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{candidate.name}</p>
                    <p className={`text-sm ${mutedText}`}>{candidate.election}</p>
                  </div>
                  <p className="font-black">{percent}%</p>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-700/30">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  {candidate.voteCount} votes
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════
//  SETTINGS PANEL  —  Theme Mode removed ✅
//  Change Password card now takes full width
// ════════════════════════════════════════════════════
function SettingsPanel({
  cardClass,
  inputClass,
  mutedText,
  passwordForm,
  setPasswordForm,
  settingsMessage,
  onSubmit,
}) {
  return (
    <section>
      <form
        onSubmit={onSubmit}
        className={`rounded-3xl border p-6 ${cardClass}`}
      >
        <LockKeyhole className="mb-5 h-8 w-8 text-blue-400" />
        <h2 className="text-2xl font-black">Change password</h2>
        <p className={`mt-2 ${mutedText}`}>
          Update the admin password for this preview workflow.
        </p>

        <div className="mt-6 space-y-4">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.current}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, current: e.target.value })
            }
            className={`w-full ${inputClass}`}
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordForm.next}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, next: e.target.value })
            }
            className={`w-full ${inputClass}`}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={passwordForm.confirm}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirm: e.target.value })
            }
            className={`w-full ${inputClass}`}
          />
        </div>

        {settingsMessage && (
          <p className="mt-4 rounded-lg bg-blue-500/10 p-3 text-sm font-semibold text-blue-300">
            {settingsMessage}
          </p>
        )}

        <button
          type="submit"
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
        >
          Save password
        </button>
      </form>
    </section>
  );
}

// ════════════════════════════════════════════════════
//  SHARED HELPERS
// ════════════════════════════════════════════════════
function SectionTop({ title, desc, buttonLabel, onClick }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-2 text-slate-400">{desc}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 lg:w-auto"
      >
        <Plus className="h-5 w-5" />
        {buttonLabel}
      </button>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-950/20 p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-blue-400" />
        <span className="font-semibold">{label}</span>
      </div>
      <span className="font-black">{value}</span>
    </div>
  );
}

function EmptyCard({ text }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-600 bg-slate-950/20 p-6 text-slate-400">
      {text}
    </div>
  );
}