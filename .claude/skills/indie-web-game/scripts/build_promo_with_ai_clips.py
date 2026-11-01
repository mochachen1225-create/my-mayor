# 剪宣傳短片：Flow 影片（標 AI）＋真實遊戲畫面（截圖／連拍）＋字卡＋音樂
# 用法：python3 build_promo.py <a|b> <zh|en>
import json, subprocess, sys, os
which, lang = sys.argv[1], sys.argv[2]
S = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(S)
FLOW = f'{ROOT}/flow'; TR = f'{ROOT}/trailer'; C = f'{S}/caps/{lang}'; TC = f'{TR}/caps/{lang}'
MUSIC = f'{ROOT}/video/music2.wav'
W = f'{S}/work_{which}_{lang}'; os.makedirs(W, exist_ok=True)
D = f'{S}/{lang}'; TD = f'{TR}/{lang}'
# (種類, 來源, 秒數, 字幕檔, 參數)
SEGS = {
 'a': [
  ('flow', f'{FLOW}/Campaign_manager_facepalms_at_mo_73a0e03a_1080p.mp4', 4.9, f'{C}/cap_a1.png', {'a': 0.5, 'b': 7.8}),
  ('still', f'{D}/q_weak.png', 1.8, f'{C}/cap_a2.png', {}),
  ('burst', f'{D}/answer1.json', 1.8, f'{C}/cap_a3.png', {'a': 0.0, 'b': 1.8}),
  ('still', f'{D}/q_attack.png', 1.6, f'{C}/cap_a4.png', {}),
  ('burst', f'{D}/answer2.json', 1.8, f'{C}/cap_a5.png', {'a': 0.0, 'b': 1.8}),
  ('still', f'{D}/after_flop.png', 1.8, f'{C}/cap_a6.png', {}),
  ('flow', f'{FLOW}/Campaign_manager_resting_at_desk_8eea3d8b_1080p.mp4', 2.75, f'{C}/cap_a7.png', {'a': 4.5, 'b': 7.8}),
  ('end', f'{C}/endcard_a.png', 2.6, None, {}),
 ],
 'b': [
  ('flow', f'{FLOW}/Candidate_shaking_hands_at_market_cf798917.mp4', 4.6, f'{C}/cap_b1.png', {'a': 0.5, 'b': 7.9}),
  ('burst', f'{TD}/mg.json', 2.6, f'{C}/cap_b2.png', {'a': 0.4, 'b': 10.6}),
  ('burst', f'{TD}/night.json', 4.0, f'{TC}/cap_night.png', {'a': 0.2, 'b': 11.2, 'bot': 1}),
  ('flow', f'{FLOW}/Volunteers_celebrating_at_campai_36f92f97.mp4', 4.6, f'{TC}/cap_win.png', {'a': 1.5, 'b': 7.9, 'blur': (170, 330, 740, 390)}),
  ('still', f'{TD}/ending.png', 1.6, f'{TC}/cap_ending.png', {'bot': 1}),
  ('end', f'{C}/endcard_b.png', 2.6, None, {}),
 ]}[which]
HIT = {'a': 6, 'b': 3}[which]       # 第幾段的開頭對到音樂轉強處（b 是再加 1.43 秒的爆發點）
HIT_EXTRA = {'a': 0, 'b': 1.43}[which]
def run(c): subprocess.run(c, check=True)
parts = []
for i, (kind, src, dur, cap, o) in enumerate(SEGS):
    out = f'{W}/s{i:02d}.mp4'; inputs = []
    if kind == 'flow':
        sp = (o['b'] - o['a']) / dur
        inputs = ['-ss', str(o['a']), '-to', str(o['b']), '-i', src]
        base = f'[0:v]setpts=(PTS-STARTPTS)/{sp:.4f},scale=1080:1920,fps=30,setsar=1,trim=duration={dur},setpts=PTS-STARTPTS[fg0]'
        if o.get('blur'):  # 背景電視上 AI 亂生的字：模糊掉
            x, y, w, h = o['blur']
            base += f';[fg0]split[m][t];[t]crop={w}:{h}:{x}:{y},boxblur=24:4[bl];[m][bl]overlay={x}:{y}[fg]'
        else:
            base += ';[fg0]null[fg]'
    elif kind == 'burst':
        frames = json.load(open(src)); a, b = o['a'], o['b']; sp = (b - a) / dur
        sel = [f for f in frames if a <= f[1] <= b]; lst = f'{W}/s{i:02d}.txt'
        with open(lst, 'w') as fh:
            for j, (f, t) in enumerate(sel):
                nt = sel[j + 1][1] if j + 1 < len(sel) else t + 0.07
                fh.write(f"file '{f}'\nduration {(nt - t) / sp:.4f}\n")
            fh.write(f"file '{sel[-1][0]}'\n")
        inputs = ['-f', 'concat', '-safe', '0', '-i', lst]
        base = f'[0:v]scale=960:1920,fps=30,setsar=1,trim=duration={dur},setpts=PTS-STARTPTS[g];[g]split[g1][g2];[g2]scale=1080:2160,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];[bg][g1]overlay=60:0[fg]'
    else:
        n = int(dur * 30); size = '1080x1920' if kind == 'end' else '960x1920'
        inputs = ['-loop', '1', '-t', str(dur), '-i', src]
        base = f"[0:v]scale={size.replace('x', ':')},zoompan=z='1+0.05*on/{n}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d={n}:s={size}:fps=30,setsar=1[z]"
        base += ';[z]null[fg]' if kind == 'end' else ';[z]split[g1][g2];[g2]scale=1080:2160,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];[bg][g1]overlay=60:0[fg]'
    fc = [base, "[fg]drawbox=x=0:y=0:w=iw:h=ih:color=white@0.5:t=fill:enable='lt(t,0.05)'[c0]"]
    last = 'c0'; k = 1
    if cap:
        inputs += ['-i', cap]; y0 = 1400 if o.get('bot') else 90; sign = '+' if o.get('bot') else '-'
        fc.append(f"[{last}][{k}:v]overlay=x=0:y='if(lt(t,0.18),{y0}{sign}(0.18-t)*900,{y0})'[c{k}]"); last = f'c{k}'; k += 1
    if kind == 'flow':  # AI 生成畫面要標示
        inputs += ['-i', f'{C}/ai_tag.png']
        fc.append(f"[{last}][{k}:v]overlay=x=20:y=H-h-30[c{k}]"); last = f'c{k}'; k += 1
    fc.append(f'[{last}]format=yuv420p[v]')
    run(['ffmpeg', '-v', 'error', '-y'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[v]', '-t', str(dur), '-r', '30', '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-an', out])
    parts.append(out)
lst = f'{W}/all.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
total = sum(s[2] for s in SEGS)
hit_at = sum(s[2] for s in SEGS[:HIT]) + HIT_EXTRA
end_at = sum(s[2] for s in SEGS[:-1])
off = 25.34 - hit_at; xs = end_at - 1.4; L1 = xs + 0.9
name = {'a': 'debate', 'b': 'election-night'}[which]
final = f'/home/user/my-mayor/promo/my-mayor-{name}-{lang}.mp4'
run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lst, '-i', MUSIC, '-filter_complex',
     f'[1:a]atrim=start={off:.3f}:end={off + L1:.3f},asetpts=PTS-STARTPTS[m1];[1:a]atrim=start=56.5:end=60.1,asetpts=PTS-STARTPTS[m2];[m1][m2]acrossfade=d=0.9:c1=tri:c2=tri,afade=t=in:d=0.2,apad[a]',
     '-map', '0:v', '-map', '[a]', '-t', f'{total:.2f}', '-c:v', 'libx264', '-crf', '20', '-preset', 'medium', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '192k', final])
print(final, round(total, 2), 'music offset', round(off, 2))
