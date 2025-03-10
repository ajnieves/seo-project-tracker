@echo off
echo ===================================
echo SEO Projects Tracker - Vercel Deploy
echo ===================================
echo.

echo Checking if Vercel CLI is installed...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
  echo Vercel CLI not found. Installing...
  npm install -g vercel
) else (
  echo Vercel CLI is already installed.
)

echo.
echo Building the project...
call npm run build

echo.
echo Deploying to Vercel...
echo You may be prompted to log in if this is your first time using Vercel CLI.
echo.
vercel --prod

echo.
echo Deployment process completed.
echo If successful, your application is now live on Vercel!
echo Check your Vercel dashboard for the deployment URL and status.
echo.
echo ===================================
