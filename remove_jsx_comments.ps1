$files = @(
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Welcome.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\SignUpAndSignIn.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\SignUp.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\SignIn.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\components\BottomMenu.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\global.d.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        $content = $content -replace '\{\s*/\*[^*]*\*+(?:[^/*][^*]*\*+)*/\s*\}', ''
        
        $content = $content -replace '//[^\r\n]*', ''
        
        $content = $content -replace '(?m)^\s*$\r?\n', ''
        
        $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
        
        Set-Content -Path $file -Value $content -NoNewline
        
        Write-Host "Processed: $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nJSX comment removal complete!" -ForegroundColor Green
