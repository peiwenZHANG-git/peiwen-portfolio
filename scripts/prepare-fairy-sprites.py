"""
Flower-fairy Peiwen sprites (components/fairy-guide.tsx, components/peiwen-companion.tsx),
2026-09-25. Source: design-assets/character/peiwen-fairy-sheet-v1.png, the user-supplied
sheet (flying / hovering / tapping poses + loose wings). Cuts each pose out of the paper
by closing its drawn outline into a silhouette; the wand star's glow stays see-through.
No redrawing or recolouring. Run from the repo root (needs pillow, numpy, scipy):
    python scripts/prepare-fairy-sprites.py
"""
from PIL import Image; import numpy as np
from scipy import ndimage
import sys
SRC='design-assets/character/peiwen-fairy-sheet-v1.png'
OUT='public/assets/companion/'
src=Image.open(SRC).convert('RGB')
BOXES={'fly':(55,90,665,695),'hover':(620,190,1095,900),'tap':(100,700,630,1310),'wings':(675,970,1065,1290)}
def cut(box,t_l=13,t_d=20,k=6):
    im=np.asarray(src.crop(box)).astype(float)
    # paper estimate: heavy blur median-ish of border
    border=np.concatenate([im[0],im[-1],im[:,0],im[:,-1]])
    paper=np.median(border,0); plum=paper.mean()
    lum=im.mean(2)
    dist=np.sqrt(((im-paper)**2).sum(2))
    sm=ndimage.uniform_filter(dist,3)
    lines=(ndimage.uniform_filter(lum,3)<plum-t_l)|(sm>t_d)
    lines=ndimage.binary_opening(lines,iterations=1)
    sil=ndimage.binary_fill_holes(ndimage.binary_dilation(lines,iterations=k))
    sil=ndimage.binary_erosion(sil,iterations=k,border_value=0)
    lab,n=ndimage.label(ndimage.binary_dilation(sil,iterations=8))
    sizes=ndimage.sum(np.ones_like(lab),lab,range(1,n+1))
    big=np.argmax(sizes)+1
    sil=sil&(lab==big)
    # the wand star's glow: keep it see-through instead of solid
    gold=(im[...,0]>215)&(im[...,1]>165)&(im[...,2]<130)
    glab,gn=ndimage.label(gold)
    glow=np.zeros_like(gold)
    if gn:
        gs=ndimage.sum(gold,glab,range(1,gn+1)); star=glab==(np.argmax(gs)+1)
        yy,xx=np.mgrid[0:im.shape[0],0:im.shape[1]]
        cy,cx=ndimage.center_of_mass(star)
        near=((yy-cy)**2+(xx-cx)**2)<55**2
        glow=near&~ndimage.binary_dilation(star,iterations=2)&(im[...,0]-im[...,2]>55)&(im[...,2]<paper[2]-20)&(lum>plum-45)
        glow=ndimage.binary_opening(glow)
    sil=sil&~glow
    soft=np.clip(dist/36,0,1)
    soft=np.where(glow,np.clip(dist/70,0,1)*0.9,soft)
    alpha=np.maximum(sil*1.0, soft*(ndimage.binary_dilation(sil,iterations=3)|glow))
    alpha=ndimage.gaussian_filter(alpha,0.7)
    core=ndimage.binary_erosion(sil,iterations=2)
    alpha=np.where(core,1.0,alpha*np.where(sil,1.0,0.8))
    out=Image.fromarray(np.dstack([im,np.clip(alpha,0,1)*255]).astype(np.uint8),'RGBA')
    return out.crop(out.getbbox())
if __name__=='__main__':
    # one shared scale for every pose, so they swap without changing size
    scale=300/703
    for name in ['hover','fly','tap']:
        o=cut(BOXES[name])
        o=o.resize((round(o.width*scale),round(o.height*scale)),Image.LANCZOS)
        o.save(OUT+'fairy-'+name+'.webp',quality=92,method=6)
        print(name,o.size)
