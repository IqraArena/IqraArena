# Deploying IqraArena to Render.com

This guide will walk you through deploying your IqraArena application to Render.com.

## Prerequisites

1. A [Render.com](https://render.com) account (free tier available)
2. Your code pushed to a GitHub, GitLab, or Bitbucket repository
3. Your environment variables ready (from `.env` file)

## Deployment Steps

### 1. Push Your Code to GitHub

If you haven't already, push your code to a Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Create a New Static Site on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Static Site"**
4. Connect your Git repository
5. Select the repository containing your IqraArena project

### 3. Configure Your Static Site

Render will automatically detect the `render.yaml` file, but you can also configure manually:

**Basic Settings:**
- **Name:** `iqra-arena` (or your preferred name)
- **Branch:** `main` (or your default branch)
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 4. Add Environment Variables

In the Render dashboard, go to the **Environment** tab and add these variables:

```
VITE_SUPABASE_URL=https://fbmvmgkakfixqehnxmbx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibXZtZ2tha2ZpeHFlaG54bWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTg0NzQsImV4cCI6MjA3OTY3NDQ3NH0.Ah-e4DoUilFXI1A6XX_zpAweLLqMJdwCLpBuD_pexaU
VITE_CONTRACT_ADDRESS=0x92fee4ceb09f5da40525f833be818ca593cf82ff
VITE_THIRDWEB_CLIENT_ID=608148a3cf744981b9a5f3e6295be4c4
VITE_THIRDWEB_SECRET_KEY=Bhzg768As9OFMYCWHrEJZZSEKBQGLjB6gfLv2V_KekjJXv_rav2TVofX2TRlmuaw8Es_vpjqIjYyR3ohpygv9A
```

**Important:** Make sure all variables start with `VITE_` as they need to be embedded in your Vite build.

### 5. Deploy

Click **"Create Static Site"** and Render will:
1. Clone your repository
2. Install dependencies
3. Build your application
4. Deploy the built files

The deployment typically takes 2-5 minutes.

### 6. Access Your Site

Once deployment is complete, Render will provide you with a URL like:
```
https://iqra-arena.onrender.com
```

You can also add a custom domain in the Settings tab.

## Automatic Deployments

Render will automatically deploy your site whenever you push to your main branch. You can also:

- Enable **Auto-Deploy** for specific branches
- Set up **Deploy Hooks** for manual triggers
- Configure **Preview Environments** for pull requests

## Troubleshooting

### Build Fails

1. Check the build logs in Render dashboard
2. Verify all environment variables are set correctly
3. Make sure `NODE_VERSION` is compatible (18.x recommended)

### Environment Variables Not Working

- Ensure all variables start with `VITE_` prefix
- Rebuild the site after adding/changing variables
- Clear browser cache and hard refresh

### Routing Issues (404 on refresh)

The `_redirects` file is configured to handle client-side routing. If you still get 404s:
1. Verify `public/_redirects` file exists
2. Check that it's being copied to `dist` folder during build
3. Confirm the file contains: `/*    /index.html   200`

### Database Connection Issues

- Verify Supabase URL and API key are correct
- Check Supabase project is active and accessible
- Review Row Level Security (RLS) policies if data isn't loading

## Performance Optimization

Render's static site hosting includes:
- Global CDN for fast content delivery
- Automatic SSL/TLS certificates
- HTTP/2 support
- Brotli compression

For additional optimization:
- Consider enabling **Render's CDN cache** for static assets
- Use **Image optimization** services for cover images
- Monitor performance with Render's built-in analytics

## Updating Your Deployment

To update your live site:

1. Make changes locally
2. Test thoroughly
3. Commit and push to your repository:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
4. Render will automatically detect the changes and redeploy

## Custom Domain Setup

To use your own domain:

1. Go to your static site settings on Render
2. Click **"Custom Domains"**
3. Add your domain
4. Update your DNS records as instructed by Render
5. Render will automatically provision SSL certificate

## Support

- [Render Documentation](https://render.com/docs/static-sites)
- [Render Community Forum](https://community.render.com/)
- [Render Status Page](https://status.render.com/)

## Cost

Render's static site hosting is **free** for:
- Unlimited static sites
- 100GB bandwidth per month
- Global CDN
- Automatic SSL
- Custom domains

For higher bandwidth needs, check [Render's pricing](https://render.com/pricing).
