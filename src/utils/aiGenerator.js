/**
 * aiGenerator.js
 * Generates social media post copy based on topic, tone, and target platforms.
 * Uses OpenAI GPT-4o-mini when an API key is provided, otherwise falls back to pre-built high quality templates.
 */

const TEMPLATES = {
  'Case Study': [
    "🚀 Case Study Spotlight:\n\nWe partnered with [Client] to revamp their lead funnel. Here are the 3 changes that drove a +140% surge in conversions:\n\n1️⃣ Clearer call to action above the fold\n2️⃣ Instant automated response within 60s\n3️⃣ Highlighting real customer testimonials\n\nWhich of these are you testing this month?",
    "📈 Real Results:\n\nHow a 2-person team automated 80% of their customer inquiry workflow without hiring extra staff.\n\nKey takeaways:\n• Standardized response templates\n• Webhook notifications for urgent leads\n• Weekly performance review\n\nDrop a comment if you want the breakdown video!",
  ],
  'Thought Leadership': [
    "Unpopular opinion: Consistency beats perfection every single time in content marketing.\n\nMost teams overthink every post, delay publishing, and lose momentum.\n\nKeep it simple:\n- Solve one real problem per post\n- Speak like a human\n- Include a clear next step\n\nAgree or disagree?",
    "The biggest mistake small business owners make with social media?\n\nTreating it like a digital brochure instead of an ongoing conversation.\n\nShare behind-the-scenes moments, real lessons learned, and direct client wins. Authenticity converts better than polished ads.",
  ],
  'Product Feature': [
    "✨ Feature Spotlight:\n\nSay goodbye to scattered notes and spreadsheets. Our new calendar view puts all your upcoming posts in one clean drag-and-drop board.\n\nPlan faster, collaborate smoother, and ship on time.",
    "🎉 Just launched:\n\nOne-click AI post generation tailored to your brand voice! Turn a single topic sentence into ready-to-publish drafts across LinkedIn, Twitter, and Instagram.",
  ],
  'Weekly Tip': [
    "💡 Content Creator Tip of the Week:\n\nRepurpose your top performing post into 3 formats:\n1. Detailed text post for LinkedIn\n2. Short snappy thread for Twitter/X\n3. Visual carousel for Instagram\n\nWork smarter, not harder!",
    "⏰ Time-saving hack:\n\nSpend 30 minutes on Friday planning next week's content schedule. You'll enter Monday with clear focus instead of staring at a blank screen.",
  ],
};

export async function generatePostCopy({ topic, tone, platforms, apiKey }) {
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media manager. Generate an engaging, high-converting social media post based on the requested topic and tone. Include relevant emojis and a clear hook.',
            },
            {
              role: 'user',
              content: `Topic: ${topic}\nTone: ${tone || 'Professional & Engaging'}\nPlatforms: ${platforms.join(', ')}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices?.[0]?.message?.content?.trim();
      }
    } catch (e) {
      console.warn('OpenAI API call failed, using fallback generator:', e);
    }
  }

  // Fallback generation logic
  const categoryTemplates = TEMPLATES[topic] || TEMPLATES['Weekly Tip'];
  const base = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  return base;
}
