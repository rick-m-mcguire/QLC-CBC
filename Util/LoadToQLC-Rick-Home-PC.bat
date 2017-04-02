ECHO Copying to To QLC from Working
DEL "C:\Users\Tubby\QLC+\RGBScripts\*" /Q
XCOPY "C:\Users\Tubby\Documents\GitHub\QLC-CBC\*" "C:\Users\Tubby\QLC+\" /S /I /Y
START "" "C:\QLC+\qlcplus.exe"
