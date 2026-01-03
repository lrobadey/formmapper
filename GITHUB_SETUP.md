# GitHub Setup Instructions

This guide will help you connect your local repository to GitHub and set up automatic updates.

## Quick Setup

### Option 1: Using the Setup Script (Recommended)

1. Run the setup script:
   ```bash
   ./setup-github.sh
   ```
   
   Or specify the repository name directly:
   ```bash
   ./setup-github.sh form-graph
   ```

2. Follow the prompts to connect to your GitHub repository.

### Option 2: Manual Setup

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Choose a repository name (e.g., "form-graph")
   - **Important:** Do NOT initialize with README, .gitignore, or license
   - Click "Create repository"

2. **Connect your local repository to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```
   
   Replace:
   - `YOUR_USERNAME` with your GitHub username
   - `YOUR_REPO_NAME` with your repository name

3. **Push your code to GitHub:**
   ```bash
   git push -u origin main
   ```
   
   If your default branch is `master` instead of `main`:
   ```bash
   git push -u origin master
   ```

## Automatic Updates

GitHub Actions has been configured to automatically run on:

- ✅ Every push to `main` or `master` branch
- ✅ Every pull request
- ✅ Manual trigger via GitHub Actions tab

The workflow (`.github/workflows/auto-update.yml`) will:
- Checkout your code
- Set up Node.js (if `package.json` exists)
- Install dependencies (if applicable)
- Run tests (if available)
- Build the project (if build script exists)

## Future Updates

After the initial setup, you can push updates with:

```bash
git add .
git commit -m "Your commit message"
git push
```

GitHub Actions will automatically run whenever you push to the main branch.

## Troubleshooting

### If you need to change the remote URL:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### To check your current remote:
```bash
git remote -v
```

### If you need to rename your default branch:
```bash
git branch -M main  # Renames current branch to 'main'
```

