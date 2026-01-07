import { MOCK_MODE } from './config';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// Check if we have a real API key (not placeholder)
const hasRealApiKey = OPENAI_API_KEY && 
  !OPENAI_API_KEY.includes('placeholder') && 
  OPENAI_API_KEY.startsWith('sk-');

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | { type: string; text?: string; image_url?: { url: string } }[];
}

// System prompt for Unpack AI persona
const UNPACK_SYSTEM_PROMPT = `You are Unpack, a warm and insightful journaling companion. Your role is to help users process their thoughts and emotions through reflective conversation.

Your frameworks:
- Mental Models (First Principles, Second-Order Thinking, Inversion)
- Stoic Philosophy (focus on what you can control)
- Plutchik's Wheel of Emotions (identify and name emotions)
- ABC Model from CBT (Activating event → Beliefs → Consequences)

Your modes:
1. WISE FRIEND (when emotions are intense): Validate feelings first, offer empathy, use gentle language
2. THINKING PARTNER (when emotions are calmer): Challenge assumptions, offer frameworks, ask probing questions

Guidelines:
- Ask ONE thoughtful deepening question at a time
- Validate before analyzing
- Use "I notice..." and "I'm curious about..." language
- Never lecture or give unsolicited advice
- Keep responses concise (2-3 sentences + 1 question)
- Mirror the user's language and pace`;

// Smart mock responses that analyze user input
function generateSmartMockResponse(userMessage: string, tangentContext: string): string {
  const lowerMessage = userMessage.toLowerCase();
  const words = userMessage.split(/\s+/);
  const wordCount = words.length;
  
  // Detect emotional intensity
  const intenseWords = ['hate', 'love', 'angry', 'furious', 'devastated', 'ecstatic', 'terrified', 'anxious', 'depressed', 'hopeless', 'amazing', 'incredible'];
  const hasIntenseEmotion = intenseWords.some(word => lowerMessage.includes(word));
  
  // Detect question from user
  const isQuestion = userMessage.includes('?');
  
  // Detect themes
  const themes = {
    work: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'promotion', 'meeting'],
    relationship: ['friend', 'family', 'partner', 'mom', 'dad', 'brother', 'sister', 'relationship', 'love'],
    self: ['myself', 'i feel', 'i think', 'i am', "i'm", 'my life', 'who i'],
    future: ['future', 'tomorrow', 'next', 'plan', 'goal', 'dream', 'hope', 'want to'],
    past: ['remember', 'used to', 'before', 'when i was', 'back then', 'regret'],
    uncertainty: ["don't know", 'not sure', 'confused', 'uncertain', 'maybe', 'might'],
  };
  
  let detectedTheme = '';
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      detectedTheme = theme;
      break;
    }
  }
  
  // Extract a key phrase to mirror back (last 3-6 words before punctuation or end)
  const sentences = userMessage.split(/[.!?]+/).filter(s => s.trim());
  const lastSentence = sentences[sentences.length - 1]?.trim() || userMessage;
  const keyPhrase = lastSentence.split(/\s+/).slice(-4).join(' ');
  
  // Generate contextual response
  if (hasIntenseEmotion) {
    // Wise Friend mode - validate first
    const validations = [
      `I can feel the weight of that in your words. "${keyPhrase}" - that sounds really significant.`,
      `Thank you for sharing something so real. When you say "${keyPhrase}", I sense there's a lot beneath the surface.`,
      `That takes courage to express. I hear you when you say "${keyPhrase}".`,
    ];
    const validation = validations[Math.floor(Math.random() * validations.length)];
    
    const followUps = [
      "What does your body feel like when you sit with this?",
      "If this feeling could speak, what would it want you to know?",
      "What would it mean to give yourself permission to feel this fully?",
    ];
    return `${validation} ${followUps[Math.floor(Math.random() * followUps.length)]}`;
  }
  
  if (isQuestion) {
    // User asked a question - reflect it back
    return `That's a question worth sitting with. I'm curious what prompted you to ask that right now? What answer would feel most true to you?`;
  }
  
  if (detectedTheme === 'uncertainty') {
    return `I notice you're holding some uncertainty around "${keyPhrase}". That's okay - sometimes not knowing is its own kind of knowing. What would clarity look like for you here?`;
  }
  
  if (detectedTheme === 'work') {
    return `It sounds like your work is taking up real mental space right now. When you think about "${keyPhrase}", what's the feeling underneath the situation?`;
  }
  
  if (detectedTheme === 'relationship') {
    return `Relationships can be such mirrors for our own growth. I'm curious - in this dynamic you're describing, what do you need that you might not be expressing?`;
  }
  
  if (detectedTheme === 'future') {
    return `I hear you thinking ahead about "${keyPhrase}". What's one small thing about that future that excites you, and one thing that makes you nervous?`;
  }
  
  if (detectedTheme === 'past') {
    return `There's wisdom in looking back. As you reflect on "${keyPhrase}", what would your current self want to tell that past version of you?`;
  }
  
  if (wordCount < 10) {
    // Short response - encourage expansion
    return `I'd love to hear more. When you say "${keyPhrase}", what comes up for you? Don't filter - just let the thoughts flow.`;
  }
  
  // Default thoughtful response
  const defaults = [
    `I notice something important in "${keyPhrase}". What made you choose those particular words?`,
    `There's a thread here I want to pull on. When you wrote "${keyPhrase}", what were you feeling in that moment?`,
    `I'm sitting with what you shared. The phrase "${keyPhrase}" stands out to me. What's the story behind it?`,
  ];
  
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export async function extractTextFromImage(base64Image: string): Promise<{
  text: string;
  confidence: number;
}> {
  if (MOCK_MODE && !hasRealApiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      text: `Today I woke up feeling uncertain about my career path. The meeting yesterday really threw me off - I'm not sure if I should push for that promotion or look elsewhere. Part of me wants stability, but another part craves something new.

Also been thinking about Sarah and how our friendship has evolved. We used to talk every day, now it's once a month. Is this just life? Or should I make more effort?

On a brighter note, the sunrise this morning was beautiful. Reminded me to be grateful for small moments.`,
      confidence: 0.85,
    };
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract all handwritten text from this journal page. Return ONLY the extracted text, preserving line breaks and paragraph structure. If you cannot read certain words clearly, indicate with [unclear].',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  const extractedText = data.choices[0].message.content;
  
  const unclearCount = (extractedText.match(/\[unclear\]/g) || []).length;
  const wordCount = extractedText.split(/\s+/).length;
  const confidence = Math.max(0.3, 1 - (unclearCount / wordCount) * 2);

  return {
    text: extractedText,
    confidence,
  };
}

export async function generateOverview(extractedText: string): Promise<string> {
  if (MOCK_MODE && !hasRealApiKey) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return 'You wrote about feeling uncertain at a career crossroads while also reflecting on an evolving friendship. Despite these heavier thoughts, you found a moment of gratitude watching the sunrise.';
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a reflective journaling assistant. Create a brief, validating overview of the journal entry that clarifies the main themes without judgment. Use "You wrote about..." language. Keep it to 2-3 sentences.',
        },
        {
          role: 'user',
          content: `Create an overview for this journal entry:\n\n${extractedText}`,
        },
      ],
      max_tokens: 300,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export interface DiscoveredTangent {
  name: string;
  emotion: string;
  excerpt: string;
}

export async function discoverTangents(extractedText: string): Promise<DiscoveredTangent[]> {
  if (MOCK_MODE && !hasRealApiKey) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return [
      {
        name: 'Career crossroads',
        emotion: 'anticipation',
        excerpt: "I'm not sure if I should push for that promotion or look elsewhere",
      },
      {
        name: 'Evolving friendship',
        emotion: 'sadness',
        excerpt: 'We used to talk every day, now it\'s once a month',
      },
      {
        name: 'Morning gratitude',
        emotion: 'joy',
        excerpt: 'the sunrise this morning was beautiful',
      },
    ];
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Analyze this journal entry and identify distinct "tangents" - separate threads of thought or emotional themes. For each tangent, provide:
1. name: A brief 2-4 word label
2. emotion: The primary emotion (use Plutchik's wheel: joy, trust, fear, surprise, sadness, disgust, anger, anticipation, or their combinations)
3. excerpt: A key phrase from the text that represents this tangent

Return as JSON array: [{"name": "...", "emotion": "...", "excerpt": "..."}]
Identify 1-5 tangents depending on the content complexity.`,
        },
        {
          role: 'user',
          content: extractedText,
        },
      ],
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    }),
  });

  const data = await response.json();
  const parsed = JSON.parse(data.choices[0].message.content);
  return parsed.tangents || parsed;
}

export async function chat(
  tangentContext: string,
  messages: ChatMessage[]
): Promise<string> {
  // Get the last user message for context
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .pop()?.content as string || '';

  if (MOCK_MODE && !hasRealApiKey) {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    return generateSmartMockResponse(lastUserMessage, tangentContext);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `${UNPACK_SYSTEM_PROMPT}\n\nContext for this tangent:\n${tangentContext}`,
        },
        ...messages,
      ],
      max_tokens: 500,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
