import React, { useState } from 'react';
import { useStore, DAYS } from '../store/useStore';
import { generatePostCopy } from '../utils/aiGenerator';

export function AIPanel({ apiKey }) {
  const { isAIPanelOpen, setAIPanelOpen, addPost } = useStore();
  const [topic, setTopic] = useState('Case Study');
  const [tone, setTone] = useState('Professional & Engaging');
  const [targetDay, setTargetDay] = useState('mon');
  const [platforms, setPlatforms] = useState(['li', 'tw']);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);

  if (!isAIPanelOpen) return null;

  const togglePlatform = (p) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const promptTopic = customPrompt.trim() || topic;
      const content = await generatePostCopy({
        topic: promptTopic,
        tone,
        platforms,
        apiKey,
      });

      addPost({
        columnId: targetDay,
        topic,
        platforms,
        content,
        time: '10:00 AM',
      });

      setAIPanelOpen(false);
      setCustomPrompt('');
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setAIPanelOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="ai-icon">✨</div>
            <div>
              <div className="modal-title">AI Post Generator</div>
              <div className="ai-panel-sub">Create high-converting drafts in seconds</div>
            </div>
          </div>
          <button className="modal-close" onClick={() => setAIPanelOpen(false)}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <form className="ai-form" onSubmit={handleGenerate}>
            <div>
              <label className="field-label">Content Topic / Angle</label>
              <select
                className="ai-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="Case Study">Case Study / Client Win</option>
                <option value="Thought Leadership">Thought Leadership / Opinion</option>
                <option value="Product Feature">Product Launch / Feature</option>
                <option value="Weekly Tip">Weekly Tip / How-To</option>
              </select>
            </div>

            <div>
              <label className="field-label">Custom Context / Prompt (Optional)</label>
              <textarea
                className="ai-textarea"
                placeholder="E.g. Mention our 20% summer sale and focus on saving time for agency founders..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            <div className="two-col" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label className="field-label">Schedule Day</label>
                <select
                  className="ai-select"
                  value={targetDay}
                  onChange={(e) => setTargetDay(e.target.value)}
                >
                  {DAYS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Brand Tone</label>
                <select
                  className="ai-select"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="Professional & Engaging">Professional & Engaging</option>
                  <option value="Casual & Friendly">Casual & Friendly</option>
                  <option value="Bold & Direct">Bold & Direct</option>
                  <option value="Educational">Educational</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">Target Platforms</label>
              <div className="plat-checkboxes">
                {[
                  { id: 'li', name: 'LinkedIn' },
                  { id: 'tw', name: 'Twitter/X' },
                  { id: 'ig', name: 'Instagram' },
                  { id: 'fb', name: 'Facebook' },
                ].map((p) => (
                  <div
                    key={p.id}
                    className={`plat-check ${
                      platforms.includes(p.id) ? `checked-${p.id}` : ''
                    }`}
                    onClick={() => togglePlatform(p.id)}
                  >
                    {platforms.includes(p.id) ? '✓' : '+'} {p.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setAIPanelOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-purple"
                disabled={generating || platforms.length === 0}
              >
                {generating ? (
                  <>
                    <div className="btn-spinner" /> Generating...
                  </>
                ) : (
                  <>✨ Generate Draft</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
