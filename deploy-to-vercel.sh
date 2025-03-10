#!/bin/bash

echo "==================================="
echo "SEO Projects Tracker - Vercel Deploy"
echo "==================================="
echo

echo "Checking if Vercel CLI is installed..."
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Installing..."
  npm install -g vercel
else
  echo "Vercel CLI is already installed."
fi

echo
echo "Building the project..."
npm run build

echo
echo "Deploying to Vercel..."
echo "You may be prompted to log in if this is your first time using Vercel CLI."
echo
vercel --prod

echo
echo "Deployment process completed."
echo "If successful, your application is now live on Vercel!"
echo "Check your Vercel dashboard for the deployment URL and status."
echo
echo "==================================="
