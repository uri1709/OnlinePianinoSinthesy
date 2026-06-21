// songs.js
// Список путей к файлам с песнями
const songFiles = [
    "./musicjson/mortal_combat.json",
    "./musicjson/Chip & Dale Rescue Rangers - 123 Title Theme [MIDIfind.com].json",
    "./musicjson/Metallica - The Unforgiven.json",
    "./musicjson/Linkin Park — Numb (Piano Version) [MIDIfind.com].json",
];

// // Массив объектов песен, откуда приложение будет брать данные
// const arrObjMusic = [];

// // Инициализируем текущую переменную objMusic первой песней по умолчанию
// var objMusic = JSON.parse(JSON.stringify(arrObjMusic[0]));

// Глобальные переменные, которые заполнятся после загрузки
let arrObjMusic = [];
let objMusic = null;

// songs.js

async function loadSongs() {
    let loadedSongs = [];

    for (let file of songFiles) {
        try {
            const res = await fetch(file);
            if (!res.ok) throw new Error(`Статус ${res.status}`);

            const data = await res.json();
            loadedSongs.push(data);
        } catch (error) {
            console.error(`Ошибка чтения файла ${file}:`, error.message);
        }
    }

    // Если мы успешно скачали хотя бы одну песню
    if (loadedSongs.length > 0) {
        // Перезаписываем глобальные переменные реальными данными
        arrObjMusic = loadedSongs;
        objMusic = JSON.parse(JSON.stringify(arrObjMusic));
        console.log(
            `Фоновая загрузка завершена. Песен доступно: ${arrObjMusic.length}`,
        );
    } else {
        throw new Error("Ни один JSON файл не был загружен.");
    }
}

// Функция для асинхронной загрузки всех песен
// async function loadSongs() {

//     try {
//         // // Загружаем все файлы параллельно
//         // const requests = songFiles.map((file) =>
//         //     fetch(file).then((res) => {
//         //         if (!res.ok) throw new Error(`Ошибка загрузки файла: ${file}`);
//         //         return res.json();
//         //     }),
//         // );

//         // Записываем результат в массив
//         arrObjMusic = await Promise.all(requests);

//         // Загружаем все файлы
//         const requests = songFiles.map((file) =>
//             fetch(file)
//                 .then((res) => {
//                     if (!res.ok)
//                         throw new Error(`Ошибка загрузки файла: ${file}`);
//                     return res.json().catch((jsonError) => {
//                         // Если упал конкретный файл, выводим его имя в консоль
//                         console.error(
//                             `Критическая ошибка синтаксиса в файле [ ${file} ]:`,
//                             jsonError.message,
//                         );
//                         return null; // Возвращаем null, чтобы не ломать весь процесс
//                     });
//                 })
//                 .catch((fetchError) => {
//                     console.error(fetchError.message);
//                     return null;
//                 }),
//         );

//         // Ждем выполнения всех запросов
//         const results = await Promise.all(requests);

//         // Отфильтровываем поврежденные файлы (те, что вернули null) и записываем в массив
//         arrObjMusic = results.filter((song) => song !== null);

//         // Проверяем, загрузилось ли хоть что-то
//         if (arrObjMusic.length === 0) {
//             throw new Error(
//                 "Все JSON-файлы в папке повреждены или недоступны.",
//             );
//         }

//         // arrObjMusic = [
//         //     {
//         //         NameSong: "Mortal Kombat",
//         //         bpm: 130,
//         //         notesSong: [
//         //             {
//         //                 numTact: 1,
//         //                 pos: 0,
//         //                 note: "ЛЯ3",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 0.5,
//         //                 note: "ЛЯ3",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 1,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 1.5,
//         //                 note: "ЛЯ3",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 2,
//         //                 note: "РЕ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 2.5,
//         //                 note: "ЛЯ3",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 3,
//         //                 note: "МИ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 3.5,
//         //                 note: "РЕ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 0,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 0.5,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 1,
//         //                 note: "МИ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 1.5,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 2,
//         //                 note: "СОЛЬ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 2.5,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 3,
//         //                 note: "МИ4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 2,
//         //                 pos: 3.5,
//         //                 note: "ДО4",
//         //                 length: 0.38,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //         ],
//         //     },
//         //     {
//         //         NameSong: "Простая Мелодия (Тест)",
//         //         bpm: 90,
//         //         notesSong: [
//         //             {
//         //                 numTact: 1,
//         //                 pos: 0,
//         //                 note: "ДО4",
//         //                 length: 1.0,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 1,
//         //                 note: "МИ4",
//         //                 length: 1.0,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //             {
//         //                 numTact: 1,
//         //                 pos: 2,
//         //                 note: "СОЛЬ4",
//         //                 length: 1.0,
//         //                 idInstrument: 25,
//         //                 nameInstrument: "Acoustic Guitar (steel)",
//         //             },
//         //         ],
//         //     },
//         // ];

//         // Инициализируем текущую песню первой из списка
//         if (arrObjMusic.length > 0) {
//             objMusic = JSON.parse(JSON.stringify(arrObjMusic[0]));
//         }

//         console.log("Все песни успешно загружены:", arrObjMusic);
//     } catch (error) {
//         console.error("Ошибка при инициализации песен:", error);
//     }
// }
