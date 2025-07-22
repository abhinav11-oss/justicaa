import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MoreVertical, PlusCircle, Trash2, CalendarIcon, Briefcase, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const matterSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  matter_type: z.string().min(1, "Please select a matter type"),
  description: z.string().optional(),
  status: z.string().default("active"),
  priority: z.string().default("medium"),
  deadline_date: z.date().optional(),
});

type MatterFormValues = z.infer<typeof matterSchema>;

interface Matter {
  id: string;
  title: string;
  matter_type: string;
  status: string;
  priority: string;
  deadline_date: string | null;
  created_at: string;
}

export const LegalMattersManager = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [matters, setMatters] = useState<Matter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<MatterFormValues>({
    resolver: zodResolver(matterSchema),
    defaultValues: {
      title: "",
      matter_type: "",
      description: "",
      status: "active",
      priority: "medium",
    },
  });

  const fetchMatters = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("legal_matters")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMatters(data || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch legal matters.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatters();
  }, [user]);

  const onSubmit = async (values: MatterFormValues) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("legal_matters").insert({
        ...values,
        user_id: user.id,
        deadline_date: values.deadline_date ? format(values.deadline_date, "yyyy-MM-dd") : null,
      });
      if (error) throw error;
      toast({ title: "Success", description: "Legal matter added successfully." });
      fetchMatters();
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add legal matter.", variant: "destructive" });
    }
  };

  const deleteMatter = async (id: string) => {
    try {
      const { error } = await supabase.from("legal_matters").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Success", description: "Legal matter deleted." });
      fetchMatters();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete legal matter.", variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Case Tracker & Deadline Manager</CardTitle>
            <CardDescription>Manage all your legal matters in one place.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="h-4 w-4 mr-2" />Add New Matter</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add a New Legal Matter</DialogTitle>
                <DialogDescription>Enter the details of your case or legal task.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Property Dispute Case" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="matter_type" render={({ field }) => (
                    <FormItem><FormLabel>Matter Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="litigation">Litigation</SelectItem><SelectItem value="documentation">Documentation</SelectItem><SelectItem value="consultation">Consultation</SelectItem><SelectItem value="compliance">Compliance</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Add a brief description..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="priority" render={({ field }) => (
                      <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="deadline_date" render={({ field }) => (
                      <FormItem className="flex flex-col"><FormLabel>Deadline</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}</Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Matter
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading matters...</div>
          ) : matters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4" />
              <p>You have no active legal matters.</p>
              <p className="text-sm">Click "Add New Matter" to get started.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto horizontal-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matters.map((matter) => (
                    <TableRow key={matter.id}>
                      <TableCell className="font-medium">{matter.title}</TableCell>
                      <TableCell><Badge variant="outline">{matter.matter_type}</Badge></TableCell>
                      <TableCell><Badge className={getStatusBadge(matter.status)}>{matter.status}</Badge></TableCell>
                      <TableCell><span className={getPriorityBadge(matter.priority)}>{matter.priority}</span></TableCell>
                      <TableCell>{matter.deadline_date ? format(new Date(matter.deadline_date), "PPP") : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteMatter(matter.id)}><Trash2 className="h-4 w-4" /></Button>
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
  );
};