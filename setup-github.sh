#!/bin/bash

# GitHub Repository Setup Script
# This script helps you connect your local repository to GitHub

echo "🚀 GitHub Repository Setup"
echo "=========================="
echo ""

# Check if repository name is provided
if [ -z "$1" ]; then
    echo "Usage: ./setup-github.sh <repository-name>"
    echo ""
    echo "Example: ./setup-github.sh form-graph"
    echo ""
    echo "Please provide your GitHub repository name:"
    read REPO_NAME
else
    REPO_NAME=$1
fi

# Get GitHub username
echo "Enter your GitHub username (or press Enter to use 'lrobadey'):"
read GITHUB_USER
if [ -z "$GITHUB_USER" ]; then
    GITHUB_USER="lrobadey"
fi

# Check if remote already exists
if git remote get-url origin &>/dev/null; then
    echo ""
    echo "⚠️  Remote 'origin' already exists:"
    git remote get-url origin
    echo ""
    echo "Do you want to update it? (y/n)"
    read UPDATE_REMOTE
    if [ "$UPDATE_REMOTE" = "y" ] || [ "$UPDATE_REMOTE" = "Y" ]; then
        git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
        echo "✅ Remote updated!"
    else
        echo "Keeping existing remote."
        exit 0
    fi
else
    # Add remote
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    echo "✅ Remote 'origin' added!"
fi

echo ""
echo "📋 Next steps:"
echo "=============="
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: $REPO_NAME"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""
echo "2. Push your code to GitHub:"
echo "   git push -u origin main"
echo ""
echo "   (If your default branch is 'master' instead of 'main', use:)"
echo "   git push -u origin master"
echo ""
echo "3. After pushing, GitHub Actions will automatically run on:"
echo "   - Every push to main/master"
echo "   - Every pull request"
echo "   - Manual trigger via GitHub Actions tab"
echo ""

