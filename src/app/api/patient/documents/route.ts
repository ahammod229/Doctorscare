import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { patientId, fileUrl, fileName, fileType } = await request.json();

    if (!patientId || !fileUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userId = request.headers.get('X-User-Id')
    if (userId !== patientId) {
      return NextResponse.json({ error: 'Unauthorized to upload documents for this patient' }, { status: 403 })
    }

    const document = await db.patientDocument.create({
      data: {
        patientId,
        title: fileName,
        fileData: fileUrl, // Now storing URL instead of Base64
        fileType
      }
    });

    return NextResponse.json({ 
      success: true, 
      document: {
        id: document.id,
        title: document.title,
        fileType: document.fileType,
        createdAt: document.createdAt
      } 
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    if (!patientId) {
       return NextResponse.json({ error: 'patientId is required' }, { status: 400 });
    }

    const userId = request.headers.get('X-User-Id')
    
    // In a real app we'd verify doctorId has an appointment with patientId
    // But for basic security, only the patient (or an authorized doctor) can view it.
    // For now, if the userId doesn't match the patientId, we reject (assuming it's not a doctor flow yet).
    // The previous implementation had no security. We'll at least secure it for patients.
    if (userId !== patientId) {
       // Since the current app doesn't have a secure way to verify doctors on this route without a DB lookup,
       // we will check if the user is a doctor.
       const doctor = await db.doctor.findFirst({ where: { userId: userId || '' } })
       const admin = await db.user.findFirst({ where: { id: userId || '', role: 'ADMIN' } })
       if (!doctor && !admin) {
         return NextResponse.json({ error: 'Unauthorized to view documents' }, { status: 403 });
       }
    }

    const documents = await db.patientDocument.findMany({
      where: { patientId: patientId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        fileData: true, // Now contains URL
        fileType: true,
        createdAt: true
      }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Fetch documents error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const document = await db.patientDocument.findUnique({ where: { id: documentId } })
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const userId = request.headers.get('X-User-Id')
    if (userId !== document.patientId) {
      return NextResponse.json({ error: 'Unauthorized to delete this document' }, { status: 403 });
    }

    await db.patientDocument.delete({
      where: { id: documentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete document error:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
