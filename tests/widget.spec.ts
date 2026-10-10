import { test, expect } from '@playwright/test';
import {WidgetPage} from "./widget.page";

test.describe('Uchi.ru widget', () => {
  let widgetPage: WidgetPage;

  test.beforeEach(async ({page, context}) => {
    widgetPage = new WidgetPage(page);

    // на главной идёт A/B-тест редизайна, в группах b и c виджета нет - фиксируем группу a
    await context.addCookies([{name: 'ab_mainpage_redesign', value: 'a', domain: 'uchi.ru', path: '/'}]);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  test('opens', async () => {
    await expect(widgetPage.getWidgetBody()).toBeHidden();

    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });

  test('has correct title', async () => {
    await widgetPage.openWidget();

    const articles = await widgetPage.getPopularArticles();

    await articles[0].click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой');
  });
});
