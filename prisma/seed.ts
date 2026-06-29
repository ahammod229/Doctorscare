import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // Clear existing data
  await db.prescription.deleteMany()
  await db.doctorTimeSlot.deleteMany()
  await db.appointment.deleteMany()
  await db.doctor.deleteMany()
  await db.department.deleteMany()
  await db.user.deleteMany()

  // Create Departments
  const departments = await Promise.all([
    db.department.create({ data: { name: 'Cardiology', description: 'Heart and cardiovascular system care', icon: '❤️' } }),
    db.department.create({ data: { name: 'Neurology', description: 'Brain and nervous system disorders', icon: '🧠' } }),
    db.department.create({ data: { name: 'Orthopedics', description: 'Bone and joint treatment', icon: '🦴' } }),
    db.department.create({ data: { name: 'Pediatrics', description: 'Child health and development', icon: '👶' } }),
    db.department.create({ data: { name: 'Dermatology', description: 'Skin, hair, and nail conditions', icon: '🩹' } }),
    db.department.create({ data: { name: 'Ophthalmology', description: 'Eye care and vision health', icon: '👁️' } }),
    db.department.create({ data: { name: 'ENT', description: 'Ear, nose, and throat care', icon: '👂' } }),
    db.department.create({ data: { name: 'General Medicine', description: 'Primary healthcare and general wellness', icon: '🏥' } }),
    db.department.create({ data: { name: 'Psychiatry', description: 'Mental health and behavioral disorders', icon: '🧘' } }),
    db.department.create({ data: { name: 'Gynecology', description: "Women's reproductive health", icon: '🩺' } }),
  ])

  // Create Admin
  const adminPassword = await hash('admin123', 10)
  const admin = await db.user.create({
    data: { name: 'Admin User', email: 'admin@binimoy.com', password: adminPassword, role: 'ADMIN', phone: '+8801700000001' }
  })

  // Create Doctors
  const doctorData = [
    { name: 'Dr. Ayesha Khan', email: 'ayesha@binimoy.com', specialty: 'Cardiologist', qualification: 'MBBS, MD (Cardiology)', experience: 12, fee: 800, deptIdx: 0, days: 'Mon,Tue,Wed,Thu,Fri' },
    { name: 'Dr. Rafiq Ahmed', email: 'rafiq@binimoy.com', specialty: 'Neurologist', qualification: 'MBBS, MD (Neurology)', experience: 15, fee: 1000, deptIdx: 1, days: 'Mon,Wed,Fri' },
    { name: 'Dr. Fatima Begum', email: 'fatima@binimoy.com', specialty: 'Orthopedic Surgeon', qualification: 'MBBS, MS (Ortho)', experience: 10, fee: 900, deptIdx: 2, days: 'Tue,Thu,Sat' },
    { name: 'Dr. Karim Uddin', email: 'karim@binimoy.com', specialty: 'Pediatrician', qualification: 'MBBS, DCH', experience: 8, fee: 600, deptIdx: 3, days: 'Mon,Tue,Wed,Thu,Fri,Sat' },
    { name: 'Dr. Nasreen Jahan', email: 'nasreen@binimoy.com', specialty: 'Dermatologist', qualification: 'MBBS, DDV', experience: 9, fee: 700, deptIdx: 4, days: 'Mon,Wed,Fri,Sat' },
    { name: 'Dr. Tanvir Hasan', email: 'tanvir@binimoy.com', specialty: 'Ophthalmologist', qualification: 'MBBS, DO', experience: 11, fee: 850, deptIdx: 5, days: 'Tue,Thu,Sat' },
    { name: 'Dr. Sharmin Akter', email: 'sharmin@binimoy.com', specialty: 'ENT Specialist', qualification: 'MBBS, DLO', experience: 7, fee: 650, deptIdx: 6, days: 'Mon,Tue,Thu,Fri' },
    { name: 'Dr. Imran Hossain', email: 'imran@binimoy.com', specialty: 'General Physician', qualification: 'MBBS, FCPS', experience: 14, fee: 500, deptIdx: 7, days: 'Mon,Tue,Wed,Thu,Fri,Sat' },
    { name: 'Dr. Mahbuba Alam', email: 'mahbuba@binimoy.com', specialty: 'Psychiatrist', qualification: 'MBBS, MD (Psychiatry)', experience: 13, fee: 1200, deptIdx: 8, days: 'Mon,Wed' },
    { name: 'Dr. Salma Khatun', email: 'salma@binimoy.com', specialty: 'Gynecologist', qualification: 'MBBS, DGO', experience: 16, fee: 900, deptIdx: 9, days: 'Mon,Tue,Thu,Fri' },
    { name: 'Dr. Zubair Mahmud', email: 'zubair@binimoy.com', specialty: 'Cardiologist', qualification: 'MBBS, DM (Cardiology)', experience: 18, fee: 1200, deptIdx: 0, days: 'Mon,Wed,Fri' },
    { name: 'Dr. Nazia Rahman', email: 'nazia@binimoy.com', specialty: 'Neurologist', qualification: 'MBBS, DM (Neurology)', experience: 9, fee: 950, deptIdx: 1, days: 'Tue,Thu,Sat' },
  ]

  const doctors: any[] = []
  for (const d of doctorData) {
    const pwd = await hash('doctor123', 10)
    const user = await db.user.create({
      data: { name: d.name, email: d.email, password: pwd, role: 'DOCTOR', phone: '+880180000' + String(doctors.length + 1).padStart(4, '0') }
    })
    const doctor = await db.doctor.create({
      data: {
        userId: user.id,
        specialty: d.specialty,
        qualification: d.qualification,
        experience: d.experience,
        fee: d.fee,
        departmentId: departments[d.deptIdx].id,
        availableDays: d.days,
        bio: `Experienced ${d.specialty} with ${d.experience} years of dedicated service in patient care.`,
      }
    })
    doctors.push(doctor)
  }

  // Create Patients
  const patientData = [
    { name: 'Rahim Uddin', email: 'rahim@gmail.com', phone: '+8801500000001' },
    { name: 'Karina Akter', email: 'karina@gmail.com', phone: '+8801500000002' },
    { name: 'Jamal Hossain', email: 'jamal@gmail.com', phone: '+8801500000003' },
    { name: 'Sumaiya Islam', email: 'sumaiya@gmail.com', phone: '+8801500000004' },
    { name: 'Arif Rahman', email: 'arif@gmail.com', phone: '+8801500000005' },
  ]

  const patients: any[] = []
  for (const p of patientData) {
    const pwd = await hash('patient123', 10)
    const user = await db.user.create({
      data: { name: p.name, email: p.email, password: pwd, role: 'PATIENT', phone: p.phone }
    })
    patients.push(user)
  }

  // Create Appointments
  const today = new Date()
  const formatDate = (d: Date) => d.toISOString().split('T')[0]
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date(today)
  dayAfter.setDate(dayAfter.getDate() + 2)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const appointmentData = [
    { patientIdx: 0, doctorIdx: 0, date: formatDate(tomorrow), time: '10:00', status: 'CONFIRMED', reason: 'Chest pain and shortness of breath' },
    { patientIdx: 1, doctorIdx: 1, date: formatDate(tomorrow), time: '11:00', status: 'PENDING', reason: 'Recurring headaches' },
    { patientIdx: 2, doctorIdx: 3, date: formatDate(dayAfter), time: '09:00', status: 'PENDING', reason: 'Child vaccination checkup' },
    { patientIdx: 3, doctorIdx: 4, date: formatDate(tomorrow), time: '14:00', status: 'CONFIRMED', reason: 'Skin rash and itching' },
    { patientIdx: 4, doctorIdx: 7, date: formatDate(tomorrow), time: '09:30', status: 'PENDING', reason: 'Fever and body ache for 3 days' },
    { patientIdx: 0, doctorIdx: 7, date: formatDate(yesterday), time: '10:00', status: 'COMPLETED', reason: 'Regular health checkup' },
    { patientIdx: 1, doctorIdx: 0, date: formatDate(twoDaysAgo), time: '11:00', status: 'COMPLETED', reason: 'Blood pressure checkup' },
    { patientIdx: 2, doctorIdx: 2, date: formatDate(twoDaysAgo), time: '14:00', status: 'CANCELLED', reason: 'Knee pain' },
    { patientIdx: 3, doctorIdx: 9, date: formatDate(yesterday), time: '10:30', status: 'COMPLETED', reason: 'Prenatal checkup' },
    { patientIdx: 4, doctorIdx: 8, date: formatDate(dayAfter), time: '15:00', status: 'CONFIRMED', reason: 'Anxiety and sleep issues' },
  ]

  const appointments: any[] = []
  for (const a of appointmentData) {
    const apt = await db.appointment.create({
      data: {
        patientId: patients[a.patientIdx].id,
        doctorId: doctors[a.doctorIdx].id,
        date: a.date,
        timeSlot: a.time,
        status: a.status,
        reason: a.reason,
      }
    })
    appointments.push(apt)
  }

  // Create Prescriptions for completed appointments
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED')
  for (const apt of completedAppts) {
    const doctor = await db.doctor.findUnique({ where: { id: apt.doctorId }, include: { user: true } })
    if (doctor) {
      await db.prescription.create({
        data: {
          appointmentId: apt.id,
          doctorId: doctor.userId,
          patientId: apt.patientId,
          diagnosis: apt.reason === 'Regular health checkup' ? 'General wellness - all vitals normal' :
                     apt.reason === 'Blood pressure checkup' ? 'Mild hypertension (Stage 1)' :
                     'Normal pregnancy progression - all parameters healthy',
          medications: apt.reason === 'Regular health checkup' ? 'Vitamin D3 - 1000 IU daily\nMultivitamin - 1 tablet daily' :
                       apt.reason === 'Blood pressure checkup' ? 'Amlodipine 5mg - 1 tablet daily morning\nAspirin 75mg - 1 tablet after lunch' :
                       'Folic Acid 5mg - 1 tablet daily\nCalcium + Vitamin D - 1 tablet twice daily\nIron supplement - 1 tablet after dinner',
          instructions: apt.reason === 'Regular health checkup' ? 'Continue medications for 3 months. Exercise regularly. Follow up in 1 month.' :
                        apt.reason === 'Blood pressure checkup' ? 'Reduce salt intake. Monitor BP daily. Follow up in 2 weeks.' :
                        'Regular walk recommended. Attend all scheduled checkups.',
          followUpDate: formatDate(dayAfter),
        }
      })
    }
  }

  // Create time slots for doctors for tomorrow and day after
  const slotTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30']
  for (const doctor of doctors) {
    for (const dateStr of [formatDate(tomorrow), formatDate(dayAfter)]) {
      for (const time of slotTimes) {
        const isBooked = appointmentData.some(a =>
          doctors[a.doctorIdx].id === doctor.id && a.date === dateStr && a.time === time
        )
        await db.doctorTimeSlot.create({
          data: {
            doctorId: doctor.id,
            date: dateStr,
            startTime: time,
            endTime: `${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}`,
            isBooked,
          }
        })
      }
    }
  }

  console.log('✅ Seed data created successfully!')
  console.log(`   - ${departments.length} departments`)
  console.log(`   - ${doctorData.length} doctors`)
  console.log(`   - ${patientData.length} patients`)
  console.log(`   - ${appointmentData.length} appointments`)
  console.log(`   - ${completedAppts.length} prescriptions`)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())