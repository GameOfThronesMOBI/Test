const { chromium } = require('playwright');

(async () => {
    console.log("Запускаем бота...");
    
    // Твои данные для входа
    const LOGIN = '3BEPb';
    const PASSWORD = 'antoha5566aa';

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
    });
    const page = await context.newPage();

    const GAME_URL = 'https://game-seawar.com/sea';

    try {
        console.log("Заходим на сайт...");
        await page.goto(GAME_URL, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(5000);

        // === АВТОРИЗАЦИЯ ===
        const isLoginPage = await page.locator('input[type="password"]').count() > 0;

        if (isLoginPage) {
            console.log("Вижу форму входа. Пробую авторизоваться...");
            
            // Ищем поля по типичным именам
            const loginField = page.locator('input[name="login"], input[name="username"], input[name="nick"], input[type="text"]').first();
            const passField = page.locator('input[type="password"]').first();

            await loginField.fill(LOGIN);
            await passField.fill(PASSWORD);
            console.log("Логин и пароль введены. Ищу кнопку 'Войти'...");

            const submitBtn = page.locator('input[type="submit"], button[type="submit"], button:has-text("Войти"), input[value="Войти"]').first();
            await submitBtn.click();
            
            console.log("Ждем загрузки после входа...");
            await page.waitForTimeout(5000);
        } else {
            console.log("Формы входа нет. Возможно, мы уже внутри.");
        }

        // === НАЧИНАЕМ ИГРАТЬ ===
        let circle = 0;
        while (true) {
            circle++;
            console.log(`\n--- КРУГ №${circle} ---`);
            
            try {
                // 1. СМЕРТЬ
                const deadBtn = page.locator('text="В порт", text="Восстановить", input[value="В порт"]');
                if (await deadBtn.count() > 0) {
                    console.log("КОРАБЛЬ РАЗБИТ! Жму 'В порт'...");
                    await deadBtn.first().click({ timeout: 3000 });
                    await page.waitForTimeout(3000);
                    continue;
                }

                // 2. ЛЕЧЕНИЕ
                const healBtn = page.locator('text="Лечиться", text="Лечить", text="Ремонт"');
                if (await healBtn.count() > 0) {
                    console.log("НАШЕЛ ЛЕЧЕНИЕ! Жму...");
                    await healBtn.first().click({ timeout: 3000 });
                    await page.waitForTimeout(1000);
                }

                // 3. АТАКА
                const attackBtn = page.locator('button:has-text("Атака"), a:has-text("Атака"), input[value="Атака"], text="Атаковать"');
                
                if (await attackBtn.count() > 0) {
                    console.log("НАШЕЛ АТАКУ! Жму...");
                    await attackBtn.first().click({ timeout: 3000 }); 
                } else {
                    console.log("Кнопки атаки НЕТ. Пробую выйти в море...");
                    const sailBtn = page.locator('text="В море", text="Плавать", text="Выйти в море"');
                    if (await sailBtn.count() > 0) {
                        await sailBtn.first().click({ timeout: 3000 });
                    }
                }

                const delay = Math.floor(Math.random() * 1500) + 1500;
                await page.waitForTimeout(delay);

            } catch (err) {
                console.log(`Ошибка: ${err.message}`);
                await page.waitForTimeout(3000);
            }

            // Скриншот каждые 10 кругов
            if (circle % 10 === 0) {
                await page.screenshot({ path: `screenshot_${circle}.png` });
            }
        }

    } catch (error) {
        console.error("Критическая ошибка:", error);
        await page.screenshot({ path: 'error_screenshot.png' });
    } finally {
        await browser.close();
    }
})();
