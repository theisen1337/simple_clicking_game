@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Running Quantum Factory Tests...
python run_tests.py

pause 