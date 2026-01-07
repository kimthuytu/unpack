// App configuration
// Set MOCK_MODE to true to bypass API calls and use sample data
export const MOCK_MODE = true;

export const MOCK_USER = {
  id: 'mock-user-123',
  email: 'demo@unpack.app',
  name: 'Demo User',
  created_at: new Date().toISOString(),
  settings: {
    theme: 'system' as const,
    dataMode: 'cloud' as const,
  },
};

export const MOCK_TANGENTS = [
  {
    id: 'tangent-1',
    entry_id: 'entry-1',
    user_id: 'mock-user-123',
    name: 'Career crossroads',
    emotion: 'anticipation',
    is_interacted: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tangent-2',
    entry_id: 'entry-1',
    user_id: 'mock-user-123',
    name: 'Relationship dynamics',
    emotion: 'trust',
    is_interacted: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tangent-3',
    entry_id: 'entry-2',
    user_id: 'mock-user-123',
    name: 'Self-doubt spiral',
    emotion: 'fear',
    is_interacted: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: 'tangent-4',
    entry_id: 'entry-2',
    user_id: 'mock-user-123',
    name: 'Morning gratitude',
    emotion: 'joy',
    is_interacted: false,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const MOCK_ENTRY = {
  id: 'entry-1',
  user_id: 'mock-user-123',
  created_at: new Date().toISOString(),
  photo_urls: [],
  extracted_text: `Today I woke up feeling uncertain about my career path. The meeting yesterday really threw me off - I'm not sure if I should push for that promotion or look elsewhere. Part of me wants stability, but another part craves something new.

Also been thinking about Sarah and how our friendship has evolved. We used to talk every day, now it's once a month. Is this just life? Or should I make more effort?

On a brighter note, the sunrise this morning was beautiful. Reminded me to be grateful for small moments.`,
  overview: 'You wrote about feeling uncertain at a career crossroads while also reflecting on an evolving friendship. Despite these heavier thoughts, you found a moment of gratitude watching the sunrise.',
};

export const MOCK_MESSAGES = [
  {
    id: 'msg-1',
    tangent_id: 'tangent-1',
    role: 'ai' as const,
    content: "I hear that you're feeling pulled in different directions about your career. That tension between wanting stability and craving something new is so human. What does 'something new' look like to you?",
    created_at: new Date().toISOString(),
  },
];

