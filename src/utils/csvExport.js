/**
 * csvExport.js
 * Generates and triggers download of a CSV containing all scheduled posts in the calendar.
 */

import { DAYS } from '../store/useStore.js';

export function exportCalendarToCSV(posts) {
  const headers = ['Day', 'Time', 'Topic', 'Platforms', 'Content'];

  const dayMap = Object.fromEntries(DAYS.map((d) => [d.id, d.name]));

  const rows = posts.map((post) => {
    const day = dayMap[post.columnId] || 'Ideas Backlog';
    const time = post.time || '10:00 AM';
    const topic = post.topic || 'General';
    const platforms = (post.platforms || []).join(', ').toUpperCase();
    const content = `"${(post.content || '').replace(/"/g, '""')}"`;

    return [day, time, topic, platforms, content];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ContentFlow_Schedule_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
