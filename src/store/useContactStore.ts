import { create } from 'zustand';
import api from '@/lib/axios';

export interface ContactFormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactState {
  fields: ContactFormFields;
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | null;

  setField: (key: keyof ContactFormFields, value: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

const INITIAL_FIELDS: ContactFormFields = {
  name: '',
  email: '',
  subject: 'General Inquiry',
  message: '',
};

export const useContactStore = create<ContactState>((set, get) => ({
  fields: { ...INITIAL_FIELDS },
  isLoading: false,
  isSubmitted: false,
  error: null,

  setField: (key, value) =>
    set((state) => ({ fields: { ...state.fields, [key]: value } })),

  submit: async () => {
    const { fields } = get();
    const { name, email, subject, message } = fields;

    // Basic validation
    if (!name.trim() || name.trim().length < 2) {
      set({ error: 'Please enter your full name (at least 2 characters).' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      set({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      set({ error: 'Please enter a message (at least 10 characters).' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await api.post('/notifications/contact', {
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      set({ isLoading: false, isSubmitted: true });
    } catch {
      set({ isLoading: false, error: 'Something went wrong. Please try again.' });
    }
  },

  reset: () =>
    set({ fields: { ...INITIAL_FIELDS }, isSubmitted: false, error: null, isLoading: false }),
}));
