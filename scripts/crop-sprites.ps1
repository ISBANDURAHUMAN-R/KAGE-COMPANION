Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\dell\.gemini\antigravity\brain\404c3ea4-90b7-47cd-bf9c-3455c46446f6\.user_uploaded\media_1794947374857_a00c477b.jpg"
$destKageChan = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage-chan\assets"
$destKage = "D:\WORKSPACE\ANTIGRAVITY\KAGE COMPANION\src\renderer\characters\kage\assets"

$srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Sprite([System.Drawing.Bitmap]$source, [int]$x, [int]$y, [int]$width, [int]$height, [string]$outPath, [int]$darkThreshold = 22) {
    # Ensure within bounds
    $x = [Math]::Max(0, [Math]::Min($source.Width - 1, $x))
    $y = [Math]::Max(0, [Math]::Min($source.Height - 1, $y))
    $width = [Math]::Min($width, $source.Width - $x)
    $height = [Math]::Min($height, $source.Height - $y)

    $rect = New-Object System.Drawing.Rectangle($x, $y, $width, $height)
    $cropped = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.DrawImage($source, (New-Object System.Drawing.Rectangle(0, 0, $width, $height)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Alpha matting for transparent background
    for ($py = 0; $py -lt $height; $py++) {
        for ($px = 0; $px -lt $width; $px++) {
            $c = $cropped.GetPixel($px, $py)
            $maxVal = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
            
            # The background in this sheet is a dark gradient with red glow/vignette.
            # Background is dark gray/black (R < 35, G < 20, B < 24)
            if ($maxVal -lt $darkThreshold -and $c.R -lt ($darkThreshold + 10)) {
                $cropped.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            } elseif ($maxVal -lt ($darkThreshold + 18) -and $c.G -lt 25 -and $c.B -lt 28) {
                $ramp = ($maxVal - $darkThreshold) / 18.0
                $alpha = [int]($ramp * 255)
                $alpha = [Math]::Max(0, [Math]::Min(255, $alpha))
                $cropped.SetPixel($px, $py, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
            }
        }
    }

    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Host "Generated: $outPath ($width x $height)"
}

# 1. Main Kage-Chan & Kage
Crop-Sprite $srcImg 135 15 385 450 "$destKageChan\kage-chan-main.png" 24

# 2. Expressions (Busts)
Crop-Sprite $srcImg 555 45 140 160 "$destKageChan\expr-happy.png" 22
Crop-Sprite $srcImg 700 45 140 160 "$destKageChan\expr-blushing.png" 22
Crop-Sprite $srcImg 845 45 140 160 "$destKageChan\expr-angry.png" 22
Crop-Sprite $srcImg 555 330 145 140 "$destKageChan\expr-sleepy.png" 22
Crop-Sprite $srcImg 700 325 145 155 "$destKageChan\expr-surprised.png" 22
Crop-Sprite $srcImg 845 325 145 155 "$destKageChan\expr-teasing.png" 22

# 3. Actions (Full body chibi)
Crop-Sprite $srcImg 10 495 130 155 "$destKageChan\action-sitting.png" 20
Crop-Sprite $srcImg 142 495 130 155 "$destKageChan\action-walking.png" 20
Crop-Sprite $srcImg 274 495 130 155 "$destKageChan\action-following.png" 20
Crop-Sprite $srcImg 406 495 125 155 "$destKageChan\action-angry.png" 20
Crop-Sprite $srcImg 528 495 135 155 "$destKageChan\action-sleeping.png" 20

# 4. KAGE (The Shadow Pet)
# From the main illustration, Kage is beside Kage-chan at X: 410, Y: 495 or X: 410, Y: 335
Crop-Sprite $srcImg 412 340 115 115 "$destKage\kage-main.png" 18
# Sleeping Kage from the sleeping action
Crop-Sprite $srcImg 600 550 65 65 "$destKage\kage-sleeping.png" 18

$srcImg.Dispose()
Write-Host "All sprite extractions completed successfully!"
