
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Paperclip, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Broker {
  id: string;
  name: string;
}

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

const CreateTicket = () => {
  const { profileType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBrokerId, setSelectedBrokerId] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not an importer
  useEffect(() => {
    if (profileType !== "importer") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "Only importers can create tickets.",
      });
      navigate("/dashboard");
    }
  }, [profileType, navigate, toast]);

  // Fetch brokers list (simulated)
  useEffect(() => {
    // Simulate API call to fetch brokers
    setTimeout(() => {
      const mockBrokers: Broker[] = [
        { id: "b1", name: "Jane Smith" },
        { id: "b2", name: "John Doe" },
        { id: "b3", name: "Robert Johnson" },
      ];
      setBrokers(mockBrokers);
    }, 500);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles: FileWithPreview[] = Array.from(e.target.files).map(file => ({
      ...file,
      id: crypto.randomUUID(),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset input value so we can select the same file again if needed
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const filteredFiles = prev.filter(file => file.id !== id);
      const fileToRemove = prev.find(file => file.id === id);
      
      // Revoke object URL if it's an image
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      
      return filteredFiles;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!selectedBrokerId) {
      newErrors.broker = "Please select a broker";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call to create ticket
    setTimeout(() => {
      toast({
        title: "Ticket created",
        description: "Your ticket has been created successfully.",
      });
      
      setIsSubmitting(false);
      navigate("/dashboard/tickets");
    }, 1500);
  };

  // Get file icon based on file type
  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return "📄";
      case 'doc':
      case 'docx':
        return "📝";
      case 'jpg':
      case 'jpeg':
      case 'png':
        return "🖼️";
      default:
        return "📎";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link to="/dashboard/tickets" className="mr-2">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`mt-1 ${errors.title ? "border-red-500" : ""}`}
                placeholder="Brief title for your request"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
                Detailed Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`mt-1 min-h-[150px] ${errors.description ? "border-red-500" : ""}`}
                placeholder="Provide detailed information about your request"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="broker" className={errors.broker ? "text-red-500" : ""}>
                Select Broker
              </Label>
              <Select 
                value={selectedBrokerId} 
                onValueChange={setSelectedBrokerId}
              >
                <SelectTrigger 
                  id="broker" 
                  className={`mt-1 ${errors.broker ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select a customs broker" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map(broker => (
                    <SelectItem key={broker.id} value={broker.id}>
                      {broker.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.broker && (
                <p className="text-red-500 text-xs mt-1">{errors.broker}</p>
              )}
            </div>
            
            <div>
              <Label>Attachments</Label>
              <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Click to upload files, or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, JPG, PNG, DOCX (Max size: 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                />
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map(file => (
                    <div key={file.id} className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                      <span className="mr-2">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-200"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="pt-4 flex justify-end space-x-3">
              <Link to="/dashboard/tickets">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
