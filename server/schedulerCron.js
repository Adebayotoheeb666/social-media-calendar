/**
 * schedulerCron.js — Social Media Calendar background auto-publisher.
 * Polls a shared in-memory post queue every minute and publishes due posts.
 *
 * Usage: call startScheduler(app) from server.js to activate.
 * Posts are added to the queue via POST /api/calendar/schedule.
 */

import { publishPost } from './publisherService.js';

/* ── Shared in-memory post queue ── */
export const scheduledPosts = [];

/**
 * Register the /api/calendar/schedule endpoint and start the cron loop.
 * Uses a setInterval poll (60s) instead of node-cron for zero extra deps.
 * @param {import('express').Application} app
 */
export function startScheduler(app) {
  /* ── Schedule a post ── */
  app.post('/api/calendar/schedule', (req, res) => {
    const { id, platform, content, mediaUrl, scheduledAt } = req.body || {};
    if (!platform || !content || !scheduledAt) {
      return res.status(400).json({ error: 'platform, content, and scheduledAt are required' });
    }

    const post = {
      id: id || `post-${Date.now()}`,
      platform,
      content,
      mediaUrl: mediaUrl || null,
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    scheduledPosts.push(post);
    console.log(`[Scheduler] Post ${post.id} scheduled for ${post.scheduledAt} on ${platform}`);
    res.json({ ok: true, post });
  });

  /* ── List all scheduled posts ── */
  app.get('/api/calendar/posts', (_req, res) => {
    res.json({ ok: true, posts: scheduledPosts });
  });

  /* ── Manually publish a specific post ── */
  app.post('/api/calendar/publish/:id', async (req, res) => {
    const post = scheduledPosts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.status = 'publishing';
    const result = await publishPost(post);

    post.status = result.ok ? 'published' : 'failed';
    post.publishedAt = result.ok ? new Date().toISOString() : undefined;
    post.publishResult = result;

    console.log(`[Scheduler] Post ${post.id} ${post.status}`);
    res.json({ ok: true, post, result });
  });

  /* ── Update post status (from frontend drag-drop) ── */
  app.patch('/api/calendar/posts/:id', (req, res) => {
    const post = scheduledPosts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    Object.assign(post, req.body);
    res.json({ ok: true, post });
  });

  /* ── Cron ticker: every 60 seconds check for due posts ── */
  const tick = async () => {
    const now = new Date();
    const due = scheduledPosts.filter(
      p => p.status === 'scheduled' && new Date(p.scheduledAt) <= now
    );

    for (const post of due) {
      post.status = 'publishing';
      console.log(`[Cron] Auto-publishing post ${post.id} on ${post.platform}…`);

      const result = await publishPost(post);
      post.status = result.ok ? 'published' : 'failed';
      post.publishedAt = result.ok ? new Date().toISOString() : undefined;
      post.publishResult = result;

      console.log(`[Cron] Post ${post.id} ${post.status}`);
    }
  };

  setInterval(tick, 60_000);
  console.log('⏰ Social Calendar scheduler running — checking every 60s');
}
