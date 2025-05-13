# ChallengeCraft AI

A responsive, AI-driven challenge platform leveraging the Open Router API for dynamic task generation.

## Features

- **AI-Generated Challenges**: Dynamic tasks created through the Open Router API
- **Interactive UI**: Animated challenge cards and intuitive navigation
- **Progress Tracking**: Monitor your improvement over time
- **Adaptive Difficulty**: Challenges scale based on user performance
- **Real-time Updates**: Live notifications and updates via WebSockets
- **Visual Feedback**: Canvas-based visualizations for challenge completion

## Technologies

- HTML5, CSS3 (Flexbox/Grid)
- ES6+ JavaScript
- Open Router API Integration
- WebSockets for real-time communication
- Canvas for visual feedback
- Responsive design for all devices

## Setup

1. Clone this repository
2. Create a `.env` file with your Open Router API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
3. Open `index.html` in your browser or set up a local server

## Development

To run the development server:

```bash
npm install
npm start
```

## Structure

- `/assets` - Images, icons, and other static assets
- `/css` - Stylesheets
- `/js` - JavaScript files
  - `/js/api` - API integration
  - `/js/components` - UI components
  - `/js/utils` - Utility functions
- `/index.html` - Main entry point 