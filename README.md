# Cultural Directory Website

A modern directory website that integrates AI for content curation, semantic structuring, and social media integration. The platform showcases authentic local exploration data, harmonizing human research with AI automation.

## Features

- Real-time art data from multiple prestigious museums
- AI-powered content curation and recommendations
- Dynamic search functionality
- Detailed artwork pages
- Automatic data synchronization

## Tech Stack

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Supabase
- **APIs**: 
  - Metropolitan Museum of Art
  - Art Institute of Chicago
  - Harvard Art Museums

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd marian-art-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```
   HARVARD_API_KEY=b48aab2f-36c4-461e-beec-847e4e5b623f
   CRON_SECRET=your-secret-key-here
   ```

4. **Set up Supabase**
   - Create a new project at [Supabase](https://supabase.com)
   - Add the following environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Run database migrations**
   - Copy the SQL from `supabase/init.sql`
   - Run it in your Supabase SQL editor

6. **Run the development server**
   ```bash
   npm run dev
   ```

## Deployment

1. **Deploy to Vercel**
   ```bash
   vercel
   ```

2. **Set up environment variables in Vercel**
   Add the following environment variables in your Vercel project settings:
   - `HARVARD_API_KEY`
   - `CRON_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Set up GitHub Actions**
   - Go to your GitHub repository settings
   - Add the following secrets:
     - `CRON_SECRET`: Same value as in your environment variables
     - `VERCEL_URL`: Your deployed Vercel URL

The GitHub Action will automatically sync art data every 6 hours.

## API Documentation

### Endpoints

- `GET /api/search?q=query`: Search for artworks
- `POST /api/sync`: Manually trigger data sync
- `POST /api/cron/sync`: Endpoint for automated sync (requires authentication)

### Data Sources

1. **Metropolitan Museum of Art**
   - Over 470,000 artworks
   - High-resolution images
   - Detailed metadata

2. **Art Institute of Chicago**
   - Comprehensive artwork collection
   - Exhibition information
   - Educational resources

3. **Harvard Art Museums**
   - Extensive collection data
   - Research materials
   - Curatorial insights

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
