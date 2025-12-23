# Batch TypeScript Fix Script
# This script adds ScreenProps type annotations to all remaining screen files

$screens = @(
    @{Name='SignIn'; HasRoute=$false},
    @{Name='SignUpAndSignIn'; HasRoute=$false},
    @{Name='Welcome'; HasRoute=$true},
    @{Name='Reminders'; HasRoute=$false},
    @{Name='MeditateV2'; HasRoute=$true},
    @{Name='MeditationSessions'; HasRoute=$true},
    @{Name='Sleep'; HasRoute=$true},
    @{Name='SleepMusic'; HasRoute=$true},
    @{Name='SleepStart'; HasRoute=$false},
    @{Name='PlayOption'; HasRoute=$true},
    @{Name='Profile'; HasRoute=$false},
    @{Name='Settings'; HasRoute=$false},
    @{Name='Preferences'; HasRoute=$false},
    @{Name='NotificationSettings'; HasRoute=$false}
)

foreach ($screen in $screens) {
    $name = $screen.Name
    $path = "src\screens\$name.tsx"
    
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        
        # Add ScreenProps import if not present
        if ($content -notmatch "import.*ScreenProps") {
            $content = $content -replace "(import.*from 'react-native';)", "`$1`nimport type { ScreenProps } from '../types';"
        }
        
        # Update component declaration
        if ($screen.HasRoute) {
            $content = $content -replace "const $name = \(\{ navigation, route \}\)", "const $name: React.FC<ScreenProps<'$name'>> = ({ navigation, route })"
        } else {
            $content = $content -replace "const $name = \(\{ navigation \}\)", "const $name: React.FC<ScreenProps<'$name'>> = ({ navigation })"
        }
        
        Set-Content -Path $path -Value $content
        Write-Host "✓ Updated $name.tsx"
    }
}

Write-Host "`n✅ All screens updated with ScreenProps types"
