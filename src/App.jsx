import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { useStore, DAYS } from './store/useStore';
import { Column } from './components/Column';
import { PostCard } from './components/PostCard';
import { AIPanel } from './components/AIPanel';
import { PostPreviewModal } from './components/PostPreviewModal';
import { exportCalendarToCSV } from './utils/csvExport';

export default function App() {
  const {
    posts,
    movePost,
    activePostId,
    setActivePostId,
    setAIPanelOpen,
  } = useStore();

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('contentflow_key');
    if (saved) setApiKey(saved);
  }, []);

  const saveApiKey = (k) => {
    setApiKey(k);
    if (k) localStorage.setItem('contentflow_key', k);
    else localStorage.removeItem('contentflow_key');
  };

  const showToast = (msg, type = 's') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const activePost = posts.find((p) => p.id === activePostId);

  const handleDragStart = (event) => {
    setActivePostId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeItem = posts.find((p) => p.id === activeId);
    if (!activeItem) return;

    // Is over a column day?
    const isOverColumn = DAYS.some((d) => d.id === overId);
    if (isOverColumn && activeItem.columnId !== overId) {
      movePost(activeId, overId);
      return;
    }

    // Is over another post?
    const overItem = posts.find((p) => p.id === overId);
    if (overItem && activeItem.columnId !== overItem.columnId) {
      movePost(activeId, overItem.columnId);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActivePostId(null);
    if (over) {
      showToast('Post rescheduled successfully! 🎉', 's');
    }
  };

  const handleExportCSV = () => {
    exportCalendarToCSV(posts);
    showToast('Exported calendar to CSV!', 'i');
  };

  return (
    <div className="app">
      {/* ── Nav ── */}
      <nav className="nav">
        <a href="#" className="nav-logo">
          <div className="logo-icon">📅</div>
          ContentFlow
        </a>
        <div className="nav-right">
          <span className="week-label">🗓️ Week of Aug 3 - Aug 7</span>
          <button
            className="btn btn-ghost"
            onClick={() => setShowApiKey((prev) => !prev)}
          >
            🔑 API Key
          </button>
          <button className="btn btn-outline" onClick={handleExportCSV}>
            📥 Export to CSV
          </button>
          <button
            className="btn btn-purple"
            onClick={() => setAIPanelOpen(true)}
          >
            ✨ Generate Post
          </button>
        </div>
      </nav>

      {/* ── API Key Panel ── */}
      {showApiKey && (
        <div className="ai-panel mt-6" style={{ padding: 20 }}>
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontWeight: 700, fontSize: '.9rem' }}>
              OpenAI API Key (Optional)
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowApiKey(false)}
            >
              Close
            </button>
          </div>
          <input
            type="password"
            className="ai-input"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => saveApiKey(e.target.value)}
          />
          <p className="text-muted mt-4" style={{ fontSize: '.78rem' }}>
            Without a key, the generator uses built-in smart copy templates — perfect for quick client demos!
          </p>
        </div>
      )}

      {/* ── Hero ── */}
      <div className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">Visual Social Media Planner</div>
          <h1>
            Drag, Drop &amp; Schedule
            <br />
            Next Week's Content in Minutes
          </h1>
          <p>
            Organize posts across LinkedIn, Twitter/X, and Instagram. Move cards
            between days or let AI write your first drafts automatically.
          </p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <strong>{posts.length}</strong>
            <span>Total Posts</span>
          </div>
          <div className="hero-stat">
            <strong>{posts.filter((p) => p.columnId !== 'ideas').length}</strong>
            <span>Scheduled</span>
          </div>
          <div className="hero-stat">
            <strong>{posts.filter((p) => p.columnId === 'ideas').length}</strong>
            <span>Ideas Backlog</span>
          </div>
        </div>
      </div>

      {/* ── Calendar Board Grid ── */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="calendar-scroll">
          <div className="calendar-grid">
            {DAYS.map((day) => (
              <Column key={day.id} day={day} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activePost ? <PostCard post={activePost} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* ── Modals ── */}
      <AIPanel apiKey={apiKey} />
      <PostPreviewModal />

      {/* ── Toast Notification ── */}
      {toast && (
        <div className="toast-wrap">
          <div className={`toast ${toast.type}`}>
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ── Outreach / Demo CTA ── */}
      <div className="cta">
        <h2>Want This Content Board For Your Marketing Team?</h2>
        <p>
          Position this template to social media managers, agencies, and creators.
          "This is what your content plan could look like every Monday morning instead of a blank page."
        </p>
        <div className="flex gap-2 justify-between items-center" style={{ justifyContent: 'center' }}>
          <button className="btn btn-white" onClick={() => setAIPanelOpen(true)}>
            Try AI Post Generator
          </button>
          <button className="btn btn-ghost-w" onClick={handleExportCSV}>
            Export Current Schedule
          </button>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer">
        <p>ContentFlow — Drag-and-Drop Social Media Calendar · Built with ⚡ vibe-coding · &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
