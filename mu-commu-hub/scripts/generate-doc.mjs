import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const screenshotsDir = path.resolve("public", "doc-screenshots");

function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/jpeg;base64,${data.toString("base64")}`;
  }
  console.warn("Screenshot not found:", filePath);
  return "";
}

// Pre-load all 19 screenshots
const images = {
  landing: getBase64Image("landing.jpg"),
  login: getBase64Image("login.jpg"),
  onboarding: getBase64Image("onboarding.jpg"),
  home: getBase64Image("home.jpg"),
  post_detail: getBase64Image("post_detail.jpg"),
  discover: getBase64Image("discover.jpg"),
  people: getBase64Image("people.jpg"),
  profile: getBase64Image("profile.jpg"),
  teams: getBase64Image("teams.jpg"),
  team_detail: getBase64Image("team_detail.jpg"),
  competitions: getBase64Image("competitions.jpg"),
  competition_detail: getBase64Image("competition_detail.jpg"),
  events: getBase64Image("events.jpg"),
  communities: getBase64Image("communities.jpg"),
  community_detail: getBase64Image("community_detail.jpg"),
  saved: getBase64Image("saved.jpg"),
  notifications: getBase64Image("notifications.jpg"),
  messages: getBase64Image("messages.jpg"),
  me: getBase64Image("me.jpg"),
};

const htmlContent = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <title>MU Connect - สรุปข้อมูลโปรเจกต์ (Tech Stack, รายชื่อหน้า, รายละเอียด UI พร้อมภาพถ่ายจริง)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Prompt', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      font-size: 11px;
      line-height: 1.45;
    }

    /* Document Header */
    .doc-header {
      border-bottom: 2px solid #17468c;
      padding-bottom: 8px;
      margin-bottom: 14px;
    }

    .doc-title {
      font-size: 19px;
      font-weight: 700;
      color: #17468c;
      margin-bottom: 2px;
      letter-spacing: -0.01em;
    }

    .doc-subtitle {
      font-size: 11.5px;
      color: #475569;
    }

    /* Section Headings */
    .main-section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f274a;
      background: #f1f5f9;
      border-left: 4px solid #17468c;
      padding: 5px 10px;
      margin-bottom: 8px;
      margin-top: 10px;
      page-break-after: avoid;
      break-after: avoid;
    }

    .section-intro {
      font-size: 11px;
      color: #475569;
      margin-bottom: 8px;
    }

    /* Table Styles - Allow natural page breaking */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 10.5px;
      page-break-inside: auto;
      break-inside: auto;
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 5px 7px;
      text-align: left;
      vertical-align: middle;
    }

    th {
      background-color: #f8fafc;
      color: #0f274a;
      font-weight: 600;
      font-size: 10.5px;
    }

    tr:nth-child(even) td {
      background-color: #fafbfc;
    }

    /* UI Page Card Layout (Compact 2-Column: Left info, Right screenshot) */
    .ui-card {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 10px;
      background: #ffffff;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .ui-card-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }

    .ui-card-title {
      font-size: 12.5px;
      font-weight: 700;
      color: #17468c;
    }

    .ui-card-route {
      font-family: monospace;
      font-size: 10px;
      background: #e2e8f0;
      color: #334155;
      padding: 1px 6px;
      border-radius: 3px;
      font-weight: 600;
    }

    .ui-card-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 12px;
      align-items: start;
    }

    .ui-card-desc {
      font-size: 10.5px;
      color: #334155;
      margin-bottom: 6px;
      line-height: 1.4;
    }

    .ui-card-subtitle {
      font-size: 10px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin-bottom: 3px;
    }

    .ui-list {
      list-style-type: disc;
      padding-left: 16px;
      font-size: 10px;
      color: #334155;
      line-height: 1.38;
    }

    .ui-list li {
      margin-bottom: 2px;
    }

    .ui-list strong {
      color: #0f172a;
    }

    /* Screenshot Frame */
    .browser-mockup {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .browser-header {
      height: 14px;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      padding: 0 6px;
      gap: 3px;
      border-bottom: 1px solid #cbd5e1;
    }

    .browser-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #94a3b8;
    }

    .browser-mockup img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  </style>
</head>
<body>

  <!-- ================= COVER PAGE ================= -->
  <div class="cover-page" style="page-break-after: always; break-after: page; display: flex; flex-direction: column; justify-content: center; height: 265mm; padding: 0 10mm;">
    <h1 style="font-size: 42px; font-weight: 700; color: #17468c; line-height: 1.15; margin-bottom: 4px; letter-spacing: -0.02em;">Muge Project</h1>
    <h2 style="font-size: 26px; font-weight: 500; color: #475569; margin-bottom: 28px; letter-spacing: -0.01em;">Documentation</h2>
    <div style="border-top: 2px solid #e2e8f0; width: 60px; margin-bottom: 28px;"></div>
    <p style="font-size: 14px; color: #dc2626; font-weight: 500; line-height: 1.6; max-width: 580px;">
      หน้าตา UI และระบบที่มีในตอนนี้เป็นเพียง prototype เอาไว้สำหรับ present เบื้องต้นเท่านั้น ซึ่งจะมีการปรับปรุงภายหลัง
    </p>
  </div>

  <!-- Document Header -->
  <div class="doc-header">
    <h1 class="doc-title">MU Connect (mu-commu-hub) — เอกสารสรุปข้อมูลระบบ</h1>
    <p class="doc-subtitle">สรุปเทคโนโลยีที่ใช้ (Tech Stack), รายชื่อหน้าทั้งหมด และรายละเอียดหน้าจอ UI พร้อมภาพถ่ายจริง</p>
  </div>

  <!-- ================= SECTION 1: TECH STACK ================= -->
  <div class="main-section">
    <h2 class="section-title">หัวข้อที่ 1: Tech Stack (เทคโนโลยีที่ใช้ในโปรเจกต์)</h2>
    <p class="section-intro">
      โปรเจกต์นี้ถูกพัฒนาขึ้นในรูปแบบ <strong>Frontend-only Prototype</strong> (ต้นแบบหน้าบ้านที่จำลองการทำงานครบถ้วน โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์จริง):
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 25%;">เทคโนโลยี / เครื่องมือ</th>
          <th style="width: 25%;">เวอร์ชัน / ประเภท</th>
          <th style="width: 50%;">หน้าที่และการใช้งานในโปรเจกต์ (ภาษาเข้าใจง่าย)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Next.js (App Router)</strong></td>
          <td>Next.js 16 (App Router)</td>
          <td>โครงร่างหลัก (Framework) สำหรับจัดการหน้าจอและระบบการนำทาง (Routing) ของเว็บแอปพลิเคชัน</td>
        </tr>
        <tr>
          <td><strong>React</strong></td>
          <td>React 19</td>
          <td>ไลบรารีสำหรับสร้างหน้าจอผู้ใช้ (User Interface) และการแสดงผลข้อมูลแบบ Interactive</td>
        </tr>
        <tr>
          <td><strong>TypeScript</strong></td>
          <td>TypeScript 5</td>
          <td>ภาษาที่ช่วยควบคุมโครงสร้างข้อมูล ป้องกันข้อผิดพลาด ทำให้ระบบทำงานได้อย่างแม่นยำ</td>
        </tr>
        <tr>
          <td><strong>Tailwind CSS</strong></td>
          <td>Tailwind CSS 4</td>
          <td>เครื่องมือกำหนดสไตล์ ดีไซน์ ขนาด สี และการรองรับหน้าจอคอมพิวเตอร์และมือถือ</td>
        </tr>
        <tr>
          <td><strong>Radix UI & shadcn/ui</strong></td>
          <td>UI Primitives</td>
          <td>คอมโพเนนต์พื้นฐาน เช่น หน้าต่างป๊อปอัป (Dialog), เมนูตัวเลือก (Dropdown/Select), และแท็บ (Tabs)</td>
        </tr>
        <tr>
          <td><strong>Lucide React</strong></td>
          <td>Icon Set</td>
          <td>ชุดไอคอนสัญลักษณ์ต่าง ๆ ทั่วทั้งระบบ (ค้นหา, ไลก์, แชท, กระดิ่งแจ้งเตือน)</td>
        </tr>
        <tr>
          <td><strong>Three.js & React Three Fiber</strong></td>
          <td>3D Graphics</td>
          <td>ใช้สร้างกราฟิก 3D แบบโต้ตอบได้ (Interactive 3D Network) บนหน้าแรก Landing Page</td>
        </tr>
        <tr>
          <td><strong>Motion (Framer Motion)</strong></td>
          <td>Animation Library</td>
          <td>สร้างเอฟเฟกต์ภาพเคลื่อนไหวที่นุ่มนวล เช่น การเปิดหน้าต่างป๊อปอัป และการเลื่อนแสดงข้อมูล</td>
        </tr>
        <tr>
          <td><strong>Zustand</strong></td>
          <td>State Management</td>
          <td>ตัวเก็บและจัดการสถานะส่วนกลางของเว็บ (ข้อมูลผู้ใช้ปัจจุบัน, การกดติดตาม, โพสต์ล่าสุด)</td>
        </tr>
        <tr>
          <td><strong>MSW (Mock Service Worker)</strong></td>
          <td>API Mocking (MSW 2)</td>
          <td>จำลองการรับส่งข้อมูลผ่าน API ในเบราว์เซอร์ ทำให้หน้าเว็บทำงานได้เสมือนมีระบบหลังบ้านจริง</td>
        </tr>
        <tr>
          <td><strong>Dexie.js (IndexedDB)</strong></td>
          <td>In-browser Database</td>
          <td>ฐานข้อมูลจำลองในเครื่องผู้ใช้ ช่วยบันทึกโพสต์ใหม่ ทีม แชท บุ๊กมาร์ก รีเฟรชแล้วข้อมูลไม่หาย</td>
        </tr>
        <tr>
          <td><strong>Faker.js</strong></td>
          <td>Mock Data Generator</td>
          <td>ใช้จำลองชุดข้อมูลตั้งต้นที่สมจริง เช่น รายชื่อนักศึกษา 40 คน, 60 โพสต์, 15 ทีม, 12 การแข่งขัน</td>
        </tr>
        <tr>
          <td><strong>React Hook Form & Zod</strong></td>
          <td>Form & Validation</td>
          <td>ระบบจัดการแบบฟอร์มและการตรวจสอบความถูกต้องของข้อมูล (ฟอร์มสร้างโพสต์, รับสมัครทีม)</td>
        </tr>
        <tr>
          <td><strong>Playwright Core</strong></td>
          <td>Automated Testing</td>
          <td>สคริปต์ตรวจสอบระบบอัตโนมัติ (Smoke Tests) ตรวจความถูกต้องของหน้าจอทั้งขนาดมือถือและจอคอม</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= SECTION 2: ALL PAGES & ROUTES ================= -->
  <div class="main-section" style="page-break-before: always; break-before: page;">
    <h2 class="section-title">หัวข้อที่ 2: มีหน้าอะไรบ้างในระบบ (รายชื่อหน้าทั้งหมด 19 หน้า)</h2>
    <p class="section-intro">
      ระบบในปัจจุบันประกอบด้วยทั้งหมด <strong>19 หน้าหลัก</strong> พร้อมโครงสร้างนำทางส่วนกลาง (Navigation Shell):
    </p>

    <table>
      <thead>
        <tr>
          <th style="width: 7%; text-align: center;">ลำดับ</th>
          <th style="width: 25%;">ชื่อหน้า (Page Name)</th>
          <th style="width: 26%;">เส้นทาง URL (Route)</th>
          <th style="width: 42%;">วัตถุประสงค์โดยสรุป</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center;">1</td>
          <td><strong>Landing Page</strong></td>
          <td><code>/</code></td>
          <td>หน้าแรกแนะนำโครงการ ฟีเจอร์เด่น และปุ่มเข้าสู่ระบบทดลอง</td>
        </tr>
        <tr>
          <td style="text-align: center;">2</td>
          <td><strong>Login (Demo)</strong></td>
          <td><code>/login</code></td>
          <td>หน้าเข้าสู่ระบบจำลอง สามารถเลือกบทบาทตัวอย่างได้ในคลิกเดียว</td>
        </tr>
        <tr>
          <td style="text-align: center;">3</td>
          <td><strong>Onboarding</strong></td>
          <td><code>/onboarding</code></td>
          <td>หน้าเริ่มต้นตั้งค่าความสนใจ (Interests) และทักษะ (Skills) สำหรับผู้ใช้ใหม่</td>
        </tr>
        <tr>
          <td style="text-align: center;">4</td>
          <td><strong>Home Feed</strong></td>
          <td><code>/home</code></td>
          <td>หน้าฟีดรวมโพสต์ ข่าวสาร ไอเดีย และช่องทางลัดสร้างโพสต์/หาทีม</td>
        </tr>
        <tr>
          <td style="text-align: center;">5</td>
          <td><strong>Post Detail</strong></td>
          <td><code>/posts/[id]</code></td>
          <td>หน้ารายละเอียดของโพสต์แบบเต็ม พร้อมระบบอ่านและเขียนคอมเมนต์</td>
        </tr>
        <tr>
          <td style="text-align: center;">6</td>
          <td><strong>Discover</strong></td>
          <td><code>/discover</code></td>
          <td>หน้าค้นหาแบบบูรณาการ ค้นหาได้ทั้งบุคคล โพสต์ ทีม แข่งขัน และคลับ</td>
        </tr>
        <tr>
          <td style="text-align: center;">7</td>
          <td><strong>People Directory</strong></td>
          <td><code>/people</code></td>
          <td>หน้าทำเนียบรายชื่อเพื่อนนักศึกษา พร้อมคะแนนจับคู่ (% Match)</td>
        </tr>
        <tr>
          <td style="text-align: center;">8</td>
          <td><strong>Student Profile</strong></td>
          <td><code>/profile/[username]</code></td>
          <td>หน้าโปรไฟล์ส่วนตัวของนักศึกษาคนอื่น ดูประวัติ ทักษะ ผลงาน และปุ่มทักแชท</td>
        </tr>
        <tr>
          <td style="text-align: center;">9</td>
          <td><strong>Teams Board</strong></td>
          <td><code>/teams</code></td>
          <td>บอร์ดค้นหาและประกาศรับสมัครเพื่อนร่วมทีมสำหรับแข่งขันหรือทำโปรเจกต์</td>
        </tr>
        <tr>
          <td style="text-align: center;">10</td>
          <td><strong>Team Detail</strong></td>
          <td><code>/teams/[id]</code></td>
          <td>หน้ารายละเอียดของทีม ตำแหน่งที่ยังเปิดรับ สมาชิกปัจจุบัน และปุ่มขอเข้าร่วม</td>
        </tr>
        <tr>
          <td style="text-align: center;">11</td>
          <td><strong>Competitions</strong></td>
          <td><code>/competitions</code></td>
          <td>ศูนย์รวมรายการประกวด แข่งขัน และ Hackathon พร้อมเงินรางวัลและกำหนดการ</td>
        </tr>
        <tr>
          <td style="text-align: center;">12</td>
          <td><strong>Competition Detail</strong></td>
          <td><code>/competitions/[id]</code></td>
          <td>หน้ารายละเอียดการแข่งขัน กติกา คุณสมบัติ และรายการทีมที่เปิดรับสมัคร</td>
        </tr>
        <tr>
          <td style="text-align: center;">13</td>
          <td><strong>Campus Events</strong></td>
          <td><code>/events</code></td>
          <td>หน้าปฏิทินกิจกรรม เวิร์กช็อป และสัมมนาในแคมปัสแบบ Interactive Calendar</td>
        </tr>
        <tr>
          <td style="text-align: center;">14</td>
          <td><strong>Communities / Clubs</strong></td>
          <td><code>/communities</code></td>
          <td>หน้ารวมชุมชนและชมรมความสนใจเฉพาะด้าน (AI, Web, Game, Design)</td>
        </tr>
        <tr>
          <td style="text-align: center;">15</td>
          <td><strong>Community Detail</strong></td>
          <td><code>/communities/[slug]</code></td>
          <td>หน้ารายละเอียดชุมชน แสดงสมาชิก โพสต์ที่เกี่ยวข้อง และปุ่มเข้าร่วม</td>
        </tr>
        <tr>
          <td style="text-align: center;">16</td>
          <td><strong>Saved Bookmarks</strong></td>
          <td><code>/saved</code></td>
          <td>หน้ารวมรายการที่ผู้ใช้กดบันทึกไว้ (โพสต์, ทีม, การแข่งขัน, กิจกรรม)</td>
        </tr>
        <tr>
          <td style="text-align: center;">17</td>
          <td><strong>Notifications</strong></td>
          <td><code>/notifications</code></td>
          <td>หน้าศูนย์แจ้งเตือนกิจกรรม (ไลก์, คอมเมนต์, ขอเข้าทีม, ติดตาม)</td>
        </tr>
        <tr>
          <td style="text-align: center;">18</td>
          <td><strong>Messages / Chat</strong></td>
          <td><code>/messages</code></td>
          <td>ระบบแชทส่วนตัวสำหรับพูดคุยสอบถามและนัดหมายก่อนตกลงร่วมทีม</td>
        </tr>
        <tr>
          <td style="text-align: center;">19</td>
          <td><strong>My Profile & Dashboard</strong></td>
          <td><code>/me</code></td>
          <td>หน้าแดชบอร์ดส่วนตัว แก้ไขโปรไฟล์ ดูทีมของฉัน และดูแบบร่าง (Drafts)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ================= SECTION 3: DETAILED UI COMPONENTS WITH SCREENSHOTS ================= -->
  <div class="main-section" style="page-break-before: always; break-before: page;">
    <h2 class="section-title">หัวข้อที่ 3: หน้า UI แต่ละหน้ามีอะไรบ้างในตอนนี้ (พร้อมภาพหน้าจอจริง)</h2>
    <p class="section-intro">
      รายละเอียดส่วนประกอบ UI และฟังก์ชันที่ปรากฏบนหน้าจอจริงของแต่ละหน้าในปัจจุบัน:
    </p>

    <!-- 1. Landing -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">1. หน้าแรกแนะนำระบบ (Landing Page)</span>
        <span class="ui-card-route">/</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าต้อนรับสำหรับผู้เข้าชม แนะนำจุดเด่นของแพลตฟอร์มและเปิดให้กดเข้าสู่ระบบตัวอย่าง</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>แถบนำทางด้านบน (Navbar):</strong> โลโก้โครงการ, ลิงก์เลื่อนดูส่วนต่าง ๆ, ปุ่ม "Enter demo"</li>
            <li><strong>Hero Section:</strong> ข้อความสโลแกน ปุ่มเข้าใช้งาน และกราฟิกเครือข่าย 3D แบบ Interactive</li>
            <li><strong>การ์ด 4 ฟีเจอร์หลัก:</strong> ค้นหาทีม, ดูการแข่งขัน, แลกเปลี่ยนไอเดีย, สร้างเครือข่าย</li>
            <li><strong>พรีวิวคลับความสนใจ & การแข่งขัน:</strong> การ์ดแสดงชมรมและงานประกวดเด่น</li>
            <li><strong>Footer:</strong> ข้อมูลลิขสิทธิ์และคำชี้แจงความเป็นต้นแบบของโครงการ</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.landing}" alt="Landing Page">
        </div>
      </div>
    </div>

    <!-- 2. Login -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">2. หน้าเข้าสู่ระบบ (Demo Login)</span>
        <span class="ui-card-route">/login</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าจำลองการล็อกอินที่ไม่จำเป็นต้องใช้รหัสผ่านจริง ออกแบบให้ทดลองใช้งานได้ทันที</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ปุ่มเลือกสวมบทบาท (Demo Role):</strong> ปุ่มคลิกเข้าใช้ในฐานะ Demo user ได้ทันที</li>
            <li><strong>ฟอร์มล็อกอินจำลอง:</strong> ช่องกรอก Username และ Password พร้อมข้อมูลกรอกไว้ล่วงหน้า</li>
            <li><strong>ปุ่มดำเนินการ:</strong> ปุ่ม "Sign in to demo" และลิงก์ข้ามไปยังหน้าหลักโดยตรง</li>
            <li><strong>กล่องแจ้งเตือน:</strong> ชี้แจงว่าเป็นระบบ Mock ไม่มีการส่งข้อมูลออกนอกเครื่อง</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.login}" alt="Demo Login">
        </div>
      </div>
    </div>

    <!-- 3. Onboarding -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">3. หน้าตั้งค่าเริ่มต้น (Onboarding)</span>
        <span class="ui-card-route">/onboarding</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าตั้งค่าสำหรับผู้ใช้ใหม่เพื่อเลือกความสนใจและทักษะ นำไปใช้คำนวณการจับคู่</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>เลือกความสนใจ (Interests):</strong> ชิปปุ่มกดเลือก เช่น AI, Web Dev, Hackathons, Design</li>
            <li><strong>เลือกทักษะเด่น (Skills):</strong> ชิปปุ่มเลือกทักษะ เช่น React, Python, Figma, Marketing</li>
            <li><strong>เลือกเป้าหมาย (Availability):</strong> ตัวเลือกเป้าหมาย เช่น หาเพื่อนแข่ง หรือทำโปรเจกต์</li>
            <li><strong>ปุ่มบันทึก:</strong> ปุ่ม "Continue to MU Connect" บันทึกข้อมูลและนำทางเข้าสู่หน้าฟีด</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.onboarding}" alt="Onboarding">
        </div>
      </div>
    </div>

    <!-- 4. Home Feed -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">4. หน้าฟีดหลัก (Home Feed)</span>
        <span class="ui-card-route">/home</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">ศูนย์กลางการติดตามข่าวสาร โพสต์พูดคุย และทางลัดในการเปิดรับสมัครเพื่อนร่วมทีม</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>Welcome Hero Banner:</strong> ทักทายชื่อผู้ใช้ พร้อมปุ่ม "+ Create a post" และ "Find a team"</li>
            <li><strong>แถบสลับแท็บฟีด:</strong> 4 ตัวเลือกคัดกรอง: <em>For You</em>, <em>Following</em>, <em>Popular</em>, <em>Latest</em></li>
            <li><strong>ช่องค้นหาด่วน:</strong> พิมพ์ค้นหาข้อความหรือแท็กในโพสต์ได้แบบทันที</li>
            <li><strong>การ์ดโพสต์:</strong> แสดงชื่อผู้เขียน คณะ หัวข้อ แท็ก ยอดไลก์ ยอดคอมเมนต์ และปุ่มบุ๊กมาร์ก</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.home}" alt="Home Feed">
        </div>
      </div>
    </div>

    <!-- 5. Post Detail -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">5. หน้ารายละเอียดโพสต์ (Post Detail)</span>
        <span class="ui-card-route">/posts/[id]</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าแสดงเนื้อหาโพสต์ฉบับสมบูรณ์ พร้อมกล่องแสดงความคิดเห็นและการสนทนาใต้โพสต์</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ปุ่มย้อนกลับ:</strong> ลิงก์กดย้อนกลับไปยังหน้าฟีด</li>
            <li><strong>เนื้อหาโพสต์เต็ม:</strong> ข้อมูลผู้เขียน, วันเวลา, หมวดหมู่, หัวข้อ, ข้อความ และแท็กทั้งหมด</li>
            <li><strong>แถบเครื่องมือโต้ตอบ:</strong> ปุ่มกดไลก์, ปุ่มบันทึกเข้าหน้า Saved, และปุ่มแชร์</li>
            <li><strong>กล่องและรายการคอมเมนต์:</strong> กล่องพิมพ์ส่งความคิดเห็นใหม่ และรายการความคิดเห็นย้อนหลัง</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.post_detail}" alt="Post Detail">
        </div>
      </div>
    </div>

    <!-- 6. Discover -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">6. หน้าสำรวจและค้นหาภาพรวม (Discover)</span>
        <span class="ui-card-route">/discover</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">เครื่องมือค้นหาขั้นสูง สามารถค้นหาทุกข้อมูลในระบบได้จากจุดเดียว</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>กล่องค้นหาหลัก:</strong> Search bar ขนาดใหญ่สำหรับพิมพ์คำค้นหา</li>
            <li><strong>ตัวกรองขั้นสูง:</strong> กรองตามคณะ, สาขาวิชา, ชั้นปี, ทักษะ, หมวดหมู่, รูปแบบการทำงาน</li>
            <li><strong>แท็กทักษะยอดนิยม:</strong> ชิปแสดงทักษะที่กำลังมาแรง (Trending Skills) กดเพื่อกรองข้อมูลทันที</li>
            <li><strong>ผลลัพธ์แยกหมวดหมู่:</strong> แบ่งเป็นบุคคล (People), โพสต์, ทีม, การแข่งขัน, กิจกรรม, และคลับ</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.discover}" alt="Discover">
        </div>
      </div>
    </div>

    <!-- 7. People Directory -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">7. ทำเนียบรายชื่อนักศึกษา (People Directory)</span>
        <span class="ui-card-route">/people</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าแสดงรายชื่อเพื่อนนักศึกษาทั้งหมดในมหาวิทยาลัย เพื่อการสร้างเครือข่ายและหาคนร่วมงาน</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ตัวกรองและจัดเรียง:</strong> กรองคณะ ชั้นปี ทักษะ และสลับเรียงตาม Best match หรือ Name</li>
            <li><strong>การ์ดนักศึกษา:</strong> รูปโปรไฟล์, ชื่อ, คณะ, สาขา, ทักษะเด่น, ความสนใจ, สถานะความพร้อม</li>
            <li><strong>คะแนนความเข้ากันได้ (Match Score %):</strong> ประเมินความเข้ากันได้จากทักษะและความสนใจ</li>
            <li><strong>ปุ่มแอ็กชัน:</strong> ปุ่มกด "Follow / Following" และคลิกดูหน้าโปรไฟล์เต็ม</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.people}" alt="People Directory">
        </div>
      </div>
    </div>

    <!-- 8. Student Profile -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">8. หน้าโปรไฟล์นักศึกษา (Student Profile)</span>
        <span class="ui-card-route">/profile/[username]</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าแสดงประวัติ ทักษะ และผลงานส่วนตัวของนักศึกษาแต่ละคนอย่างละเอียด</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>Profile Header:</strong> รูปอวาตาร์, ชื่อ, @username, คณะ, สาขา, ชั้นปี, คำแนะนำตัว (Bio)</li>
            <li><strong>ตัวเลขสถิติ:</strong> จำนวนผู้ติดตาม (Followers) และกำลังติดตาม (Following)</li>
            <li><strong>ปุ่มหลัก:</strong> ปุ่มกด "Follow / Unfollow" และปุ่ม "Message" สำหรับทักแชทส่วนตัว</li>
            <li><strong>แท็บผลงาน:</strong> สลับดูโพสต์ที่เคยเขียน (Posts), ทีมที่สังกัด (Teams), และรางวัล (Achievements)</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.profile}" alt="Student Profile">
        </div>
      </div>
    </div>

    <!-- 9. Teams -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">9. บอร์ดค้นหาเพื่อนร่วมทีม (Team Recruitment Board)</span>
        <span class="ui-card-route">/teams</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">ศูนย์กลางการประกาศรับสมัครคนเข้าทีมสำหรับทุกกิจกรรมในมหาวิทยาลัย</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ตัวกรองการรับสมัคร:</strong> กรองตามชื่องานแข่งขัน, ตำแหน่ง (Role), ทักษะ, คณะ, กำหนดเวลา, รูปแบบการทำงาน</li>
            <li><strong>การ์ดรับสมัครทีม:</strong> ชื่อทีม, หัวหน้าทีม, ชื่องานแข่งขัน, สัดส่วนสมาชิก (เช่น 3/5 คน)</li>
            <li><strong>รายการตำแหน่งที่รับ (Roles):</strong> ป้ายบอกสถานะว่าตำแหน่งไหนยังว่าง หรือมีคนได้แล้ว</li>
            <li><strong>ปุ่มแอ็กชัน:</strong> ป้ายรูปแบบทำงาน (Work Mode), วันปิดรับ และปุ่ม "Request to Join"</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.teams}" alt="Teams Board">
        </div>
      </div>
    </div>

    <!-- 10. Team Detail -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">10. หน้ารายละเอียดการรับสมัครทีม (Team Detail)</span>
        <span class="ui-card-route">/teams/[id]</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าแสดงข้อมูลเป้าหมาย รายละเอียดเชิงลึก และสมาชิกของทีมนั้น ๆ</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>เป้าหมายโครงการ (Objectives):</strong> คำอธิบายเป้าหมาย สิ่งที่จะพัฒนา และรายละเอียดงาน</li>
            <li><strong>ตารางตำแหน่งและทักษะ:</strong> แสดงบทบาทที่เปิดรับพร้อมทักษะที่จำเป็นในแต่ละตำแหน่ง</li>
            <li><strong>รายชื่อสมาชิกในทีม:</strong> การ์ดแสดงหัวหน้าทีมและสมาชิกที่เข้าร่วมแล้ว กดดูโปรไฟล์ได้</li>
            <li><strong>ฟอร์มขอเข้าร่วมทีม:</strong> กล่องพิมพ์ข้อความแนะนำตัวและปุ่มกดยืนยันส่งคำขอ</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.team_detail}" alt="Team Detail">
        </div>
      </div>
    </div>

    <!-- 11. Competitions -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">11. รวมรายการแข่งขัน (Competitions Directory)</span>
        <span class="ui-card-route">/competitions</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">แหล่งรวบรวมงานแข่งขัน Hackathon, ประกวดสตาร์ตอัป และชาเลนจ์ระดับมหาวิทยาลัย</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ตัวกรองสถานะ:</strong> คัดกรองระหว่างงานที่ <em>Open</em>, <em>Closing Soon</em>, และ <em>Upcoming</em></li>
            <li><strong>การ์ดการแข่งขัน:</strong> ชื่องาน, หน่วยงานผู้จัด, ป้ายเงินรางวัลรวม (เช่น ฿50,000)</li>
            <li><strong>กำหนดการและขนาดทีม:</strong> วันปิดรับสมัคร และขนาดทีมที่อนุญาตให้ลงแข่ง</li>
            <li><strong>ปุ่มแอ็กชัน:</strong> ปุ่ม "View Details" เพื่อดูกติกา และปุ่ม "Find Teams" เพื่อดูทีมที่หาคนไปงานนี้</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.competitions}" alt="Competitions">
        </div>
      </div>
    </div>

    <!-- 12. Competition Detail -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">12. หน้ารายละเอียดการแข่งขัน (Competition Detail)</span>
        <span class="ui-card-route">/competitions/[id]</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าแสดงกติกา รางวัล และรายชื่อทีมทั้งหมดที่กำลังเปิดรับสมัครสำหรับงานแข่งขันนี้</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>ข้อมูลภาพรวมงาน:</strong> รายละเอียดโจทย์ วัตถุประสงค์ คุณสมบัติผู้สมัคร และเกณฑ์การตัดสิน</li>
            <li><strong>สรุปข้อมูลสำคัญ:</strong> วันปิดรับสมัคร, สถานที่จัดงาน (On-site หรือ Online), และรางวัลทั้งหมด</li>
            <li><strong>ปุ่มสร้างทีมสำหรับงานนี้:</strong> ปุ่มเปิดป๊อปอัปตั้งทีมและผูกเข้ากับงานแข่งนี้ทันที</li>
            <li><strong>รายการทีมที่เปิดรับ:</strong> แสดงการ์ดทีมทั้งหมดที่กำลังมองหาสมาชิกไปแข่งในงานนี้</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.competition_detail}" alt="Competition Detail">
        </div>
      </div>
    </div>

    <!-- 13. Events -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">13. ปฏิทินกิจกรรมแคมปัส (Campus Events Calendar)</span>
        <span class="ui-card-route">/events</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">ปฏิทินแสดงตารางกิจกรรม เวิร์กช็อป งานเสวนา และสัมมนาภายในมหาวิทยาลัย</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>Interactive Calendar Grid:</strong> ปฏิทินรายเดือน มีจุดมาร์กเกอร์สีบอกวันจัดกิจกรรม คลิกเลือกวันได้</li>
            <li><strong>Upcoming Events List:</strong> การ์ดแสดงชื่องาน, วันที่, เวลา, สถานที่จัด และหน่วยงานผู้จัด</li>
            <li><strong>ปุ่ม Bookmark:</strong> กดบันทึกกิจกรรมที่สนใจเข้าหน้ารายการส่วนตัวเพื่อรับการแจ้งเตือน</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.events}" alt="Campus Events">
        </div>
      </div>
    </div>

    <!-- 14. Communities -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">14. รวมชมรมและกลุ่มความสนใจ (Communities & Clubs)</span>
        <span class="ui-card-route">/communities</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้ารวมกลุ่มคลับความสนใจเฉพาะด้านของนักศึกษาทั่วทั้งมหาวิทยาลัย</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>การ์ดชุมชน:</strong> AI Collective, Web Builders, Startup Circle, Design Studio, Robotics Lab ฯลฯ</li>
            <li><strong>ข้อมูลการ์ด:</strong> สัญลักษณ์ไอคอนคลับ, ชื่อกลุ่ม, คำอธิบาย, จำนวนสมาชิก, จำนวนโพสต์ที่ Active, แท็กความสนใจ</li>
            <li><strong>ปุ่มเข้าสู่ชุมชน:</strong> กดเพื่อเข้าสู่หน้ารายละเอียดและกระดานพูดคุยเฉพาะกลุ่ม</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.communities}" alt="Communities">
        </div>
      </div>
    </div>

    <!-- 15. Community Detail -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">15. หน้ารายละเอียดชุมชน (Community Detail)</span>
        <span class="ui-card-route">/communities/[slug]</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าพื้นที่เฉพาะของแต่ละคลับ รวบรวมสมาชิกและกระทู้สนทนาในหัวข้อนั้น</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>แบนเนอร์กลุ่ม:</strong> ชื่อกลุ่ม, คำอธิบายโดยละเอียด, แท็ก และจำนวนสมาชิกปัจจุบัน</li>
            <li><strong>ปุ่ม "Join Community":</strong> สำหรับกดติดตามและเข้าร่วมเป็นสมาชิกคลับ</li>
            <li><strong>ฟีดกระทู้ในคลับ:</strong> รายการโพสต์ทั้งหมดที่พูดคุยกันภายในชุมชนนี้</li>
            <li><strong>ปุ่มสร้างโพสต์ในคลับ:</strong> ตั้งกระทู้พูดคุยหรือแชร์ไอเดียเข้าคลับโดยตรง</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.community_detail}" alt="Community Detail">
        </div>
      </div>
    </div>

    <!-- 16. Saved -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">16. หน้ารายการที่บันทึกไว้ (Saved Bookmarks)</span>
        <span class="ui-card-route">/saved</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">คลังเก็บรวบรวมสิ่งที่ผู้ใช้กดบันทึก (Bookmark) ไว้เพื่อกลับมาดูย้อนหลัง</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>แท็บแยกหมวดหมู่:</strong> สลับดูระหว่าง <em>Posts</em>, <em>Teams</em>, <em>Competitions</em>, <em>Events</em></li>
            <li><strong>การ์ดแสดงผล:</strong> แสดงรายการที่เซฟไว้พร้อมปุ่มกดยกเลิกการบันทึก (Unbookmark)</li>
            <li><strong>Empty State:</strong> ข้อความและไอคอนแจ้งเตือนเมื่อยังไม่มีรายการที่บันทึกไว้ในหมวดนั้น</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.saved}" alt="Saved Bookmarks">
        </div>
      </div>
    </div>

    <!-- 17. Notifications -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">17. หน้าศูนย์การแจ้งเตือน (Notifications)</span>
        <span class="ui-card-route">/notifications</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">แสดงการแจ้งเตือนความเคลื่อนไหวทั้งหมดที่เกี่ยวข้องกับผู้ใช้งาน</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>รายการแจ้งเตือน:</strong> ไอคอนแยกตามประเภท (กดไลก์, คอมเมนต์, ขอเข้าทีม, ติดตามใหม่)</li>
            <li><strong>สถานะการอ่าน:</strong> แถบสีไฮไลต์บอกรายการที่ยังไม่อ่าน (Unread) และอ่านแล้ว (Read)</li>
            <li><strong>ปุ่มทำเครื่องหมายว่าอ่านแล้ว:</strong> คลิกเพื่อเปลี่ยนสถานะการแจ้งเตือน</li>
            <li><strong>ลิงก์นำทางด่วน:</strong> คลิกที่การแจ้งเตือนเพื่อเปิดไปยังโพสต์หรือทีมที่เกี่ยวข้องได้ทันที</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.notifications}" alt="Notifications">
        </div>
      </div>
    </div>

    <!-- 18. Messages -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">18. หน้าข้อความและแชทส่วนตัว (Messages & Chat)</span>
        <span class="ui-card-route">/messages</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">ระบบแชทสนทนาแบบสองหน้าต่างสำหรับการติดต่อสื่อสารระหว่างนักศึกษา</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>แถบซ้าย (Conversations):</strong> รายชื่อห้องแชท ข้อความล่าสุด เวลา และจุดเตือนข้อความใหม่</li>
            <li><strong>แถบขวา (Chat Window):</strong> แถบหัวห้องแชท แสดงชื่อคู่สนทนาและคณะ</li>
            <li><strong>ประวัติข้อความ:</strong> ฟองข้อความแยกฝั่งผู้ส่งและผู้รับ พร้อมเวลาส่ง</li>
            <li><strong>กล่องพิมพ์ข้อความ:</strong> ช่องพิมพ์ข้อความและปุ่ม "Send" สำหรับส่งข้อความแบบทันที</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.messages}" alt="Messages">
        </div>
      </div>
    </div>

    <!-- 19. Me Dashboard -->
    <div class="ui-card">
      <div class="ui-card-header">
        <span class="ui-card-title">19. หน้าแดชบอร์ดส่วนตัวของฉัน (My Profile & Dashboard)</span>
        <span class="ui-card-route">/me</span>
      </div>
      <div class="ui-card-grid">
        <div>
          <p class="ui-card-desc">หน้าศูนย์รวมข้อมูลส่วนตัว จัดการโปรไฟล์ ทีมที่ตนเองสร้าง และแบบร่างโพสต์</p>
          <div class="ui-card-subtitle">องค์ประกอบ UI ที่มีในหน้านี้:</div>
          <ul class="ui-list">
            <li><strong>การ์ดโปรไฟล์ส่วนตัว:</strong> แสดงรูป, ชื่อ, คณะ, สาขา, ทักษะ และคำแนะนำตัว</li>
            <li><strong>ปุ่ม "Edit Profile":</strong> เปิดหน้าต่าง Dialog สำหรับแก้ไขข้อมูลส่วนตัว ทักษะ และความสนใจ</li>
            <li><strong>แท็บจัดการกิจกรรม:</strong> สลับดูโพสต์ของฉัน (My Posts), ทีมของฉัน (My Teams), คำขอเข้าทีม (Team Requests), และแบบร่างโพสต์ (Drafts)</li>
          </ul>
        </div>
        <div class="browser-mockup">
          <div class="browser-header"><span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span></div>
          <img src="${images.me}" alt="My Dashboard">
        </div>
      </div>
    </div>

    <!-- Global Components -->
    <div class="ui-card" style="background: #f8fafc; border-color: #cbd5e1;">
      <div class="ui-card-header">
        <span class="ui-card-title">ส่วนประกอบส่วนกลางของระบบ (Global Navigation & Dialogs)</span>
        <span class="ui-card-route">App Shell</span>
      </div>
      <p class="ui-card-desc" style="margin-bottom: 6px;">องค์ประกอบ UI ส่วนกลางที่ปรากฏและใช้งานได้จากทุกหน้าจอ</p>
      <div class="ui-card-subtitle">องค์ประกอบ UI ส่วนกลาง:</div>
      <ul class="ui-list">
        <li><strong>Desktop Sidebar:</strong> เมนูนำทางด้านซ้ายบนหน้าจอคอมพิวเตอร์ รวบรวมทุกลิงก์และปุ่มสร้างโพสต์ด่วน</li>
        <li><strong>Mobile Navigation Bar:</strong> เมนูนำทางด้านล่างของหน้าจอสมาร์ตโฟน ออกแบบให้กดง่ายด้วยมือเดียว</li>
        <li><strong>Global Command Palette (Ctrl+K):</strong> หน้าต่างป๊อปอัปค้นหาด่วน กดเรียกได้จากทุกหน้า ค้นหาเพื่อน โพสต์ หรือทีมได้ทันที</li>
        <li><strong>Create Post / Recruitment Dialog:</strong> หน้าต่างป๊อปอัปสร้างโพสต์ใหม่ เลือกระหว่างโพสต์ทั่วไป รับสมัครทีม หรือประชาสัมพันธ์กิจกรรม</li>
      </ul>
    </div>

  </div>

</body>
</html>
`;

async function main() {
  console.log("Generating Document with UI Screenshots and Natural Flow...");
  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  const outputPdfPath = path.resolve("..", "MU_Connect_Project_Document.pdf");
  const localPdfPath = path.resolve(".", "MU_Connect_Project_Document.pdf");
  const outputHtmlPath = path.resolve("..", "MU_Connect_Project_Document.html");
  const localHtmlPath = path.resolve(".", "MU_Connect_Project_Document.html");

  try {
    fs.writeFileSync(outputHtmlPath, htmlContent, "utf-8");
  } catch (e) {
    console.warn("Could not write outputHtmlPath:", e.message);
  }
  try {
    fs.writeFileSync(localHtmlPath, htmlContent, "utf-8");
  } catch (e) {
    console.warn("Could not write localHtmlPath:", e.message);
  }

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
  });

  let savedAny = false;
  const writePDF = (dest) => {
    try {
      fs.writeFileSync(dest, pdfBuffer);
      console.log("  ✓ Saved PDF to:", dest);
      savedAny = true;
    } catch (e) {
      console.warn(`  ⚠️ Could not write ${dest} (file may be open in viewer):`, e.message);
    }
  };

  writePDF(outputPdfPath);
  writePDF(localPdfPath);

  // If both were locked by active viewer, save to a fallback updated filename so the user has the newest version immediately
  if (!savedAny) {
    const fallbackPath = path.resolve("..", "MU_Connect_Project_Document_Updated.pdf");
    fs.writeFileSync(fallbackPath, pdfBuffer);
    console.log("  ✓ Saved PDF to fallback path:", fallbackPath);
  }

  await browser.close();
  console.log("✅ PDF and HTML with UI screenshots generated successfully!");
  console.log("Primary PDF location:", outputPdfPath);
}

main().catch(console.error);
