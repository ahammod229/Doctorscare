# Doctors Care - Appointment Management System

Doctors Care is a comprehensive, full-stack Doctor Appointment and Clinic Management System built with modern web technologies. It seamlessly connects patients with doctors, allowing for easy appointment scheduling, prescription management, and clinic administration.

## 🚀 Features

- **Multi-Role System:** Secure access for Patients, Doctors, and Administrators.
- **Patient Portal:** 
  - Browse available doctors by department.
  - Book, reschedule, and cancel appointments.
  - View personal medical records and upload documents.
  - Access and print clinical-grade digital prescriptions (with zooming).
- **Doctor Dashboard:**
  - View daily schedule and appointment history.
  - Review patient medical history and uploaded documents.
  - Confirm or mark appointments as completed.
  - Write digital prescriptions with diagnosis, medications, instructions, and follow-ups.
- **Admin Panel:**
  - Dashboard overview with real-time statistics (Revenue, Total Patients, Appointments).
  - Manage doctors, set consultation fees, and assign departments.
  - Manage and create hospital departments.
- **Modern UI/UX:** Responsive, aesthetic interface built with Tailwind CSS and Radix UI components.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on [Supabase](https://supabase.com/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)

## ⚙️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Supabase project (for the PostgreSQL database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ahammod229/Doctorscare.git
   cd Doctorscare
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your database URL:
   ```env
   DATABASE_URL="your-supabase-postgresql-connection-string"
   ```

4. **Initialize the database:**
   Push the Prisma schema to your database and generate the client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Future Roadmap
- Native Android application wrap using **Capacitor**.
- Advanced real-time notifications for appointment updates.
- Integrated video consultation features.

## 📄 License
This project is proprietary and built for Doctors Care.
