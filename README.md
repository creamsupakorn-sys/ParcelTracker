# Parcel Tracker
คือเว็บแอปพลิเคชั่นสำหรับจัดการและติดตามข้อมูลของพัสดุซึ่งพัฒนาด้วย Node.js และ Express.js โดยมี REST API สำหรับจัดการข้อมูลพัสดุ 
และใช้ HTML, CSS และ JavaScript สำหรับพัฒนาส่วนติดต่อผู้ใช้
โดยความสามารถของเว็บแอปพลิเคชั่นนี้ คือ 
- แสดงรายการพัสดุทั้งหมด
- กรองรายการพัสดุตามสถานะ
- เพิ่มข้อมูลพัสดุใหม่
- แก้ไขข้อมูลพัสดุ
- ลบข้อมูลพัสดุ
- รองรับ REST API แบบ CRUD
- อัปเดตข้อมูลบนหน้าเว็บโดยไม่ต้องโหลดหน้าใหม่

# วิธีติดตั้ง npm และรันโปรแกรม
## 1.เปิด Terminal ในโฟลเดอร์ของโปรเจกต์ แล้วใช้คำสั่ง npm install 
## 2.โดยเราต้องไปเพิ่ม dev ใน package.json ก่อน โดยเราจะเพิ่มในส่วนของ scripts
  "scripts": {
    "dev": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
จากนั้นถึงจะทำการใช้ npm run dev ได้ เมื่อ server ทำงานเเล้ว จะสามารเปิดเว็บไซต์ http://localhost:3000 ได้

# REST API Endpoints
## 1.GET /api/parcels ใช้สำหรับแสดงรายการพัสดุทั้งหมด
## 2.GET /api/parcels?status=Preparing ใช้สำหรับกรองรายการพัสดุตามสถานะ
## 3.GET /api/parcels/:id ใช้สำหรับแสดงข้อมูลพัสดุตาม ID
## 4.POST /api/parcels ใช้สำหรับเพิ่มข้อมูลพัสดุใหม่โดยข้อมูลที่ใช้จะเป็น
{
  "trackingNumber": "TH123456789",
  "recipient": "Supakorn",
  "carrier": "Kerry Express",
  "status": "Preparing",
  "category": "Books"
}
## 5.PATCH /api/parcels/:id ใช้สำหรับแก้ไขข้อมูลพัสดุ
## 6.DELETE /api/parcels/:id ใช้สำหรับลบข้อมูลพัสดุ

# การDebug
## ภาพที่ 1 การDebug PATCH
อยู่ใน folder/screenshots ในไฟล์ debug1.png
## ภาพที่ 2 การDebug POST
อยู่ใน folder/screenshots ในไฟล์ debug2.png
