#!/bin/bash

# Quick Deploy Script for IPL 2020 Website
# Choose your deployment method:

echo "🚀 IPL 2020 Website Deployment"
echo ""
echo "Choose deployment method:"
echo "1. Netlify (Recommended)"
echo "2. Vercel"
echo "3. GitHub Pages"
echo ""

# For Netlify CLI (if installed)
if command -v netlify &> /dev/null; then
    echo "Netlify CLI detected!"
    read -p "Deploy to Netlify? (y/n): " choice
    if [ "$choice" = "y" ]; then
        netlify deploy --prod --dir=.
        echo "✅ Deployed! Check your Netlify dashboard for the URL"
    fi
fi

# For Vercel CLI (if installed)
if command -v vercel &> /dev/null; then
    echo "Vercel CLI detected!"
    read -p "Deploy to Vercel? (y/n): " choice
    if [ "$choice" = "y" ]; then
        vercel --prod
        echo "✅ Deployed! Check your Vercel dashboard for the URL"
    fi
fi

echo ""
echo "💡 If CLI tools are not installed, use the web interface:"
echo "   - Netlify: https://app.netlify.com/drop"
echo "   - Vercel: https://vercel.com/new"
echo ""
echo "📦 Deployment zip ready: ipl2020-deploy.zip"

