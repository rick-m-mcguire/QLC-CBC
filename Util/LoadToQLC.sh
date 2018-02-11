echo Copy QLC-CBC to QLC+ working folder
rm -r "/Users/rickmcguire/Library/Application Support/QLC+/RGBScripts/"*
rm -r "/Users/rickmcguire/Library/Application Support/QLC+/Fixtures/"*
rm -r "/Users/rickmcguire/Library/Application Support/QLC+/InputProfiles/"*
cp -r "/Users/rickmcguire/QLC-CBC/RGBScripts" "/Users/rickmcguire/Library/Application Support/QLC+"
cp -r "/Users/rickmcguire/QLC-CBC/Fixtures" "/Users/rickmcguire/Library/Application Support/QLC+"
cp -r "/Users/rickmcguire/QLC-CBC/InputProfiles" "/Users/rickmcguire/Library/Application Support/QLC+"
open -a QLC+
