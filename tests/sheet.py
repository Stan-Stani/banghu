# Contact sheet: python3 tests/sheet.py ch1 → tests/shots/ch1/sheet-N.png (6 shots per sheet, cropped to the game area)
import sys,glob,os
from PIL import Image,ImageDraw
ch=sys.argv[1];d=f'tests/shots/{ch}';fs=sorted(f for f in glob.glob(d+'/*.png') if 'sheet' not in f)
for n in range(0,len(fs),6):
    imgs=[Image.open(f).crop((0,0,400,700)) for f in fs[n:n+6]]
    W,H=400,720;sheet=Image.new('RGB',(W*3,H*2),'white');dr=ImageDraw.Draw(sheet)
    for i,(im,f) in enumerate(zip(imgs,fs[n:n+6])):
        x,y=(i%3)*W,(i//3)*H;sheet.paste(im,(x,y+20));dr.text((x+6,y+4),os.path.basename(f),fill='black')
    sheet.save(f'{d}/sheet-{n//6+1}.png')
print('ok')
