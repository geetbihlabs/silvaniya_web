import sys
try:
    from PIL import Image
    import os

    img_path = r"public/logo-white.png"
    out_path = r"public/logo-white-transparent.png"
    
    if not os.path.exists(img_path):
        print("Image not found")
        sys.exit(1)
        
    img = Image.open(img_path).convert("RGBA")
    datas = img.getdata()

    # Find the most common color (likely background)
    from collections import Counter
    colors = Counter([ (r,g,b) for r,g,b,a in datas ])
    bg_color = colors.most_common(1)[0][0]

    newData = []
    
    # If the background is very dark (black), we assume it's a white logo on black
    if bg_color[0] < 50 and bg_color[1] < 50 and bg_color[2] < 50:
        for r,g,b,a in datas:
            # Grayscale luminance as alpha
            lum = int(0.299*r + 0.587*g + 0.114*b)
            # Make it pure white with alpha = luminance
            newData.append((255, 255, 255, lum))
    # If it's a white/light background, we assume it's a dark/colored logo on white
    elif bg_color[0] > 200 and bg_color[1] > 200 and bg_color[2] > 200:
        for r,g,b,a in datas:
            # Invert luminance for alpha
            lum = int(0.299*r + 0.587*g + 0.114*b)
            alpha = 255 - lum
            # If we want a white logo, we force white! The user said "logo-white.png"
            newData.append((255, 255, 255, alpha))
    else:
        # Fallback simple chroma key
        for r,g,b,a in datas:
            if abs(r - bg_color[0]) < 20 and abs(g - bg_color[1]) < 20 and abs(b - bg_color[2]) < 20:
                newData.append((255, 255, 255, 0))
            else:
                newData.append((255, 255, 255, 255)) # force white 

    img.putdata(newData)
    img.save(out_path, "PNG")
    print("Success")
except Exception as e:
    print(f"Error: {e}")
