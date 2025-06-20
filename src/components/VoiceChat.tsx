
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceChatProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

export const VoiceChat = ({ onTranscript, isListening, onListeningChange }: VoiceChatProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAudioSupported(false);
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      onListeningChange(true);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onListeningChange(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Send to speech-to-text API
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      
      if (data.text && data.text.trim()) {
        onTranscript(data.text.trim());
      }
      
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Voice Processing Error",
        description: "Failed to process voice input. Please try again.",
        variant: "destructive"
      });
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: 'alloy' // Default voice
        }
      });
      
      if (error) throw error;
      
      // Play the audio
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!audioSupported) {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <MicOff className="h-4 w-4" />
        <span className="text-sm">Voice not supported</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={isRecording ? "destructive" : "outline"}
        size="sm"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isSpeaking}
        className="flex items-center space-x-2"
      >
        {isRecording ? (
          <>
            <MicOff className="h-4 w-4" />
            <span className="hidden md:inline">Stop</span>
          </>
        ) : (
          <>
            <Mic className="h-4 w-4" />
            <span className="hidden md:inline">Voice</span>
          </>
        )}
      </Button>
      
      {isSpeaking && (
        <div className="flex items-center space-x-1 text-primary">
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span className="text-sm hidden md:inline">Speaking...</span>
        </div>
      )}
    </div>
  );
};

// Export speakText function for use in other components
export const useSpeakText = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text,
          voice: 'alloy'
        }
      });
      
      if (error) throw error;
      
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Failed to generate speech.",
        variant: "destructive"
      });
    }
  };

  return { speakText, isSpeaking };
};
