import React from "react";
import "../styles/BlueditAbout.css";

export default function BlueditAbout() {
  return (
    <div className="ba-page">
      <div className="ba-container">
        <header className="ba-header">
          <h1 className="ba-title">About Bluedit</h1>
          <p className="ba-lead">
            Bluedit was created by crab lovers, people who live in October, and Dexter fans — a strange, brilliant
            mix that somehow built the greatest community platform you didn't know you needed. Think of it as the
            internet's midnight diner: messy, warm, and full of stories that won't let you sleep.
          </p>
        </header>

        <section className="ba-grid" aria-label="features">
          <article className="ba-card">
            <div className="ba-card-inner">
              <div className="ba-icon-wrap" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"
                    stroke="#bfe0ff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <div className="ba-card-content">
                <h3 className="ba-card-title">Community First</h3>
                <p className="ba-card-text">
                  Built by people who love weird things, Bluedit puts communities at the center. Create subspaces,
                  ignite debates, and watch micro-cultures bloom — from crab aficionados to midnight plot theorists.
                </p>
              </div>
            </div>
          </article>

          <article className="ba-card">
            <div className="ba-card-inner">
              <div className="ba-icon-wrap" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 2s1.5 2.6 1.5 4.8S12 10.5 12 13.5 7.5 16 7.5 16 9 9.6 12 6.5 12 2 12 2z"
                    stroke="#bfe0ff"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </div>
              <div className="ba-card-content">
                <h3 className="ba-card-title">Trending & Amplified</h3>
                <p className="ba-card-text">
                  Hot topics surface fast. Whether it's a meme, a lifehack, or a theory about Dexter's finest hour,
                  Bluedit highlights what’s worthy of attention and what’s just pure chaos — both are welcome.
                </p>
              </div>
            </div>
          </article>

          <article className="ba-card">
            <div className="ba-card-inner">
              <div className="ba-icon-wrap" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="#bfe0ff" strokeWidth="1"></circle>
                  <path d="M2 12h20M12 2v20" stroke="#bfe0ff" strokeWidth="1"></path>
                </svg>
              </div>
              <div className="ba-card-content">
                <h3 className="ba-card-title">Global Voices</h3>
                <p className="ba-card-text">
                  From Cairo to Kalamazoo, Bluedit connects different worlds. Discover new perspectives and learn why
                  crab migration theories and October rituals matter to someone else out there.
                </p>
              </div>
            </div>
          </article>

          <article className="ba-card">
            <div className="ba-card-inner">
              <div className="ba-icon-wrap" aria-hidden>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 21l-4.35-4.35" stroke="#bfe0ff" strokeWidth="1.2" strokeLinecap="round"></path>
                  <circle cx="11" cy="11" r="6" stroke="#bfe0ff" strokeWidth="1.2"></circle>
                </svg>
              </div>
              <div className="ba-card-content">
                <h3 className="ba-card-title">Curiosity & Deep Dives</h3>
                <p className="ba-card-text">
                  Dexter-level analysis? Conspiracy threads? Niche fandoms? Bluedit rewards curiosity. Long-form posts,
                  threaded discussions, and community-driven investigations live here.
                </p>
              </div>
            </div>
          </article>
        </section>

        <footer className="ba-footer">
          <p className="ba-footer-text">
            This is the greatest platform because it refuses to be bland. It's designed for messy genius, late-night
            takes, and the kind of friendships that start under a niche post and last forever. Come for the crabs,
            stay for the conversations — and bring your weird.
          </p>
        </footer>
      </div>
    </div>
  );
}
