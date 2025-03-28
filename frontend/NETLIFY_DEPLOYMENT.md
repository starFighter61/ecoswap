# Deploying EcoSwap to Netlify

This guide will help you deploy the EcoSwap frontend to Netlify while connecting it to your backend API.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com/))
2. Your backend API deployed and accessible via a public URL
3. Git repository with your EcoSwap code

## Deployment Steps

### 1. Prepare Your Frontend for Production

The frontend has been configured to work with both local development and production environments. The key files that enable this are:

- `netlify.toml`: Contains build settings and redirects
- `src/utils/api.js`: Configures API requests to work in both environments
- `src/context/SocketContext.js`: Configures socket connections to work in both environments

### 2. Deploy Your Backend API

Before deploying the frontend, make sure your backend API is deployed and accessible via a public URL. You can deploy your backend to:

- Heroku
- DigitalOcean
- AWS
- Any other hosting service that supports Node.js applications

Make note of your backend API URL (e.g., `https://ecoswap-api.herokuapp.com`).

### 3. Deploy to Netlify

#### Option 1: Deploy via Netlify UI

1. Log in to your Netlify account
2. Click "New site from Git"
3. Connect to your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your EcoSwap repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Show advanced" and add the following environment variables:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://ecoswap-api.herokuapp.com/api`)
   - `REACT_APP_SOCKET_URL`: Your backend socket URL (e.g., `https://ecoswap-api.herokuapp.com`)
7. Click "Deploy site"

#### Option 2: Deploy via Netlify CLI

1. Install the Netlify CLI: `npm install -g netlify-cli`
2. Log in to Netlify: `netlify login`
3. Initialize your site: `netlify init`
4. Configure environment variables:
   ```
   netlify env:set REACT_APP_API_URL https://your-backend-api.com/api
   netlify env:set REACT_APP_SOCKET_URL https://your-backend-api.com
   ```
5. Deploy your site: `netlify deploy --prod`

### 4. Update Redirects in Netlify

The `netlify.toml` file includes redirects to handle API requests and client-side routing. Make sure to update the backend API URL in this file:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-api.com/api/:splat"
  status = 200
  force = true
```

Replace `https://your-backend-api.com` with your actual backend API URL.

### 5. Verify Deployment

1. Visit your Netlify site URL
2. Test the application functionality:
   - User registration and login
   - Browsing items
   - Creating new items
   - Messaging and swap functionality

## Troubleshooting

### CORS Issues

If you encounter CORS issues, make sure your backend API allows requests from your Netlify domain:

```javascript
// In your backend server.js or app.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'
  ],
  credentials: true
}));
```

### API Connection Issues

If the frontend can't connect to your API:

1. Check the environment variables in Netlify
2. Verify the redirects in `netlify.toml`
3. Check the browser console for specific error messages

### Build Failures

If your build fails on Netlify:

1. Check the build logs in the Netlify dashboard
2. Make sure all dependencies are properly listed in `package.json`
3. Verify that your build command is correct

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Create React App Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Handling CORS in Express](https://expressjs.com/en/resources/middleware/cors.html)