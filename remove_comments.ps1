$files = @(
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Sleep.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\SleepStart.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\SleepMusic.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Profile.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Reminders.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\EditProfile.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Home.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\MeditationSessions.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\NotificationSettings.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\PlayOption.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\MeditateV2.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\ChooseTopic.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Settings.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Preferences.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\About.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\CourseDetails.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\AudioDetails.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\AudioDetails2.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\Congratulations.tsx",
    "C:\Users\PCS\Desktop\Meditation App\src\screens\FirebaseTest.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        $content = $content -replace '//[^\r\n]*', ''
        
        $content = $content -replace '/\*[\s\S]*?\*/', ''
        
        $content = $content -replace '\{\s*/\*[\s\S]*?\*/\s*\}', ''
        
        $content = $content -replace '(?m)^\s*$\r?\n', ''
        
        $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
        
        Set-Content -Path $file -Value $content -NoNewline
        
        Write-Host "Processed: $file"
    } else {
        Write-Host "File not found: $file" -ForegroundColor Yellow
    }
}

Write-Host "`nComment removal complete!" -ForegroundColor Green
