// songs.js
// Список путей к файлам с песнями
const songFiles = [
    "./musicjson/mortal_combat.json",
    "./musicjson/Chip & Dale Rescue Rangers - 123 Title Theme [MIDIfind.com].json",
    "./musicjson/Metallica - The Unforgiven.json",
    "./musicjson/Linkin Park — Numb (Piano Version) [MIDIfind.com].json",
    "./musicjson/Aha - Take on Me [MIDIfind.com] - cover  1.json",
    "./musicjson/Муравьева Ирина - Позвони мне, позвони [MIDIfind.com].json",
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
