const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadResumeFile(resumeFile) {
  const formData = new FormData();
  formData.append("resume", resumeFile);

  const response = await fetch(`${API_BASE_URL}/api/upload-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to upload resume.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // ignore parse failure
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function matchResumeToJob(resumeFile, jobDescription) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("job_description", jobDescription);

  const response = await fetch(`${API_BASE_URL}/api/match`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to match resume with job description.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // ignore parse failure
    }
    throw new Error(errorMessage);
  }

  return response.json();
}