from typing import Optional
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from .. import schemas, database, models, api_key
from bs4 import BeautifulSoup
import requests
import re

router = APIRouter(
    prefix="/icress"
)

headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    'Referer': 'https://simsweb4.uitm.edu.my/estudent/class_timetable/index.htm' 
}

@router.get('/campus')
def get_campus(api_key: str = Depends(api_key.validate_api_key)):
    
    url = 'https://simsweb4.uitm.edu.my/estudent/class_timetable/cfc/select.cfc?method=find_cam_icress_student&key=All&page=1&page_limit=30'
    campus = requests.get(url, headers=headers)
    
    return campus.json()


@router.get('/faculty')
def get_campus(api_key: str = Depends(api_key.validate_api_key)):
    
    url = 'https://simsweb4.uitm.edu.my/estudent/class_timetable/cfc/select.cfc?method=find_fac_icress_student&key=All&page=1&page_limit=30'
    faculty = requests.get(url, headers=headers)
    
    return faculty.json()


@router.get('/session')
def get_session(api_key: str = Depends(api_key.validate_api_key)):
    
    form_data = {
        "search_campus": "B",
        "search_faculty": "CD",
        "search_course": ""
    }

    url = "https://simsweb4.uitm.edu.my/estudent/class_timetable/index_result.cfm"
    session = requests.Session()
    response = session.post(url, data=form_data, headers=headers)
    soup = BeautifulSoup(response.text, 'lxml')
    h5_text = soup.find_all('h5')
    match = re.search(r"Semester\s*:\s*(\d+)", h5_text[2].get_text())
    print(match)

    if match: semester = match.group(1)
    return {"session": semester}