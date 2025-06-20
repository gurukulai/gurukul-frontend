
export const AI_AGENTS = {
  THERAPIST: {
    id: 'therapist',
    name: 'Mental Health Guru',
    shortName: 'Mind Guru',
    description: 'Your compassionate mental wellness guruji',
    longDescription: 'Get personalized therapy sessions, emotional support, and mental wellness guidance from our AI guruji trained in cognitive behavioral therapy techniques.',
    icon: '🧠',
    color: 'therapist',
    primaryColor: '#0ea5e9',
    gradientFrom: 'from-therapist-500',
    gradientTo: 'to-therapist-600',
    bgGradient: 'therapist-gradient',
    features: ['24/7 Support', 'CBT Techniques', 'Mood Tracking', 'Crisis Support'],
    route: '/therapist'
  },
  DIETICIAN: {
    id: 'dietician',
    name: 'Nutrition Guru',
    shortName: 'Food Guru',
    description: 'Your personalized nutrition guruji',
    longDescription: 'Receive customized meal plans, nutrition advice, and dietary guidance tailored to your health goals and cultural preferences from your food guru.',
    icon: '🥗',
    color: 'dietician',
    primaryColor: '#22c55e',
    gradientFrom: 'from-dietician-500',
    gradientTo: 'to-dietician-600',
    bgGradient: 'dietician-gradient',
    features: ['Meal Planning', 'Nutrition Analysis', 'Desi Cuisine', 'Health Tracking'],
    route: '/dietician'
  },
  CAREER: {
    id: 'career',
    name: 'Career Guru',
    shortName: 'Success Guru',
    description: 'Your professional development guruji',
    longDescription: 'Navigate your career path with personalized guidance, skill assessments, interview preparation, and job market insights from your career guru.',
    icon: '💼',
    color: 'career',
    primaryColor: '#f59e0b',
    gradientFrom: 'from-career-500',
    gradientTo: 'to-career-600',
    bgGradient: 'career-gradient',
    features: ['Career Planning', 'Skill Assessment', 'Interview Prep', 'Market Insights'],
    route: '/career'
  },
  PRIYA: {
    id: 'priya',
    name: 'Priya',
    shortName: 'Priya',
    description: 'Your friendly AI saathi',
    longDescription: 'Chat with Priya, your versatile AI friend who can help with daily tasks, answer questions, and provide companionship - just like your favorite elder sister!',
    icon: '👩',
    color: 'priya',
    primaryColor: '#ec4899',
    gradientFrom: 'from-priya-500',
    gradientTo: 'to-priya-600',
    bgGradient: 'priya-gradient',
    features: ['General Chat', 'Task Help', 'Entertainment', 'Learning Support'],
    route: '/priya'
  }
} as const;

export type AgentId = keyof typeof AI_AGENTS;

export const CHAT_CONFIG = {
  POLLING_INTERVAL: 2000, // 2 seconds
  MAX_RETRIES: 3,
  TYPING_DELAY: 500,
  MESSAGE_DISPLAY_DELAY: 1000,
  MAX_MESSAGES_PER_REQUEST: 5
};

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  CHAT: '/api/chat',
  MESSAGES: '/api/messages',
  USER_PROFILE: '/api/user'
};
