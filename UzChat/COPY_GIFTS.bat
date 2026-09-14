@echo off
echo === UzChat Sovg'a rasmlarini ko'chirish ===
mkdir "%~dp0img" 2>nul
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_rose_1779274088398.png" "%~dp0img\gift_rose.png" /Y
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_heart_1779274103652.png" "%~dp0img\gift_heart.png" /Y
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_star_1779274117962.png" "%~dp0img\gift_star.png" /Y
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_diamond_1779274130086.png" "%~dp0img\gift_diamond.png" /Y
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_crown_1779274144818.png" "%~dp0img\gift_crown.png" /Y
copy "%USERPROFILE%\.gemini\antigravity\brain\a50053d4-f39f-44f3-a66a-8058cfe207d7\gift_airplane_1779274168724.png" "%~dp0img\gift_airplane.png" /Y
echo.
echo === Tayyor! 6 ta sovg'a rasmi ko'chirildi ===
echo Endi serverni qayta yurgizing: node server.js
pause
