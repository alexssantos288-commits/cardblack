import { UserProfile, defaultProfile } from "@/types/profile";

const STORAGE_KEY = "userProfile";

export const profileService = {
    /**
     * Loads the profile from storage.
     * Returns defaultProfile if nothing is saved.
     */
    getProfile: (): UserProfile => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
        return defaultProfile;
    },

    /**
     * Saves the profile to storage.
     */
    saveProfile: (profile: UserProfile): void => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        } catch (error) {
            console.error("Failed to save profile:", error);
            throw new Error("Não foi possível salvar o perfil localmente.");
        }
    },

    /**
     * Simulates publishing the profile.
     * In the future, this will involve updating a 'public' flag or status.
     */
    publishProfile: async (profile: UserProfile): Promise<void> => {
        // Current simulation just saves it
        profileService.saveProfile(profile);
        // Add artificial delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));
    }
};
