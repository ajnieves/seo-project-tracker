# Supabase Authentication Integration

This document provides instructions on how to integrate Supabase authentication into the SEO Projects Tracker application, replacing the current localStorage-based authentication system.

## Benefits of Supabase Authentication

1. **Enhanced Security**:
   - Proper password hashing and salting
   - JWT-based authentication
   - Protection against common attacks

2. **Robust Features**:
   - Email verification
   - Password recovery
   - Social logins (Google, GitHub, etc.)
   - Multi-factor authentication

3. **Cross-Device Synchronization**:
   - Access data from any device
   - Real-time data updates
   - Consistent user experience

4. **Scalability**:
   - PostgreSQL database backend
   - Cloud-hosted infrastructure
   - Automatic backups

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Setup Instructions

### 1. Set Up Supabase MCP Server

1. Navigate to the MCP server directory:
   ```bash
   cd C:\Users\Angel\Documents\Cline\MCP\supabase-auth-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

4. Create a Supabase project:
   - Go to [Supabase](https://supabase.com/) and sign up or log in
   - Create a new project
   - Navigate to the project settings and copy your:
     - Project URL
     - Project API Key (anon public)

5. Configure MCP Settings:
   - Edit the MCP settings file at `c:\Users\Angel\AppData\Roaming\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
   - Add the Supabase auth server configuration:
   ```json
   {
     "mcpServers": {
       "supabase-auth": {
         "command": "node",
         "args": ["C:/Users/Angel/Documents/Cline/MCP/supabase-auth-server/build/index.js"],
         "env": {
           "SUPABASE_URL": "your-supabase-project-url",
           "SUPABASE_ANON_KEY": "your-supabase-anon-key"
         },
         "disabled": false,
         "autoApprove": []
       }
     }
   }
   ```

### 2. Switch to Supabase Authentication in the Application

#### Option 1: Complete Switch (Recommended)

1. Replace the current UserContext provider in `src/app/layout.tsx`:

```tsx
// From:
import { UserProvider } from '@/contexts/UserContext';

// To:
import { UserProvider } from '@/contexts/SupabaseUserContext';
```

2. Update the auth page in `src/app/auth/page.tsx`:

```tsx
// Replace the entire file content with:
export { default } from './supabase-page';
```

#### Option 2: Gradual Migration

If you prefer to gradually migrate to Supabase authentication:

1. Create a new route for Supabase authentication:
   - Keep the existing auth page at `/auth`
   - Add the Supabase auth page at `/auth/supabase`

2. Add a link to the Supabase auth page in the navigation:

```tsx
<Link href="/auth/supabase">
  <Button variant="outlined">Try Supabase Auth</Button>
</Link>
```

3. Once you're ready to fully switch, follow Option 1.

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the authentication page:
   - If using Option 1: Go to `/auth`
   - If using Option 2: Go to `/auth/supabase`

3. Test the following features:
   - User registration
   - User login
   - Password reset
   - User profile access

## Troubleshooting

### Common Issues

1. **MCP Server Connection Issues**:
   - Ensure the MCP server is properly configured in the settings file
   - Check that the Supabase URL and API key are correct
   - Verify that the server is built correctly

2. **Authentication Errors**:
   - Check browser console for error messages
   - Verify that the Supabase project has authentication enabled
   - Ensure email templates are configured in Supabase

3. **Integration Issues**:
   - Make sure all imports are updated to use the Supabase versions
   - Check that the UserProvider is correctly wrapped around the application

## Additional Customization

### Email Templates

You can customize the email templates for password reset, email verification, etc. in the Supabase dashboard:

1. Go to your Supabase project
2. Navigate to Authentication > Email Templates
3. Customize the templates to match your application's branding

### Social Logins

To enable social logins (Google, GitHub, etc.):

1. Go to your Supabase project
2. Navigate to Authentication > Providers
3. Configure the desired providers with their respective credentials

## Data Migration

If you need to migrate existing user data from localStorage to Supabase:

1. Export the current user data:
   ```javascript
   const users = JSON.parse(localStorage.getItem('seoUsers'));
   console.log(JSON.stringify(users, null, 2));
   ```

2. Import the users into Supabase using the Admin API (requires server-side code)

## Security Considerations

- Supabase handles password hashing and security
- JWT tokens are used for session management
- Email verification can be enabled in the Supabase dashboard
- All authentication is handled server-side
