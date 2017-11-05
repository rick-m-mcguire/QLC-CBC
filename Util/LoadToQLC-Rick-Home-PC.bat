ECHO Copying to To QLC from Working
DEL "C:\Users\Tubby\QLC+\RGBScripts\*" /Q
XCOPY "C:\Users\Tubby\QLC-CBC\*" "C:\Users\Tubby\QLC+\" /S /I /Y
PAUSE
START "" "C:\QLC+\qlcplus.exe"
