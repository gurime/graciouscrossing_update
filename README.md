This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Property owner listings

Approved property-owner accounts can create, edit, publish, save drafts, and delete their own property listings from `/admin`. New accounts created through Register start as regular users. They can request owner access from `/account`; site administrators review requests at `/admin/owner-requests`. Listings marked Published appear in public property search; drafts are visible only to their owner. Property photos are stored in the `property-images` Supabase Storage bucket.

To enable listing management in a Supabase project:

1. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the project-root `.env.local`.
2. Open the Supabase SQL Editor and run [`supabase/migrations/20261004160000_owner_property_listings.sql`](./supabase/migrations/20261004160000_owner_property_listings.sql), then [`supabase/migrations/20261004173000_property_owner_company_name.sql`](./supabase/migrations/20261004173000_property_owner_company_name.sql), then [`supabase/migrations/20261005164500_account_roles_and_owner_approval.sql`](./supabase/migrations/20261005164500_account_roles_and_owner_approval.sql). The final migration changes new accounts to the regular-user role, moves existing owner accounts without listings to regular-user access, preserves owners with listings, and installs the request-review flow and access controls.
3. Register or sign in with the account that should administer the site. In the Supabase SQL Editor, replace the example email with that account's email and run:

   ```sql
   update public.profiles
   set role = 'admin'
   where id = (
     select id from auth.users where email = 'admin@example.com'
   );
   ```

   Confirm that one profile row was updated. Do not give admin access to property owners; admins can review access requests and administer listings. Owners can manage only their own listings.

The public site continues to show clearly identified illustrative examples alongside published owner listings.

### Set the name shown on a listing

Run [`supabase/migrations/20261004173000_property_owner_company_name.sql`](./supabase/migrations/20261004173000_property_owner_company_name.sql) in the Supabase SQL Editor. Then set `owner_company_name` on a property row in the `properties` table; the value appears as “Listed by …” on the public listing and in the owner dashboard. For example:

```sql
update public.properties
set owner_company_name = 'Oak Street Realty'
where slug = 'oak-street-home-a1b2c3d4';
```

You can also set or change this optional value in the property editor.
