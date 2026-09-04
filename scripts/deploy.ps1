$git = "C:\Users\ACER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"
Push-Location dist
if (Test-Path .git) { Remove-Item -Recurse -Force .git }
& $git init
& $git remote add origin https://github.com/bharathsirasapalli63-gif/SIH.git
& $git checkout -B gh-pages
& $git add -A
& $git commit -m "Deploy LandAlert to GitHub Pages"
& $git push -f origin gh-pages
Remove-Item -Recurse -Force .git
Pop-Location
Write-Output "Successfully deployed real files to gh-pages!"
