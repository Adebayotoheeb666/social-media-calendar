import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { PostCard } from './PostCard';
import { useStore } from '../store/useStore';

export function Column({ day }) {
  const { posts, setAIPanelOpen } = useStore();
  const columnPosts = posts.filter((p) => p.columnId === day.id);

  const { setNodeRef, isOver } = useDroppable({
    id: day.id,
  });

  return (
    <div className={`col-wrapper col-${day.id}`}>
      <div className="col-header">
        <div>
          <span className="day-name">{day.name}</span>
          {day.date && <div className="day-date">{day.date}</div>}
        </div>
        <span className="day-count">{columnPosts.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`col-body ${isOver ? 'drag-over' : ''}`}
      >
        <SortableContext
          items={columnPosts.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </SortableContext>

        <button
          className="add-card-btn"
          onClick={() => setAIPanelOpen(true)}
        >
          + Add Post
        </button>
      </div>
    </div>
  );
}
