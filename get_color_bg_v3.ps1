Add-Type -AssemblyName System.Drawing
$bmp = New-Object System.Drawing.Bitmap 'c:\Users\PCS\Desktop\Meditation App\assets\images\sleep_start_bg_v3.png'
$c = $bmp.GetPixel(0,0)
Write-Host "$($c.R),$($c.G),$($c.B)"
$bmp.Dispose()
