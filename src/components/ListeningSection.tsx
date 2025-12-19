import { useExamStore } from "@/store/examStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Volume2, RotateCcw } from "lucide-react";
import { useState, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export const ListeningSection = () => {
  const { answers, setAnswer } = useExamStore();
  const listeningAnswers = answers.listening;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes placeholder
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleChange = (question: string, value: string) => {
    setAnswer("listening", question, value);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Audio Player - Fixed at top */}
      <div className="p-6 border-b border-border bg-card">
        <h2 className="section-header mb-4">Listening Section</h2>
        
        <div className="audio-player-container">
          <audio
            ref={audioRef}
            src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onEnded={() => setIsPlaying(false)}
          />
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 border-0"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </Button>
            
            <div className="flex-1 space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(value) => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = value[0];
                    setCurrentTime(value[0]);
                  }
                }}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={resetAudio}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <Volume2 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Listen to the audio recording and answer the questions below
          </p>
        </div>
      </div>

      {/* Questions */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 max-w-4xl mx-auto">
          {/* Short Answer Questions 1-5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                Q1-5
              </span>
              <h3 className="font-semibold text-foreground">Short Answer</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Write your answers in the boxes. Spelling and capitalization are ignored.
            </p>
            
            {[1, 2, 3, 4, 5].map((q) => (
              <div key={q} className="question-card">
                <Label className="font-medium text-foreground">Question {q}</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {q === 1 && "What time of day does the speaker prefer to study?"}
                  {q === 2 && "Where does the conversation take place?"}
                  {q === 3 && "On which day is the meeting scheduled?"}
                  {q === 4 && "How many participants are expected to attend?"}
                  {q === 5 && "What color is the main building?"}
                </p>
                <Input
                  value={listeningAnswers[`q${q}`] || ""}
                  onChange={(e) => handleChange(`q${q}`, e.target.value)}
                  placeholder="Type your answer"
                  className="max-w-md bg-background"
                />
              </div>
            ))}
          </div>

          {/* Multiple Choice Questions 6-10 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                Q6-10
              </span>
              <h3 className="font-semibold text-foreground">Multiple Choice</h3>
            </div>
            <p className="text-sm text-muted-foreground">Choose the best answer (A, B, C, or D)</p>
            
            {[6, 7, 8, 9, 10].map((q) => (
              <div key={q} className="question-card">
                <Label className="font-medium text-foreground">Question {q}</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {q === 6 && "What is the main topic of the discussion?"}
                  {q === 7 && "How does the speaker feel about the proposal?"}
                  {q === 8 && "What solution is suggested?"}
                  {q === 9 && "When will the project be completed?"}
                  {q === 10 && "Who is responsible for the final decision?"}
                </p>
                <RadioGroup
                  value={listeningAnswers[`q${q}`] || ""}
                  onValueChange={(value) => handleChange(`q${q}`, value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {["A", "B", "C", "D"].map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`listening-q${q}-${option}`} />
                      <Label htmlFor={`listening-q${q}-${option}`} className="cursor-pointer text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>

          {/* Matching Questions 11-15 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                Q11-15
              </span>
              <h3 className="font-semibold text-foreground">Matching</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Match each speaker with the correct statement
            </p>
            <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
              <p><strong>A.</strong> The project manager</p>
              <p><strong>B.</strong> The team leader</p>
              <p><strong>C.</strong> The consultant</p>
              <p><strong>D.</strong> The department head</p>
              <p><strong>E.</strong> The new intern</p>
            </div>
            
            {[11, 12, 13, 14, 15].map((q) => (
              <div key={q} className="question-card">
                <Label className="font-medium text-foreground">Question {q}</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {q === 11 && "Suggests postponing the deadline"}
                  {q === 12 && "Proposes a budget increase"}
                  {q === 13 && "Recommends hiring additional staff"}
                  {q === 14 && "Agrees with the original timeline"}
                  {q === 15 && "Asks for clarification on roles"}
                </p>
                <Select
                  value={listeningAnswers[`q${q}`] || ""}
                  onValueChange={(value) => handleChange(`q${q}`, value)}
                >
                  <SelectTrigger className="w-48 bg-background">
                    <SelectValue placeholder="Select speaker" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {["A", "B", "C", "D", "E"].map((letter) => (
                      <SelectItem key={letter} value={letter}>
                        {letter}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
