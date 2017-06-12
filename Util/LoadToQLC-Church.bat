ECHO Copying to To QLC from Working
DEL "C:\Users\MULTIMEDIA\QLC+\RGBScripts\*" /Q
XCOPY "C:\Users\MULTIMEDIA\Documents\GitHub\QLC-CBC\*" "C:\Users\MULTIMEDIA\QLC+\" /S /I /Y
START "" "C:\QLC+\qlcplus.exe"
