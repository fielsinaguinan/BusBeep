import { useState, useRef } from "react";
import { 
  Megaphone, 
  Image as ImageIcon, 
  Send, 
  Trash2, 
  Edit, 
  MoreHorizontal,
  Plus,
  History,
  Clock,
  User as UserIcon,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface NewsPost {
  id: string;
  title: string;
  category: string;
  date: string;
  status: "Draft" | "Published";
  author: string;
  hasImage: boolean;
}

const mockPosts: NewsPost[] = [
  {
    id: "1",
    title: "New Fare Matrix Implementation",
    category: "Operations",
    date: "2026-02-20",
    status: "Published",
    author: "Admin",
    hasImage: true
  },
  {
    id: "2",
    title: "Driver Safety Seminar Schedule",
    category: "HR",
    date: "2026-02-25",
    status: "Draft",
    author: "HR Manager",
    hasImage: false
  },
  {
    id: "3",
    title: "Maintenance Downtime Alert",
    category: "Maintenance",
    date: "2026-02-22",
    status: "Published",
    author: "Fleet Mgr",
    hasImage: true
  }
];

export function NewsAnnouncementsPage() {
  const [posts, setPosts] = useState<NewsPost[]>(mockPosts);
  
  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      // Create a temporary URL for preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePublish = () => {
    if (!title || !category || !date) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPost: NewsPost = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        category,
        date,
        status: "Published",
        author: "Terminal Master",
        hasImage: !!selectedImage
      };
      
      setPosts([newPost, ...posts]);
      setIsSubmitting(false);
      toast.success("Announcement published successfully.");
      
      // Reset form
      setTitle("");
      setBody("");
      setCategory("");
      setDate("");
      removeImage();
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
    toast.success("Post deleted.");
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Operations": "bg-blue-100 text-blue-700 border-blue-200",
      "HR": "bg-purple-100 text-purple-700 border-purple-200",
      "Maintenance": "bg-orange-100 text-orange-700 border-orange-200",
      "General": "bg-gray-100 text-gray-700 border-gray-200",
      "Urgent": "bg-red-100 text-red-700 border-red-200"
    };
    return colors[category] || colors["General"];
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-3 flex-shrink-0">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-600 rounded-lg shadow-sm">
            <Megaphone className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">News & Announcements</h1>
            <p className="text-sm text-gray-600">
              Create and manage company-wide announcements that sync instantly to the mobile app.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 flex-shrink-0">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{posts.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Megaphone className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {posts.filter(p => p.status === "Published").length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {posts.filter(p => p.status === "Draft").length}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Edit className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 overflow-hidden">
        
        {/* Left Column - Create New Post */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Post
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pt-2 pb-3 pr-1">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs font-semibold">
                  Announcement Title <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Schedule Changes for Holy Week" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-xs font-semibold">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="HR">Human Resources</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Urgent">Urgent Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="date" className="text-xs font-semibold">
                    Visibility Date <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="body" className="text-xs font-semibold">
                  Content
                </Label>
                {/* Reduced height slightly to accommodate the image uploader */}
                <Textarea 
                  id="body" 
                  placeholder="Write your announcement details here..." 
                  className="min-h-[80px] resize-none text-sm"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    {body.length} characters
                  </p>
                </div>
              </div>

              {/* NEW: Compact Image Upload Section */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Attach Media (Optional)</Label>
                
                {imagePreview ? (
                  <div className="relative h-20 w-full rounded-md border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-full max-w-full object-contain"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-1 right-1 h-6 w-6 rounded-full"
                      onClick={removeImage}
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-md p-3 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                    <input
                      type="file"
                      id="image-upload"
                      ref={fileInputRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <ImageIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">Click to upload photo</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2 h-9 text-sm"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Manage Posts */}
        <Card className="flex flex-col overflow-hidden">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              Manage Posts ({posts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto pt-2">
            {posts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Megaphone className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No posts yet</p>
                <p className="text-xs text-gray-500 mt-1">Create your first announcement</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead className="py-2 text-xs bg-white w-[40%]">Title</TableHead>
                      <TableHead className="py-2 text-xs bg-white">Category</TableHead>
                      <TableHead className="py-2 text-xs bg-white">Status</TableHead>
                      <TableHead className="text-right py-2 text-xs bg-white">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="py-2">
                          <div className="text-xs font-semibold text-gray-900 flex items-center gap-1.5">
                            {post.hasImage && <ImageIcon className="h-3 w-3 text-blue-500 flex-shrink-0" title="Has attached image" />}
                            <span className="truncate">{post.title}</span>
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-1">
                            <span className="flex items-center gap-0.5"><UserIcon className="h-2.5 w-2.5" />{post.author}</span>
                            <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{post.date}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getCategoryColor(post.category)}`}>
                            {post.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2">
                          <Badge
                            variant={post.status === "Published" ? "default" : "secondary"}
                            className={`text-[10px] px-1.5 py-0 ${
                              post.status === "Published"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-orange-100 text-orange-700 border-orange-200"
                            }`}
                          >
                            {post.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right py-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2 text-xs">
                                <Edit className="h-3 w-3" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2 text-xs text-red-600"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}