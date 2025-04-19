import { useEffect, useState } from "react";

function Vapi() {
  const [isTalking, setIsTalking] = useState(false);
  const assistantId = "0864e6f5-f0be-4ebb-ad1f-23f6679221b6";
  const [vapi, setVapi] = useState(null);

  //handleStart , handleStop

  useEffect(() => {
    const v = new Vapi("04acf944-b633-4d3d-8bc5-2be4bbb74b25");
    setVapi(v);

    v.on("call-start", () => {
      console.log("Call has started.");
      setIsTalking(true);
    });

    v.on("call-end", () => {
      console.log("Call ended");
      setIsTalking(false);
    });

    return () => {
      v.removeAllListeners(); // Clean up listeners
    };
  }, []);

  async function handleStart() {
    if (!vapi) {
      console.warn("Vapi not initialized yet");
      return;
    }
    try {
      await vapi.start(assistantId);
    } catch (error) {
      console.log("could NOt start vapi", error);
    }
  }

  async function handleStop() {
    await vapi.stop();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex flex-col items-center justify-center text-gray-800 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4">🎙️ AI Voice Assistant</h1>
        <p className="text-gray-600 mb-6">
          Click the button below to talk to your AI assistant.
        </p>

        <div className="space-x-4">
          <button
            onClick={handleStart}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            disabled={isTalking}
          >
            Start Talking
          </button>

          <button
            onClick={handleStop}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            disabled={!isTalking}
          >
            Stop Talking
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-semibold ${
                isTalking ? "text-green-600" : "text-red-500"
              }`}
            >
              {isTalking ? "Talking..." : "Not Active"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Vapi;
