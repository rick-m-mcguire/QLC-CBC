ECHO Copying to To QLC from Working
DEL "C:\Users\Tubby\QLC+\RGBScripts\*" /Q
XCOPY "C:\SharedData\Apps\Git\QLC-CBC\*" "C:\Users\pmmcgui\QLC+\" /S /I /Y
START "" "C:\SharedData\Apps\QLC+\qlcplus.exe"
