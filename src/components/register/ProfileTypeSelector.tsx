
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileType } from "@/contexts/AuthContext";

interface ProfileTypeSelectorProps {
  profileType: ProfileType;
  onProfileTypeChange: (value: ProfileType) => void;
}

const ProfileTypeSelector = ({ profileType, onProfileTypeChange }: ProfileTypeSelectorProps) => {
  return (
    <Tabs 
      defaultValue={profileType} 
      className="w-full"
      onValueChange={(value) => onProfileTypeChange(value as ProfileType)}
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="importer">Importador</TabsTrigger>
        <TabsTrigger value="broker">Despachante Aduaneiro</TabsTrigger>
      </TabsList>
      
      <TabsContent value="importer">
        {/* Content will be provided by parent */}
      </TabsContent>
      
      <TabsContent value="broker">
        {/* Content will be provided by parent */}
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTypeSelector;
