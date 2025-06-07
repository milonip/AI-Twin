import { useState, useRef } from "react";
import { Mic, Square, Play, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface VoiceRecordingPanelProps {
  onVoiceProcessed: (transcription: string) => void;
  isProcessing: boolean;
}

export default function VoiceRecordingPanel({ onVoiceProcessed, isProcessing }: VoiceRecordingPanelProps) {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'transcribed'>('idle');
  const [transcription, setTranscription] = useState<string>("");
  const [voiceAnalysis, setVoiceAnalysis] = useState<any>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);

  const { startRecording, stopRecording, isRecording } = useAudioRecorder({
    onRecordingComplete: (audioBlob) => {
      setLastAudioBlob(audioBlob);
    }
  });

  const { startListening, stopListening, transcript, isListening, resetTranscript } = useSpeechRecognition({
    onResult: (result) => {
      setTranscription(result);
      setRecordingState('transcribed');
      onVoiceProcessed(result);
    }
  });

  const handleToggleRecording = async () => {
    if (recordingState === 'idle') {
      setRecordingState('recording');
      startRecording();
      startListening();
    } else if (recordingState === 'recording') {
      setRecordingState('processing');
      stopRecording();
      stopListening();
      
      // Wait a moment for speech recognition to finalize
      setTimeout(() => {
        if (transcript) {
          setTranscription(transcript);
          setRecordingState('transcribed');
          onVoiceProcessed(transcript);
        } else {
          setRecordingState('idle');
        }
      }, 1000);
    }
  };

  const handlePlayLast = () => {
    if (lastAudioBlob) {
      const audioUrl = URL.createObjectURL(lastAudioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const handleClear = () => {
    setRecordingState('idle');
    setTranscription("");
    setVoiceAnalysis(null);
    setLastAudioBlob(null);
    resetTranscript();
  };

  const getStatusText = () => {
    switch (recordingState) {
      case 'recording': return 'Recording... Tap to stop';
      case 'processing': return 'Processing your voice...';
      case 'transcribed': return 'Ready for next recording';
      default: return 'Ready to record';
    }
  };

  const getButtonIcon = () => {
    if (isProcessing) return <Loader2 className="animate-spin" size={24} />;
    if (recordingState === 'recording') return <Square size={24} />;
    if (recordingState === 'processing') return <Loader2 className="animate-spin" size={24} />;
    return <Mic size={24} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      {/* Recording Status */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full">
          <div className={`w-2 h-2 rounded-full ${
            recordingState === 'recording' ? 'bg-red-500 animate-pulse' : 
            recordingState === 'processing' || isProcessing ? 'bg-yellow-500 animate-pulse' : 
            'bg-gray-400'
          }`}></div>
          <span className="text-sm text-gray-600">{getStatusText()}</span>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="flex items-center justify-center space-x-1 mb-8 h-16">
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-150 ${
              recordingState === 'recording' 
                ? 'bg-gradient-to-t from-primary to-secondary animate-pulse' 
                : 'bg-gray-300'
            }`}
            style={{
              height: recordingState === 'recording' 
                ? `${Math.random() * 40 + 16}px`
                : '16px',
              animationDelay: `${i * 100}ms`
            }}
          />
        ))}
      </div>

      {/* Main Recording Button */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {recordingState === 'recording' && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
          
          <Button
            onClick={handleToggleRecording}
            disabled={isProcessing}
            className="relative w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {getButtonIcon()}
          </Button>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        <Button
          variant="ghost"
          onClick={handlePlayLast}
          disabled={!lastAudioBlob}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <Play size={16} />
          <span className="text-sm">Play Last</span>
        </Button>
        <Button
          variant="ghost"
          onClick={handleClear}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={16} />
          <span className="text-sm">Clear</span>
        </Button>
      </div>

      {/* Processing Status */}
      {(isProcessing || recordingState === 'processing') && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
            <Loader2 className="w-4 h-4 text-yellow-600 animate-spin" />
            <span className="text-sm text-yellow-600">Analyzing your voice...</span>
          </div>
        </div>
      )}

      {/* Transcription Result */}
      {transcription && recordingState === 'transcribed' && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-gray-400 mt-1">"</div>
            <div className="flex-1">
              <p className="text-gray-900 italic">{transcription}</p>
              {voiceAnalysis && (
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Tone: {voiceAnalysis.tone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Style: {voiceAnalysis.style}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Confidence: {Math.round(voiceAnalysis.confidence * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
