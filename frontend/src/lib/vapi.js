import Vapi from "@vapi-ai/web";

// const VAPI_ID = "04acf944-b633-4d3d-8bc5-2be4bbb74b25";
const VAPI_ID = import.meta.env.VITE_VAPI_PUBLIC_API;
export const vapi = new Vapi(VAPI_ID);
