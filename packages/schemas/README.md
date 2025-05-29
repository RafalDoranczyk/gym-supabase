# @repo/schemas

This package contains all shared **Zod schemas**, **types**, and **validation utilities** used across the `gym-supabase` monorepo.  
It provides a single source of truth for input validation, type safety, and API contracts.

---

## 📁 Structure

```
src/
├── ingredient/         ← Ingredient schemas and types
│   ├── const.ts
│   ├── enums.ts
│   ├── schemas.ts
│   ├── search-params.ts
│   └── index.ts
├── shared/             ← Reusable helpers (validation, primitives)
│   ├── schemas.ts
│   ├── validationMessages.ts
│   └── index.ts
├── meal/               ← (placeholder)
├── measurements/       ← (placeholder)
├── nutrition-group/    ← (placeholder)
└── index.ts            ← Re-exports everything for external use
```

---

## 🧩 Usage Example

Import schemas or types from the root:

```ts
import { CreateIngredientPayloadSchema, IngredientSearchParams } from '@repo/schemas';
```

Use in validation logic:

```ts
const parsed = CreateIngredientPayloadSchema.parse(data);
```

---

## 📦 Built With

- **Zod** – schema validation & type inference
- **TypeScript** – strict typing across all layers
- **Modular structure** – scalable and maintainable

---

## 🛠 Development

Build types:

```bash
npm run build
```

Watch changes during development:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Clean cache/build:

```bash
npm run clean
```

---

## 🚧 Coming Soon

- `meal/`, `measurements/`, `nutrition-group/` schemas
- shared error map & test utils

---

Made with ❤️ for `gym-supabase`.