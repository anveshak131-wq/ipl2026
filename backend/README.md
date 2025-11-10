# IPL 2026 - Secure Python Backend API

## 🔒 Enhanced Security Features

This Python Flask backend provides enterprise-level security for the IPL 2026 web application:

### Security Improvements Over LocalStorage:
1. **Server-side data storage** - Data stored in SQLite database, not accessible from browser
2. **JWT Authentication** - Secure token-based authentication
3. **Password hashing** - Admin passwords encrypted with Werkzeug
4. **SQL Injection protection** - Parameterized queries
5. **Email validation** - Server-side email format validation
6. **Content filtering** - Match-related comment validation
7. **User blocking** - Server-enforced access control
8. **Admin authorization** - Role-based access control

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Setup Steps

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python3 -m venv venv
```

3. **Activate virtual environment:**
```bash
# On Mac/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. **Install dependencies:**
```bash
pip install -r requirements.txt
```

5. **Set environment variables (optional):**
```bash
export SECRET_KEY="your-secret-key-here"
```

6. **Run the server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 🔑 Default Admin Credentials

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change these credentials in production!

## 📡 API Endpoints

### User Endpoints

#### Register/Login User
```
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com"
}
```

**Response:**
```json
{
    "success": true,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

#### Post Comment
```
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
    "text": "Great innings by Rohit Sharma!"
}
```

#### Get All Comments
```
GET /api/comments
```

### Admin Endpoints

#### Admin Login
```
POST /api/admin/login
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
}
```

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Block User
```
POST /api/admin/users/{user_id}/block
Authorization: Bearer <admin_token>
```

#### Unblock User
```
POST /api/admin/users/{user_id}/unblock
Authorization: Bearer <admin_token>
```

#### Delete Comment
```
DELETE /api/admin/comments/{comment_id}
Authorization: Bearer <admin_token>
```

#### Post Admin Commentary
```
POST /api/admin/commentary
Authorization: Bearer <admin_token>
Content-Type: application/json

{
    "over": "5.3",
    "text": "Rohit Sharma hits a massive six!"
}
```

#### Get Admin Commentary
```
GET /api/admin/commentary
```

#### Delete Admin Commentary
```
DELETE /api/admin/commentary/{commentary_id}
Authorization: Bearer <admin_token>
```

#### Export User Emails
```
GET /api/admin/export/emails
Authorization: Bearer <admin_token>
```

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `is_blocked` - Block status
- `comment_count` - Number of comments posted
- `last_active` - Last activity timestamp
- `created_at` - Registration timestamp

### Comments Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `text` - Comment content
- `is_deleted` - Soft delete flag
- `is_flagged` - Flagged for review
- `created_at` - Post timestamp

### Admin Commentary Table
- `id` - Primary key
- `over_number` - Cricket over number
- `text` - Commentary content
- `admin_id` - Foreign key to admins
- `is_deleted` - Soft delete flag
- `created_at` - Post timestamp

### Admins Table
- `id` - Primary key
- `username` - Unique username
- `password_hash` - Hashed password
- `email` - Admin email
- `created_at` - Account creation timestamp

## 🔐 Security Best Practices

1. **Change Default Password**
   - Use the admin panel to change the default admin password immediately

2. **Use Environment Variables**
   ```bash
   export SECRET_KEY="your-random-secret-key-min-32-chars"
   ```

3. **HTTPS in Production**
   - Use SSL/TLS certificates
   - Never transmit tokens over HTTP

4. **Rate Limiting**
   - Implement rate limiting for production (use Flask-Limiter)

5. **Input Validation**
   - Already implemented for emails and comment content
   - Add more validation as needed

6. **Database Backups**
   - Regularly backup `ipl_data.db`
   - Store backups securely

## 🚀 Production Deployment

### Using Gunicorn (Recommended)

1. **Install Gunicorn:**
```bash
pip install gunicorn
```

2. **Run with Gunicorn:**
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t ipl-backend .
docker run -p 5000:5000 ipl-backend
```

## 🧪 Testing the API

### Using cURL

```bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Post comment (use token from registration)
curl -X POST http://localhost:5000/api/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"text":"Amazing match today!"}'
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

## 📊 Monitoring

The API logs all requests. Monitor:
- Failed login attempts
- Blocked user access attempts
- Comment posting rate
- Database size

## 🛠️ Troubleshooting

### Database Locked Error
```bash
# Close all connections and restart
rm ipl_data.db
python app.py
```

### CORS Issues
- Ensure Flask-CORS is installed
- Check frontend is making requests to correct URL

### Token Expired
- Tokens expire after 24 hours
- Users need to re-authenticate

## 📝 License

© 2026 IPL Analytics Dashboard. All rights reserved.
