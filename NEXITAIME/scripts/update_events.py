from __future__ import annotations
import json, re, sys
from datetime import datetime, timedelta
from pathlib import Path
import requests
from bs4 import BeautifulSoup

BASE='https://joetsukankonavi.jp'
OUT=Path(__file__).resolve().parents[1]/'events_auto.json'
HEADERS={'User-Agent':'NEXITAIME event updater/1.0 (+https://axcelmode-nexit.jp/)'}

def month_keys():
    today=datetime.now()
    keys=[]
    y,m=today.year,today.month
    for d in range(0,4):
        mm=m+d; yy=y+(mm-1)//12; mm=(mm-1)%12+1
        keys.append(f'{yy}{mm:02d}')
    return keys

def parse_date_text(text, default_year):
    # Handles simple forms such as 2026年10月17日（土）～10月18日（日）
    m=re.search(r'(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日',text)
    if not m: return None
    y=int(m.group(1) or default_year); mo=int(m.group(2)); d=int(m.group(3))
    start=f'{y:04d}-{mo:02d}-{d:02d}'
    rest=text[m.end():]
    m2=re.search(r'(?:(\d{4})年)?(\d{1,2})月(\d{1,2})日',rest)
    if m2:
        y2=int(m2.group(1) or y); end=f'{y2:04d}-{int(m2.group(2)):02d}-{int(m2.group(3)):02d}'
    else: end=start
    return start,end

def main():
    rows=[]; seen=set()
    for ym in month_keys():
        url=f'{BASE}/event/calendar.php/?ym={ym}'
        r=requests.get(url,headers=HEADERS,timeout=25); r.raise_for_status()
        soup=BeautifulSoup(r.text,'html.parser')
        year=int(ym[:4])
        # Search anchors that link to event details, then derive date/title from surrounding card text.
        for a in soup.select('a[href*="/event/detail.php"], a[href*="event/detail.php"]'):
            title=' '.join(a.get_text(' ',strip=True).split())
            if not title or len(title)<3: continue
            href=a.get('href','')
            full=requests.compat.urljoin(url,href)
            key=full
            if key in seen: continue
            block=a.parent.get_text(' ',strip=True) if a.parent else title
            dates=parse_date_text(block,year)
            if not dates: continue
            seen.add(key)
            rows.append({
                'id':'auto-'+re.sub(r'[^0-9A-Za-z]+','-',href).strip('-')[:80],
                'title':title,
                'start_date':dates[0],'end_date':dates[1],
                'start_time':None,'end_time':None,
                'area':'wide','area_name':'上越市','venue':'詳細ページで確認',
                'categories':[], 'source':'上越観光Navi（自動取得）','url':full,
                'summary':'上越観光Naviのイベントカレンダーから自動取得。会場・時刻・料金は詳細ページで確認してください。',
                'indoor':False,'family_friendly':False,'couple_friendly':True,'solo_friendly':True,
                'estimated_cost_yen':None,'hours_note':''
            })
    if not rows:
        print('No events parsed; keep existing output if any.',file=sys.stderr); return 0
    OUT.write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    print(f'wrote {len(rows)} events to {OUT}')
    return 0
if __name__=='__main__': raise SystemExit(main())
