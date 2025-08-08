# Supabase Integration for NoteLite (Angular)

## Integration Details

- This app uses the `@supabase/supabase-js` client to connect directly to Supabase from the Angular frontend.
- Supabase connection credentials are provided at runtime by the browser via global variables set in `index.html`:
  - `NG_APP_SUPABASE_URL`
  - `NG_APP_SUPABASE_KEY`
- These variables should map to the actual backend via environment configuration (or be injected at build/deploy time).
- The notes table expected (actual schema as of setup):
  - Table name: **notes**
  - Columns: 
    - `id` (UUID/PK), 
    - `title` (text), 
    - `content` (text), 
    - `category` (text, optional), 
    - `created_at` (timestamp), 
    - `updated_at` (timestamp)

## Usage Pattern

- The Angular service `NotesService` wraps CRUD operations using Supabase.
- All note CRUD and listing is performed via direct calls to Supabase from the browser.

## RLS Policy

- The `notes` table currently has the following Row Level Security (RLS) policy:
  - **Policy name:** Public CRUD access
  - **Roles:** public
  - **Permissive:** Yes (PERMISSIVE)
  - **Command:** ALL (full CRUD)
  - **Qualifier:** true (allows all operations for all users)
  - **With Check:** true

> **This means all CRUD operations on the `notes` table are allowed for the public role. Adjust RLS for production security as needed.**

## Important

- Ensure the Supabase project and table exist and have Row Level Security (RLS) set up as described above.
- The environment variables must be mapped/available at runtime for the code to function.

```env
NG_APP_SUPABASE_URL=your-project.supabase.co
NG_APP_SUPABASE_KEY=your-anon-public-key
```

Table structure should conform to the expected columns for full support.
