import { Link } from "react-router-dom";
import { BadgeCheck, BarChart3, ShieldCheck, Vote } from "lucide-react";

import ThemedPageShell from "../components/common/ThemedPageShell";
import Navbar from "../components/vote/Navbar";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Secure access",
    text: "Voters sign in through a protected account before entering the ballot area.",
  },
  {
    icon: BadgeCheck,
    title: "Verified ballots",
    text: "Each ballot is tied to one eligible voter so the voting process stays clear.",
  },
  {
    icon: BarChart3,
    title: "Live results",
    text: "Election results are presented in a simple board when voting is complete.",
  },
];

export default function Home() {
  return (
    <ThemedPageShell>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <main className="relative isolate flex min-h-[calc(100svh-76px)] flex-1 items-center justify-center overflow-hidden px-6 py-12 text-center">
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center">
            <div className="mb-8 hidden rounded-lg border border-white/20 bg-white/10 px-6 py-5 shadow-2xl backdrop-blur-md sm:block">
              <div className="flex items-center gap-3 text-left">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-400 text-slate-950">
                  <Vote className="h-8 w-8" />
                </span>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">VoteSecure</p>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-200">
                    Online voting portal
                  </p>
                </div>
              </div>
            </div>
            <h1 className="max-w-5xl text-4xl font-black leading-tight tracking-normal text-slate-900 drop-shadow-2xl dark:text-white sm:text-5xl lg:text-6xl">
              Welcome to the VoteSecure page
            </h1>

            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700 drop-shadow-md dark:text-slate-100 sm:text-xl">
              VoteSecure is an online voting website where voters can register,
              sign in safely, cast their ballot, and follow trusted election
              results from anywhere.
            </p>

            <Link
              to="/vote/login"
              className="mt-10 inline-flex min-h-16 min-w-40 items-center justify-center rounded-lg bg-emerald-500 px-10 py-4 text-2xl font-bold text-white shadow-2xl shadow-emerald-950/40 transition hover:-translate-y-1 hover:bg-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Next
            </Link>

            <div className="mt-16 grid w-full max-w-6xl gap-8 text-left md:grid-cols-3">
              {trustItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article key={item.title} className="text-slate-900 drop-shadow-xl dark:text-white">
                    <Icon className="mb-4 h-9 w-9 text-emerald-600 dark:text-emerald-300" />
                    <h2 className="text-xl font-black tracking-normal">
                      {item.title}
                    </h2>
                    <p className="mt-3 leading-7 text-slate-700 dark:text-slate-100">
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </ThemedPageShell>
  );
}
