> 這是《我推的市長》用過的翻譯指引，做新遊戲時照這個格式改寫：換掉遊戲簡介、詞彙表、角色清單。

# Translation brief: 《我推的市長》 (English title: "My Mayor-to-Be")

A satirical mobile web game about a Taiwanese city mayoral election. The player is the exhausted **campaign manager**; the candidate ("the boss") is drawn at random. It will be published on itch.io so international players can experience Taiwanese election culture.

## Tone
- Natural, punchy, witty English, like a good indie game localization. Satire, light and affectionate, never mean-spirited toward real groups.
- Keep it concise. Buttons/options should stay short (aim for ≤ 60 characters when the Chinese is short). Don't add explanations that aren't in the original, except a few words where a Taiwan-specific concept would otherwise be unclear.
- Use American English spelling.

## Hard rules
1. Output ONE valid JSON object mapping every input `zh` string (exact key, unchanged) to its English translation. Include every key. No comments.
2. Keep placeholders exactly: `{boss}` (candidate's name), `{rival}`, `{party}`, `{rparty}`, `{num}`, `{incNote}`, and numeric `{0}`, `{1}`, `{2}`… Each placeholder in the source must appear in the translation (order may change).
3. `{he}` = the boss's pronoun. In English you may use `{he}` (he/she), `{He}` (capitalized He/She), `{him}` (him/her), `{his}` (his/her). Use whichever fits grammatically.
4. When a numeric placeholder is a MONTH NUMBER (e.g. `{0}月`), write `{M0}` (it renders as "Aug", "Sep"…). Example: `{0}月 第{1}週` → `{M0}, week {1}`. `（{0}月）` → `({M0})`. `📊 {0} 月內參民調` → `📊 {M0} internal poll`.
5. Keep emoji where they are (usually at the start). Keep 「」 quotes as English “ ” double quotes.
6. Never invent real names, real places, real parties, real media or real companies. Everything stays fictional.
7. Never state outright that "bad deeds always get caught" (that's a hidden rule; don't spell it out).
8. Strings may be fragments that get concatenated with HTML or values around them; the `ctx` field shows the code line. Translate fragments so the assembled sentence reads naturally (leading/trailing spaces matter in English: include a space where words would otherwise run together, e.g. fragment `的` in `name + '的' + '媽媽'` → `'s ` ).
9. Duplicate meanings must stay consistent (use the glossary).

## Glossary (use these exact terms)
| Chinese | English |
|---|---|
| 我推的市長 | My Mayor-to-Be |
| 市長不是神，是幕僚造出來的神。 | Mayors aren't gods. Their staff make them gods. |
| 總幹事 | campaign manager |
| 副總幹事 | deputy campaign manager |
| 老闆 | the boss |
| 候選人 | candidate |
| 對手 / 主要對手 | rival / main rival |
| 現任市長 | incumbent mayor |
| 戰情室 | war room |
| N City | N City |
| 烏龜黨 / 蜂鳥黨 / 孔雀黨 / 無黨籍 | Turtle Party / Hummingbird Party / Peacock Party / Independent |
| 脆 (social network) | Crisp |
| 網友 | netizens |
| 小編 | social media intern (or "social media admin") |
| 名嘴 | pundit |
| 政論節目 | political talk show |
| 里長 / 里長伯 | borough chief / Uncle Borough Chief |
| 宮廟 / 廟 | temple |
| 掃街 | street canvassing (菜市場掃街 = market walkabout) |
| 拜票 | canvassing for votes |
| 造勢晚會 | rally |
| 選前之夜 | election-eve rally |
| 投票日 | Election Day |
| 開票夜 | election night |
| 民調 / 內參民調 | poll / internal poll |
| 民調封關 | polling blackout |
| 政見 / 政見發表 | policy pledge / policy speech |
| 支票（開支票） | promises (writing blank checks) |
| 凍蒜 | Dong-suan! (Taiwanese for "get elected!") — keep "Dong-suan" in exclamations |
| 走路工 / 買票 | "walking money" / vote buying |
| 颱風假 | typhoon day off |
| X國 | Country X |
| 擺爛 / 已讀不回 | slacking off / left on read |
| 爆肝 | burning out (literally "exploding liver"; keep the liver joke where possible) |
| 成就老闆 | build up the boss |
| 結局 / 結局圖鑑 | ending / Endings gallery |
| 選戰檢討會 | campaign post-mortem |
| 慢慢來模式 / 極限爆肝模式 | Take-It-Easy mode / Max Burnout mode |
| 連擊 | combo |

## Stat names (UI)
| Chinese | English |
|---|---|
| 聲量 | Buzz |
| 民調好感度 / 好感度 | Favorability |
| 競選資金 / 資金 | Funds |
| 對你的信任 / 信任 | Trust in you / Trust |
| 肝的健康 / 肝 | Liver health / Liver |
| 團隊士氣 / 士氣 | Team morale / Morale |
| 你的信心 / 信心 | Confidence |
| 民心 | Support |
| 良心 | Conscience |
| 作秀 / 作秀指數 | showboating / Showboat meter |
| 私心 | self-interest |

## Character archetypes (TYPES)
A 政治世家第三代 = third-generation political heir · B 清新專業人士 = fresh-faced professional · C 商業帝國老闆 = business tycoon · D 現任市長拚連任 = incumbent mayor seeking re-election · E 黨內推舉的資深黨員 = party veteran picked by the party · F 草根律師・議會戰神 = grassroots lawyer, council firebrand
