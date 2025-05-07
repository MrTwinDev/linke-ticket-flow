
import { SupportFAQ } from "@/components/support/SupportFAQ";
import { SupportContact } from "@/components/support/SupportContact";
import { ProfileAccess } from "@/components/support/ProfileAccess";

const Support = () => {
  return (
    <div className="container max-w-4xl py-6">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Suporte</h1>
        <p className="text-muted-foreground">
          Obtenha ajuda e suporte para usar nossa plataforma.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SupportFAQ />
        <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
          <SupportContact />
          <ProfileAccess />
        </div>
      </div>
    </div>
  );
};

export default Support;
