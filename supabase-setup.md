# Configuration Supabase

## Informations de connexion fournies

- **Project URL**: https://rcblsqviucwrjrmabonr.supabase.co
- **Anon Key (Public)**: sb_publishable_W7lVmNsy78XMosBJUgRiWw_92ggk7jS
- **Database Password**: 333dUJWZzYVt4NzM

## Pour connecter Prisma à Supabase

### Option 1: Connection Pooler (Recommandé pour serverless)

```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
```

### Option 2: Connexion directe

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres?schema=public"
```

## Étapes pour activer la connexion

1. **Récupérer la Service Role Key** (pour les opérations admin) :
   - Dashboard Supabase → Settings → API → service_role key

2. **Autoriser l'IP** si nécessaire :
   - Dashboard Supabase → Settings → Database → Connection Pooling

3. **Trouver la région du pooler** :
   - Dashboard Supabase → Settings → Database → Connection string
   - Format: `aws-0-[REGION].pooler.supabase.com`

## Configuration actuelle

Le projet utilise actuellement une base PostgreSQL externe pour le développement.
Pour basculer vers Supabase, décommentez les lignes Supabase dans `.env`.

## Utiliser l'API REST Supabase

```typescript
// Exemple avec fetch
const response = await fetch('https://rcblsqviucwrjrmabonr.supabase.co/rest/v1/your_table', {
  headers: {
    'apikey': 'YOUR_SERVICE_ROLE_KEY',
    'Authorization': 'Bearer YOUR_SERVICE_ROLE_KEY',
    'Content-Type': 'application/json'
  }
});
```

## Script de migration

```bash
# Une fois les bonnes credentials obtenues :
bunx prisma db push
bunx prisma db seed
```
