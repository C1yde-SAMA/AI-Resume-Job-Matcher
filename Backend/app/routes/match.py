from fastapi import APIRouter, File, Form, HTTPException, UploadFile

router = APIRouter()


@router.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if not resume.filename:
        raise HTTPException(status_code=400, detail="Resume file is required.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    return {
        "score": 0.78,
        "matched_skills": ["Python", "React", "FastAPI", "SQL"],
        "missing_skills": ["Docker", "AWS"],
        "resume_preview": f"Uploaded resume: {resume.filename}",
    }