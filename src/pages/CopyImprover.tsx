import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ContextForm, type ContextData } from '@/components/ContextForm';
import { Suggestions, type Suggestion } from '@/components/Suggestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useCredits } from '@/contexts/CreditsContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { supabase } from "@/integrations/supabase/client";

const MAX_SUGGESTIONS = 15;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { credits, useCredit } = useCredits();

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    toast.success('Image uploaded successfully');
  };

  const parseGeminiResponse = (text: string): Suggestion[] => {
    try {
      const lines = text.split('\n').filter(line => line.trim());
      const jsonLines = lines.filter(line => 
        (line.trim().startsWith('{') && line.trim().endsWith('}')) ||
        (line.trim().startsWith('{') && line.trim().endsWith('},'))
      );

      const parsedSuggestions = jsonLines.map(line => {
        try {
          const cleanLine = line.trim().endsWith(',') 
            ? line.slice(0, -1) 
            : line;
          
          const suggestion = JSON.parse(cleanLine);
          
          if (!suggestion.element || 
              !suggestion.position?.x || 
              !suggestion.position?.y || 
              !suggestion.original || 
              !suggestion.improved || 
              !suggestion.explanation) {
            console.log('Invalid suggestion structure:', suggestion);
            return null;
          }

          return {
            ...suggestion,
            position: {
              x: Math.min(100, Math.max(0, suggestion.position.x)),
              y: Math.min(100, Math.max(0, suggestion.position.y))
            }
          };
        } catch (e) {
          console.log('Failed to parse suggestion line:', line, e);
          return null;
        }
      }).filter((s): s is Suggestion => s !== null);

      console.log('Successfully parsed suggestions:', parsedSuggestions);
      return parsedSuggestions.slice(0, MAX_SUGGESTIONS);
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      return [];
    }
  };

  const analyzeUIWithGemini = async (image: File, context: ContextData) => {
    try {
      if (credits <= 0) {
        setShowCreditsDialog(true);
        return;
      }

      // Check and use a credit before proceeding
      if (!await useCredit()) {
        throw new Error('No credits remaining');
      }

      if (image.size > 4 * 1024 * 1024) {
        throw new Error('Image size must be less than 4MB');
      }

      // Get the API key from Supabase Edge Function
      const { data: { value: apiKey }, error: keyError } = await supabase
        .functions.invoke('get-gemini-key');

      if (keyError || !apiKey) {
        console.error('Error fetching API key:', keyError);
        throw new Error('Failed to get API key');
      }

      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const prompt = `
        Analyze this UI screenshot and provide up to ${MAX_SUGGESTIONS} UX copy improvement suggestions.
        Focus on these key aspects:

        1. CLARITY
        - How effectively does the UI communicate its purpose?
        - Is the language clear, concise, and unambiguous?
        - Are technical terms explained when necessary?

        2. VISUAL HIERARCHY
        - Are elements arranged logically?
        - Does the text sizing and placement guide users naturally?
        - Is important information prominently displayed?

        3. TONE CONSISTENCY
        - Does the copy align with the specified tone: ${context.tone}?
        - Is the emotional goal of ${context.emotionalGoal} effectively achieved?
        - Is the language appropriate for ${context.audience}?

        4. ACCESSIBILITY
        - Is the copy inclusive and welcoming?
        - Are instructions clear and actionable?
        - Is the language simple enough for the target audience?

        5. ACTIONABILITY
        - Are calls-to-action (CTAs) clear and compelling?
        - Do buttons and links clearly indicate their purpose?
        - Is feedback and guidance provided when needed?

        Context:
        - Purpose: ${context.purpose}
        - Target Audience: ${context.audience}
        - Desired Tone: ${context.tone}
        - Emotional Goal: ${context.emotionalGoal}
        - Constraints: ${context.constraints}
        - Additional Details: ${context.additionalDetails}

        For each UI element that needs improvement, provide:
        1. Precise element location (x,y coordinates as percentages of image dimensions)
        2. Element type (e.g., heading, button, label)
        3. Original text content
        4. Improved version that addresses the above aspects
        5. Brief explanation of why the improvement helps

        Format each suggestion as a complete, valid JSON object on a single line:
        {"element": "element type", "position": {"x": number, "y": number}, "original": "original text", "improved": "improved text", "explanation": "brief explanation"}

        Ensure each suggestion is a complete JSON object on its own line.
        All coordinates must be percentages between 0-100.
        Focus on impactful improvements that align with the provided context.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }, {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image.split(',')[1]
                }
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Failed to analyze image'}`);
      }

      const data = await response.json();
      
      if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from API');
      }

      const suggestionsText = data.candidates[0].content.parts[0].text;
      console.log('Raw Gemini response:', suggestionsText);
      
      const parsedSuggestions = parseGeminiResponse(suggestionsText);
      
      if (parsedSuggestions.length === 0) {
        throw new Error('No valid suggestions could be parsed from the response');
      }

      setSuggestions(parsedSuggestions);
      setShowResults(true);
      toast.success(`Analysis complete! Found ${parsedSuggestions.length} suggestions.`);
    } catch (error) {
      console.error('Error analyzing UI:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze UI');
      throw error;
    }
  };

  const handleContextSubmit = async (contextData: ContextData) => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsLoading(true);
    try {
      await analyzeUIWithGemini(uploadedImage, contextData);
    } catch (error) {
      console.error('Error in handleContextSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setShowResults(false);
    setSuggestions([]);
    setUploadedImage(null);
    setImagePreviewUrl(null);
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('UX Copy Improvement Suggestions', 14, 15);
      
      doc.setFontSize(10);
      const timestamp = new Date().toLocaleString();
      doc.text(`Generated on: ${timestamp}`, 14, 25);
      
      const tableData = suggestions.map((suggestion, index) => [
        index + 1,
        suggestion.element,
        suggestion.original,
        suggestion.improved,
        suggestion.explanation
      ]);
      
      autoTable(doc, {
        head: [['#', 'Element', 'Original Text', 'Improved Text', 'Explanation']],
        body: tableData,
        startY: 30,
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 45 },
          3: { cellWidth: 45 },
          4: { cellWidth: 65 }
        },
        headStyles: { fillColor: [41, 37, 36] }
      });
      
      doc.save('ux-copy-improvements.pdf');
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleFeedback = (index: number, isPositive: boolean) => {
    toast.success(isPositive ? 'Thanks for the positive feedback!' : 'Thanks for the feedback. We\'ll improve our suggestions.');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container max-w-6xl py-8">
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold tracking-tight">UX Copy Improver</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Transform your UI text with AI-powered suggestions
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {suggestions.length > 0 ? `${suggestions.length} suggestions generated` : ''}
          </p>
        </div>

        {!showResults ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <ImageUpload onImageUpload={handleImageUpload} />
            <ContextForm onSubmit={handleContextSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8">
              <Button 
                variant="outline" 
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Start Over
              </Button>
              {suggestions.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
            </div>
            <Suggestions 
              suggestions={suggestions} 
              onFeedback={handleFeedback}
              imageUrl={imagePreviewUrl}
            />
            
            {suggestions.length > 0 && (
              <div className="mt-8 rounded-lg border bg-card">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">Improvement Details</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead className="w-32">Element</TableHead>
                        <TableHead>Original Text</TableHead>
                        <TableHead>Improved Text</TableHead>
                        <TableHead className="w-64">Explanation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suggestions.map((suggestion, index) => (
                        <TableRow key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{suggestion.element}</TableCell>
                          <TableCell>{suggestion.original}</TableCell>
                          <TableCell className="font-medium text-primary">
                            {suggestion.improved}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {suggestion.explanation}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}

        <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Unlock 5x More Credits</DialogTitle>
              <DialogDescription className="pt-2">
                You've used all your free credits! Sign up now to get:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>5x more credits to generate content</li>
                  <li>Priority support</li>
                </ul>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowCreditsDialog(false)}>
                Maybe later
              </Button>
              <Button onClick={() => {
                setShowCreditsDialog(false);
                setShowAuthDialog(true);
              }}>
                Sign up
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <AuthDialog 
          open={showAuthDialog} 
          onOpenChange={setShowAuthDialog} 
        />
      </div>
    </div>
  );
};

export default Index;