import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Loader2 } from "lucide-react";
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
  const [groupedArticles, setGroupedArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('constitution_articles')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;
        
        if (data) {
          const grouped = data.reduce((acc, article) => {
            const title = article.title || "Uncategorized";
            if (!acc[title]) {
              acc[title] = [];
            }
            acc[title].push(article);
            return acc;
          }, {} as Record<string, Article[]>);
          setGroupedArticles(grouped);
        } else {
          setGroupedArticles({});
          toast({ title: "No articles found", description: "Could not load the Constitution articles." });
        }

      } catch (error: any) {
        toast({ title: "Failed to load articles", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">Constitution of India Explorer</h3>
        <p className="text-muted-foreground">Browse through the articles and parts of the Indian Constitution.</p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading the Constitution...</p>
        </div>
      )}

      {!loading && Object.keys(groupedArticles).length === 0 && (
         <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4" />
            <p>No Constitution articles found.</p>
            <p className="text-sm">It seems there are no articles in the database at this time.</p>
          </div>
      )}

      {!loading && Object.keys(groupedArticles).length > 0 && (
        <div className="space-y-4">
          {Object.entries(groupedArticles).map(([partTitle, articles]) => (
            <Card key={partTitle}>
              <CardHeader>
                <CardTitle>{partTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full space-y-2">
                  {articles.map(result => (
                    <AccordionItem key={result.id} value={String(result.id)}>
                      <AccordionTrigger className="text-left font-semibold p-3 hover:bg-muted/50 rounded-md">
                        Article {result.article_number}: {result.article_title}
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 px-3">
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
          ))}
        </div>
      )}
    </div>
  );
};