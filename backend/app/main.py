from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import user, schedule, class_, generate, courses, icress


origins = ['*']
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], #allow specific http methods (like post request, only get)
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(schedule.router)
app.include_router(class_.router)
app.include_router(courses.router)
app.include_router(icress.router)
app.include_router(generate.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
