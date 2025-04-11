// Sample events for calendar demonstration
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

// Set specific times
const morning = new Date(today);
morning.setHours(9, 30, 0);

const afternoon = new Date(today);
afternoon.setHours(14, 0, 0);

const eveningTomorrow = new Date(tomorrow);
eveningTomorrow.setHours(18, 15, 0);

// Sample events
export const sampleEvents = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    scheduledAt: morning.toISOString(),
    platform: 'facebook',
    content: 'Excited to announce our new product line launching next week! Stay tuned for more details.',
    postId: 'post-1'
  },
  {
    id: '2',
    title: 'Weekly Industry Tips',
    scheduledAt: afternoon.toISOString(),
    platform: 'twitter',
    content: '5 ways to improve your productivity this week: 1. Set clear goals 2. Prioritize tasks 3. Take regular breaks 4. Minimize distractions 5. Reflect on progress',
    postId: 'post-2'
  },
  {
    id: '3',
    title: 'Behind the Scenes',
    scheduledAt: eveningTomorrow.toISOString(),
    platform: 'instagram',
    content: 'Take a peek behind the scenes of our latest photoshoot. Our team had a blast creating content for our summer collection!',
    postId: 'post-3'
  },
  {
    id: '4',
    title: 'Company Milestone',
    scheduledAt: nextWeek.toISOString(),
    platform: 'linkedin',
    content: 'We\'re proud to announce that we\'ve reached 10,000 customers! Thank you for your continued support and trust in our services.',
    postId: 'post-4'
  },
  {
    id: '5',
    title: 'Tutorial: Getting Started',
    scheduledAt: new Date(today.setDate(today.getDate() + 2)).toISOString(),
    platform: 'youtube',
    content: 'In this tutorial, we\'ll show you how to get started with our platform in just 5 minutes.',
    postId: 'post-5'
  },
  {
    id: '6',
    title: 'Product Demo',
    scheduledAt: new Date(today.setDate(today.getDate() + 3)).toISOString(),
    platform: 'tiktok',
    content: 'Check out how easy it is to use our new feature! #ProductDemo #HowTo',
    postId: 'post-6'
  },
  {
    id: '7',
    title: 'Customer Success Story',
    scheduledAt: new Date(today.setDate(today.getDate() + 5)).toISOString(),
    platform: 'facebook',
    content: 'Read how Company XYZ increased their revenue by 30% using our services!',
    postId: 'post-7'
  },
  {
    id: '8',
    title: 'Weekly Roundup',
    scheduledAt: new Date(today.setDate(today.getDate() - 2)).toISOString(),
    platform: 'twitter',
    content: 'Here\'s what you might have missed this week: [Thread]',
    postId: 'post-8'
  }
];

// Sample posts matching the events
export const samplePosts = [
  {
    id: 'post-1',
    title: 'Product Launch Announcement',
    content: 'Excited to announce our new product line launching next week! Stay tuned for more details.',
    platform: 'facebook',
    status: 'scheduled'
  },
  {
    id: 'post-2',
    title: 'Weekly Industry Tips',
    content: '5 ways to improve your productivity this week: 1. Set clear goals 2. Prioritize tasks 3. Take regular breaks 4. Minimize distractions 5. Reflect on progress',
    platform: 'twitter',
    status: 'scheduled'
  },
  {
    id: 'post-3',
    title: 'Behind the Scenes',
    content: 'Take a peek behind the scenes of our latest photoshoot. Our team had a blast creating content for our summer collection!',
    platform: 'instagram',
    status: 'scheduled'
  },
  {
    id: 'post-4',
    title: 'Company Milestone',
    content: 'We\'re proud to announce that we\'ve reached 10,000 customers! Thank you for your continued support and trust in our services.',
    platform: 'linkedin',
    status: 'scheduled'
  },
  {
    id: 'post-5',
    title: 'Tutorial: Getting Started',
    content: 'In this tutorial, we\'ll show you how to get started with our platform in just 5 minutes.',
    platform: 'youtube',
    status: 'scheduled'
  },
  {
    id: 'post-6',
    title: 'Product Demo',
    content: 'Check out how easy it is to use our new feature! #ProductDemo #HowTo',
    platform: 'tiktok',
    status: 'scheduled'
  },
  {
    id: 'post-7',
    title: 'Customer Success Story',
    content: 'Read how Company XYZ increased their revenue by 30% using our services!',
    platform: 'facebook',
    status: 'scheduled'
  },
  {
    id: 'post-8',
    title: 'Weekly Roundup',
    content: 'Here\'s what you might have missed this week: [Thread]',
    platform: 'twitter',
    status: 'scheduled'
  }
];