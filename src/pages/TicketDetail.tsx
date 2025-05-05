
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth, ProfileType } from "@/contexts/AuthContext";
import { Paperclip, Star, Calendar, Clock, Send, ArrowLeft, User, Mail, Phone } from "lucide-react";

interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

interface Message {
  id: string;
  content: string;
  isImportant: boolean;
  sentAt: string;
  sender: {
    id: string;
    name: string;
    profileType: ProfileType;
  };
  attachments: Attachment[];
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileType: ProfileType;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  pendingEditApproval: boolean;
  broker: User;
  importer: User;
  messages: Message[];
  attachments: Attachment[];
}

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profileType } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // For broker only: status change
  const [ticketStatus, setTicketStatus] = useState<string>("");

  useEffect(() => {
    // Simulate fetching ticket details from API
    setTimeout(() => {
      const mockUser: User = {
        id: "i1",
        name: "Import Company Ltd",
        email: "contact@importcompany.com",
        phone: "(11) 98765-4321",
        profileType: "importer"
      };
      
      const mockBroker: User = {
        id: "b1",
        name: "Jane Smith",
        email: "jane.smith@customs.com",
        phone: "(11) 91234-5678",
        profileType: "broker"
      };
      
      const mockTicket: Ticket = {
        id: "1",
        title: "Import clearance for machinery parts",
        description: "We need customs clearance for industrial machinery parts arriving from Germany. The shipment is expected to arrive at Santos port on May 10th, 2025. Please help us prepare all the necessary documentation.",
        status: "in_progress",
        createdAt: "2025-04-30T10:30:00",
        updatedAt: "2025-05-02T14:15:00",
        pendingEditApproval: false,
        importer: mockUser,
        broker: mockBroker,
        attachments: [
          {
            id: "a1",
            fileName: "invoice.pdf",
            fileType: "PDF",
            fileSize: 1024000,
            fileUrl: "#",
            uploadedAt: "2025-04-30T10:30:00"
          },
          {
            id: "a2",
            fileName: "shipping_details.pdf",
            fileType: "PDF",
            fileSize: 1548000,
            fileUrl: "#",
            uploadedAt: "2025-04-30T10:30:00"
          }
        ],
        messages: [
          {
            id: "m1",
            content: "I'm creating this ticket to request assistance with customs clearance for our machinery parts shipment from Germany. I've attached the invoice and shipping details.",
            isImportant: false,
            sentAt: "2025-04-30T10:30:00",
            sender: mockUser,
            attachments: [
              {
                id: "a1",
                fileName: "invoice.pdf",
                fileType: "PDF",
                fileSize: 1024000,
                fileUrl: "#",
                uploadedAt: "2025-04-30T10:30:00"
              },
              {
                id: "a2",
                fileName: "shipping_details.pdf",
                fileType: "PDF",
                fileSize: 1548000,
                fileUrl: "#",
                uploadedAt: "2025-04-30T10:30:00"
              }
            ]
          },
          {
            id: "m2",
            content: "Thank you for your request. I've received the documents and will start processing them. I'll need the Bill of Lading as well to proceed with the customs clearance process.",
            isImportant: true,
            sentAt: "2025-04-30T14:45:00",
            sender: mockBroker,
            attachments: []
          },
          {
            id: "m3",
            content: "I've attached the Bill of Lading as requested. Please let me know if you need any other documents.",
            isImportant: false,
            sentAt: "2025-05-01T09:20:00",
            sender: mockUser,
            attachments: [
              {
                id: "a3",
                fileName: "bill_of_lading.pdf",
                fileType: "PDF",
                fileSize: 890000,
                fileUrl: "#",
                uploadedAt: "2025-05-01T09:20:00"
              }
            ]
          },
          {
            id: "m4",
            content: "I've started processing the customs clearance. I've found an issue with the HS code classification for some parts. Can you confirm if these are new or used machinery parts?",
            isImportant: true,
            sentAt: "2025-05-01T15:30:00",
            sender: mockBroker,
            attachments: []
          },
          {
            id: "m5",
            content: "These are all new machinery parts, not used or refurbished. Let me know if you need any manufacturer certificates to confirm this.",
            isImportant: false,
            sentAt: "2025-05-02T08:45:00",
            sender: mockUser,
            attachments: []
          },
          {
            id: "m6",
            content: "Thank you for confirming. I've updated the HS code classification. I'm now proceeding with the import declaration. I'll keep you updated on the progress.",
            isImportant: false,
            sentAt: "2025-05-02T14:15:00",
            sender: mockBroker,
            attachments: []
          }
        ]
      };
      
      setTicket(mockTicket);
      setTicketStatus(mockTicket.status);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ticket?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    setIsSendingMessage(true);
    
    // Simulate sending message to API
    setTimeout(() => {
      if (ticket) {
        const now = new Date().toISOString();
        const newMessageObj: Message = {
          id: `m${ticket.messages.length + 1}`,
          content: newMessage,
          isImportant: false,
          sentAt: now,
          sender: {
            id: profileType === "importer" ? ticket.importer.id : ticket.broker.id,
            name: profileType === "importer" ? ticket.importer.name : ticket.broker.name,
            profileType: profileType
          },
          attachments: []
        };
        
        const updatedTicket = {
          ...ticket,
          messages: [...ticket.messages, newMessageObj],
          updatedAt: now
        };
        
        setTicket(updatedTicket);
        setNewMessage("");
        setIsSendingMessage(false);
        
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
      }
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFiles) return;
    
    // Simulate file upload
    toast({
      title: "Uploading files",
      description: `Uploading ${selectedFiles.length} file(s)...`,
    });
    
    // Reset file input
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleStatusChange = (status: string) => {
    setTicketStatus(status);
    
    // Simulate updating ticket status
    toast({
      title: "Status updated",
      description: `Ticket status updated to ${formatStatus(status)}.`,
    });
    
    if (ticket) {
      setTicket({
        ...ticket,
        status: status as "open" | "in_progress" | "completed" | "cancelled",
        updatedAt: new Date().toISOString()
      });
    }
  };

  const toggleImportant = (messageId: string) => {
    if (!ticket) return;
    
    const updatedMessages = ticket.messages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isImportant: !msg.isImportant };
      }
      return msg;
    });
    
    setTicket({
      ...ticket,
      messages: updatedMessages
    });
    
    toast({
      title: "Message updated",
      description: "Message importance flag updated.",
    });
  };

  // Helper function to format status text
  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Helper function to get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "open":
        return "status-open";
      case "in_progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkeblue-600"></div>
        <p className="ml-4 text-gray-600">Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
        <p className="text-gray-600 mb-6">The ticket you're looking for doesn't exist or has been removed.</p>
        <Link to="/dashboard/tickets">
          <Button variant="outline">Back to Tickets</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/dashboard/tickets" className="mr-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClass(ticket.status)}`}>
                {formatStatus(ticket.status)}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                Created {formatDate(ticket.createdAt)}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                <Clock size={14} className="mr-1" />
                Updated {formatDate(ticket.updatedAt)}
              </span>
            </div>
          </div>
        </div>
        
        {profileType === "broker" && (
          <div className="w-full sm:w-auto">
            <Select
              value={ticketStatus}
              onValueChange={handleStatusChange}
              disabled={ticket.status === "completed" || ticket.status === "cancelled"}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Change Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content: Messages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
              
              {ticket.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {ticket.attachments.map(attachment => (
                      <div 
                        key={attachment.id}
                        className="flex items-center p-2 border border-gray-200 rounded-md"
                      >
                        <Paperclip size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm font-medium">{attachment.fileName}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({formatFileSize(attachment.fileSize)})
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 max-h-[600px] overflow-y-auto p-1">
                {ticket.messages.map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender.profileType === profileType ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender.profileType === profileType 
                          ? "bg-linkeblue-600 text-white" 
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{message.sender.name}</span>
                        <div className="flex items-center ml-2">
                          <button 
                            onClick={() => toggleImportant(message.id)}
                            className={`text-${message.sender.profileType === profileType ? "white" : "gray-500"} hover:${message.sender.profileType === profileType ? "text-yellow-200" : "text-yellow-400"} ${message.isImportant ? message.sender.profileType === profileType ? "text-yellow-200" : "text-yellow-500" : ""}`}
                          >
                            <Star size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="whitespace-pre-line">{message.content}</p>
                      
                      {message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map(attachment => (
                            <div 
                              key={attachment.id}
                              className={`flex items-center p-2 rounded-md ${
                                message.sender.profileType === profileType 
                                  ? "bg-linkeblue-700" 
                                  : "bg-gray-200"
                              }`}
                            >
                              <Paperclip size={14} className="mr-2" />
                              <span className="text-sm">{attachment.fileName}</span>
                              <span className="text-xs opacity-75 ml-2">
                                ({formatFileSize(attachment.fileSize)})
                              </span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`ml-auto ${
                                  message.sender.profileType === profileType 
                                    ? "text-white hover:bg-linkeblue-800" 
                                    : "text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className={`text-xs mt-2 ${message.sender.profileType === profileType ? "text-linkeblue-100" : "text-gray-500"}`}>
                        {formatTime(message.sentAt)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* New message input */}
              {(ticket.status === "open" || ticket.status === "in_progress") && (
                <div className="mt-6 space-y-4">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[100px]"
                  />
                  
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        multiple
                      />
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip size={16} className="mr-2" />
                        {selectedFiles ? `${selectedFiles.length} file(s) selected` : "Attach Files"}
                      </Button>
                      
                      {selectedFiles && selectedFiles.length > 0 && (
                        <Button 
                          variant="ghost" 
                          type="button"
                          onClick={handleFileUpload}
                          className="ml-2"
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                    
                    <Button 
                      type="button"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isSendingMessage}
                    >
                      {isSendingMessage ? "Sending..." : (
                        <>
                          <Send size={16} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {(ticket.status === "completed" || ticket.status === "cancelled") && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                  <p className="text-gray-600">
                    This ticket is {ticket.status}. You can no longer send messages.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar: Ticket Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Importer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Importer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900">{ticket.importer.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <a href={`mailto:${ticket.importer.email}`} className="text-linkeblue-600 hover:underline">
                    {ticket.importer.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <a href={`tel:${ticket.importer.phone}`} className="text-linkeblue-600 hover:underline">
                    {ticket.importer.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Broker Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customs Broker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="mr-2 text-gray-500" />
                  <span className="text-gray-900">{ticket.broker.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 text-gray-500" />
                  <a href={`mailto:${ticket.broker.email}`} className="text-linkeblue-600 hover:underline">
                    {ticket.broker.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-2 text-gray-500" />
                  <a href={`tel:${ticket.broker.phone}`} className="text-linkeblue-600 hover:underline">
                    {ticket.broker.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="min-w-[100px] text-xs text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </div>
                  <div className="text-sm text-gray-700">
                    Ticket created by {ticket.importer.name}
                  </div>
                </div>
                
                {ticket.messages.length > 0 && (
                  <div className="flex items-start">
                    <div className="min-w-[100px] text-xs text-gray-500">
                      {formatDate(ticket.messages[ticket.messages.length - 1].sentAt)}
                    </div>
                    <div className="text-sm text-gray-700">
                      Last message by {ticket.messages[ticket.messages.length - 1].sender.name}
                    </div>
                  </div>
                )}
                
                {ticket.status !== "open" && (
                  <div className="flex items-start">
                    <div className="min-w-[100px] text-xs text-gray-500">
                      {formatDate(ticket.updatedAt)}
                    </div>
                    <div className="text-sm text-gray-700">
                      Status changed to {formatStatus(ticket.status)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
