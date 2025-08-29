# Node API  
یک API بک‌اند با **Node.js + Express** و پایگاه داده **MongoDB**  

---

## Features  
## ویژگی‌ها  

- JWT-based authentication  
- احراز هویت مبتنی بر JWT  

- User management & password hashing with **bcryptjs**  
- مدیریت کاربران و رمزگذاری پسورد با **bcryptjs**  

- File upload & AWS S3 integration  
- آپلود فایل و اتصال به AWS S3  

- Request rate limiting with **express-rate-limit**  
- محدود کردن درخواست‌ها با **express-rate-limit**  

- Enhanced security with **helmet** & **cookie-parser**  
- امنیت بیشتر با **helmet** و **cookie-parser**  

- Logging with **morgan**  
- لاگ‌گیری با **morgan**  

- Email sending via **Nodemailer**  
- ارسال ایمیل با **Nodemailer**  

- Real-time communication with **Socket.IO**  
- ارتباط بلادرنگ با **Socket.IO**  

---

## Technologies & Packages  
## تکنولوژی‌ها و پکیج‌ها  

- [Node.js](https://nodejs.org/) — محیط اجرای جاوااسکریپت  
- [Express](https://expressjs.com/) — فریم‌ورک بک‌اند  
- [MongoDB](https://www.mongodb.com/) — پایگاه داده NoSQL  
- [Mongoose](https://mongoosejs.com/) — مدیریت مدل‌ها  
- [AWS SDK S3](https://docs.aws.amazon.com/sdk-for-javascript/) — ذخیره‌سازی فایل  
- [BcryptJS](https://github.com/dcodeIO/bcrypt.js) — هش کردن پسوردها  
- [Multer](https://github.com/expressjs/multer) — مدیریت آپلود فایل  
- [Helmet](https://helmetjs.github.io/) — افزایش امنیت هدرها  
- [Cors](https://github.com/expressjs/cors) — مدیریت CORS  
- [JWT](https://github.com/auth0/node-jsonwebtoken) — تولید و اعتبارسنجی توکن‌ها  
- [Socket.IO](https://socket.io/) — ارتباط WebSocket  

---

## Installation & Setup  
## نصب و راه‌اندازی  

1. **Clone the repository**  
   **کلون کردن مخزن**  
   ```bash
   git clone <repository-url>
   cd node-api
   ```

2. **Install dependencies**  
   **نصب پکیج‌ها**  
   ```bash
   npm install
   ```

3. **Create a `.env` file and configure environment variables**  
   **ساخت فایل `.env` و تنظیم مقادیر موردنیاز**  
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

4. **Run in development mode**  
   **اجرای پروژه در حالت توسعه**  
   ```bash
   npm run dev
   ```

   **Or in production mode**  
   **یا در حالت عادی (Production)**  
   ```bash
   npm start
   ```
---

## Contributing  
## مشارکت  

Feel free to open an **Issue** or submit a **Pull Request** for improvements.  
برای پیشنهاد بهبود می‌توانید یک **Issue** باز کنید یا **Pull Request** ارسال کنید.  

---

## License  
## لایسنس  

This project is licensed under the **MIT License**.  
این پروژه تحت لایسنس **MIT** منتشر شده است.  

See [LICENSE](./LICENSE) for details.  
برای جزئیات به فایل [LICENSE](./LICENSE) مراجعه کنید.
