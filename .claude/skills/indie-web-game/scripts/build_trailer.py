# 用法：python3 build_trailer.py <zh|en>（素材在同層的 <lang>/，字卡在 caps/<lang>/；音樂用環境變數 MUSIC 指定 wav）
# 換遊戲時要改：SEG 片段清單、音樂對拍的秒數（25.34＝曲子轉強處、56.5～60.1＝曲子結尾）
# 剪試玩廣告：截圖／連拍 → 每段 1080×1920 片段（模糊背景＋梗字幕）→ 接起來配音樂
import json, subprocess, sys, os
lang = sys.argv[1]; S = os.path.dirname(os.path.abspath(__file__)); D = f'{S}/{lang}'; C = f'{S}/caps/{lang}'
W = f'{S}/work_{lang}'; os.makedirs(W, exist_ok=True)
MUSIC = os.environ.get('MUSIC', os.path.join(S, 'music.wav'))
SEG = [  # (種類, 來源, 秒數, 字幕, 參數)
  ('still', 'title', 1.5, 'title', {}),
  ('burst', 'flip', 2.5, 'flip', {'a': 0.0, 'b': 3.2}),
  ('still', 'profile', 1.5, 'profile', {'bot': 1}),
  ('still', 'intern_card', 1.6, 'intern', {}),
  ('still', 'intern_res', 1.2, None, {}),
  ('still', 'rat_card', 1.4, 'rat', {}),
  ('still', 'rat_res', 1.6, 'defy', {}),
  ('still', 'typhoon_hurry', 1.4, 'typhoon', {}),
  ('burst', 'mg', 4.0, 'mg', {'a': 0.4, 'b': 10.6}),
  ('still', 'liver', 1.4, 'liver', {}),
  ('burst', 'night', 4.0, 'night', {'bot': 1, 'a': 0.2, 'b': 11.2}),
  ('still', 'night_end', 1.5, 'win', {'bot': 1}),
  ('still', 'ending', 1.6, 'ending', {'bot': 1}),
  ('end', 'endcard', 2.4, None, {}),
]
def run(cmd): subprocess.run(cmd, check=True)
parts = []
for i, (kind, src, dur, cap, o) in enumerate(SEG):
    out = f'{W}/s{i:02d}.mp4'
    inputs = []
    if kind == 'burst':
        frames = json.load(open(f'{D}/{src}.json'))
        a, b = o['a'], o['b']; sp = (b - a) / dur
        sel = [f for f in frames if a <= f[1] <= b]
        lst = f'{W}/s{i:02d}.txt'
        with open(lst, 'w') as fh:
            for j, (f, t) in enumerate(sel):
                nt = sel[j + 1][1] if j + 1 < len(sel) else t + 0.07
                fh.write(f"file '{f}'\nduration {(nt - t) / sp:.4f}\n")
            fh.write(f"file '{sel[-1][0]}'\n")
        inputs = ['-f', 'concat', '-safe', '0', '-i', lst]
        base = '[0:v]scale=960:1920,fps=30,setsar=1,trim=duration=%.3f,setpts=PTS-STARTPTS[fg0]' % dur
    else:
        img = f'{C}/endcard.png' if kind == 'end' else f'{D}/{src}.png'
        inputs = ['-loop', '1', '-t', str(dur), '-i', img]
        n = int(dur * 30)
        size = '1080x1920' if kind == 'end' else '960x1920'
        base = f"[0:v]scale={size.replace('x', ':')},zoompan=z='1+0.05*on/{n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={n}:s={size}:fps=30,setsar=1[fg0]"
    fc = [base]
    if kind == 'end':
        fc.append('[fg0]format=yuv420p[comp]')
    else:
        fc.append('[fg0]split[f1][f2];[f2]scale=1080:2160,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];[bg][f1]overlay=60:0[comp0]')
        fc.append("[comp0]drawbox=x=0:y=0:w=iw:h=ih:color=white@0.55:t=fill:enable='lt(t,0.05)',format=yuv420p[comp1]")
        if cap:
            inputs += ['-i', f'{C}/cap_{cap}.png']
            y0 = 1400 if o.get('bot') else 90
            fc.append(f"[comp1][1:v]overlay=x=0:y='if(lt(t,0.18),{y0}+(0.18-t)*900,{y0})':format=auto,format=yuv420p[comp]" if o.get('bot') else f"[comp1][1:v]overlay=x=0:y='if(lt(t,0.18),{y0}-(0.18-t)*900,{y0})':format=auto,format=yuv420p[comp]")
        else:
            fc.append('[comp1]null[comp]')
    run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[comp]', '-t', str(dur), '-r', '30', '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p', out])
    parts.append(out)
lst = f'{W}/all.txt'
open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
total = sum(s[2] for s in SEG)
win_at = sum(s[2] for s in SEG[:11]); end_at = sum(s[2] for s in SEG[:13])
off = 25.34 - win_at              # 音樂轉成全開的地方對到凍蒜
xs = end_at - 1.4                 # 交叉淡入音樂收尾，最後一下重音落在片尾卡出現時
L1 = xs + 0.9
final = f'{os.path.dirname(S)}/my-mayor-trailer-{lang}.mp4'
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', MUSIC, '-filter_complex',
     f'[1:a]atrim=start={off:.3f}:end={off + L1:.3f},asetpts=PTS-STARTPTS[m1];[1:a]atrim=start=56.5:end=60.1,asetpts=PTS-STARTPTS[m2];[m1][m2]acrossfade=d=0.9:c1=tri:c2=tri,afade=t=in:d=0.2,apad[aout]',
     '-map', '0:v', '-map', '[aout]', '-t', f'{total:.2f}', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', final])
print(final, total, 'win at', win_at, 'music offset', off)
