import { useEffect, useState } from "react";
import { pipe } from "@screenpipe/browser";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [activity, setActivity] = useState("No data yet...");

  useEffect(() => {
    // Start capturing screen activity
    pipe.start();
    return () => pipe.stop();
  }, []);

  const analyzeProductivity = async () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const now = new Date().toISOString();

    try {
      const results = await pipe.queryScreenpipe({
        contentType: "ocr",
        startTime: oneHourAgo,
        endTime: now,
        limit: 10,
        includeFrames: false,
      });

      if (results.data.length > 0) {
        setActivity(`Recent activity: ${results.data[0].content.text}`);
      } else {
        setActivity("No relevant activity found.");
      }
    } catch (error) {
      console.error("Error querying ScreenPipe:", error);
      setActivity("Error fetching activity.");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Local Productivity Tracker</h1>
      <input 
        type="text" 
        placeholder="Enter your goal..." 
        value={goal} 
        onChange={(e) => setGoal(e.target.value)}
        className="border p-2 rounded"
      />
      <button 
        onClick={analyzeProductivity} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        Analyze Productivity
      </button>
      <p className="text-lg font-semibold">{activity}</p>
    </div>
  );
}
