import { useState, useEffect } from "react";
import { 
  Eye, 
  Moon, 
  Sun, 
  Type, 
  Palette, 
  Zap, 
  Move, 
  Monitor, 
  MousePointer2, 
  Maximize,
  Check
} from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { cn } from "./ui/utils";

export function AccessibilitySettings() {
  // System Sync
  const [useSystemSettings, setUseSystemSettings] = useState(true);

  // Theme
  const [theme, setTheme] = useState("light");
  
  // Text Size (0: Small, 1: Default, 2: Large, 3: Extra Large)
  const [textSize, setTextSize] = useState([1]);
  
  // Font Style
  const [fontStyle, setFontStyle] = useState("default");
  
  // Color Adjustment
  const [colorMode, setColorMode] = useState("none");
  
  // Motion
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [reduceParallax, setReduceParallax] = useState(false);
  
  // UI Scaling
  const [largeButtons, setLargeButtons] = useState(false);
  const [increaseSpacing, setIncreaseSpacing] = useState(false);

  // Live Preview Text
  const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog.\n\nType here to test readability with your current settings.");

  // Helper to get text size class for preview
  const getPreviewTextSize = () => {
    switch(textSize[0]) {
      case 0: return "text-sm";
      case 1: return "text-base";
      case 2: return "text-lg";
      case 3: return "text-xl";
      default: return "text-base";
    }
  };

  // Helper to get font family for preview
  const getPreviewFont = () => {
    return fontStyle === "dyslexia" ? "font-mono" : "font-sans"; // Using mono as a proxy for dyslexia font in this environment
  };

  // Helper to get color filter for preview (simulated with CSS filters if possible, or just classes)
  const getPreviewColorFilter = () => {
    switch(colorMode) {
      case "protanopia": return "grayscale brightness-110 sepia-50 hue-rotate-[-10deg]"; // Rough simulation
      case "deuteranopia": return "grayscale brightness-110 sepia-50 hue-rotate-[10deg]"; 
      case "tritanopia": return "grayscale brightness-110 sepia-50 hue-rotate-[180deg]";
      case "grayscale": return "grayscale";
      default: return "";
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex-shrink-0 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Accessibility Settings</h1>
          <p className="text-sm text-gray-500">Customize your visual experience to match your needs.</p>
        </div>
        <Button className="bg-[#15803d] hover:bg-[#166534] h-9 text-sm">
          <Check className="h-4 w-4 mr-2" /> Save Preferences
        </Button>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Left Column - Consolidated into 2 Cards to kill the scrollbar */}
        <div className="flex flex-col gap-4 overflow-hidden">
          
          {/* Card 1: Display & Theme */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Palette className="h-4 w-4 text-green-700" />
                Display & Theme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              {/* System Sync */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-sync" className="text-sm">Use System Settings</Label>
                  <p className="text-xs text-gray-500">Follows device light/dark mode</p>
                </div>
                <Switch 
                  id="system-sync" 
                  checked={useSystemSettings} 
                  onCheckedChange={setUseSystemSettings} 
                />
              </div>

              {/* Theme Options */}
              <div className={useSystemSettings ? "opacity-50 pointer-events-none" : ""}>
                <ToggleGroup type="single" value={theme} onValueChange={(val) => val && setTheme(val)} className="justify-start">
                  <ToggleGroupItem value="light" className="gap-1 px-3 text-xs h-8">
                    <Sun className="h-3 w-3" /> Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="gap-1 px-3 text-xs h-8">
                    <Moon className="h-3 w-3" /> Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem value="high-contrast" className="gap-1 px-3 text-xs h-8">
                    <Eye className="h-3 w-3" /> High Contrast
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Color Adjustment */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <Label className="text-sm">Colorblind Mode</Label>
                <Select value={colorMode} onValueChange={setColorMode}>
                  <SelectTrigger className="w-[150px] h-8 text-xs">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Default)</SelectItem>
                    <SelectItem value="protanopia">Protanopia</SelectItem>
                    <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                    <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Interface & Motion */}
          <Card className="flex-shrink-0">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Maximize className="h-4 w-4 text-green-700" />
                Interface & Motion
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {/* Left Side: Motion */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-anim" className="text-xs">Reduce Animations</Label>
                    </div>
                    <Switch id="reduce-anim" checked={reduceAnimations} onCheckedChange={setReduceAnimations} className="scale-90" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduce-parallax" className="text-xs">Reduce Parallax</Label>
                    </div>
                    <Switch id="reduce-parallax" checked={reduceParallax} onCheckedChange={setReduceParallax} className="scale-90" />
                  </div>
                </div>

                {/* Right Side: Scaling */}
                <div className="space-y-4 border-l border-gray-100 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="large-buttons" className="text-xs">Large Buttons</Label>
                    </div>
                    <Switch id="large-buttons" checked={largeButtons} onCheckedChange={setLargeButtons} className="scale-90" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="increase-spacing" className="text-xs">Increase Spacing</Label>
                    </div>
                    <Switch id="increase-spacing" checked={increaseSpacing} onCheckedChange={setIncreaseSpacing} className="scale-90" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Text & Typography */}
        <Card className="flex flex-col overflow-hidden h-full">
          <CardHeader className="pb-2 pt-4 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Type className="h-4 w-4 text-green-700" />
              Text & Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto flex flex-col space-y-5 pt-2 pb-4">
            
            {/* Text Size */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label className="text-sm">Text Size Controls</Label>
                <span className="text-xs font-medium text-green-700">
                  {textSize[0] === 0 && "Small"}
                  {textSize[0] === 1 && "Default"}
                  {textSize[0] === 2 && "Large"}
                  {textSize[0] === 3 && "Extra Large"}
                </span>
              </div>
              <Slider 
                value={textSize} 
                onValueChange={setTextSize} 
                max={3} 
                step={1} 
                className="py-2"
              />
              <div className="flex justify-between text-xs text-gray-500 px-1">
                <span>A</span>
                <span>A</span>
                <span className="font-medium">A</span>
                <span className="text-base font-bold text-gray-800">A</span>
              </div>
            </div>

            {/* Font Style */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <div className="space-y-0.5">
                <Label className="text-sm">Font Style Option</Label>
              </div>
              <Select value={fontStyle} onValueChange={setFontStyle}>
                <SelectTrigger className="w-[150px] h-8 text-xs">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Sans</SelectItem>
                  <SelectItem value="dyslexia">OpenDyslexic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Live Preview Box */}
            <div className="flex-1 min-h-[150px] mt-2 border rounded-lg bg-gray-50 flex flex-col overflow-hidden">
              <div className="bg-gray-100 border-b px-3 py-1.5 flex-shrink-0">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Live Preview</span>
              </div>
              <div className="p-4 flex-1 overflow-auto">
                <Textarea 
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className={cn(
                    "w-full h-full min-h-[120px] bg-transparent border-none p-0 focus-visible:ring-0 resize-none shadow-none",
                    getPreviewTextSize(),
                    getPreviewFont(),
                    theme === "dark" ? "text-gray-100" : "text-gray-900",
                    theme === "high-contrast" ? "text-black font-bold" : "",
                    increaseSpacing ? "leading-loose tracking-wide" : "leading-relaxed",
                    getPreviewColorFilter()
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}