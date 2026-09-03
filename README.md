# V&V Society - Signature et paiement MonCash

Application Next.js pour le portail investisseur V&V Society :

- landing page d'entreprise ;
- formulaire investisseur ;
- signature manuscrite sur canvas ;
- creation d'une session de paiement MonCash via Bazik ;
- webhook Bazik avec verification HMAC sur body brut ;
- reverification serveur du statut de commande Bazik ;
- page de contrat signe et imprimable.

## Stack choisie

- Next.js 14 App Router
- Tailwind CSS
- API Routes Next.js en runtime Node.js
- Stockage JSON local pour le prototype
- Client HTTP serveur vers `https://api.bazik.io`

Le stockage local est dans `data/investments.json`. Ce fichier est ignore par
Git, car il peut contenir des donnees personnelles et des signatures.

Le SDK `@bazik/sdk` n'est pas utilise dans cette version. La doc JavaScript
actuelle ne documente que `payments.create({ amount, currency, customer })`,
alors que ce flux a besoin des champs MonCash complets : `gdes`, `userID`,
`successUrl`, `errorUrl`, `webhookUrl`, `referenceId`, `metadata` et
`GET /order/{orderId}`.

## Configuration

Copier `.env.example` vers `.env.local`, puis renseigner les cles Bazik :

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
BAZIK_API_URL=https://api.bazik.io
BAZIK_USER_ID=
BAZIK_SECRET_KEY=
BAZIK_WEBHOOK_SECRET=
```

Sans `BAZIK_USER_ID` et `BAZIK_SECRET_KEY`, l'application passe automatiquement
en mode demo.

`BAZIK_WEBHOOK_SECRET` est obligatoire pour accepter les webhooks Bazik. Il doit
correspondre au secret de l'environnement utilise, sandbox ou production.

## Commandes

```bash
npm run dev
npm run build
```

## Routes utiles

- `/fr` : accueil entreprise V&V Society
- `/fr/investir` : formulaire de signature et paiement
- `/fr/paiement/demo?investmentId=...` : paiement demo local
- `/fr/paiement/succes?investmentId=...` : retour paiement live
- `/fr/paiement/erreur?investmentId=...` : retour paiement annule
- `/fr/contrat/[investmentId]` : contrat signe
- `/api/bazik/webhook` : webhook Bazik
- `/api/investments/[investmentId]/verify` : reverification du paiement

## Notes de production

Pour une mise en production, remplacer le stockage JSON par une base de donnees
durable, par exemple Postgres ou Supabase. Les webhooks Bazik doivent pointer
vers l'URL publique HTTPS de production.

Points deja couverts par l'integration :

- secrets Bazik uniquement cote serveur ;
- token Bazik `access_token` mis en cache selon `expires_in` ;
- limite MonCash de 75 000 HTG par transaction ;
- `referenceId` unique persiste avant l'appel API ;
- signature webhook `X-Bazik-Signature` verifiee avec `X-Bazik-Timestamp`,
  `X-Bazik-Event-Id` et le body brut ;
- idempotence webhook avec `eventId` ou `transactionId` ;
- erreurs utilisateur sans exposition des secrets ou du detail interne.
# vv
