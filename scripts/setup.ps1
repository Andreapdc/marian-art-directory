# Generate a random CRON_SECRET
$CRON_SECRET = -join ((48..57) + (97..122) | Get-Random -Count 32 | % {[char]$_})

# Create .env.local file
@"
HARVARD_API_KEY=b48aab2f-36c4-461e-beec-847e4e5b623f
CRON_SECRET=$CRON_SECRET
NEXT_PUBLIC_SUPABASE_URL=https://pmbkkslkkwhtsfukjqhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtYmtrc2xra3dodHNmdWtqcWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNzczMjIsImV4cCI6MjA1Mjk1MzMyMn0.fdBL1ZOyrlllYz26qO21RoilqTy3QGoSw7-AQPomIVU
"@ | Out-File -FilePath ".env.local" -Encoding UTF8

# Install dependencies
npm install

# Initialize git if not already initialized
if (-not (Test-Path .git)) {
    git init
    git add .
    git commit -m "Initial commit"
}

Write-Host "Setup complete! Next steps:"
Write-Host "1. Deploy to Vercel: Run 'vercel'"
Write-Host "2. Set up GitHub repository secrets:"
Write-Host "   CRON_SECRET: $CRON_SECRET"
Write-Host "   VERCEL_URL: (Add after deploying to Vercel)"
Write-Host "3. Run the development server: npm run dev"
