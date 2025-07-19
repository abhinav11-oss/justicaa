import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Languages } from "lucide-react";

const languages = [
  { code: 'hi', name: 'Hindi' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'en', name: 'English' },
];

export const DocumentTranslation = () => {
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!text.trim()) {
      toast({ title: "Please paste the text to translate.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setTranslation("");
    try {
      const targetLangName = languages.find(l => l.code === targetLang)?.name;
      const prompt = `Translate the following text to ${targetLangName}:\n\n${text}`;
      const { data, error } = await supabase.functions.invoke('ai-legal-chat-hf', {
        body: { message: prompt }
      });
      if (error) throw error;
      setTranslation(data.response);
    } catch (error) {
      console.error("Error translating document:", error);
      toast({ title: "Translation failed.", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Languages className="h-5 w-5 mr-2" />
          Document Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste text to translate here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-48"
          disabled={isLoading}
        />
        <div className="flex items-center gap-4">
          <Select value={targetLang} onValueChange={setTargetLang}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleTranslate} disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Translate
          </Button>
        </div>
        {translation && (
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Translation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{translation}</p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};