"use client";

import { useState } from "react";
import {
  Trophy, Bell, Calendar, CalendarDays, ListOrdered,
  ArrowLeft, RotateCcw, Pencil, Trash2, Plus,
  MapPin, ChevronDown, CheckCircle2,
  FileText, Building2, MoreVertical,
  Upload, Filter, Download, Eye, ChevronRight,
  AlertTriangle,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────
const STATUS_CONFIG = {
  planned: { label: "Запланировано",  pill: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  active:  { label: "Уже идёт",       pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  done:    { label: "Завершено",       pill: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" },
};

const PARTICIPANTS = [
  { id: 1, name: "Алексей Петров",  rank: "КМС", region: "Москва",          status: "confirmed" },
  { id: 2, name: "Дмитрий Иванов",  rank: "МС",  region: "Санкт-Петербург", status: "confirmed" },
  { id: 3, name: "Сергей Козлов",   rank: "1р",  region: "Краснодар",       status: "pending"   },
  { id: 4, name: "Андрей Новиков",  rank: "КМС", region: "Казань",          status: "confirmed" },
  { id: 5, name: "Михаил Смирнов",  rank: "МС",  region: "Екатеринбург",    status: "rejected"  },
];

const JUDGES = [
  { id: 1, name: "Владимир Орлов",   role: "Главный судья",   category: "ВК" },
  { id: 2, name: "Наталья Соколова", role: "Судья-секретарь", category: "1к" },
];

const DOCS = [
  { id: 1, name: "Положение о соревновании.pdf", size: "1.2 МБ", date: "12.11.2025" },
  { id: 2, name: "Протокол результатов.pdf",      size: "840 КБ", date: "25.12.2025" },
];

const METRO = [
  { name: "Воробьёвы горы", minutes: 8,  color: "#D92B2B" },
  { name: "Лужники",         minutes: 11, color: "#D92B2B" },
  { name: "Спортивная",      minutes: 15, color: "#D92B2B" },
];

const P_STATUS = {
  confirmed: { label: "Подтверждён",     cls: "text-emerald-700 bg-emerald-50" },
  pending:   { label: "На рассмотрении", cls: "text-amber-700 bg-amber-50"     },
  rejected:  { label: "Отклонён",        cls: "text-red-600 bg-red-50"         },
};

const NAV = [
  { id: "all",    label: "Все соревнования", icon: Trophy       },
  { id: "mine",   label: "Мои соревнования", icon: CalendarDays },
  { id: "apps",   label: "Мои заявки",       icon: ListOrdered  },
];

const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").slice(0, 2);

export function TestPageContent() {
  const [status, setStatus]           = useState("active");
  const [showStatusDrop, setSD]       = useState(false);
  const [showDelete, setShowDelete]   = useState(false);
  const [tab, setTab]                 = useState("participants");
  const [navActive]                   = useState("all");

  const confirmed = PARTICIPANTS.filter((p) => p.status === "confirmed").length;
  const pending   = PARTICIPANTS.filter((p) => p.status === "pending").length;
  const cfg       = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];

  return (
    <div className="flex h-screen bg-[#EDEEF5] overflow-hidden" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ══════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════ */}
      <aside className="w-[272px] flex-shrink-0 flex flex-col bg-white rounded-2xl m-3 mr-0 overflow-hidden shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-black tracking-tight">PWS</span>
            </div>
          </div>
          <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-all">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                ${navActive === id
                  ? "bg-[#EDEEF5] text-gray-900"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
            >
              <Icon className={`w-4 h-4 ${navActive === id ? "text-gray-700" : "text-gray-400"}`} />
              {label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              ДР
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">Дмитрий Р.</p>
              <p className="text-xs text-gray-400">Администратор</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 bg-transparent gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all flex-shrink-0 shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
                <span>Соревнования</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-600 truncate max-w-[280px]">ЧР по лёгкой атлетике 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-gray-900 truncate">Чемпионат России по лёгкой атлетике 2025</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${cfg.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === "active" ? "animate-pulse" : ""}`} />
              {cfg.label}
            </span>

            <div className="relative">
              <button
                onClick={() => setSD(!showStatusDrop)}
                className="flex items-center gap-1.5 h-8 px-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Изменить статус
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {showStatusDrop && (
                <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-30 min-w-[190px]">
                  {Object.entries(STATUS_CONFIG).map(([key, c]) => (
                    <button
                      key={key}
                      onClick={() => { setStatus(key); setSD(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors
                        ${status === key ? "bg-violet-50/70" : ""}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                      <span className={status === key ? "font-semibold text-violet-700" : "text-gray-700"}>{c.label}</span>
                      {status === key && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-violet-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center gap-1.5 h-8 px-3 text-xs text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-medium">
              <Pencil className="w-3.5 h-3.5" /> Редактировать
            </button>

            <button
              onClick={() => setShowDelete(true)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="flex gap-4 h-full">
            <div className="flex-1 min-w-0 flex flex-col gap-4">
              <div className="flex items-center gap-2 -mt-1 flex-wrap">
                <span className="text-xs text-gray-400 font-mono bg-white border border-gray-200 px-2 py-0.5 rounded-lg shadow-sm">#00234</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">Лёгкая атлетика</span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-gray-500">Бег на 100 метров</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">Мужчины</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">Финал</span>
                <span className="text-xs bg-violet-50 text-violet-600 px-2.5 py-0.5 rounded-full font-medium border border-violet-100">Реестр Минспорта</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Всего участников", value: PARTICIPANTS.length, sub: `Ожидают: ${pending}`, accent: false },
                  { label: "Подтверждено",     value: confirmed,           sub: `из ${PARTICIPANTS.length}`, accent: confirmed < PARTICIPANTS.length },
                  { label: "Судьи",            value: JUDGES.length,       sub: "назначено", accent: false },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                    <p className={`text-3xl font-bold ${s.accent ? "text-amber-500" : "text-gray-900"}`}>{s.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-gray-100">
                  <div className="flex gap-0">
                    {[
                      { id: "participants", label: "Участники",        count: PARTICIPANTS.length },
                      { id: "judges",       label: "Судейская бригада", count: JUDGES.length },
                      { id: "docs",         label: "Протоколы",         count: DOCS.length },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px
                          ${tab === t.id
                            ? "border-violet-500 text-violet-700"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                          }`}
                      >
                        {t.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                          ${tab === t.id ? "bg-violet-50 text-violet-600" : "bg-gray-100 text-gray-400"}`}>
                          {t.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pb-3">
                    {tab === "participants" && <>
                      <button className="flex items-center gap-1.5 h-7 px-3 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                        <Filter className="w-3 h-3" /> Фильтр
                      </button>
                      <button className="flex items-center gap-1.5 h-7 px-3 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                        <Plus className="w-3 h-3" /> Добавить
                      </button>
                    </>}
                    {tab === "judges" && (
                      <button className="flex items-center gap-1.5 h-7 px-3 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                        <Plus className="w-3 h-3" /> Назначить
                      </button>
                    )}
                    {tab === "docs" && (
                      <button className="flex items-center gap-1.5 h-7 px-3 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all">
                        <Upload className="w-3 h-3" /> Загрузить
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {tab === "participants" && (
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">Спортсмен</th>
                          <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Разряд</th>
                          <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Регион</th>
                          <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 py-3">Статус</th>
                          <th className="w-10 px-4" />
                        </tr>
                      </thead>
                      <tbody>
                        {PARTICIPANTS.map((p) => {
                          const ps = P_STATUS[p.status as keyof typeof P_STATUS];
                          return (
                            <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                                    {initials(p.name)}
                                  </div>
                                  <span className="text-sm font-medium text-gray-800">{p.name}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{p.rank}</span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">{p.region}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ps.cls}`}>{ps.label}</span>
                              </td>
                              <td className="px-4 py-3">
                                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {tab === "judges" && (
                    <div className="divide-y divide-gray-50">
                      {JUDGES.map((j) => (
                        <div key={j.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0">
                            {initials(j.name)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800">{j.name}</p>
                            <p className="text-xs text-gray-400">{j.role}</p>
                          </div>
                          <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{j.category}</span>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {tab === "docs" && (
                    <div className="divide-y divide-gray-50">
                      {DOCS.map((d) => (
                        <div key={d.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group">
                          <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{d.name}</p>
                            <p className="text-xs text-gray-400">{d.size} · {d.date}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><Download className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-64 flex-shrink-0 flex flex-col gap-3">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">О событии</p>
                </div>

                <div className="divide-y divide-gray-50">
                  <div className="flex gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Период проведения</p>
                      <p className="text-sm font-semibold text-gray-800">15–25 дек. 2025</p>
                      <p className="text-xs text-gray-500">Начало в 10:00</p>
                    </div>
                  </div>

                  <div className="flex gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-0.5">Место проведения</p>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">Олимпийский комплекс «Лужники»</p>
                      <p className="text-xs text-gray-500 mt-0.5">Москва, ул. Лужники, 24</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {METRO.map((m) => (
                          <span key={m.name} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                            {m.name}
                            <span className="text-gray-400">{m.minutes}мин</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Реестр Минспорта</p>
                      <p className="text-sm font-semibold text-emerald-600">Включено</p>
                    </div>
                  </div>

                  <div className="flex gap-3 px-4 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Организатор</p>
                      <p className="text-sm font-semibold text-gray-800">Федерация лёгкой атлетики</p>
                      <p className="text-xs text-gray-400">ИНН 7706175083</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Параметры</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
                  {[
                    { label: "Вид спорта",  value: "Лёгкая атлетика" },
                    { label: "Дисциплина",  value: "Бег 100 м" },
                    { label: "Пол",         value: "Мужчины" },
                    { label: "Формат",      value: "Очное" },
                    { label: "Мест всего",  value: "120" },
                    { label: "Свободно",    value: `${120 - PARTICIPANTS.length}` },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-xs font-semibold text-gray-700 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-base font-bold text-gray-900 text-center mb-1">Удалить соревнование?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Действие необратимо. Все данные участников и протоколы будут удалены навсегда.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                Отмена
              </button>
              <button onClick={() => setShowDelete(false)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold text-white transition-all">
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
