$git = "C:\Users\ACER\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"
$env:GIT_INDEX_FILE = "temp_index"
& $git --work-tree=dist add --all
$tree = (& $git write-tree).Trim()
$commit = (& $git commit-tree $tree -p gh-pages -m "Deploy offline report saving and auto-sync to gh-pages").Trim()
& $git update-ref refs/heads/gh-pages $commit
& $git push origin gh-pages
Remove-Item Env:GIT_INDEX_FILE
if (Test-Path temp_index) { Remove-Item temp_index }
Write-Output "Successfully deployed to gh-pages with commit $commit"
