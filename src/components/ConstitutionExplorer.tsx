import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: number;
  title: string;
  article_number: string;
  article_title: string;
  description: string;
}

export const ConstitutionExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      toast({ title: "Please enter a search query.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const { data, error } = await supabase
        .from('constitution_articles')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,article_title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,article_number.ilike.%${searchQuery}%`)
        .limit(50);

      if (error) throw error;
      
      if (data) {
        setResults(data);
      } else {
        setResults([]);
        toast({ title: "No results found", description: "The search returned no matching documents." });
      }

    } catch (error: any) {
      toast({ title: "Search Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Constitution of India Explorer</h3>
        <p className="text-muted-foreground">Search through the articles and parts of the Indian Constitution.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for articles, e.g., 'Article 21' or 'fundamental rights'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Searching the Constitution...</p>
        </div>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.length} matching articles.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-2">
              {results.map(result => (
                <AccordionItem key={result.id} value={String(result.id)}>
                  <AccordionTrigger className="text-left font-semibold p-3 hover:bg-muted/50 rounded-md">
                    Article {result.article_number}: {result.article_title}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">{result.title}</p>
                    <div 
                      className="text-foreground prose prose-sm dark:prose-invert max-w-none" 
                    >
                      {result.description}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {!loading && results.length === 0 && (
         <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <p>The Constitution of India at your fingertips.</p>
            <p className="text-sm">Enter a query to search for articles, parts, and schedules.</p>
          </div>
      )}
    </div>
  );
};