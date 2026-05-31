@echo off
set OLLAMA_ORIGINS=*
start "" "ollama" serve
timeout /t 3 /nobreak >nul
echo Ollama запущен с CORS включён!
echo Нажми Ctrl+C чтобы остановить
pause >nul