#!/bin/bash

# Generate a random CRON_SECRET
CRON_SECRET=$(openssl rand -hex 32)

# Create .env.local file
cat > .env.local << EOL
HARVARD_API_KEY=b48aab2f-36c4-461e-beec-847e4e5b623f
CRON_SECRET=$CRON_SECRET
NEXT_PUBLIC_SUPABASE_URL=https://pmbkkslkkwhtsfukjqhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzczMjIsImV4cCI6MjA1Mjk1MzMyMn0.fdBL1ZOyrlllYz26qO21RoilqTy3QGoSw7-AQPomIVU
EOL

# Install dependencies
npm install

# Initialize git if not already initialized
if [ ! -d .git ]; then
  git init
  git add .
  git commit -m "Initial commit"
fi

# Create GitHub repository if gh CLI is installed
if command -v gh &> /dev/null; then
  echo "Creating GitHub repository..."
  gh repo create marian-art-directory --public --source=. --remote=origin --push
fi

echo "Setup complete! Next steps:"
echo "1. Deploy to Vercel: Run 'vercel'"
echo "2. Set up GitHub repository secrets:"
echo "   CRON_SECRET: $CRON_SECRET"
echo "   VERCEL_URL: (Add after deploying to Vercel)"
echo "3. Run the development server: npm run dev"
