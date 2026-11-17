Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1794947374857_a00c477b.jpg"
$destKageChan = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage-chan\assets"
$destKage = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage\assets"

[System.IO.Directory]::CreateDirectory($destKageChan) | Out-Null
[System.IO.Directory]::CreateDirectory($destKage) | Out-Null

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)

function Clean-Crop([System.Drawing.Bitmap]$source, [int]$x, [int]$y, [int]$w, [int]$h, [string]$outPath, [int]$bgCutoff = 24) {
    $x = [Math]::Max(0, [Math]::Min($source.Width - 1, $x))
    $y = [Math]::Max(0, [Math]::Min($source.Height - 1, $y))
    $w = [Math]::Min($w, $source.Width - $x)
    $h = [Math]::Min($h, $source.Height - $y)

    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($source, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Intelligent alpha matting
    for ($py = 0; $py -lt $h; $py++) {
        for ($px = 0; $px -lt $w; $px++) {
            $c = $bmp.GetPixel($px, $py)
            $lum = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            
            # Pure dark background
            if ($lum -lt $bgCutoff -and $c.R -lt ($bgCutoff + 8)) {
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($lum -lt ($bgCutoff + 16) -and $c.G -lt 24 -and $c.B -lt 26) {
                # Soft edge feathering
                $alpha = [int]((($lum - $bgCutoff) / 16.0) * 255)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            }
        }
    }

    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Exported: $([System.IO.Path]::GetFileName($outPath)) ($w x $h)"
}

Write-Host "Extracting approved KAGE-CHAN sprites..."
Clean-Crop $srcImg 135 15 385 450 "$destKageChan\kage-chan-main.png" 26
Clean-Crop $srcImg 560 50 140 145 "$destKageChan\state-happy.png" 24
Clean-Crop $srcImg 705 50 140 145 "$destKageChan\state-blushing.png" 24
Clean-Crop $srcImg 850 50 140 145 "$destKageChan\state-angry.png" 24
Clean-Crop $srcImg 560 250 140 155 "$destKageChan\state-sleepy.png" 24
Clean-Crop $srcImg 705 250 140 155 "$destKageChan\state-surprised.png" 24
Clean-Crop $srcImg 850 250 140 155 "$destKageChan\state-teasing.png" 24

Clean-Crop $srcImg 15 500 120 130 "$destKageChan\state-sitting.png" 24
Clean-Crop $srcImg 140 500 125 130 "$destKageChan\state-walking.png" 24
Clean-Crop $srcImg 275 500 125 130 "$destKageChan\state-excited.png" 24 # "Following" dancing with music note!
Clean-Crop $srcImg 405 500 120 130 "$destKageChan\state-angry-mode.png" 24
Clean-Crop $srcImg 525 500 140 130 "$destKageChan\state-sleeping.png" 24

Write-Host "`nExtracting approved KAGE (Shadow Pet) sprites..."
# Kage from main image (beside Kage-chan's knee)
Clean-Crop $srcImg 412 342 110 110 "$destKage\kage-main.png" 22
# Kage from sitting action (beside Kage-chan)
Clean-Crop $srcImg 15 530 65 75 "$destKage\kage-sitting.png" 22
# Kage from following/excited action (carried / floating)
Clean-Crop $srcImg 345 525 60 70 "$destKage\kage-floating.png" 22
# Kage from sleeping action
Clean-Crop $srcImg 600 550 65 65 "$destKage\kage-sleeping.png" 22

$srcImg.Dispose()
Write-Host "All sprite assets extracted and alpha-matted!"
