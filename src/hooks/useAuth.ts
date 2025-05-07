
// src/hooks/useAuth.ts
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Initialize avatar storage bucket if it doesn't exist
import { supabase } from "@/integrations/supabase/client";

// This is executed once when the file is imported
(async function initializeStorage() {
  try {
    // Check if avatars bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    
    if (!avatarBucketExists) {
      // Create the avatars bucket
      await supabase.storage.createBucket('avatars', {
        public: true, // Make it publicly accessible
      });
      
      console.log('Created avatars storage bucket');
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
})();
