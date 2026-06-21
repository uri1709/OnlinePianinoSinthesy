// В начале вашего скрипта или в свойства класса
const editCheck = document.getElementById("edit-mode-check");
const editTools = document.getElementById("edit-tools");
const canvasEl = document.getElementById("visual-canvas");

let isEditMode = false;
let scrollDebounceTimer = null; // Таймер задержки старта после скролла

// Слушатель переключателя
editCheck.addEventListener("change", (e) => {
    isEditMode = e.target.checked;

    if (isEditMode) {
        editTools.style.display = "inline-flex";
        canvasEl.classList.add("edit-active");
    } else {
        editTools.style.display = "none";
        canvasEl.classList.remove("edit-active");
    }
});

// Логика блокировки: вызывайте это в вашей функции обновления UI (где кнопки Play/Stop)
function updateEditButtonState(isPlaying, isPaused) {
    // Кнопка доступна ТОЛЬКО если песня полностью остановлена
    const canEdit = !isPlaying && !isPaused;

    editCheck.disabled = !canEdit;
    if (!canEdit) {
        editCheck.checked = false;
        isEditMode = false;
        editTools.style.display = "none";
        canvasEl.classList.remove("edit-active");
    }

    // Визуально приглушаем, если недоступно
    editCheck.parentElement.style.opacity = canEdit ? "1" : "0.3";
}

const MIDI_INSTRUMENTS = [
    "Acoustic Grand Piano",
    "Bright Acoustic Piano",
    "Electric Grand Piano",
    "Honky-tonk Piano",
    "Electric Piano 1",
    "Electric Piano 2",
    "Harpsichord",
    "Clavi",
    "Celesta",
    "Glockenspiel",
    "Music Box",
    "Vibraphone",
    "Marimba",
    "Xylophone",
    "Tubular Bells",
    "Dulcimer",
    "Drawbar Organ",
    "Percussive Organ",
    "Rock Organ",
    "Church Organ",
    "Reed Organ",
    "Accordion",
    "Harmonica",
    "Tango Accordion",
    "Acoustic Guitar (nylon)",
    "Acoustic Guitar (steel)",
    "Electric Guitar (jazz)",
    "Electric Guitar (clean)",
    "Electric Guitar (muted)",
    "Overdriven Guitar",
    "Distortion Guitar",
    "Guitar harmonics",
    "Acoustic Bass",
    "Electric Bass (finger)",
    "Electric Bass (pick)",
    "Fretless Bass",
    "Slap Bass 1",
    "Slap Bass 2",
    "Synth Bass 1",
    "Synth Bass 2",
    "Violin",
    "Viola",
    "Cello",
    "Contrabass",
    "Tremolo Strings",
    "Pizzicato Strings",
    "Orchestral Harp",
    "Timpani",
    "String Ensemble 1",
    "String Ensemble 2",
    "SynthStrings 1",
    "SynthStrings 2",
    "Choir Aahs",
    "Voice Oohs",
    "Synth Voice",
    "Orchestra Hit",
    "Trumpet",
    "Trombone",
    "Tuba",
    "Muted Trumpet",
    "French Horn",
    "Brass Section",
    "SynthBrass 1",
    "SynthBrass 2",
    "Soprano Sax",
    "Alto Sax",
    "Tenor Sax",
    "Baritone Sax",
    "Oboe",
    "English Horn",
    "Bassoon",
    "Clarinet",
    "Piccolo",
    "Flute",
    "Recorder",
    "Pan Flute",
    "Blown Bottle",
    "Shakuhachi",
    "Whistle",
    "Ocarina",
    "Lead 1 (square)",
    "Lead 2 (sawtooth)",
    "Lead 3 (calliope)",
    "Lead 4 (chiff)",
    "Lead 5 (charang)",
    "Lead 6 (voice)",
    "Lead 7 (fifths)",
    "Lead 8 (bass + lead)",
    "Pad 1 (new age)",
    "Pad 2 (warm)",
    "Pad 3 (polysynth)",
    "Pad 4 (choir)",
    "Pad 5 (bowed)",
    "Pad 6 (metallic)",
    "Pad 7 (halo)",
    "Pad 8 (sweep)",
    "FX 1 (rain)",
    "FX 2 (soundtrack)",
    "FX 3 (crystal)",
    "FX 4 (atmosphere)",
    "FX 5 (brightness)",
    "FX 6 (goblins)",
    "FX 7 (echoes)",
    "FX 8 (sci-fi)",
    "Sitar",
    "Banjo",
    "Shamisen",
    "Koto",
    "Kalimba",
    "Bag pipe",
    "Fiddle",
    "Shanai",
    "Tinkle Bell",
    "Agogo",
    "Steel Drums",
    "Woodblock",
    "Taiko Drum",
    "Melodic Tom",
    "Synth Drum",
    "Reverse Cymbal",
    "Guitar Fret Noise",
    "Breath Noise",
    "Seashore",
    "Bird Tweet",
    "Telephone Ring",
    "Helicopter",
    "Applause",
    "Gunshot",
];
const BASE_PALETTES = [
    "#8B0000",
    "#FF0000",
    "#FF8C00",
    "#FFFF00",
    "#008000",
    "#00CED1",
    "#0000FF",
    "#8A2BE2",
    "#CD853F",
    "#FFB6C1",
    "#FFD700",
    "#F5F5DC",
    "#ADFF2F",
    "#87CEEB",
    "#6A5ACD",
    "#D8BFD8",
    "#00FF00",
    "#FF00FF",
];

// var objMusic = {
//     NameSong: "Mortal combat", // имя песни
//     bpm: 130,
//     notesSong: [
//         {
//             numTact: 1,
//             pos: 0,
//             note: "ЛЯ3",
//             length: 4,
//             idInstrument: 25,
//             nameInstrument: "Acoustic Guitar (steel)",
//         },
//     ],

// };

var objPianino = {
    mapNotes: {
        ДО: "C",
        РЕБИМОЛЬ: "C#",
        РЕ: "D",
        МИБИМОЛЬ: "D#",
        МИ: "E",
        ФА: "F",
        СОЛЬБИМОЛЬ: "F#",
        СОЛЬ: "G",
        ЛЯБИМОЛЬ: "G#",
        ЛЯ: "A",
        СИБИМОЛЬ: "A#",
        СИ: "B",
    },
    names: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],

    // Настройки сетки и редактирования
    stepSnapping: 0.25, // Шаг сетки (1/4 такта)
    activeNote: null, // Ссылка на редактируемую ноту
    isDrawing: false, // Флаг процесса рисования

    keyWidth: 0,
    keysPianino: [],

    countNotes: 85,

    // Переменные для хранения позиции виртуального курсора (в пикселях холста)
    gridCursorX: 0,
    gridCursorY: 0,
    // Флаг, находится ли мышь внутри холста
    isMouseInCanvas: false,

    cvsWidth: 0,
    cvsHeight: 0,

    ctx: null,
    cvs: null,
    cvsCtx: null,
    currentPosition: -4,
    isPlaying: false,
    isPaused: false,
    learningMode: false,
    loopMode: false, //зациклить

    NameSong: "Mortal combat", // имя песни
    bpm: 130,

    pixelsPerQuarter: 120,
    maxPos: 0,
    notesSong: [],
    activeInstruments: new Set(),
    instColors: {},
    octaveOffset: 24, // 0,12,24,36,48,60

    _baseCodes: [
        { id: 0, key: "ShiftLeft" },
        { id: 1, key: "KeyA" },
        { id: 2, key: "KeyZ" },
        { id: 3, key: "KeyS" },
        { id: 4, key: "KeyX" },
        { id: 5, key: "KeyC" },
        { id: 6, key: "KeyF" },
        { id: 7, key: "KeyV" },
        { id: 8, key: "KeyG" },
        { id: 9, key: "KeyB" },
        { id: 10, key: "KeyH" },
        { id: 11, key: "KeyN" },
        { id: 12, key: "Tab" },
        { id: 13, key: "Digit1" },
        { id: 14, key: "KeyQ" },
        { id: 15, key: "Digit2" },
        { id: 16, key: "KeyW" },
        { id: 17, key: "KeyE" },
        { id: 18, key: "Digit4" },
        { id: 19, key: "KeyR" },
        { id: 20, key: "Digit5" },
        { id: 21, key: "KeyT" },
        { id: 22, key: "Digit6" },
        { id: 23, key: "KeyY" },
        { id: 24, key: "KeyU" },
        { id: 25, key: "Digit8" },
        { id: 26, key: "KeyI" },
        { id: 27, key: "Digit9" },
        { id: 28, key: "KeyO" },
        { id: 29, key: "KeyP" },
        { id: 30, key: "Minus" },
        { id: 31, key: "BracketLeft" },
        { id: 32, key: "Equal" },
        { id: 33, key: "BracketRight" },
        { id: 34, key: "Backspace" },
        { id: 35, key: "Backslash" },
        { id: 36, key: "Enter" },
    ],

    initInputBpm() {
        const bpmInput = document.getElementById("bpm-input");
        if (bpmInput) {
            bpmInput.value = this.bpm;
        }
    },
    initInputNameSong() {
        const elNameSong = document.getElementById("song-name-input");
        if (elNameSong) {
            elNameSong.value = this.NameSong;
        }
    },

    // 1. Метод генерации списка песен при загрузке страницы
    initSongSelector() {
        const selectEl = document.getElementById("song-database-select");
        if (!selectEl || typeof arrObjMusic === "undefined") return;

        selectEl.innerHTML = ""; // Очищаем

        arrObjMusic.forEach((song, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${song.NameSong} (${song.bpm} BPM)`;

            selectEl.appendChild(option);
        });
    },

    // 2. Метод смены активной песни
    selectSongFromDatabase(index) {
        if (!arrObjMusic[index]) return;

        // Останавливаем воспроизведение, если оно шло
        if (typeof this.stop === "function") {
            this.stop();
        }

        // Глубокое копирование объекта, чтобы изменения в редакторе не портили исходный массив
        objMusic = JSON.parse(JSON.stringify(arrObjMusic[index]));

        // Синхронизируем внутренние переменные приложения (если они используются отдельно)
        this.NameSong = objMusic.NameSong;
        this.bpm = objMusic.bpm;

        // Обновляем поля ввода на форме
        const nameInput = document.getElementById("song-name-input");
        if (nameInput) nameInput.value = objMusic.NameSong;

        const bpmInput = document.getElementById("bpm-input");
        if (bpmInput) bpmInput.value = objMusic.bpm;

        // Обновляем текстовое поле JSON-редактора
        const editorArea = document.getElementById("editor-area");
        if (editorArea) {
            editorArea.value = JSON.stringify(objMusic.notesSong, null, 2);
        }

        // Вызываем вашу внутреннюю функцию для перерисовки канваса / обновления нот в самом плеере
        // Название функции зависит от вашей архитектуры (например, загрузка нот в буфер)
        if (typeof this.updateSongFromEditor === "function") {
            this.updateSongFromEditor();
        } else if (typeof this.loadNotes === "function") {
            this.loadNotes();
        }
    },

    fillTable() {
        const body = document.getElementById("notes-table-body");
        body.innerHTML = "";
        this.keysPianino.forEach((n, i) => {
            const tr = document.createElement("tr");

            const latinName = n.name.replace(/[0-9]/g, "");
            const octave = n.name.replace(/[^0-9]/g, "");
            const russianNoteName = Object.keys(this.mapNotes).find(
                (key) => this.mapNotes[key] === latinName,
            );

            const finalNoteName = (russianNoteName || "ДО") + octave;

            // <td><input type="text" value="${n.name}" oninput="objPianino.keysPianino[${i}].name=this.value"></td>

            tr.innerHTML = `
                                                <td>${n.id}</td>
                                                <td><input type="text" value="${finalNoteName}" oninput="objPianino.keysPianino[${i}].name=this.value"></td>
                                                <td><input type="number" value="${n.freq}" oninput="objPianino.notkeysPianinoes[${i}].freq=parseFloat(this.value)"></td>
                                                <td><input id="inp-key-${i}" class="input-key" value="${n.code}" readonly placeholder="Нажми клавишу..." onkeydown="objPianino.captureKey(event, ${i})"></td>
                                                <td><button class="btn btn-clear" onclick="objPianino.clearSingleKey(${i})">Очистить</button></td>
                                            `;
            body.appendChild(tr);
        });
    },

    // Добавьте этот метод внутрь объекта objPianino
    drawSongTitle() {
        const ctx = this.cvsCtx; // Используем контекст из вашего объекта
        const h = this.cvsHeight;
        const w = this.cvsWidth;

        // 1. ПОЛУЧАЕМ ТЕКСТ ИЗ ИНПУТА РЕДАКТОРА
        const nameInput = document.getElementById("song-name-input");
        const textToShow = nameInput ? nameInput.value.trim() : "";

        // 2. УСЛОВИЕ: Рисуем только если текст есть и текущая позиция <= 2 долей (четвертей)
        if (textToShow && this.currentPosition <= -2) {
            ctx.save();

            // Стили текста (Segoe UI, как на вашем скриншоте)
            ctx.font = "24px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";

            // Измеряем ширину, чтобы рамка подстраивалась под длину текста
            const textMetrics = ctx.measureText(textToShow);
            const textWidth = textMetrics.width;
            const textHeight = 24; // Высота шрифта

            const paddingX = 40;
            const paddingY = 25;
            const rectWidth = textWidth + paddingX * 2;
            const rectHeight = textHeight + paddingY * 2;

            // Центрируем плашку по горизонтали (X)
            const rectX = (w - rectWidth) / 2;

            // 3. РАСЧЕТ ВЕРТИКАЛЬНОЙ ПОЗИЦИИ (Y) ОТНОСИТЕЛЬНО ВТОРОЙ ЧЕТВЕРТИ НУЛЕВОГО ТАКТА
            // В вашей системе (см. метод drawHorizontalTact): абсолютная позиция = t * beatsPerTact.
            // Нулевой такт, 2-я четверть — это абсолютная позиция 2.
            const targetPosition = -2;

            // Вычисляем Y по вашей оригинальной формуле движения сетки
            const rectY =
                h -
                (targetPosition - this.currentPosition) *
                    this.pixelsPerQuarter -
                rectHeight;

            // Отрисовываем, только если плашка находится в видимой зоне экрана
            if (rectY + rectHeight > 0 && rectY < h) {
                // А. Черный фон плашки с легкой прозрачностью
                ctx.fillStyle = "rgba(10, 10, 10, 0.95)";
                ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

                // Б. Тонкая светлая рамка по периметру
                ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
                ctx.lineWidth = 1;
                ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);

                // В. Белый текст названия песни
                ctx.fillStyle = "#ffffff";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // Пишем текст ровно в центр движущегося прямоугольника
                ctx.fillText(
                    textToShow,
                    rectX + rectWidth / 2,
                    rectY + rectHeight / 2,
                );
            }

            ctx.restore();
        }
    },

    clearSingleKey(i) {
        this.keysPianino[i].code = "";
        document.getElementById("inp-key-" + i).value = "";
    },

    captureKey(e, i) {
        e.preventDefault();
        this.keysPianino[i].code = e.code;
        e.target.value = e.code;
    },

    // Добавьте это как метод внутри objPianino
    pixelsToTime: function (y) {
        // Формула обратная той, что в вашем отрисовщике (rebuild)
        // Высота канваса минус Y, делим на масштаб и прибавляем текущую прокрутку
        const scale = this.pixelsPerQuarter || 40; // используйте вашу переменную масштаба
        const timeFromBottom = (this.cvs.height - y) / scale;
        return this.currentPosition + timeFromBottom;
    },

    onchangeInputBpm(val) {
        const newBpm = parseInt(val);
        if (!isNaN(newBpm) && newBpm > 0) {
            this.bpm = newBpm;
            //console.log("BPM изменен на:", this.bpm);
        }
    },

    start() {
        // Если плеер полностью остановлен, стартуем из зоны пре-ролла (-2 такта = -8 четвертей)
        if (this.currentPosition >= this.maxPos || this.currentPosition === 0) {
            this.currentPosition = -4;
            this.updateProgressBar();

            // this.currentPosition = 0;
        }

        // Если музыка закончилась, сбрасываем позицию перед стартом
        if (this.currentPosition >= this.maxPos) {
            this.stop();
        }
        if (this.isPaused) {
            this.isPaused = false;
        }
        this.isPlaying = true;
    },

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
    },

    stop() {
        this.isPlaying = false;
        // this.currentPosition = 0;
        this.currentPosition = -4;
        this.updateProgressBar();

        // Сбрасываем статус прохождения для всех нот
        this.notesSong.forEach((m) => (m.passed = false));
    },

    formatTime(totalSeconds) {
        if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.floor(totalSeconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
    updateProgressBar() {
        const progressFill = document.getElementById("progress-fill");

        const timeDisplay = document.getElementById("time-display");

        if (this.maxPos > 0) {
            const percentage = (this.currentPosition / this.maxPos) * 100;
            if (progressFill)
                progressFill.style.width = Math.min(percentage, 100) + "%";

            // Расчет времени на основе BPM (такты в секунды)
            const currentSeconds = (this.currentPosition * 60) / this.bpm;
            const totalSeconds = (this.maxPos * 60) / this.bpm;

            if (timeDisplay) {
                timeDisplay.innerText = `${this.formatTime(currentSeconds)} / ${this.formatTime(totalSeconds)}`;
            }
        }
    },
    adjustColor(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        r = Math.floor(r * (1 - percent));
        g = Math.floor(g * (1 - percent));
        b = Math.floor(b * (1 - percent));
        return `rgb(${r},${g},${b})`;
    },

    fillInstrumentsTable() {
        const tbody = document.getElementById("tools-container");
        if (!tbody || !MIDI_INSTRUMENTS) return;

        // Формируем строки таблицы на основе вашей константы
        tbody.innerHTML = MIDI_INSTRUMENTS.map(
            (name, index) => `
                                                                    <tr>
                                                                    <td style="color: #888;">${index}</td>
                                                                    <td>${name}</td>
                                                                    </tr>
                                                                `,
        ).join("");
    },
    init() {
        this.cvs = document.getElementById("visual-canvas");
        this.cvsCtx = this.cvs.getContext("2d");

        this.initCtxWidthHeight();
        this.updateSongData();
        this.initInputBpm();
        this.initInputNameSong();
        this.rebuild();
        this.resize();
        this.fillInstrumentsTable();
        this.fillTable();

        this.animate();

        // Добавьте это внутри метода init() объекта objPianino
        // или просто замените старый блок в скрипте:
        canvasEl.addEventListener("wheel", (e) => {
            //if (!isEditMode) return;
            e.preventDefault();

            // 1. ОЧИЩАЕМ ПРЕДЫДУЩИЙ ТАЙМЕР
            // Если пользователь продолжает крутить колесико, этот вызов сбросит прошлую задержку,
            // не давая плееру запуститься раньше времени.
            if (scrollDebounceTimer) {
                clearTimeout(scrollDebounceTimer);
            }

            // 2. Если это самый первый шаг скролла, запоминаем, играла ли песня
            // Используем sessionStorage или временное свойство, чтобы не перезаписывать флаг на каждом тике колеса
            if (objPianino.wasPlayingBeforeScroll === undefined) {
                objPianino.wasPlayingBeforeScroll = objPianino.isPlaying;
            }

            // 3. ПОЛНАЯ ЗАМОРОЗКА: принудительно ставим на паузу на время кручения
            objPianino.isPlaying = false;
            objPianino.isPaused = true;

            const scrollStep = 0.5; // Шаг прокрутки (в тактах)

            // 4. Вычисляем новую позицию курсора времени
            if (e.deltaY > -4) {
                objPianino.currentPosition = Math.max(
                    -4,
                    objPianino.currentPosition - scrollStep,
                );
            } else {
                objPianino.currentPosition += scrollStep;
            }

            // 5. Синхронизируем флаги 'passed' строго под новую позицию курсора
            if (objPianino.notesSong) {
                objPianino.notesSong.forEach((note) => {
                    if (objPianino.currentPosition <= note.absStart) {
                        note.passed = false; // Возвращаем ноту в игру
                    } else {
                        note.passed = true; // Фиксируем пройденной
                    }
                });
            }

            // 6. Перерисовываем интерфейс плеера
            objPianino.rebuild();
            objPianino.updateProgressBar();

            // 7. ЗАПУСКАЕМ ЗАДЕРЖКУ НА 0.3 СЕКУНДЫ (300 мс)
            // Этот код сработает ТОЛЬКО тогда, когда колесико мыши полностью остановится
            scrollDebounceTimer = setTimeout(() => {
                // Если песня играла до того, как мы начали скроллить — возвращаем её в режим PLAY
                if (objPianino.wasPlayingBeforeScroll) {
                    objPianino.isPlaying = true;
                    objPianino.isPaused = false;
                }

                // Сбрасываем временную переменную состояния
                delete objPianino.wasPlayingBeforeScroll;

                console.log(
                    "Задержка 0.3с прошла, плеер восстановил статус воспроизведения.",
                );
            }, 300);
        });

        // Вставляем внутри objPianino.init()
        // Используем стрелочные функции, чтобы this всегда указывал на objPianino

        // 1. ОТМЕНА КОНТЕКСТНОГО МЕНЮ (чтобы ПКМ работала как ластик)
        this.cvs.addEventListener("contextmenu", (e) => e.preventDefault());

        // 2. НАЖАТИЕ МЫШИ
        this.cvs.addEventListener("mousedown", (e) => {
            if (!isEditMode) return;

            const rect = this.cvs.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const clickedNoteIndex = Math.floor(
                (x / this.cvs.width) * this.countNotes,
            );
            const keyData = this.keysPianino[clickedNoteIndex];
            if (!keyData || !keyData.name) return;

            const latinName = keyData.name.replace(/[0-9]/g, "");
            const octave = keyData.name.replace(/[^0-9]/g, "");
            const russianNoteName = Object.keys(this.mapNotes).find(
                (key) => this.mapNotes[key] === latinName,
            );
            const finalNoteName = (russianNoteName || "ДО") + octave;

            absoluteTime =
                Math.round(this.pixelsToTime(y) / this.stepSnapping) *
                this.stepSnapping;

            // Система ОТ 1: Делим абсолютное время на 4 четверти и сдвигаем на +1 такт
            const calculatedNumTact = Math.floor(absoluteTime / 4);

            // Локальная позиция внутри этого такта (от 0 до 3.75)
            const localPos = absoluteTime % 4;

            if (e.button === 0) {
                // ЛКМ - Создание ноты
                const newNote = {
                    note: finalNoteName,
                    pos: localPos, // Локальное смещение в такте
                    length: this.stepSnapping,
                    idInstrument: 25,
                    nameInstrument: "Acoustic Guitar (steel)",
                    numTact: calculatedNumTact, // Номер такта (1, 2, 3...)
                };

                // 1. Добавляем в глобальный объект музыки
                objMusic.notesSong.push(newNote);

                // 2. Синхронизируем данные
                this.updateSongData();

                // 3. Привязываем активную ноту для растягивания
                this.activeNote = this.notesSong[this.notesSong.length - 1];
                this.isDrawing = true;
            } else if (e.button === 2) {
                // ПКМ - Удаление ноты
                objMusic.notesSong = objMusic.notesSong.filter((n) => {
                    return !(
                        n.note === finalNoteName &&
                        n.numTact === calculatedNumTact &&
                        Math.abs(n.pos - localPos) < 0.2
                    );
                });
                this.updateSongData();
            }

            this.rebuild();
        });

        // Отслеживаем движение мыши строго НАД ХОЛСТОМ
        this.cvs.addEventListener("mousemove", (e) => {
            if (!isEditMode) return;

            this.isMouseInCanvas = true;
            const rect = this.cvs.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.gridCursorX = mouseX;
            this.gridCursorY = mouseY;

            this.rebuild();
        });

        // 4. ОТПУСКАНИЕ МЫШИ
        window.addEventListener("mouseup", () => {
            if (this.isDrawing) {
                this.isDrawing = false;
                this.activeNote = null;

                // После завершения рисования обновляем текст в редакторе
                this.updateSongData();
                // ЗАТЕМ принудительно перерисовываем, чтобы ноты не исчезали
                this.rebuild();
            }
        });

        window.addEventListener("resize", () => this.resize());
    },

    setOctaveOffset(val) {
        this.octaveOffset = parseInt(val);
        this.rebuild();
    },

    updateSongData() {
        const strJSONNotesSong = JSON.stringify(objMusic.notesSong, null, 4);
        document.getElementById("editor-area").value = strJSONNotesSong;

        this.notesSong = JSON.parse(strJSONNotesSong).map((m) => {
            const absoluteStart = m.numTact * 4 + m.pos;
            return {
                ...m,
                passed: false,
                absStart: absoluteStart,
                idx: -1,
            };
        });
        this.bpm = objMusic.bpm || 130;
        this.NameSong = objMusic.NameSong || "New song";
        this.initInputBpm();
        this.initInputNameSong();

        this.maxPos =
            Math.max(...this.notesSong.map((m) => m.absStart + m.length), 0) ||
            0;
        this.activeInstruments.clear();
        const uniqueIds = Array.from(
            new Set(this.notesSong.map((m) => m.idInstrument)),
        );
        uniqueIds.forEach((id, index) => {
            const base = BASE_PALETTES[index % BASE_PALETTES.length];
            this.instColors[id] = {
                w: base,
                b: this.adjustColor(base, 0.45),
            };
            this.activeInstruments.add(id);
        });
        this.renderSettings();
    },

    rebuild() {
        const whites = [0, 2, 4, 5, 7, 9, 11];
        this.keysPianino = [];

        for (let i = 0; i < this.countNotes; i++) {
            const abs = i; // Это реальный номер ноты в MIDI
            const semi = i % 12;

            this.keysPianino.push({
                id: i,
                name: this.names[semi] + Math.floor(i / 12),
                isWhite: whites.includes(semi),
                freq: 16.35 * Math.pow(2, i / 12),
                // ИЗМЕНЕНИЕ ТУТ: ищем в объекте по номеру ноты abs
                code:
                    this._baseCodes.find(
                        (item) =>
                            // item.id + this.octaveOffset === i, // смещенеи на октаву
                            item.id + this.octaveOffset === i,
                    )?.key ?? "",
            });
        }
        this.notesSong.forEach((m) => {
            //console.log(m);
            let pureNote = m.note.replace(/[0-9]/g, "").toUpperCase();
            let octave = m.note.replace(/\D/g, "");
            m.idx = this.keysPianino.findIndex(
                (n) =>
                    n.name === (this.mapNotes[pureNote] || pureNote) + octave,
            );
        });

        // 1. Отрисовка вашей клавиатуры и текущих нот
        this.renderKb();

        this.fillTable();
    },

    renderKb() {
        const kb = document.getElementById("piano-keyboard");
        if (!kb) return;

        kb.innerHTML = "";

        if (this.cvsWidth === 0) return;
        if (this.cvsHeight === 0) return;

        // Обновляем ширину холста под контейнер
        // const container = this.cvs.parentElement;
        this.cvs.width = this.cvsWidth;
        this.cvs.height = this.cvsHeight;

        // Считаем количество белых клавиш для сетки
        const whiteNotesCount = this.keysPianino.filter(
            (n) => n.isWhite,
        ).length;

        // Ключевой параметр для синхронизации с Canvas
        this.keyWidth = this.cvs.width / whiteNotesCount;

        this.keysPianino.forEach((n) => {
            const el = document.createElement("div");
            el.className = "key " + (n.isWhite ? "white-key" : "black-key");
            el.id = "k-" + n.id;

            // Добавляем текст подсказки (hint)
            const hint = n.code
                ? n.code
                      .replace("Key", "")
                      .replace("Digit", "")

                      .replace("ShiftLeft", "SHFT")
                      .replace("BracketLeft", "[")
                      .replace("BracketRight", "]")
                      .replace("Backslash", "\\")
                      .replace("Minus", "-")
                      .replace("Equal", "=")
                      .replace("Backspace", "<-")
                : "";
            el.innerHTML = `<span class="hint">${hint}</span>`;

            el.onmousedown = (e) => {
                e.preventDefault();
                this.play(n.id);
            };

            if (n.isWhite) {
                // Устанавливаем динамическую ширину для белых клавиш
                el.style.width = this.keyWidth + "px";
                kb.appendChild(el);
            } else {
                // Пропорциональная ширина для черных клавиш
                const bW = this.keyWidth * 0.65;
                el.style.width = bW + "px";

                const wrapper = document.createElement("div");
                wrapper.className = "black-key-wrapper";

                wrapper.appendChild(el);
                kb.appendChild(wrapper);
            }
        });
    },

    renderSettings() {
        const container = document.getElementById("instruments-list");
        container.innerHTML = "";
        const unique = Array.from(
            new Set(this.notesSong.map((m) => m.idInstrument)),
        );
        unique
            .sort((a, b) => a - b)
            .forEach((id) => {
                const m = this.notesSong.find((x) => x.idInstrument === id);
                if (!m) return;
                const colors = this.instColors[id] || {
                    w: "#3498db",
                    b: "#2c3e50",
                };
                const div = document.createElement("div");
                div.className = "inst-item";
                div.innerHTML = `<input type="checkbox" checked onchange="objPianino.toggleInstrument(${id}, this.checked)"> <b style="color:#3498db; width: 40px">#${id}</b> <span style="flex: 1">${m.nameInstrument || "Unknown"}</span><div class="color-previews"><div class="color-preview" style="background: ${colors.w}"></div><div class="color-preview" style="background: ${colors.b}"></div></div>`;
                container.appendChild(div);
            });
    },

    toggleInstrument(id, active) {
        if (active) this.activeInstruments.add(id);
        else this.activeInstruments.delete(id);
    },

    play(id, idInstrument = 0) {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === "suspended") this.ctx.resume();

        const n = this.keysPianino[id];
        if (!n) return;

        // Логика режима обучения...
        if (this.learningMode && this.isPlaying) {
            const targetNote = this.notesSong
                .filter((m) => m.idx === id && !m.passed)
                .sort((a, b) => a.absStart - b.absStart)[0];
            if (targetNote) {
                const dist = targetNote.absStart - this.currentPosition;
                if (dist < 1.0) targetNote.passed = true;
            }
        }

        const el = document.getElementById("k-" + id);
        if (el) {
            el.classList.add("active");
            setTimeout(() => el.classList.remove("active"), 150);
        }

        const now = this.ctx.currentTime;

        // Определяем тип волны в зависимости от группы MIDI инструментов
        let type = "sine";
        if (idInstrument < 8)
            type = "triangle"; // Пианино
        else if (idInstrument >= 16 && idInstrument < 24)
            type = "sawtooth"; // Органы
        else if (idInstrument >= 24 && idInstrument < 32) type = "square"; // Гитары/Бас

        [
            [1, 0.3],
            [2, 0.15],
        ].forEach(([m, v]) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            // console.log(n.freq * m);
            osc.type = type; // Установка типа звучания
            osc.frequency.setValueAtTime(n.freq * m, now);

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(v, now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            osc.connect(gain).connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1);
        });
    },

    drawVerticalGrid() {
        this.cvsCtx.strokeStyle = "#222"; // Цвет линий сетки
        this.cvsCtx.beginPath();

        const whiteNotesCount = this.keysPianino.filter(
            (n) => n.isWhite,
        ).length;

        for (let i = 0; i <= whiteNotesCount; i++) {
            // Координата X линии — это номер белой клавиши умноженный на динамическую ширину
            const x = i * this.keyWidth;
            this.cvsCtx.moveTo(x, 0);
            this.cvsCtx.lineTo(x, this.cvsHeight);
        }
        this.cvsCtx.stroke();
    },
    drawHorizontalTact() {
        const ctx = this.cvsCtx;
        const w = this.cvsWidth;
        const h = this.cvsHeight;

        // Параметры такта
        const beatsPerTact = 4;
        const totalTacts = Math.ceil(this.maxPos / beatsPerTact);

        for (let t = -5; t <= totalTacts; t++) {
            const tactBeatPos = t * beatsPerTact;
            // Текущая Y-координата линии
            const y =
                h -
                (tactBeatPos - this.currentPosition) * this.pixelsPerQuarter;

            // Рисуем только если линия в видимой зоне
            if (y >= -10 && y <= h + 10) {
                ctx.beginPath();

                // --- ЭФФЕКТ ПОДСВЕТКИ ---
                // Если линия пересекает зону "удара" (у самого низа, h)
                const threshold = 10; // дистанция срабатывания подсветки

                //{{
                if (t === 0) {
                    // Настройки стиля линии (Яркий неоново-зеленый цвет)
                    ctx.strokeStyle = "#fff"; // Белый цвет при пересечении
                    ctx.lineWidth = 1.0; // Плотная, хорошо заметная линия
                } else {
                    ctx.strokeStyle = "rgba(100, 100, 100, 0.4)"; // Обычный тусклый цвет
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 0; // Выключаем свечение для обычных линий
                }

                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();

                // Сброс тени для текста, чтобы он не размывался
                ctx.shadowBlur = 0;

                // Номер такта
                ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
                ctx.font = "12px Arial";
                ctx.fillText(t + 1, 15, y - 5);
            }
        }
        // Важно сбросить параметры контекста после цикла
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
    },

    drawSubstrate() {
        const ctx = this.cvsCtx;
        const h = this.cvsHeight;
        const whiteKeys = this.keysPianino.filter((n) => n.isWhite);

        whiteKeys.forEach((n, i) => {
            // Проверяем, входит ли нота в группу ДО, РЕ, МИ, ФА (индексы 0,1,2,3 в октаве)
            // В полной клавиатуре это зависит от остатка деления на 7
            const noteInOctave = i % 7;
            const isGreyZone = noteInOctave < 3; // ДО, РЕ, МИ, ФА

            if (isGreyZone) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; // Очень слабый серый/белый
                ctx.fillRect(
                    //this.paddingLeft + i * this.keyWidth,
                    0 + i * this.keyWidth,
                    0,
                    this.keyWidth,
                    h,
                );
            }
        });
    },

    drawMetrics() {
        const ctx = this.cvsCtx;
        ctx.save(); // Сохраняем состояние контекста
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)"; // Светло-серый текст
        ctx.font = "14px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "left";

        // Вывод BPM и FPS
        ctx.fillText(`${Math.round(this.bpm)} BPM`, 15, 25);
        ctx.fillText(`${this.fps || 0} FPS`, 15, 45);

        ctx.restore();
    },

    // Добавьте этот метод внутрь объекта objPianino
    drawEditCursor() {
        const ctx = this.cvsCtx;
        // Проверяем глобальный флаг редактора и присутствие мыши на холсте
        if (
            typeof isEditMode !== "undefined" &&
            isEditMode &&
            this.isMouseInCanvas &&
            ctx
        ) {
            ctx.save();

            console.log(this.gridCursorX, this.gridCursorY, this.cvsHeight);

            // Задаем сочный и контрастный цвет для прицела
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 1.0;
            ctx.setLineDash([]); // Отключаем любые пунктиры

            // Рисуем вертикальную направляющую (по центру клавиши)
            ctx.beginPath();
            ctx.moveTo(this.gridCursorX, 0);
            ctx.lineTo(this.gridCursorX, this.cvs.height);
            ctx.stroke();

            // Рисуем горизонтальную направляющую (по центру 16-й ноты)
            ctx.beginPath();
            ctx.moveTo(0, this.gridCursorY);
            ctx.lineTo(this.cvs.width, this.gridCursorY);
            ctx.stroke();

            // Рисуем аккуратную центральную точку на пересечении осей
            ctx.fillStyle = "#ff0000";
            ctx.beginPath();
            ctx.arc(this.gridCursorX, this.gridCursorY, 4, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    },

    // Добавьте этот метод внутрь объекта objPianino

    /*render*/
    animate() {
        const ctx = this.cvsCtx;
        if (!ctx) return;

        // --- РАСЧЕТ FPS И DELTA TIME ---
        const now = performance.now();
        // dt — это доля секунды, прошедшая между кадрами (напр. 0.016 для 60fps)
        const dt = this.lastTime ? (now - this.lastTime) / 1000 : 0.016;
        this.lastTime = now;

        // Обновляем FPS раз в полсекунды, чтобы цифры не "прыгали" слишком быстро
        if (!this.fpsNextUpdate || now > this.fpsNextUpdate) {
            this.fps = Math.round(1 / dt);
            this.fpsNextUpdate = now + 500;
        }

        const h = this.cvsHeight,
            w = this.cvsWidth;
        const kb = document.getElementById("piano-keyboard");
        if (!kb) return;

        // 1. ОЧИСТКА И ФОН
        ctx.clearRect(0, 0, w, h);
        this.drawSubstrate(); // Серый фон ДО-МИ
        this.drawVerticalGrid(); // Сетка клавиш
        this.drawHorizontalTact(); // Такты
        this.drawSongTitle();
        this.drawMetrics(); // Текст BPM/FPS
        this.drawEditCursor(); // Прицел

        const kbRect = kb.getBoundingClientRect();
        let blocked = false;

        // 2. ОТРИСОВКА НОТ (Всегда, даже на паузе)

        // Определяем временное «окно» видимости
        const visibleStartTime = this.currentPosition;
        const visibleEndTime =
            this.currentPosition + this.cvsHeight / this.pixelsPerQuarter;

        // Фильтруем массив нот перед отрисовкой
        const visibleNotesSong = this.notesSong.filter((m) => {
            return (
                m.absStart + m.length > visibleStartTime &&
                m.absStart < visibleEndTime
            );
        });

        visibleNotesSong.forEach((m) => {
            if (!this.activeInstruments.has(m.idInstrument)) return;
            const el = document.getElementById("k-" + m.idx);
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const lenPx = m.length * this.pixelsPerQuarter;
            // Позиция ноты зависит от currentPosition
            const y =
                h -
                (m.absStart - this.currentPosition) * this.pixelsPerQuarter -
                lenPx;

            // Режим обучения (пауза, если нота достигла края)
            if (
                this.learningMode &&
                !m.passed &&
                // y + lenPx >= h - lenPx / 2
                y + lenPx >= h - 21
            )
                blocked = true;

            if (y + lenPx > 0 && y < h) {
                const colors = this.instColors[m.idInstrument] || {
                    w: "#fff",
                    b: "#000",
                };
                ctx.fillStyle = this.keysPianino[m.idx].isWhite
                    ? colors.w
                    : colors.b;
                ctx.globalAlpha = m.passed ? 0.2 : 1;

                ctx.beginPath();
                ctx.roundRect(
                    rect.left - kbRect.left,
                    y,
                    rect.width,
                    lenPx - 2,
                    4,
                );
                ctx.fill();
                ctx.globalAlpha = 1;

                // Срабатывание звука
                if (
                    this.isPlaying &&
                    !this.learningMode &&
                    !m.passed &&
                    // y + lenPx >= h - lenPx / 2
                    // y + lenPx >= h - lenPx + 20
                    y + lenPx >= h - 21
                ) {
                    m.passed = true;
                    this.play(m.idx, m.idInstrument);
                }
            }
        });

        // 3. ДВИЖЕНИЕ ВРЕМЕНИ
        if (this.isPlaying && !blocked) {
            // ВАЖНО: Коэффициент (this.bpm / 60) дает количество четвертей в СЕКУНДУ.
            // Умножаем на dt (время кадра), чтобы получить смещение за этот кадр.
            // Если движение кажется медленным, можно добавить множитель скорости.
            const speedMultiplier = 1.0;
            this.currentPosition += (this.bpm / 60) * dt * speedMultiplier;

            if (this.currentPosition > this.maxPos + 2) this.isPlaying = false;

            this.updateProgressBar();
        }

        if (this.currentPosition >= this.maxPos) {
            if (this.loopMode) {
                // Вместо остановки сбрасываем всё к началу
                this.currentPosition = 0;
                this.notesSong.forEach((m) => (m.passed = false));
            }
        }

        requestAnimationFrame(() => this.animate());
    },

    seek(e) {
        const container = document.getElementById("progress-container");
        if (!container || this.maxPos <= 0) return;

        // Определяем положение клика относительно ширины контейнера
        const rect = container.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;

        // Вычисляем новую позицию в треке (в долях/тактах)
        const ratio = clickX / width;
        this.currentPosition = ratio * this.maxPos;

        // Сбрасываем флаги 'passed' у нот, чтобы они могли проиграться снова
        this.notesSong.forEach((m) => {
            m.passed = m.absStart < this.currentPosition;
        });

        // Сразу визуально обновляем шкалу
        this.updateProgressBar();
    },

    exportToMidiFile() {
        const bpm = objMusic.bpm || 130;
        const ticksPerQuarter = 128; // Разрешение (PPQ)

        // Переводим ноты из тактовой системы (numTact, pos) в абсолютные тики
        // 1 такт равен 4 четвертям. Итого: абсолютная позиция = (numTact - 1) * 4 + pos
        let events = [];

        // Карта перевода русских названий нот в MIDI-номера
        const noteToMidiBase = {
            ДО: 0,
            РЕБИМОЛЬ: 1,
            РЕ: 2,
            МИБИМОЛЬ: 3,
            МИ: 4,
            ФА: 5,
            СОЛЬБИМОЛЬ: 6,
            СОЛЬ: 7,
            ЛЯБИМОЛЬ: 8,
            ЛЯ: 9,
            СИБИМОЛЬ: 10,
            СИ: 11,
        };

        objMusic.notesSong.forEach((n) => {
            // Парсим имя русской ноты и октаву (например: "ЛЯ3" -> "ЛЯ", "3")
            const match = n.note.match(/^([А-Я]+)([0-9]+)$/);
            if (!match) return;

            const noteName = match[1];
            const octave = parseInt(match[2], 10);

            // В MIDI Нота C4 (ДО4) обычно имеет номер 60. Формула: (Октава + 1) * 12 + Смещение ноты
            const midiNumber = (octave + 1) * 12 + noteToMidiBase[noteName];

            const startQuarter = (n.numTact - 1) * 4 + n.pos;
            const endQuarter = startQuarter + (n.length || 1);

            const startTick = Math.round(startQuarter * ticksPerQuarter);
            const endTick = Math.round(endQuarter * ticksPerQuarter);

            events.push({
                type: "on",
                tick: startTick,
                note: midiNumber,
                instrument: n.idInstrument || 0,
            });
            events.push({
                type: "off",
                tick: endTick,
                note: midiNumber,
                instrument: n.idInstrument || 0,
            });
        });

        // Сортируем события по времени (тикам)
        events.sort((a, b) => a.tick - b.tick);

        // Собираем трек-данные (MTrk) с дельта-таймами
        let trackBytes = [];
        let lastTick = 0;

        // 1. Установка темпа (BPM) в мета-событие
        trackBytes.push(0x00, 0xff, 0x51, 0x03);
        const microsecondsPerQuarter = Math.round(60000000 / bpm);
        trackBytes.push((microsecondsPerQuarter >> 16) & 0xff);
        trackBytes.push((microsecondsPerQuarter >> 8) & 0xff);
        trackBytes.push(microsecondsPerQuarter & 0xff);

        // Инициализируем инструмент (если в песне используется определенный)
        let currentInstrument = -1;

        // 2. Запись событий
        events.forEach((ev) => {
            let delta = ev.tick - lastTick;
            lastTick = ev.tick;

            // Запись Delta-Time в формате Variable Length Quantity (VLQ)
            let buffer = [];
            let v = delta;
            buffer.push(v & 0x7f);
            while (v >> 7 > 0) {
                v = v >> 7;
                buffer.push((v & 0x7f) | 0x80);
            }
            buffer.reverse().forEach((b) => trackBytes.push(b));

            // Смена инструмента (Program Change), если изменился
            if (ev.instrument !== currentInstrument) {
                currentInstrument = ev.instrument;
                trackBytes.push(0xc0, currentInstrument); // 0xC0 = Смена программы на 0-м канале
                trackBytes.push(0x00); // Нулевой дельта-тайм для следующей ноты
            }

            // Запись Note On / Note Off
            if (ev.type === "on") {
                trackBytes.push(0x90, ev.note, 0x60); // 0x90 = Note On, 0x60 = Velocity (Громкость 96)
            } else {
                trackBytes.push(0x80, ev.note, 0x40); // 0x80 = Note Off
            }
        });

        // Конец трека (Meta End of Track)
        trackBytes.push(0x00, 0xff, 0x2f, 0x00);

        // Сборка заголовка файла (MThd)
        let fileBytes = [
            0x4d,
            0x54,
            0x68,
            0x64, // "MThd"
            0x00,
            0x00,
            0x00,
            0x06, // Длина заголовка (всегда 6)
            0x00,
            0x00, // Формат 0 (один трек)
            0x00,
            0x01, // Количество треков (1)
            (ticksPerQuarter >> 8) & 0xff,
            ticksPerQuarter & 0xff, // Разрешение (PPQ)
        ];

        // Заголовок трека (MTrk) + длина данных трека
        let trackHeader = [
            0x4d,
            0x54,
            0x72,
            0x6b, // "MTrk"
            (trackBytes.length >> 24) & 0xff,
            (trackBytes.length >> 16) & 0xff,
            (trackBytes.length >> 8) & 0xff,
            trackBytes.length & 0xff,
        ];

        // Финальный массив байт
        const finalMidiBytes = new Uint8Array(
            fileBytes.concat(trackHeader, trackBytes),
        );

        // Скачивание бинарного файла через Blob
        const blob = new Blob([finalMidiBytes], {
            type: "audio/midi",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${objMusic.NameSong || "song"}.mid`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    importMidi(input) {
        if (!input.files || !input.files.length) return;

        const file = input.files[0]; // Сохраняем ссылку на файл для имени по умолчанию

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new DataView(e.target.result);
                if (data.getUint32(0) !== 0x4d546864)
                    throw new Error("Не MIDI файл");

                const tpq = data.getUint16(12);
                let offset = 14;
                const newNotesSong = [];
                let detectedTitle = ""; // Переменная для хранения найденного названия
                let newBpm = 120;

                // Храним инструменты для каждого из 16 каналов (по умолчанию 0 - Piano)
                const channelInstruments = new Array(16).fill(0);
                const revMap = {
                    0: "ДО",
                    1: "РЕБИМОЛЬ",
                    2: "РЕ",
                    3: "МИБИМОЛЬ",
                    4: "МИ",
                    5: "ФА",
                    6: "СОЛЬБИМОЛЬ",
                    7: "СОЛЬ",
                    8: "ЛЯБИМОЛЬ",
                    9: "ЛЯ",
                    10: "СИБИМОЛЬ",
                    11: "СИ",
                };

                while (offset < data.byteLength) {
                    const chunkType = data.getUint32(offset);
                    const chunkLen = data.getUint32(offset + 4);
                    offset += 8;

                    if (chunkType === 0x4d54726b) {
                        let trackEnd = offset + chunkLen;
                        let currentTick = 0;
                        let lastStatus = 0;
                        const activeNotes = {}; // Ключ теперь будет "нота_канал"

                        while (offset < trackEnd) {
                            let delta = 0;
                            while (true) {
                                let b = data.getUint8(offset++);
                                delta = (delta << 7) | (b & 0x7f);
                                if (!(b & 0x80)) break;
                            }
                            currentTick += delta;

                            let status = data.getUint8(offset);
                            if (status < 0x80) {
                                status = lastStatus;
                            } else {
                                lastStatus = status;
                                offset++;
                            }

                            const type = status >> 4;
                            const channel = status & 0x0f;

                            if (type === 0x9 || type === 0x8) {
                                // Ноты
                                const noteNum = data.getUint8(offset++);
                                const vel = data.getUint8(offset++);
                                const noteKey = noteNum + "_" + channel; // Уникальный ключ для канала

                                if (type === 0x9 && vel > 0) {
                                    activeNotes[noteKey] = {
                                        tick: currentTick,
                                        inst:
                                            channel === 9
                                                ? 128
                                                : channelInstruments[channel], // 9 канал - ударные
                                    };
                                } else if (activeNotes[noteKey]) {
                                    const start = activeNotes[noteKey].tick;
                                    const instId = activeNotes[noteKey].inst;
                                    newNotesSong.push({
                                        numTact: Math.floor(start / (tpq * 4)),
                                        pos: Number(
                                            ((start % (tpq * 4)) / tpq).toFixed(
                                                2,
                                            ),
                                        ),
                                        note:
                                            revMap[noteNum % 12] +
                                            (Math.floor(noteNum / 12) - 1),
                                        length: Number(
                                            (
                                                (currentTick - start) /
                                                tpq
                                            ).toFixed(2),
                                        ),
                                        idInstrument: instId,
                                        nameInstrument:
                                            MIDI_INSTRUMENTS[instId] ||
                                            "Instrument " + instId,
                                    });
                                    delete activeNotes[noteKey];
                                }
                            } else if (type === 0xc) {
                                // Смена инструмента на канале
                                channelInstruments[channel] = data.getUint8(
                                    offset++,
                                );
                            } else if (status === 0xf0 || status === 0xf7) {
                                // SysEx
                                let len = 0;
                                while (true) {
                                    let b = data.getUint8(offset++);
                                    len = (len << 7) | (b & 0x7f);
                                    if (!(b & 0x80)) break;
                                }
                                offset += len;
                            } else if (status === 0xff) {
                                // Meta
                                const metaType = data.getUint8(offset++);

                                let len = 0;
                                while (true) {
                                    let b = data.getUint8(offset++);
                                    len = (len << 7) | (b & 0x7f);
                                    if (!(b & 0x80)) break;
                                }

                                if (metaType === 0x51 && len === 3) {
                                    const mpqn =
                                        (data.getUint8(offset) << 16) |
                                        (data.getUint8(offset + 1) << 8) |
                                        data.getUint8(offset + 2);
                                    newBpm = Math.round(60000000 / mpqn);
                                }
                                offset += len;
                            } else if (
                                type === 0xa ||
                                type === 0xb ||
                                type === 0xe
                            ) {
                                offset += 2;
                            } else if (type === 0xd) {
                                offset += 1;
                            }
                        }
                    } else {
                        offset += chunkLen;
                    }
                }

                objMusic.notesSong = newNotesSong;
                objMusic.bpm = newBpm;
                objMusic.NameSong =
                    detectedTitle || file.name.replace(/\.[^/.]+$/, "");

                this.updateSongData();
                this.rebuild();

                objPianino.updateSongFromEditor();
                alert("Импорт завершен! Найдено нот: " + newNotesSong.length);
            } catch (err) {
                console.error(err);
                alert("Ошибка MIDI: " + err.message);
            }
        };
        reader.readAsArrayBuffer(input.files[0]);

        //this.currentPosition = -8;
    },

    updateSongFromEditor() {
        try {
            objMusic.notesSong = JSON.parse(
                document.getElementById("editor-area").value,
            );
            this.updateSongData();
            this.rebuild();
            this.currentPosition = -4;
            this.updateProgressBar();

            //this.currentPosition = -4;
            this.isPlaying = false;
        } catch (e) {
            alert("JSON Error!");
        }
    },

    startWithCountdown() {
        this.notesSong.forEach((m) => (m.passed = false));

        this.currentPosition = 0;
        //this.currentPosition = -4;
        this.isPlaying = true;
    },

    initCtxWidthHeight() {
        const container = this.cvs.parentElement;
        // Get the container's width and height
        this.cvsWidth = container.clientWidth;
        this.cvsHeight = container.clientHeight;
        // Set the canvas width and height
        this.cvs.width = this.cvsWidth;
        this.cvs.height = this.cvsHeight;

        // ctx = canvasEl ? canvasEl.getContext("2d") : null;
    },

    resize() {
        this.initCtxWidthHeight();

        this.renderKb();
    },

    switchTab(tabId, btn) {
        // 1. Скрываем все вкладки
        document
            .querySelectorAll(".tab-content")
            .forEach((t) => t.classList.remove("active"));
        // 2. Деактивируем все кнопки
        document
            .querySelectorAll(".tab-btn")
            .forEach((b) => b.classList.remove("active"));

        // 3. Активируем нужную вкладку и кнопку
        document.getElementById(tabId).classList.add("active");
        btn.classList.add("active");

        // 4. Если переключились на пианино, обновляем размер канваса
        if (tabId === "piano-tab") {
            this.resize();
        }
    },
};

function saveMusicToJSON() {
    // Перед сохранением забираем актуальное имя из input
    objMusic.NameSong =
        document.getElementById("song-name-input").value || "Без названия";

    const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(objMusic, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${objMusic.NameSong}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function loadMusicFromJSON(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed && parsed.notesSong) {
                objMusic.notesSong = parsed.notesSong;
                objMusic.bpm = parsed.bpm || 130;
                objMusic.NameSong =
                    parsed.NameSong || file.name.replace(".json", "");

                // Обновляем UI элементов
                document.getElementById("song-name-input").value =
                    objMusic.NameSong;
                if (document.getElementById("bpm-input")) {
                    document.getElementById("bpm-input").value = objMusic.bpm;
                }
                if (document.getElementById("editor-area")) {
                    document.getElementById("editor-area").value =
                        JSON.stringify(objMusic.notesSong, null, 2);
                }

                // Переинициализируем трек в плеере
                if (
                    typeof objPianino !== "undefined" &&
                    objPianino.updateSongFromEditor
                ) {
                    objPianino.updateSongFromEditor();
                }
                alert("JSON успешно загружен!");
            }
        } catch (err) {
            alert("Ошибка чтения JSON файла");
        }
    };
    reader.readAsText(file);
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement
            .requestFullscreen()
            .catch((err) => console.error(`Ошибка: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
}

// Обновление размеров интерфейса при смене режима
document.addEventListener("fullscreenchange", () => {
    if (typeof objPianino !== "undefined") {
        if (objPianino.resize) objPianino.resize();
        if (objPianino.initCtxWidthHeight) objPianino.initCtxWidthHeight();
    }
});

// 3. Вызов инициализации при загрузке документа
document.addEventListener("DOMContentLoaded", () => {
    objPianino.initSongSelector();
    // Принудительно триггерим загрузку первой песни, чтобы заполнить textarea и поля ввода
    objPianino.selectSongFromDatabase(0);
});

//{{Глобальный контекст, выполнение кода

function updateRealVH() {
    // Вычисляем 1% от высоты окна
    let vh = window.innerHeight * 0.01;
    // Записываем значение в переменную --vh
    document.documentElement.style.setProperty("--vh", `${vh}px`);
}

// Запускаем при загрузке
updateRealVH();

// Обновляем при повороте экрана или изменении размера
window.addEventListener("resize", updateRealVH);
// window.onload = () => objPianino.init();
window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    const found = objPianino.keysPianino.find((n) => n.code === e.code);
    if (found && !e.repeat) {
        e.preventDefault();
        objPianino.play(found.id);
    }
});

async function initApp() {
    try {
        // 1. Сначала асинхронно скачиваем все JSON-файлы с песнями
        // await loadSongs();
        // Создаем заглушку в памяти, чтобы objPianino.init() не выдал ошибку из-за null
        arrObjMusic = [
            {
                NameSong: "Загрузка песен...",
                bpm: 120,
                notesSong: [],
            },
        ];
        objMusic = JSON.parse(JSON.stringify(arrObjMusic[0]));

        // 2. Инициализируем сам плеер (настройка холста, таблиц, анимации)
        objPianino.init();

        // 3. Строим выпадающий список <select> на основе загруженного массива
        objPianino.initSongSelector();

        // 4. Загружаем первую песню по умолчанию из базы в плеер
        objPianino.selectSongFromDatabase(0);

        console.log(
            "Приложение успешно инициализировано с динамическими JSON!",
        );
    } catch (error) {
        console.error("Критическая ошибка при старте initApp:", error);
    }

    // --- ПЕРЕХОДИМ К ЗАГРУЗКЕ ПЕСЕН НА ФОНЕ ---
    try {
        console.log("3. Запускаем фоновую загрузку JSON-файлов...");
        await loadSongs();

        // Проверяем, удалось ли скачать хоть один файл
        if (arrObjMusic && arrObjMusic.length > 0) {
            console.log(
                "4. Файлы успешно скачаны! Обновляем селектор и плеер...",
            );

            // Перестраиваем выпадающий список <select>, чтобы в нем появились новые песни
            objPianino.initSongSelector();

            // Автоматически загружаем в плеер первую реальную песню из списка
            objPianino.selectSongFromDatabase(0);
        }
    } catch (loadError) {
        console.warn(
            "Не удалось загрузить песни на фоне, пианино остается работать в пустом режиме:",
            loadError,
        );
    }
}
document.addEventListener("DOMContentLoaded", initApp);

//}}Глобальный контекст, выполнение кода
