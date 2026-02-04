# Mockup Join Organization (โปรเจกต์จำลองการเข้าร่วมองค์กร)

โปรเจกต์นี้เป็นหน้าจอจำลอง (mockup) สำหรับกระบวนการเข้าร่วมองค์กร พัฒนาด้วย React และ Vite เพื่อแสดงการทำงานเบื้องต้นและส่วนประกอบ UI ต่างๆ

## Tech Stack (เทคโนโลยีที่ใช้)

*   **React:** ไลบรารี JavaScript สำหรับสร้างส่วนติดต่อผู้ใช้ (User Interface)
*   **Vite:** เครื่องมือสำหรับพัฒนาส่วนหน้า (frontend build tool) ที่รวดเร็ว
*   **Tailwind CSS:** เฟรมเวิร์ก CSS แบบ Utility-first สำหรับการออกแบบที่รวดเร็ว
*   **ESLint:** เครื่องมือสำหรับวิเคราะห์โค้ดเพื่อค้นหาและแก้ไขข้อผิดพลาดในการเขียนโค้ด

## How to setup for Development (วิธีการติดตั้งและพัฒนา)

### 1. Clone the repository (โคลนโปรเจกต์)

เปิด Terminal หรือ Command Prompt แล้วรันคำสั่ง:

```bash
git clone <repository_url>
cd mockup-join-org
```

**หมายเหตุ:** แทนที่ `<repository_url>` ด้วย URL ของ Git repository นี้

### 2. Install dependencies (ติดตั้ง Dependencies)

หลังจากโคลนโปรเจกต์ ให้เข้าไปที่ไดเรกทอรีของโปรเจกต์และติดตั้งแพ็คเกจที่จำเป็นโดยใช้ npm:

```bash
npm install
```

### 3. Run the development server (รัน Development Server)

เริ่มเซิร์ฟเวอร์พัฒนา (development server) เพื่อดูการเปลี่ยนแปลงแบบเรียลไทม์:

```bash
npm run dev
```

โปรเจกต์จะถูกเปิดในเบราว์เซอร์ของคุณที่ `http://localhost:5173` (หรือพอร์ตอื่นที่ระบุ)

### 4. Build for production (สร้างสำหรับ Production)

หากต้องการสร้างเวอร์ชัน Production:

```bash
npm run build
```

ไฟล์ที่พร้อมใช้งานจะอยู่ในโฟลเดอร์ `dist/`

## Deploy to GitHub Pages (การติดตั้งบน GitHub Pages)

สำหรับโปรเจกต์ที่ต้องการ Deploy ขึ้น GitHub Pages สามารถทำได้ดังนี้:

1.  **ตั้งค่า `base` ใน `vite.config.js`:**
    ตรวจสอบให้แน่ใจว่า `vite.config.js` มีการตั้งค่า `base` ให้ตรงกับชื่อ repository ของคุณ (เช่น `'/your-repo-name/'`) เพื่อให้ Assets ถูกโหลดได้อย่างถูกต้องเมื่อ Deploy บน GitHub Pages
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    export default defineConfig({
      plugins: [react()],
      base: '/mockup-join-org/', // เปลี่ยนเป็นชื่อ Repository ของคุณ
    })
    ```

2.  **เพิ่ม Script สำหรับ Deploy:**
    เพิ่ม script `deploy` ในไฟล์ `package.json` ของคุณ:
    ```json
    {
      "name": "mockup-join-org",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "deploy": "gh-pages -d dist" // เพิ่มบรรทัดนี้
      },
      "dependencies": {
        // ...
      },
      "devDependencies": {
        "gh-pages": "^6.1.1", // อย่าลืมติดตั้ง package นี้ด้วย `npm install gh-pages --save-dev`
        // ...
      }
    }
    ```

3.  **ติดตั้ง `gh-pages` package:**
    ถ้ายังไม่ได้ติดตั้ง ให้ติดตั้ง `gh-pages` โดยใช้คำสั่ง:
    ```bash
    npm install gh-pages --save-dev
    ```

4.  **รันคำสั่ง Deploy:**
    รันคำสั่งเพื่อ Deploy โปรเจกต์ของคุณ:
    ```bash
    npm run deploy
    ```
    หลังจากรันคำสั่งนี้ โค้ดที่ build แล้วจะถูก push ไปยัง `gh-pages` branch ซึ่ง GitHub Pages จะใช้ในการโฮสต์เว็บไซต์ของคุณ

## Gemini Conversation (การสนทนา Gemini)

คุณสามารถดูการสนทนา Gemini ที่เกี่ยวข้องกับโปรเจกต์นี้ได้ที่: [https://gemini.google.com/share/84dd32b0f822](https://gemini.google.com/share/84dd32b0f822)


