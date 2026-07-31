import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';

const PLATFORM_MAP = {
  ig: { label: 'IG', class: 'plat-ig' },
  li: { label: 'LinkedIn', class: 'plat-li' },
  tw: { label: '𝕏 Twitter', class: 'plat-tw' },
  fb: { label: 'FB', class: 'plat-fb' },
  yt: { label: 'YouTube', class: 'plat-yt' },
};

export function PostCard({ post, isOverlay = false }) {
  const { setPreviewPost, deletePost } = useStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: post.id,
    data: { post },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardClasses = `post-card ${isDragging ? 'dragging' : ''} ${isOverlay ? 'drag-overlay' : ''}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cardClasses}
      {...attributes}
      {...listeners}
    >
      <div className="card-drag-handle">⠿</div>
      
      <div className="card-top">
        <div className="card-platforms">
          {post.platforms.map((p) => (
            <span key={p} className={`plat ${PLATFORM_MAP[p]?.class || 'plat-li'}`}>
              {PLATFORM_MAP[p]?.label || p}
            </span>
          ))}
        </div>
        <span className="card-time">{post.time}</span>
      </div>

      {post.topic && <div className="card-topic">{post.topic}</div>}

      <div className="card-body">
        {post.content.length > 120
          ? `${post.content.slice(0, 117)}...`
          : post.content}
      </div>

      <div className="card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="card-action-btn"
          onClick={() => setPreviewPost(post)}
          title="Preview Post"
        >
          👁️ Preview
        </button>
        <button
          className="card-action-btn"
          onClick={() => deletePost(post.id)}
          title="Delete Post"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
