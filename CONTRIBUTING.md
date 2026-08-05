# Contributing — Настройка на проекта и използване на assets

Този проект е Vite + React (TypeScript). По подразбиране поддържаме инсталация с npm/pnpm, но Bun е налична опция.

Prerequisites
- Node.js 18+ (ако ползвате npm/pnpm) или Bun (ако ползвате Bun).

Инсталация

Ако използвате npm (препоръчано като универсален вариант):
```bash
npm install
```

Ако предпочитате Bun:
```bash
bun install
```

Често използвани команди
- npm run dev          — стартира dev сървъра
- npm run build        — билд за продукция
- npm run build:dev    — билд в development mode
- npm run preview      — preview на билда
- npm run lint         — eslint
- npm run format       — prettier
- npm run setup        — (по подразбиране) изпълнява `npm install`
- npm run setup:bun    — изпълнява `bun install` (ако използвате Bun)

Бележки относно Bun
- В package.json има отделни скриптове за Bun (`setup:bun`, `ci:bun`). Ако не използвате Bun, ползвайте `npm install` директно, вместо `npm run setup`.

Използване на изображения (assets)

Всички локални изображения и статични ресурси, които искате да се обработват от Vite (import -> URL), сложете под `src/assets` (пример: `src/assets/photo.jpg`).

Пример импортиране в React компонент (Vite автоматично връща URL при import на файлове):

```tsx
import React from "react";
import photoUrl from "../assets/photo.jpg"; // смени името на файла по необходимост

export function ExampleImage() {
  return (
    <div>
      <h3>Пример за изображение от src/assets</h3>
      <img src={photoUrl} alt="Пример" style={{ maxWidth: "100%" }} />
    </div>
  );
}
```

Алтернативно: ако предпочитате да реферирате статични файлове без import, сложете ги в `public/` и ги достъпвайте като `/името-на-файла.jpg`.

Отстраняване на често срещани проблеми
- Ако виждате грешка при `npm install`, проверете дали всички имена на пакети в `package.json` са правилни (няма печатки). Например `vaul` е легитимен пакет, но ако библиотека се търси под друго име, коригирайте.
- Ако ESLint не може да парсне TypeScript файлове, уверете се, че `@typescript-eslint/parser` и `@typescript-eslint/eslint-plugin` са инсталирани (вече добавени в devDependencies).

Ако искате, мога да добавя и удобни npm-скриптове като `setup:node` или `check:deps`, или да добавя кратка секция в README с инструкции за развойна среда.