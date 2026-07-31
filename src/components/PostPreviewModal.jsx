import React, { useState } from 'react';
import { useStore } from '../store/useStore';

export function PostPreviewModal() {
  const { previewPost, setPreviewPost } = useStore();
  const [activeTab, setActiveTab] = useState(previewPost?.platforms?.[0] || 'li');

  if (!previewPost) return null;

  return (
    <div className="modal-backdrop" onClick={() => setPreviewPost(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Post Preview</div>
          <button className="modal-close" onClick={() => setPreviewPost(null)}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="flex gap-2 mb-4" style={{ marginBottom: 16 }}>
            {(previewPost.platforms || ['li']).map((p) => (
              <button
                key={p}
                className={`btn btn-sm ${
                  activeTab === p ? 'btn-purple' : 'btn-outline'
                }`}
                onClick={() => setActiveTab(p)}
              >
                {p.toUpperCase()} Preview
              </button>
            ))}
          </div>

          <div className="preview-card">
            <div className="preview-card-header">
              <div className="preview-avatar">CF</div>
              <div>
                <div className="preview-name">ContentFlow Brand</div>
                <div className="preview-handle">@contentflow · Scheduled {previewPost.time}</div>
              </div>
            </div>

            <div className="preview-body">{previewPost.content}</div>

            <div className="preview-footer">
              <span className="preview-action">💬 Comment</span>
              <span className="preview-action">🔁 Repost</span>
              <span className="preview-action">❤️ Like</span>
              <span className="preview-action">📊 Analytics</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted" style={{ fontSize: '.78rem' }}>
              Topic: <strong>{previewPost.topic}</strong>
            </span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPreviewPost(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
