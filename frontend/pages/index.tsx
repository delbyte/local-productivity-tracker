import { useState } from "react";
import { pipe } from "@screenpipe/browser";
import axios from "axios";

export default function Home() {
  // User inputs: session duration (in minutes) and session goal
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(30); // default duration in minutes
  const [timerStarted, setTimerStarted] = useState(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Called when the user starts the session
  const startSession = () => {
    const now = new Date();
    setStartTime(now.toISOString());
    setTimerStarted(true);

    // Set a timer for the specified duration (in minutes)
    setTimeout(() => {
      analyzeSession();
    }, duration * 60 * 1000);
  };

  // Called after the session duration has elapsed
  const analyzeSession = async () => {
    setLoading(true);
    const endTime = new Date().toISOString();

    try {
      // Query ScreenPipe for OCR data between the start and end times.
      const results = await pipe.queryScreenpipe({
        contentType: "ocr",
        startTime: startTime!,
        endTime,
        limit: 100,
        includeFrames: false,
      });

      // Combine all the OCR text from the results.
      const extractedText = results.data
        .map((item) => item.content.text)
        .join("\n");

      // Send the extracted screen activity and user's goal to the backend model
      // Expected to return an object with { summary: string, score: number }
      const response = await axios.post("http://127.0.0.1:8000/analyze", {
        goal,
        text: extractedText,
      });

      const { summary, score } = response.data;
      setAnalysis(`Summary: ${summary}\nScore: ${score}`);
    } catch (error) {
      console.error("Error during session analysis:", error);
      setAnalysis("Error analyzing session.");
    } finally {
      setLoading(false);
      setTimerStarted(false);
      setStartTime(null);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Local Productivity Tracker</h1>

      {!timerStarted ? (
        <>
          <input
            type="number"
            placeholder="Enter session duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Enter your goal for the session..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={startSession}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={!goal || duration <= 0}
          >
            Start Session
          </button>
        </>
      ) : (
        <p>Session in progress... Your activity will be analyzed after {duration} minute(s).</p>
      )}

      {loading && <p>Analyzing session...</p>}
      {analysis && <pre className="whitespace-pre-wrap">{analysis}</pre>}
    </div>
  );
}
