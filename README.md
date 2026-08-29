# User & Image Upload Service

A full-stack application for user registration and image uploads with PostgreSQL, Cloudinary, rate limiting, and Docker.

**Repo:** https://github.com/sajinlama/file-upload--rate-limiter.git

---

## Features

- **User Registration:** Create users and generate unique user IDs.
- **Image Upload:** Upload images using `multipart/form-data` and store them on Cloudinary.
- **Upload Rate Limiting:** Limits image uploads to 10 requests per minute per IP.
- **Auto-Cleanup:** Removes temporary local upload files after Cloudinary processing.

---

## Tech Stack

- **Frontend:** React, TypeScript, CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL
- **Media Storage:** Cloudinary
- **Packages:** `multer`, `express-rate-limit`, `cloudinary`
- **DevOps:** Docker, Docker Compose

---

## Project Structure

```
file-upload--rate-limiter/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
└── README.md
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
NODE_ENV=Development
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/appdb

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_BASEURL=http://localhost:5001
```

---

## API Endpoints

### Create User

```http
POST /addUser
```

Creates a user and returns a unique `user_id`.

**Body:**
```json
{
  "fullname": "sajin tamang"
}
```

### Upload Image

```http
POST /upload
```

- **Content-Type:** `multipart/form-data`
- **Form fields:**
  - `image`: Binary file
  - `userId`: String / Number
- **Rate Limit:** 10 requests per minute per IP

---

## Getting Started

### Docker Compose

```bash
git clone https://github.com/sajinlama/file-upload--rate-limiter.git
cd file-upload--rate-limiter/backend
docker compose up --build -d
```

Application runs at:

```text
http://localhost:5001
```

PostgreSQL is mapped to port `5433`.

### Run Locally

**Backend**

```bash
cd backend
npm install
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` by default (Vite).

---

## Testing the Rate Limiter (curl)

The `/upload` route is limited to **10 requests per minute per IP**. Requests 1–10 should succeed (or fail only for reasons unrelated to rate limiting, e.g. missing file/userId); request 11+ within the same minute should return a `429 Too Many Requests`.

### Single request

```bash
curl -X POST http://localhost:5001/upload \
  -F "image=@./test.jpg" \
  -F "userId=1"
```

### Fire 12 requests in a row to trigger the limit

```bash
for i in $(seq 1 12); do
  echo "Request #$i"
  curl -s -o /dev/null -w "Status: %{http_code}\n" \
    -X POST http://localhost:5001/upload \
    -F "image=@./test.jpg" \
    -F "userId=1"
done
```

Expected output pattern:

```
Request #1
Status: 201
Request #2
Status: 201
...
Request #10
Status: 201
Request #11
Status: 429
Request #12
Status: 429
```

### See the full rate-limit response body (not just status code)

```bash
curl -X POST http://localhost:5001/upload \
  -F "image=@./test.jpg" \
  -F "userId=1" \
  -w "\nHTTP Status: %{http_code}\n"
```

### Inspect rate-limit headers

If using `express-rate-limit` with standard headers enabled, you can see remaining quota per request:

```bash
curl -i -X POST http://localhost:5001/upload \
  -F "image=@./test.jpg" \
  -F "userId=1" | grep -i ratelimit
```

Expected headers:
```
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 45
```

### Confirm the limit resets after 60 seconds

```bash
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "Request #$i -> %{http_code}\n" \
    -X POST http://localhost:5001/upload \
    -F "image=@./test.jpg" \
    -F "userId=1"
done

echo "Waiting 60s for rate limit window to reset..."
sleep 60

curl -s -o /dev/null -w "After reset -> %{http_code}\n" \
  -X POST http://localhost:5001/upload \
  -F "image=@./test.jpg" \
  -F "userId=1"
```

After the 60s wait, the final request should return `201` again, confirming the window reset correctly.

---

## Notes

- Replace `./test.jpg` with a real local image file path before running the curl tests.
- If testing locally (not via Docker), ensure PostgreSQL is reachable at the port defined in `DATABASE_URL` (`5433` in this setup, to avoid conflicts with other local Postgres instances).
- Uploaded files are temporarily stored in `backend/public/uploads` before being pushed to Cloudinary and then deleted locally.