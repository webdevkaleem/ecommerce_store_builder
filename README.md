> This project is still in progress and not yet complete. Contributions and feedback are welcome!

# E-commerce Store Builder

![Backed categories page overview](git_images/backend_categories.png)


This is an open-source e-commerce website builder inspired by platforms like Shopify. Built using the T3 stack, it features a customizable storefront and an admin CMS for managing products and settings.

### Frontend

<div style="display:flex;">
<!-- Main -->
<!-- Nextjs -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Next JS&color=000000&logo=Next.js&logoColor=white&style=flat">
<!-- Typescript -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Typescript&color=2F74C0&logo=Typescript&logoColor=white&style=flat">
<!-- tRPC -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=tRPC&color=3788C5&logo=TRPC&logoColor=white&style=flat">

<!-- Styling -->
<!-- Tailwind -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Tailwind&color=38BDF8&logo=TailwindCSS&logoColor=white&style=flat">
<!-- Radix -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Radix&color=000000&logo=Radixui&logoColor=white&style=flat">
<!-- Shadcn -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Shadcn&color=000000&logo=Shadcnui&logoColor=white&style=flat">
<!-- Lucide -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Lucide&color=F56A6A&logo=Lucide&logoColor=white&style=flat">

<!-- Other -->
<!-- Zod -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Zod&color=274D82&logo=zod&logoColor=white&style=flat">
</div>


### Backend

<div style="display:flex;">
<!-- Main -->
<!-- Nextjs -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Next JS&color=000000&logo=Next.js&logoColor=white&style=flat">
<!-- Drizzle -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Drizzle&color=BFEF4D&logo=Drizzle&logoColor=white&style=flat">

<!-- Other -->
<!-- Zod -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Zod&color=274D82&logo=zod&logoColor=white&style=flat">
</div>


### Databases

<div style="display:flex;">
<!-- Postgresql -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Postgres SQL&color=31648C&logo=Postgresql&logoColor=white&style=flat">
<!-- Redis -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Upstash Redis&color=00C389&logo=Upstash&logoColor=white&style=flat">
</div>

### Deployment & Tools

<div style="display:flex;">
<!-- Vercel -->
<img style="height:2rem;" src="https://img.shields.io/static/v1?label=&message=Vercel&color=0F0F12&logo=vercel&logoColor=white&style=flat">
</div>

### Features

- Customizable Storefront: Users can tailor their online shops through an intuitive admin panel.
- Admin CMS: Manage products, orders, and settings easily.
- Low Spec Requirements: Designed to be cost-effective and efficient.
- Heavy Caching: Optimized for speed and reduced costs.

### Architecture

- The project is intended to be a monorepo, allowing for easy management of both the admin CMS and storefront. Currently, the admin CMS is under development.

### Getting Started

Clone the repository:
```bash
git clone https://github.com/webdevkaleem/ecommerce_store_builder.git
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and add the following variables:
```bash
# Postgres (Database)
DATABASE_URL=""

# Upstash (Redis)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# Uploadthing
UPLOADTHING_TOKEN=""
```

Setting up the database:
```bash
npm run db:generate
```
```bash
npm run db:migrate
```

Run the project locally:
```bash
npm run dev
```


### License
[MIT](https://choosealicense.com/licenses/mit/)

