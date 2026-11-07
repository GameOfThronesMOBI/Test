const { chromium } = require('playwright');

(async () => {
    // Включаем цветной вывод в консоль (для логов GitHub)
    console.log("\x1b[36m%s\x1b[0m", "=== ЗАПУСК БОТА ===");
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        viewport: { width: 390, height: 844 } // Эмулируем экран телефона
    });
    const page = await context.newPage();

    // Ловим все ошибки страницы
    page.on('console', msg => console.log(`[БРАУЗЕР] ${msg.text()}`));
    page.on('pageerror', err => console.log(`[ОШИБКА СТРАНИЦЫ] ${err.message}`));

    const GAME_URL = 'https://game-seawar.com/sea';

    try {
        console.log("Заходим на сайт...");
        await page.goto(GAME_URL, { waitUntil: 'networkidle', timeout: 60000 });
        console.log("Сайт загружен. Ждем 10 секунд...");
        await page.waitForTimeout(10000);

        let circle = 0;

        while (true) {
            circle++;
            console.log(`\n\x1b[33m%s\x1b[0m`, `--- КРУГ №${circle} ---`);
            
            try {
                // 1. ПРОВЕРКА НА СМЕРТЬ
                console.log("Ищу кнопку 'В порт' (смерть)...");
                const deadBtn = page.locator('text="В порт", text="Восстановить", input[value="В порт"]');
                if (await deadBtn.count() > 0) {
                    console.log("\x1b[31m%s\x1b[0m", "КОРАБЛЬ РАЗБИТ! Жму 'В порт'...");
                    await deadBtn.first().click({ timeout: 3000 });
                    await page.waitForTimeout(3000);
                    continue;
                }

                // 2. ПРОВЕРКА НА ЛЕЧЕНИЕ
                console.log("Ищу кнопку 'Лечиться'...");
                const healBtn = page.locator('text="Лечиться", text="Лечить", text="Ремонт"');
                if (await healBtn.count() > 0) {
                    console.log("\x1b[32m%s\x1b[0m", "НАШЕЛ ЛЕЧЕНИЕ! Жму...");
                    await healBtn.first().click({ timeout: 3000 });
                    await page.waitForTimeout(1000);
                } else {
                    console.log("Кнопки лечения нет.");
                }

                // 3. АТАКА
                console.log("Ищу кнопку 'Атака'...");
                const attackBtn = page.locator('button:has-text("Атака"), a:has-text("Атака"), input[value="Атака"], text="Атаковать"');
                
                if (await attackBtn.count() > 0) {
                    console.log("\x1b[32m%s\x1b[0m", "НАШЕЛ АТАКУ! Жму...");
                    await attackBtn.first().click({ timeout: 3000 }); 
                } else {
                    console.log("\x1b[31m%s\x1b[0m", "Кнопки атаки НЕТ. Пробую выйти в море...");
                    const sailBtn = page.locator('text="В море", text="Плавать", text="Выйти в море"');
                    if (await sailBtn.count() > 0) {
                        console.log("Нашел кнопку выхода в море. Жму...");
                        await sailBtn.first().click({ timeout: 3000 });
                    } else {
                        console.log("Кнопки выхода в море тоже нет.");
                    }
                }

                // Пауза
                const delay = Math.floor(Math.random() * 1500) + 1500;
                await page.waitForTimeout(delay);

            } catch (err) {
                console.log("\x1b[31m%s\x1b[0m", `Ошибка на круге: ${err.message}`);
                
                // Если ошибка, сохраняем HTML страницы, чтобы понять, что не так
                console.log("Сохраняю HTML страницы для отладки...");
                const html = await page.content();
                console.log("=== НАЧАЛО HTML ===");
                console.log(html.substring(0, 2000)); // Выводим первые 2000 символов
                console.log("=== КОНЕЦ HTML ===");
                
                await page.waitForTimeout(3000);
            }

            // Скриншот каждые 10 кругов
            if (circle % 10 === 0) {
                console.log("Делаю скриншот для проверки...");
                await page.screenshot({ path: `screenshot_${circle}.png`, fullPage: false });
            }
        }

    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "КРИТИЧЕСКАЯ ОШИБКА:", error);
        await page.screenshot({ path: 'error_screenshot.png' });
    } finally {
        await browser.close();
    }
})();
