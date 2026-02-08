import { create } from 'zustand';

export interface Contact {
    email: string;
    name?: string;
    company?: string;
    role?: string;
    [key: string]: string | undefined;
}

interface CampaignState {
    step: number;
    file: File | null;
    contacts: Contact[];
    templateId: string | null;
    campaignName: string;

    setStep: (step: number) => void;
    setFile: (file: File | null) => void;
    setContacts: (contacts: Contact[]) => void;
    setTemplateId: (id: string | null) => void;
    setCampaignName: (name: string) => void;
    reset: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
    step: 1,
    file: null,
    contacts: [],
    templateId: null,
    campaignName: "",

    setStep: (step) => set({ step }),
    setFile: (file) => set({ file }),
    setContacts: (contacts) => set({ contacts }),
    setTemplateId: (templateId) => set({ templateId }),
    setCampaignName: (campaignName) => set({ campaignName }),
    reset: () => set({ step: 1, file: null, contacts: [], templateId: null, campaignName: "" }),
}));
