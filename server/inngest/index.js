// 1. تعديل إيفنت الإنشاء
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    event: "user.created", // شلنا clerk/
  },
  async ({ event }) => {
    // باقي الكود زي ما هو
  },
);

// 2. تعديل إيفنت التحديث
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    event: "user.updated", // شلنا clerk/
  },
  async ({ event }) => {
    // باقي الكود زي ما هو
  },
);

// 3. تعديل إيفنت الحذف
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    event: "user.deleted", // شلنا clerk/
  },
  async ({ event }) => {
    // باقي الكود زي ما هو
  },
);
