import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Gavel, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LawResult {
  tid: string;
  title: string;
  url: string;
  docfragment: string; // This seems to be the description field from the API
}

export const IndianLawsExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<LawResult[]>([]);
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
      const { data, error } = await supabase.functions.invoke('ikanoon-laws', {
        body: { query: searchQuery },
      });

      if (error) throw error;
      
      // The API response seems to have a 'docs' array
      if (data.docs && Array.isArray(data.docs)) {
        setResults(data.docs);
      } else {
        setResults([]);
        toast({ title: "No results found or unexpected API response." });
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
        <h3 className="text-2xl font-bold text-foreground mb-2">Indian Laws Explorer</h3>
        <p className="text-muted-foreground">Search the comprehensive Indian legal database powered by iKanoon.</p>
      </div>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search for laws, sections, or legal topics..."
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
          <p className="mt-2 text-muted-foreground">Searching the legal archives...</p>
        </div>
      )}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Found {results.length} matching documents.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-2">
              {results.map(result => (
                <AccordionItem key={result.tid} value={result.tid}>
                  <AccordionTrigger className="text-left font-semibold p-3 hover:bg-muted/50 rounded-md">
                    <div dangerouslySetInnerHTML={{ __html: result.title }} />
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 px-3">
                    <div 
                      className="text-muted-foreground mb-4 prose prose-sm dark:prose-invert max-w-none" 
                      dangerouslySetInnerHTML={{ __html: result.docfragment }} 
                    />
                    <Button asChild variant="outline" size="sm">
                      <a href={`https://indiankanoon.org${result.url}`} target="_blank" rel="noopener noreferrer">
                        Read Full Document <ExternalLink className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {!loading && results.length === 0 && (
         <div className="text-center py-12 text-muted-foreground">
            <Gavel className="h-12 w-12 mx-auto mb-4" />
            <p>Your legal knowledge base at your fingertips.</p>
            <p className="text-sm">Enter a query to search for laws, acts, and legal documents.</p>
          </div>
      )}
    </div>
  );
};