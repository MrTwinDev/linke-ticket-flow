
// src/integrations/supabase/storage-init.ts
import { supabase } from "@/integrations/supabase/client";

// Initialize avatar storage bucket if it doesn't exist
export const initializeAvatarStorage = async () => {
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
};

// This is executed once when the file is imported
(async function() {
  await initializeAvatarStorage();
})();
