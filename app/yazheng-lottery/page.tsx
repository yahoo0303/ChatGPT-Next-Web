"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./lottery.module.scss";

type Prize = {
  id: string;
  name: string;
  qty: number;
};

type DrawResult = {
  prizeId: string;
  prizeName: string;
  winners: string[];
  ts: number;
};

const STORAGE_KEYS = {
  participants: "yazheng-lottery-participants",
  prizes: "yazheng-lottery-prizes",
  results: "yazheng-lottery-results",
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function parseParticipants(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(/\r?\n/) // split lines
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}

function parsePrizes(input: string): Prize[] {
  const lines = input.split(/\r?\n/);
  const result: Prize[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // Try common formats:
    // 1) 名称*数量  2) 名称 x 数量 3) 名称,数量 4) 名称 数量 5) 名称：数量
    let name = line;
    let qty = 1;

    // * or x or X
    let m = line.match(/^(.*?)[\s]*[xX\*：:,，][\s]*(\d+)$/);
    if (m && m[1]) {
      name = m[1].trim();
      qty = Math.max(1, parseInt(m[2] || "1", 10));
    } else {
      // fallback: if last token is integer
      const parts = line.split(/\s+/);
      const maybeQty = parts[parts.length - 1];
      if (/^\d+$/.test(maybeQty)) {
        qty = Math.max(1, parseInt(maybeQty, 10));
        name = parts.slice(0, -1).join(" ").trim();
      }
    }

    if (!name) continue;
    result.push({ id: uid(), name, qty });
  }
  return result;
}

function downloadCSV(filename: string, rows: string[][]) {
  const process = (row: string[]) =>
    row
      .map((v) => {
        const s = v.replace(/"/g, '""');
        if (s.search(/[",\n]/) >= 0) {
          return `"${s}"`;
        }
        return s;
      })
      .join(",");

  const csv = ["\uFEFF" + rows.map(process).join("\n")]; // add BOM for Excel
  const blob = new Blob(csv, { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function YazhengLotteryPage() {
  const [participantInput, setParticipantInput] = useState("");
  const [prizeInput, setPrizeInput] = useState("");

  const [participants, setParticipants] = useState<string[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [results, setResults] = useState<DrawResult[]>([]);

  // load from storage
  useEffect(() => {
    try {
      const ps = localStorage.getItem(STORAGE_KEYS.participants);
      const zs = localStorage.getItem(STORAGE_KEYS.prizes);
      const rs = localStorage.getItem(STORAGE_KEYS.results);
      if (ps) setParticipants(JSON.parse(ps));
      if (zs) setPrizes(JSON.parse(zs));
      if (rs) setResults(JSON.parse(rs));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.participants, JSON.stringify(participants));
    } catch {}
  }, [participants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.prizes, JSON.stringify(prizes));
    } catch {}
  }, [prizes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.results, JSON.stringify(results));
    } catch {}
  }, [results]);

  const winnersSet = useMemo(() => new Set(results.flatMap((r) => r.winners)), [results]);

  const remainingParticipants = useMemo(
    () => participants.filter((p) => !winnersSet.has(p)),
    [participants, winnersSet],
  );

  const totalPrizeCount = useMemo(() => prizes.reduce((s, p) => s + p.qty, 0), [prizes]);

  const pendingPrizes = useMemo(() => {
    const usedPrizeIds = new Set(results.map((r) => r.prizeId));
    return prizes.filter((p) => !usedPrizeIds.has(p.id));
  }, [prizes, results]);

  const handleAddParticipantsAppend = useCallback(() => {
    const parsed = parseParticipants(participantInput);
    const merged = Array.from(new Set([...participants, ...parsed]));
    setParticipants(merged);
  }, [participantInput, participants]);

  const handleAddParticipantsReplace = useCallback(() => {
    const parsed = parseParticipants(participantInput);
    setParticipants(parsed);
  }, [participantInput]);

  const handleAddPrizesAppend = useCallback(() => {
    const parsed = parsePrizes(prizeInput);
    setPrizes((prev) => [...prev, ...parsed]);
  }, [prizeInput]);

  const handleAddPrizesReplace = useCallback(() => {
    const parsed = parsePrizes(prizeInput);
    setPrizes(parsed);
  }, [prizeInput]);

  const shuffle = (arr: string[]) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const drawOne = useCallback(() => {
    if (pendingPrizes.length === 0) return;
    const prize = pendingPrizes[0];

    const available = remainingParticipants.slice();
    if (available.length === 0) return;

    const count = Math.min(prize.qty, available.length);
    const chosen = shuffle(available).slice(0, count);
    setResults((prev) => [
      ...prev,
      { prizeId: prize.id, prizeName: prize.name, winners: chosen, ts: Date.now() },
    ]);
  }, [pendingPrizes, remainingParticipants]);

  const drawAll = useCallback(() => {
    let available = remainingParticipants.slice();
    const newResults: DrawResult[] = [];

    for (const prize of pendingPrizes) {
      if (available.length === 0) break;
      const count = Math.min(prize.qty, available.length);
      available = shuffle(available);
      const chosen = available.slice(0, count);
      available = available.slice(count);
      newResults.push({
        prizeId: prize.id,
        prizeName: prize.name,
        winners: chosen,
        ts: Date.now(),
      });
    }

    if (newResults.length > 0) {
      setResults((prev) => [...prev, ...newResults]);
    }
  }, [pendingPrizes, remainingParticipants]);

  const undoLast = useCallback(() => {
    setResults((prev) => prev.slice(0, -1));
  }, []);

  const resetAll = useCallback(() => {
    if (!confirm("确定要清空抽奖结果吗？")) return;
    setResults([]);
  }, []);

  const removeParticipant = useCallback(
    (name: string) => {
      setParticipants((prev) => prev.filter((p) => p !== name));
    },
    [setParticipants],
  );

  const removePrize = useCallback(
    (id: string) => {
      setPrizes((prev) => prev.filter((p) => p.id !== id));
      // 也应当移除对应的结果
      setResults((prev) => prev.filter((r) => r.prizeId !== id));
    },
    [setPrizes, setResults],
  );

  const exportResults = useCallback(() => {
    const rows: string[][] = [["奖品", "中奖人"]];
    for (const r of results) {
      if (r.winners.length === 0) {
        rows.push([r.prizeName, "-"]);
      } else {
        for (const w of r.winners) {
          rows.push([r.prizeName, w]);
        }
      }
    }
    downloadCSV("雅正口腔抽奖结果.csv", rows);
  }, [results]);

  const totalParticipants = participants.length;
  const drawnCount = results.reduce((s, r) => s + r.winners.length, 0);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>雅正口腔年会抽奖</h1>
        <p className={styles.subtitle}>支持批量导入参与者、奖品及数量，顺序抽取并避免重复中奖</p>
      </header>

      <section className={styles.section}>
        <h2>1. 批量添加参与人员</h2>
        <div className={styles.grid}>
          <textarea
            className={styles.textarea}
            placeholder="每行一个姓名，如：\n张三\n李四\n王五"
            value={participantInput}
            onChange={(e) => setParticipantInput(e.target.value)}
          />
          <div className={styles.actions}>
            <button onClick={handleAddParticipantsAppend} className={styles.btnPrimary}>追加</button>
            <button onClick={handleAddParticipantsReplace} className={styles.btn}>覆盖</button>
            <div className={styles.hint}>当前共 {totalParticipants} 人，未中奖 {remainingParticipants.length} 人</div>
          </div>
        </div>
        {participants.length > 0 && (
          <div className={styles.listBox}>
            <div className={styles.listHeader}>
              <span>已添加的人员（点击姓名可删除）</span>
              <span>共 {participants.length} 人</span>
            </div>
            <div className={styles.chips}>
              {participants.map((p) => (
                <button key={p} className={styles.chip} title="点击删除" onClick={() => removeParticipant(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>2. 批量添加奖品与数量</h2>
        <div className={styles.grid}>
          <textarea
            className={styles.textarea}
            placeholder={
              "支持格式：\n" +
              "电动牙刷*3\n" +
              "小米手环 x 5\n" +
              "京东卡,10\n" +
              "保温杯 2\n" +
              "电影票：20"
            }
            value={prizeInput}
            onChange={(e) => setPrizeInput(e.target.value)}
          />
          <div className={styles.actions}>
            <button onClick={handleAddPrizesAppend} className={styles.btnPrimary}>追加</button>
            <button onClick={handleAddPrizesReplace} className={styles.btn}>覆盖</button>
            <div className={styles.hint}>当前共 {prizes.length} 个奖项，总计 {totalPrizeCount} 份</div>
          </div>
        </div>
        {prizes.length > 0 && (
          <div className={styles.listBox}>
            <div className={styles.listHeader}>
              <span>奖品列表（点击可删除该奖项）</span>
              <span>共 {prizes.length} 项</span>
            </div>
            <ul className={styles.prizeList}>
              {prizes.map((p) => (
                <li key={p.id}>
                  <button className={styles.prizeBtn} onClick={() => removePrize(p.id)}>
                    <span className={styles.prizeName}>{p.name}</span>
                    <span className={styles.prizeQty}>× {p.qty}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2>3. 开始抽奖</h2>
        <div className={styles.controls}>
          <button onClick={drawOne} disabled={pendingPrizes.length === 0 || remainingParticipants.length === 0} className={styles.btnPrimary}>
            抽取下一个奖项
          </button>
          <button onClick={drawAll} disabled={pendingPrizes.length === 0 || remainingParticipants.length === 0} className={styles.btn}>
            全部抽完
          </button>
          <button onClick={undoLast} disabled={results.length === 0} className={styles.btnWarn}>
            撤销上一次
          </button>
          <button onClick={resetAll} disabled={results.length === 0} className={styles.btnDanger}>
            清空结果
          </button>
        </div>
        <div className={styles.stats}>
          <span>已抽出 {drawnCount} 人</span>
          <span>剩余 {remainingParticipants.length} 人</span>
          {totalPrizeCount > participants.length && (
            <span className={styles.warn}>注意：奖品总数多于参与人数，可能会有奖项无人可抽</span>
          )}
        </div>

        {results.length > 0 && (
          <div className={styles.resultsBox}>
            <div className={styles.listHeader}>
              <span>抽奖结果</span>
              <div className={styles.resultActions}>
                <button onClick={exportResults} className={styles.btnSmall}>导出 CSV</button>
              </div>
            </div>
            <ul className={styles.resultList}>
              {results.map((r) => (
                <li key={r.prizeId} className={styles.resultItem}>
                  <div className={styles.resultPrize}>{r.prizeName}</div>
                  <div className={styles.resultWinners}>
                    {r.winners.length > 0 ? (
                      r.winners.map((w) => (
                        <span key={w} className={styles.winnerChip}>
                          {w}
                        </span>
                      ))
                    ) : (
                      <span className={styles.noWinner}>（无人可抽）</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <div>
          © {new Date().getFullYear()} 雅正口腔年会抽奖 — 本页面在浏览器本地运行，不会上传数据。
        </div>
      </footer>
    </div>
  );
}
