# SanityFlow API Documentation

Base URL: `http://localhost:3000/api/v1`

## Authentication

| Method | Endpoint              | Auth | Role    | Description          |
|--------|-----------------------|------|---------|----------------------|
| POST   | `/auth/register`      | No   | —       | Register a new user  |
| POST   | `/auth/login`         | No   | —       | Login user           |
| POST   | `/auth/create-admin`  | Yes  | Admin   | Create an admin user |

## Profile

| Method | Endpoint       | Auth | Description            |
|--------|----------------|------|------------------------|
| GET    | `/profile/me`  | Yes  | Get current user       |
| PUT    | `/profile/me`  | Yes  | Update current user    |

## Issues

| Method | Endpoint       | Auth | Role    | Description        |
|--------|----------------|------|---------|--------------------|
| GET    | `/issues`      | Yes  | —       | Get all issues     |
| GET    | `/issues/:id`  | Yes  | —       | Get issue by ID    |
| POST   | `/issues`      | Yes  | Admin   | Create an issue    |
| PUT    | `/issues/:id`  | Yes  | Admin   | Update an issue    |
| DELETE | `/issues/:id`  | Yes  | Admin   | Delete an issue    |

## Water Tests

| Method | Endpoint                  | Auth | Role    | Description             |
|--------|---------------------------|------|---------|-------------------------|
| GET    | `/water-tests`            | Yes  | —       | Get all water tests     |
| GET    | `/water-tests/analytics`  | Yes  | —       | Get test analytics      |
| GET    | `/water-tests/:id`        | Yes  | —       | Get water test by ID    |
| POST   | `/water-tests`            | Yes  | Admin   | Create a water test     |
| PUT    | `/water-tests/:id`        | Yes  | Admin   | Update a water test     |
| DELETE | `/water-tests/:id`        | Yes  | Admin   | Delete a water test     |

## Water Sources

| Method | Endpoint              | Auth | Role    | Description             |
|--------|-----------------------|------|---------|-------------------------|
| GET    | `/water-sources`      | Yes  | —       | Get all water sources   |
| GET    | `/water-sources/:id`  | Yes  | —       | Get water source by ID  |
| POST   | `/water-sources`      | Yes  | Admin   | Create a water source   |
| PUT    | `/water-sources/:id`  | Yes  | Admin   | Update a water source   |
| DELETE | `/water-sources/:id`  | Yes  | Admin   | Delete a water source   |

## Distribution Orders

| Method | Endpoint                    | Auth | Role          | Description            |
|--------|-----------------------------|------|---------------|------------------------|
| GET    | `/distributions`            | Yes  | Admin/Driver  | Get all orders         |
| GET    | `/distributions/:id`        | Yes  | Admin/Driver  | Get order by ID        |
| POST   | `/distributions`            | Yes  | Admin         | Create an order        |
| PUT    | `/distributions/:id`        | Yes  | Admin         | Update an order        |
| PUT    | `/distributions/:id/status` | Yes  | Driver        | Update delivery status |
| DELETE | `/distributions/:id`        | Yes  | Admin         | Delete an order        |

## Beneficiaries

| Method | Endpoint              | Auth | Role    | Description               |
|--------|-----------------------|------|---------|---------------------------|
| GET    | `/beneficiaries`      | Yes  | Admin   | Get all beneficiaries     |
| GET    | `/beneficiaries/:id`  | Yes  | Admin   | Get beneficiary by ID     |
| POST   | `/beneficiaries`      | Yes  | Admin   | Create a beneficiary      |
| PUT    | `/beneficiaries/:id`  | Yes  | Admin   | Update a beneficiary      |
| DELETE | `/beneficiaries/:id`  | Yes  | Admin   | Delete a beneficiary      |

## Drivers

| Method | Endpoint         | Auth | Role    | Description         |
|--------|------------------|------|---------|---------------------|
| GET    | `/drivers`       | Yes  | Admin   | Get all drivers     |
| GET    | `/drivers/:id`   | Yes  | Admin   | Get driver by ID    |
| POST   | `/drivers`       | Yes  | Admin   | Create a driver     |
| PUT    | `/drivers/:id`   | Yes  | Admin   | Update a driver     |
| DELETE | `/drivers/:id`   | Yes  | Admin   | Delete a driver     |

## Blog

| Method | Endpoint      | Auth | Role    | Description         |
|--------|---------------|------|---------|---------------------|
| GET    | `/blog`       | No   | —       | Get all blog posts  |
| GET    | `/blog/:id`   | No   | —       | Get blog post by ID |
| POST   | `/blog`       | Yes  | Admin   | Create a blog post  |
| PATCH  | `/blog/:id`   | Yes  | Admin   | Update a blog post  |
| DELETE | `/blog/:id`   | Yes  | Admin   | Delete a blog post  |

### Blog Image Upload (S3)

`POST /blog` and `PATCH /blog/:id` now accept `multipart/form-data` for cover image uploads.

- File field name: `coverImage`
- Allowed formats: `image/jpeg`, `image/png`, `image/webp`
- Max file size: `5MB` (configurable via `BLOG_IMAGE_MAX_MB`)
- Compression pipeline: WebP conversion, max width `1600px`, quality `80` (configurable)

Text fields should still be provided in the same request body (`title`, `summary`, `content`, `tags`, `status`).

When upload succeeds:
- The optimized image is stored in S3.
- The returned public URL is stored in `coverImage` on the blog document.
- The S3 object key is stored in `coverImageKey` for cleanup.

On `PATCH /blog/:id` with a new `coverImage` file, the previous S3 object is deleted after successful DB update.
On `DELETE /blog/:id`, the related S3 object is also deleted.

## Community Forum

| Method | Endpoint                                 | Auth | Role  | Description    |
|--------|------------------------------------------|------|-------|----------------|
| GET    | `/community/forum`                       | No   | —     | Get all threads |
| GET    | `/community/forum/:id`                   | No   | —     | Get thread by ID |
| POST   | `/community/forum`                       | Yes  | —     | Create a thread |
| PATCH  | `/community/forum/:id`                   | Yes  | —     | Update a thread |
| DELETE | `/community/forum/:id`                   | Yes  | Admin | Delete a thread |
| GET    | `/community/forum/:id/replies`           | No   | —     | Get replies     |
| POST   | `/community/forum/:id/replies`           | Yes  | —     | Create a reply  |
| DELETE | `/community/forum/:id/replies/:replyId`  | Yes  | Admin | Delete a reply  |

## Resources

| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| GET    | `/resources`      | Yes  | Get all resources    |
| GET    | `/resources/:id`  | Yes  | Get resource by ID   |
| POST   | `/resources`      | Yes  | Create a resource    |
| PUT    | `/resources/:id`  | Yes  | Update a resource    |
| DELETE | `/resources/:id`  | Yes  | Delete a resource    |

## Suppliers

| Method | Endpoint          | Auth | Description          |
|--------|-------------------|------|----------------------|
| GET    | `/suppliers`      | Yes  | Get all suppliers    |
| GET    | `/suppliers/:id`  | Yes  | Get supplier by ID   |
| POST   | `/suppliers`      | Yes  | Create a supplier    |
| PUT    | `/suppliers/:id`  | Yes  | Update a supplier    |
| DELETE | `/suppliers/:id`  | Yes  | Delete a supplier    |

## Inventory Transactions

| Method | Endpoint                      | Auth | Description              |
|--------|-------------------------------|------|--------------------------|
| GET    | `/inventory-transactions`     | Yes  | Get all transactions     |
| GET    | `/inventory-transactions/:id` | Yes  | Get transaction by ID    |
| POST   | `/inventory-transactions`     | Yes  | Create a transaction     |

---

## Third-Party Integrations

### Barcode Lookup

| Method | Endpoint             | Auth | Description            |
|--------|----------------------|------|------------------------|
| GET    | `/barcode/:barcode`  | Yes  | Lookup barcode info    |

Uses a multi-API fallback chain to resolve product information from a barcode:

| Priority | External API | Description |
|----------|-------------|-------------|
| 1st | [BarcodeLookup API](https://www.barcodelookup.com) | General product lookup (requires `BARCODE_API_KEY`) |
| 2nd | [Open Food Facts API](https://world.openfoodfacts.org) | Food product database (free, no key required) |
| 3rd | [Open Beauty Facts API](https://world.openbeautyfacts.org) | Sanitary & personal care products (free, no key required) |
| 4th | SanityFlow Local Catalog | Internal fallback for known sanitary stock items |

**Environment variables (optional):**
```env
BARCODE_API_KEY=<your_barcodelookup_api_key>
```

---

### AI Summarization (Groq API)

| Method | Endpoint                     | Auth | Description                |
|--------|------------------------------|------|----------------------------|
| GET    | `/ai/summarize/blog/:id`     | No   | Summarize a blog post      |

Uses [Groq](https://groq.com) with the `llama-3.3-70b-versatile` model to generate concise blog post summaries. Results are cached in-memory to avoid repeated API calls.

**Environment variables required:**
```env
GROQ_API_KEY=<your_groq_api_key>
```

---

### Weather (OpenWeather API)

| Method | Endpoint                | Auth | Description                    |
|--------|-------------------------|------|--------------------------------|
| GET    | `/weather/:location`    | Yes  | Get weather for a location     |

Uses [OpenWeatherMap](https://openweathermap.org/api) to fetch current weather data. Automatically flags high-risk conditions (thunderstorm, heavy rainfall >10mm/h, tornado, etc.).

**Environment variables required:**
```env
OPENWEATHER_API_KEY=<your_openweather_api_key>
```

---

### Email Notifications (Resend API)

The system uses [Resend](https://resend.com) to send automated email notifications. These are triggered internally by the backend — there are no direct API endpoints for email.

| Trigger | Recipient | Description |
|---------|-----------|-------------|
| Driver assigned to a distribution order | Driver's email | Notifies the driver with order ID and delivery location |
| Resource quantity falls below reorder level | Admin email (`ALERT_EMAIL`) | Low stock alert with resource details and supplier info |

**Environment variables required:**
```env
EMAIL_API_KEY=<your_resend_api_key>
ALERT_EMAIL=<admin_alert_email>
```
