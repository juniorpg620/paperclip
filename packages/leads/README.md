# @paperclipai/leads

Supabase-backed lead capture and management.

## Setup

1. Create a Supabase project at https://supabase.com.
2. Run the SQL in `src/migrations/0001_create_leads_table.sql` against your project
   (Supabase Dashboard → SQL Editor, or the Supabase CLI).
3. Set the following environment variables (see the root `.env.example`):

   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   ```

   `SUPABASE_SERVICE_ROLE_KEY` is preferred for server-side use (bypasses RLS via the
   `service_role` policy in the migration). `SUPABASE_ANON_KEY` is accepted as a fallback
   for client-side/anon usage.

## Usage

```ts
import { createLead, listLeads, updateLead } from "@paperclipai/leads";

const lead = await createLead({ name: "Ada Lovelace", email: "ada@example.com" });

const newLeads = await listLeads({ status: "new" });

await updateLead(lead.id, { status: "contacted" });
```
