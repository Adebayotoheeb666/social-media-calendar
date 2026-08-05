/**
 * publisherService.js — Social Media Calendar auto-publisher.
 * Dispatches scheduled posts to Meta Graph API and LinkedIn.
 */

export async function publishPost(post) {
  const { platform, content, mediaUrl } = post;

  if (platform === 'instagram' || platform === 'facebook') {
    return publishToMeta({ platform, content, mediaUrl });
  }
  if (platform === 'linkedin') {
    return publishToLinkedIn({ content });
  }
  if (platform === 'twitter') {
    return publishToTwitter({ content });
  }
  return { ok: false, error: `Unsupported platform: ${platform}` };
}

async function publishToMeta({ platform, content, mediaUrl }) {
  const pageId = process.env.META_PAGE_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;

  if (pageId && accessToken) {
    try {
      const endpoint = mediaUrl
        ? `https://graph.facebook.com/v19.0/${pageId}/photos`
        : `https://graph.facebook.com/v19.0/${pageId}/feed`;

      const body = mediaUrl
        ? { url: mediaUrl, caption: content, access_token: accessToken }
        : { message: content, access_token: accessToken };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.id || data.post_id) {
        return { ok: true, provider: 'Meta Graph API', postId: data.id || data.post_id };
      }
      throw new Error(data.error?.message || 'Meta publish failed');
    } catch (err) {
      console.error('[Meta] Publish error:', err.message);
    }
  }

  console.log(`[Meta DEMO] Would publish to ${platform}: "${content.slice(0, 60)}"`);
  return { ok: true, provider: 'meta-demo', postId: `demo-${Date.now()}`, demo: true };
}

async function publishToLinkedIn({ content }) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

  if (token && authorUrn) {
    try {
      const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          author: authorUrn,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: { text: content },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
        }),
      });
      const data = await res.json();
      if (data.id) return { ok: true, provider: 'LinkedIn', postId: data.id };
      throw new Error(data.message || 'LinkedIn publish failed');
    } catch (err) {
      console.error('[LinkedIn] Publish error:', err.message);
    }
  }

  console.log(`[LinkedIn DEMO] Would publish: "${content.slice(0, 60)}"`);
  return { ok: true, provider: 'linkedin-demo', postId: `demo-${Date.now()}`, demo: true };
}

async function publishToTwitter({ content }) {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (bearerToken) {
    try {
      const res = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearerToken}` },
        body: JSON.stringify({ text: content.slice(0, 280) }),
      });
      const data = await res.json();
      if (data.data?.id) return { ok: true, provider: 'Twitter/X', postId: data.data.id };
      throw new Error(data.title || 'Twitter publish failed');
    } catch (err) {
      console.error('[Twitter] Publish error:', err.message);
    }
  }

  console.log(`[Twitter DEMO] Would tweet: "${content.slice(0, 60)}"`);
  return { ok: true, provider: 'twitter-demo', postId: `demo-${Date.now()}`, demo: true };
}
