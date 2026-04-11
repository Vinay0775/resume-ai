import { db } from './firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Types matching the Prisma schema
export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  role: 'user' | 'admin' | 'subadmin';
  plan: 'free' | 'premium';
  status: 'active' | 'suspended' | 'deleted';
  aiCreditsUsed: number;
  aiCreditsLimit: number;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  resumeData: string; // JSON string
  flagged: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  layout: string; // JSON string
  previewUrl?: string;
  isPremium: boolean;
  category: string;
  enabled: boolean;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  plan: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: Date;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
}

// Helper functions for User collection
export const userDb = {
  async findUnique(data: { email?: string }): Promise<User | null> {
    const usersRef = db.collection('users');
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData, FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>>;
    
    if (data.email) {
      q = usersRef.where('email', '==', data.email).limit(1);
    } else {
      return null;
    }
    
    const snapshot = await q.get();
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    const docData = doc.data();
    return {
      id: doc.id,
      ...docData,
      createdAt: docData.createdAt?.toDate(),
      updatedAt: docData.updatedAt?.toDate(),
      resetTokenExpiry: docData.resetTokenExpiry?.toDate(),
    } as User;
  },

  async findUniqueById(id: string): Promise<User | null> {
    const docRef = db.doc(`users/${id}`);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      resetTokenExpiry: data.resetTokenExpiry?.toDate(),
    } as User;
  },

  async create(data: Partial<User>): Promise<User> {
    const now = Timestamp.now();
    const usersRef = db.collection('users');
    const userDoc = {
      ...data,
      createdAt: now,
      updatedAt: now,
      role: data.role || 'user',
      plan: data.plan || 'free',
      status: data.status || 'active',
      aiCreditsUsed: data.aiCreditsUsed || 0,
      aiCreditsLimit: data.aiCreditsLimit || 5,
    };
    
    const docRef = await usersRef.add(userDoc);
    const docSnap = await docRef.get();
    const docData = docSnap.data();
    
    return {
      id: docSnap.id,
      ...docData,
      createdAt: docData.createdAt?.toDate(),
      updatedAt: docData.updatedAt?.toDate(),
    } as User;
  },

  async update(id: string, data: Partial<User>): Promise<void> {
    const docRef = db.doc(`users/${id}`);
    await docRef.update({
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = db.doc(`users/${id}`);
    await docRef.delete();
  },

  async findMany(options?: { 
    where?: Array<{ field: string; op: FirebaseFirestore.WhereFilterOp; value: any }>;
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  }): Promise<User[]> {
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection('users');
    
    if (options?.where) {
      options.where.forEach(condition => {
        q = q.where(condition.field, condition.op, condition.value);
      });
    }
    
    if (options?.orderBy) {
      q = q.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
    }
    
    if (options?.limit) {
      q = q.limit(options.limit);
    }
    
    const snapshot = await q.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as User;
    });
  },

  async count(): Promise<number> {
    const snapshot = await db.collection('users').get();
    return snapshot.size;
  },
};

// Helper functions for Resume collection
export const resumeDb = {
  async findMany(userId: string): Promise<Resume[]> {
    const q = db.collection('resumes').where('userId', '==', userId);
    const snapshot = await q.get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Resume;
    });
  },

  async findUnique(id: string): Promise<Resume | null> {
    const docRef = db.doc(`resumes/${id}`);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Resume;
  },

  async create(data: Partial<Resume>): Promise<Resume> {
    const now = Timestamp.now();
    const resumesRef = db.collection('resumes');
    const resumeDoc = {
      ...data,
      createdAt: now,
      updatedAt: now,
      title: data.title || 'Untitled Resume',
      templateId: data.templateId || 'modern',
      flagged: data.flagged || false,
    };
    
    const docRef = await resumesRef.add(resumeDoc);
    const docSnap = await docRef.get();
    const docData = docSnap.data();
    
    return {
      id: docSnap.id,
      ...docData,
      createdAt: docData.createdAt?.toDate(),
      updatedAt: docData.updatedAt?.toDate(),
    } as Resume;
  },

  async update(id: string, data: Partial<Resume>): Promise<void> {
    const docRef = db.doc(`resumes/${id}`);
    await docRef.update({
      ...data,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    const docRef = db.doc(`resumes/${id}`);
    await docRef.delete();
  },

  async count(): Promise<number> {
    const snapshot = await db.collection('resumes').get();
    return snapshot.size;
  },
};

// Helper functions for Template collection
export const templateDb = {
  async findMany(filter?: { isPremium?: boolean; enabled?: boolean; category?: string }): Promise<Template[]> {
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection('templates');
    
    if (filter?.enabled !== undefined) {
      q = q.where('enabled', '==', filter.enabled);
    }
    
    const snapshot = await q.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Template[];
  },

  async create(data: Partial<Template>): Promise<Template> {
    const now = Timestamp.now();
    const templatesRef = db.collection('templates');
    const templateDoc = {
      ...data,
      isPremium: data.isPremium || false,
      enabled: data.enabled !== undefined ? data.enabled : true,
      category: data.category || 'professional',
    };
    
    const docRef = await templatesRef.add(templateDoc);
    const docSnap = await docRef.get();
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Template;
  },

  async update(id: string, data: Partial<Template>): Promise<void> {
    const docRef = db.doc(`templates/${id}`);
    await docRef.update(data);
  },

  async delete(id: string): Promise<void> {
    const docRef = db.doc(`templates/${id}`);
    await docRef.delete();
  },

  async count(): Promise<number> {
    const snapshot = await db.collection('templates').get();
    return snapshot.size;
  },
};

// Helper functions for Payment collection
export const paymentDb = {
  async findMany(options?: { 
    userId?: string;
    limit?: number;
  }): Promise<Payment[]> {
    let q: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = db.collection('payments');
    
    if (options?.userId) {
      q = q.where('userId', '==', options.userId);
    }
    
    if (options?.limit) {
      q = q.limit(options.limit);
    }
    
    const snapshot = await q.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
      } as Payment;
    });
  },

  async create(data: Partial<Payment>): Promise<Payment> {
    const now = Timestamp.now();
    const paymentsRef = db.collection('payments');
    const paymentDoc = {
      ...data,
      createdAt: now,
      amount: data.amount || 0,
      currency: data.currency || 'USD',
      status: data.status || 'completed',
      plan: data.plan || 'premium',
      paymentMethod: data.paymentMethod || 'card',
    };
    
    const docRef = await paymentsRef.add(paymentDoc);
    const docSnap = await docRef.get();
    
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: now.toDate(),
    } as Payment;
  },

  async update(id: string, data: Partial<Payment>): Promise<void> {
    const docRef = db.doc(`payments/${id}`);
    await docRef.update(data);
  },

  async count(): Promise<number> {
    const snapshot = await db.collection('payments').get();
    return snapshot.size;
  },
};

// Helper functions for SiteSetting collection
export const siteSettingDb = {
  async findMany(): Promise<SiteSetting[]> {
    const snapshot = await db.collection('siteSettings').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SiteSetting[];
  },

  async findUnique(key: string): Promise<SiteSetting | null> {
    const q = db.collection('siteSettings').where('key', '==', key).limit(1);
    const snapshot = await q.get();
    
    if (snapshot.empty) return null;
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as SiteSetting;
  },

  async upsert(key: string, value: string): Promise<void> {
    const existing = await this.findUnique(key);
    
    if (existing) {
      await db.doc(`siteSettings/${existing.id}`).update({ value });
    } else {
      await db.collection('siteSettings').add({ key, value });
    }
  },
};

// Export db object with the same interface as the old Prisma client
export const db_api = {
  user: userDb,
  resume: resumeDb,
  template: templateDb,
  payment: paymentDb,
  siteSetting: siteSettingDb,
};
