import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanText, Wrench } from "lucide-react";

export const ImageToText = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ScanText className="h-5 w-5 mr-2" />
          Image to Text (OCR)
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-12">
        <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold">Feature Coming Soon!</h3>
        <p className="text-muted-foreground mt-2">
          Our team is hard at work developing Optical Character Recognition (OCR) technology to allow you to extract text from images and scanned documents.
        </p>
        <p className="text-muted-foreground mt-2">
          Stay tuned for updates!
        </p>
      </CardContent>
    </Card>
  );
};